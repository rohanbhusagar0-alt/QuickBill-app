import React, { useState } from 'react';
import { AppScreen, Customer, MerchantProfile } from '../types';
import {
  ArrowLeft,
  Phone,
  FileText,
  Calendar,
  Share2,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Minus,
  Star,
  Eye,
  Download,
  CreditCard,
  Building,
  Printer,
  X,
  Receipt,
  Check,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export interface BillDetailItem {
  id: string;
  name: string;
  hindiName?: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface LedgerEntry {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  title: string;
  invoiceNumber?: string;
  subtitle: string;
  amount: number;
  status: 'Unpaid' | 'Partially Paid' | 'Settled';
  date: string;
  isReceipt: boolean;
  tag?: string;
  items?: BillDetailItem[];
  paymentMode?: string;
  paymentRef?: string;
  subtotal?: number;
  gstAmount?: number;
}

interface CustomerLedgerDetailProps {
  customer: Customer;
  merchant: MerchantProfile;
  onNavigate: (screen: AppScreen) => void;
  onUpdateCustomerUdhaar: (customerId: string, newBalance: number) => void;
}

export const CustomerLedgerDetail: React.FC<CustomerLedgerDetailProps> = ({
  customer,
  merchant,
  onNavigate,
  onUpdateCustomerUdhaar,
}) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const isHi = language === 'hi';
  const [activeTab, setActiveTab] = useState<'all' | 'debit' | 'credit'>('all');
  const [balanceDue, setBalanceDue] = useState(customer.totalUdhaar || 6450);
  const [showAddModal, setShowAddModal] = useState<'GAVE' | 'GOT' | null>(null);
  const [modalAmount, setModalAmount] = useState('');
  const [modalNote, setModalNote] = useState('');
  const [selectedEntryForView, setSelectedEntryForView] = useState<LedgerEntry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Transactions list matching Screen 17 & 35 with authentic itemized bill breakdown
  const [entries, setEntries] = useState<LedgerEntry[]>([
    {
      id: 'tx-1072',
      type: 'DEBIT',
      title: 'Bill #INV-1072',
      invoiceNumber: 'INV-1072',
      subtitle: 'Groceries & Edible Oil (6 items)',
      amount: 2450,
      status: 'Unpaid',
      date: '14 Oct 2024, 04:15 PM',
      isReceipt: false,
      paymentMode: 'Khata Udhaar (Credit)',
      subtotal: 2450,
      gstAmount: 0,
      items: [
        {
          id: 'item-1',
          name: 'Fortune Sunlite Refined Sunflower Oil (1L)',
          hindiName: 'फॉर्च्यून रिफाइंड सूर्यमुखी तेल (1 लीटर)',
          qty: 2,
          unit: 'Litre',
          rate: 145,
          amount: 290,
        },
        {
          id: 'item-2',
          name: 'Aashirvaad Shudh Chakki Atta (10kg)',
          hindiName: 'आशीर्वाद शुद्ध चक्की आटा (10 कि.ग्रा.)',
          qty: 1,
          unit: 'Bag',
          rate: 420,
          amount: 420,
        },
        {
          id: 'item-3',
          name: 'Tata Salt Vacuum Evaporated (1kg)',
          hindiName: 'टाटा नमक वैक्यूम इवैपोरेटेड (1 कि.ग्रा.)',
          qty: 2,
          unit: 'Pkt',
          rate: 28,
          amount: 56,
        },
        {
          id: 'item-4',
          name: 'Madhur Pure Crystal Sugar (5kg)',
          hindiName: 'मधुर शुद्ध सल्फर-फ्री चीनी (5 कि.ग्रा.)',
          qty: 1,
          unit: 'Bag',
          rate: 230,
          amount: 230,
        },
        {
          id: 'item-5',
          name: 'Daawat Rozana Super Basmati Rice (5kg)',
          hindiName: 'दावत रोज़ाना सुपर बासमती चावल (5 कि.ग्रा.)',
          qty: 1,
          unit: 'Bag',
          rate: 480,
          amount: 480,
        },
        {
          id: 'item-6',
          name: 'Amul Pure Ghee / Cow Butter (500g)',
          hindiName: 'अमूल शुद्ध घी / मक्खन (500 ग्राम)',
          qty: 2,
          unit: 'Packs',
          rate: 487,
          amount: 974,
        },
      ],
    },
    {
      id: 'tx-gpay',
      type: 'CREDIT',
      title: 'Payment Received',
      tag: 'GPay UPI',
      subtitle: 'Txn ID: UPI/837492-AXS',
      amount: 4000,
      status: 'Settled',
      date: '10 Oct 2024, 11:32 AM',
      isReceipt: true,
      paymentMode: 'Google Pay UPI',
      paymentRef: 'UPI/837492-AXS • State Bank of India',
    },
    {
      id: 'tx-1048',
      type: 'DEBIT',
      title: 'Bill #INV-1048',
      invoiceNumber: 'INV-1048',
      subtitle: 'Atta & Spices Bulk Supply (5 items)',
      amount: 8000,
      status: 'Partially Paid',
      date: '02 Oct 2024, 02:20 PM',
      isReceipt: false,
      paymentMode: 'Khata Udhaar (Credit)',
      subtotal: 8000,
      gstAmount: 0,
      items: [
        {
          id: 'item-1048-1',
          name: 'Aashirvaad Shudh Chakki Atta (10kg)',
          hindiName: 'आशीर्वाद चक्की आटा 10 कि.ग्रा.',
          qty: 10,
          unit: 'Bags',
          rate: 410,
          amount: 4100,
        },
        {
          id: 'item-1048-2',
          name: 'Everest Super Garam Masala (500g)',
          hindiName: 'एवरेस्ट गरम मसाला 500 ग्राम',
          qty: 5,
          unit: 'Boxes',
          rate: 220,
          amount: 1100,
        },
        {
          id: 'item-1048-3',
          name: 'Everest Tikhalal Red Chilli Powder (500g)',
          hindiName: 'एवरेस्ट तीखालाल मिर्च पाउडर 500 ग्रा.',
          qty: 6,
          unit: 'Packets',
          rate: 190,
          amount: 1140,
        },
        {
          id: 'item-1048-4',
          name: 'Tata Tea Premium Leaf (1kg)',
          hindiName: 'टाटा टी प्रीमियम 1 कि.ग्रा.',
          qty: 2,
          unit: 'Packs',
          rate: 480,
          amount: 960,
        },
        {
          id: 'item-1048-5',
          name: 'Fortune Kachi Ghani Mustard Oil (1L)',
          hindiName: 'फॉर्च्यून कच्ची घानी सरसों तेल 1 ली.',
          qty: 5,
          unit: 'Litre',
          rate: 140,
          amount: 700,
        },
      ],
    },
    {
      id: 'tx-cash',
      type: 'CREDIT',
      title: 'Payment Received',
      tag: 'Cash',
      subtitle: 'Receipt #RC-89 • Counter 1',
      amount: 5000,
      status: 'Settled',
      date: '25 Sep 2024, 06:45 PM',
      isReceipt: true,
      paymentMode: 'Cash at Counter 1',
      paymentRef: 'Cash Receipt #RC-89 • Verified by Munim',
    },
  ]);

  const handleSendReminder = () => {
    const msg = `*${merchant.shopName || 'Sharma General Store'}*\n\nNamaste ${customer.name || 'Sunil Mehta'} ji! 🙏\nAapke khate ka kul baaki udhaar *₹${balanceDue.toLocaleString('en-IN')}* hai.\n\nKripya UPI dwara turant bhugtan karein:\nupi://pay?pa=${merchant.upiId || 'sharmastore@okicici'}&pn=${encodeURIComponent(merchant.shopName || 'Sharma General Store')}&am=${balanceDue}&cu=INR\n\nDhanyawad!`;
    window.open(`https://wa.me/91${customer.phone || '9823456789'}?text=${encodeURIComponent(msg)}`, '_blank');
    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {
      // ignore
    }
  };

  const handleShareBillWhatsApp = (entry: LedgerEntry) => {
    let msg = `*${merchant.shopName || 'Sharma General Store'}* - Invoice\n`;
    msg += `📄 ${entry.title}\n`;
    msg += `🗓️ Date: ${entry.date}\n`;
    msg += `👤 Customer: ${customer.name || 'Sunil Mehta'}\n`;
    msg += `----------------------------\n`;

    if (entry.items && entry.items.length > 0) {
      msg += `*Items Details (${entry.items.length} items):*\n`;
      entry.items.forEach((item, idx) => {
        msg += `${idx + 1}. ${item.name}\n   ${item.qty} ${item.unit} × ₹${item.rate} = ₹${item.amount}\n`;
      });
      msg += `----------------------------\n`;
    }

    msg += `*Total Bill Amount: ₹${entry.amount.toLocaleString('en-IN')}*\n`;
    msg += `Status: ${entry.status}\n\n`;
    msg += `Pay via UPI:\nupi://pay?pa=${merchant.upiId || 'sharmastore@okicici'}&pn=${encodeURIComponent(merchant.shopName || 'Sharma General Store')}&am=${entry.amount}&cu=INR\n\nThank you for shopping with us! 🙏`;

    window.open(`https://wa.me/91${customer.phone || '9823456789'}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('WhatsApp Invoice Share Link Opened!');
  };

  const handleAddEntry = () => {
    const amt = Number(modalAmount);
    if (!amt || amt <= 0) return;

    if (showAddModal === 'GAVE') {
      const newBal = balanceDue + amt;
      setBalanceDue(newBal);
      onUpdateCustomerUdhaar(customer.id, newBal);
      const invNum = `INV-${Math.floor(1080 + Math.random() * 50)}`;
      
      const newEntry: LedgerEntry = {
        id: `tx-${Date.now()}`,
        type: 'DEBIT',
        title: `Bill #${invNum}`,
        invoiceNumber: invNum,
        subtitle: modalNote ? `${modalNote} (Items Billed)` : 'Groceries & Provisions',
        amount: amt,
        status: 'Unpaid',
        date: 'Today, Just now',
        isReceipt: false,
        paymentMode: 'Khata Udhaar',
        subtotal: amt,
        items: [
          {
            id: `item-${Date.now()}-1`,
            name: modalNote || 'Kirana & Provisions Pack',
            hindiName: 'किराना और घरेलू सामान',
            qty: 1,
            unit: 'Pack',
            rate: amt,
            amount: amt,
          },
        ],
      };

      setEntries((prev) => [newEntry, ...prev]);
      showToast(`₹${amt} Udhaar added to ${customer.name}'s Khata!`);
    } else {
      const newBal = Math.max(0, balanceDue - amt);
      setBalanceDue(newBal);
      onUpdateCustomerUdhaar(customer.id, newBal);
      
      const newEntry: LedgerEntry = {
        id: `tx-${Date.now()}`,
        type: 'CREDIT',
        title: 'Payment Received',
        tag: 'Cash',
        subtitle: modalNote ? `${modalNote} • Counter Slip` : 'Receipt #RC-92 • Counter Slip',
        amount: amt,
        status: 'Settled',
        date: 'Today, Just now',
        isReceipt: true,
        paymentMode: 'Cash / Payment Received',
        paymentRef: 'Receipt #RC-92',
      };

      setEntries((prev) => [newEntry, ...prev]);
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {
        // ignore
      }
      showToast(`₹${amt} Jama received from ${customer.name}!`);
    }

    setShowAddModal(null);
    setModalAmount('');
    setModalNote('');
  };

  const filteredEntries = entries.filter((e) => {
    if (activeTab === 'debit') return e.type === 'DEBIT';
    if (activeTab === 'credit') return e.type === 'CREDIT';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans select-none pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#006948] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header matching Screens 17 & 35 */}
      <header className="bg-white border-b border-slate-200/90 px-4 py-3 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('khata_book')}
            className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {customer.name || 'Sunil Mehta'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{customer.phone || '+91 98234 56789'}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-emerald-700 font-semibold">Regular Customer</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${customer.phone || '9823456789'}`}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
            title="Call Customer"
          >
            <Phone className="w-4 h-4 text-emerald-700" />
          </a>
          <button
            onClick={handleSendReminder}
            className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
            title="WhatsApp Reminder"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full px-4 pt-3.5 space-y-3.5 flex-1">
        {/* Customer Balance Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('maine_lena_hai', 'Total Outstanding Credit (You Will Get)')}
            </span>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" /> 5 Days Overdue
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-rose-600 tracking-tight">
              ₹{balanceDue.toLocaleString('en-IN')}
            </div>
            <div className="text-right text-xs text-slate-400">
              Last txn: 14 Oct 2024
            </div>
          </div>

          {/* Credit Limit & Trust Score Strip */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Credit Limit</span>
                <span className="font-bold text-slate-700">64%</span>
              </div>
              <div className="font-extrabold text-slate-900 text-sm mt-1">₹10,000</div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-800 rounded-full w-[64%]"></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Trust Score</span>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </div>
              <div className="font-extrabold text-slate-900 text-sm mt-1">
                4.2 <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">
                Reliable Customer
              </div>
            </div>
          </div>

          {/* Big Emerald Button: Send Reminder & UPI Link */}
          <button
            onClick={handleSendReminder}
            className="w-full bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Send Reminder &amp; UPI Link</span>
          </button>
        </div>

        {/* Filter Tabs & Statement */}
        <div className="flex items-center justify-between px-1">
          <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-bold text-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({entries.length})
            </button>
            <button
              onClick={() => setActiveTab('debit')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'debit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Bills (Debit)
            </button>
            <button
              onClick={() => setActiveTab('credit')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'credit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Payments (Credit)
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-emerald-800 font-bold text-xs hover:underline cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Statement</span>
          </button>
        </div>

        {/* Ledger Transactions List matching User Screenshot */}
        <div className="flex flex-col gap-2.5">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col gap-2 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      entry.type === 'DEBIT'
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {entry.type === 'DEBIT' ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{entry.title}</span>
                      {entry.tag && (
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          {entry.tag}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{entry.subtitle}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm font-black ${
                      entry.type === 'DEBIT' ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {entry.type === 'DEBIT' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                      entry.status === 'Unpaid'
                        ? 'bg-rose-100 text-rose-700'
                        : entry.status === 'Partially Paid'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
              </div>

              {/* Bottom Action Row with View & Share PDF */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Clock className="w-3 h-3" />
                  <span>{entry.date}</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold">
                  {/* View Button: Opens Detailed Bill Modal */}
                  <button
                    onClick={() => setSelectedEntryForView(entry)}
                    className="text-slate-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer font-bold px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-700" />
                    <span>View</span>
                  </button>
                  <span className="text-slate-300">•</span>
                  {/* Share PDF Button */}
                  <button
                    onClick={() => handleShareBillWhatsApp(entry)}
                    className="text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer font-bold px-2 py-0.5 rounded hover:bg-emerald-50 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Bottom Action Buttons: You Gave (Udhaar) vs You Got (Jama) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal('GAVE')}
            className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Minus className="w-4 h-4" />
            <span>You Gave (Udhaar)</span>
          </button>

          <button
            onClick={() => setShowAddModal('GOT')}
            className="flex-1 bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>You Got (Jama)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AUTHENTIC BILL DETAILS MODAL (VIEW PAR TAP KARNE PAR SARA DETAILS)        */}
      {/* ========================================================================= */}
      {selectedEntryForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#006948] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{selectedEntryForView.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        selectedEntryForView.status === 'Unpaid'
                          ? 'bg-rose-500 text-white'
                          : selectedEntryForView.status === 'Partially Paid'
                          ? 'bg-amber-400 text-slate-900'
                          : 'bg-emerald-400 text-slate-950'
                      }`}
                    >
                      {selectedEntryForView.status}
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    {merchant.shopName || 'Sharma General Store'} • Tax Invoice
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEntryForView(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* Store & Bill Info Strip */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-start text-xs border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Dukan / Merchant
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {merchant.shopName || 'Sharma General & Provision Store'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {merchant.address || 'Shop No. 14, Main Market, Sector 18, Noida'}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      GSTIN: {merchant.gstin || '07AABCS1429B1Z'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Date &amp; Time
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">
                      {selectedEntryForView.date}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                      {selectedEntryForView.paymentMode || 'Credit Ledger'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-0.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Customer / Grahak
                    </span>
                    <span className="font-bold text-slate-900">
                      {customer.name || 'Sunil Mehta'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Mobile Number
                    </span>
                    <span className="font-mono text-slate-700 text-xs font-semibold">
                      {customer.phone || '+91 98234 56789'}
                    </span>
                  </div>
                </div>
              </div>

              {/* If it's a DEBIT BILL: Show Full Itemized List! */}
              {selectedEntryForView.type === 'DEBIT' && selectedEntryForView.items && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-emerald-700" />
                      <span>
                        Kharide Gaye Samaan (Purchased Items - {selectedEntryForView.items.length})
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Rates &amp; Qty
                    </span>
                  </div>

                  {/* Items Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                          <th className="py-2 px-2.5 w-7 text-center">#</th>
                          <th className="py-2 px-2">Item Description</th>
                          <th className="py-2 px-2 text-center">Qty</th>
                          <th className="py-2 px-2 text-right">Rate</th>
                          <th className="py-2 px-2.5 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedEntryForView.items.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2 px-2.5 text-center text-slate-400 font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-2">
                              <div className="font-bold text-slate-900 leading-tight">
                                {isHi && item.hindiName ? item.hindiName : item.name}
                              </div>
                              {!isEn && !isHi && item.hindiName && (
                                <div className="text-[10px] text-slate-500 font-medium">
                                  {item.hindiName}
                                </div>
                              )}
                            </td>
                            <td className="py-2 px-2 text-center font-bold text-slate-700 whitespace-nowrap">
                              {item.qty} {item.unit}
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-slate-600 whitespace-nowrap">
                              ₹{item.rate}
                            </td>
                            <td className="py-2 px-2.5 text-right font-black text-slate-900 whitespace-nowrap">
                              ₹{item.amount.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* If it's a CREDIT PAYMENT: Show Payment Receipt Voucher */}
              {selectedEntryForView.type === 'CREDIT' && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Payment Received Voucher</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Payment Mode</span>
                      <span className="font-bold text-slate-900">{selectedEntryForView.paymentMode || 'UPI'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Status</span>
                      <span className="font-bold text-emerald-700">✓ Settled &amp; Verified</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 block">Reference / Txn ID</span>
                      <span className="font-mono text-slate-800 font-bold text-[11px]">
                        {selectedEntryForView.paymentRef || 'UPI/837492-AXS • State Bank of India'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Calculation Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal (Item Total)</span>
                  <span className="font-mono font-bold text-slate-800">
                    ₹{selectedEntryForView.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST / Tax (Inclusive)</span>
                  <span className="font-mono text-slate-500">₹0.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Discount</span>
                  <span className="font-mono text-emerald-600">₹0.00</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black">
                  <span className="text-slate-900 text-sm">
                    {selectedEntryForView.type === 'DEBIT' ? 'Total Bill Amount' : 'Total Amount Paid'}
                  </span>
                  <span className="text-lg text-emerald-800 font-mono">
                    ₹{selectedEntryForView.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                  showToast('Printing Bill Receipt...');
                }}
                className="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => handleShareBillWhatsApp(selectedEntryForView)}
                className="flex-1 py-2.5 bg-[#006948] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-black text-slate-900 mb-1">
              {showAddModal === 'GAVE' ? 'Maine Udhaar Diya (Debit)' : 'Paisa Prapt Hua (Credit)'}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Customer: {customer.name || 'Sunil Mehta'}
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Note / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Atta, Tel, Chawal (Items details)"
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                className={`flex-1 py-2 rounded-xl text-xs font-bold text-white cursor-pointer ${
                  showAddModal === 'GAVE' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#006948] hover:bg-emerald-800'
                }`}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
