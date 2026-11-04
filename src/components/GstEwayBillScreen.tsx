import React, { useState } from 'react';
import { AppScreen } from '../types';
import {
  ArrowLeft,
  Calendar,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Share2,
  Truck,
  Plus,
  Search,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface GstEwayBillScreenProps {
  onNavigate: (screen: AppScreen) => void;
  shopName?: string;
  gstin?: string;
}

export const GstEwayBillScreen: React.FC<GstEwayBillScreenProps> = ({
  onNavigate,
  shopName = 'Sharma General Store',
  gstin = '07AABCS1429B1Z',
}) => {
  const { t, language, supportedLanguages } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEwayModal, setShowEwayModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [consigneeName, setConsigneeName] = useState('Verma Wholesalers');
  const [invoiceAmount, setInvoiceAmount] = useState('72400');
  const [vehicleNumber, setVehicleNumber] = useState('DL 1L AA 9021');

  const currentLangLabel = supportedLanguages.find((l) => l.code === language)?.native || 'English';

  // Dynamic localized content dictionary
  const isEn = language === 'en';
  const isHi = language === 'hi';

  const strings = {
    langPill: currentLangLabel,
    preSavedTax: isEn
      ? 'Input Tax Credit (ITC) Saved'
      : isHi
      ? 'पहले से बचाया गया टैक्स (ITC)'
      : 'Pehle Se Bachaya Gaya Tax',
    savedPercent: isEn ? 'Saved 41%' : isHi ? '41% बचत' : 'Saved 41%',
    verifiedItcBadge: isEn
      ? '100% Verified Input Tax Credit (ITC)'
      : isHi
      ? '100% सत्यापित इनपुट टैक्स क्रेडिट (ITC)'
      : '100% Verified Input Tax Credit (ITC)',
    autoOptimizedBadge: 'AUTO-OPTIMIZED',
    outputGst: isEn
      ? 'Output GST (Collected on Sales)'
      : isHi
      ? 'आउटपुट GST (बिक्री पर लिया)'
      : 'Output GST (Sales se liya)',
    inputGst: isEn
      ? 'Input GST Credit (Purchase Bills)'
      : isHi
      ? 'इनपुट GST क्रेडिट (खरीद बिल)'
      : 'Input GST Credit (Purchase Bills)',
    netGstPayable: isEn
      ? 'Net GST Payable'
      : isHi
      ? 'शुद्ध GST देय राशि'
      : 'Net GST Bharna Hai',
    withoutItc: isEn ? '₹42,100 without ITC' : isHi ? '₹42,100 बिना ITC' : '₹42,100 bina ITC',
    seeSavingsBtn: isEn
      ? 'See How You Saved ₹17,420'
      : isHi
      ? 'देखें ₹17,420 कैसे बचाए'
      : 'Dekhein Kaise ₹17,420 Bachaye',
    superpowersTitle: isEn
      ? '1-Click GST Superpowers'
      : isHi
      ? '1-क्लिक GST स्मार्ट फीचर्स'
      : '1-Click GST Superpowers',
    instantSync: isEn ? 'Instant Sync' : isHi ? 'तुरंत सिंक' : 'Instant Sync',
    caReportTitle: isEn ? '1-Click CA Ready Report' : isHi ? '1-क्लिक CA रेडी रिपोर्ट' : '1-Click CA Ready Report',
    caReportDesc: isEn
      ? 'Directly send complete P&L, GSTR-1, GSTR-3B audit data to your CA on WhatsApp without hassle.'
      : isHi
      ? 'अपने CA / टैक्स एडवोकेट को पूरा P&L, GSTR-1, GSTR-3B डेटा सीधे WhatsApp पर भेजें बिना किसी झंझट।'
      : 'Apne CA / Tax Advocate ko pura P&L, GSTR-1, GSTR-3B data WhatsApp par seedha bhejein bina kisi jhanjhat.',
    caShareBtn: isEn ? 'Send to CA on WhatsApp' : isHi ? 'CA को WhatsApp भेजें' : 'CA Ko WhatsApp Bhejein',
    ewayTitle: isEn
      ? 'Instant E-Way Bill Generator'
      : isHi
      ? 'तुरंत ई-वे बिल जनरेटर'
      : 'Instant E-Way Bill Generator',
    ewayDesc: isEn
      ? 'Generate government-standard QR-coded E-Way bill for consignments above ₹50,000 in 30 seconds.'
      : isHi
      ? '₹50,000 से अधिक माल भेजने हेतु 30 सेकंड में सरकारी मानक QR-कोड ई-वे बिल बनाएं।'
      : '₹50,000 se zyada maal bhejne ke liye 30 second mein QR-coded government standard E-Way bill banayein.',
    ewayBtn: isEn ? '+ Generate New E-Way Bill' : isHi ? '+ नया ई-वे बिल बनाएं' : '+ Naya E-Way Bill Banayein',
    hsnTitle: isEn ? 'Smart HSN & Rate Finder' : isHi ? 'स्मार्ट HSN कोड व टैक्स दर' : 'Smart HSN & Rate Finder',
    aiSuggestion: isEn ? 'AI Suggestion' : isHi ? 'AI सुझाव' : 'AI Suggestion',
    searchPlaceholder: isEn
      ? 'Search any item (Mustard Oil, Basmati...)'
      : isHi
      ? 'कोई भी सामान खोजें (सरसों तेल, बासमती...)'
      : 'Koi bhi item search karein (Mustard Oil, Basmati...)',
    itcDetectorTitle: 'QuickBill Auto-ITC Detector:',
    itcDetectorDesc: isEn
      ? 'Detected 4 supplier bills with missed ITC, automatically claimed extra ₹3,450 credit!'
      : isHi
      ? 'आपके 4 सप्लायर बिल में ITC छूट रहा था, QuickBill ने ऑटो-डिटेक्ट कर ₹3,450 का अतिरिक्त क्लेम जोड़ दिया!'
      : 'Aapke 4 supplier bills mein ITC miss ho raha tha, QuickBill ne auto-detect karke ₹3,450 extra claim jod diya!',
    taxAuditTitle: isEn ? 'Tax Audit Health' : isHi ? 'टैक्स ऑडिट हेल्थ' : 'Tax Audit Health',
    taxAuditSub: isEn
      ? 'Safe from scrutiny & departmental notice'
      : isHi
      ? 'सरकारी नोटिस व जांच से 100% सुरक्षित'
      : 'Safe from scrutiny & departmental notice',
    auditCheck1: isEn
      ? 'All Sales Bills linked with verified Customer/B2B GSTIN'
      : isHi
      ? 'सभी बिक्री बिलों पर मान्य कस्टमर/B2B GSTIN लिंक है'
      : 'Sabhi Sale Bills par valid Customer/B2B GSTIN linked hain',
    auditCheck2: isEn
      ? 'Mandi purchases reconciled and RCM (Reverse Charge) auto-credited'
      : isHi
      ? 'मंडी खरीद RCM (रिवर्स चार्ज) ऑटो-क्रेडिट व रिकंसाइल्ड है'
      : 'Mandi purchases se RCM (Reverse Charge) reconciled aur auto-credited',
    billFlaggedTitle: isEn
      ? '1 Bill flagged: ₹65,000 Purchase without E-Way Bill'
      : isHi
      ? '1 बिल फ्लैग्ड: ₹65,000 खरीद बिना ई-वे बिल'
      : '1 Bill flagged: ₹65,000 Purchase bina E-Way Bill ke',
    billFlaggedSub: isEn
      ? 'Link invoice number to avoid penalty'
      : isHi
      ? 'जुर्माने से बचने के लिए बिल नंबर लिंक करें'
      : 'Penalty se bachne ke liye bill number link karein',
    fixNow: isEn ? 'Fix Now' : isHi ? 'अभी ठीक करें' : 'Fix Now',
    recentFilingsTitle: isEn
      ? 'Recent GST Filings & Passes'
      : isHi
      ? 'हालिया GST फाइलिंग व पास'
      : 'Recent GST Filings & Passes',
    viewAll: isEn ? 'View All' : isHi ? 'सभी देखें' : 'Sab Dekhein',
    fileChallanBtn: isEn ? 'File Challan / Pay Tax' : isHi ? 'टैक्स चालान फाइल करें' : 'Challan / Tax File Karein',
    modalTitle: isEn ? 'Instant E-Way Bill (30 Sec)' : isHi ? 'तुरंत ई-वे बिल (30 सेकंड)' : 'Instant E-Way Bill (30 Sec)',
    consigneeLabel: isEn ? 'Recipient / Consignee Name' : isHi ? 'प्राप्तकर्ता / व्यापारी का नाम' : 'Kisko Bhej Rahe Hain',
    amountLabel: isEn ? 'Bill / Invoice Value (₹)' : isHi ? 'बिल राशि (₹)' : 'Bill / Invoice Rashi (₹)',
    vehicleLabel: isEn ? 'Vehicle Number (Gaadi No.)' : isHi ? 'गाड़ी नंबर (Vehicle Number)' : 'Gaadi Number (Vehicle No.)',
    generateBtn: isEn
      ? 'Generate E-Way Bill via NIC Portal'
      : isHi
      ? 'सरकारी NIC पोर्टल से ई-वे बिल बनाएं'
      : 'Government NIC Portal Se E-Way Generate Karein',
  };

  const hsnItems = [
    {
      id: '1',
      name: isEn ? 'Mustard Oil (15L Tin)' : isHi ? 'सरसों का तेल (15 लीटर टिन)' : 'Mustard Oil (15L Tin)',
      hsn: 'HSN: 1514 • 0% Cess',
      rate: '5% GST',
      tag: isEn ? 'Standard Rate' : isHi ? 'मानक दर' : 'Standard Rate',
      icon: '🛢️',
    },
    {
      id: '2',
      name: isEn ? 'Cosmetic Creams / Soaps' : isHi ? 'कॉस्मेटिक क्रीम / साबुन' : 'Cosmetic Creams / Soaps',
      hsn: 'HSN: 3401 • 100% ITC Eligible',
      rate: '18% GST',
      tag: isEn ? '+ITC Claimable' : isHi ? '+ITC क्लेम योग्य' : '+ITC Claimable',
      icon: '🧼',
    },
    {
      id: '3',
      name: isEn ? 'Basmati Rice Premium (Loose)' : isHi ? 'बासमती चावल प्रीमियम (खुला)' : 'Basmati Rice Premium (Loose)',
      hsn: 'HSN: 1006 • 0% Cess',
      rate: '0% GST',
      tag: isEn ? 'Exempted (Loose)' : isHi ? 'टैक्स मुक्त (खुला)' : 'Exempted (Loose)',
      icon: '🌾',
    },
    {
      id: '4',
      name: isEn ? 'Branded Packed Atta 10kg' : isHi ? 'ब्रांडेड पैक्ड आटा 10 कि.ग्रा.' : 'Branded Packed Atta 10kg',
      hsn: 'HSN: 1101 • Pre-packaged',
      rate: '5% GST',
      tag: isEn ? 'ITC Eligible' : isHi ? 'ITC योग्य' : 'ITC Eligible',
      icon: '🍞',
    },
  ];

  const filteredHsn = hsnItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hsn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEway = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
    });
    setShowEwayModal(false);
    setToastMessage(isEn ? 'E-Way Bill #98421098 Generated Successfully!' : 'ई-वे बिल #98421098 सफलतापूर्वक जनरेट हुआ!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareCA = () => {
    const text = `📊 *${shopName} - GST Report & ITC Summary*\nGSTIN: ${gstin}\nPeriod: October 2023 (Q3)\n\n• Output GST (Sales): ₹42,100\n• Input GST Credit (ITC): -₹17,420\n• Net GST Payable: ₹24,680\n\nFull GSTR-1 & GSTR-3B Excel ready on QuickBill Cloud.`;
    navigator.clipboard?.writeText(text);
    setToastMessage(isEn ? 'CA Report Summary & WhatsApp Link Copied!' : 'CA रिपोर्ट सारांश व लिंक कॉपी हुआ!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-28 select-none">
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
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Quickbill Smart GST
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{shopName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span>🌐</span> {strings.langPill}
          </span>
          <button
            onClick={() => {
              setToastMessage('GST Helpdesk & CA Consultation Helpline: 1800-200-8899');
              setTimeout(() => setToastMessage(null), 3500);
            }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
            alt="Profile avatar"
            onClick={() => onNavigate('store_profile')}
            className="w-8 h-8 rounded-full object-cover border-2 border-emerald-600 ml-1 cursor-pointer"
            title="Store Profile & Settings"
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Merchant & GSTIN Bar */}
        <div className="flex items-center justify-between text-xs text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-900 truncate">{shopName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-mono text-[11px]">{gstin}</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
            Active Filing
          </span>
        </div>

        {/* Period & Due Date Pill */}
        <div className="flex items-center justify-between text-xs bg-indigo-50/70 border border-indigo-100 px-3.5 py-2 rounded-xl text-indigo-950">
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>October 2023 (Q3)</span>
            <span className="text-slate-400">•</span>
            <span className="text-rose-600 font-bold">Due in 6 Days (20 Nov)</span>
          </div>
          <span className="text-xs">🧾</span>
        </div>

        {/* Deep Emerald Green Hero Card: ITC Savings */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold bg-emerald-700/60 text-emerald-100 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              {strings.verifiedItcBadge}
            </span>
            <span className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
              {strings.autoOptimizedBadge}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-xs font-medium text-emerald-200">{strings.preSavedTax}</div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-black tracking-tight text-white">₹24,680</span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-700/50 px-2 py-0.5 rounded-md">
                ↘ {strings.savedPercent}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-emerald-700/60 space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-100">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{strings.outputGst}</span>
              </div>
              <span className="font-bold text-white">₹42,100</span>
            </div>

            <div className="flex items-center justify-between text-emerald-100">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{strings.inputGst}</span>
              </div>
              <span className="font-bold text-emerald-300">-₹17,420</span>
            </div>

            <div className="pt-2 border-t border-emerald-700/40 flex items-center justify-between">
              <div>
                <span className="text-emerald-200 text-[11px] block">{strings.netGstPayable}</span>
                <span className="text-lg font-black text-white">₹24,680</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] line-through text-emerald-300/80 bg-emerald-900/80 px-2 py-0.5 rounded">
                  {strings.withoutItc}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setToastMessage(isEn ? 'ITC Audit Breakdown: ₹17,420 matched from supplier invoices!' : 'ITC ऑडिट: ₹17,420 सप्लायर बिलों से मैच हुआ!');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="mt-4 w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>{strings.seeSavingsBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click GST Superpowers */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">{strings.superpowersTitle}</h2>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {strings.instantSync}
            </span>
          </div>

          {/* CA Ready Report */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{strings.caReportTitle}</h3>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    Excel + PDF
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {strings.caReportDesc}
                </p>
                <button
                  onClick={handleShareCA}
                  className="mt-3 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{strings.caShareBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Instant E-Way Bill Generator */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    {strings.ewayTitle}
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    30 Sec Fast
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {strings.ewayDesc}
                </p>
                <button
                  onClick={() => setShowEwayModal(true)}
                  className="mt-3 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>{strings.ewayBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Smart HSN & Rate Finder */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span>🏷️</span> {strings.hsnTitle}
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {strings.aiSuggestion}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={strings.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-600 focus:bg-white"
            />
          </div>

          {/* HSN Cards */}
          <div className="space-y-2">
            {filteredHsn.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">{item.hsn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {item.rate}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.tag}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Auto-ITC Detector Alert */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
            <span className="text-base text-emerald-700 mt-0.5">💡</span>
            <p className="text-[11px] text-emerald-950 leading-relaxed font-medium">
              <span className="font-bold text-emerald-900">{strings.itcDetectorTitle}</span>{' '}
              {strings.itcDetectorDesc}
            </p>
          </div>
        </section>

        {/* Tax Audit Health */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{strings.taxAuditTitle}</h3>
                <p className="text-[11px] text-slate-500">{strings.taxAuditSub}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700">98</span>
              <span className="text-xs text-slate-400 font-bold">/100</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{strings.auditCheck1}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{strings.auditCheck2}</span>
            </div>
          </div>

          {/* 1 Bill Flagged Warning */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-950">
                  {strings.billFlaggedTitle}
                </h4>
                <p className="text-[10px] text-rose-700 mt-0.5">
                  {strings.billFlaggedSub}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setToastMessage(isEn ? 'Verification link for Bill #PO-784 opened!' : 'बिल #PO-784 वेरिफिकेशन लिंक खुला!');
                setTimeout(() => setToastMessage(null), 2500);
              }}
              className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer"
            >
              {strings.fixNow}
            </button>
          </div>
        </section>

        {/* Recent GST Filings & Passes */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{strings.recentFilingsTitle}</h3>
            <button
              onClick={() => {
                setToastMessage(isEn ? 'Loaded all 24 months of GST filings' : 'सभी 24 महीनों की GST फाइलिंग्स लोड हुईं');
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              {strings.viewAll}
            </button>
          </div>

          <div className="space-y-2.5">
            {/* E-Way Bill 1 */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">E-Way Bill #984210</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    To: Verma Wholesalers • Valid till 26 Oct
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">₹72,400</span>
                <button
                  onClick={() => {
                    setToastMessage(isEn ? 'E-Way Bill PDF Downloaded!' : 'ई-वे बिल PDF डाउनलोड हो गया!');
                    setTimeout(() => setToastMessage(null), 2000);
                  }}
                  className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* GSTR-1 Summary PDF */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">GSTR-1 Summary PDF</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-bold">
                      Filed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    September 2023 • ARN: AA0709230918
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setToastMessage(isEn ? 'Filed GSTR-1 Copy & Acknowledgement Downloaded!' : 'फाइल GSTR-1 कॉपी डाउनलोड हुई!');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Modal: New E-Way Bill */}
      {showEwayModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                {strings.modalTitle}
              </h3>
              <button
                onClick={() => setShowEwayModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateEway} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{strings.consigneeLabel}</label>
                <input
                  type="text"
                  value={consigneeName}
                  onChange={(e) => setConsigneeName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:outline-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{strings.amountLabel}</label>
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:outline-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{strings.vehicleLabel}</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-900 uppercase focus:outline-emerald-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md mt-2 cursor-pointer"
              >
                {strings.generateBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Sticky Bar */}
      <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 z-30 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <span>📅</span> Due: 20 Nov 2023
            </div>
            <div className="text-base font-black text-slate-900">
              ₹24,680 <span className="text-[11px] font-normal text-emerald-700">(ITC Adjusted)</span>
            </div>
          </div>

          <button
            onClick={() => {
              confetti({ particleCount: 50 });
              setToastMessage(isEn ? 'GST Challan Payment Portal Opened!' : 'GST चालान पोर्टल खुला!');
              setTimeout(() => setToastMessage(null), 2500);
            }}
            className="flex-1 py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{strings.fileChallanBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
