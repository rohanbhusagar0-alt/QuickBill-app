import React, { useState, useRef } from 'react';
import { AppScreen, MerchantProfile } from '../types';
import {
  ArrowLeft,
  Search,
  Camera,
  CheckCircle2,
  Copy,
  ChevronDown,
  Volume2,
  MessageSquare,
  Printer,
  MapPin,
  FileText,
  Building2,
  Sparkles,
  QrCode,
  Cloud,
  Fingerprint,
  Download,
  Barcode,
  ExternalLink,
  LogOut,
  Store,
  Check,
  Smartphone,
  Edit3,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Sliders,
  Trash2,
  Star,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import {
  validateIndiaDatacenterConnection,
  syncBankAccountToCloud,
  syncSecurityPinToCloud,
  getStoreMerchantId,
} from '../services/firebase';
import { InstallApkModal } from './InstallApkModal';
import { AddBankAccountModal, BankAccount } from './AddBankAccountModal';
import { EditStoreDetailsModal } from './EditStoreDetailsModal';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { SecurityPinModal } from './SecurityPinModal';

interface StoreProfileSetupScreenProps {
  onNavigate: (screen: AppScreen) => void;
  merchant: MerchantProfile;
  onUpdateMerchant: (updated: Partial<MerchantProfile>) => void;
  onClearDemoData?: () => void;
  onRestoreDemoData?: () => void;
  devModeEnabled?: boolean;
  onToggleDevMode?: () => void;
  onLogout?: () => void;
}

export const StoreProfileSetupScreen: React.FC<StoreProfileSetupScreenProps> = ({
  onNavigate,
  merchant,
  onUpdateMerchant,
  onClearDemoData,
  onRestoreDemoData,
  devModeEnabled = false,
  onToggleDevMode,
  onLogout,
}) => {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gstAutofill, setGstAutofill] = useState(true);
  const [biometricLock, setBiometricLock] = useState(true);
  const [continuousBarcodeBeep, setContinuousBarcodeBeep] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showApkModal, setShowApkModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showEditShopModal, setShowEditShopModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [requirePinForSensitive, setRequirePinForSensitive] = useState<boolean>(() => {
    return localStorage.getItem('quickbill_pin_lock_enabled') !== 'false';
  });

  // Real Bank Accounts State
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('quickbill_bank_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Real Store Details (Address / Bill Notes) Modal State
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [editDetailsTab, setEditDetailsTab] = useState<'location' | 'bill_notes'>('location');

  // Search filter
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Edit shop form inputs
  const [shopNameInput, setShopNameInput] = useState(merchant.shopName || '');
  const [ownerNameInput, setOwnerNameInput] = useState(merchant.name || '');
  const [phoneInput, setPhoneInput] = useState(merchant.phone || '');
  const [upiInput, setUpiInput] = useState(merchant.upiId || '');
  const [addressInput, setAddressInput] = useState(merchant.address || '');
  const [gstinInput, setGstinInput] = useState(merchant.gstin || '');

  const handleCopyGstin = () => {
    navigator.clipboard?.writeText(merchant.gstin || '07AABCS1429B1Z');
    setToastMessage(t('copied', 'GSTIN Copied!'));
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateMerchant({ logoUrl: reader.result });
          setToastMessage('Store photo updated successfully!');
          setTimeout(() => setToastMessage(null), 2000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAccount = (acc: BankAccount) => {
    setBankAccounts((prev) => {
      let updated = prev;
      if (acc.isDefault) {
        updated = prev.map((a) => ({ ...a, isDefault: false }));
      }
      const next = [...updated, acc];
      try {
        localStorage.setItem('quickbill_bank_accounts', JSON.stringify(next));
      } catch {}
      return next;
    });
    // Persist bank account to India Cloud Datacenter
    syncBankAccountToCloud(getStoreMerchantId(merchant.phone), {
      id: acc.id,
      bankName: acc.bankName,
      accountNumber: acc.accountNumber,
      ifscCode: acc.ifscCode,
      isPrimary: acc.isDefault,
    });
    setToastMessage(`Bank account for ${acc.bankName} added!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleDeleteAccount = (id: string) => {
    setBankAccounts((prev) => {
      const next = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem('quickbill_bank_accounts', JSON.stringify(next));
      } catch {}
      return next;
    });
    setToastMessage('Bank account removed');
    setTimeout(() => setToastMessage(null), 1500);
  };

  const handleSetDefaultAccount = (id: string) => {
    let targetAcc: BankAccount | undefined;
    setBankAccounts((prev) => {
      const next = prev.map((a) => {
        const isMatch = a.id === id;
        if (isMatch) targetAcc = { ...a, isDefault: true };
        return { ...a, isDefault: isMatch };
      });
      try {
        localStorage.setItem('quickbill_bank_accounts', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (targetAcc) {
      syncBankAccountToCloud(getStoreMerchantId(merchant.phone), {
        id: targetAcc.id,
        bankName: targetAcc.bankName,
        accountNumber: targetAcc.accountNumber,
        ifscCode: targetAcc.ifscCode,
        isPrimary: true,
      });
    }
    setToastMessage('Default settlement account updated');
    setTimeout(() => setToastMessage(null), 1500);
  };

  const handlePinChanged = (newPin: string) => {
    localStorage.setItem('quickbill_security_pin', newPin);
    syncSecurityPinToCloud(getStoreMerchantId(merchant.phone), newPin);
    setToastMessage(t('pin_updated_success', 'Security PIN updated successfully!'));
    setShowChangePinModal(false);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('quickbill_session');
    setToastMessage('Session logged out securely.');
    if (onLogout) {
      onLogout();
    } else {
      onNavigate('merchant_login');
    }
  };

  const storeInitials = (merchant.shopName || 'QuickBill Store')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'QB';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20 select-none">
      {/* Hidden file input for genuine photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        className="hidden"
        accept="image/*"
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home_dashboard')}
            className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {merchant.shopName || 'QuickBill Store'}
              </h1>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                Verified Store
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span>{merchant.address ? merchant.address.split(',')[0] : 'Main Market Counter'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
            title="Search Settings"
          >
            <Search className="w-5 h-5" />
          </button>
          {merchant.logoUrl ? (
            <img
              src={merchant.logoUrl}
              alt="Store logo"
              className="w-8 h-8 rounded-full object-cover border-2 border-emerald-600"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center border border-emerald-600 shadow-2xs">
              {storeInitials}
            </div>
          )}
        </div>
      </header>

      {/* Search Bar Dropdown */}
      {searchOpen && (
        <div className="bg-emerald-900 px-4 py-2.5 text-white">
          <div className="max-w-md mx-auto flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 border border-white/20">
            <Search className="w-4 h-4 text-emerald-300" />
            <input
              type="text"
              placeholder="Search store settings, bank, print, UPI..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="bg-transparent border-none text-xs text-white placeholder-emerald-200/60 focus:outline-none w-full"
            />
            {searchKeyword && (
              <button onClick={() => setSearchKeyword('')} className="text-xs text-emerald-300 font-bold">
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-xs space-y-3.5">
          <div className="flex items-start gap-3.5">
            <div className="relative">
              {merchant.logoUrl ? (
                <img
                  src={merchant.logoUrl}
                  alt="Shop frontage"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-slate-800 text-white flex flex-col items-center justify-center border border-emerald-700 shadow-2xs">
                  <Store className="w-6 h-6 text-emerald-300" />
                  <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">{storeInitials}</span>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Upload real store logo / photo"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs shadow-xs cursor-pointer hover:bg-emerald-900 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <h2 className="text-sm font-bold text-slate-900 truncate">
                  {merchant.shopName || 'Apni Dukan'}
                </h2>
                <button
                  onClick={() => setShowEditShopModal(true)}
                  className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{t('edit', 'Edit')}</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-semibold text-slate-700">{merchant.name || 'Store Merchant'}</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" /> {t('kyc_verified', 'KYC Verified')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t('retail_fmcg_desc', 'Retail & FMCG Kirana • Single Counter')}</p>
            </div>
          </div>

          {/* GSTIN Row */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">📄</span>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block leading-none">
                  {t('gstin_label', 'GSTIN')}
                </span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {merchant.gstin || 'Not Registered'}
                </span>
              </div>
            </div>
            <button
              onClick={handleCopyGstin}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> {t('copy_link', 'Copy')}
            </button>
          </div>

          {/* Pro AI Active Badge Bar */}
          <div className="bg-indigo-50 border border-indigo-200/70 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                ★
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-indigo-950">QuickBill Pro AI</span>
                  <span className="text-[9px] font-bold bg-indigo-200 text-indigo-900 px-1.5 py-0.2 rounded">
                    {t('active_badge', 'Active')}
                  </span>
                </div>
                <p className="text-[10px] text-indigo-700 font-medium">{t('validity_till', 'Validity till 31 Dec 2026')}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('pro_subscription')}
              className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              {t('manage_plan', 'Manage Plan')}
            </button>
          </div>
        </div>

        {/* Live Production Mode & Store Data Control */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-4 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                Live Production Active
              </span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-600/40">
              Real Store Ready
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Aapka store live billing aur Indian Kirana compliance ke liye 100% taiyaar hai. Real-time Firebase Cloud Sync (asia-south1 Mumbai) active hai.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="py-2.5 px-3 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Fresh Store</span>
            </button>

            <button
              onClick={() => {
                if (onRestoreDemoData) {
                  onRestoreDemoData();
                  setToastMessage('Sample Kirana catalog & bills restored!');
                  setTimeout(() => setToastMessage(null), 2000);
                }
              }}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Restore Demo Data</span>
            </button>
          </div>

          {/* Dev Mode Screen Switcher Toggle */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block leading-tight">
                  Developer Screen Switcher
                </span>
                <span className="text-[10px] text-slate-400">
                  {devModeEnabled ? 'Top 31-screen menu visible' : 'Hidden for clean production experience'}
                </span>
              </div>
            </div>
            <button
              onClick={() => onToggleDevMode && onToggleDevMode()}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                devModeEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  devModeEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{t('quick_controls', 'Quick Controls')}</h3>
            <span className="text-xs font-semibold text-emerald-800">{t('all_active', 'All Active')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Control 1 */}
            <div
              onClick={() => setShowLangModal(true)}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs cursor-pointer hover:border-slate-300 transition-all active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🇮🇳</span>
                <span className="text-slate-400">›</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">{t('app_language_label', 'App Language')}</div>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">{language.toUpperCase()} (12 Languages)</h4>
            </div>

            {/* Control 2 */}
            <div
              onClick={() => onNavigate('smart_soundbox')}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">{t('soundbox_chime_label', 'Soundbox Chime')}</div>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">{t('soundbox_chime_value', '85% Volume')}</h4>
            </div>

            {/* Control 3 */}
            <div
              onClick={() => {
                setToastMessage(t('instant_auto_send', 'WhatsApp Auto-Send Active'));
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="text-[10px] text-slate-500 font-medium">{t('whatsapp_invoice_label', 'WhatsApp Invoice')}</div>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">{t('instant_auto_send', 'Instant Auto-Send')}</h4>
            </div>

            {/* Control 4 */}
            <div
              onClick={() => onNavigate('thermal_printer_designer')}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Printer className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 rounded">
                  {t('paired_badge', 'Paired')}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">{t('receipt_printer_label', 'Receipt Printer')}</div>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">{t('receipt_printer_value', '58mm TVS ERP')}</h4>
            </div>
          </div>
        </div>

        {/* Store Details */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span>🏪</span>
            <span>{t('store_details_heading', 'Store & Billing Details')}</span>
          </div>

          {/* Location */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {t('shop_location_pin', 'Shop Location & PIN')}
              </span>
              <button
                onClick={() => {
                  setEditDetailsTab('location');
                  setShowEditDetailsModal(true);
                }}
                className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
              >
                {t('edit', 'Edit')}
              </button>
            </div>
            <p className="text-xs text-slate-900 font-medium leading-relaxed">
              {merchant.address || 'Shop No. 14, Main Market Road'}
            </p>
          </div>

          {/* Bill Header & Footer */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> {t('bill_header_footer', 'Bill Header & Footer Note')}
              </span>
              <button
                onClick={() => {
                  setEditDetailsTab('bill_notes');
                  setShowEditDetailsModal(true);
                }}
                className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
              >
                {t('customize', 'Customize')}
              </button>
            </div>
            <p className="text-xs text-slate-800 font-medium">
              Header: {merchant.shopName || 'QuickBill Store'} ({merchant.phone || '+91 98765 43210'})
            </p>
            <div className="text-[11px] italic bg-white border border-slate-200/60 rounded-lg p-2 text-slate-600">
              "{merchant.billFooterNote || 'उधार प्रेम की कैंची है / Thank you, visit again!'}"
            </div>
          </div>

          {/* Tax Scheme */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {t('composition_scheme', 'Composition Tax Scheme')}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {t('composition_sub', 'Automated 1% Billing Ledger')}
              </span>
            </div>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
              {t('selected', 'Selected')}
            </span>
          </div>

          {/* AI HSN & GST Autofill */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> {t('ai_hsn_gst', 'AI HSN & GST Autofill')}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {t('ai_hsn_gst_sub', 'Suggest tax slabs during fast bill scan')}
              </span>
            </div>
            <button
              onClick={() => setGstAutofill(!gstAutofill)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                gstAutofill ? 'bg-emerald-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  gstAutofill ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* UPI & Bank Accounts */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span>💳</span>
              <span>{t('payments_bank_heading', 'UPI & Bank Accounts')}</span>
            </div>
            <button
              onClick={() => setShowAddBankModal(true)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>+ Add New Bank</span>
            </button>
          </div>

          {/* UPI ID */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-sm">
                ₹
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900">{merchant.upiId || 'UPI ID Not Configured'}</span>
                  {merchant.upiId && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <span className="text-[10px] text-slate-500">{t('default_settlement_qr', 'Default QR Settlement UPI ID')}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              {t('default_badge', 'Default')}
            </span>
          </div>

          {/* Dynamic Bank Accounts List */}
          <div className="space-y-2">
            {bankAccounts.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                कोई बैंक खाता नहीं जुड़ा है। '+ Add New Bank' दबाकर अपना बैंक जोड़ें।
              </div>
            ) : (
              bankAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{acc.bankName}</h4>
                        {acc.isDefault && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full shrink-0">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        A/C: •••• {acc.accountNumber.slice(-4)} • IFSC: {acc.ifscCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!acc.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAccount(acc.id)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-[10px] font-bold cursor-pointer"
                        title="Set as Default"
                      >
                        Make Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAccount(acc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Remove Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Store Counter QR Standee card */}
          <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-12 h-12 bg-white border border-indigo-200 rounded-xl flex items-center justify-center shrink-0">
              <QrCode className="w-8 h-8 text-indigo-800" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900">{t('counter_qr_standee', 'Store Counter QR Standee')}</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {t('counter_qr_sub', 'Print high-res PDF with store branding & audio alert trigger.')}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setToastMessage('QR Standee PDF Downloaded!');
                    setTimeout(() => setToastMessage(null), 2000);
                  }}
                  className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3 h-3" /> {t('download_pdf', 'Download PDF')}
                </button>
                <button
                  onClick={() => {
                    setToastMessage('QuickBill par ₹100 prapt hue!');
                    setTimeout(() => setToastMessage(null), 2500);
                  }}
                  className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 font-bold rounded-lg text-xs hover:bg-indigo-50 shadow-2xs cursor-pointer"
                >
                  {t('test_voice', 'Test Voice')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Backup & Security */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span>🛡️</span>
            <span>{t('backup_security_heading', 'Data Backup & Security')}</span>
          </div>

          {/* India Datacenter Cloud Server */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                🇮🇳
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-emerald-950">
                    {t('india_datacenter_title', 'India Cloud Datacenter')}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    {t('datacenter_live_status', 'Live • asia-south1 (Mumbai)')}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-800 mt-0.5">
                  {t('datacenter_compliance', '100% Indian Data Sovereignty • Dedicated Mumbai Firestore • RBI & GSTN Compliant')}
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                await validateIndiaDatacenterConnection();
                confetti({ particleCount: 30 });
                setToastMessage(t('india_datacenter_synced', 'India Cloud (Mumbai) Synced!'));
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-2xs"
            >
              {t('sync_now', 'Sync Now')}
            </button>
          </div>

          {/* Google Drive Sync */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">{t('google_drive_sync', 'Google Drive Sync')}</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-[10px] text-slate-500">
                  {t('last_synced_note', 'Last synced: Today at 04:15 PM • 2,842 Bills & 394 Khata Ledgers Secured')}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                confetti({ particleCount: 40 });
                setToastMessage('Google Drive Sync Complete!');
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold rounded-lg text-xs shrink-0 cursor-pointer"
            >
              {t('sync_now', 'Sync Now')}
            </button>
          </div>

          {/* Download Android APK / WebAPK */}
          <div className="p-3 bg-emerald-950 text-white border border-emerald-900 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 border border-emerald-700 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">Android App (APK) Download</h4>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                    Mobile APK
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200/80">
                  Phone par direct install karein ya APK package lein
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowApkModal(true)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-950 font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-xs"
            >
              Get APK
            </button>
          </div>

          {/* Biometric / App Lock */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('biometric_app_lock', 'Biometric / App Lock')}</h4>
                <p className="text-[10px] text-slate-500">
                  {t('biometric_sub', 'Require Fingerprint or PIN to open app')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setBiometricLock(!biometricLock)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                biometricLock ? 'bg-emerald-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  biometricLock ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 4-Digit Store Security PIN */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">{t('store_security_pin', '4-Digit Security PIN')}</h4>
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  {t('pin_protects_note', 'Protects Galla, Reports, Bank Payouts & Settings')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChangePinModal(true)}
              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-2xs"
            >
              {t('change_pin', 'Change PIN')}
            </button>
          </div>

          {/* Require PIN for Galla & Reports Toggle */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t('lock_sensitive_screens', 'Lock Galla & Reports with PIN')}</h4>
              <p className="text-[10px] text-slate-500">
                {t('lock_sensitive_sub', 'Ask for PIN when opening cash drawer or financial reports')}
              </p>
            </div>
            <button
              onClick={() => {
                const nextVal = !requirePinForSensitive;
                setRequirePinForSensitive(nextVal);
                localStorage.setItem('quickbill_pin_lock_enabled', String(nextVal));
                setToastMessage(nextVal ? 'Galla & Reports PIN Lock Enabled' : 'PIN Lock Disabled');
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                requirePinForSensitive ? 'bg-emerald-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  requirePinForSensitive ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Download Full Ledger */}
          <button
            onClick={() => {
              setToastMessage('Exporting Complete Shop Ledger (Excel / Tally XML)...');
              setTimeout(() => setToastMessage(null), 2500);
            }}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{t('download_full_ledger', 'Download Full Ledger (Excel / Tally XML)')}</span>
          </button>
        </div>

        {/* Devices & Hardware */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span>⚙️</span>
            <span>{t('devices_hardware_heading', 'Devices & Hardware')}</span>
          </div>

          {/* Thermal Printer */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('thermal_printer_name', 'TVS ERP-3150 Gold')}</h4>
                <p className="text-[10px] text-slate-500">{t('thermal_printer_sub', 'Bluetooth Thermal • 2 inch (58mm)')}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('thermal_printer_designer')}
              className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              {t('configure', 'Configure')}
            </button>
          </div>

          {/* Barcode Beep Toggle */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                <Barcode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('continuous_barcode_beep', 'Continuous Barcode Beep')}</h4>
                <p className="text-[10px] text-slate-500">
                  {t('barcode_beep_sub', 'Vibrate & sound on Kirana SKU read')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setContinuousBarcodeBeep(!continuousBarcodeBeep)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                continuousBarcodeBeep ? 'bg-emerald-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  continuousBarcodeBeep ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Soundbox 4G Speaker */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('soundbox_speaker', 'Soundbox 4G Speaker')}</h4>
                <p className="text-[10px] text-slate-500">{t('soundbox_speaker_sub', 'Battery: 92% • Connected via BLE')}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('smart_soundbox')}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold rounded-lg text-xs cursor-pointer"
            >
              {t('pair_new', 'Pair New')}
            </button>
          </div>
        </div>

        {/* 24x7 WhatsApp Merchant Helpline */}
        <div
          onClick={() => {
            setToastMessage('Connecting to QuickBill Dedicated Merchant Helpline on WhatsApp...');
            setTimeout(() => setToastMessage(null), 2500);
          }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              💬
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t('merchant_helpline', '24x7 WhatsApp Merchant Helpline')}
              </h4>
              <p className="text-[10px] text-emerald-800">
                {t('helpline_sub', 'Speak directly with a billing advisor')}
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-emerald-700" />
        </div>

        {/* App Version Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
              QB
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t('app_version_title', 'QuickBill & Khata AI')}</h4>
              <p className="text-[10px] text-slate-500">{t('app_version_sub', 'Version 3.4.2 (All-India Edition)')}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
            {t('up_to_date', 'Up to Date')}
          </span>
        </div>

        {/* Switch Store & Log Out */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => onNavigate('godown_transfer')}
            className="py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>{t('switch_store', 'Switch Store')}</span>
          </button>
          <button
            onClick={handleLogout}
            className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout', 'Log Out')}</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-400 py-3 font-medium">
          {t('footer_credit', 'Made with 💚 for Indian Kiranas & Small Businesses • 100% Encrypted')}
        </p>
      </main>

      {/* Clear Demo Data Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Start Fresh Store (नया स्टोर शुरू करें)?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Aapke sample demo products, sample bills aur test udhaar ledger clear kar diye jayenge taaki aap apni dukan ka asli samaan aur customers add kar sakein.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 text-left flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>Aap kisi bhi samay setting se <b>'Restore Demo Data'</b> dabakar sample grocery items wapas laa sakte hain.</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  if (onClearDemoData) onClearDemoData();
                  setShowClearConfirmModal(false);
                  setToastMessage('Store reset! Ready for real inventory & customers.');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Haan, Clear Demo Data (Fresh Store)</span>
              </button>

              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel (रद्द करें)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shop Profile Modal */}
      {showEditShopModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Edit Store Profile</h3>
                  <p className="text-[10px] text-slate-500">Dukan ki asli jaankari update karein</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditShopModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Dukan Ka Naam (Shop Name) *
                </label>
                <input
                  type="text"
                  value={shopNameInput}
                  onChange={(e) => setShopNameInput(e.target.value)}
                  placeholder="e.g. Laxmi Kirana & General Store"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Dukan Malik Ka Naam (Owner Name)
                </label>
                <input
                  type="text"
                  value={ownerNameInput}
                  onChange={(e) => setOwnerNameInput(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Mobile Number (WhatsApp Invoices) *
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Settlement UPI ID (QR Payment Receive) *
                </label>
                <input
                  type="text"
                  value={upiInput}
                  onChange={(e) => setUpiInput(e.target.value)}
                  placeholder="e.g. sharmastore@okaxis / 9876543210@paytm"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Customer QR scan karke sidhe is UPI ID par paise bhejenge.
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Dukan Ka Pata (Address)
                </label>
                <textarea
                  rows={2}
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="e.g. Shop No. 5, Main Bazar, Near Shiv Temple..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={gstinInput}
                  onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                  placeholder="07AABCS1429B1Z"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setShowEditShopModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onUpdateMerchant({
                    shopName: shopNameInput.trim() || merchant.shopName,
                    name: ownerNameInput.trim() || merchant.name,
                    phone: phoneInput.trim() || merchant.phone,
                    upiId: upiInput.trim() || merchant.upiId,
                    address: addressInput.trim() || merchant.address,
                    gstin: gstinInput.trim() || merchant.gstin,
                  });
                  setShowEditShopModal(false);
                  setToastMessage('Dukan profile safaltapoorvak update ho gayi!');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Add Bank Account Modal */}
      <AddBankAccountModal
        isOpen={showAddBankModal}
        onClose={() => setShowAddBankModal(false)}
        onAddAccount={handleAddAccount}
        existingAccountsCount={bankAccounts.length}
      />

      {/* Real Edit Store Location & Bill Notes Modal */}
      <EditStoreDetailsModal
        isOpen={showEditDetailsModal}
        activeTab={editDetailsTab}
        onClose={() => setShowEditDetailsModal(false)}
        merchant={merchant}
        onUpdateMerchant={onUpdateMerchant}
      />

      {/* Android APK Modal */}
      <InstallApkModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
      />

      {/* Security PIN Change Modal */}
      <SecurityPinModal
        isOpen={showChangePinModal}
        onClose={() => setShowChangePinModal(false)}
        onSuccess={() => setShowChangePinModal(false)}
        isSettingNewPin={true}
        onPinChanged={handlePinChanged}
      />
    </div>
  );
};
