import React, { useState } from 'react';
import { AppScreen, MerchantProfile, Product } from '../types';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  CheckCircle2,
  Copy,
  Share2,
  Eye,
  Tag,
  Bike,
  QrCode,
  Check,
  Plus,
  Send,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface DigitalDukanScreenProps {
  products: Product[];
  merchant: MerchantProfile;
  onNavigate: (screen: AppScreen) => void;
  onToggleOnlineAvailable: (productId: string) => void;
}

export const DigitalDukanScreen: React.FC<DigitalDukanScreenProps> = ({
  products,
  merchant,
  onNavigate,
  onToggleOnlineAvailable,
}) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const isHi = language === 'hi';
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Online catalog toggle status
  const [catalogItems, setCatalogItems] = useState([
    {
      id: 'prod-1',
      name: 'Aashirvaad Shudh Chakki Atta',
      spec: '5 kg • ₹245 MRP',
      status: 'In Stock',
      online: true,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod-2',
      name: 'Fortune Kachi Ghani Mustard Oil',
      spec: '1 Litre Pouch • ₹155 MRP',
      status: 'In Stock',
      online: true,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod-3',
      name: 'Tata Tea Gold Rich Taste',
      spec: '500 grams • ₹290 MRP',
      status: 'Low Stock (2 left)',
      online: true,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=120&auto=format&fit=crop&q=80',
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'QB-892',
      customer: 'Rahul Verma',
      initials: 'RV',
      location: 'Civil Lines • 4 mins ago',
      amount: 780,
      payment: 'UPI Paid',
      items: 'Atta (5kg), Fortune Mustard Oil (1L) +3 more',
      count: '5 items',
      status: 'pending',
    },
    {
      id: 'QB-891',
      customer: 'Sunita Sharma',
      initials: 'SS',
      location: 'Lane 4, Near Temple • 12 mins ago',
      amount: 340,
      payment: 'Cash on Delivery',
      items: 'Tata Tea Gold (250g), Sugar (1kg), Biscuits',
      count: '3 items',
      status: 'pending',
    },
  ]);

  const storeUrl = 'quickbill.shop/sharma-kirana';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://${storeUrl}`);
    setCopied(true);
    setToastMessage('Dukan Online Link Copy Hua!');
    setTimeout(() => {
      setCopied(false);
      setToastMessage(null);
    }, 2500);
  };

  const handleShareWhatsApp = () => {
    const msg = `🏪 *Sharma Kirana Store Ab Online Hai!* 🛍️\n\nGhar baithe fresh rashan, tel aur masale mangwayein bilkul dukan ke rate par!\n\n👉 Abhi order karein: https://${storeUrl}\n⚡ Free Home Delivery on ₹299+ orders!`;
    navigator.clipboard?.writeText(msg);
    setToastMessage('WhatsApp Sharing Message Copy Hua!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAcceptOrder = (orderId: string) => {
    confetti({ particleCount: 50, spread: 60 });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'dispatched' } : o))
    );
    setToastMessage(`Order #${orderId} Dispatched for Delivery!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleOnline = (id: string) => {
    setCatalogItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, online: !item.online } : item))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
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
              {isEn ? 'Online Digital Store' : isHi ? 'ऑनलाइन डिजिटल दुकान' : 'Quickbill Online Digital Dukan'}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Sharma General Store</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setToastMessage(isEn ? 'Catalog Search Active' : isHi ? 'कैटलॉग खोज सक्रिय' : 'Catalog Search Active');
              setTimeout(() => setToastMessage(null), 1500);
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setToastMessage(isEn ? 'Online Store Settings Menu' : isHi ? 'ऑनलाइन स्टोर सेटिंग्स मेन्यू' : 'Online Store Settings Menu');
              setTimeout(() => setToastMessage(null), 1500);
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Status Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isEn ? 'Store Live 🟢 Accepting Orders' : isHi ? 'दुकान लाइव 🟢 ऑर्डर स्वीकार कर रहे हैं' : 'Dukan Live 🟢 Accepting Orders'}</span>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            {isEn ? 'OPEN' : isHi ? 'खुली है' : 'OPEN'} <Check className="w-3 h-3" />
          </span>
        </div>

        {/* Aapki Digital Dukan Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                  {isEn ? 'YOUR ONLINE STORE' : isHi ? 'आपकी डिजिटल दुकान' : 'AAPKI DIGITAL DUKAN'}
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono">{storeUrl}</span>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Share Dukan on WhatsApp button */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-300" />
            <span>{isEn ? 'Share Store on WhatsApp 📲' : isHi ? 'व्हाट्सएप पर दुकान शेयर करें 📲' : 'Share Dukan on WhatsApp 📲'}</span>
          </button>

          {/* 3 Stats Bar */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1">
              <span>📈</span>
              <span>{isEn ? '38 orders this week' : isHi ? 'इस सप्ताह 38 ऑर्डर' : '38 orders this week'}</span>
            </div>
            <span>•</span>
            <div>{isEn ? '₹14,280 sales' : isHi ? '₹14,280 कुल बिक्री' : '₹14,280 revenue'}</div>
            <span>•</span>
            <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">
              0% Comm.
            </span>
          </div>
        </div>

        {/* Quick Dukan Tools */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {isEn ? 'Online Store Tools' : isHi ? 'डिजिटल दुकान टूल्स' : 'Quick Dukan Tools'}
            </h3>
            <span className="text-xs font-semibold text-emerald-700">
              {isEn ? 'Zero Commission Direct Orders' : isHi ? 'बिना कमीशन सीधे ऑर्डर' : 'Bina Commission Direct Orders'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Tool 1 */}
            <div
              onClick={() => {
                setToastMessage('Customer Storefront Preview khula!');
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2">
                <Eye className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Preview Store</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Customer view 👁️</p>
            </div>

            {/* Tool 2 */}
            <div
              onClick={() => {
                setToastMessage('Banner Offer customizer open!');
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
                <Tag className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Add Banner Offer</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Festival discounts 🏷️</p>
            </div>

            {/* Tool 3 */}
            <div
              onClick={() => {
                setToastMessage('Delivery Rules: Minimum order ₹299 for free delivery.');
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2">
                <Bike className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Delivery Rules</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Free &gt; ₹299 🛵</p>
            </div>

            {/* Tool 4 */}
            <div
              onClick={() => {
                setToastMessage('Store QR Standee PDF Downloaded!');
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <QrCode className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Store QR Standee</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Download PDF 📄</p>
            </div>
          </div>
        </div>

        {/* Live Incoming Orders */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Live Incoming Orders</h3>
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
                {orders.length}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700">Auto-sync ON</span>
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                      {order.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{order.customer}</h4>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                          #{order.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{order.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">₹{order.amount}</span>
                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                      {order.payment}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700">
                  <span className="truncate pr-2">{order.items}</span>
                  <span className="font-semibold text-slate-500 shrink-0">{order.count}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <span>🛵 Accept &amp; Dispatch</span>
                  </button>
                  <button
                    onClick={() => {
                      setToastMessage(`WhatsApp update sent to ${order.customer}!`);
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>💬 WhatsApp Update</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Festival Offer Banner */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎉</span>
            <div>
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide block">
                SPECIAL FESTIVAL OFFER
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Flat 10% OFF on Orders above ₹999
              </h4>
              <p className="text-[10px] text-slate-500">Auto-applied at customer checkout on WhatsApp</p>
            </div>
          </div>
          <button
            onClick={() => {
              setToastMessage('Discount coupon details open!');
              setTimeout(() => setToastMessage(null), 1500);
            }}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
          >
            Edit
          </button>
        </div>

        {/* Digital Catalog */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Digital Catalog</h3>
              <p className="text-[11px] text-slate-500">48 active products visible online</p>
            </div>
            <button
              onClick={() => {
                setToastMessage('Add Product to Catalog form opened');
                setTimeout(() => setToastMessage(null), 2000);
              }}
              className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-1 border border-indigo-200"
            >
              <Plus className="w-3.5 h-3.5" /> Item Jodein
            </button>
          </div>

          <div className="space-y-2.5">
            {catalogItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.spec}</p>
                    <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => toggleOnline(item.id)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      item.online ? 'bg-emerald-700' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform transform ${
                        item.online ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                    {item.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Ke Phone Mein Aapki Dukaan Card */}
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              📣
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Customer ke phone mein aapki dukaan</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Broadcast your updated catalog link directly to 150 saved neighborhood customers in 1
                click.
              </p>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-xl p-3 text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px]">
              <span>💬</span> WhatsApp Preview
            </div>
            <p className="italic text-[11px] leading-relaxed text-slate-600">
              "Namaste! 🙏 Sharma Kirana Store is now online. Order fresh groceries &amp; daily staples
              directly from your phone with FREE home delivery. Check offers here:{' '}
              <span className="text-emerald-700 font-semibold">{storeUrl}</span>"
            </p>
          </div>

          <button
            onClick={() => {
              confetti({ particleCount: 70 });
              setToastMessage('Catalog link 150 contacts ko WhatsApp broadcast ho gaya!');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Broadcast Catalog (150 Contacts)</span>
          </button>
        </div>
      </main>
    </div>
  );
};
