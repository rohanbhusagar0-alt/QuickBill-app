import React, { useState } from 'react';
import { AppScreen } from '../types';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Camera,
  FilePlus,
  ScanLine,
  Truck,
  Phone,
  MessageSquare,
  QrCode,
  FileText,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SupplierKhataScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const SupplierKhataScreen: React.FC<SupplierKhataScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'po'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const suppliers = [
    {
      id: '1',
      initials: 'RO',
      name: 'Rajesh Oil Mills',
      verified: true,
      category: 'Fortune, Dhara, Spices • Katra Bazar',
      balance: 52400,
      balanceType: 'due', // Dena Hai
      truckInfo: 'PO #PO-804 (₹28,500) • En-route • Truck dispatch hua (Today 2 PM)',
      dueTag: 'Aaj Sham Tak Due',
    },
    {
      id: '2',
      initials: 'ITC',
      name: 'ITC Distribution Hub',
      verified: true,
      category: 'Aashirvaad, Sunfeast • Agency #12',
      balance: 34200,
      balanceType: 'due',
      alertInfo: 'Aashirvaad 10kg Atta low stock (PO draft ready) • Limit: ₹50k',
    },
    {
      id: '3',
      initials: 'GD',
      name: 'Gupta Wholesale Dairy',
      badge: 'Auto PO',
      category: 'Amul, Mother Dairy • Daily Milk Van',
      balance: 14850,
      balanceType: 'due',
      timing: 'Due: Kal Subah 7:00 AM • Daily Milk & Butter Active',
    },
    {
      id: '4',
      initials: 'HA',
      name: 'Hindustan Agencies',
      verified: true,
      category: 'Surf Excel, Rin, Lifebuoy',
      balance: 1200,
      balanceType: 'advance', // Sab Paid Hai +₹1,200 Adv
      cycle: 'Agla delivery cycle: Somwar (Monday)',
    },
  ];

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
              QuickBill – Supplier Khata
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Sharma General Store</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setToastMessage('Search Supplier by name or goods');
              setTimeout(() => setToastMessage(null), 1500);
            }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setToastMessage('Supplier Ledger Settings');
              setTimeout(() => setToastMessage(null), 1500);
            }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('store_profile')}
            className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs ml-0.5 cursor-pointer hover:bg-emerald-900 transition-colors"
            title="Store Profile & Settings"
          >
            👤
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Top Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                KUL DENA HAI (SUPPLIER DUES)
              </span>
              <div className="text-3xl font-black text-slate-900 mt-0.5">
                ₹1,48,650 <span className="text-xs font-semibold text-slate-400">/ 8 Vyapari</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              💳
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="bg-rose-50 border border-rose-200 text-rose-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>₹42,000 Overdue (Due aaj/kal)</span>
            </span>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>₹18,500 ITC GST Match</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => onNavigate('inward_bill_scanner')}
              className="py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>Scan Bill / Parchi</span>
            </button>
            <button
              onClick={() => {
                setToastMessage('Naya Purchase Order (PO) Form Khula!');
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FilePlus className="w-4 h-4 text-slate-600" />
              <span>Naya PO Banayein</span>
            </button>
          </div>
        </div>

        {/* AI Smart Bill Inward Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                ✨
              </div>
              <h3 className="text-sm font-bold text-white">AI Smart Bill Inward</h3>
            </div>
            <span className="text-[10px] font-bold bg-white text-indigo-900 px-2 py-0.5 rounded uppercase">
              FAST OCR
            </span>
          </div>

          <p className="text-xs text-indigo-100 leading-relaxed font-medium">
            Distributor bill ki photo kheencho — stock aur khata khud-ba-khud match ho jayega!
          </p>

          <button
            onClick={() => onNavigate('inward_bill_scanner')}
            className="w-full py-2 bg-white hover:bg-slate-50 text-indigo-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <ScanLine className="w-4 h-4 text-indigo-700" />
            <span>Distributor Parchi Scan Karein</span>
          </button>
        </div>

        {/* Munafa Bachat Tip */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            💸
          </div>
          <div className="flex-1 text-xs text-emerald-950 font-medium">
            <span className="font-bold text-emerald-900 block text-xs">Munafa Bachat Tip</span>
            <p className="mt-0.5 leading-relaxed">
              <span className="font-bold text-slate-900">Rajesh Oil Mills</span> ko 3 din pehle cash
              dene par <span className="font-bold text-emerald-800">2% cash discount (₹1,048 bachat)</span>{' '}
              mil raha hai.
            </p>
            <button
              onClick={() => {
                setToastMessage('Early Payment 2% Cash Discount applied!');
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="text-emerald-800 font-bold hover:underline flex items-center gap-1 mt-1 text-[11px]"
            >
              <span>Early Cash Pay Karein</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Sabhi Suppliers (8)
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Baaki Payment (6)
          </button>
          <button
            onClick={() => setActiveTab('po')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'po'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            PO Pending (4)
          </button>
        </div>

        {/* Suppliers List */}
        <div className="space-y-3">
          {/* Supplier 1: Rajesh Oil Mills */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-black text-sm">
                  RO
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">Rajesh Oil Mills</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Fortune, Dhara, Spices • Katra Bazar
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-rose-700 font-bold block">Dena Hai</span>
                <span className="text-base font-black text-rose-600">₹52,400</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2 truncate pr-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] truncate">
                  PO #PO-804 (₹28,500) • En-route • Truck dispatch hua (Today 2 PM)
                </span>
              </div>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded shrink-0">
                Aaj Sham Tak Due
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setToastMessage('Payment Entry recorded for Rajesh Oil Mills');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>💳 Payment Record</span>
              </button>
              <button
                onClick={() => {
                  setToastMessage('WhatsApp Purchase Order Sent to Rajesh Bhai!');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>💬 WhatsApp PO</span>
              </button>
            </div>
          </div>

          {/* Supplier 2: ITC Distribution Hub */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-black text-sm">
                  ITC
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">ITC Distribution Hub</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Aashirvaad, Sunfeast • Agency #12
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-rose-700 font-bold block">Dena Hai</span>
                <span className="text-base font-black text-rose-600">₹34,200</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2 truncate pr-2">
                <span>📦</span>
                <span className="text-[11px] truncate">
                  Aashirvaad 10kg Atta low stock (PO draft ready)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">Limit: ₹50k</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setToastMessage('PO Draft sent to ITC Distribution Agency!');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>🚀 Bhejo PO (Draft)</span>
              </button>
              <button
                onClick={() => {
                  setToastMessage('ITC Khata statement loaded');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📖 Pura Khata Ledger</span>
              </button>
            </div>
          </div>

          {/* Supplier 3: Gupta Wholesale Dairy */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm">
                  GD
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">Gupta Wholesale Dairy</h4>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 rounded">
                      Auto PO
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Amul, Mother Dairy • Daily Milk Van
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-rose-700 font-bold block">Dena Hai</span>
                <span className="text-base font-black text-rose-600">₹14,850</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-medium">⏰ Due: Kal Subah 7:00 AM</span>
              <span className="text-emerald-700 font-bold">Daily Milk &amp; Butter Active</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setToastMessage('UPI Dynamic QR Generated for ₹14,850');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-300" />
                <span>UPI QR Pay</span>
              </button>
              <button
                onClick={() => {
                  setToastMessage('Calling Distributor: +91 98260 12345');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Call Distributor</span>
              </button>
            </div>
          </div>

          {/* Supplier 4: Hindustan Agencies */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-sm">
                  HA
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">Hindustan Agencies</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">Surf Excel, Rin, Lifebuoy</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-700 font-bold block">Sab Paid Hai</span>
                <span className="text-base font-black text-emerald-600">+₹1,200 Adv</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700">
              <span className="text-[11px]">Agla delivery cycle: Somwar (Monday)</span>
              <button
                onClick={() => {
                  setToastMessage('Naya PO Dalein form opened!');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="text-emerald-700 font-bold text-[11px] hover:underline flex items-center gap-1"
              >
                <span>Naya PO Dalein</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 z-30 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          <button
            onClick={() => {
              setToastMessage('Supplier Ledger Report (PDF) Downloaded!');
              setTimeout(() => setToastMessage(null), 2000);
            }}
            className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Report (PDF)</span>
          </button>

          <button
            onClick={() => {
              setToastMessage('Naya Distributor Jodein Form Open');
              setTimeout(() => setToastMessage(null), 2000);
            }}
            className="flex-2 py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-emerald-300" />
            <span>+ Naya Distributor Jodein</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
