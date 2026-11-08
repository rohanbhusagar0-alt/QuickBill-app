export type AppScreen =
  | 'welcome'
  | 'feature_showcase'
  | 'merchant_login'
  | 'otp_verification'
  | 'home_dashboard'
  | 'create_bill'
  | 'voice_billing'
  | 'barcode_scanner'
  | 'inward_bill_scanner'
  | 'khata_book'
  | 'customer_ledger'
  | 'udhaar_ai_recovery'
  | 'inventory_stock'
  | 'inventory_expiry'
  | 'expiry_clearance_offer'
  | 'supplier_khata'
  | 'godown_transfer'
  | 'digital_dukan'
  | 'reports_gst'
  | 'galla_hisab'
  | 'mandi_rates'
  | 'smart_soundbox'
  | 'loyalty_rewards'
  | 'staff_management'
  | 'thermal_printer_designer'
  | 'pro_subscription'
  | 'splash'
  | 'vyapar_loan'
  | 'bank_settlement'
  | 'gst_eway_bill'
  | 'store_profile';

export type Language =
  | 'en'
  | 'hi'
  | 'hinglish'
  | 'bn'
  | 'mr'
  | 'te'
  | 'ta'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or';

export interface MerchantProfile {
  name: string;
  phone: string;
  shopName: string;
  shopCategory: string;
  address: string;
  gstin?: string;
  fssai?: string;
  upiId: string;
  language?: Language;
  preferredLanguage?: string;
  logoUrl?: string;
  avatarUrl?: string;
  isPro: boolean;
  billFooterNote?: string;
}

export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  barcode: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  stockQty: number;
  unit: 'kg' | 'gm' | 'litre' | 'ml' | 'packet' | 'piece' | 'box' | 'bag' | string;
  minStockAlert: number;
  expiryDate: string; // YYYY-MM-DD
  hsnCode: string;
  gstRate: number; // 0, 5, 12, 18
  imageUrl?: string;
  godownStock?: number;
  isOnlineAvailable?: boolean;
}

export interface BillItem {
  productId: string;
  name: string;
  nameHindi?: string;
  qty: number;
  unit: string;
  price: number;
  mrp: number;
  discountPercent: number;
  gstRate: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  date: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  totalGst: number;
  roundOff: number;
  grandTotal: number;
  paymentMode: 'CASH' | 'UPI' | 'UDHAAR' | 'SPLIT';
  cashAmount?: number;
  upiAmount?: number;
  udhaarAmount?: number;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
  cashierName?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalUdhaar: number; // Positive means customer owes shopkeeper (Maine Lena Hai)
  creditLimit: number;
  loyaltyPoints: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  paymentPromiseDate?: string;
  avatarUrl?: string;
}

export interface KhataTransaction {
  id: string;
  customerId: string;
  date: string;
  type: 'DIYA' | 'LIYA'; // DIYA = You gave goods/money, LIYA = You received payment
  amount: number;
  description: string;
  billNumber?: string;
  paymentMode?: 'CASH' | 'UPI' | 'BANK';
}

export interface Supplier {
  id: string;
  name: string;
  agencyName?: string;
  companyName?: string;
  contactPerson?: string;
  brandSupplied?: string;
  phone: string;
  pendingPayment: number;
  totalPayable: number;
  category?: string;
  gstin?: string;
}

export interface MandiRate {
  commodity: string;
  variety?: string;
  market?: string;
  localMandi?: string;
  todayRate: number;
  currentRate?: number;
  previousRate?: number;
  unit: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  change?: string;
  retailAvgRate?: number;
  arbitrageOpp?: number;
  bestMandi?: string;
  bestRate?: number;
}

export type MandiItem = MandiRate;

export interface SoundboxTransaction {
  id: string;
  amount: number;
  payerName: string;
  timestamp: string;
  utrNumber: string;
  spokenTextHindi: string;
}

export interface StaffUser {
  id: string;
  name: string;
  phone: string;
  role: 'OWNER' | 'CASHIER' | 'SALESMAN' | 'STORE_MANAGER' | 'DELIVERY_BOY' | 'MANAGER' | string;
  pin: string;
  permissions: {
    canCreateBill?: boolean;
    canBill?: boolean;
    canViewPurchasePrice?: boolean;
    canViewProfit?: boolean;
    canGiveDiscount?: boolean;
    canEditStock?: boolean;
    canDeleteBill?: boolean;
    canViewKhata?: boolean;
    canManageKhata?: boolean;
    canManageInventory?: boolean;
    canViewReports?: boolean;
  };
  isActive: boolean;
}

export type StaffMember = StaffUser;
