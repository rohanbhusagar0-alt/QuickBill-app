import React, { useState } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { validateIndiaDatacenterConnection } from '../services/firebase';
import { InstallApkModal } from './InstallApkModal';

interface StoreProfileSetupScreenProps {
  onNavigate: (screen: AppScreen) => void;
  merchant: MerchantProfile;
  onUpdateMerchant: (updated: Partial<MerchantProfile>) => void;
}

export const StoreProfileSetupScreen: React.FC<StoreProfileSetupScreenProps> = ({
  onNavigate,
  merchant,
  onUpdateMerchant,
}) => {
  const { t, language } = useLanguage();
  const [gstAutofill, setGstAutofill] = useState(true);
  const [biometricLock, setBiometricLock] = useState(true);
  const [continuousBarcodeBeep, setContinuousBarcodeBeep] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showApkModal, setShowApkModal] = useState(false);

  const handleCopyGstin = () => {
    navigator.clipboard?.writeText(merchant.gstin || '07AABCS1429B1Z');
    setToastMessage(t('copied', 'GSTIN Copied!'));
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20 select-none">
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
                {t('quickbill_multi_store', 'QuickBill Multi-Store')}
              </h1>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200">
                {t('multi_store_badge', 'Multi-Store')}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span>{t('main_bazar_branch', 'Main Bazar Branch')}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setToastMessage('Search Store Settings');
              setTimeout(() => setToastMessage(null), 1500);
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-emerald-600"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-xs space-y-3.5">
          <div className="flex items-start gap-3.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=160&auto=format&fit=crop&q=80"
                alt="Shop frontage"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
              />
              <button
                onClick={() => {
                  setToastMessage('Upload Store Photo');
                  setTimeout(() => setToastMessage(null), 1500);
                }}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs shadow-xs cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {merchant.shopName || 'Sharma General & Provision Store'}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-semibold text-slate-700">{merchant.name || 'Rajesh Sharma'}</span>
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
                  {merchant.gstin || '07AABCS1429B1Z'}
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

        {/* Quick Controls */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{t('quick_controls', 'Quick Controls')}</h3>
            <span className="text-xs font-semibold text-emerald-800">{t('all_active', 'All Active')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Control 1 */}
            <div
              onClick={() => {
                setToastMessage(t('change_language_title', 'App Language: 12 Languages Available'));
                setTimeout(() => setToastMessage(null), 2500);
              }}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🇮🇳</span>
                <span className="text-slate-400">›</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">{t('app_language_label', 'App Language')}</div>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">{t('app_language_value', 'English (12 Lang)')}</h4>
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
                  setToastMessage('Location edit open');
                  setTimeout(() => setToastMessage(null), 1500);
                }}
                className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
              >
                {t('edit', 'Edit')}
              </button>
            </div>
            <p className="text-xs text-slate-900 font-medium leading-relaxed">
              {merchant.address || 'Shop No. 14, Main Market, Sector 18, Noida, Uttar Pradesh - 201301'}
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
                  setToastMessage('Header note customizer');
                  setTimeout(() => setToastMessage(null), 1500);
                }}
                className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
              >
                {t('customize', 'Customize')}
              </button>
            </div>
            <p className="text-xs text-slate-800 font-medium">
              Header: {merchant.shopName || 'Sharma General Store'} ({merchant.phone || '+91 98765 43210'})
            </p>
            <div className="text-[11px] italic bg-white border border-slate-200/60 rounded-lg p-2 text-slate-600">
              "उधार प्रेम की कैंची है / Thank you, visit again!"
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
              onClick={() => {
                setToastMessage('Add New Bank Account');
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              {t('add_new', '+ Add New')}
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
                  <span className="text-xs font-bold text-slate-900">{merchant.upiId || 'sharmastore@okicici'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] text-slate-500">{t('default_settlement_qr', 'Default QR Settlement UPI ID')}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              {t('default_badge', 'Default')}
            </span>
          </div>

          {/* Bank Account */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">State Bank of India</h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  A/C: ••••••••4920 • IFSC: SBIN0001489
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setToastMessage('Bank account manager open');
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              {t('manage', 'Manage')}
            </button>
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
            onClick={() => {
              setToastMessage('Session logged out securely.');
              onNavigate('merchant_login');
            }}
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

      {/* Android APK Modal */}
      <InstallApkModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />
    </div>
  );
};
