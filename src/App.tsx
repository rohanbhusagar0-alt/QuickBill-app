import React, { useState, useEffect } from 'react';
import {
  AppScreen,
  Bill,
  BillItem,
  Customer,
  MerchantProfile,
  Product,
} from './types';
import {
  initialMerchant,
  initialProducts,
  initialCustomers,
  initialBills,
} from './data/initialData';
import {
  initializeStoreCloudData,
  syncBillWithLedgerBatch,
  syncCustomerUdhaarToCloud,
  syncStoreProfileToCloud,
  syncProductToCloud,
  syncCustomerToCloud,
  subscribeToBills,
  subscribeToCustomers,
  subscribeToProducts,
  subscribeToSyncStatus,
  getStoreMerchantId,
  auth,
  CloudSyncStatus,
  DATA_CENTER_REGION,
} from './services/firebase';

// Component Screens
import { WelcomeScreen } from './components/WelcomeScreen';
import { FeatureShowcaseScreen } from './components/FeatureShowcaseScreen';
import { MerchantLoginScreen } from './components/MerchantLoginScreen';
import { OtpVerificationScreen } from './components/OtpVerificationScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { CreateBillScreen } from './components/CreateBillScreen';
import { VoiceBillingScreen } from './components/VoiceBillingScreen';
import { BarcodeScannerScreen } from './components/BarcodeScannerScreen';
import { InwardBillScannerScreen } from './components/InwardBillScannerScreen';
import { KhataBookScreen } from './components/KhataBookScreen';
import { CustomerLedgerDetail } from './components/CustomerLedgerDetail';
import { UdhaarAiRecoveryScreen } from './components/UdhaarAiRecoveryScreen';
import { InventoryStockScreen } from './components/InventoryStockScreen';
import { InventoryExpiryScreen } from './components/InventoryExpiryScreen';
import { ExpiryClearanceOfferScreen } from './components/ExpiryClearanceOfferScreen';
import { GallaHisabScreen } from './components/GallaHisabScreen';
import { SmartSoundboxScreen } from './components/SmartSoundboxScreen';
import { DigitalDukanScreen } from './components/DigitalDukanScreen';
import { ThermalPrinterDesignerScreen } from './components/ThermalPrinterDesignerScreen';
import { ReportsGstScreen } from './components/ReportsGstScreen';
import { MandiRatesScreen } from './components/MandiRatesScreen';
import { SupplierKhataScreen } from './components/SupplierKhataScreen';
import { GodownTransferScreen } from './components/GodownTransferScreen';
import { StaffManagementScreen } from './components/StaffManagementScreen';
import { LoyaltyRewardsScreen } from './components/LoyaltyRewardsScreen';
import { ProSubscriptionScreen } from './components/ProSubscriptionScreen';
import { SplashScreen } from './components/SplashScreen';
import { VyaparInstantLoanScreen } from './components/VyaparInstantLoanScreen';
import { BankSettlementPayoutsScreen } from './components/BankSettlementPayoutsScreen';
import { GstEwayBillScreen } from './components/GstEwayBillScreen';
import { StoreProfileSetupScreen } from './components/StoreProfileSetupScreen';
import { StoreSetupModal } from './components/StoreSetupModal';

// Navigation & Icons
import {
  Home,
  Receipt,
  Mic,
  BookOpen,
  Boxes,
  Compass,
  Layers,
  Globe2,
  LayoutGrid,
  BarChart3,
  Sparkles,
  Plus,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';

function QuickBillApp() {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  
  // Real authentication session check
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('quickbill_session') === 'true';
  });

  // If user is not logged in, start at Splash screen
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    return localStorage.getItem('quickbill_session') === 'true' ? 'home_dashboard' : 'splash';
  });
  
  // Clean store merchant profile - starts empty for real users until configured
  const [merchant, setMerchant] = useState<MerchantProfile>(() => {
    const saved = localStorage.getItem('quickbill_merchant');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      name: '',
      phone: '',
      shopName: '',
      shopCategory: 'Kirana & FMCG Grocery',
      address: '',
      upiId: '',
      isPro: false,
    };
  });

  const [showStoreSetupModal, setShowStoreSetupModal] = useState(false);
  
  // Products start empty for fresh real store unless sample data is requested
  const [products, setProducts] = useState<Product[]>(() => {
    const hasData = localStorage.getItem('quickbill_has_data') === 'true';
    return hasData ? initialProducts : [];
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const hasData = localStorage.getItem('quickbill_has_data') === 'true';
    return hasData ? initialCustomers : [];
  });
  const [bills, setBills] = useState<Bill[]>(() => {
    const hasData = localStorage.getItem('quickbill_has_data') === 'true';
    return hasData ? initialBills : [];
  });
  const [showLangModal, setShowLangModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('online_synced');
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const isFreshStore = bills.length === 0 && products.length === 0;

  // Active isolated merchant identifier (Unique per store/phone/auth user)
  const activeMerchantId = getStoreMerchantId(merchant.phone, auth.currentUser?.uid);

  // Update merchant profile with local persistence & Cloud Firestore sync
  const handleUpdateMerchant = (updated: Partial<MerchantProfile>) => {
    setMerchant((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('quickbill_merchant', JSON.stringify(next));
      } catch {}
      // Sync store profile to India Cloud Datacenter
      syncStoreProfileToCloud(activeMerchantId, next);
      return next;
    });
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('quickbill_session', 'true');
    setCurrentScreen('home_dashboard');
    if (!merchant.shopName) {
      setShowStoreSetupModal(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quickbill_session');
    setIsLoggedIn(false);
    setCurrentScreen('merchant_login');
  };

  // Clear demo mock data and start a real fresh production store
  const handleClearDemoData = () => {
    localStorage.removeItem('quickbill_has_data');
    setBills([]);
    setCustomers([]);
    setProducts([]);
  };

  // Restore sample Kirana store catalog for demo/testing
  const handleRestoreDemoData = () => {
    localStorage.setItem('quickbill_has_data', 'true');
    setBills(initialBills);
    setCustomers(initialCustomers);
    setProducts(initialProducts);
    setMerchant((prev) => ({
      ...prev,
      shopName: prev.shopName || 'Shree Ganesh Kirana Store',
      name: prev.name || 'Dukan Malik',
    }));
  };

  // Cross-screen state communication
  const [voiceParsedCart, setVoiceParsedCart] = useState<BillItem[] | undefined>(undefined);
  const [scannedProductToAdd, setScannedProductToAdd] = useState<Product | undefined>(undefined);
  const [selectedCustomerForLedger, setSelectedCustomerForLedger] = useState<Customer>(initialCustomers[0]);
  const [selectedOfferProduct, setSelectedOfferProduct] = useState<Product | undefined>(undefined);
  const [showScreenDrawer, setShowScreenDrawer] = useState(false);

  // Sync with India Cloud Firestore Datacenter (asia-south1)
  useEffect(() => {
    const isDemo = localStorage.getItem('quickbill_has_data') === 'true';
    initializeStoreCloudData(activeMerchantId, isDemo);

    const unsubSync = subscribeToSyncStatus((st) => {
      setSyncStatus(st);
    });

    const unsubBills = subscribeToBills((cloudBills) => {
      if (cloudBills && cloudBills.length) {
        setBills(cloudBills);
      }
    }, activeMerchantId);

    const unsubCustomers = subscribeToCustomers((cloudCustomers) => {
      if (cloudCustomers && cloudCustomers.length) {
        setCustomers(cloudCustomers);
      }
    }, activeMerchantId);

    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length) {
        setProducts(cloudProducts);
      }
    }, activeMerchantId);

    return () => {
      unsubSync();
      unsubBills();
      unsubCustomers();
      unsubProducts();
    };
  }, [activeMerchantId]);

  // Authentication Flow Handlers
  const handleSelectLanguage = (lang: 'hi' | 'en' | 'gu' | 'mr') => {
    setMerchant((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  const handleMobileSubmit = (mobile: string) => {
    setMerchant((prev) => ({ ...prev, phone: mobile }));
    setCurrentScreen('otp_verification');
  };

  const handleOtpVerified = () => {
    setCurrentScreen('home_dashboard');
  };

  // Business Action Handlers with Atomic Batch Persistence & Real-time Stock Deduction
  const handleSaveBill = (newBill: Bill) => {
    setBills((prev) => [newBill, ...prev]);

    // Atomic write to Firestore with automatic real-time product stock deduction
    if ((newBill.paymentMode === 'UDHAAR' || newBill.paymentMode === 'SPLIT') && newBill.customerId) {
      const udhaarAmt = newBill.udhaarAmount || newBill.grandTotal;
      const targetCustomer = customers.find((c) => c.id === newBill.customerId);
      const newBal = (targetCustomer?.totalUdhaar || 0) + udhaarAmt;

      syncBillWithLedgerBatch(
        newBill,
        {
          customerId: newBill.customerId,
          newBalance: newBal,
          debitAmount: udhaarAmt,
        },
        activeMerchantId,
        newBill.items
      );

      setCustomers((prev) =>
        prev.map((c) => (c.id === newBill.customerId ? { ...c, totalUdhaar: newBal } : c))
      );
    } else {
      syncBillWithLedgerBatch(newBill, undefined, activeMerchantId, newBill.items);
    }

    // Immediately deduct stock quantities in local state for instantaneous UI responsiveness
    setProducts((prev) =>
      prev.map((p) => {
        const item = newBill.items.find((it) => it.productId === p.id);
        if (item) {
          return { ...p, stockQty: Math.max(0, p.stockQty - item.qty) };
        }
        return p;
      })
    );
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    syncCustomerToCloud(newCustomer, activeMerchantId);
  };

  const handleUpdateCustomerUdhaar = (customerId: string, newBalance: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, totalUdhaar: newBalance } : c))
    );
    // Asynchronously sync customer balance to India cloud backend
    syncCustomerUdhaarToCloud(customerId, newBalance, activeMerchantId);
  };

  const handleAddNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    syncProductToCloud(newProduct, activeMerchantId);
  };

  const handleUpdateProductsStock = (
    updates: { productId: string; addedStock: number; newPurchasePrice?: number }[]
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        const u = updates.find((item) => item.productId === p.id);
        if (u) {
          return {
            ...p,
            stockQty: p.stockQty + u.addedStock,
            purchasePrice: u.newPurchasePrice ?? p.purchasePrice,
          };
        }
        return p;
      })
    );
  };

  const handleTransferStock = (
    productId: string,
    qty: number,
    direction: 'GODOWN_TO_SHOP' | 'SHOP_TO_GODOWN'
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        if (direction === 'GODOWN_TO_SHOP') {
          return {
            ...p,
            godownStock: Math.max(0, (p.godownStock || 0) - qty),
            stockQty: p.stockQty + qty,
          };
        } else {
          return {
            ...p,
            stockQty: Math.max(0, p.stockQty - qty),
            godownStock: (p.godownStock || 0) + qty,
          };
        }
      })
    );
  };

  // Determine whether to display the Bottom Navigation Bar
  const isPostAuthScreen =
    currentScreen !== 'welcome' &&
    currentScreen !== 'feature_showcase' &&
    currentScreen !== 'merchant_login' &&
    currentScreen !== 'otp_verification' &&
    currentScreen !== 'splash';

  // Navigation Items matching original QuickBill UI: Home, Khata, New Bill (+), Reports, Pro AI
  const navItems = [
    { screen: 'home_dashboard' as AppScreen, label: t('home', 'Home'), icon: LayoutGrid },
    { screen: 'khata_book' as AppScreen, label: t('khata', 'Khata'), icon: BookOpen, badge: '3' },
    { screen: 'create_bill' as AppScreen, label: t('new_bill', 'New Bill'), icon: Plus, isAction: true },
    { screen: 'reports_gst' as AppScreen, label: t('reports', 'Reports'), icon: BarChart3 },
    { screen: 'pro_subscription' as AppScreen, label: t('pro_ai', 'Pro AI'), icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans relative antialiased">
      {/* Top Demo Screen Quick Switcher Ribbon - Only active when Developer Mode is enabled in settings */}
      {devModeEnabled && isPostAuthScreen && (
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-3 py-1.5 flex items-center justify-between text-[11px] z-40 sticky top-0 backdrop-blur-md bg-surface-container-lowest/90">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-bold text-on-surface tracking-wide">QuickBill AI Vyapar</span>
            {/* Live Cloud Sync Pill */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                syncStatus === 'online_synced'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-200 text-slate-800 border border-slate-300'
              }`}
              title={`Firebase Datacenter: ${DATA_CENTER_REGION}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  syncStatus === 'online_synced'
                    ? 'bg-emerald-600'
                    : syncStatus === 'syncing'
                    ? 'bg-amber-600 animate-spin'
                    : 'bg-slate-500'
                }`}
              />
              {syncStatus === 'online_synced'
                ? '🇮🇳 Mumbai Cloud Synced'
                : syncStatus === 'syncing'
                ? 'Syncing...'
                : 'Offline (Saved Locally)'}
            </span>
            <span className="hidden sm:inline text-on-surface-variant text-[10px]">
              • {merchant.shopName || 'Store'}
            </span>
          </div>

          {/* Jump-to-screen selector and Language Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLangModal(true)}
              className="bg-surface-container-high hover:bg-surface-container text-on-surface border border-outline-variant/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title={t('change_language_title', 'Change App Language')}
            >
              <Globe2 className="w-3.5 h-3.5 text-primary" />
              <span>{supportedLanguages.find((l) => l.code === language)?.native || 'हिन्दी'}</span>
              <span className="text-[9px] text-primary">▼</span>
            </button>

            <button
              onClick={() => setShowScreenDrawer(!showScreenDrawer)}
              className="bg-surface-container-high hover:bg-surface-container text-primary border border-outline-variant/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('screen_menu', 'स्क्रीन मेन्यू')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen Selection Dropdown Drawer */}
      {showScreenDrawer && (
        <div className="bg-surface-container-lowest border-b border-outline-variant/30 p-3 z-40 shadow-xl max-h-72 overflow-y-auto">
          <div className="text-xs font-bold text-on-surface-variant mb-2 px-1 flex items-center justify-between">
            <span>{t('quick_screen_nav', 'क्विक स्क्रीन नेविगेशन (Select screen directly):')}</span>
            <span className="text-[10px] text-primary font-bold">31 {t('screens_available', 'Screens')}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 text-xs">
            {[
              { id: 'splash', name: '1. App Splash Launch' },
              { id: 'welcome', name: '2. Welcome & Lang' },
              { id: 'feature_showcase', name: '3. Features Walkthrough' },
              { id: 'merchant_login', name: '4. Merchant Login' },
              { id: 'otp_verification', name: '5. OTP Auto-Fill' },
              { id: 'home_dashboard', name: '6. Home Dashboard' },
              { id: 'store_profile', name: '7. Store Profile Setup' },
              { id: 'create_bill', name: '8. POS Billing Machine' },
              { id: 'voice_billing', name: '9. AI Voice Billing' },
              { id: 'barcode_scanner', name: '10. Barcode & Sticker' },
              { id: 'inward_bill_scanner', name: '11. Wholesaler Parchi AI' },
              { id: 'khata_book', name: '12. Khata / Udhaar Book' },
              { id: 'customer_ledger', name: '13. Customer Statement' },
              { id: 'udhaar_ai_recovery', name: '14. Udhaar AI WhatsApp' },
              { id: 'inventory_stock', name: '15. Stock & Inventory' },
              { id: 'inventory_expiry', name: '16. Expiry Alert Tracker' },
              { id: 'expiry_clearance_offer', name: '17. Clearance Flash Sale' },
              { id: 'galla_hisab', name: '18. Galla Day-End Cash' },
              { id: 'bank_settlement', name: '19. Bank Settlement & Payout' },
              { id: 'vyapar_loan', name: '20. Vyapar Loan & Score' },
              { id: 'smart_soundbox', name: '21. Soundbox Audio 4G' },
              { id: 'digital_dukan', name: '22. Digital Online Dukan' },
              { id: 'thermal_printer_designer', name: '23. Thermal Printer 58mm' },
              { id: 'gst_eway_bill', name: '24. GST e-Way Bill & ITC' },
              { id: 'reports_gst', name: '25. Reports & GSTR-1' },
              { id: 'mandi_rates', name: '26. Live Mandi Rates' },
              { id: 'supplier_khata', name: '27. Supplier Khata & PO' },
              { id: 'godown_transfer', name: '28. Godown Stock Shift' },
              { id: 'staff_management', name: '29. Staff PIN & Roles' },
              { id: 'loyalty_rewards', name: '30. Customer Rewards' },
              { id: 'pro_subscription', name: '31. QuickBill Pro Plan' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentScreen(s.id as AppScreen);
                  setShowScreenDrawer(false);
                }}
                className={`p-2 rounded-xl text-left truncate transition-colors cursor-pointer border ${
                  currentScreen === s.id
                    ? 'bg-primary text-white font-bold border-primary shadow-xs'
                    : 'bg-surface hover:bg-surface-container border-outline-variant/30 text-on-surface hover:text-primary font-medium'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Screen Viewport */}
      <main className="flex-1 w-full flex flex-col">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onNavigate={setCurrentScreen}
            currentLanguage={language}
            onLanguageChange={(lang) => {
              setLanguage(lang);
              setMerchant((prev) => ({ ...prev, language: lang, preferredLanguage: lang as any }));
            }}
          />
        )}

        {currentScreen === 'feature_showcase' && (
          <FeatureShowcaseScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'merchant_login' && (
          <MerchantLoginScreen
            onNavigate={setCurrentScreen}
            merchant={merchant}
            onUpdateMerchant={handleUpdateMerchant}
            onSetEnteredPhone={(ph) => handleUpdateMerchant({ phone: ph })}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentScreen === 'otp_verification' && (
          <OtpVerificationScreen
            onNavigate={setCurrentScreen}
            phone={merchant.phone || ''}
            onOtpSuccess={handleAuthSuccess}
          />
        )}

        {currentScreen === 'home_dashboard' && (
          <HomeDashboard
            merchant={merchant}
            bills={bills}
            customers={customers}
            products={products}
            onNavigate={setCurrentScreen}
            onOpenStoreSetup={() => setShowStoreSetupModal(true)}
            isFreshStore={isFreshStore}
          />
        )}

        {currentScreen === 'create_bill' && (
          <CreateBillScreen
            merchant={merchant}
            products={products}
            customers={customers}
            onNavigate={setCurrentScreen}
            onSaveBill={handleSaveBill}
            voicePrefilledItems={voiceParsedCart}
            scannedProduct={scannedProductToAdd}
          />
        )}

        {currentScreen === 'voice_billing' && (
          <VoiceBillingScreen
            products={products}
            onNavigate={setCurrentScreen}
            onSetCartFromVoice={(items) => {
              setVoiceParsedCart(items);
            }}
          />
        )}

        {currentScreen === 'barcode_scanner' && (
          <BarcodeScannerScreen
            products={products}
            onNavigate={setCurrentScreen}
            onScannedProductFound={(prod) => {
              setScannedProductToAdd(prod);
            }}
          />
        )}

        {currentScreen === 'inward_bill_scanner' && (
          <InwardBillScannerScreen
            onNavigate={setCurrentScreen}
            onUpdateProductsStock={handleUpdateProductsStock}
          />
        )}

        {currentScreen === 'khata_book' && (
          <KhataBookScreen
            customers={customers}
            onNavigate={setCurrentScreen}
            onSelectCustomer={(cust) => setSelectedCustomerForLedger(cust)}
            onAddNewCustomer={handleAddCustomer}
          />
        )}

        {currentScreen === 'customer_ledger' && (
          <CustomerLedgerDetail
            customer={selectedCustomerForLedger}
            merchant={merchant}
            onNavigate={setCurrentScreen}
            onUpdateCustomerUdhaar={handleUpdateCustomerUdhaar}
          />
        )}

        {currentScreen === 'udhaar_ai_recovery' && (
          <UdhaarAiRecoveryScreen
            customers={customers}
            merchant={merchant}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'inventory_stock' && (
          <InventoryStockScreen
            products={products}
            onNavigate={setCurrentScreen}
            onAddNewProduct={handleAddNewProduct}
          />
        )}

        {currentScreen === 'inventory_expiry' && (
          <InventoryExpiryScreen
            products={products}
            onNavigate={setCurrentScreen}
            onSelectProductForOffer={(prod) => setSelectedOfferProduct(prod)}
          />
        )}

        {currentScreen === 'expiry_clearance_offer' && (
          <ExpiryClearanceOfferScreen
            products={products}
            merchant={merchant}
            onNavigate={setCurrentScreen}
            selectedProduct={selectedOfferProduct}
          />
        )}

        {currentScreen === 'galla_hisab' && (
          <GallaHisabScreen
            bills={bills}
            merchant={merchant}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'smart_soundbox' && (
          <SmartSoundboxScreen merchant={merchant} onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'digital_dukan' && (
          <DigitalDukanScreen
            products={products}
            merchant={merchant}
            onNavigate={setCurrentScreen}
            onToggleOnlineAvailable={(pId) => {
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === pId ? { ...p, isOnlineAvailable: !p.isOnlineAvailable } : p
                )
              );
            }}
          />
        )}

        {currentScreen === 'thermal_printer_designer' && (
          <ThermalPrinterDesignerScreen
            merchant={merchant}
            onNavigate={setCurrentScreen}
            onUpdateMerchant={setMerchant}
          />
        )}

        {currentScreen === 'reports_gst' && (
          <ReportsGstScreen bills={bills} onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'mandi_rates' && <MandiRatesScreen onNavigate={setCurrentScreen} />}

        {currentScreen === 'supplier_khata' && (
          <SupplierKhataScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'godown_transfer' && (
          <GodownTransferScreen
            products={products}
            onNavigate={setCurrentScreen}
            onTransferStock={handleTransferStock}
          />
        )}

        {currentScreen === 'staff_management' && (
          <StaffManagementScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'loyalty_rewards' && (
          <LoyaltyRewardsScreen customers={customers} merchant={merchant} onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'splash' && (
          <SplashScreen
            onNavigate={setCurrentScreen}
            shopName={merchant.shopName}
            isLoggedIn={isLoggedIn}
          />
        )}

        {currentScreen === 'store_profile' && (
          <StoreProfileSetupScreen
            merchant={merchant}
            onNavigate={setCurrentScreen}
            onUpdateMerchant={handleUpdateMerchant}
            onClearDemoData={handleClearDemoData}
            onRestoreDemoData={handleRestoreDemoData}
            devModeEnabled={devModeEnabled}
            onToggleDevMode={() => setDevModeEnabled(!devModeEnabled)}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'vyapar_loan' && (
          <VyaparInstantLoanScreen
            onNavigate={setCurrentScreen}
            shopName={merchant.shopName}
          />
        )}

        {currentScreen === 'bank_settlement' && (
          <BankSettlementPayoutsScreen
            onNavigate={setCurrentScreen}
            shopName={merchant.shopName}
            todaySales={18450}
          />
        )}

        {currentScreen === 'gst_eway_bill' && (
          <GstEwayBillScreen
            onNavigate={setCurrentScreen}
            shopName={merchant.shopName}
            gstin={merchant.gstin}
          />
        )}

        {currentScreen === 'pro_subscription' && (
          <ProSubscriptionScreen onNavigate={setCurrentScreen} />
        )}
      </main>

      {/* Floating Bottom Navigation Bar for Authenticated Screens */}
      {isPostAuthScreen && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 py-1.5 px-3 z-30 shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.screen;
              const isAction = item.isAction;
              return (
                <button
                  key={item.screen}
                  onClick={() => setCurrentScreen(item.screen)}
                  className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer relative ${
                    isAction
                      ? '-mt-6 bg-[#047857] hover:bg-[#065f46] text-white p-3.5 rounded-full shadow-lg active:scale-95'
                      : isActive
                      ? 'text-emerald-700 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`${isAction ? 'w-6 h-6 stroke-[2.5]' : 'w-5 h-5'}`} />
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-0.5 ${isAction ? 'font-bold' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Global Regional Language Selector Modal */}
      <LanguageSelectorModal isOpen={showLangModal} onClose={() => setShowLangModal(false)} />

      {/* Real Store Onboarding & Setup Modal */}
      <StoreSetupModal
        isOpen={showStoreSetupModal}
        onClose={() => setShowStoreSetupModal(false)}
        merchant={merchant}
        onSaveMerchant={handleUpdateMerchant}
        onStartFreshStore={handleClearDemoData}
        onRestoreDemoData={handleRestoreDemoData}
        isFreshStore={isFreshStore}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider initialLanguage="hi">
      <QuickBillApp />
    </LanguageProvider>
  );
}
