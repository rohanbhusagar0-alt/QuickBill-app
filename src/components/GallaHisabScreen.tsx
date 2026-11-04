import React, { useState } from 'react';
import { AppScreen, Bill, MerchantProfile } from '../types';
import {
  ArrowLeft,
  Calendar,
  History,
  Share2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Lock,
  QrCode,
  CreditCard,
  Building2,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  Send,
  Coffee,
  Truck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface GallaHisabScreenProps {
  bills: Bill[];
  merchant: MerchantProfile;
  onNavigate: (screen: AppScreen) => void;
}

export const GallaHisabScreen: React.FC<GallaHisabScreenProps> = ({
  merchant,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const isHi = language === 'hi';

  // Denominations matching screen_42.png
  const [denominations, setDenominations] = useState<{ [key: number]: number }>({
    500: 28,
    200: 15,
    100: 10,
    50: 6,
  });
  const [coinsAmount, setCoinsAmount] = useState<number>(120);

  // Expenses matching screen_42.png
  const [expenses, setExpenses] = useState([
    {
      id: '1',
      title: 'Chai & Nashta (Staff)',
      time: '11:30 AM • Parchi #42',
      amount: 180,
      icon: Coffee,
      bg: 'bg-rose-50 text-rose-600',
    },
    {
      id: '2',
      title: 'Tempo Bhada (Mandi Se Maal)',
      time: '02:15 PM • Driver Pappu',
      amount: 450,
      icon: Truck,
      bg: 'bg-amber-50 text-amber-600',
    },
    {
      id: '3',
      title: 'Local Electricity Meter Advance',
      time: '05:40 PM • Bill Receipt #881',
      amount: 800,
      icon: Zap,
      bg: 'bg-rose-50 text-rose-600',
    },
  ]);

  const [carryForward, setCarryForward] = useState<boolean>(true);
  const [openingNextDay, setOpeningNextDay] = useState<number>(3000);
  const [showAddExpense, setShowAddExpense] = useState<boolean>(false);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [handoverNote, setHandoverNote] = useState(
    'Sab theek hai, Rajesh distributor ka ₹500 ka chutta baaki kal subah adjust hoga.'
  );
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  const updateCount = (denom: number, delta: number) => {
    setDenominations((prev) => ({
      ...prev,
      [denom]: Math.max(0, (prev[denom] || 0) + delta),
    }));
  };

  const resetDenominations = () => {
    setDenominations({
      500: 0,
      200: 0,
      100: 0,
      50: 0,
    });
    setCoinsAmount(0);
  };

  // Cash in hand calculations
  const totalNotesValue = Object.entries(denominations).reduce(
    (sum, [denom, count]) => sum + Number(denom) * count,
    0
  );
  const countedCash = totalNotesValue + (coinsAmount || 0);

  // System hisab
  const systemHisab = 18420;
  const difference = countedCash - systemHisab;
  const isTallied = Math.abs(difference) === 0;

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const gharTijoriAmount = Math.max(0, countedCash - openingNextDay);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim() || !newExpAmount) return;
    const num = parseFloat(newExpAmount);
    if (isNaN(num) || num <= 0) return;

    setExpenses((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: newExpTitle.trim(),
        time: 'Just now • Parchi #' + Math.floor(100 + Math.random() * 900),
        amount: num,
        icon: Coffee,
        bg: 'bg-rose-50 text-rose-600',
      },
    ]);
    setNewExpTitle('');
    setNewExpAmount('');
    setShowAddExpense(false);
  };

  const handleLockGalla = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
    });
    setIsLocked(true);
    setCopiedToast('Aaj Ka Galla Tally Hokar Safe Lock Ho Gaya!');
    setTimeout(() => setCopiedToast(null), 3000);
  };

  const handleShareParchi = () => {
    const text = `🏪 *${merchant.shopName} - Aaj Ka Galla Hisab*\n📅 24 Oct 2023 • Sham Ki Closing\n--------------------------\n💵 System Hisab: ₹${systemHisab.toLocaleString('en-IN')}\n🪙 Hath Mein Cash: ₹${countedCash.toLocaleString('en-IN')}\n⚖️ Farak: ₹${difference.toFixed(2)}\n\n📱 UPI & Digital Jamakari: ₹34,890.00\n🔻 Dukan Kharcha: ₹${totalExpenseAmount}\n💰 Tijori / Home Cash: ₹${gharTijoriAmount.toLocaleString('en-IN')}\n\n✅ Maalik Verified & Day Closed.`;
    navigator.clipboard?.writeText(text);
    setCopiedToast('Galla Parchi Hisab WhatsApp Format Mein Copy Hua!');
    setTimeout(() => setCopiedToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-28">
      {/* Toast */}
      {copiedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Top App Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home_dashboard')}
            className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-xs font-black shadow-sm">
              QB
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {isEn ? 'Cash Drawer & Tally' : isHi ? 'गल्ला & रोकड़ हिसाब' : 'Galla & Cash Hisab'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                {merchant.shopName || 'Sharma General Store'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setCopiedToast('Calendar Filter: Aaj Ka Din');
              setTimeout(() => setCopiedToast(null), 1500);
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setCopiedToast('Purani Galla History Loaded');
              setTimeout(() => setCopiedToast(null), 1500);
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <History className="w-5 h-5" />
          </button>
          <button
            onClick={handleShareParchi}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
            alt="User avatar"
            onClick={() => onNavigate('store_profile')}
            className="w-8 h-8 rounded-full object-cover border-2 border-emerald-600 ml-1 cursor-pointer"
            title="Store Profile & Settings"
          />
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Banner: Aaj Ka Galla & Shift Status */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  {isEn ? "Today's Drawer Tally" : isHi ? 'आज का गल्ला हिसाब' : 'Aaj Ka Galla'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {isEn ? '24 Oct 2023 • Evening Closing' : isHi ? '24 अक्टूबर 2023 • शाम की क्लोजिंग' : '24 Oct 2023 • Sham Ki Closing'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              {isEn ? 'Draft • In Progress' : isHi ? 'ड्राफ्ट • प्रगति पर' : 'Draft • In Progress'}
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">🗄️</span>
              <span className="font-semibold text-slate-800">
                {isEn ? 'Counter 1 (Main Cash Drawer)' : isHi ? 'काउंटर 1 (मुख्य गल्ला)' : 'Counter 1 (Main Galla)'}
              </span>
              <span className="text-slate-400">•</span>
              <span>Rahul Cashier</span>
            </div>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium text-[11px]">
              {isEn ? 'Shift #2 (Evening)' : isHi ? 'शिफ्ट #2 (शाम)' : 'Shift #2 (Evening)'}
            </span>
          </div>
        </div>

        {/* Tally Success Alert Card */}
        <div
          className={`rounded-2xl p-3.5 border flex items-center justify-between ${
            isTallied
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isTallied ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            )}
            <span className="font-bold text-sm">
              {isTallied
                ? isEn
                  ? 'Success! Cash Drawer is 100% Balanced'
                  : isHi
                  ? 'बधाई! गल्ला 100% मिलान हो गया'
                  : 'Mubarak! Galla 100% Tally Hai'
                : isEn
                ? 'Drawer Cash Mismatch! Please Recheck'
                : isHi
                ? 'गल्ले में अंतर है! दोबारा जांचें'
                : 'Galla Mismatch Hai! Check Karein'}
            </span>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isTallied
                ? 'bg-emerald-700 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {isEn ? 'Diff:' : isHi ? 'अंतर:' : 'Farak:'} ₹{Math.abs(difference).toFixed(2)}
          </span>
        </div>

        {/* System Hisab vs Hath Mein Cash Comparison Grid */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="grid grid-cols-2 gap-3">
            {/* System Hisab Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                <span>🗂️</span> {isEn ? 'SYSTEM EXPECTED CASH' : isHi ? 'सिस्टम हिसाब' : 'SYSTEM HISAB'}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{systemHisab.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {isEn ? 'From app invoices' : isHi ? 'ऐप बिल रिकॉर्ड से' : 'App ke record se'}
              </div>
            </div>

            {/* Hath Mein Cash Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                <span>💵</span> {isEn ? 'PHYSICAL CASH IN HAND' : isHi ? 'हाथ में रोकड़ (कैश)' : 'HATH MEIN CASH'}
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                ₹{countedCash.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-800 mt-0.5">
                {isEn ? 'Physical note count' : isHi ? 'हाथ से नोट गिनती' : 'Physical note ginti'}
              </div>
            </div>
          </div>

          {/* Cash Flow Journey Pills */}
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {isEn ? "Today's Cash Flow Breakdown:" : isHi ? 'आज का कैश फ्लो विवरण:' : 'Aaj Ki Cash Flow Yatra:'}
            </p>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-1.5">
                <div className="text-[10px] text-slate-500">Opening Cash</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">+₹5,000</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200/70 rounded-lg p-1.5">
                <div className="text-[10px] text-emerald-700">Cash Sales</div>
                <div className="text-xs font-bold text-emerald-800 mt-0.5">+₹22,150</div>
              </div>
              <div className="bg-teal-50 border border-teal-200/70 rounded-lg p-1.5">
                <div className="text-[10px] text-teal-700">Udhaar Vasooli</div>
                <div className="text-xs font-bold text-teal-800 mt-0.5">+₹3,200</div>
              </div>
              <div className="bg-rose-50 border border-rose-200/70 rounded-lg p-1.5">
                <div className="text-[10px] text-rose-700">Dukan Kharcha</div>
                <div className="text-xs font-bold text-rose-800 mt-0.5">-₹{totalExpenseAmount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Digital & UPI Bikri Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Digital & UPI Bikri</h3>
                <p className="text-[11px] text-slate-500">Auto-Synced via Soundbox & QR</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
              84 Orders
            </span>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between">
            <span className="text-xs text-slate-600">Kul Online Jamakari:</span>
            <span className="text-xl font-black text-indigo-700">₹34,890.00</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2.5">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span>📶</span> PhonePe / Paytm QR
              </div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">₹28,450</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-slate-500" /> Card Swipe Machine
              </div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">₹6,440</div>
            </div>
          </div>

          <div className="mt-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl px-3 py-2 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Settled to HDFC Bank (A/c **4921) • Ref #UTR-98214</span>
          </div>
        </div>

        {/* Cash Drawer Note Ginti Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                <span className="text-emerald-700 font-black">₹</span> Cash Drawer Note Ginti
              </div>
              <p className="text-[11px] text-slate-500">Galle ke physical note gin kar darj karein</p>
            </div>
            <button
              onClick={resetDenominations}
              className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Denominations List */}
          <div className="space-y-2.5 mt-3">
            {[500, 200, 100, 50].map((denom) => {
              const count = denominations[denom] || 0;
              const subtotal = denom * count;
              const badgeColors: { [key: number]: string } = {
                500: 'bg-emerald-700 text-white',
                200: 'bg-amber-700 text-white',
                100: 'bg-indigo-700 text-white',
                50: 'bg-teal-700 text-white',
              };

              return (
                <div
                  key={denom}
                  className="flex items-center justify-between bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5"
                >
                  <div className="flex items-center gap-2 w-20">
                    <span
                      className={`text-xs font-black px-2 py-1 rounded-md ${
                        badgeColors[denom] || 'bg-slate-700 text-white'
                      }`}
                    >
                      ₹{denom}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => updateCount(denom, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm shadow-2xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-900">
                      {count}
                    </span>
                    <button
                      onClick={() => updateCount(denom, 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm shadow-2xs"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right text-sm font-bold text-slate-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}

            {/* Chutta / Coins Input */}
            <div className="flex items-center justify-between bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5">
              <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-1 rounded-md">
                🪙 Chutta / Coins
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">₹</span>
                <input
                  type="number"
                  value={coinsAmount}
                  onChange={(e) => setCoinsAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-right text-sm font-bold text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Kul Ginti Total Card */}
          <div className="mt-3.5 bg-emerald-50 border border-emerald-300/80 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-emerald-800">
                Kul Ginti (Counted Cash)
              </div>
              <div className="text-2xl font-black text-emerald-800 mt-0.5">
                ₹{countedCash.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-Calculated
              </span>
              <p className="text-[10px] text-emerald-700 mt-1 font-medium">
                Matches System Exactly
              </p>
            </div>
          </div>
        </div>

        {/* Petty Cash Dukan Kharcha Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                <span>🧾</span> Petty Cash Dukan Kharcha
              </div>
              <p className="text-[11px] text-slate-500">
                Recorded Today ({expenses.length} Parchiyan)
              </p>
            </div>
            <span className="text-sm font-black text-rose-600">
              -₹{totalExpenseAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Expense items */}
          <div className="space-y-2 mt-3">
            {expenses.map((exp) => {
              const IconComp = exp.icon || Coffee;
              return (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg ${exp.bg} flex items-center justify-center`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {exp.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{exp.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-600">
                    -₹{exp.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Add expense toggle/form */}
          {showAddExpense ? (
            <form onSubmit={handleAddExpenseSubmit} className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <input
                type="text"
                placeholder="Kharcha naam (jaise: Chai, Safai, Auto Bhada)"
                value={newExpTitle}
                onChange={(e) => setNewExpTitle(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-emerald-600"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Rashi (₹)"
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(e.target.value)}
                  className="w-1/2 text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-emerald-600"
                />
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 text-white rounded-lg text-xs font-bold py-1.5 hover:bg-emerald-800 transition-colors"
                >
                  Jodein
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="bg-slate-200 text-slate-700 rounded-lg text-xs font-bold px-2.5 py-1.5 hover:bg-slate-300"
                >
                  Radd
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddExpense(true)}
              className="mt-3 w-full py-2 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> {isEn ? '+ Add Expense / Voucher' : isHi ? '+ नया खर्च / पर्ची दर्ज करें' : '+ Naya Kharcha / Parchi Dalein'}
            </button>
          )}
        </div>

        {/* Agli Subah Ka Galla (Carry Forward) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                💰
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {isEn ? 'Next Morning Opening Cash (Carry Forward)' : isHi ? 'अगली सुबह का शुरुआती गल्ला (कैरी फॉरवर्ड)' : 'Agli Subah Ka Galla (Carry Forward)'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCarryForward(!carryForward)}
              aria-label="Toggle carry forward"
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                carryForward ? 'bg-emerald-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  carryForward ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mt-1.5">
            {isEn
              ? 'Opening float kept in cash drawer to start sales and provide change for the next morning.'
              : isHi
              ? 'अगली सुबह दुकान खोलने पर ग्राहकों को छुट्टे देने व काउंटर चलाने हेतु गल्ले में रखी जाने वाली राशि।'
              : 'Kal dukan kholne par galle mein chhutte aur counter chalane ke liye rakhi jaane wali rashi.'}
          </p>

          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-slate-600">
                {isEn ? 'Next Day Opening Cash' : isHi ? 'कल का शुरुआती कैश' : 'Kal Ka Opening Cash'}
              </div>
              <div className="text-xl font-black text-slate-900 mt-1">
                ₹{openingNextDay.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isEn ? 'Kept in cash drawer' : isHi ? 'गल्ले में छोड़ा जाएगा' : 'Drawer mein chhodenge'}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-emerald-800">
                {isEn ? 'Safe Deposit / Home Cash' : isHi ? 'तिजोरी / घर जमा राशि' : 'Ghar / Tijori Jamakari'}
              </div>
              <div className="text-xl font-black text-emerald-700 mt-1">
                ₹{gharTijoriAmount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-800 mt-0.5">
                {isEn ? 'Take-home / Store locker' : isHi ? 'दुकान की तिजोरी में सुरक्षित' : 'Take-home / Tijori safe'}
              </div>
            </div>
          </div>
        </div>

        {/* Shift Handover & Audit Note */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? 'Shift Handover & Audit Note' : isHi ? 'शिफ्ट हैंडओवर व ऑडिट नोट' : 'Shift Handover & Audit Note'}</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>🛡️</span> {isEn ? 'Owner Verified' : isHi ? 'मालिक द्वारा सत्यापित' : 'Maalik Verified'}
            </span>
          </div>

          <p className="text-[10px] text-slate-500 mt-2 font-medium">
            {isEn ? 'Remarks & Handover Note:' : isHi ? 'टिप्पणी / हैंडओवर विवरण:' : 'Shortage / Remark / Dukan Note:'}
          </p>
          <div className="mt-1 bg-indigo-50/50 border border-indigo-100 rounded-xl p-2.5 text-xs text-slate-800">
            {handoverNote}
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold">
              👤
            </div>
            <div>
              <span className="font-semibold text-slate-900">Rahul Kumar</span> (Cashier Shift-2) • OTP Verified Counter Lock PIN • 09:42 PM
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="bg-indigo-50/60 border border-indigo-200/70 rounded-2xl p-3.5 flex items-start gap-2.5">
          <div className="text-base text-indigo-700 mt-0.5">💡</div>
          <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
            <span className="font-bold text-indigo-900">Tip:</span>{' '}
            {isEn
              ? 'Immediately after locking the drawer, an automated day-end summary can be sent via WhatsApp to the shop owner and partner.'
              : isHi
              ? 'गल्ला लॉक करने के तुरंत बाद व्हाट्सएप पर दिन के अंत की समरी दुकान मालिक व पार्टनर को भेजी जा सकती है।'
              : 'Galla lock karne ke turant baad WhatsApp report maalik aur partner ko auto-share ki ja sakti hai taaki daily hisab clear rahe.'}
          </p>
        </div>
      </main>

      {/* Sticky Bottom Action Buttons */}
      <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 z-30 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          <button
            onClick={handleShareParchi}
            className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{isEn ? 'Share Summary' : isHi ? 'पर्ची शेयर करें' : 'Parchi'}</span>
          </button>

          <button
            onClick={handleLockGalla}
            className="flex-2 py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 text-emerald-300" />
            <span>{isEn ? 'Lock Drawer & Close Day' : isHi ? 'गल्ला लॉक करें व दिन समाप्त करें' : 'Galla Lock & Day-End Karein'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
