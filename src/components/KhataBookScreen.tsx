import React, { useState } from 'react';
import { AppScreen, Customer } from '../types';
import {
  ArrowLeft,
  Search,
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Phone,
  MessageCircle,
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface KhataBookScreenProps {
  customers: Customer[];
  onNavigate: (screen: AppScreen) => void;
  onSelectCustomer: (customer: Customer) => void;
  onAddNewCustomer: (customer: Customer) => void;
}

export const KhataBookScreen: React.FC<KhataBookScreenProps> = ({
  customers,
  onNavigate,
  onSelectCustomer,
  onAddNewCustomer,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'OVERDUE' | 'HIGH'>('ALL');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustUdhaar, setNewCustUdhaar] = useState('');

  const totalLenaHai = customers.reduce((sum, c) => sum + (c.totalUdhaar > 0 ? c.totalUdhaar : 0), 0);
  const totalDenaHai = 12400; // Supplier payable or customer deposit

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    if (!matchesSearch) return false;
    if (activeFilter === 'OVERDUE') return c.paymentPromiseDate && new Date(c.paymentPromiseDate) <= new Date();
    if (activeFilter === 'HIGH') return c.totalUdhaar >= 5000;
    return true;
  });

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustName,
      phone: newCustPhone || '9876543210',
      totalUdhaar: Number(newCustUdhaar) || 0,
      creditLimit: 5000,
      loyaltyPoints: 50,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      paymentPromiseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    onAddNewCustomer(newCust);
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustUdhaar('');
  };

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
              <h1 className="text-lg font-black text-on-surface">{t('khata_book', 'खाता बही')}</h1>
              <p className="text-xs text-on-surface-variant">{t('khata_sub', 'ग्राहक उधारी और AI तकादा')}</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('udhaar_ai_recovery')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{t('ai_recovery_btn', 'AI तकादा रिमाइंडर')}</span>
          </button>
        </div>

        {/* Big Balance Cards (Maine Lena Hai / Maine Dena Hai) */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-3.5 sm:p-4 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
              <span>{t('maine_lena_hai', 'मैंने लेना है (You Will Get)')}</span>
              <ArrowDownLeft className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-primary mt-1">
              ₹{totalLenaHai.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-on-surface-variant mt-0.5">{customers.length} {t('items_label', 'ग्राहक')}</div>
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          </div>

          <div
            onClick={() => onNavigate('supplier_khata')}
            className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-3.5 sm:p-4 rounded-2xl relative overflow-hidden cursor-pointer hover:border-rose-500/40"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
              <span>{t('maine_dena_hai', 'मैंने देना है (You Will Give)')}</span>
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1">
              ₹{totalDenaHai.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-on-surface-variant mt-0.5">{t('supplier_khata_arrow', 'सप्लायर खाता बही →')}</div>
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_customer', 'ग्राहक खोजें...')}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-emerald-400 outline-none"
            />
          </div>

          <div className="flex bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                activeFilter === 'ALL' ? 'bg-emerald-500 text-slate-950' : 'text-on-surface-variant'
              }`}
            >
              {t('all', 'सभी')}
            </button>
            <button
              onClick={() => setActiveFilter('OVERDUE')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                activeFilter === 'OVERDUE' ? 'bg-rose-500 text-white' : 'text-on-surface-variant'
              }`}
            >
              {t('pending_since', 'बाकी')}
            </button>
            <button
              onClick={() => setActiveFilter('HIGH')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                activeFilter === 'HIGH' ? 'bg-amber-500 text-slate-950' : 'text-on-surface-variant'
              }`}
            >
              &gt; ₹5,000
            </button>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-2xl overflow-hidden divide-y divide-outline-variant/20/80">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              {t('search_customer', 'कोई ग्राहक नहीं मिला।')}
            </div>
          ) : (
            filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => {
                  onSelectCustomer(cust);
                  onNavigate('customer_ledger');
                }}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-surface-container-low cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0">
                    {cust.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-on-surface text-sm flex items-center gap-2">
                      <span>{cust.name}</span>
                      {cust.totalUdhaar >= 10000 && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 rounded font-bold">
                          {t('high_udhaar_tag', 'अधिक उधारी')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>+91 {cust.phone}</span>
                      {cust.paymentPromiseDate && (
                        <span className="text-[11px] text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{t('pending_since', 'तारीख')}: {cust.paymentPromiseDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-black text-primary">
                      ₹{cust.totalUdhaar.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-on-surface-variant font-medium">{t('maine_lena_hai', 'लेना है')}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Add Customer CTA */}
      <div className="max-w-3xl mx-auto w-full pt-4">
        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98] cursor-pointer"
        >
          <UserPlus className="w-5 h-5 stroke-[2.5]" />
          <span>{t('add_customer', '+ नया ग्राहक खाता जोड़ें')}</span>
        </button>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-3xl p-5 max-w-sm w-full space-y-4">
            <h3 className="text-base font-extrabold text-on-surface">{t('add_customer', 'नया ग्राहक जोड़ें')}</h3>

            <form onSubmit={handleSaveCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">{t('customer_name', 'ग्राहक का नाम')} *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder={t('customer_name', 'उदा. महेश वर्मा')}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-sm text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">{t('customer_phone', 'मोबाइल नंबर')} *</label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('customer_phone', '10 अंकों का नंबर')}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-sm text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">{t('total_udhaar', 'पिछली बाकी उधारी')} (₹)</label>
                <input
                  type="number"
                  value={newCustUdhaar}
                  onChange={(e) => setNewCustUdhaar(e.target.value)}
                  placeholder="₹ 0"
                  className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-sm text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="w-1/2 bg-surface-container-high text-on-surface-variant py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t('cancel', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-primary text-white font-bold shadow-xs py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  {t('save', 'खाता खोलें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
