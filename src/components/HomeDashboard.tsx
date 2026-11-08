import React, { useState } from 'react';
import { AppScreen, Bill, Customer, MerchantProfile, Product } from '../types';
import { speakSoundboxPayment } from '../utils/audioSoundbox';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelectorModal } from './LanguageSelectorModal';

interface HomeDashboardProps {
  merchant: MerchantProfile;
  products: Product[];
  customers: Customer[];
  bills: Bill[];
  onNavigate: (screen: AppScreen) => void;
  onSelectCustomer?: (customer: Customer) => void;
  onQuickBillAction?: (bill: Bill) => void;
  onOpenStoreSetup?: () => void;
  isFreshStore?: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  merchant,
  products,
  customers,
  bills,
  onNavigate,
  onOpenStoreSetup,
  isFreshStore = false,
}) => {
  const { language, t, supportedLanguages } = useLanguage();
  const [showLangModal, setShowLangModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBillForDetails, setSelectedBillForDetails] = useState<Bill | null>(null);

  // Financial calculations
  const calculatedSales = bills.reduce((sum, b) => sum + b.grandTotal, 0);
  const todayTotalSales = calculatedSales;

  const calculatedCash = bills
    .filter((b) => b.paymentMode === 'CASH' || b.paymentMode === 'SPLIT')
    .reduce((sum, b) => sum + (b.cashAmount || b.grandTotal), 0);
  const cashSales = calculatedCash;

  const calculatedUpi = bills
    .filter((b) => b.paymentMode === 'UPI' || b.paymentMode === 'SPLIT')
    .reduce((sum, b) => sum + (b.upiAmount || (b.paymentMode === 'UPI' ? b.grandTotal : 0)), 0);
  const upiSales = calculatedUpi;

  const calculatedUdhaar = customers.reduce((sum, c) => sum + c.totalUdhaar, 0);
  const totalUdhaarPending = calculatedUdhaar;

  // Expiry alerts count
  const expiringProducts = products.filter((p) => {
    const exp = new Date(p.expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });

  // Low stock count
  const lowStockProducts = products.filter((p) => p.stockQty <= p.minStockAlert);

  const handleRefreshStats = () => {
    setRefreshing(true);
    speakSoundboxPayment(todayTotalSales, merchant.shopName || 'Apni Dukan', language);
    setTimeout(() => setRefreshing(false), 800);
  };

  const currentLangNative =
    supportedLanguages.find((l) => l.code === language)?.native || 'English';

  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen">
      {/* Top Header with Prominent Language Selector - Matching User HTML Exactly */}
      <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-margin flex items-center justify-between gap-2 max-w-5xl mx-auto">
          {/* Store Branding */}
          <div
            onClick={() => onNavigate('store_profile')}
            className="flex items-center gap-space-sm min-w-0 flex-1 cursor-pointer hover:opacity-90 transition-opacity"
            title="Dukan Settings & Profile"
          >
            <img
              alt="QuickBill App Icon"
              className="h-8 w-auto object-contain flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbgVuLmjKSwvXfdz5PRiz9Mog0fvtVbEaf8jSQ9e2hesrcrn6ikd5qB8QjnBkojXW8pQbgrAhJ8EtYY0mgJA9EQN4jIi-Leg6PZHVir-7fxQ5oO31JJLGjs1AeEjPYjzllSCAvAvFUQU_HERdtvcQSo1PG6yLvKV-03dTFmbohH6iJ9eMYnLyAGU-r3VIpcC4RpD5UBo5z5F8pBI3ZqU321BiNtv28iYj8qA_Uag3NuQ9Qb6lHqNQu"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-title-md text-title-md text-on-surface truncate font-semibold">
                  {merchant.shopName || 'Apni Dukan'}
                </span>
                <span className="material-symbols-outlined text-primary text-[15px] flex-shrink-0">
                  verified
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span
                  className="font-body-sm text-body-sm text-on-surface-variant leading-none"
                  data-i18n="appSubtitle"
                >
                  QuickBill &amp; Khata AI
                </span>
                <span className="text-outline-variant text-[10px] leading-none">•</span>
                <span
                  className="font-label-md text-label-md text-primary font-semibold leading-none uppercase tracking-wide"
                  data-i18n="activeBadge"
                >
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Action items: Interactive Language Switcher + Notification + Avatar */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Language Selector Trigger Button */}
            <button
              onClick={() => setShowLangModal(true)}
              aria-label="Select Language"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface hover:bg-surface-container active:scale-95 transition-all shadow-xs cursor-pointer"
              id="lang-picker-btn"
            >
              <span className="material-symbols-outlined text-primary text-[17px]">translate</span>
              <span className="font-label-md text-label-md font-bold text-on-surface" id="current-lang-label">
                {currentLangNative}
              </span>
              <span className="material-symbols-outlined text-[15px] text-on-surface-variant">
                expand_more
              </span>
            </button>

            {/* Notification Button */}
            <button
              onClick={() => onNavigate('smart_soundbox')}
              aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant cursor-pointer"
            >
              <span className="material-symbols-outlined text-[21px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            </button>

            {/* Profile Avatar */}
            <div
              className="relative pl-0.5 flex items-center cursor-pointer"
              onClick={() => onNavigate('store_profile')}
              title="Store Profile & Settings"
            >
              {merchant.avatarUrl ? (
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/30 hover:ring-2 hover:ring-emerald-600 transition-all"
                  src={merchant.avatarUrl}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs ring-1 ring-outline-variant/30 hover:ring-2 hover:ring-emerald-600 transition-all shadow-xs">
                  {merchant.name ? merchant.name.charAt(0).toUpperCase() : (merchant.shopName ? merchant.shopName.charAt(0).toUpperCase() : 'M')}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-28 bg-surface px-margin max-w-5xl mx-auto">
        <div className="flex flex-col w-full pb-6 gap-space-lg">
          {/* Live Production Store Banner with 1-Click Store Setup Switcher */}
          <div className="w-full rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 p-4 text-white shadow-md flex items-center justify-between border border-emerald-500/30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0">
                🏪
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-white truncate">
                    {merchant.shopName || 'Apni Dukan'}
                  </span>
                  <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    {bills.length === 0 ? 'Fresh Store (₹0)' : 'Live Store'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                  Owner: <span className="text-white font-semibold">{merchant.name || 'Store Owner'}</span> • 🇮🇳 Mumbai Cloud Synced (asia-south1)
                </p>
              </div>
            </div>

            <button
              onClick={onOpenStoreSetup}
              className="py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
              title="Dukan Setup & Reset"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span className="hidden sm:inline">Dukan Setup</span>
              <span className="sm:hidden">Setup</span>
            </button>
          </div>

          {/* Revenue & Inflow Summary Master Card - From User HTML */}
          <div className="w-full rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            {/* Top Row: Today's Revenue + Comparison */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span
                  className="font-label-md text-label-md text-on-surface-variant font-medium tracking-wide uppercase"
                  data-i18n="todaySale"
                >
                  {t('todays_sales', "Today's Total Sale")}
                </span>
                <div className="flex items-baseline gap-space-xs mt-0.5">
                  <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    ₹{todayTotalSales.toLocaleString('en-IN')}
                  </span>
                  {todayTotalSales > 0 ? (
                    <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                      <span className="material-symbols-outlined text-[13px] font-bold">trending_up</span>
                      <span className="font-label-md text-label-md font-bold">+18%</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      Zero Sales (Fresh Store)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('bank_settlement')}
                  className="px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Daily Bank Settlement"
                >
                  <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  <span>{t('settlement', 'Settlement')}</span>
                </button>
                <button
                  onClick={handleRefreshStats}
                  aria-label="Refresh financial stats"
                  className={`w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all cursor-pointer ${
                    refreshing ? 'animate-spin text-primary' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">sync</span>
                </button>
              </div>
            </div>

            {/* First Bill Encouragement when Fresh Store is active */}
            {isFreshStore && todayTotalSales === 0 && (
              <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-emerald-700 text-[20px]">store</span>
                  <span className="text-emerald-950 font-medium">
                    Aapka fresh store taiyaar hai! Pehla bill banane ke liye direct billing shuru karein.
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('create_bill')}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs shrink-0 flex items-center gap-1 transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>+ Naya Bill Banayein</span>
                </button>
              </div>
            )}

            {/* Middle Split: Cash vs UPI Breakdown */}
            <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
              <div
                onClick={() => onNavigate('galla_hisab')}
                className="bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between cursor-pointer hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-label-md text-label-md text-on-surface-variant font-medium"
                    data-i18n="cashCollected"
                  >
                    {t('cash_in_hand', 'Cash Collected')}
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                </div>
                <span className="font-title-lg text-title-lg text-on-surface mt-1 font-semibold">
                  ₹{cashSales.toLocaleString('en-IN')}
                </span>
                <span
                  className="font-body-sm text-body-sm text-primary font-medium mt-0.5"
                  data-i18n="cashShare"
                >
                  {t('cash_share', '62% of volume')}
                </span>
              </div>

              <div
                onClick={() => onNavigate('smart_soundbox')}
                className="bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between cursor-pointer hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-label-md text-label-md text-on-surface-variant font-medium"
                    data-i18n="onlineUpi"
                  >
                    {t('online_upi', 'Online / UPI')}
                  </span>
                  <span className="material-symbols-outlined text-tertiary text-[18px]">qr_code_2</span>
                </div>
                <span className="font-title-lg text-title-lg text-on-surface mt-1 font-semibold">
                  ₹{upiSales.toLocaleString('en-IN')}
                </span>
                <span
                  className="font-body-sm text-body-sm text-tertiary font-medium mt-0.5"
                  data-i18n="upiTxns"
                >
                  {t('upi_txns', '24 instant txns')}
                </span>
              </div>
            </div>

            {/* Outstanding Credit (Udhaar) Alert Banner */}
            <div className="rounded-lg bg-error-container/40 p-space-md flex items-center justify-between border border-error-container/60">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">priority_high</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className="font-label-md text-label-md text-on-error-container uppercase font-semibold"
                    data-i18n="pendingCredit"
                  >
                    {t('total_udhaar', 'Pending Credit (Udhaar)')}
                  </span>
                  <span className="font-title-lg text-title-lg text-error font-bold">
                    ₹{totalUdhaarPending.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('udhaar_ai_recovery')}
                  className="px-3 py-1.5 rounded-lg bg-error text-on-error text-xs font-bold hover:bg-error/90 active:scale-95 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('ai_recovery_btn', 'AI तकादा')}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary High-Impact Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* New Bill POS */}
            <button
              onClick={() => onNavigate('create_bill')}
              className="bg-primary hover:bg-primary-container text-on-primary p-4 rounded-xl shadow-sm flex items-center justify-between font-bold transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </div>
                <div className="text-left">
                  <div className="text-base font-bold">{t('create_new_bill', 'नया बिल बनाएं (POS)')}</div>
                  <div className="text-xs text-on-primary/80 font-normal">{t('whatsapp_invoice_sub', '1-Click WhatsApp Invoice')}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-on-primary/80">chevron_right</span>
            </button>

            {/* AI Voice Billing */}
            <button
              onClick={() => onNavigate('voice_billing')}
              className="bg-surface-container-lowest border border-tertiary/30 hover:border-tertiary p-4 rounded-xl shadow-xs flex items-center justify-between text-on-surface font-bold transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">mic</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold flex items-center gap-1.5 text-on-surface">
                    <span>{t('voice_billing_btn', 'बोलकर बिल (AI Voice)')}</span>
                    <span className="text-[10px] bg-tertiary text-white font-bold px-1.5 py-0.5 rounded">
                      5x FAST
                    </span>
                  </div>
                  <div className="text-xs text-on-surface-variant font-normal">{t('voice_billing_sub', 'बोलें और बिल तैयार')}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-tertiary">chevron_right</span>
            </button>

            {/* Barcode Scanner */}
            <button
              onClick={() => onNavigate('barcode_scanner')}
              className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-4 rounded-xl shadow-xs flex items-center justify-between text-on-surface font-bold transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-on-surface">
                    {t('scan_barcode', 'बारकोड स्कैनर')}
                  </div>
                  <div className="text-xs text-on-surface-variant font-normal">{t('scan_sub', 'कैमरा स्कैन + प्राइस टैग')}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">chevron_right</span>
            </button>
          </div>

          {/* Quick Soundbox Test & Pro Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-semibold text-on-surface">
                {t('soundbox_live_banner', 'QuickBill Soundbox Live: ₹500 Payment Audio')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakSoundboxPayment(500, merchant.shopName || 'Sharma General Store', language)}
                className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container text-xs font-bold text-on-surface flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-[16px]">volume_up</span>
                <span>{t('soundbox_test_btn', 'साउंडबॉक्स टेस्ट')}</span>
              </button>
              <button
                onClick={() => onNavigate('pro_subscription')}
                className="px-2.5 py-1 rounded-lg bg-tertiary text-white text-xs font-bold hover:bg-tertiary-container active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                <span>{t('pro_ai', 'PRO AI')}</span>
              </button>
            </div>
          </div>

          {/* Alert Cards for Expiry / Low Stock if any */}
          {(expiringProducts.length > 0 || lowStockProducts.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expiringProducts.length > 0 && (
                <div className="bg-error-container/30 border border-error/30 p-3.5 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">warning</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-error">
                        {expiringProducts.length} {t('expiry_alert_heading', 'सामान की एक्सपायरी नजदीक है!')}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        {t('expiry_alert_desc', 'अमूल बटर 7 दिन में एक्सपायर होगा। 35% छूट में बेचें।')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('expiry_clearance_offer')}
                    className="px-3 py-1 rounded-lg bg-error text-on-error text-xs font-bold hover:bg-error/90 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                  >
                    {t('clearance_btn', 'सेल लगाएं')}
                  </button>
                </div>
              )}

              {lowStockProducts.length > 0 && (
                <div className="bg-surface-container-high border border-outline-variant/30 p-3.5 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">
                        {lowStockProducts.length} {t('low_stock_heading', 'सामान का स्टॉक कम है!')}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        {t('low_stock_desc', 'फॉर्च्यून तेल और आशीर्वाद आटा ख़त्म होने वाला है।')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('inventory_stock')}
                    className="px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container active:scale-95 transition-all cursor-pointer flex-shrink-0"
                  >
                    {t('reorder_btn', 'ऑर्डर करें')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Vyapar Smart Modules Bento Grid */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md font-bold text-on-surface">
                {t('business_modules', 'व्यापार एवं स्मार्ट टूल्स')}
              </h2>
              <span className="text-xs font-medium text-primary">{t('all_in_one_pos', 'ऑल-इन-वन POS')}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {/* Khata Book */}
              <button
                onClick={() => onNavigate('khata_book')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('khata_book', 'खाता बही')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('khata_sub', 'ग्राहक उधारी & AI तकादा')}
                </div>
              </button>

              {/* Stock Inventory */}
              <button
                onClick={() => onNavigate('inventory_stock')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('stock_inventory', 'स्टॉक & इन्वेंटरी')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {products.length} {t('stock_sub', 'सामान लिस्टेड')}
                </div>
              </button>

              {/* Expiry Clearance Offer */}
              <button
                onClick={() => onNavigate('expiry_clearance_offer')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-error-container text-on-error-container flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">local_offer</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('expiry_sale', 'एक्सपायरी सेल')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('expiry_sub', 'ऑटो डिस्काउंट पोस्टर')}
                </div>
              </button>

              {/* Inward Parchi Scanner */}
              <button
                onClick={() => onNavigate('inward_bill_scanner')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('inward_bill_scan', 'होलसेल पर्ची स्कैन')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('inward_sub', 'AI फोटो से स्टॉक जोड़ें')}
                </div>
              </button>

              {/* Smart Soundbox */}
              <button
                onClick={() => onNavigate('smart_soundbox')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">speaker_phone</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('smart_soundbox', 'स्मार्ट साउंडबॉक्स')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('soundbox_sub', 'QR & पेमेंट वॉयस अलर्ट')}
                </div>
              </button>

              {/* Galla Hisab */}
              <button
                onClick={() => onNavigate('galla_hisab')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('galla_hisab', 'गल्ला हिसाब')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('galla_sub', 'रोकड़ मिलान & डे-एंड')}
                </div>
              </button>

              {/* Live Mandi Rates */}
              <button
                onClick={() => onNavigate('mandi_rates')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('mandi_rates', 'लाइव मंडी भाव')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('mandi_sub', 'APMC थोक बाज़ार भाव')}
                </div>
              </button>

              {/* GST Reports */}
              <button
                onClick={() => onNavigate('reports_gst')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('gst_reports', 'GST & सेल्स रिपोर्ट')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('gst_sub', 'GSTR-1 & एकाउंटिंग')}
                </div>
              </button>

              {/* Digital Dukan */}
              <button
                onClick={() => onNavigate('digital_dukan')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('digital_dukan', 'डिजिटल दुकान')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('digital_sub', 'WhatsApp ऑर्डर कैटलॉग')}
                </div>
              </button>

              {/* Thermal Printer Designer */}
              <button
                onClick={() => onNavigate('thermal_printer_designer')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">print</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('printer_designer', 'प्रिंटर डिज़ाइनर')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('printer_sub', '2 & 3 इंच थर्मल रसीद')}
                </div>
              </button>

              {/* Loyalty & Rewards */}
              <button
                onClick={() => onNavigate('loyalty_rewards')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">redeem</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('loyalty_rewards', 'कस्टमर लॉयल्टी')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('loyalty_sub', 'रिवार्ड पॉइंट्स & कैशबैक')}
                </div>
              </button>

              {/* Staff Management */}
              <button
                onClick={() => onNavigate('staff_management')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('staff_mgmt', 'स्टाफ & परमिशन')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('staff_sub', 'मुनीम / कैशियर लॉगिन')}
                </div>
              </button>

              {/* Bank Settlement & Payouts (Screen 36 in PDF) */}
              <button
                onClick={() => onNavigate('bank_settlement')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('settlement_title', 'Bank Settlement (SBI)')}
                </div>
                <div className="font-body-sm text-body-sm text-primary font-bold mt-0.5">
                  {t('1_tap_payout', '1-Tap Instant Payout')}
                </div>
              </button>

              {/* Vyapar Loan & Score (Screen 7 in PDF) */}
              <button
                onClick={() => onNavigate('vyapar_loan')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">savings</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('vyapar_loan_title', 'Vyapar Loan & Score')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('vyapar_loan_sub', '785 Score • ₹3.5L Approved')}
                </div>
              </button>

              {/* GST e-Way Bill & ITC (Screen 24 in PDF) */}
              <button
                onClick={() => onNavigate('gst_eway_bill')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('gst_eway_bill', 'GST e-Way Bill & ITC')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('gst_eway_sub', '₹24,680 Tax Savings')}
                </div>
              </button>

              {/* Store Profile Setup (Screens 5 & 44 in PDF) */}
              <button
                onClick={() => onNavigate('store_profile')}
                className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/60 p-3.5 rounded-xl flex flex-col items-start text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
                <div className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                  {t('store_profile_setup', 'Store Profile Setup')}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('store_profile_sub', 'GSTIN, QR & Invoice Header')}
                </div>
              </button>
            </div>
          </div>

          {/* Recent Invoices Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md font-bold text-on-surface">
                {t('recent_bills', 'हाल की पर्चियां (Recent Bills)')}
              </h2>
              <button
                onClick={() => onNavigate('create_bill')}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                {t('new_bill_btn', '+ नया बिल')}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {bills.slice(0, 5).map((bill) => (
                <div
                  key={bill.id}
                  className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 flex items-center justify-between gap-2 shadow-2xs hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedBillForDetails(bill)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">receipt</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-title-md text-title-md font-semibold text-on-surface truncate">
                          {bill.customerName || t('walkin_customer', 'नकद ग्राहक (Walk-in)')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            bill.paymentMode === 'UPI'
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                              : bill.paymentMode === 'UDHAAR'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-primary-fixed text-on-primary-fixed-variant'
                          }`}
                        >
                          {bill.paymentMode}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                        <span>{bill.items.length} {t('items_label', 'सामान')}</span>
                        <span>•</span>
                        <span>{bill.date ? new Date(bill.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('today', 'आज')}</span>
                        <span>•</span>
                        <span className="text-primary font-bold hover:underline">View Items</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <div className="text-right">
                      <div className="font-title-lg text-title-lg font-bold text-on-surface">
                        ₹{bill.grandTotal.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-primary font-medium">{t('payment_success', 'सफल भुगतान')}</div>
                    </div>

                    <button
                      onClick={() => speakSoundboxPayment(bill.grandTotal, merchant.shopName, language)}
                      title="Play Payment Sound"
                      className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-primary active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">volume_up</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bill Details Modal for HomeDashboard Recent Invoices */}
      {selectedBillForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-primary text-on-primary px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{selectedBillForDetails.billNumber || 'Bill Receipt'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white/20 text-white">
                      {selectedBillForDetails.paymentMode}
                    </span>
                  </h3>
                  <p className="text-[11px] text-white/80">
                    {merchant.shopName || 'Sharma General Store'} • Tax Invoice
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBillForDetails(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-start border-b border-outline-variant/20 pb-2">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Customer</span>
                    <span className="font-bold text-on-surface text-xs">{selectedBillForDetails.customerName || 'Walk-in Customer'}</span>
                    {selectedBillForDetails.customerPhone && (
                      <span className="text-[11px] text-on-surface-variant block">{selectedBillForDetails.customerPhone}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Date &amp; Time</span>
                    <span className="font-bold text-on-surface text-xs">{selectedBillForDetails.date || 'Today'}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                  <span>Purchased Items ({selectedBillForDetails.items.length})</span>
                  <span className="text-[11px] text-on-surface-variant font-normal">Qty &amp; Rates</span>
                </div>

                <div className="border border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-lowest">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container-high text-on-surface-variant font-bold text-[10px] uppercase border-b border-outline-variant/30">
                        <th className="py-2 px-2.5 w-7 text-center">#</th>
                        <th className="py-2 px-2">Item Description</th>
                        <th className="py-2 px-2 text-center">Qty</th>
                        <th className="py-2 px-2 text-right">Rate</th>
                        <th className="py-2 px-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {selectedBillForDetails.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors">
                          <td className="py-2 px-2.5 text-center text-on-surface-variant font-mono text-[11px]">{idx + 1}</td>
                          <td className="py-2 px-2">
                            <div className="font-bold text-on-surface leading-tight">
                              {language === 'en' ? item.name : (item.nameHindi || item.name)}
                            </div>
                            {language !== 'en' && item.nameHindi && (
                              <div className="text-[10px] text-on-surface-variant">{item.nameHindi}</div>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center font-bold text-on-surface whitespace-nowrap">{item.qty} {item.unit || 'pcs'}</td>
                          <td className="py-2 px-2 text-right font-mono text-on-surface-variant whitespace-nowrap">₹{item.price}</td>
                          <td className="py-2 px-2.5 text-right font-black text-on-surface whitespace-nowrap">₹{item.total.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-on-surface">₹{selectedBillForDetails.subtotal?.toLocaleString('en-IN') || selectedBillForDetails.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedBillForDetails.taxTotal ? (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>GST Tax</span>
                    <span className="font-mono text-on-surface">₹{selectedBillForDetails.taxTotal}</span>
                  </div>
                ) : null}
                <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-baseline font-black">
                  <span className="text-on-surface text-sm">Grand Total</span>
                  <span className="text-lg text-primary font-mono">₹{selectedBillForDetails.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-surface-container-high border-t border-outline-variant/30 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 rounded-xl text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedBillForDetails(null)}
                className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-on-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      <LanguageSelectorModal isOpen={showLangModal} onClose={() => setShowLangModal(false)} />
    </div>
  );
};
