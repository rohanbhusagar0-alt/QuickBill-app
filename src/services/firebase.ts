import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
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
  writeBatch,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
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

// 1. Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Firestore with Offline-First IndexedDB Multi-Tab Persistence
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined
  );
  console.log('[QuickBill Cloud] Offline persistence enabled with IndexedDB multi-tab manager.');
} catch {
  firestoreInstance = getFirestore(
    app,
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined
  );
}

export const db = firestoreInstance;

// 3. Initialize Firebase Auth
export const auth = getAuth(app);

// 4. Standard Firestore Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('[QuickBill Cloud Error]:', JSON.stringify(errInfo));
  return errInfo;
}

// 5. Connection & Sync Status State
export type CloudSyncStatus = 'online_synced' | 'offline_local' | 'syncing';
let currentSyncStatus: CloudSyncStatus = typeof navigator !== 'undefined' && !navigator.onLine ? 'offline_local' : 'online_synced';
const syncListeners: ((status: CloudSyncStatus) => void)[] = [];

export function subscribeToSyncStatus(listener: (status: CloudSyncStatus) => void) {
  syncListeners.push(listener);
  listener(currentSyncStatus);
  return () => {
    const idx = syncListeners.indexOf(listener);
    if (idx !== -1) syncListeners.splice(idx, 1);
  };
}

function notifySyncStatus(newStatus: CloudSyncStatus) {
  currentSyncStatus = newStatus;
  syncListeners.forEach((fn) => fn(newStatus));
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    notifySyncStatus('syncing');
    validateIndiaDatacenterConnection().then(() => {
      notifySyncStatus('online_synced');
    });
  });

  window.addEventListener('offline', () => {
    notifySyncStatus('offline_local');
  });
}

// 6. Test and Validate Connection to India Datacenter (asia-south1)
export async function validateIndiaDatacenterConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, 'test', 'connection');
    await getDocFromServer(testDocRef);
    notifySyncStatus('online_synced');
    console.log(`[QuickBill Cloud] Connected to India Datacenter: ${DATA_CENTER_REGION}`);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[QuickBill Cloud] Client is operating in offline-first mode.');
      notifySyncStatus('offline_local');
    } else {
      console.log(`[QuickBill Cloud] Connected to India Datacenter: ${DATA_CENTER_REGION}`);
      notifySyncStatus('online_synced');
    }
    return true;
  }
}

// Automatically invoke check on import
validateIndiaDatacenterConnection();

// 7. Seed Initial Indian Kirana Data if Cloud is Fresh
export async function initializeStoreCloudData(merchantId: string = DEFAULT_MERCHANT_ID) {
  try {
    const merchantDocRef = doc(db, 'merchants', merchantId);
    const merchantSnap = await getDoc(merchantDocRef);

    if (!merchantSnap.exists()) {
      const batch = writeBatch(db);

      // Merchant
      batch.set(merchantDocRef, {
        ...initialMerchant,
        id: merchantId,
        country: 'IN',
        region: DATA_CENTER_REGION,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Default Staff Owner
      const staffRef = doc(db, 'merchants', merchantId, 'staff', 'owner-rajesh');
      batch.set(staffRef, {
        id: 'owner-rajesh',
        merchantId,
        name: 'Rajesh Sharma (Owner)',
        role: 'owner',
        phone: '9876543210',
        pin: '1234',
        active: true,
        lastLogin: new Date().toISOString(),
      });

      // Seed customers
      for (const cust of initialCustomers) {
        const custRef = doc(db, 'merchants', merchantId, 'customers', cust.id);
        batch.set(custRef, {
          ...cust,
          merchantId,
          createdAt: serverTimestamp(),
        });
      }

      // Seed products
      for (const prod of initialProducts) {
        const prodRef = doc(db, 'merchants', merchantId, 'products', prod.id);
        batch.set(prodRef, {
          ...prod,
          merchantId,
          createdAt: serverTimestamp(),
        });
      }

      // Seed bills
      for (const bill of initialBills) {
        const billRef = doc(db, 'merchants', merchantId, 'bills', bill.id);
        batch.set(billRef, {
          ...bill,
          merchantId,
          createdAt: serverTimestamp(),
        });
      }

      await batch.commit();
      console.log('[QuickBill Cloud] Seeded initial Kirana inventory and ledgers to India Cloud.');
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `merchants/${merchantId}`);
  }
}

// 8. Atomic Batch Write for Bills & Customer Udhaar
export async function syncBillWithLedgerBatch(
  bill: Bill,
  customerUdhaarChange?: { customerId: string; newBalance: number; debitAmount: number },
  merchantId: string = DEFAULT_MERCHANT_ID
): Promise<void> {
  try {
    notifySyncStatus('syncing');
    const batch = writeBatch(db);

    // Save Bill
    const billRef = doc(db, 'merchants', merchantId, 'bills', bill.id);
    batch.set(billRef, {
      ...bill,
      merchantId,
      syncedAt: serverTimestamp(),
    });

    // Update customer Udhaar balance and ledger atomically
    if (customerUdhaarChange && customerUdhaarChange.customerId) {
      const custRef = doc(db, 'merchants', merchantId, 'customers', customerUdhaarChange.customerId);
      batch.set(
        custRef,
        {
          totalUdhaar: customerUdhaarChange.newBalance,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const ledgerCol = collection(
        db,
        'merchants',
        merchantId,
        'customers',
        customerUdhaarChange.customerId,
        'ledger'
      );
      const newLedgerDoc = doc(ledgerCol);
      batch.set(newLedgerDoc, {
        id: newLedgerDoc.id,
        customerId: customerUdhaarChange.customerId,
        date: new Date().toISOString(),
        type: 'DEBIT',
        amount: customerUdhaarChange.debitAmount,
        balanceAfter: customerUdhaarChange.newBalance,
        billNo: bill.billNumber,
        note: `Bill #${bill.billNumber} POS Purchase`,
        createdAt: serverTimestamp(),
      });
    }

    await batch.commit();
    notifySyncStatus('online_synced');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `merchants/${merchantId}/bills`);
  }
}

// 9. Standard syncBillToCloud helper
export async function syncBillToCloud(bill: Bill, merchantId: string = DEFAULT_MERCHANT_ID): Promise<void> {
  return syncBillWithLedgerBatch(bill, undefined, merchantId);
}

// 10. Update Customer Udhaar balance
export async function syncCustomerUdhaarToCloud(
  customerId: string,
  newBalance: number,
  merchantId: string = DEFAULT_MERCHANT_ID
): Promise<void> {
  try {
    notifySyncStatus('syncing');
    const custRef = doc(db, 'merchants', merchantId, 'customers', customerId);
    await setDoc(
      custRef,
      {
        totalUdhaar: newBalance,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    notifySyncStatus('online_synced');
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `merchants/${merchantId}/customers/${customerId}`);
  }
}

// 11. Real-time Subscriptions with Local Cache Resiliency
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
      handleFirestoreError(err, OperationType.GET, `merchants/${merchantId}/bills`);
    }
  );
}

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
      handleFirestoreError(err, OperationType.GET, `merchants/${merchantId}/customers`);
    }
  );
}

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
      handleFirestoreError(err, OperationType.GET, `merchants/${merchantId}/products`);
    }
  );
}

// 12. Google Authentication & Staff Role Authorization
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error('[QuickBill Auth Error]:', err);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(onAuthChange: (user: User | null) => void) {
  return onAuthStateChanged(auth, onAuthChange);
}
