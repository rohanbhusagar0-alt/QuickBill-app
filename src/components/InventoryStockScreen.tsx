import React, { useState } from 'react';
import { AppScreen, Product } from '../types';
import { ArrowLeft, Plus, Search, AlertTriangle, Boxes, Filter, Tag, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InventoryStockScreenProps {
  products: Product[];
  onNavigate: (screen: AppScreen) => void;
  onAddNewProduct: (product: Product) => void;
}

export const InventoryStockScreen: React.FC<InventoryStockScreenProps> = ({
  products,
  onNavigate,
  onAddNewProduct,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Grains & Flours');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdMrp, setNewProdMrp] = useState('');
  const [newProdCost, setNewProdCost] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);

    if (!matchesSearch) return false;
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    return true;
  });

  const lowStockCount = products.filter((p) => p.stockQty <= p.minStockAlert).length;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      nameHindi: newProdName,
      category: newProdCategory,
      barcode: newProdBarcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      purchasePrice: Number(newProdCost) || Number(newProdPrice) * 0.85,
      sellingPrice: Number(newProdPrice),
      mrp: Number(newProdMrp) || Number(newProdPrice) * 1.1,
      stockQty: Number(newProdStock) || 10,
      godownStock: 20,
      unit: 'packet',
      minStockAlert: 5,
      expiryDate: '2027-12-31',
      hsnCode: '2106',
      gstRate: 5,
      isOnlineAvailable: true,
    };

    onAddNewProduct(newProduct);
    setShowAddModal(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdMrp('');
    setNewProdCost('');
    setNewProdStock('');
  };

  return (
    <div className="min-h-full bg-surface text-on-surface flex flex-col justify-between p-4 sm:p-6 select-none pb-24">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home_dashboard')}
              className="p-1.5 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-on-surface">{t('inventory_stock', 'स्मार्ट इन्वेंटरी & स्टॉक')}</h1>
              <p className="text-xs text-on-surface-variant">{t('low_stock_alert', 'स्टॉक काउंट और रीऑर्डर')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('inventory_expiry')}
              className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('expiry_alerts', 'एक्सपायरी अलर्ट्स')}</span>
            </button>
          </div>
        </div>

        {/* Low Stock Warning Banner if any */}
        {lowStockCount > 0 && (
          <div className="my-3 bg-amber-500/15 border border-amber-500/40 p-3 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-amber-300 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <b>{lowStockCount}</b> {t('low_stock_alert', 'सामान का स्टॉक कम है')}
              </span>
            </div>
            <button
              onClick={() => onNavigate('supplier_khata')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg shrink-0 cursor-pointer"
            >
              {t('supplier_khata', 'सप्लायर ऑर्डर')}
            </button>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="my-3 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_product', 'प्रोडक्ट खोजें...')}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-emerald-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 cursor-pointer transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
              }`}
            >
              {t('all', 'सभी')} ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-bold shrink-0 cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Inventory Cards */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-2xl divide-y divide-outline-variant/20/80 overflow-hidden">
          {filtered.map((prod) => {
            const isLow = prod.stockQty <= prod.minStockAlert;
            return (
              <div key={prod.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-center overflow-hidden shrink-0">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                    ) : (
                      <Boxes className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-on-surface text-sm flex items-center gap-2">
                      <span>{prod.name}</span>
                      {isLow && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-black border border-amber-500/40">
                          {t('low_stock_badge', 'कम स्टॉक')}
                        </span>
                      )}
                    </div>
                    <div className="text-on-surface-variant text-[11px] flex items-center gap-2 mt-0.5">
                      <span>{prod.category}</span>
                      <span>• {t('scan_barcode', 'बारकोड')}: {prod.barcode}</span>
                      <span>• GST: {prod.gstRate}%</span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">
                      {t('purchase_rate', 'खरीद')}: ₹{prod.purchasePrice} • {t('selling_rate', 'बिक्री')}: <b className="text-primary">₹{prod.sellingPrice}</b> (MRP: ₹{prod.mrp})
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-sm font-black ${isLow ? 'text-amber-600' : 'text-on-surface'}`}>
                    {prod.stockQty} {prod.unit}
                  </div>
                  <div className="text-[10px] text-on-surface-variant">
                    {t('godown', 'गोदाम')}: {prod.godownStock || 0}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Add Product CTA */}
      <div className="max-w-4xl mx-auto w-full pt-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>{t('add_item', '+ नया सामान जोड़ें')}</span>
        </button>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-3xl p-5 max-w-sm w-full space-y-3.5">
            <h3 className="text-base font-extrabold text-on-surface">{t('add_item', 'नया प्रोडक्ट जोड़ें')}</h3>

            <form onSubmit={handleSaveProduct} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">{t('item_name', 'प्रोडक्ट का नाम')} *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder={t('item_name', 'उदा. हल्दीराम भुजिया 400g')}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">{t('business_category', 'कैटेगरी')}</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-surface-container-lowest text-on-surface">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant mb-1">{t('selling_rate', 'बिक्री दर')} (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="₹ 120"
                    className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={newProdMrp}
                    onChange={(e) => setNewProdMrp(e.target.value)}
                    placeholder="₹ 130"
                    className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant mb-1">{t('purchase_cost_rate', 'खरीद भाव (₹)')}</label>
                  <input
                    type="number"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    placeholder="₹ 98"
                    className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant mb-1">{t('quantity', 'स्टॉक संख्या')}</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="25"
                    className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">{t('scan_barcode', 'बारकोड')}</label>
                <input
                  type="text"
                  value={newProdBarcode}
                  onChange={(e) => setNewProdBarcode(e.target.value)}
                  placeholder="8901234567890"
                  className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-surface-container-high text-on-surface-variant py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t('cancel', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-primary text-white font-bold shadow-xs py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  {t('save', 'जोड़ें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

