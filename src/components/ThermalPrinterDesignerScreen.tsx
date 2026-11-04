import React, { useState } from 'react';
import { AppScreen, MerchantProfile } from '../types';
import {
  ArrowLeft,
  Printer,
  Settings,
  Check,
  Sparkles,
  Smartphone,
  QrCode,
  Sliders,
  CheckCircle2,
  FileText,
  Bluetooth,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ThermalPrinterDesignerScreenProps {
  merchant: MerchantProfile;
  onNavigate: (screen: AppScreen) => void;
  onUpdateMerchant: (updated: MerchantProfile) => void;
}

export const ThermalPrinterDesignerScreen: React.FC<ThermalPrinterDesignerScreenProps> = ({
  merchant,
  onNavigate,
  onUpdateMerchant,
}) => {
  const { t } = useLanguage();
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('58mm');
  const [showQr, setShowQr] = useState(true);
  const [showGst, setShowGst] = useState(true);
  const [customFooter, setCustomFooter] = useState(merchant.billFooterNote || 'उधार प्रेम की कैंची है • धन्यवाद, फिर पधारें!');
  const [shopName, setShopName] = useState(merchant.shopName || 'Sharma General Store');
  const [phone, setPhone] = useState(merchant.phone || '9876543210');
  const [saved, setSaved] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  const handleSaveSettings = () => {
    onUpdateMerchant({
      ...merchant,
      shopName,
      phone,
      billFooterNote: customFooter,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestPrint = () => {
    setPrintSuccess(true);
    window.print();
    setTimeout(() => setPrintSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-28">
      {/* Header */}
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
                Thermal Printer &amp; Slip Designer
              </span>
              <span className="text-[11px] text-slate-500">
                Bluetooth &amp; USB ESC/POS Protocol
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Bluetooth className="w-3 h-3 text-emerald-700" />
              <span>Paired: TVS RP-3150</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3.5">
        {/* Paper Size Switcher Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
          <label className="block text-xs font-bold text-slate-900">
            Paper Roll Size (थर्मल रोल साइज़)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaperWidth('58mm')}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                paperWidth === '58mm'
                  ? 'bg-emerald-50 border-[#006948] ring-1 ring-[#006948]'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900">58 mm (2 Inch)</span>
                {paperWidth === '58mm' && <Check className="w-4 h-4 text-[#006948]" />}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Standard Pocket BT Printer</div>
            </button>

            <button
              onClick={() => setPaperWidth('80mm')}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                paperWidth === '80mm'
                  ? 'bg-emerald-50 border-[#006948] ring-1 ring-[#006948]'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900">80 mm (3 Inch)</span>
                {paperWidth === '80mm' && <Check className="w-4 h-4 text-[#006948]" />}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Desktop Counter POS Roll</div>
            </button>
          </div>
        </div>

        {/* Live Thermal Receipt Paper Preview */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-700 mb-3">
            <span className="flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-[#006948]" />
              <span>Live Slip Preview ({paperWidth})</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">384 dots/line</span>
          </div>

          {/* Physical Thermal Paper Styling */}
          <div
            className={`bg-slate-50 text-slate-950 p-4 rounded-lg shadow-sm border border-slate-300 font-mono text-[11px] leading-tight transition-all ${
              paperWidth === '58mm' ? 'w-64' : 'w-72'
            }`}
          >
            {/* Store Header */}
            <div className="text-center border-b border-dashed border-slate-400 pb-2">
              <div className="font-black text-sm uppercase text-slate-900">{shopName}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">{merchant.address || 'Main Market, Sector 18, Noida'}</div>
              <div className="text-[10px] text-slate-600">Ph: +91 {phone}</div>
              {showGst && (
                <div className="text-[10px] text-slate-600 font-bold mt-0.5">
                  GSTIN: {merchant.gstin || '07AAAAA0000A1Z5'}
                </div>
              )}
            </div>

            {/* Bill Meta */}
            <div className="py-2 border-b border-dashed border-slate-400 text-[10px] flex justify-between text-slate-700">
              <div>Bill: #QB-9082</div>
              <div>{new Date().toLocaleDateString('en-GB')} 11:45 AM</div>
            </div>

            {/* Table Header */}
            <div className="py-1 border-b border-slate-400 flex justify-between text-[10px] font-bold text-slate-900">
              <span>ITEM</span>
              <span>QTY</span>
              <span>PRICE</span>
            </div>

            {/* Items */}
            <div className="py-1.5 space-y-1 text-[10px] border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span className="truncate pr-1">Aashirvaad Atta 5kg</span>
                <span>1</span>
                <span>₹220.00</span>
              </div>
              <div className="flex justify-between">
                <span className="truncate pr-1">Fortune Refined Oil 1L</span>
                <span>2</span>
                <span>₹270.00</span>
              </div>
              <div className="flex justify-between">
                <span className="truncate pr-1">Tata Salt 1kg</span>
                <span>1</span>
                <span>₹28.00</span>
              </div>
            </div>

            {/* Total */}
            <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
              <div className="flex justify-between font-extrabold text-xs text-slate-900">
                <span>NET TOTAL</span>
                <span>₹518.00</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>Payment: UPI PhonePe</span>
                <span className="text-emerald-700 font-bold">PAID</span>
              </div>
            </div>

            {/* QR Code and Footer Note */}
            <div className="pt-2 text-center flex flex-col items-center gap-1.5">
              {showQr && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border border-slate-400 rounded bg-white p-1 flex items-center justify-center">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5">Scan to Pay / Verify Bill</span>
                </div>
              )}
              <div className="text-[10px] font-bold text-slate-800 mt-1">
                {customFooter}
              </div>
              <div className="text-[9px] text-slate-400">Powered by QuickBill AI</div>
            </div>
          </div>
        </div>

        {/* Customization Controls */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-900">
            Receipt Header &amp; Footer Settings
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Shop Name (दुकान का नाम)
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Contact Phone (फ़ोन नंबर)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Custom Footer Note (बिल के नीचे का संदेश)
            </label>
            <input
              type="text"
              value={customFooter}
              onChange={(e) => setCustomFooter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-emerald-600"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 font-medium">Print UPI Payment QR Code</span>
              <input
                type="checkbox"
                checked={showQr}
                onChange={(e) => setShowQr(e.target.checked)}
                className="w-4 h-4 accent-[#006948] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 font-medium">Print Store GSTIN Number</span>
              <input
                type="checkbox"
                checked={showGst}
                onChange={(e) => setShowGst(e.target.checked)}
                className="w-4 h-4 accent-[#006948] cursor-pointer"
              />
            </label>
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            {saved ? <Check className="w-4 h-4 text-[#006948]" /> : <Settings className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved Successfully!' : 'Save Slip Settings'}</span>
          </button>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('home_dashboard')}
            className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={handleTestPrint}
            className="flex-1 bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{printSuccess ? 'Printing...' : 'Print Test Slip (BT)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
