import React, { useState } from 'react';
import { AppScreen, Product } from '../types';
import { ArrowLeft, AlertTriangle, Clock, Sparkles, ShoppingBag, ArrowRight, Share2, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InventoryExpiryScreenProps {
  products: Product[];
  onNavigate: (screen: AppScreen) => void;
  onSelectProductForOffer?: (product: Product) => void;
}

export const InventoryExpiryScreen: React.FC<InventoryExpiryScreenProps> = ({
  products,
  onNavigate,
  onSelectProductForOffer,
}) => {
  const { t } = useLanguage();
  const [filterPeriod, setFilterPeriod] = useState<'ALL_EXPIRING' | '15_DAYS' | '30_DAYS'>('ALL_EXPIRING');

  const now = new Date();

  const getDaysLeft = (expiryDateStr: string) => {
    const exp = new Date(expiryDateStr);
    const diffTime = exp.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const expiringList = products
    .map((p) => ({
      ...p,
      daysLeft: getDaysLeft(p.expiryDate),
    }))
    .filter((p) => {
      if (filterPeriod === '15_DAYS') return p.daysLeft <= 15;
      if (filterPeriod === '30_DAYS') return p.daysLeft <= 30;
      return p.daysLeft <= 45; // All expiring soon
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const potentialLoss = expiringList.reduce((sum, item) => sum + item.purchasePrice * item.stockQty, 0);

  return (
    <div className="min-h-full bg-surface text-on-surface flex flex-col justify-between p-4 sm:p-6 select-none pb-24">
      {/* Header */}
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home_dashboard')}
              className="p-1.5 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-on-surface flex items-center gap-2">
                <span>{t('expiry_tracker', 'स्मार्ट एक्सपायरी अलर्ट्स')}</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-black">
                  {t('zero_loss_tag', 'शून्य नुकसान')}
                </span>
              </h1>
              <p className="text-xs text-on-surface-variant">{t('feature_inventory_sub', 'खराब होने से पहले सामान पर डिस्काउंट ऑफर लगाएं')}</p>
            </div>
          </div>
        </div>

        {/* Potential Loss Alert Header Card */}
        <div className="my-4 bg-gradient-to-r from-rose-950/60 to-red-900/40 border border-rose-500/40 p-4 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-300">
                {t('potential_loss_risk', 'संभावित एक्सपायरी नुकसान')}
              </div>
              <div className="text-2xl font-black text-on-surface mt-0.5">
                ₹{potentialLoss.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                {expiringList.length} {t('expiring_products_count', 'प्रोडक्ट्स जल्द एक्सपायर हो रहे हैं')}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('expiry_clearance_offer')}
            className="bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('apply_flash_sale', 'फ्लैश सेल लगाएं')}</span>
          </button>
        </div>

        {/* Period Filter Tabs */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setFilterPeriod('ALL_EXPIRING')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterPeriod === 'ALL_EXPIRING'
                ? 'bg-rose-500 text-white'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
            }`}
          >
            {t('all_expiring', 'सभी एक्सपायरी')} ({expiringList.length})
          </button>
          <button
            onClick={() => setFilterPeriod('15_DAYS')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterPeriod === '15_DAYS'
                ? 'bg-rose-600 text-white'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
            }`}
          >
            ⚠️ {t('in_15_days', '15 दिन में')}
          </button>
          <button
            onClick={() => setFilterPeriod('30_DAYS')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterPeriod === '30_DAYS'
                ? 'bg-rose-700 text-white'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
            }`}
          >
            ⏳ {t('in_30_days', '30 दिन में')}
          </button>
        </div>

        {/* Expiring Product Cards */}
        <div className="space-y-2.5">
          {expiringList.map((prod) => {
            const isCritical = prod.daysLeft <= 10;
            return (
              <div
                key={prod.id}
                className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs hover:border-rose-500/40 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-center overflow-hidden shrink-0">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                    ) : (
                      <Clock className="w-6 h-6 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-on-surface text-sm">{prod.name}</div>
                    <div className="text-[11px] text-on-surface-variant flex items-center gap-2 mt-0.5">
                      <span>{t('stock', 'स्टॉक')}: <b className="text-on-surface">{prod.stockQty} {prod.unit}</b></span>
                      <span>• {t('purchase_rate', 'खरीद')}: ₹{prod.purchasePrice}</span>
                      <span>• MRP: ₹{prod.mrp}</span>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {prod.daysLeft <= 0 ? t('expired', 'एक्सपायर हो चुका') : `${prod.daysLeft} ${t('days_left', 'दिन शेष')}`}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {t('date', 'तारीख')}: {prod.expiryDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1.5">
                  <div className="text-xs font-bold text-rose-400">
                    {t('risk', 'जोखिम')}: ₹{prod.purchasePrice * prod.stockQty}
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectProductForOffer) onSelectProductForOffer(prod);
                      onNavigate('expiry_clearance_offer');
                    }}
                    className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{t('sale_offer', 'सेल ऑफर')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="max-w-3xl mx-auto w-full pt-4">
        <button
          onClick={() => onNavigate('expiry_clearance_offer')}
          className="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          <span>{t('broadcast_clearance_whatsapp', 'व्हाट्सएप पर क्लीयरेंस सेल ब्रॉडकास्ट करें')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
