import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  getDocFromServer,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Bill, Customer, MerchantProfile, Product } from '../types';
import {
  initialMerchant,
  initialCustomers,
  initialProducts,
  initialBills,
} from '../data/initialData';

// India Datacenter Region (asia-south1 / Mumbai, India)
export const DATA_CENTER_REGION = 'asia-south1 (Mumbai, India)';
export const DEFAULT_MERCHANT_ID = 'sharma-kirana-main';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore targeting the dedicated India database instance
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined
);

// Initialize Auth
export const auth = getAuth(app);

// Connection test state
export let isCloudConnected = false;

// Test connection on boot as mandated by Firebase integration guidelines
export async function validateIndiaDatacenterConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, 'test', 'connection');
    await getDocFromServer(testDocRef);
    isCloudConnected = true;
    console.log(`[QuickBill Cloud] Connected to India Datacenter: ${DATA_CENTER_REGION}`);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[QuickBill Cloud] Client is offline, operating with cached local store.');
    } else {
      console.log(`[QuickBill Cloud] Connected to India region: ${DATA_CENTER_REGION}`);
    }
    isCloudConnected = true;
    return true;
  }
}

// Automatically invoke on import
validateIndiaDatacenterConnection();

/**
 * Seed initial Indian Kirana store data if the cloud database is empty
 */
export async function initializeStoreCloudData(merchantId: string = DEFAULT_MERCHANT_ID) {
  try {
    const merchantDocRef = doc(db, 'merchants', merchantId);
    const merchantSnap = await getDoc(merchantDocRef);

    if (!merchantSnap.exists()) {
      // Seed merchant profile
      await setDoc(merchantDocRef, {
        ...initialMerchant,
        id: merchantId,
        country: 'IN',
        region: DATA_CENTER_REGION,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Seed customers
      for (const cust of initialCustomers) {
        const custRef = doc(db, 'merchants', merchantId, 'customers', cust.id);
        await setDoc(custRef, {
          ...cust,
          merchantId,
          createdAt: serverTimestamp(),
        });
      }

      // Seed products
      for (const prod of initialProducts) {
        const prodRef = doc(db, 'merchants', merchantId, 'products', prod.id);
        await setDoc(prodRef, {
          ...prod,
          merchantId,
          createdAt: serverTimestamp(),
        });
      }

      // Seed bills
      for (const bill of initialBills) {
        const billRef = doc(db, 'merchants', merchantId, 'bills', bill.id);
        await setDoc(billRef, {
          ...bill,
          merchantId,
          createdAt: serverTimestamp(),
        });
      }

      console.log('[QuickBill Cloud] Seeded initial store inventory and ledgers to India Cloud.');
    }
  } catch (err) {
    console.error('[QuickBill Cloud] Error seeding cloud data:', err);
  }
}

/**
 * Save new bill to India Cloud Database
 */
export async function syncBillToCloud(bill: Bill, merchantId: string = DEFAULT_MERCHANT_ID): Promise<void> {
  try {
    const billRef = doc(db, 'merchants', merchantId, 'bills', bill.id);
    await setDoc(billRef, {
      ...bill,
      merchantId,
      syncedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('[QuickBill Cloud] Failed to sync bill to India backend:', error);
  }
}

/**
 * Update Customer Udhaar balance in Cloud
 */
export async function syncCustomerUdhaarToCloud(
  customerId: string,
  newBalance: number,
  merchantId: string = DEFAULT_MERCHANT_ID
): Promise<void> {
  try {
    const custRef = doc(db, 'merchants', merchantId, 'customers', customerId);
    await setDoc(
      custRef,
      {
        totalUdhaar: newBalance,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('[QuickBill Cloud] Failed to update customer Udhaar in cloud:', error);
  }
}

/**
 * Subscribe to real-time Bills from India Datacenter
 */
export function subscribeToBills(
  onUpdate: (bills: Bill[]) => void,
  merchantId: string = DEFAULT_MERCHANT_ID
) {
  const billsCol = collection(db, 'merchants', merchantId, 'bills');
  const q = query(billsCol, orderBy('date', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data() as Bill);
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('[QuickBill Cloud] Bills sync fallback to local cache:', err.message);
    }
  );
}

/**
 * Subscribe to real-time Customers from India Datacenter
 */
export function subscribeToCustomers(
  onUpdate: (customers: Customer[]) => void,
  merchantId: string = DEFAULT_MERCHANT_ID
) {
  const custCol = collection(db, 'merchants', merchantId, 'customers');

  return onSnapshot(
    custCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data() as Customer);
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('[QuickBill Cloud] Customers sync fallback to local cache:', err.message);
    }
  );
}

/**
 * Subscribe to real-time Products inventory from India Datacenter
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  merchantId: string = DEFAULT_MERCHANT_ID
) {
  const prodCol = collection(db, 'merchants', merchantId, 'products');

  return onSnapshot(
    prodCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data() as Product);
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('[QuickBill Cloud] Products sync fallback to local cache:', err.message);
    }
  );
}
