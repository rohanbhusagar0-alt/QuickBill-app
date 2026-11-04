import React, { useState } from 'react';
import { AppScreen, MerchantProfile } from '../types';
import { ArrowLeft, Phone, ShieldCheck, Store, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MerchantLoginScreenProps {
  onNavigate: (screen: AppScreen) => void;
  merchant: MerchantProfile;
  onUpdateMerchant: (updated: Partial<MerchantProfile>) => void;
  onSetEnteredPhone: (phone: string) => void;
}

export const MerchantLoginScreen: React.FC<MerchantLoginScreenProps> = ({
  onNavigate,
  merchant,
  onUpdateMerchant,
  onSetEnteredPhone,
}) => {
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState(merchant.phone || '9876543210');
  const [shopName, setShopName] = useState(merchant.shopName || 'Shree Ganesh Kirana & General Store');
  const [category, setCategory] = useState(merchant.shopCategory || 'Kirana & FMCG Grocery');
  const [error, setError] = useState('');

  const categories = [
    'Kirana & FMCG Grocery',
    'Medical & Pharmacy',
    'Mobile & Electronics',
    'Clothing & Garments',
    'Hardware & Sanitary',
    'Fruits & Vegetables',
    'Bakery & Dairy',
    'Stationery & Gift Shop'
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length !== 10) {
      setError(t('valid_mobile_error', 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें'));
      return;
    }
    setError('');
    onSetEnteredPhone(phoneNumber);
    onUpdateMerchant({
      phone: phoneNumber,
      shopName: shopName || 'My Vyapar Store',
      shopCategory: category
    });
    onNavigate('otp_verification');
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-surface text-on-surface p-5 sm:p-7 select-none">
      {/* Header */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-3 pt-2 pb-4">
          <button
            onClick={() => onNavigate('welcome')}
            className="p-2 -ml-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-on-surface">{t('merchant_login_title', 'व्यापारी लॉगिन')}</h1>
            <p className="text-xs text-on-surface-variant">{t('merchant_login_subtitle', 'QuickBill स्मार्ट व्यापार में आपका स्वागत है')}</p>
          </div>
        </div>

        {/* Shopkeeper Profile Card Visual */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-3xl shadow-2xs flex items-center gap-3.5 my-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shadow-2xs shrink-0">
            🏪
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('verified_merchant_portal', 'Verified Merchant Portal')}</span>
            </div>
            <div className="text-sm font-bold text-on-surface mt-0.5">{t('merchant_account_notice', 'नया खाता बनाएं या पुराना खोलें')}</div>
            <div className="text-[11px] text-on-surface-variant">{t('otp_secure_login', 'OTP द्वारा सुरक्षित एक-क्लिक लॉगिन')}</div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSendOtp} className="space-y-4">
          {/* Mobile Number Input */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
              {t('mobile_number', 'मोबाइल नंबर')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1 text-sm font-bold text-primary select-none">
                <span>🇮🇳 +91</span>
              </div>
              <input
                type="tel"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder={t('ten_digit_placeholder', '10 अंकों का नंबर')}
                className="w-full bg-white border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl py-3.5 pl-20 pr-4 text-base font-semibold text-on-surface placeholder:text-outline outline-none transition-all shadow-2xs"
              />
            </div>
            {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
          </div>

          {/* Shop Name */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
              {t('shop_name_label', 'दुकान या व्यापार का नाम')}
            </label>
            <div className="relative flex items-center">
              <Store className="w-4 h-4 text-on-surface-variant absolute left-3.5" />
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={t('shop_name_placeholder', 'उदा. श्री गणेश किराना स्टोर')}
                className="w-full bg-white border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-on-surface placeholder:text-outline outline-none transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
              {t('business_category', 'दुकान की श्रेणी')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl py-3 px-4 text-sm font-medium text-on-surface outline-none cursor-pointer shadow-2xs"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-on-surface">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Features note */}
          <div className="bg-surface-container-low border border-outline-variant/30 p-3 rounded-2xl text-[11px] text-on-surface-variant space-y-1">
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <span>✓ {t('no_card_needed', 'कोई कागजात या क्रेडिट कार्ड की जरूरत नहीं')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span>✓ {t('free_lifetime_billing', 'जीवन भर फ्री बेसिक बिलिंग & खाता बही')}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-container text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98] cursor-pointer"
          >
            <span>{t('get_otp', 'OTP भेजें')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md mx-auto pt-6 text-center text-xs text-on-surface-variant">
        {t('terms_accept_notice', 'लॉगिन करके आप QuickBill के नियम और गोपनीयता नीति स्वीकार करते हैं।')}
      </div>
    </div>
  );
};
