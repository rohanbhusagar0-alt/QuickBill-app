import React, { useState } from 'react';
import { AppScreen, MerchantProfile } from '../types';
import {
  ArrowLeft,
  Volume2,
  Play,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Phone,
  MessageSquare,
  Landmark,
  Store,
  Sliders,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { speakSoundboxPayment } from '../utils/audioSoundbox';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface SmartSoundboxScreenProps {
  merchant: MerchantProfile;
  onNavigate: (screen: AppScreen) => void;
}

export const SmartSoundboxScreen: React.FC<SmartSoundboxScreenProps> = ({
  merchant,
  onNavigate,
}) => {
  const { t, language, supportedLanguages } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [antiFraudShield, setAntiFraudShield] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<'1.0x' | '1.25x'>('1.25x');
  const [activeLogTab, setActiveLogTab] = useState<'all' | 'success' | 'pending' | 'fake'>('all');
  const [bankSettled, setBankSettled] = useState(false);

  const handleTestVoiceAnnouncement = async (amt = 311, name = 'Ramesh Sharma') => {
    setIsPlaying(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
    await speakSoundboxPayment(amt, merchant.shopName || 'Sharma General Store');
    setIsPlaying(false);
  };

  const handleSettleToBank = () => {
    setBankSettled(true);
    setTimeout(() => {
      onNavigate('bank_settlement');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-32">
      {/* Top Header matching Screen 49 */}
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
                Quickbill Smart Soundbox
              </span>
              <span className="text-[11px] text-slate-500">
                {merchant.shopName || 'Sharma General Store'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1">
              <span className="text-emerald-700 font-bold">文A</span>
              <span>{supportedLanguages.find((l) => l.code === language)?.native || 'English'}</span>
            </div>
            <button
              onClick={() => onNavigate('smart_soundbox')}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <img
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 cursor-pointer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgXDHZjALdnObN7V9teuDlyh6xzhDFACJx-T_uAtGcKb6ERAOlGbZfaxW22yEyoNbWck5L5Sk2TuhPcCSfrpl0LU9S7cnPvaF1hmlOHlUcdUrbgOJjOL4CakHy8jOFgfj0TINPI2kGFGz1qbx31wVXpLSh6O169PuKGYk3PQYIuQxkV33ftZsDLoXgJE04Gp3oWtlm26cgHCxma8HFvththdStG6shtXRC14hnoZSWkqKnrCwnhkzq"
            />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3.5">
        {/* Big Green Hero Card: Live AI Soundbox Active */}
        <div className="bg-[#006948] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col gap-3">
          {/* Top Badges */}
          <div className="flex items-center justify-between">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live AI Soundbox Active</span>
            </span>
            <span className="bg-emerald-900/80 text-emerald-100 text-xs font-bold px-2.5 py-0.5 rounded-full">
              ₹0/Mahina Rent
            </span>
          </div>

          {/* Last Announcement Bubble */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[11px] text-emerald-200 font-medium">Aakhiri Announcement:</div>
            <div className="bg-emerald-800/80 border border-emerald-600/70 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center shrink-0">
                  <Volume2 className="w-4 h-4 text-emerald-200" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-white truncate">
                    “QuickBill par ₹311 prapt hue”
                  </div>
                  <div className="text-[10px] text-emerald-200">
                    2 mins pehle • Ramesh Sharma
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTestVoiceAnnouncement(311, 'Ramesh Sharma')}
                disabled={isPlaying}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-white text-emerald-900 font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 cursor-pointer transition-colors shadow-xs"
              >
                <Play className="w-3 h-3 fill-emerald-900" />
                <span>{isPlaying ? 'Bol raha hai...' : 'Test Bolen'}</span>
              </button>
            </div>
          </div>

          {/* Connected Device & Voice Mode Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-emerald-800/50 border border-emerald-700/60 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">🔊</span>
                <div className="truncate">
                  <div className="font-bold text-white text-[11px] truncate">JBL Go 3 (Counter)</div>
                  <div className="text-[10px] text-emerald-200">Volume: 100% BT</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>

            <div className="bg-emerald-800/50 border border-emerald-700/60 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">🗣</span>
                <div className="truncate">
                  <div className="font-bold text-white text-[11px] truncate">Hindi + Hinglish</div>
                  <div className="text-[10px] text-emerald-200">Dual Voice Mode</div>
                </div>
              </div>
              <Sliders className="w-3.5 h-3.5 text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Section: Aaj Ki UPI Recovery & Bikri */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>📈 Aaj Ki UPI Recovery &amp; Bikri</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold">Updated Abhi</span>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-2">
            {/* Done */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>Bikri (Done)</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-base font-black text-slate-900 mt-1">₹34,890</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">84 Payments</div>
            </div>

            {/* Pending Bank */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>Pending Bank</span>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-base font-black text-rose-600 mt-1">₹1,420</div>
              <div className="text-[10px] text-slate-500 mt-0.5">3 Stuck Paymen...</div>
            </div>

            {/* Bachaye Gaye */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>Bachaye Gaye</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-base font-black text-blue-700 mt-1">₹940</div>
              <div className="text-[10px] text-blue-600 font-semibold mt-0.5">2 Fake Defended</div>
            </div>
          </div>
        </div>

        {/* Red Alert Card: Fraud-Shield Alert: 2 Payments Phasi Hai! */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  Fraud-Shield Alert: 2 Payments Phasi Hai!
                </h4>
                <p className="text-[11px] text-slate-600">
                  Customer dukan se gaya par paisa aana baaki hai
                </p>
              </div>
            </div>
            <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
              Urgent
            </span>
          </div>

          {/* Suspect 1 */}
          <div className="bg-white border border-rose-200/80 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  VS
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">
                    Vikram Singh <span className="text-[11px] font-normal text-slate-500">(Fortuner Maalik)</span>
                  </div>
                  <div className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                    <span>12 mins ago</span>
                    <span>•</span>
                    <span>⚠️ SBI Bank Server Slow</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-rose-600">₹850</div>
                <div className="text-[9px] text-slate-500 uppercase font-bold">Uncredited</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
              Customer ne PhonePe screen dikhaya par soundbox ne announce nahi kiya.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.open('https://wa.me/919876543210?text=Namaste Vikram ji, aapka Rs. 850 ka UPI payment dukan ke bank me abhi tak credit nahi hua hai.', '_blank');
                }}
                className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Reminder</span>
              </button>
              <button
                onClick={() => onNavigate('khata_book')}
                className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <span>Auto-Khata Udhaar</span>
              </button>
            </div>
          </div>

          {/* Suspect 2 */}
          <div className="bg-white border border-rose-200/80 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                  ⚠️
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">
                    Unknown Customer • Counter #1
                  </div>
                  <div className="text-[10px] text-rose-600 font-semibold">
                    28 mins ago • Declined / Auto-Reversed
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-rose-600">₹570</div>
                <div className="text-[9px] text-rose-600 uppercase font-bold">Failed UPI</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>🚨</span>
                <span>Siren beep played at counter</span>
              </span>
              <button
                onClick={() => onNavigate('staff_management')}
                className="px-2.5 py-1 bg-blue-50 text-blue-800 text-[11px] font-bold rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"
              >
                Audit Camera Log
              </button>
            </div>
          </div>
        </div>

        {/* Section: Live Dhwani & Payment Log */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>Live Dhwani &amp; Payment Log</span>
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold cursor-pointer hover:underline">
              View All &gt;
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveLogTab('all')}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
                activeLogTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sabhi (87)
            </button>
            <button
              onClick={() => setActiveLogTab('success')}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
                activeLogTab === 'success'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Success (84)
            </button>
            <button
              onClick={() => setActiveLogTab('pending')}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
                activeLogTab === 'pending'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending / Stuck (2)
            </button>
          </div>

          {/* Log Entries */}
          <div className="divide-y divide-slate-100">
            {/* Entry 1 */}
            <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate flex items-center gap-1">
                    <span>Ramesh Sharma (Uncle)</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1 rounded">
                      GPay
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    UTR: 4892048201 • Soundbox Spoken
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-emerald-700 text-sm">+₹311</div>
                <div className="text-[10px] text-slate-400">2 mins ago</div>
              </div>
            </div>

            {/* Entry 2 */}
            <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate flex items-center gap-1">
                    <span>Pooja Verma</span>
                    <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-1 rounded">
                      PhonePe
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Settled into HDFC Current A/c • 14 ...
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-slate-900 text-sm">+₹1,240</div>
                <div className="text-[10px] text-emerald-700 font-bold">Verified</div>
              </div>
            </div>

            {/* Entry 3 */}
            <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate flex items-center gap-1">
                    <span>Amitabh Dairy Farm</span>
                    <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1 rounded">
                      Paytm
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Khata Auto-Adjusted • 35 mins ago
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-slate-900 text-sm">+₹4,500</div>
                <div className="text-[10px] text-blue-700 font-bold">Auto Cleared</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Smart Soundbox Settings */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-slate-700" />
            <span>Smart Soundbox Settings</span>
          </h3>

          {/* Setting 1: Anti-Fraud */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Anti-Fraud Fake Screenshot Shield
                </div>
                <div className="text-[10px] text-slate-500">
                  Fake apps &amp; doctored screens detect karein
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={antiFraudShield}
                onChange={(e) => setAntiFraudShield(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006948]"></div>
            </label>
          </div>

          {/* Setting 2: Speed Multiplier */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Rush-Hour Voice Speed
                </div>
                <div className="text-[10px] text-slate-500">
                  Bheed ke waqt tez announcement
                </div>
              </div>
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold shrink-0">
              <button
                onClick={() => setSpeedMultiplier('1.0x')}
                className={`px-2 py-0.5 rounded ${speedMultiplier === '1.0x' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                1.0x
              </button>
              <button
                onClick={() => setSpeedMultiplier('1.25x')}
                className={`px-2 py-0.5 rounded ${speedMultiplier === '1.25x' ? 'bg-[#006948] text-white shadow-xs' : 'text-slate-500'}`}
              >
                1.25x
              </button>
            </div>
          </div>

          {/* Setting 3: Language */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="text-sm">🌐</span>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Regional Soundbox Bhasha
                </div>
                <div className="text-[10px] text-slate-500">
                  Hindi, Bhojpuri, Marathi, Punjabi
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('home_dashboard')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
            >
              Badlein &gt;
            </button>
          </div>
        </div>

        {/* Value Saving Card */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800 font-bold">
            ₹
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950">Har Saal ₹1,800 Bachayein!</div>
            <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
              Koi SIM card recharge nahi, koi hardware box kharab hone ka darr nahi.
            </p>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar matching Screen 49 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <span>Aaj Ka Settlement</span>
              <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded text-[9px]">
                T+0 Free
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 leading-none mt-0.5">
              ₹34,890 <span className="text-xs font-normal text-slate-500">Ready</span>
            </div>
          </div>

          <button
            onClick={handleSettleToBank}
            className="flex-1 bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <span>Bank Mein Bhejein</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
