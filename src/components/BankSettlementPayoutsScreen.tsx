import React, { useState } from 'react';
import { AppScreen } from '../types';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Moon,
  Zap,
  CreditCard,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface BankSettlementPayoutsScreenProps {
  onNavigate: (screen: AppScreen) => void;
  shopName?: string;
  todaySales?: number;
}

const settlementTx = {
  en: {
    screenTitle: 'Bank Settlement & UPI Payouts',
    terminal: 'TERMINAL #01',
    todayCollectionsTitle: "Today's QR & POS Collections",
    gallaBadge: "Today's Collection",
    readyImps: 'Ready for Instant IMPS Settlement (0% Fee)',
    changeBtn: 'Change',
    settleBtn: '1–Tap Settle to Bank Now (Instant Credit)',
    settlingBtn: 'Processing Settlement...',
    dailyNightTitle: 'Daily Night Auto-Settle',
    dailyNightSub: 'Automatic transfer to bank account every night at 11:30 PM',
    payoutMode: 'Payout Mode: Instant IMPS Realtime',
    free247: 'Free • 24x7',
    inflowSourcesTitle: "Today's Inflow Sources",
    digitalTxns: '53 Digital Transactions',
    pastSettlementsTitle: 'Past Settlements to Bank',
    viewAll: 'View All',
    statementTitle: 'Settlement Statement',
    statementSub: 'Monthly report for CA, GST & Tax filing',
    pdfBtn: 'PDF',
    excelBtn: 'Excel',
    securityNote: 'NPCI & RBI regulated settlement rails • 256-Bit Encrypted',
    toastAlreadySettled: "All of today's collections are already settled!",
    toastSettledSuccess: (amt: number) =>
      `₹${amt.toLocaleString('en-IN')} credited instantly to State Bank of India (**4821)! UTR: 42919920194`,
    toastBankChange: 'Bank Account change option: Add secondary account.',
    toastAllPayouts: 'All Payout Statements Loaded',
    toastPdfDownloaded: 'Monthly Settlement PDF Downloaded!',
    toastExcelExported: 'Settlement Excel Ledger Exported!',
  },
  hi: {
    screenTitle: 'बैंक सेटलमेंट & UPI पेआउट्स',
    terminal: 'टर्मिनल #01',
    todayCollectionsTitle: 'आज का QR व POS कलेक्शन',
    gallaBadge: 'आज का गल्ला',
    readyImps: 'तुरंत IMPS सेटलमेंट हेतु तैयार (0% शुल्क)',
    changeBtn: 'बदलें',
    settleBtn: '1–टैप बैंक में तुरंत सेटल करें',
    settlingBtn: 'सेटलमेंट प्रक्रिया जारी...',
    dailyNightTitle: 'दैनिक रात्रि ऑटो-सेटल',
    dailyNightSub: 'हर रात 11:30 PM बैंक खाते में ऑटोमैटिक ट्रांसफर',
    payoutMode: 'पेआउट मोड: इंस्टेंट IMPS रियलटाइम',
    free247: 'मुफ़्त • 24x7',
    inflowSourcesTitle: 'आज की आवक के स्रोत',
    digitalTxns: '53 डिजिटल लेन-देन',
    pastSettlementsTitle: 'बैंक में पिछले सेटलमेंट्स',
    viewAll: 'सभी देखें',
    statementTitle: 'सेटलमेंट स्टेटमेंट',
    statementSub: 'CA, GST एवं टैक्स रिटर्न हेतु मासिक रिपोर्ट',
    pdfBtn: 'PDF',
    excelBtn: 'Excel',
    securityNote: 'NPCI व RBI अधिकृत सेटलमेंट प्रणाली • 256-बिट सुरक्षित',
    toastAlreadySettled: 'आज का सभी गल्ला पहले से सेटल हो चुका है!',
    toastSettledSuccess: (amt: number) =>
      `₹${amt.toLocaleString('en-IN')} स्टेट बैंक ऑफ इंडिया (**4821) में तुरंत क्रेडिट हो गया! UTR: 42919920194`,
    toastBankChange: 'बैंक खाता बदलने का विकल्प: सेकेंडरी खाता जोड़ें।',
    toastAllPayouts: 'सभी पेआउट स्टेटमेंट लोड हुए',
    toastPdfDownloaded: 'मासिक सेटलमेंट PDF डाउनलोड हुआ!',
    toastExcelExported: 'सेटलमेंट एक्सेल बही निर्यात हुई!',
  },
  hinglish: {
    screenTitle: 'Bank Settlement & UPI Payouts',
    terminal: 'TERMINAL #01',
    todayCollectionsTitle: "Today's QR & POS Collections",
    gallaBadge: 'Aaj Ka Galla',
    readyImps: 'Ready for Instant IMPS Settlement (0% Fee)',
    changeBtn: 'Change',
    settleBtn: '1–Tap Settle to Bank Now (Turant Bank Me Bhejein)',
    settlingBtn: 'Processing Settlement...',
    dailyNightTitle: 'Daily Night Auto-Settle',
    dailyNightSub: 'Har raat 11:30 PM bank khate me automatic transfer',
    payoutMode: 'Payout Mode: Instant IMPS Realtime',
    free247: 'Free • 24x7',
    inflowSourcesTitle: "Today's Inflow Sources",
    digitalTxns: '53 Digital Transactions',
    pastSettlementsTitle: 'Past Settlements to Bank',
    viewAll: 'View All',
    statementTitle: 'Settlement Statement',
    statementSub: 'Monthly report for CA, GST & Tax filing',
    pdfBtn: 'PDF',
    excelBtn: 'Excel',
    securityNote: 'NPCI & RBI regulated settlement rails • 256-Bit Encrypted',
    toastAlreadySettled: 'Aaj Ka Sabhi Galla Pehle Se Settled Hai!',
    toastSettledSuccess: (amt: number) =>
      `₹${amt.toLocaleString('en-IN')} State Bank of India (**4821) mein turant credit ho gaya! UTR: 42919920194`,
    toastBankChange: 'Bank Account change option: Add secondary account.',
    toastAllPayouts: 'Sabhi Payout Statements Loaded',
    toastPdfDownloaded: 'Monthly Settlement PDF Downloaded!',
    toastExcelExported: 'Settlement Excel Ledger Exported!',
  },
};

export const BankSettlementPayoutsScreen: React.FC<BankSettlementPayoutsScreenProps> = ({
  onNavigate,
  todaySales = 18450,
}) => {
  const { language } = useLanguage();
  const tx = settlementTx[language as 'en' | 'hi' | 'hinglish'] || settlementTx.en;

  const [balance, setBalance] = useState<number>(todaySales);
  const [autoSettle, setAutoSettle] = useState<boolean>(true);
  const [settling, setSettling] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pastSettlements = [
    {
      id: '1',
      date: 'Yesterday, 11:30 PM',
      utr: 'UTR: 429188219034 • SBI **4821',
      amount: 24800,
      badge: 'Auto-Settled',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: '2',
      date: '28 Sep, 11:30 PM',
      utr: 'UTR: 429088192831 • SBI **4821',
      amount: 19650,
      badge: 'Auto-Settled',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: '3',
      date: '27 Sep, 04:15 PM',
      utr: 'UTR: 428919001472 • Instant IMPS',
      amount: 12400,
      badge: 'Instant Payout',
      icon: Zap,
      iconColor: 'text-teal-600 bg-teal-50',
    },
  ];

  const handleSettleNow = () => {
    if (balance <= 0) {
      setToastMessage(tx.toastAlreadySettled);
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    setSettling(true);
    setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // ignore
      }
      setSettling(false);
      setToastMessage(tx.toastSettledSuccess(balance));
      setBalance(0);
      setTimeout(() => setToastMessage(null), 3500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-xs font-black shadow-xs">
              QB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  {tx.terminal}
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {tx.screenTitle}
              </h1>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('store_profile')}
          className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs ml-1 cursor-pointer hover:bg-emerald-900 transition-colors"
          title="Store Profile & Settings"
        >
          👤
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Card 1: Today's Collections & Instant IMPS Settle */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-4.5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">
                {tx.todayCollectionsTitle}
              </span>
            </div>
            <span className="text-xs font-bold bg-emerald-200/70 text-emerald-900 px-2.5 py-0.5 rounded-full">
              {tx.gallaBadge}
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{tx.readyImps}</span>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">State Bank of India (SBI)</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  A/c **4821 • IFSC SBIN0001420
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setToastMessage(tx.toastBankChange);
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              {tx.changeBtn}
            </button>
          </div>

          {/* 1-Tap Settle Button */}
          <button
            onClick={handleSettleNow}
            disabled={settling}
            className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-emerald-300 fill-current" />
            <span>
              {settling ? tx.settlingBtn : tx.settleBtn}
            </span>
          </button>
        </div>

        {/* Card 2: Daily Night Auto-Settle */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{tx.dailyNightTitle}</h3>
                <p className="text-[11px] text-slate-500">
                  {tx.dailyNightSub}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoSettle(!autoSettle)}
              aria-label="Toggle auto settle"
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoSettle ? 'bg-emerald-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  autoSettle ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-1.5">
              <span>⚡</span>
              <span>{tx.payoutMode}</span>
            </div>
            <span className="font-bold text-indigo-700">{tx.free247}</span>
          </div>
        </div>

        {/* Today's Inflow Sources */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{tx.inflowSourcesTitle}</h3>
            <span className="text-xs text-slate-500 font-medium">{tx.digitalTxns}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* PhonePe */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-black">
                  Pe
                </div>
                <span className="text-[10px] text-slate-500 font-medium">24 txns</span>
              </div>
              <div className="text-xs text-slate-600 mt-2 font-medium">PhonePe</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">₹8,210</div>
            </div>

            {/* Google Pay */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">
                  G
                </div>
                <span className="text-[10px] text-slate-500 font-medium">18 txns</span>
              </div>
              <div className="text-xs text-slate-600 mt-2 font-medium">Google Pay</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">₹6,140</div>
            </div>

            {/* Paytm & POS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">11 txns</span>
              </div>
              <div className="text-xs text-slate-600 mt-2 font-medium">Paytm &amp; POS</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">₹4,100</div>
            </div>
          </div>
        </div>

        {/* Past Settlements to Bank */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{tx.pastSettlementsTitle}</h3>
            <button
              onClick={() => {
                setToastMessage(tx.toastAllPayouts);
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{tx.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pastSettlements.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl ${item.iconColor} flex items-center justify-center shrink-0`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {item.date}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.utr}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700">
                      +₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{item.badge}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settlement Statement Card */}
        <div className="bg-indigo-50/60 border border-indigo-200/70 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{tx.statementTitle}</h4>
              <p className="text-[10px] text-slate-500">{tx.statementSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setToastMessage(tx.toastPdfDownloaded);
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" /> {tx.pdfBtn}
            </button>
            <button
              onClick={() => {
                setToastMessage(tx.toastExcelExported);
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> {tx.excelBtn}
            </button>
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="text-center py-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{tx.securityNote}</span>
        </div>
      </main>
    </div>
  );
};
