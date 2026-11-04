import React, { useState } from 'react';
import { AppScreen, Customer, MerchantProfile } from '../types';
import {
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Phone,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Send,
  Zap,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface UdhaarAiRecoveryScreenProps {
  customers: Customer[];
  merchant: MerchantProfile;
  onNavigate: (screen: AppScreen) => void;
}

export const UdhaarAiRecoveryScreen: React.FC<UdhaarAiRecoveryScreenProps> = ({
  customers,
  merchant,
  onNavigate,
}) => {
  const { t, language, supportedLanguages } = useLanguage();
  const [selectedTone, setSelectedTone] = useState<'friendly' | 'business' | 'strict'>('friendly');
  const [activeTab, setActiveTab] = useState<'overdue' | 'at_risk' | 'auto_scheduled'>('overdue');
  const [rozanaGullakActive, setRozanaGullakActive] = useState(true);
  const [reminderSentNote, setReminderSentNote] = useState(false);

  const handleSendAllReminders = () => {
    setReminderSentNote(true);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#047857', '#10b981', '#34d399'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setReminderSentNote(false), 3000);
  };

  const handleSendSingleReminder = (name: string, phone: string, amt: number) => {
    let msg = '';
    const upiLink = `upi://pay?pa=${merchant.upiId}&pn=${encodeURIComponent(merchant.shopName)}&am=${amt}&cu=INR`;

    if (selectedTone === 'friendly') {
      msg = `Sharma ji, ummeed hai sab theek hai. Pichle mahine ka ₹${amt} ka hisab baki tha, fursat mein aate-jaate check kar lijiye ga 🙏\nUPI Link: ${upiLink}`;
    } else if (selectedTone === 'business') {
      msg = `Namaste ${name} ji, month-end books audit ke liye pending dues (₹${amt}) clear kar dijiye. UPI dynamic link se turant clear karein 💳\nUPI Link: ${upiLink}`;
    } else {
      msg = `Aapka ₹${amt} ka hisab 45 dino se overdue hai. Dukaan ki credit limit band na ho, kripya aaj hi payment karein ⚠️\nUPI Link: ${upiLink}`;
    }

    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-32">
      {/* Top Header matching Screen 39 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-2.5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => onNavigate('home_dashboard')}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              alt="QuickBill App Icon"
              className="w-7 h-7 object-contain shrink-0 rounded-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbgVuLmjKSwvXfdz5PRiz9Mog0fvtVbEaf8jSQ9e2hesrcrn6ikd5qB8QjnBkojXW8pQbgrAhJ8EtYY0mgJA9EQN4jIi-Leg6PZHVir-7fxQ5oO31JJLGjs1AeEjPYjzllSCAvAvFUQU_HERdtvcQSo1PG6yLvKV-03dTFmbohH6iJ9eMYnLyAGU-r3VIpcC4RpD5UBo5z5F8pBI3ZqU321BiNtv28iYj8qA_Uag3NuQ9Qb6lHqNQu"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 text-sm truncate">
                Smart Udhaar ...
              </span>
              <span className="text-[11px] text-slate-500">QuickBill &amp; Khata AI</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1">
              <span>{supportedLanguages.find((l) => l.code === language)?.native || 'English'}</span>
            </div>
            <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer">
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
        {/* Big Green Hero Card: KUL UDHAAR KHATA AUDIT */}
        <div className="bg-[#006948] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100 font-semibold">
              <span className="text-sm">📖</span>
              <span>KUL UDHAAR KHATA AUDIT</span>
            </div>
            <span className="bg-emerald-800 text-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-300 fill-emerald-300" />
              <span>78% Recovery Rate</span>
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">₹1,48,250</span>
              <span className="text-xs text-emerald-200">pending</span>
            </div>
            <div className="text-[11px] text-emerald-200 mt-0.5">
              👥 Kul 42 Grahakon par Baqi Udhaar
            </div>
          </div>

          {/* 3 Categories: Safe, Moderate, At Risk */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-2">
              <div className="text-[10px] text-emerald-200 font-bold flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                <span>Safe</span>
              </div>
              <div className="font-extrabold text-sm text-white mt-0.5">₹82,400</div>
              <div className="text-[9px] text-emerald-200">0-15 Din</div>
            </div>

            <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-2">
              <div className="text-[10px] text-amber-200 font-bold flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Moderate</span>
              </div>
              <div className="font-extrabold text-sm text-white mt-0.5">₹41,250</div>
              <div className="text-[9px] text-amber-200">16-30 Din</div>
            </div>

            <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-2">
              <div className="text-[10px] text-rose-200 font-bold flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>At Risk!</span>
              </div>
              <div className="font-extrabold text-sm text-white mt-0.5">₹24,600</div>
              <div className="text-[9px] text-rose-200">30+ Din</div>
            </div>
          </div>

          {/* White WhatsApp Broadcast Trigger Button */}
          <button
            onClick={handleSendAllReminders}
            className="w-full bg-white hover:bg-emerald-50 text-emerald-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors mt-1"
          >
            <MessageSquare className="w-4 h-4 text-emerald-700 fill-emerald-100" />
            <span>1-Tap Se Sabhi 18 Due Grahakon Ko Reminder</span>
          </button>

          {reminderSentNote && (
            <div className="bg-emerald-800 border border-emerald-500 rounded-lg p-2 text-center text-xs text-white font-bold">
              ✓ 18 WhatsApp Payment Reminders Sent Successfully!
            </div>
          )}
        </div>

        {/* Section: • Smart AI Tone Selector */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Smart AI Tone Selector</span>
            </h3>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              AI Rishta Guard
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Dukaandaar ka rishta kharab na ho, AI grahak ke swabhav aur sambandh ke hisab se sandesh chunta hai.
          </p>

          {/* Tone 1: Pyar Se / Friendly */}
          <div
            onClick={() => setSelectedTone('friendly')}
            className={`border rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all ${
              selectedTone === 'friendly'
                ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🤝</span>
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Pyar Se / Friendly Mode</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                      Default Active
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Parivaar &amp; Padosi grahakon ke liye
                  </div>
                </div>
              </div>
              <input
                type="radio"
                name="tone"
                checked={selectedTone === 'friendly'}
                onChange={() => setSelectedTone('friendly')}
                className="w-4 h-4 accent-[#006948]"
              />
            </div>

            <div className="bg-white/80 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-700 italic leading-relaxed">
              “Sharma ji, ummeed hai sab theek hai. Pichle mahine ka <strong>₹1,420</strong> ka hisab baki tha, fursat mein aate-jaate check kar lijiye ga 🙏”
            </div>
          </div>

          {/* Tone 2: Vyapari / Polite Business */}
          <div
            onClick={() => setSelectedTone('business')}
            className={`border rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all ${
              selectedTone === 'business'
                ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🏬</span>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Vyapari / Polite Business
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Regular commercial khatedaar
                  </div>
                </div>
              </div>
              <input
                type="radio"
                name="tone"
                checked={selectedTone === 'business'}
                onChange={() => setSelectedTone('business')}
                className="w-4 h-4 accent-[#006948]"
              />
            </div>

            <div className="bg-white/80 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-700 italic leading-relaxed">
              “Namaste Verma ji, month-end books audit ke liye pending dues clear kar dijiye. UPI dynamic link se turant clear karein 💳”
            </div>
          </div>

          {/* Tone 3: Strict / Urgent Tagada */}
          <div
            onClick={() => setSelectedTone('strict')}
            className={`border rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all ${
              selectedTone === 'strict'
                ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-400'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Strict / Urgent Tagada</span>
                    <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                      30+ Din
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Lambi deri wale grahak
                  </div>
                </div>
              </div>
              <input
                type="radio"
                name="tone"
                checked={selectedTone === 'strict'}
                onChange={() => setSelectedTone('strict')}
                className="w-4 h-4 accent-rose-600"
              />
            </div>

            <div className="bg-white/80 border border-rose-200 rounded-lg p-2.5 text-[11px] text-slate-700 italic leading-relaxed">
              “Aapka ₹4,850 ka hisab 45 dino se overdue hai. Dukaan ki credit limit band na ho, kripya aaj hi payment karein ⚠️”
            </div>
          </div>
        </div>

        {/* Section: Aaj Ke Priority Tagada Grahak */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>Aaj Ke Priority Tagada Grahak</span>
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">
                18
              </span>
            </h3>
            <span
              onClick={() => onNavigate('khata_book')}
              className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>Khatavahi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'overdue'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Overdue (12)
            </button>
            <button
              onClick={() => setActiveTab('at_risk')}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'at_risk'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              30+ Din At Risk (6)
            </button>
            <button
              onClick={() => setActiveTab('auto_scheduled')}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'auto_scheduled'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Auto-Scheduled (8)
            </button>
          </div>

          {/* Customer 1: Suresh Gupta */}
          <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    SG
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                    !
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <span>Suresh Gupta</span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-1.5 rounded">
                      Masterji
                    </span>
                  </div>
                  <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                    ⏱ Due: 38 Din Pehle (High Risk)
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-rose-600 text-sm">₹3,850</div>
                <div className="text-[10px] text-slate-400">Last Bill: 14 Oct</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <span className="bg-slate-100 px-2 py-0.5 rounded">3 Reminders Sent</span>
              <span>•</span>
              <span>Kirana &amp; Ration Baqi</span>
              <span>•</span>
              <span className="text-slate-500 font-bold">Tagada Score: 41/100</span>
            </div>

            {/* AI Insight Box */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2 text-[11px] text-slate-700 leading-tight">
              💡 <strong>AI Insight:</strong> Har mahine 1st tarikh ko salary aati hai. Aaj sham 7 baje soft WhatsApp reminder bhejne par <strong className="text-emerald-700">94% chances</strong> hain full payment milne ke!
            </div>

            <div className="flex gap-2 pt-0.5">
              <button
                onClick={() => handleSendSingleReminder('Suresh Gupta', '9876543210', 3850)}
                className="flex-1 py-2 bg-[#006948] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp (₹3,850)</span>
              </button>
              <a
                href="tel:9876543210"
                className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-blue-200"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Grahak</span>
              </a>
            </div>
          </div>

          {/* Customer 2: Anil Kumar */}
          <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2 bg-slate-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center">
                  AK
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <span>Anil Kumar</span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-medium px-1.5 rounded">
                      Sachiv Ji
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    ⏱ Due: 18 Din Pehle (Moderate)
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-slate-900 text-sm">₹1,240</div>
                <div className="text-[10px] text-emerald-700 font-bold">Regular Payer</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
              <span className="text-[11px] text-slate-600">
                Trust Score: <strong className="text-emerald-700">82/100</strong> • Auto-Schedule Ready
              </span>
              <button
                onClick={() => handleSendSingleReminder('Anil Kumar', '9876543211', 1240)}
                className="px-2.5 py-1 bg-[#006948] text-white text-[11px] font-bold rounded-lg cursor-pointer hover:bg-emerald-800 transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>

          {/* Customer 3: Rakesh Tailor */}
          <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">Rakesh Tailor</div>
                <div className="text-[10px] text-slate-500">Dukan No. 4 Bazaar</div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-900 text-sm">₹4,500</div>
                <div className="text-[10px] text-emerald-700 font-bold">₹2,000 Jama Ho Chuka</div>
              </div>
            </div>

            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full w-[31%]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Total: ₹6,500</span>
              <span>Pending: ₹4,500 (69%)</span>
            </div>

            <button
              onClick={() => handleSendSingleReminder('Rakesh Tailor', '9876543212', 4500)}
              className="w-full py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 cursor-pointer"
            >
              Rozana ₹200 Ki Gullak EMI Set Karein
            </button>
          </div>
        </div>

        {/* Rozana Gullak Recovery Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <span className="text-base">🐖</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-slate-900">Rozana Gullak Recovery</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 rounded">
                    0% EMI
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Micro Auto-Debit Feature</div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={rozanaGullakActive}
                onChange={(e) => setRozanaGullakActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006948]"></div>
            </label>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Grahak se ek sath mota paisa nahi nikal raha? Grahak ke UPI par <strong>Rozana ₹100 ya ₹200 ka auto-cut</strong> lagayein. Dukaandar ka paisa safe aur grahak par bhojh nahi!
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Paisa Secure</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto Khata Update</span>
            </span>
          </div>
        </div>

        {/* Instant 0% UPI Khata Link */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800 font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-950">Instant 0% UPI Khata Link</span>
              <span className="bg-emerald-200 text-emerald-900 text-[9px] font-bold px-1.5 rounded">
                Zero Fee
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
              Har WhatsApp sandesh mein dynamic payment link jata hai (GPay, PhonePe, Paytm). Click hote hi seedha HDFC A/C mein settlement!
            </p>
            <div className="flex items-center gap-3 text-[10px] text-emerald-900 font-semibold mt-1">
              <span>🔒 Direct Bank Settled</span>
              <span>•</span>
              <span>Auto-Receipt Sent</span>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar matching Screen 39 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              AAJ UMEED RECOVERY
            </div>
            <div className="text-xl font-black text-emerald-800 leading-none mt-0.5">
              ₹14,500
            </div>
          </div>

          <button
            onClick={handleSendAllReminders}
            className="flex-1 bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Bhejein AI Tagada (18)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
