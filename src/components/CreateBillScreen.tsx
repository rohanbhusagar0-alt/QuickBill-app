import React, { useState } from 'react';
import { AppScreen, Bill, BillItem, Customer, MerchantProfile, Product } from '../types';
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  Share2,
  Printer,
  QrCode,
  Mic,
  Barcode,
  CheckCircle2,
  X,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakSoundboxPayment } from '../utils/audioSoundbox';
import { useLanguage } from '../context/LanguageContext';

interface CreateBillScreenProps {
  products: Product[];
  customers: Customer[];
  merchant: MerchantProfile;
  onNavigate: (screen: AppScreen) => void;
  onSaveBill: (bill: Bill) => void;
  initialItems?: BillItem[];
  voicePrefilledItems?: BillItem[];
  scannedProduct?: Product;
}

export const CreateBillScreen: React.FC<CreateBillScreenProps> = ({
  products,
  customers,
  merchant,
  onNavigate,
  onSaveBill,
  initialItems = [],
  voicePrefilledItems,
  scannedProduct,
}) => {
  const { language, t } = useLanguage();
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [cart, setCart] = useState<BillItem[]>(() => {
    if (voicePrefilledItems && voicePrefilledItems.length > 0) {
      return voicePrefilledItems;
    }
    if (initialItems.length > 0) {
      return initialItems;
    }
    if (scannedProduct) {
      return [
        {
          productId: scannedProduct.id,
          name: scannedProduct.name,
          nameHindi: scannedProduct.nameHindi,
          qty: 1,
          unit: scannedProduct.unit,
          price: scannedProduct.sellingPrice,
          mrp: scannedProduct.mrp,
          discountPercent: 0,
          gstRate: scannedProduct.gstRate,
          total: scannedProduct.sellingPrice,
        },
      ];
    }
    return [
      {
        productId: 'prod-1',
        name: 'Aashirvaad Shudh Chakki Atta 5kg',
        nameHindi: 'आशीर्वाद चक्की आटा 5 कि.ग्रा.',
        qty: 1,
        unit: 'packet',
        price: 245,
        mrp: 260,
        discountPercent: 5,
        gstRate: 0,
        total: 232.75,
      },
    ];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'UDHAAR' | 'SPLIT'>('UPI');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdBill, setCreatedBill] = useState<Bill | null>(null);

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountTotal = cart.reduce(
    (sum, item) => sum + (item.price * item.qty * item.discountPercent) / 100,
    0
  );
  const taxableAmount = subtotal - discountTotal;
  const taxTotal = cart.reduce((sum, item) => {
    const itemNet = item.price * item.qty * (1 - item.discountPercent / 100);
    return sum + (itemNet * item.gstRate) / 100;
  }, 0);
  const rawGrandTotal = taxableAmount + taxTotal;
  const grandTotal = Math.round(rawGrandTotal);
  const roundOff = Number((grandTotal - rawGrandTotal).toFixed(2));

  // Add Product to Cart
  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      setCart(
        cart.map((item) => {
          if (item.productId === product.id) {
            const newQty = item.qty + 1;
            const newTotal = Number(
              (newQty * item.price * (1 - item.discountPercent / 100)).toFixed(2)
            );
            return { ...item, qty: newQty, total: newTotal };
          }
          return item;
        })
      );
    } else {
      const newItem: BillItem = {
        productId: product.id,
        name: product.name,
        nameHindi: product.nameHindi,
        qty: 1,
        unit: product.unit,
        price: product.sellingPrice,
        mrp: product.mrp,
        discountPercent: 0,
        gstRate: product.gstRate,
        total: product.sellingPrice,
      };
      setCart([newItem, ...cart]);
    }
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            const newTotal = Number(
              (newQty * item.price * (1 - item.discountPercent / 100)).toFixed(2)
            );
            return { ...item, qty: newQty, total: newTotal };
          }
          return item;
        })
        .filter(Boolean) as BillItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart(cart.filter((i) => i.productId !== productId));
  };

  // Finalize Bill
  const handleGenerateBill = (sendWhatsapp: boolean = false) => {
    if (cart.length === 0) return;

    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      billNumber: `QB-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '9876543210',
      items: cart,
      subtotal,
      discountTotal,
      taxTotal,
      totalGst: taxTotal,
      roundOff,
      grandTotal,
      paymentMode,
      cashAmount: paymentMode === 'CASH' ? grandTotal : 0,
      upiAmount: paymentMode === 'UPI' ? grandTotal : 0,
      udhaarAmount: paymentMode === 'UDHAAR' ? grandTotal : 0,
      status: paymentMode === 'UDHAAR' ? 'UNPAID' : 'PAID',
    };

    onSaveBill(newBill);
    setCreatedBill(newBill);

    if (paymentMode === 'UPI') {
      speakSoundboxPayment(grandTotal, merchant.shopName, language);
    }

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // fallback
    }

    if (sendWhatsapp) {
      const itemsListText = cart
        .map((it, idx) => `${idx + 1}. ${it.name} x${it.qty} ${it.unit} = ₹${it.total}`)
        .join('\n');
      const greeting = t('namaste', 'नमस्ते');
      const billReady = t('bill_ready_msg', 'आपका बिल तैयार है');
      const totalLabel = t('grand_total', 'कुल राशि');
      const payModeLabel = t('payment_mode', 'भुगतान मोड');
      const viewDigitalBill = t('view_digital_bill', 'डिजिटल बिल देखें और UPI पेमेंट करें');
      const shopLabel = t('shop', 'दुकान');
      const phoneLabel = t('phone', 'फ़ोन');
      const thankYou = t('thank_you_visit_again', 'धन्यवाद! फिर पधारिए।');

      const whatsappMsg = `*${merchant.shopName}*\n\n${greeting} ${newBill.customerName}! 🙏\n${billReady} (#${newBill.billNumber}):\n\n${itemsListText}\n\n*${totalLabel}: ₹${grandTotal}*\n${payModeLabel}: ${paymentMode}\n\n${viewDigitalBill}:\nhttps://quickbill.shop/bill/${newBill.billNumber}\n\n${shopLabel}: ${merchant.address}\n${phoneLabel}: ${merchant.phone}\n_${thankYou}_`;
      window.open(
        `https://wa.me/91${newBill.customerPhone}?text=${encodeURIComponent(whatsappMsg)}`,
        '_blank'
      );
    }

    setShowSuccessModal(true);
  };

  // Filter products for quick search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery)
  );

  return (
    <div className="min-h-full bg-surface text-on-surface flex flex-col justify-between">
      {/* Top Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/30 shadow-2xs px-4 py-3 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home_dashboard')}
              className="p-1.5 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-on-surface flex items-center gap-2">
                <span>{t('create_new_bill', 'नया बिल बनाएं (POS)')}</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
                  {t('tax_invoice_tag', 'टैक्स इनवॉइस')}
                </span>
              </h1>
              <p className="text-xs text-on-surface-variant">{t('whatsapp_invoice_sub', '1-क्लिक व्हाट्सएप पर्ची')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('voice_billing')}
              className="flex items-center gap-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{t('nav_voice', 'बोलकर बिल')}</span>
            </button>

            <button
              onClick={() => onNavigate('barcode_scanner')}
              className="flex items-center gap-1 bg-primary/10 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              <Barcode className="w-3.5 h-3.5" />
              <span>{t('scan_barcode', 'बारकोड')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 sm:p-5 space-y-4 flex-1">
        {/* Customer Input Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-3.5 rounded-2xl">
          <div className="text-xs font-bold text-on-surface-variant mb-2 flex items-center justify-between">
            <span>{t('customer_name', 'ग्राहक का नाम')} & {t('customer_phone', 'मोबाइल नंबर')}</span>
            <span className="text-[11px] text-on-surface-variant">{t('whatsapp_invoice_sub', '1-Click WhatsApp')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('customer_name', 'ग्राहक का नाम')}
              className="bg-white border border-outline-variant/40 rounded-xl px-3 py-2 text-sm text-on-surface focus:border-primary outline-none shadow-2xs"
            />
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-primary">🇮🇳 +91</span>
              <input
                type="tel"
                maxLength={10}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                placeholder={t('customer_phone', 'मोबाइल नंबर')}
                className="w-full bg-white border border-outline-variant/40 rounded-xl pl-16 pr-3 py-2 text-sm font-semibold text-on-surface focus:border-primary outline-none shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Product Search & Quick Add */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-3.5 rounded-2xl">
          <div className="relative mb-2.5">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_product', 'सामान खोजें या नाम लिखें...')}
              className="w-full bg-white border border-outline-variant/40 rounded-xl pl-9 pr-3 py-2.5 text-sm text-on-surface focus:border-primary outline-none shadow-2xs"
            />
          </div>

          {/* Quick Item Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filteredProducts.slice(0, 8).map((p) => (
              <button
                key={p.id}
                onClick={() => handleAddToCart(p)}
                className="bg-surface hover:bg-emerald-900/30 border border-outline-variant/30 hover:border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-left shrink-0 cursor-pointer transition-all active:scale-95"
              >
                <div className="text-xs font-bold text-on-surface truncate max-w-[130px]">{p.name}</div>
                <div className="text-[11px] text-primary font-semibold">₹{p.sellingPrice}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Billing Cart Items Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-2xl overflow-hidden">
          <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between text-xs font-bold text-on-surface-variant">
            <span>{t('items_label', 'सामान')} ({cart.length} {t('items_label', 'सामान')})</span>
            <span>{t('grand_total', 'कुल')}: ₹{grandTotal}</span>
          </div>

          {cart.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              {t('empty_cart', 'बिल में अभी कोई सामान नहीं है')}
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {cart.map((item) => (
                <div key={item.productId} className="p-3 sm:p-4 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-on-surface truncate">{item.name}</div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
                      <span>{t('price', 'दर')}: ₹{item.price}</span>
                      {item.gstRate > 0 && (
                        <span className="text-[10px] bg-surface-container-high text-on-surface-variant px-1 rounded">
                          GST {item.gstRate}%
                        </span>
                      )}
                      {item.discountPercent > 0 && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1 rounded">
                          -{item.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-surface border border-outline-variant/30 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => handleUpdateQty(item.productId, -1)}
                      className="w-7 h-7 rounded-lg bg-surface-container-high hover:bg-surface-container flex items-center justify-center text-white cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-on-surface">{item.qty}</span>
                    <button
                      onClick={() => handleUpdateQty(item.productId, 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total Amount */}
                  <div className="text-right min-w-[70px] shrink-0">
                    <div className="text-sm font-black text-on-surface">₹{item.total}</div>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-0.5 ml-auto mt-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t('delete', 'हटाएं')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Mode Selector */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-3.5 rounded-2xl">
          <div className="text-xs font-bold text-on-surface-variant mb-2">{t('payment_mode', 'भुगतान का प्रकार')}</div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setPaymentMode('UPI')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                paymentMode === 'UPI'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                  : 'bg-surface text-on-surface-variant border-outline-variant/30'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>{t('upi_qr', 'UPI QR')}</span>
            </button>

            <button
              onClick={() => setPaymentMode('CASH')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                paymentMode === 'CASH'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-surface text-on-surface-variant border-outline-variant/30'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{t('cash', 'नकद')}</span>
            </button>

            <button
              onClick={() => setPaymentMode('UDHAAR')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                paymentMode === 'UDHAAR'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                  : 'bg-surface text-on-surface-variant border-outline-variant/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('udhaar_credit', 'उधार')}</span>
            </button>

            <button
              onClick={() => setPaymentMode('SPLIT')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                paymentMode === 'SPLIT'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                  : 'bg-surface text-on-surface-variant border-outline-variant/30'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{t('split_payment', 'स्प्लिट')}</span>
            </button>
          </div>
        </div>

        {/* Invoice Summary Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-4 rounded-2xl text-xs space-y-1.5">
          <div className="flex justify-between text-on-surface-variant">
            <span>{t('subtotal', 'सामान कुल')}:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discountTotal > 0 && (
            <div className="flex justify-between text-rose-400">
              <span>{t('discount', 'छूट')}:</span>
              <span>-₹{discountTotal.toFixed(2)}</span>
            </div>
          )}
          {taxTotal > 0 && (
            <div className="flex justify-between text-on-surface-variant">
              <span>{t('gst_tax', 'जीएसटी टैक्स')}:</span>
              <span>₹{taxTotal.toFixed(2)}</span>
            </div>
          )}
          {roundOff !== 0 && (
            <div className="flex justify-between text-on-surface-variant">
              <span>{t('round_off', 'राउंड ऑफ')}:</span>
              <span>{roundOff > 0 ? `+₹${roundOff}` : `-₹${Math.abs(roundOff)}`}</span>
            </div>
          )}
          <div className="border-t border-outline-variant/30 pt-2 flex justify-between text-base font-black text-on-surface">
            <span>{t('grand_total', 'कुल देय राशि')}:</span>
            <span className="text-primary text-xl">₹{grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-surface-container-lowest border-t border-outline-variant/30 p-3 sm:p-4 sticky bottom-0 z-20 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-2.5">
          <button
            onClick={() => handleGenerateBill(false)}
            disabled={cart.length === 0}
            className="flex-1 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 text-on-surface font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-primary" />
            <span>{t('print_invoice', 'पर्ची प्रिंट')}</span>
          </button>

          <button
            onClick={() => handleGenerateBill(true)}
            disabled={cart.length === 0}
            className="flex-1 bg-primary hover:bg-primary-container text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('share_whatsapp', 'WhatsApp शेयर')} (₹{grandTotal})</span>
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && createdBill && (
        <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-primary/30 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black text-on-surface">{t('payment_success', 'बिल सफलतापूर्वक बन गया!')}</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {t('bill_no', 'बिल #')}: {createdBill.billNumber} • {t('grand_total', 'राशि')} ₹{createdBill.grandTotal}
              </p>
            </div>

            <div className="bg-surface p-3 rounded-2xl border border-outline-variant/30 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{t('customer_name', 'ग्राहक')}:</span>
                <span className="font-bold text-on-surface">{createdBill.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{t('customer_phone', 'मोबाइल')}:</span>
                <span className="font-bold text-on-surface">+91 {createdBill.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{t('payment_mode', 'पेमेंट मोड')}:</span>
                <span className="font-bold text-primary">{createdBill.paymentMode}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate('thermal_printer_designer');
                }}
                className="w-full bg-primary hover:bg-primary-container text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>{t('printer_designer', 'थर्मल रसीद प्रिंटर प्रिव्यू देखें')}</span>
              </button>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setCart([]);
                  onNavigate('home_dashboard');
                }}
                className="w-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-on-surface font-semibold py-2.5 rounded-xl text-xs cursor-pointer shadow-2xs"
              >
                {t('done', 'डैशबोर्ड पर जाएं (Done)')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
