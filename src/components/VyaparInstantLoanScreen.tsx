import React, { useState } from 'react';
import { AppScreen } from '../types';
import {
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  Bell,
  ShieldCheck,
  Landmark,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Calendar,
  Building2,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface VyaparInstantLoanScreenProps {
  onNavigate: (screen: AppScreen) => void;
  shopName?: string;
}

const loanTranslations = {
  en: {
    screenTitle: 'Vyapar Loan Credit Line',
    cibilScore: 'CIBIL & VYAPAR SCORE',
    topPercent: 'Top 4%',
    scoreRating: 'Very Strong',
    scoreCalc: 'Calculated from your last 6 months regular QR sales (₹4.2 Lakh avg monthly) and 99.4% on-time supplier payments.',
    nbfcPartner: 'RBI-Regulated NBFC Partners:',
    congrats: '🎉 Congratulations Sharma Ji!',
    instantDisbursal: 'Instant Disbursal',
    approvedLimit: 'Approved Business Credit Limit',
    directToAccount: 'direct to your business account',
    zeroCollateral: '0 Collateral',
    zeroPaperwork: 'Zero Paperwork',
    fiveMins: '5 Mins Transfer',
    bankAccount: 'HDFC Bank A/c ••4921',
    interestRate: 'Interest @ 1.1% / month',
    chooseAmountTitle: 'Select Required Loan Amount',
    chooseAmountSub: 'How much would you like to transfer?',
    loanTransferAmount: 'LOAN TRANSFER AMOUNT',
    minAmount: 'Min: ₹25,000',
    maxAmount: 'Max: ₹3,50,000',
    tenorTitle: 'Repayment Tenure & Daily EMI',
    popularBadge: 'Popular',
    months3: '3 Months',
    months6: '6 Months',
    months12: '12 Months',
    dailyEmiPrefix: 'Daily',
    purposeTitle: 'What will you use the funds for?',
    purposes: [
      { name: 'Festive / Bulk Stock', icon: '🏪' },
      { name: 'Shop Renovation', icon: '🔨' },
      { name: 'Clear Wholesaler Khata', icon: '🧾' },
      { name: 'Deep Fridge / Counter', icon: '🧊' },
    ],
    autoDeductTitle: 'Daily Counter Auto-Deduct',
    autoDeductSub: 'Tension-Free Daily Settlements',
    howItWorksTitle: 'How Does It Work?',
    howItWorksDesc: (daily: number) =>
      `Only ₹${daily.toLocaleString('en-IN')} will be automatically deducted from your daily evening QR/UPI sales. No heavy monthly EMI burden at month-end!`,
    zeroForeclosure: 'Zero Foreclosure Fee (Close anytime)',
    viewTerms: 'View Terms',
    activeLineTitle: 'Active Working Capital Line',
    totalSanctioned: 'Total Sanctioned:',
    pendingBalance: 'Outstanding Balance (Pending):',
    repaidInfo: '₹45,000 Repaid (60%)',
    daysRemaining: '42 days remaining',
    tonightDeduction: 'Tonight 9:00 PM Deduction:',
    khataLedgerBtn: '📖 Khata Ledger',
    prepayBtn: '💸 Prepay / Close Line',
    kycTitle: '100% Digital KYC Complete',
    kycSub: 'Aadhaar, PAN and GSTIN are already verified for Sharma Store.',
    transparentTitle: 'Transparent Terms (No Hidden Charges)',
    processingFeeWaived: 'Processing fee 1.5% (₹3,000) WAIVED (QuickBill Pro Offer)',
    loanMitraTitle: 'Dedicated Business Loan Advisor',
    loanMitraSub: 'Call for store assistance: 1800-200-8899 (Toll Free)',
    footerTenor: (m: number, emi: number) => `${m} Months • Daily EMI ₹${emi.toLocaleString('en-IN')} / day`,
    payoutLabel: 'Payout:',
    transferBtn: 'Instant Transfer to Bank',
    toastTransfer: (amt: number) => `₹${amt.toLocaleString('en-IN')} is being transferred to HDFC Bank A/c ••4921 within 5 minutes!`,
    toastTerms: 'Loan Guidelines & NBFC Terms: Zero prepayment penalty.',
    toastNotification: 'Pre-approved limit ₹3.5 Lakh active.',
    toastPreclosure: 'Pre-closure terms: 0% charges anytime.',
    toastLedger: 'Loan Statement & Repayment Ledger Loaded',
    toastPrepay: 'Pre-pay remaining ₹30,000 option opened!',
  },
  hi: {
    screenTitle: 'व्यापार लोन क्रेडिट लाइन',
    cibilScore: 'CIBIL & व्यापार स्कोर',
    topPercent: 'शीर्ष 4%',
    scoreRating: 'बहुत मजबूत',
    scoreCalc: 'पिछले 6 महीनों की नियमित QR बिक्री (₹4.2 लाख औसत मासिक) और 99.4% समय पर सप्लायर भुगतान पर आधारित।',
    nbfcPartner: 'RBI-अधिकृत NBFC पार्टनर्स:',
    congrats: '🎉 बधाई हो शर्मा जी!',
    instantDisbursal: 'तुरंत बैंक में',
    approvedLimit: 'स्वीकृत व्यापार क्रेडिट सीमा',
    directToAccount: 'सीधे आपके बैंक खाते में',
    zeroCollateral: '0 ज़मानत (Collateral)',
    zeroPaperwork: 'बिना कागज़ात',
    fiveMins: '5 मिनट में ट्रांसफर',
    bankAccount: 'HDFC Bank A/c ••4921',
    interestRate: 'ब्याज @ 1.1% / महीना',
    chooseAmountTitle: 'ज़रूरत अनुसार राशि चुनें',
    chooseAmountSub: 'कितने रुपये ट्रांसफर करने हैं?',
    loanTransferAmount: 'लोन ट्रांसफर राशि',
    minAmount: 'न्यूनतम: ₹25,000',
    maxAmount: 'अधिकतम: ₹3,50,000',
    tenorTitle: 'भुगतान अवधि (Tenor) एवं दैनिक EMI',
    popularBadge: 'लोकप्रिय',
    months3: '3 महीने',
    months6: '6 महीने',
    months12: '12 महीने',
    dailyEmiPrefix: 'दैनिक',
    purposeTitle: 'पैसों का उपयोग किसमें करेंगे?',
    purposes: [
      { name: 'त्योहार / थोक माल स्टॉक', icon: '🏪' },
      { name: 'दुकान नवीनीकरण', icon: '🔨' },
      { name: 'थोक व्यापारी खाता भुगतान', icon: '🧾' },
      { name: 'डीप फ्रिज / नया काउंटर', icon: '🧊' },
    ],
    autoDeductTitle: 'दैनिक गल्ला ऑटो-कटौती',
    autoDeductSub: 'तनाव-मुक्त दैनिक सेटलमेंट',
    howItWorksTitle: 'यह कैसे काम करता है?',
    howItWorksDesc: (daily: number) =>
      `दुकान की शाम की UPI / QR बिक्री से केवल ₹${daily.toLocaleString('en-IN')} स्वतः कटेंगे। महीने के अंत में किसी भारी EMI का बोझ नहीं रहेगा!`,
    zeroForeclosure: 'शून्य प्री-क्लोज़र शुल्क (कभी भी बंद करें)',
    viewTerms: 'नियम देखें',
    activeLineTitle: 'सक्रिय वर्किंग कैपिटल लाइन',
    totalSanctioned: 'कुल स्वीकृत:',
    pendingBalance: 'बकाया राशि (Pending):',
    repaidInfo: '₹45,000 चुकाए (60%)',
    daysRemaining: '42 दिन शेष',
    tonightDeduction: 'आज रात 09:00 बजे कटौती:',
    khataLedgerBtn: '📖 लोन खाता बही',
    prepayBtn: '💸 पहले चुकाएं / बंद करें',
    kycTitle: '100% डिजिटल KYC सत्यापित',
    kycSub: 'शर्मा स्टोर के आधार, पैन और GSTIN पहले से सत्यापित हैं।',
    transparentTitle: 'स्पष्ट नियम (कोई छिपा शुल्क नहीं)',
    processingFeeWaived: 'प्रोसेसिंग शुल्क 1.5% (₹3,000) माफ़ (QuickBill Pro ऑफर)',
    loanMitraTitle: 'समर्पित व्यापार लोन मित्र',
    loanMitraSub: 'दुकान सहायता हेतु कॉल करें: 1800-200-8899 (टोल फ्री)',
    footerTenor: (m: number, emi: number) => `${m} महीने • दैनिक EMI ₹${emi.toLocaleString('en-IN')} / दिन`,
    payoutLabel: 'पेआउट:',
    transferBtn: 'तुरंत बैंक में ट्रांसफर करें',
    toastTransfer: (amt: number) => `₹${amt.toLocaleString('en-IN')} HDFC बैंक खाते ••4921 में 5 मिनट में ट्रांसफर हो रहे हैं!`,
    toastTerms: 'लोन नियम व शर्तें: शून्य प्रीपेमेंट पेनल्टी।',
    toastNotification: 'प्री-अप्रूव्ड लिमिट ₹3.5 लाख सक्रिय है।',
    toastPreclosure: 'प्री-क्लोज़र शर्तें: 0% चार्ज कभी भी।',
    toastLedger: 'लोन स्टेटमेंट और रीपेमेंट खाता लोड हुआ',
    toastPrepay: 'बाकी ₹30,000 प्रीपे करने का विकल्प खुला!',
  },
  hinglish: {
    screenTitle: 'Vyapar Loan Credit Line',
    cibilScore: 'CIBIL & VYAPAR SCORE',
    topPercent: 'Top 4%',
    scoreRating: 'Bohot Mazboot',
    scoreCalc: 'Pichle 6 mahine ki regular QR bikri (₹4.2 Lakh avg monthly) aur 99.4% on-time supplier khata chukane par calculate kiya gaya hai.',
    nbfcPartner: 'RBI-Regulated NBFC Partners:',
    congrats: '🎉 Mubarak Sharma Ji!',
    instantDisbursal: 'Instant Disbursal',
    approvedLimit: 'Approved Business Credit Limit',
    directToAccount: 'tak seedhe galla me',
    zeroCollateral: '0 Collateral',
    zeroPaperwork: 'Zero Kagaz',
    fiveMins: '5 Mins A/c',
    bankAccount: 'HDFC Bank A/c ••4921',
    interestRate: 'Biyaj @ 1.1% / mahina',
    chooseAmountTitle: 'Apni Zaroorat Ka Amount Chunein',
    chooseAmountSub: 'Kitne rupaye transfer karne hain?',
    loanTransferAmount: 'LOAN TRANSFER AMOUNT',
    minAmount: 'Min: ₹25,000',
    maxAmount: 'Max: ₹3,50,000',
    tenorTitle: 'Chukane Ki Muddat (Tenor & Rozana EMI)',
    popularBadge: 'Popular',
    months3: '3 Mahine',
    months6: '6 Mahine',
    months12: '12 Mahine',
    dailyEmiPrefix: 'Daily',
    purposeTitle: 'Paison Ka Istemal Kisme Karenge?',
    purposes: [
      { name: 'Diwali / Bulk Stock', icon: '🏪' },
      { name: 'Dukaan Renovation', icon: '🔨' },
      { name: 'Wholesaler Khata Chukaana', icon: '🧾' },
      { name: 'Deep Fridge / Counter', icon: '🧊' },
    ],
    autoDeductTitle: 'Rozana Galla Auto-Deduct',
    autoDeductSub: 'Tension-Free Daily Settlements',
    howItWorksTitle: 'Kese Kaam Karta Hai?',
    howItWorksDesc: (daily: number) =>
      `Dukaan ki rozana sham ki UPI / QR bikri se sirf ₹${daily.toLocaleString('en-IN')} auto-katenge. Mahine ke aakhir mein kisi bhari-bharkam EMI ka bojh nahi rahega!`,
    zeroForeclosure: 'Zero Foreclosure Fee (Kabhi bhi band karein)',
    viewTerms: 'Niyam Dekhein',
    activeLineTitle: 'Chalu Working Capital Line',
    totalSanctioned: 'Total Sanctioned:',
    pendingBalance: 'Baqi Rakam (Pending):',
    repaidInfo: '₹45,000 Chukaye (60%)',
    daysRemaining: '42 din baqi',
    tonightDeduction: 'Aaj Raat 9:00 PM Deduction:',
    khataLedgerBtn: '📖 Khata Ledger',
    prepayBtn: '💸 Prepay / Band Karein',
    kycTitle: '100% Digital KYC Sampanna',
    kycSub: 'Aadhaar, PAN aur GSTIN number pehle se verified hain Sharma Store ke.',
    transparentTitle: 'Spasht Niyam (No Hidden Charges)',
    processingFeeWaived: 'Processing fee 1.5% (₹3,000) MAAF (QuickBill Pro Offer)',
    loanMitraTitle: 'Dedicated Vyapar Loan Mitra',
    loanMitraSub: 'Dukaan par sahaita ke liye call karein: 1800-200-8899 (Toll Free)',
    footerTenor: (m: number, emi: number) => `${m} Mahine • EMI ₹${emi.toLocaleString('en-IN')} / din`,
    payoutLabel: 'Payout:',
    transferBtn: 'Instant Transfer',
    toastTransfer: (amt: number) => `₹${amt.toLocaleString('en-IN')} HDFC Bank A/c ••4921 mein 5 minute mein transfer ho rahe hain!`,
    toastTerms: 'Loan Guidelines & NBFC Terms: Zero prepayment penalty.',
    toastNotification: 'Pre-approved limit ₹3.5 Lakh active.',
    toastPreclosure: 'Pre-closure terms: 0% charges anytime.',
    toastLedger: 'Loan Statement & Repayment Ledger Loaded',
    toastPrepay: 'Pre-pay remaining ₹30,000 option opened!',
  },
};

export const VyaparInstantLoanScreen: React.FC<VyaparInstantLoanScreenProps> = ({
  onNavigate,
  shopName = 'Sharma General Store',
}) => {
  const { language } = useLanguage();
  const tx = loanTranslations[language as 'en' | 'hi' | 'hinglish'] || loanTranslations.en;

  const [loanAmount, setLoanAmount] = useState<number>(280000);
  const [tenure, setTenure] = useState<number>(6); // 3, 6, 12 months
  const [selectedPurpose, setSelectedPurpose] = useState<string>(tx.purposes[0].name);
  const [autoDeduct, setAutoDeduct] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getDailyEmi = () => {
    if (tenure === 3) return Math.round((loanAmount * 1.035) / 90);
    if (tenure === 6) return Math.round((loanAmount * 1.066) / 180);
    return Math.round((loanAmount * 1.12) / 365);
  };

  const handleInstantTransfer = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
    setToastMessage(tx.toastTransfer(loanAmount));
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-28">
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
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {tx.screenTitle}
            </h1>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span>{shopName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setToastMessage(tx.toastTerms);
              setTimeout(() => setToastMessage(null), 2500);
            }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => {
                setToastMessage(tx.toastNotification);
                setTimeout(() => setToastMessage(null), 2500);
              }}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </div>
          <button
            onClick={() => onNavigate('store_profile')}
            className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs ml-1 cursor-pointer hover:bg-emerald-900 transition-colors"
            title="Store Profile & Settings"
          >
            👤
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Card 1: CIBIL & Vyapar Score */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{tx.cibilScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-6 flex items-center justify-center">
                <div className="w-12 h-6 rounded-t-full border-4 border-emerald-600 border-b-0 flex items-end justify-center">
                  <span className="text-[10px] font-bold text-emerald-800 pb-0.5">{tx.topPercent}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">785</span>
            <span className="text-xs text-slate-400 font-semibold">/900</span>
            <span className="ml-1 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              {tx.scoreRating}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed font-medium">
            {tx.scoreCalc}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-600 font-medium">
            <Landmark className="w-3.5 h-3.5 text-slate-500" />
            <span>{tx.nbfcPartner}</span>
            <span className="font-bold text-slate-800">IDFC FIRST • Oxyzo</span>
          </div>
        </div>

        {/* Card 2: Approved Business Credit Limit (Emerald Green Hero) */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold bg-emerald-700/60 text-emerald-100 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
              {tx.congrats}
            </span>
            <span className="text-xs font-bold bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" /> {tx.instantDisbursal}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-xs text-emerald-200 font-medium">
              {tx.approvedLimit}
            </div>
            <div className="text-3xl font-black tracking-tight text-white mt-0.5">
              ₹3,50,000
            </div>
            <div className="text-xs text-emerald-300 font-medium mt-0.5">
              {tx.directToAccount}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-700/60 text-center text-xs">
            <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl p-2">
              <div className="text-emerald-300">✓</div>
              <div className="font-bold text-white text-[11px] mt-0.5">{tx.zeroCollateral}</div>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl p-2">
              <div className="text-emerald-300">📄</div>
              <div className="font-bold text-white text-[11px] mt-0.5">{tx.zeroPaperwork}</div>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl p-2">
              <div className="text-emerald-300">⏱️</div>
              <div className="font-bold text-white text-[11px] mt-0.5">{tx.fiveMins}</div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-emerald-700/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Building2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>{tx.bankAccount}</span>
            </div>
            <span className="bg-emerald-900/90 text-emerald-200 font-bold px-2 py-0.5 rounded border border-emerald-600/50 text-[11px]">
              {tx.interestRate}
            </span>
          </div>
        </div>

        {/* Card 3: Amount Selection & Tenure */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {tx.chooseAmountTitle}
              </h3>
              <p className="text-[11px] text-slate-500">{tx.chooseAmountSub}</p>
            </div>
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          </div>

          {/* Amount Display & Slider */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {tx.loanTransferAmount}
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              ₹{loanAmount.toLocaleString('en-IN')}
            </div>

            <div className="mt-3">
              <input
                type="range"
                min="25000"
                max="350000"
                step="5000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-1">
                <span>{tx.minAmount}</span>
                <span>{tx.maxAmount}</span>
              </div>
            </div>
          </div>

          {/* Tenor & Daily EMI Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">
              {tx.tenorTitle}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { months: 3, label: tx.months3, daily: Math.round((loanAmount * 1.035) / 90) },
                { months: 6, label: tx.months6, daily: Math.round((loanAmount * 1.066) / 180), popular: true },
                { months: 12, label: tx.months12, daily: Math.round((loanAmount * 1.12) / 365) },
              ].map((item) => (
                <button
                  key={item.months}
                  onClick={() => setTenure(item.months)}
                  className={`p-2.5 rounded-xl border text-center transition-all relative cursor-pointer ${
                    tenure === item.months
                      ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                      {tx.popularBadge}
                    </span>
                  )}
                  <div className="text-xs font-bold text-slate-900">{item.label}</div>
                  <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                    {tx.dailyEmiPrefix} ₹{item.daily.toLocaleString('en-IN')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Purpose Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">
              {tx.purposeTitle}
            </label>
            <div className="flex flex-wrap gap-2">
              {tx.purposes.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => setSelectedPurpose(tag.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    selectedPurpose === tag.name
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{tag.icon}</span>
                  <span>{tag.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Daily Auto-Deduct */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
                💳
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{tx.autoDeductTitle}</h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {tx.autoDeductSub}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoDeduct(!autoDeduct)}
              aria-label="Toggle auto deduct"
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoDeduct ? 'bg-emerald-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  autoDeduct ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <span className="text-base text-indigo-700">💡</span>
              <p className="leading-relaxed">
                <span className="font-bold text-slate-900">{tx.howItWorksTitle}</span>{' '}
                {tx.howItWorksDesc(getDailyEmi())}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{tx.zeroForeclosure}</span>
            </div>
            <button
              onClick={() => {
                setToastMessage(tx.toastPreclosure);
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="text-indigo-700 font-bold hover:underline text-[11px] cursor-pointer"
            >
              {tx.viewTerms}
            </button>
          </div>
        </div>

        {/* Card 5: Active Working Capital Line */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h4 className="text-xs font-bold text-slate-900">{tx.activeLineTitle}</h4>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              A/c #VYP-7819
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] text-slate-500 font-medium">{tx.totalSanctioned}</span>
              <div className="text-base font-bold text-slate-900">₹75,000</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-medium">
                {tx.pendingBalance}
              </span>
              <div className="text-base font-black text-rose-600">₹30,000</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full w-[60%]"></div>
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-1">
              <span className="text-emerald-700">{tx.repaidInfo}</span>
              <span>{tx.daysRemaining}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>{tx.tonightDeduction}</span>
            </div>
            <span className="font-bold text-slate-900">₹450</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setToastMessage(tx.toastLedger);
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {tx.khataLedgerBtn}
            </button>
            <button
              onClick={() => {
                setToastMessage(tx.toastPrepay);
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="py-2 px-3 bg-indigo-100/70 hover:bg-indigo-200/70 text-indigo-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {tx.prepayBtn}
            </button>
          </div>
        </div>

        {/* Card 6: Transparency & KYC Status */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              ✓
            </div>
            <div>
              <h5 className="font-bold text-slate-900">{tx.kycTitle}</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {tx.kycSub}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              %
            </div>
            <div>
              <h5 className="font-bold text-slate-900">{tx.transparentTitle}</h5>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {tx.processingFeeWaived}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900">{tx.loanMitraTitle}</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {tx.loanMitraSub}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 z-30 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">
              {tx.footerTenor(tenure, getDailyEmi())}
            </div>
            <div className="text-base font-black text-emerald-800">
              {tx.payoutLabel} ₹{loanAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={handleInstantTransfer}
            className="flex-1 py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-emerald-300 fill-current" />
            <span>{tx.transferBtn}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
