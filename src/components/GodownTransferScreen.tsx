import React, { useState } from 'react';
import { AppScreen, Product } from '../types';
import {
  ArrowLeft,
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  Clock,
  Phone,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Store,
  Truck,
  Warehouse,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface GodownTransferScreenProps {
  products: Product[];
  onNavigate: (screen: AppScreen) => void;
  onTransferStock: (productId: string, qty: number, direction: 'GODOWN_TO_SHOP' | 'SHOP_TO_GODOWN') => void;
}

export const GodownTransferScreen: React.FC<GodownTransferScreenProps> = ({
  products,
  onNavigate,
  onTransferStock,
}) => {
  const { t } = useLanguage();
  const [selectedBranch, setSelectedBranch] = useState('Main Bazar (Dukaan #1)');
  const [sourceLoc, setSourceLoc] = useState('Central Godown');
  const [destLoc, setDestLoc] = useState('Branch #2 (Station Road)');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);
  const [showNewStoreModal, setShowNewStoreModal] = useState(false);

  // Transfer Challan Generation
  const handleGenerateChallan = () => {
    setShowTransferSuccess(true);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#047857', '#10b981', '#34d399'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setShowTransferSuccess(false), 3000);
  };

  const swapLocations = () => {
    const temp = sourceLoc;
    setSourceLoc(destLoc);
    setDestLoc(temp);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-32">
      {/* Top Header matching Screen 19 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-2.5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => onNavigate('home_dashboard')}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm truncate">
                  Quickbill Multi Store
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  मल्टी-स्टोर
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>{selectedBranch}</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('barcode_scanner')}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <Search className="w-4 h-4" />
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
        {/* Active Selection Switcher */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <span>Active Selection</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              </div>
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <span>{selectedBranch}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              setSelectedBranch(
                selectedBranch.includes('#1')
                  ? 'Branch #2 (Station Road)'
                  : 'Main Bazar (Dukaan #1)'
              )
            }
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowRightLeft className="w-3 h-3 text-slate-600" />
            <span>Switch</span>
          </button>
        </div>

        {/* Big Green Hero Card: All 3 Stores Linked & Synced */}
        <div className="bg-[#006948] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-emerald-700/80 pb-2">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>All 3 Stores Linked &amp; Synced</span>
            </div>
            <span className="text-[11px] text-emerald-200">Live Refresh: Just now</span>
          </div>

          <div>
            <div className="text-[11px] text-emerald-200 uppercase font-semibold tracking-wide">
              Kul Business Stock (All Godowns &amp; Stores)
            </div>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-2xl font-black text-white">₹18,42,500</span>
              <span className="bg-emerald-800/90 text-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
                1,420 SKUs Active
              </span>
            </div>
          </div>

          {/* 3 Location Rows */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Store 1 */}
            <div className="bg-emerald-800/50 border border-emerald-700/60 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white">
                  1
                </span>
                <div>
                  <div className="font-bold text-xs text-white">Dukaan #1 (Main Bazar)</div>
                  <div className="text-[10px] text-emerald-200">480 Items</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xs text-white">₹6,80,000</div>
                <div className="text-[10px] text-emerald-200">Bikri: ₹38,400</div>
              </div>
            </div>

            {/* Store 2 */}
            <div className="bg-emerald-800/50 border border-emerald-700/60 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white">
                  2
                </span>
                <div>
                  <div className="font-bold text-xs text-white">Branch #2 (Station Road)</div>
                  <div className="text-[10px] text-emerald-200">390 Items</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xs text-white">₹4,12,500</div>
                <div className="text-[10px] text-emerald-200">Bikri: ₹24,100</div>
              </div>
            </div>

            {/* Central Godown */}
            <div className="bg-emerald-800/50 border border-emerald-700/60 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white">
                  G
                </span>
                <div>
                  <div className="font-bold text-xs text-white">Central Godown (Transport...)</div>
                  <div className="text-[10px] text-emerald-200">Wholesale Buffer Reserve</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xs text-white">₹7,50,000</div>
                <div className="text-[10px] text-emerald-200">Bulk Warehouse</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: ⚡ 1-Tap Godown Transfer */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>⚡ 1-Tap Godown Transfer</span>
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer">
              Quick Challan
            </span>
          </div>

          {/* Source <-> Destination Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-slate-500 font-medium">Source (Kahan se)</div>
              <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1 mt-0.5">
                <Warehouse className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>{sourceLoc}</span>
              </div>
            </div>

            <button
              onClick={swapLocations}
              className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs active:scale-95 transition-transform shrink-0"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex-1 min-w-0 text-right">
              <div className="text-[10px] text-slate-500 font-medium">Destination (Kahan ko)</div>
              <div className="font-bold text-xs text-slate-900 truncate flex items-center justify-end gap-1 mt-0.5">
                <span>{destLoc}</span>
                <Store className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              </div>
            </div>
          </div>

          {/* Urgent Stock Out Alert Card */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                    Urgent Stock Out
                  </span>
                  <span className="text-[11px] font-bold text-rose-900">Branch #2 Shortage</span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  Fortune Mustard Oil (15L Tin)
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                  Dukaan par sirf <strong className="text-rose-700">3 Tins</strong> bache hain! Peak evening demand expected.
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-2 border border-rose-100 flex items-center gap-1.5 text-[11px] text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>AI Suggestion: Godown se <strong>20 Tins</strong> turant dispatch karein</span>
            </div>
          </div>

          {/* Challan Generate Button */}
          <button
            onClick={handleGenerateChallan}
            className="w-full bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <span>Transfer Challan Generate Karein (20 Tins)</span>
            <span>→</span>
          </button>

          {showTransferSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Challan #TR-8043 Generated! Stock In-Transit.</span>
              </div>
            </div>
          )}
        </div>

        {/* Section: Raste Mein Maal (In-Transit) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-black text-slate-900">Raste Mein Maal (In-Transit)</h3>
            </div>
            <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              2 Active Vans
            </span>
          </div>

          {/* Challan Card 1 */}
          <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900">Challan #TR-8042</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded">
                  E-Way Bill Linked
                </span>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                <span>On Road</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Raju Bhai (Tata Ace - Chhota Hathi)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    DL 1LAB 4021 • Godown → Branch #2
                  </div>
                </div>
              </div>
              <a
                href="tel:9876543210"
                className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-200 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Loaded Items */}
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-semibold mb-1">
                Loaded Items (Kareeb ₹42,800 ka maal):
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="bg-white border border-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  15 Bags Aashirvaad Atta (10kg)
                </span>
                <span className="bg-white border border-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  10 Cartons Maggi (70g)
                </span>
              </div>
            </div>

            {/* Progress line */}
            <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold pt-1">
              <span className="text-emerald-700 font-bold">Dispatch (10:15 AM)</span>
              <span className="text-blue-700 font-bold">Raste Me (ETA 11:30 AM)</span>
              <span className="text-slate-400">OTP Verify</span>
            </div>

            {/* OTP box */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-slate-900">
                    Receiver Counter OTP (Security)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Maal receive hone par hi stock count add hoga
                  </div>
                </div>
              </div>
              <div className="bg-white border border-blue-300 font-mono text-sm font-black text-blue-900 px-3 py-1 rounded-lg">
                8492
              </div>
            </div>
          </div>

          {/* Challan Card 2: Delivered */}
          <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between bg-slate-50">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900">Challan #TR-8041</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  Delivered &amp; Merged
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Dukaan #1 par Cashier Sonu dwara receive hua (Aaj subah 09:10 AM)
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          </div>
        </div>

        {/* Section: Live Stock Across Stores */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>🔍 Live Stock Across Stores</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold cursor-pointer hover:underline">
              Godown Filter ⚡
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Kisi bhi dukaan ya godown ka item dhoor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
            />
            <button
              onClick={() => onNavigate('barcode_scanner')}
              className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>

          {/* Inventory comparison item 1 */}
          <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900">Surf Excel Easy Wash 1kg</span>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  FMCG • Barcode: 8901030382910
                </div>
              </div>
              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded">
                Stock Gap Alert
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs py-1.5 border-y border-slate-100">
              <div className="bg-slate-50 p-1.5 rounded-lg">
                <div className="text-[10px] text-slate-500">Dukaan #1</div>
                <div className="font-black text-slate-900 mt-0.5">14 Pcs</div>
              </div>
              <div className="bg-rose-50 p-1.5 rounded-lg border border-rose-100">
                <div className="text-[10px] text-rose-600">Dukaan #2</div>
                <div className="font-black text-rose-700 mt-0.5">0 Pcs (NIL)</div>
              </div>
              <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                <div className="text-[10px] text-emerald-700">Godown</div>
                <div className="font-black text-emerald-800 mt-0.5">180 Pcs</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                <span>Buffer safe at godown</span>
              </span>
              <button
                onClick={handleGenerateChallan}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
              >
                Transfer 24 Pcs to Dukaan #2 →
              </button>
            </div>
          </div>

          {/* Inventory comparison item 2 */}
          <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900">Tata Salt (Desh Ka Namak) 1kg</span>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Grocery Staples • Fast Moving
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                • Balanced Stock
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs py-1.5 border-t border-slate-100">
              <div className="bg-slate-50 p-1.5 rounded-lg">
                <div className="text-[10px] text-slate-500">Dukaan #1</div>
                <div className="font-black text-slate-900 mt-0.5">45 Pcs</div>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg">
                <div className="text-[10px] text-slate-500">Dukaan #2</div>
                <div className="font-black text-slate-900 mt-0.5">30 Pcs</div>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg">
                <div className="text-[10px] text-slate-500">Godown</div>
                <div className="font-black text-emerald-800 mt-0.5">400 Pcs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Store Performance & Cash Flow */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              📊 Store Performance &amp; Cash Flow
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold">Today's Shift</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Store 1 Shift */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Dukaan #1 - Main Bazar</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                  18.2% Margin
                </span>
              </div>
              <div className="text-[10px] text-slate-500">Manager: Amit Sharma</div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-600">Cash in Gullak:</span>
                <span className="font-bold text-slate-900">₹22,400</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Digital UPI/QR:</span>
                <span className="font-bold text-emerald-700">₹16,000</span>
              </div>
            </div>

            {/* Store 2 Shift */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Branch #2 - Station Rd</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                  19.5% Margin
                </span>
              </div>
              <div className="text-[10px] text-slate-500">Manager: Vikas Rawat</div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-600">Cash in Gullak:</span>
                <span className="font-bold text-slate-900">₹14,200</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Digital UPI/QR:</span>
                <span className="font-bold text-emerald-700">₹9,900</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card: QuickBill Stock Protection Active */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">QuickBill Stock Protection Active</div>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              Bina computerized transfer challan aur OTP receiver match ke koi bhi maal dukaan se bahar nahi ja sakta. Zero Chori Guarantee.
            </p>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar matching Screen 19 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <button
            onClick={() => setShowNewStoreModal(true)}
            className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>+ Store/Godown</span>
          </button>

          <button
            onClick={handleGenerateChallan}
            className="flex-1 bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Naya Stock Transfer</span>
          </button>
        </div>
      </div>

      {/* New Store / Godown Modal */}
      {showNewStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900 mb-1">
              Add New Branch / Godown
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Add a branch counter or central godown to link inventory.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location Name</label>
                <input
                  type="text"
                  placeholder="e.g. Branch #3 (Market Yard)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none focus:border-emerald-600">
                  <option>Retail Counter / Shop</option>
                  <option>Storage Godown / Warehouse</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowNewStoreModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewStoreModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#006948] text-white cursor-pointer"
              >
                Save &amp; Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
