import React, { useState } from 'react';
import { AppScreen, Product } from '../types';
import {
  ArrowLeft,
  Camera,
  Flashlight,
  Bell,
  RotateCcw,
  Plus,
  Minus,
  Printer,
  Sparkles,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Scale,
  QrCode,
  Check,
  ChevronRight,
  Store,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface BarcodeScannerScreenProps {
  products: Product[];
  onNavigate: (screen: AppScreen) => void;
  onScannedProductFound: (product: Product) => void;
}

export const BarcodeScannerScreen: React.FC<BarcodeScannerScreenProps> = ({
  products,
  onNavigate,
  onScannedProductFound,
}) => {
  const { t, language, supportedLanguages } = useLanguage();
  const [scanMode, setScanMode] = useState<'rapid' | 'tag' | 'inward'>('rapid');
  const [flashOn, setFlashOn] = useState(false);
  const [beepSound, setBeepSound] = useState(true);
  const [tagSize, setTagSize] = useState<'shelf' | 'mini' | 'a4'>('shelf');
  const [showCustomBarcodeModal, setShowCustomBarcodeModal] = useState(false);
  const [customItemName, setCustomItemName] = useState('Khuli Chini (Sugar)');
  const [customItemPrice, setCustomItemPrice] = useState('44');
  const [customBarcodeGenerated, setCustomBarcodeGenerated] = useState<string | null>(null);

  // Scanned queue items matching Screen 15
  const [scannedItems, setScannedItems] = useState([
    {
      id: 'scan-1',
      name: 'Surf Excel Easy Wash',
      isNew: true,
      barcode: '8901030383792',
      weight: '500g Pkt',
      stock: 42,
      rate: 68,
      mrp: 75,
      qty: 2,
      total: 136,
      strikethrough: 150,
      iconType: 'detergent',
    },
    {
      id: 'scan-2',
      name: 'Tata Salt Vacuum Evaporated',
      isNew: false,
      barcode: '8901030432101',
      weight: '1kg Pouch',
      stock: 110,
      rate: 26,
      mrp: 28,
      qty: 1,
      total: 26,
      strikethrough: 28,
      iconType: 'salt',
    },
    {
      id: 'scan-3',
      name: 'Aashirvaad Shudh Chakki Atta',
      isNew: false,
      barcode: '8901725181234',
      weight: '5kg Bag',
      stock: 18,
      rate: 220,
      mrp: 235,
      qty: 1,
      total: 220,
      strikethrough: 235,
      iconType: 'flour',
    },
  ]);

  const updateQty = (id: string, delta: number) => {
    setScannedItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.qty + delta);
            return {
              ...item,
              qty: newQty,
              total: newQty * item.rate,
              strikethrough: newQty * item.mrp,
            };
          }
          return item;
        })
    );
  };

  const totalBillAmount = scannedItems.reduce((sum, item) => sum + item.total, 0);
  const totalItemsCount = scannedItems.reduce((sum, item) => sum + item.qty, 0);

  const handleSimulateScanNew = (barcodeNum: string, name: string, rate: number, mrp: number) => {
    if (beepSound) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(1800, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch {
        // audio context fallback
      }
    }

    const existing = scannedItems.find((it) => it.barcode === barcodeNum);
    if (existing) {
      updateQty(existing.id, 1);
    } else {
      setScannedItems((prev) => [
        {
          id: `scan-${Date.now()}`,
          name,
          isNew: true,
          barcode: barcodeNum,
          weight: '1 unit',
          stock: 35,
          rate,
          mrp,
          qty: 1,
          total: rate,
          strikethrough: mrp,
          iconType: 'box',
        },
        ...prev,
      ]);
    }
  };

  const handleAddToBill = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#047857', '#10b981', '#34d399'],
      });
    } catch {
      // ignore
    }
    onNavigate('create_bill');
  };

  const handleGenerateCustomBarcode = () => {
    const code = 'SKU-' + Math.floor(100000 + Math.random() * 900000);
    setCustomBarcodeGenerated(code);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-28">
      {/* Header matching Screen 15 */}
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
                Barcode Scanner
              </span>
              <span className="text-[11px] text-slate-500">QuickBill &amp; Khata AI</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1">
              <span className="text-emerald-700 font-bold">文A</span>
              <span>{supportedLanguages.find((l) => l.code === language)?.native || 'English'}</span>
            </div>
            <img
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 cursor-pointer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgXDHZjALdnObN7V9teuDlyh6xzhDFACJx-T_uAtGcKb6ERAOlGbZfaxW22yEyoNbWck5L5Sk2TuhPcCSfrpl0LU9S7cnPvaF1hmlOHlUcdUrbgOJjOL4CakHy8jOFgfj0TINPI2kGFGz1qbx31wVXpLSh6O169PuKGYk3PQYIuQxkV33ftZsDLoXgJE04Gp3oWtlm26cgHCxma8HFvththdStG6shtXRC14hnoZSWkqKnrCwnhkzq"
            />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3.5">
        {/* Top Saving Pill Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-base">🐷</span>
            <span className="font-bold">
              {language === 'en'
                ? 'Save ₹5,000 without buying external barcode gun!'
                : 'बिना स्कैनर गन के ₹5,000 बचाएं!'}
            </span>
          </div>
          <span className="bg-emerald-800 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
            120 FPS
          </span>
        </div>

        {/* Camera Viewfinder Card with Modes */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-md aspect-[16/11] flex flex-col justify-between p-3 select-none">
          {/* Blurred Background Simulation */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px]"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80)',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none"></div>

          {/* Top Scan Mode Pills */}
          <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setScanMode('rapid')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                scanMode === 'rapid'
                  ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              <span>⚡ Rapid Multi-Scan (Bheed)</span>
            </button>
            <button
              onClick={() => setScanMode('tag')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                scanMode === 'tag'
                  ? 'bg-emerald-700 text-white ring-1 ring-emerald-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              <span>🏷 Tag Scan</span>
            </button>
            <button
              onClick={() => setScanMode('inward')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                scanMode === 'inward'
                  ? 'bg-emerald-700 text-white ring-1 ring-emerald-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              <span>📦 Inward</span>
            </button>
          </div>

          {/* Center Scanner Reticle */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="w-56 h-28 relative flex flex-col items-center justify-center">
              {/* Green Corner Brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg"></div>

              {/* Scanning red laser line */}
              <div className="absolute w-full h-[2px] bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse"></div>

              {/* Detected Barcode Tag */}
              <div className="bg-slate-900/90 border border-emerald-400/80 rounded-lg px-2.5 py-1 text-center shadow-lg backdrop-blur-sm">
                <div className="text-[11px] font-mono font-bold text-emerald-300 tracking-wider flex items-center justify-center gap-1">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>8901030383792 DETECTED</span>
                </div>
              </div>
            </div>

            {/* Matched product chip */}
            <div className="mt-2 bg-slate-900/90 text-white border border-slate-700 px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Surf Excel 500g • MRP ₹75 → <b className="text-emerald-400">₹68</b></span>
            </div>
          </div>

          {/* Bottom Floating Control Buttons */}
          <div className="relative z-10 flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFlashOn(!flashOn)}
                className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors backdrop-blur-sm ${
                  flashOn ? 'bg-amber-400 text-slate-900 shadow-md' : 'bg-slate-800/80 text-white hover:bg-slate-700'
                }`}
                title="Toggle Flash"
              >
                <Flashlight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setBeepSound(!beepSound)}
                className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors backdrop-blur-sm ${
                  beepSound ? 'bg-emerald-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                }`}
                title="Beep Audio"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleSimulateScanNew('8901234567890', 'Parle-G Gold Biscuit', 10, 10)}
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer backdrop-blur-sm transition-transform active:rotate-180"
              title="Flip Camera / Re-scan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section: Abhi Scan Hue Samaan */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between px-1">
            <div>
              <h2 className="text-sm font-black text-slate-900">Abhi Scan Hue Samaan</h2>
              <p className="text-[11px] text-slate-500">
                {scannedItems.length} items in live queue • Instant Khata buffer
              </p>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-emerald-800">
                ₹{totalBillAmount.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Grahak Bill Total</div>
            </div>
          </div>

          {/* List of scanned items */}
          <div className="flex flex-col gap-2">
            {scannedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-3"
              >
                {/* Left icon / thumbnail */}
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
                  {item.iconType === 'detergent' && <span className="text-xl">🧴</span>}
                  {item.iconType === 'salt' && <span className="text-xl">🧂</span>}
                  {item.iconType === 'flour' && <span className="text-xl">🌾</span>}
                  {item.iconType === 'box' && <span className="text-xl">📦</span>}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs truncate">{item.name}</span>
                    {item.isNew && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {item.barcode} • {item.weight}
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                    <span className="text-slate-500">Stock: {item.stock} Pcs</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">Rate: ₹{item.rate}/pc</span>
                  </div>
                </div>

                {/* Quantity and Total */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm">₹{item.total}</span>
                    {item.strikethrough > item.total && (
                      <span className="line-through text-slate-400 text-[11px] ml-1">
                        ₹{item.strikethrough}
                      </span>
                    )}
                  </div>
                  {/* Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Dukaan Shelf Price Tag / Barcode Generator */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-900">Dukaan Shelf Price Tag</h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bina mehengi machine ke aam Bluetooth printer ya sticker sheet par print karein.
              </p>
            </div>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              Supermarket Look
            </span>
          </div>

          {/* Sample Tag Card */}
          <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="font-extrabold text-[11px] tracking-wider text-slate-700 uppercase">
                SHARMA GENERAL STORE
              </span>
              <span className="bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                SAVE ₹7 (9% OFF)
              </span>
            </div>

            <div>
              <div className="font-bold text-slate-900 text-xs">Surf Excel Easy Wash 500g</div>
              <div className="flex items-baseline justify-between mt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-900">₹68<span className="text-xs">.00</span></span>
                  <span className="text-xs text-slate-400 line-through">MRP ₹75</span>
                </div>
                <span className="text-[10px] text-slate-500">Inclusive of all taxes</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-300">
              {/* Barcode Graphic */}
              <div className="flex flex-col">
                <div className="flex items-end gap-[1.5px] h-8">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`bg-slate-900 ${i % 3 === 0 ? 'w-[2px]' : 'w-[1px]'}`}
                      style={{ height: `${20 + (i % 5) * 2}px` }}
                    ></div>
                  ))}
                </div>
                <span className="font-mono text-[9px] text-slate-700 tracking-widest mt-0.5">
                  8901030383792
                </span>
              </div>

              {/* UPI Pay mini QR */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 border border-slate-400 rounded bg-white p-0.5 flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-slate-900" />
                </div>
                <span className="text-[9px] font-bold text-slate-600 mt-0.5">UPI Pay</span>
              </div>
            </div>
          </div>

          {/* Size Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setTagSize('shelf')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                tagSize === 'shelf'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Shelf Size (50x30mm)
            </button>
            <button
              onClick={() => setTagSize('mini')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                tagSize === 'mini'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Mini Sticker (35x25mm)
            </button>
            <button
              onClick={() => setTagSize('a4')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                tagSize === 'a4'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              A4 Sheet
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="w-full bg-[#006948] hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>🖨 Print 3 Shelf Price Tags (Direct BT)</span>
          </button>
        </div>

        {/* Card: Loose & Khula Samaan Barcode Maker */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>⚖ Loose &amp; Khula Samaan Barcode Maker</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Khuli cheeni, dal ya dukan packing par chipkayein
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Bina barcode wale unbranded items ke liye instant 6-digit shop barcode create karein. Billing ke waqt 1-second mein scan hoga.
          </p>

          <button
            onClick={() => setShowCustomBarcodeModal(true)}
            className="w-full border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>+ Generate Custom Barcode</span>
          </button>
        </div>

        {/* Card: 100% Free Smart Barcode Engine */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950">100% Free Smart Barcode Engine</div>
            <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
              Aapka normal Android phone hi ultra-fast scanner ban gaya hai. Kisi external laser gun ki zaroorat nahi!
            </p>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">
              {totalItemsCount} Items Scanned
            </div>
            <div className="text-xl font-black text-slate-900 leading-none">
              ₹{totalBillAmount.toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleAddToBill}
            className="flex-1 bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 px-5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <span>Bill Mein Jodein</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Barcode Modal */}
      {showCustomBarcodeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900 mb-1">
              Custom Barcode Generator
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Khula saman (Chini, Daal, Chawal) ke liye barcode banayein.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Item Naam</label>
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rate (₹ per unit)</label>
                <input
                  type="number"
                  value={customItemPrice}
                  onChange={(e) => setCustomItemPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>

              {customBarcodeGenerated && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Barcode Generated</div>
                  <div className="font-mono text-base font-black text-emerald-900 tracking-widest my-1">
                    {customBarcodeGenerated}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {customItemName} • ₹{customItemPrice}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCustomBarcodeModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Band Karein
              </button>
              <button
                onClick={handleGenerateCustomBarcode}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#006948] hover:bg-emerald-800 text-white cursor-pointer"
              >
                Barcode Banayein
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
