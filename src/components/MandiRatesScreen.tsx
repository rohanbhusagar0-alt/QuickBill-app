import React, { useState } from 'react';
import { AppScreen } from '../types';
import {
  ArrowLeft,
  ChevronRight,
  Filter,
  HelpCircle,
  MessageSquare,
  Percent,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  CheckCircle2,
  FileText,
  Bell,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface MandiRatesScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const MandiRatesScreen: React.FC<MandiRatesScreenProps> = ({ onNavigate }) => {
  const { t, language, supportedLanguages } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'oils' | 'grains'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alertActive, setAlertActive] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#047857', '#10b981', '#34d399'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => {
      setOrderPlaced(false);
      onNavigate('supplier_khata');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-32">
      {/* Top Header matching Screen 08 */}
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
                Quickbill B2B Mandi Rates
              </span>
              <span className="text-[11px] text-slate-500">Sharma General Store</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1">
              <span className="text-emerald-700 font-bold">文A</span>
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
        {/* Status Sub-bar */}
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Live Mandi &amp; Distributor Rates</span>
            <span className="text-slate-400">• Updated 12m ago</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-emerald-800 font-bold hover:underline cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Big Green Hero Card: PICHLE MAHINE KI WHOLESALE BACHAT */}
        <div className="bg-[#006948] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
            <span>PICHLE MAHINE KI WHOLESALE BACHAT</span>
            <span className="text-base">💼</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">₹18,450</span>
            <span className="bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              +₹3,200 vs Last Month
            </span>
          </div>

          <div className="pt-2 border-t border-emerald-700/80 flex items-center justify-between text-xs text-emerald-100">
            <div className="flex items-center gap-1 font-semibold">
              <TrendingDown className="w-4 h-4 text-emerald-300" />
              <span>Avg. 7.4% Below Local Mandi Rate</span>
            </div>
            <span className="text-[11px] underline cursor-pointer text-emerald-200 hover:text-white">
              Details Dekhein
            </span>
          </div>
        </div>

        {/* Search Bar & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Fortune Tel, Basmati Chawal, Sugar M..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 shadow-xs"
            />
          </div>
          <button className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-slate-50 cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#006948] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Sabhi Bhaav (All)
          </button>
          <button
            onClick={() => setActiveCategory('oils')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === 'oils'
                ? 'bg-[#006948] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Edible Oils (तेल)
          </button>
          <button
            onClick={() => setActiveCategory('grains')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === 'grains'
                ? 'bg-[#006948] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Atta &amp; Grains (अनाज)
          </button>
        </div>

        {/* Section: Daily Mandi Bhav Ticker */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Daily Mandi Bhav Ticker</span>
            </div>
            <span className="text-[10px] text-slate-400">Swiped Live Index</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2">
              <div className="text-[10px] text-slate-500">Chana Dal</div>
              <div className="font-extrabold text-sm text-slate-900 mt-0.5">₹74/kg</div>
              <div className="text-[10px] text-rose-600 font-bold mt-0.5">▲ +₹1.2</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2">
              <div className="text-[10px] text-slate-500">Mustard (Sarson)</div>
              <div className="font-extrabold text-sm text-slate-900 mt-0.5">₹54/kg</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">▼ -₹0.8</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2">
              <div className="text-[10px] text-slate-500">Sugar M-30</div>
              <div className="font-extrabold text-sm text-slate-900 mt-0.5">₹38.5/kg</div>
              <div className="text-[10px] text-slate-500 font-bold mt-0.5">― Stable</div>
            </div>
          </div>
        </div>

        {/* Section: Live Distributor Price War */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-black text-slate-900">Live Distributor Price War</h3>
              <p className="text-[11px] text-slate-500">Compare rates across verified local suppliers</p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              2 Deals Ready
            </span>
          </div>

          {/* Deal 1: Fortune Oil */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-2xl">
                🛢️
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>FMCG Master Wholesalers</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-0.5">
                  Fortune Sunlite Sunflower Oil (15L Tin)
                </h4>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  ↘ Mandi fell ₹25 this week
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              LIVE SUPPLIER RATES:
            </div>

            {/* Rates Table */}
            <div className="space-y-1.5">
              {/* Lowest Deal */}
              <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>Mahaveer Agro Mandi</span>
                    <span className="text-[10px] text-slate-500 font-normal">(3.2 km)</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 mt-0.5">
                    Save ₹85 per tin! Min: 5 Tins • COD / 7-Day Khata
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase block mb-0.5">
                    🏆 Lowest Deal
                  </span>
                  <div className="font-black text-slate-900 text-sm">₹1,640<span className="text-[10px] font-normal text-slate-500">/tin</span></div>
                </div>
              </div>

              {/* Supplier 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">Rajesh Trading Co.</div>
                  <div className="text-[10px] text-slate-500">Min: 2 Tins • Instant UPI</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">₹1,695</div>
                  <div className="text-[10px] text-rose-600 font-bold">+₹55 vs Lowest</div>
                </div>
              </div>

              {/* Supplier 3 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">Gupta Brothers Wholesale</div>
                  <div className="text-[10px] text-slate-500">In Stock • Delivery in 4 hrs</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">₹1,725</div>
                  <div className="text-[10px] text-rose-600 font-bold">+₹85 vs Lowest</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handlePlaceOrder}
                className="flex-1 py-2.5 bg-[#006948] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Order 5 Tins (₹8,200)</span>
              </button>
              <button
                onClick={() => window.open('https://wa.me/919876543210?text=Namaste Mahaveer Agro ji, mujhe Fortune 15L tin ke rate par order chahiye.', '_blank')}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Deal 2: Aashirvaad Atta Bundle */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 text-2xl">
                🌾
              </div>
              <div className="flex-1 min-w-0">
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  Direct Mill Depot
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-1">
                  Aashirvaad Atta (10kg x 10 Bags Bundle)
                </h4>
                <div className="text-[10px] text-slate-500">Standard retail pricing: ₹385/bag</div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-900">
              🎁 <strong>Special Depot Scheme Active!</strong> Buy 20 Bags get 1 Bag FREE (Adds +5% extra margin)
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>Anand Super Wholesaler</span>
                    <span className="text-[10px] text-amber-600 font-bold">★ 4.9</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Delivery tomorrow 8 AM • Mill Authorized</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 text-sm">₹342<span className="text-[10px] font-normal text-slate-500">/bag</span></div>
                  <div className="text-[10px] text-emerald-700 font-bold">Save ₹18/bag</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Local Mandi Vyapar Association</div>
                  <div className="text-[10px] text-slate-500">Standard Broker Rate</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">₹360/bag</div>
                  <div className="text-[10px] text-rose-600 font-bold">+₹18 higher</div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-2.5 bg-[#006948] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add 20 Bags Bundle (₹6,840)</span>
            </button>
          </div>
        </div>

        {/* Section: 👥 Mohalla Group Buying Pool */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Mohalla Group Buying Pool</span>
            </h3>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              3h 24m Left
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            Aas-paas ke 4 dukaandaaron ke sath milkar bulk order karein! Factory/Depot volume target pura hote hi sabhi ko wholesale tier-1 rates milenge.
          </p>

          <div className="border border-indigo-200 rounded-xl p-3 flex flex-col gap-2 bg-indigo-50/30">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                  Active Neighborhood Pool #408
                </span>
                <div className="font-bold text-xs text-slate-900 mt-1">
                  Basmati Rice 25kg Master Bags Pool
                </div>
                <div className="text-[10px] text-slate-500">Rice Mill Hub, Karnal Direct Inflow</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-emerald-800">₹1,820<span className="text-[10px] font-normal text-slate-500">/bag</span></div>
                <div className="text-[10px] text-slate-400 line-through">Single: ₹2,050</div>
              </div>
            </div>

            <div className="bg-emerald-100 text-emerald-900 text-[10px] font-bold p-1.5 rounded-lg flex items-center justify-between">
              <span>⚡ Total Bachat: ₹230 Per Bag!</span>
              <span>Delivered at Store</span>
            </div>

            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-indigo-600 rounded-full w-[76%]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 font-semibold">
              <span>38 / 50 Bags Locked (76%)</span>
              <span className="text-indigo-700">Only 12 Bags remaining!</span>
            </div>

            {/* Participating stores */}
            <div className="pt-2 border-t border-indigo-100 flex flex-wrap gap-1 text-[10px]">
              <span className="bg-white border border-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">
                🏪 Sharma Store (You - 15 bags)
              </span>
              <span className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                🏪 Verma Kirana (12 bags)
              </span>
              <span className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                🏪 Gupta Ji Super (11 bags)
              </span>
            </div>

            <button
              onClick={() => {
                try {
                  confetti({ particleCount: 30, spread: 40 });
                } catch {
                  // ignore
                }
              }}
              className="w-full mt-1 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              + Add My Share (5 or 10 Bags)
            </button>
          </div>
        </div>

        {/* Mandi Rate Drop Alerts Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Mandi Rate Drop Alerts</h4>
                <div className="text-[10px] text-slate-500">Get instant SMS/WhatsApp alerts when rates hit bottom</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={alertActive}
                onChange={(e) => setAlertActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006948]"></div>
            </label>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-700 font-medium">Alert set: <strong>Edible Oil drops below ₹110/L</strong></span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <button
            onClick={() => window.open('https://wa.me/919876543210?text=Namaste, mujhe aaj ke sabhi wholesale mandi rate ka quotation PDF bhejein.', '_blank')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Bhav Quotation PDF WhatsApp par bhejo</span>
          </button>
        </div>
      </main>

      {/* Sticky Bottom Bar matching Screen 08 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>2 Wholesalers Selected</span>
            </div>
            <div className="text-base font-black text-slate-900 leading-none mt-0.5">
              ₹14,840 <span className="text-xs text-emerald-700 font-bold">(Bachat ₹1,425)</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="flex-1 bg-[#006948] hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{orderPlaced ? 'Order Bheja Gaya!' : 'Place Mandi Order →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
