import React, { useState } from 'react';
import { AppScreen, Product } from '../types';
import {
  ArrowLeft,
  Camera,
  Flashlight,
  RotateCcw,
  HelpCircle,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Link2,
  TrendingDown,
  Warehouse,
  ShieldCheck,
  FileText,
  Percent,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface InwardBillScannerScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onUpdateProductsStock: (updates: { productId: string; addedStock: number; newPurchasePrice?: number }[]) => void;
}

export const InwardBillScannerScreen: React.FC<InwardBillScannerScreenProps> = ({
  onNavigate,
  onUpdateProductsStock,
}) => {
  const { t } = useLanguage();
  const [flashOn, setFlashOn] = useState(false);
  const [debitNoteApplied, setDebitNoteApplied] = useState(false);
  const [settlementChoice, setSettlementChoice] = useState<'credit' | 'pay_now'>('credit');
  const [inwardDone, setInwardDone] = useState(false);

  const netPayable = debitNoteApplied ? 28450 - 112 : 28450;

  const handleConfirmInward = () => {
    setInwardDone(true);
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
    setTimeout(() => {
      setInwardDone(false);
      onNavigate('inventory_stock');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-32">
      {/* Top Header matching Screen 16 */}
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
                Distributor Bill Scan...
              </span>
              <span className="text-[11px] text-slate-500">Sharma General Store</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFlashOn(!flashOn)}
              className={`p-1.5 rounded-full cursor-pointer ${flashOn ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Flashlight className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3.5">
        {/* Scanned Paper Invoice Viewfinder Card */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-md aspect-[16/11] flex flex-col justify-between p-3 select-none">
          {/* Simulated paper bill background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 blur-[1px]"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1554415707-9e49667ff0d7?auto=format&fit=crop&w=600&q=80)',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none"></div>

          {/* Viewfinder corner brackets */}
          <div className="absolute inset-4 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg"></div>
          </div>

          {/* Top detected distributor tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="bg-slate-900/90 text-white border border-emerald-400/80 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Rajesh Oil Mills (99% Match)</span>
            </span>
            <span className="bg-slate-900/90 text-white border border-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-300" />
              <span>#ROM-4491 • 24 Oct</span>
            </span>
          </div>

          {/* Center OCR Scan active chip */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="bg-slate-900/90 border border-emerald-400/80 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-bold text-emerald-300 tracking-wide">
                • AI OCR SCANNING ACTIVE
              </span>
            </div>
          </div>

          {/* Bottom stats overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-700">
                📦 6 Items Detected
              </span>
              <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xs">
                TOTAL ₹28,450.00
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-white">
              <span className="text-[10px] text-emerald-300 font-bold bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700">
                ✨ Auto-Enhanced
              </span>
              <button className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center hover:bg-slate-700">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center hover:bg-slate-700">
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Card: AI Smart Parchi Match */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-black text-slate-900">AI Smart Parchi Match</h3>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
              100% Tax Parchi
            </span>
          </div>

          <p className="text-[11px] text-slate-600">
            Distributor GSTIN verified. HSN codes mapped cleanly with Master Inventory.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                <Link2 className="w-3.5 h-3.5 text-indigo-700" />
                <span className="text-[11px]">Matched PO #PO-804</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">✓ Reconciled</span>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <Percent className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-[11px]">18% GST Input Credit</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-black">+₹5,121 ITC</span>
            </div>
          </div>
        </div>

        {/* Section: Parchi Item Inward */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-slate-900">Parchi Item Inward</h3>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                6 Items
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <Warehouse className="w-3.5 h-3.5" />
              <span>Godown Linked</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Item 1 */}
            <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-xl">
                    🛢️
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      Fortune Sunlite Refined Oil
                    </h4>
                    <div className="text-[11px] text-slate-500">15 Cartons (150 Pouches)</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 text-sm">₹16,800</div>
                  <div className="text-[10px] text-slate-500">@ ₹112/pkt (MRP ₹135)</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                <span className="text-emerald-700 font-bold">
                  +150 Pouches to Main Godown
                </span>
                <span className="text-slate-500">✓ Matched PO</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0 text-xl">
                    🍾
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      Dhara Kachi Ghani Mustard Oil
                    </h4>
                    <div className="text-[11px] text-slate-500">10 Cartons (100 Bottles)</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 text-sm">₹14,200</div>
                  <div className="text-[10px] text-slate-500">@ ₹142/btl (MRP ₹170)</div>
                </div>
              </div>

              <div className="bg-emerald-50 text-emerald-800 text-[10px] font-bold p-1.5 rounded-lg flex items-center justify-between">
                <span>↘ Rate dropped ₹3 vs last purchase!</span>
                <span>Munafa +2.1%</span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 text-xl">
                    🧂
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      Catch Super Garam Masala 100g
                    </h4>
                    <div className="text-[11px] text-slate-500">2 Master Boxes (24 Units)</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 text-sm">₹1,920</div>
                  <div className="text-[10px] text-slate-500">@ ₹80/unit</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                <span className="text-indigo-700 font-semibold font-mono text-[10px]">
                  Batch #GM-992 • Exp: Nov 2026
                </span>
                <span className="text-emerald-700 font-bold">Auto-Logged ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Card: Shortage / Leaked Claim? */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <h4 className="text-xs font-bold text-slate-900">
                Shortage / Leaked Claim?
              </h4>
            </div>
            <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
              1 Pouch Leaked
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            Distributor delivery boy marked 1 Fortune oil pouch damaged upon delivery unboxing.
          </p>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setDebitNoteApplied(false)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                !debitNoteApplied ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Ignore
            </button>
            <button
              onClick={() => setDebitNoteApplied(!debitNoteApplied)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                debitNoteApplied
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <span>{debitNoteApplied ? '✓ Debit Note Applied (-₹112)' : 'Apply Debit Note (-₹112)'}</span>
            </button>
          </div>
        </div>

        {/* Card: PAYMENT SETTLEMENT Rajesh Oil Mills Khata */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                PAYMENT SETTLEMENT
              </div>
              <h3 className="text-xs font-black text-slate-900">Rajesh Oil Mills Khata</h3>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500">Bill Net Payable</div>
              <div className="text-base font-black text-slate-900">₹{netPayable.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="space-y-2">
            {/* Option 1: Credit to Supplier Khata */}
            <div
              onClick={() => setSettlementChoice('credit')}
              className={`border rounded-xl p-3 flex flex-col gap-1 cursor-pointer transition-all ${
                settlementChoice === 'credit'
                  ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="settlement"
                    checked={settlementChoice === 'credit'}
                    onChange={() => setSettlementChoice('credit')}
                    className="w-4 h-4 accent-[#006948]"
                  />
                  <span className="font-bold text-xs text-slate-900">
                    Credit to Supplier Khata (Udhar)
                  </span>
                </div>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  Dena Hai
                </span>
              </div>
              <div className="text-[11px] text-slate-500 pl-6">
                Total pending balance will update to ₹80,850
              </div>
            </div>

            {/* Option 2: Pay Now */}
            <div
              onClick={() => setSettlementChoice('pay_now')}
              className={`border rounded-xl p-3 flex flex-col gap-1 cursor-pointer transition-all ${
                settlementChoice === 'pay_now'
                  ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="settlement"
                    checked={settlementChoice === 'pay_now'}
                    onChange={() => setSettlementChoice('pay_now')}
                    className="w-4 h-4 accent-[#006948]"
                  />
                  <span className="font-bold text-xs text-slate-900">
                    Pay Now (Full or Partial)
                  </span>
                </div>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  UPI / Bank / Cash
                </span>
              </div>
              <div className="text-[11px] text-slate-500 pl-6">
                Settle instantly via linked Shop Current Account
              </div>
            </div>
          </div>

          {/* Cash Discount Callout */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 text-xs text-indigo-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🐷</span>
              <div>
                <span className="font-bold">Early Payment 2% Cash Discount:</span>
                <span className="text-[11px] text-indigo-900 block">
                  Pay ₹27,881 within 3 days &amp; save <strong className="text-emerald-700">₹569 extra</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Audit trail securely synced to Cloud Backup</span>
          </span>
          <span className="font-semibold text-slate-700">GSTR-2B Auto-Draft</span>
        </div>
      </main>

      {/* Sticky Bottom Bar matching Screen 16 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('inventory_stock')}
              className="w-10 h-10 rounded-xl border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
            </button>
            <div>
              <div className="text-[10px] text-slate-500 font-semibold">
                6 Line Items • 274 Inward Units
              </div>
              <div className="text-base font-black text-slate-900 leading-none">
                Net: ₹{netPayable.toLocaleString('en-IN')}.00
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirmInward}
            className="flex-1 bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{inwardDone ? 'Stock Inwarded!' : 'Confirm & Inward Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
