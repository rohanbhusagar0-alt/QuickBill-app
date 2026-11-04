import React, { useState } from 'react';
import { AppScreen, MerchantProfile, Product } from '../types';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  ShieldCheck,
  Check,
  Radio,
  ExternalLink,
  Flame,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExpiryClearanceOfferScreenProps {
  products: Product[];
  merchant: MerchantProfile;
  onNavigate: (screen: AppScreen) => void;
  selectedProduct?: Product;
}

export const ExpiryClearanceOfferScreen: React.FC<ExpiryClearanceOfferScreenProps> = ({
  products,
  merchant,
  onNavigate,
}) => {
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: boolean }>({
    '1': true,
    '2': true,
    '3': true,
    '4': false,
  });

  const [audience, setAudience] = useState<string>('vip');
  const [timing, setTiming] = useState<string>('now');
  const [template, setTemplate] = useState<'flash' | 'bogo'>('flash');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const handleSendBlast = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
    });
    setToastMessage(
      `WhatsApp Clearance Blast 148 VIP Customers ko safalta se send hua! Est Recovery: ₹1,938`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTestSend = () => {
    setToastMessage(`Test WhatsApp message sent to owner (+91 98765 43210)!`);
    setTimeout(() => setToastMessage(null), 2500);
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
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Quickbill Smart Inventory Clearance
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Sharma General Store</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setToastMessage('Search items in stock');
              setTimeout(() => setToastMessage(null), 1500);
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setToastMessage('Clearance settings menu');
              setTimeout(() => setToastMessage(null), 1500);
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Top Alert Card */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                ⏰
              </div>
              <h3 className="text-sm font-bold text-rose-950">4 Items Nearing Expiry!</h3>
            </div>
            <span className="text-xs font-black text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
              Risk: ₹2,480
            </span>
          </div>

          <p className="text-xs text-rose-900 leading-relaxed font-medium">
            Mohalla customers ko 1–tap WhatsApp broadcast bhejkar stock cash mein convert karein and
            save 100% loss.
          </p>

          <div className="bg-white/80 border border-rose-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <span className="text-emerald-700">⚡</span>
            <span>
              Avg. sell-out time: <strong className="text-emerald-800">3.5 hrs</strong> via WhatsApp
              deal
            </span>
          </div>
        </div>

        {/* At-Risk Items */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">At-Risk Items</h3>
              <span className="text-xs font-bold bg-emerald-800 text-white px-2 py-0.2 rounded-full">
                {selectedCount} Selected
              </span>
            </div>
            <button
              onClick={() => {
                const allSelected = selectedCount === 4;
                setSelectedItems({
                  '1': !allSelected,
                  '2': !allSelected,
                  '3': !allSelected,
                  '4': !allSelected,
                });
              }}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Select All
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Item 1: Amul Taaza */}
            <div
              onClick={() => toggleItem('1')}
              className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer shadow-xs ${
                selectedItems['1'] ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedItems['1'] ? 'bg-emerald-800 text-white' : 'border border-slate-300'
                  }`}
                >
                  {selectedItems['1'] && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=80"
                    alt="Amul Milk"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap">
                    24h LEFT
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      Amul Taaza (500ml)
                    </h4>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded shrink-0">
                      Tomorrow 6 PM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Stock: 14 units • MRP: <span className="line-through">₹32</span>
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-teal-50 text-teal-800 border border-teal-200 font-bold px-1.5 py-0.2 rounded text-[10px]">
                        25% OFF
                      </span>
                      <span className="font-bold text-slate-900">Deal ₹24</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">
                      Recovers ₹336 (0% loss)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2: Cadbury Dairy Milk */}
            <div
              onClick={() => toggleItem('2')}
              className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer shadow-xs ${
                selectedItems['2'] ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedItems['2'] ? 'bg-emerald-800 text-white' : 'border border-slate-300'
                  }`}
                >
                  {selectedItems['2'] && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=120&auto=format&fit=crop&q=80"
                    alt="Cadbury Silk"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap">
                    8d LEFT
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      Cadbury Dairy Milk Silk (60g)
                    </h4>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded shrink-0">
                      18 Bars
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    MRP: <span className="line-through">₹85</span> •{' '}
                    <span className="text-amber-700 font-bold">🔥 Evening Rush Demand</span>
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-rose-50 text-rose-800 border border-rose-200 font-bold px-1.5 py-0.2 rounded text-[10px]">
                        ₹20 OFF
                      </span>
                      <span className="font-bold text-slate-900">Deal ₹65</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">Recovers ₹1,170</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 3: Amul Butter */}
            <div
              onClick={() => toggleItem('3')}
              className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer shadow-xs ${
                selectedItems['3'] ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedItems['3'] ? 'bg-emerald-800 text-white' : 'border border-slate-300'
                  }`}
                >
                  {selectedItems['3'] && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=120&auto=format&fit=crop&q=80"
                    alt="Amul Butter"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap">
                    5d LEFT
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      Amul Butter (100g)
                    </h4>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded shrink-0">
                      9 Units
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    MRP: <span className="line-through">₹58</span> •{' '}
                    <span className="text-teal-700 font-bold">17% Clearance</span>
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-teal-50 text-teal-800 border border-teal-200 font-bold px-1.5 py-0.2 rounded text-[10px]">
                        ₹10 OFF
                      </span>
                      <span className="font-bold text-slate-900">Deal ₹48</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">Recovers ₹432</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 4: Real Mixed Fruit Juice */}
            <div
              onClick={() => toggleItem('4')}
              className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer shadow-xs ${
                selectedItems['4'] ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedItems['4'] ? 'bg-emerald-800 text-white' : 'border border-slate-300'
                  }`}
                >
                  {selectedItems['4'] && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=120&auto=format&fit=crop&q=80"
                    alt="Real Juice"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-600 text-white px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap">
                    14d LEFT
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      Real Mixed Fruit Juice 1L
                    </h4>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded shrink-0">
                      6 Cartons
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    MRP: <span className="line-through">₹140</span> • Safe for next week
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded text-[10px]">
                        ₹30 OFF
                      </span>
                      <span className="font-bold text-slate-900">Deal ₹110</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">Optional Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Broadcast Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">WhatsApp Broadcast Preview</h3>
            <button
              onClick={() => {
                setToastMessage('Edit Broadcast Template');
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>✏️ Edit Template</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTemplate('flash')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                template === 'flash'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              <span>🔥</span> Mohalla Flash Deal (Best)
            </button>
            <button
              onClick={() => setTemplate('bogo')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                template === 'bogo'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              <span>⚡</span> Buy 1 Get 1 Combo
            </button>
          </div>

          {/* Authentic WhatsApp Bubble */}
          <div className="bg-[#efeae2] border border-slate-300 rounded-3xl p-3.5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-300/60">
              <div className="w-7 h-7 rounded-full bg-emerald-800 text-white text-[11px] font-black flex items-center justify-center">
                SK
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900">Sharma Kirana Store</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] text-slate-500">Official Business Broadcast</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-xs text-xs text-slate-800 space-y-2 leading-relaxed">
              <p>
                Namaste! 🙏 Sharma Kirana Store ki taraf se{' '}
                <span className="font-bold bg-emerald-100 text-emerald-900 px-1 rounded">
                  SPECIAL TODAY FRESH DEAL! 🛍️
                </span>
              </p>
              <p className="text-[11px] text-slate-600">
                Sham ke liye fresh daily essentials par special stock clearance discount:
              </p>
              <div className="bg-slate-50 rounded-xl p-2.5 font-mono text-[11px] text-slate-800 space-y-1">
                <div>🥛 Amul Taaza + Fresh Bread: Flat 25% OFF (Sirf ₹24)</div>
                <div>🍫 Cadbury Silk: Flat ₹20 OFF (₹65 only)</div>
                <div>🧈 Amul Butter 100g: Sirf ₹48 (Save ₹10)</div>
              </div>
              <p className="text-rose-700 font-semibold text-[11px]">
                ⏰ Sirf aaj sham 8 baje tak ya stock khatam hone tak!
              </p>
              <p className="text-emerald-800 font-semibold text-[11px]">
                ⚡ Free Mohalla Delivery on orders above ₹199
              </p>
              <p className="text-[11px] text-slate-600">
                📲 WhatsApp reply karein ya catalog tap karein:
              </p>
              <div className="bg-emerald-50 rounded-lg p-2 text-emerald-800 font-mono text-[11px] flex items-center justify-between">
                <span>quickbill.shop/sharma-kirana/clearance</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="text-right text-[10px] text-slate-400 font-medium">
                Just now ✔️✔️
              </div>
            </div>
          </div>
        </div>

        {/* Target Audience & Delivery */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Target Audience &amp; Delivery</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Select Customer Segment:
            </label>
            <div className="space-y-2 text-xs">
              {/* Option 1: VIP Regulars */}
              <label
                onClick={() => setAudience('vip')}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  audience === 'vip'
                    ? 'bg-emerald-50/70 border-emerald-400'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="audience"
                  checked={audience === 'vip'}
                  onChange={() => setAudience('vip')}
                  className="mt-1 accent-emerald-800"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Frequent Regular Buyers</span>
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.2 rounded">
                      Highest Orders
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    148 VIP Mohalla Customers (Last 30 days active)
                  </p>
                </div>
              </label>

              {/* Option 2: Nearby colony */}
              <label
                onClick={() => setAudience('nearby')}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  audience === 'nearby'
                    ? 'bg-emerald-50/70 border-emerald-400'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="audience"
                  checked={audience === 'nearby'}
                  onChange={() => setAudience('nearby')}
                  className="mt-1 accent-emerald-800"
                />
                <div className="flex-1">
                  <span className="font-bold text-slate-900">Nearby Delivery Colony List</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    320 Contacts • Pocket A, B, and Central Enclave
                  </p>
                </div>
              </label>

              {/* Option 3: All khata */}
              <label
                onClick={() => setAudience('all')}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  audience === 'all'
                    ? 'bg-emerald-50/70 border-emerald-400'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="audience"
                  checked={audience === 'all'}
                  onChange={() => setAudience('all')}
                  className="mt-1 accent-emerald-800"
                />
                <div className="flex-1">
                  <span className="font-bold text-slate-900">Sabhi Saved Khata Customers</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    540 Contacts across your address book
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Broadcast Timing */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Broadcast Timing:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTiming('now')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  timing === 'now'
                    ? 'bg-emerald-100/80 border-emerald-500 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Send Abhi Turant (Instant Blast)
              </button>
              <button
                onClick={() => setTiming('scheduled')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  timing === 'scheduled'
                    ? 'bg-emerald-100/80 border-emerald-500 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Schedule 5:00 PM (Milk Rush)
              </button>
            </div>
          </div>

          {/* Anti-spam Safe Delivery note */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong className="text-slate-900">100% Anti-Spam Safe Delivery:</strong> Approved
              WhatsApp Cloud API compliant broadcast. Zero risk of account restriction or number
              blocking.
            </p>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 z-30 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{selectedCount} Items • 148 VIP Customers</span>
            </div>
            <div className="text-xs font-bold text-slate-900">
              Est. Cash Recovery: <span className="text-emerald-800 font-black">₹1,938</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestSend}
              className="py-3 px-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>📲 Test Send</span>
            </button>
            <button
              onClick={handleSendBlast}
              className="py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Blast Bhejo</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
