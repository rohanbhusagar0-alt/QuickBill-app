import React, { useState } from 'react';
import { AppScreen, Customer, MerchantProfile } from '../types';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Gift,
  Heart,
  MessageCircle,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  User,
  Users,
  ChevronRight,
  TrendingUp,
  Sliders,
  Calendar,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface LoyaltyRewardsScreenProps {
  customers: Customer[];
  merchant?: MerchantProfile;
  onNavigate: (screen: AppScreen) => void;
}

export const LoyaltyRewardsScreen: React.FC<LoyaltyRewardsScreenProps> = ({
  customers,
  merchant,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const isHi = language === 'hi';
  const [autoCashback, setAutoCashback] = useState(true);
  const [scratchCardActive, setScratchCardActive] = useState(true);
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [newOfferTitle, setNewOfferTitle] = useState('Diwali Special 2X Points');
  const [newOfferPercent, setNewOfferPercent] = useState('2%');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleSendPing = (phone: string, text: string) => {
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
    setBroadcastSent(true);
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    setTimeout(() => setBroadcastSent(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-32">
      {/* Top Header matching Screen 26 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-2.5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => onNavigate('home_dashboard')}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 text-sm truncate">
                Quickbill Smart Loyalty...
              </span>
              <span className="text-[11px] text-slate-500">
                {merchant?.shopName || 'Sharma General Store'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('barcode_scanner')}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div
              onClick={() => onNavigate('home_dashboard')}
              className="w-7 h-7 rounded-full bg-[#006948] text-white flex items-center justify-center cursor-pointer shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3.5">
        {/* Top Hero Card: Dukaan Loyalty Club */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {isEn ? 'SHARMA STORE LOYALTY ENGINE' : isHi ? 'शर्मा स्टोर मुनाफा & लॉयल्टी इंजन' : 'SHARMA STORE MUNAFA ENGINE'}
                </div>
                <h2 className="text-base font-black text-slate-900 leading-tight">
                  {isEn ? 'Store Loyalty Club' : isHi ? 'दुकान लॉयल्टी क्लब' : 'Dukaan Loyalty Club'}
                </h2>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Active</span>
            </span>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-500 font-medium">
                {isEn ? 'Active Customers' : isHi ? 'सक्रिय ग्राहक' : 'Active Grahak'}
              </div>
              <div className="text-lg font-black text-slate-900 mt-0.5">342</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                {isEn ? '↑ 14 new' : isHi ? '↑ 14 नए' : '↑ 14 naye'}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-500 font-medium">
                {isEn ? 'Repeat Sales' : isHi ? 'रिपीट बिक्री' : 'Repeat Sales'}
              </div>
              <div className="text-lg font-black text-emerald-800 mt-0.5">+28%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isEn ? 'Monthly hike' : isHi ? 'मासिक वृद्धि' : 'Monthly hike'}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-500 font-medium">
                {isEn ? 'Points Value' : isHi ? 'पॉइंट्स मूल्य' : 'Points Value'}
              </div>
              <div className="text-lg font-black text-slate-900 mt-0.5">₹8,450</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isEn ? '1pt = ₹1 savings' : isHi ? '1pt = ₹1 बचत' : '1pt = ₹1 bachat'}
              </div>
            </div>
          </div>

          {/* Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🧾</span>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {isEn ? 'Auto-Cashback on every invoice' : isHi ? 'हर बिल पर ऑटो-कैशबैक' : 'Auto-Cashback har bill par'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {isEn ? 'Direct SMS & invoice voucher' : isHi ? 'सीधे SMS व बिल पर्ची वाउचर' : 'Direct SMS & bill print voucher'}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoCashback}
                onChange={(e) => setAutoCashback(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006948]"></div>
            </label>
          </div>
        </div>

        {/* Card: ⚡ Khata Accelerator Sharma Exclusive */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>⚡ Khata Accelerator</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Sharma Exclusive</span>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>{isEn ? 'Pay Credit On-Time, Earn Cashback! 💰' : isHi ? 'समय पर उधार चुकाएं, कैशबैक पाएं! 💰' : 'On-Time Udhaar Chukao, Cashback Pao! 💰'}</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {isEn
                ? 'Clearing outstanding balance within 7 days gives customers '
                : isHi
                ? '7 दिन के भीतर बकाया चुकता करने पर ग्राहक को मिलता है '
                : '7 din ke andar pura hisab clear karne par grahak ko milta hai '}
              <strong className="text-emerald-700">
                {isEn ? '2% Extra Cashback Points' : isHi ? '2% अतिरिक्त कैशबैक पॉइंट्स' : '2% Extra Cashback Points'}
              </strong>.
            </p>
          </div>

          {/* Fast Result callout */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {isEn ? 'Cash Flow Result' : isHi ? 'कैश फ्लो नतीजा' : 'Cash Flow Fast Result'}
              </div>
              <div className="text-[11px] text-slate-600">
                {isEn
                  ? 'Payment cycle reduced from 14 days down to '
                  : isHi
                  ? 'उधारी रिकवरी 14 दिन से घटकर '
                  : 'Udhaar recovery 14 din se ghat kar '}
                <strong className="text-emerald-700">{isEn ? '5 days' : isHi ? '5 दिन' : '5 din'}</strong>!
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">Target: ₹2,000+ payment</span>
            <span className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5">
              <span>{isEn ? 'Customize Rule' : isHi ? 'नियम बदलें' : 'Rule Customize Karein'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Section: ✨ Khoye Huye Grahak Wapas Lao */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{isEn ? 'Win Back Inactive Customers' : isHi ? 'खोए हुए ग्राहकों को वापस लाएं' : 'Khoye Huye Grahak Wapas Lao'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isEn ? 'AI Smart WhatsApp Ping for Inactive Accounts' : isHi ? 'निष्क्रिय खातों हेतु AI स्मार्ट व्हाट्सएप सूचना' : 'AI Smart WhatsApp Ping for Inactive Accounts'}
              </p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              Auto-Audited
            </span>
          </div>

          {/* Group 1: 15 Din Se Nahi Aaye */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                  ⏳
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>{isEn ? 'Not Visited in 15 Days' : isHi ? '15 दिनों से नहीं आए' : '15 Din Se Nahi Aaye'}</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      {isEn ? '48 Customers' : isHi ? '48 ग्राहक' : '48 Grahak'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isEn ? 'Last visit around 1st-3rd of this month' : isHi ? 'इस महीने की 1-3 तारीख के आसपास अंतिम विज़िट' : 'Last visit around 1st-3rd of this month'}
                  </div>
                </div>
              </div>
            </div>

            {/* Template quote */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-700 italic leading-relaxed">
              {isEn
                ? '“Hello! Running low on tea and flour? 50 Bonus Reward Points are waiting for you at Sharma General Store!”'
                : isHi
                ? '“नमस्ते! आपकी चाय पत्ती या आटा ख़त्म तो नहीं हुआ? शर्मा जनरल स्टोर पर आपके 50 बोनस बचत पॉइंट्स इंतज़ार कर रहे हैं!”'
                : '“Namaste! Aapki chai patti aur atta khatam toh nahi hua? Dukaan par aapke 50 Bonus Bachat Points wait kar rahe hain!”'}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>High response rate (~42%)</span>
              </div>
              <button
                onClick={() =>
                  handleSendPing(
                    '9876543210',
                    'Namaste! Aapki chai patti aur atta khatam toh nahi hua? Dukaan par aapke 50 Bonus Bachat Points wait kar rahe hain!'
                  )
                }
                className="bg-[#006948] hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isEn ? '1-Tap Send WhatsApp' : isHi ? '1-टैप WhatsApp भेजें' : '1-Tap WhatsApp Bhejo'}</span>
              </button>
            </div>
          </div>

          {/* Group 2: VIP Monthly Buyers */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  ⭐
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>{isEn ? 'VIP Monthly Buyers' : isHi ? 'VIP मासिक ग्राहक' : 'VIP Monthly Buyers'}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      {isEn ? '62 Customers' : isHi ? '62 ग्राहक' : '62 Grahak'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isEn ? 'Avg spend ₹4,500+ / month' : isHi ? 'औसत खरीद ₹4,500+ / महीना' : 'Avg spend ₹4,500+ / month'}
                  </div>
                </div>
              </div>
            </div>

            {/* Template quote */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-700 italic leading-relaxed">
              {isEn
                ? '“Month-End Special Offer from Sharma General Store: Get Flat ₹50 Instant Discount on your next grocery bill!”'
                : isHi
                ? '“शर्मा जनरल स्टोर की ओर से माह-अंत विशेष ऑफर: अगले राशन बिल पर पाएं फ्लैट ₹50 तुरंत छूट!”'
                : '“Sharma General Store ki taraf se Month-End Special Offer: Agle rashan bill par Flat ₹50 Instant Discount payein!”'}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 font-medium">Every month 25th</span>
              <button
                onClick={() =>
                  handleSendPing(
                    '9876543210',
                    'Sharma General Store ki taraf se Month-End Special Offer: Agle rashan bill par Flat ₹50 Instant Discount payein!'
                  )
                }
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Broadcast</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section: Dukaan Loyalty Rules */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              {isEn ? 'Store Loyalty Rules' : isHi ? 'दुकान लॉयल्टी नियम' : 'Dukaan Loyalty Rules'}
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer">
              {isEn ? 'View History' : isHi ? 'इतिहास देखें' : 'View History'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Rule 1 */}
            <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-base">💳</span>
                <div>
                  <div className="font-bold text-slate-900">
                    {isEn ? '1% Cashback on Counter Bill' : isHi ? 'काउंटर बिल पर 1% कैशबैक' : '1% Cashback on Counter Bill'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isEn ? '₹500 bill = 5 Points (₹5 savings)' : isHi ? '₹500 बिल = 5 पॉइंट्स (₹5 बचत)' : '₹500 bill = 5 Points (₹5 bachat)'}
                  </div>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            {/* Rule 2 */}
            <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-base">🏪</span>
                <div>
                  <div className="font-bold text-slate-900">
                    {isEn ? 'Digital Store First Order' : isHi ? 'डिजिटल दुकान पहला ऑर्डर' : 'Digital Dukan First Order'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isEn ? 'Welcome Bonus of ₹25 credits' : isHi ? '₹25 क्रेडिट का वेलकम बोनस' : 'Welcome Bonus of ₹25 credits'}
                  </div>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            {/* Rule 3 */}
            <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-base">🎁</span>
                <div>
                  <div className="font-bold text-slate-900">
                    {isEn ? 'Digital Scratch Card on Payment' : isHi ? 'भुगतान पर डिजिटल स्क्रैच कार्ड' : 'Digital Scratch Card on Payment'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isEn ? 'Instant gift sent to phone on UPI payment' : isHi ? 'UPI भुगतान पर फोन पर तुरंत डिजिटल उपहार' : 'UPI payment par phone par instant gift'}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={scratchCardActive}
                  onChange={(e) => setScratchCardActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006948]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section: Grahak Leaderboard */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {isEn ? 'Customer Leaderboard' : isHi ? 'ग्राहक लीडरबोर्ड' : 'Grahak Leaderboard'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isEn ? 'Top loyal customers of this month' : isHi ? 'इस महीने के सबसे वफादार खरीदार' : 'Iss mahine ke sabse wafadaar kharid-daar'}
              </p>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer">
              {isEn ? 'View All' : isHi ? 'सभी देखें' : 'View All'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Rank 1 */}
            <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                    RV
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center">
                    1
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>Ramesh Verma</span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 rounded">
                      Gold Tier
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Civil Lines • 18 orders this month
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-black text-emerald-700 text-xs">320 pts</div>
                  <div className="text-[10px] text-slate-400">₹320 bachat</div>
                </div>
                <button
                  onClick={() => handleSendPing('9876543210', 'Namaste Ramesh ji! Aapke pass 320 bachat points hain.')}
                  className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Rank 2 */}
            <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                    MA
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-400 text-white font-bold text-[9px] flex items-center justify-center">
                    2
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>Mohd. Aslam</span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 rounded">
                      Gold Tier
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Main Bazaar • 15 orders this month
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-black text-emerald-700 text-xs">275 pts</div>
                  <div className="text-[10px] text-slate-400">₹275 bachat</div>
                </div>
                <button
                  onClick={() => handleSendPing('9876543210', 'Namaste Aslam ji! Aapke pass 275 bachat points hain.')}
                  className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-xs">
                    SS
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-700 text-white font-bold text-[9px] flex items-center justify-center">
                    3
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>Sunita Sharma</span>
                    <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 rounded">
                      Silver Tier
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Railway Road • 12 orders this month
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-black text-emerald-700 text-xs">210 pts</div>
                  <div className="text-[10px] text-slate-400">₹210 bachat</div>
                </div>
                <button
                  onClick={() => handleSendPing('9876543210', 'Namaste Sunita ji! Aapke pass 210 bachat points hain.')}
                  className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Banner image matching Screen 26 */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-slate-900 shadow-sm flex items-end p-4">
          <img
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"
            alt="Sharma Store Loyalty"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div className="relative z-10">
            <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
              {isEn ? 'SHARMA STORE LOYALTY PROGRAM' : isHi ? 'शर्मा स्टोर लॉयल्टी प्रोग्राम' : 'SHARMA STORE LOYALTY PROGRAM'}
            </div>
            <div className="text-sm font-black text-white mt-0.5">
              {isEn
                ? '"Customer savings, store prosperity!"'
                : isHi
                ? '"ग्राहक का मुनाफा, दुकान की बरकत!"'
                : '"Grahak ka munafa, dukan ki barqat!"'}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar matching Screen 26 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('home_dashboard')}
            className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
            <span>{isEn ? 'Rules & Settings' : isHi ? 'नियम व सेटिंग्स' : 'Rules Settings'}</span>
          </button>

          <button
            onClick={() => setShowAddOfferModal(true)}
            className="flex-1 bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? '+ New Cashback Offer' : isHi ? '+ नया कैशबैक ऑफर' : '+ Naya Cashback Offer'}</span>
          </button>
        </div>
      </div>

      {/* Add Offer Modal */}
      {showAddOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900 mb-1">
              {isEn ? 'Create New Cashback Offer' : isHi ? 'नया कैशबैक ऑफर बनाएं' : 'Naya Cashback Offer Banayein'}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {isEn
                ? 'Set customer offers for special festivals or weekends.'
                : isHi
                ? 'विशेष त्योहार या सप्ताहांत हेतु ग्राहक ऑफर सेट करें।'
                : 'Khas tyohar ya weekend ke liye grahak offer set karein.'}
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Offer Name</label>
                <input
                  type="text"
                  value={newOfferTitle}
                  onChange={(e) => setNewOfferTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cashback / Discount %</label>
                <input
                  type="text"
                  value={newOfferPercent}
                  onChange={(e) => setNewOfferPercent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddOfferModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddOfferModal(false);
                  try {
                    confetti({ particleCount: 30, spread: 50 });
                  } catch {
                    // ignore
                  }
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#006948] text-white cursor-pointer"
              >
                Launch Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
