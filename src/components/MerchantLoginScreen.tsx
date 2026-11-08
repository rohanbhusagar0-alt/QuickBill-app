import React, { useState } from 'react';
import { AppScreen, MerchantProfile } from '../types';
import { ArrowLeft, Phone, ShieldCheck, Store, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { loginWithGoogle } from '../services/firebase';

interface MerchantLoginScreenProps {
  onNavigate: (screen: AppScreen) => void;
  merchant: MerchantProfile;
  onUpdateMerchant: (updated: Partial<MerchantProfile>) => void;
  onSetEnteredPhone: (phone: string) => void;
  onAuthSuccess?: () => void;
}

export const MerchantLoginScreen: React.FC<MerchantLoginScreenProps> = ({
  onNavigate,
  merchant,
  onUpdateMerchant,
  onSetEnteredPhone,
  onAuthSuccess,
}) => {
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('Kirana & FMCG Grocery');
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const categories = [
    { id: 'cat_kirana', defaultName: 'Kirana & FMCG Grocery' },
    { id: 'cat_medical', defaultName: 'Medical & Pharmacy' },
    { id: 'cat_mobile', defaultName: 'Mobile & Electronics' },
    { id: 'cat_clothing', defaultName: 'Clothing & Garments' },
    { id: 'cat_hardware', defaultName: 'Hardware & Sanitary' },
    { id: 'cat_fruits', defaultName: 'Fruits & Vegetables' },
    { id: 'cat_bakery', defaultName: 'Bakery & Dairy' },
    { id: 'cat_stationery', defaultName: 'Stationery & Gift Shop' }
  ];

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();
      if (user) {
        onUpdateMerchant({
          name: user.displayName || 'Shop Owner',
          phone: user.phoneNumber || phoneNumber || '9876543210',
          shopName: shopName || `${(user.displayName || 'My').split(' ')[0]} Kirana Store`,
          shopCategory: category,
        });
        localStorage.setItem('quickbill_session', 'true');
        if (onAuthSuccess) onAuthSuccess();
        onNavigate('home_dashboard');
      }
    } catch (err: any) {
      setError(t('google_signin_error', 'Google sign-in unavailable. Please continue with mobile OTP.'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError(t('valid_mobile_error', 'Please enter a valid 10-digit mobile number'));
      return;
    }
    setError('');
    onSetEnteredPhone(cleanPhone);
    onUpdateMerchant({
      phone: cleanPhone,
      name: ownerName || 'Dukan Malik',
      shopName: shopName || 'Mera Kirana Store',
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
                <option key={cat.id} value={cat.defaultName} className="bg-white text-on-surface">
                  {t(cat.id, cat.defaultName)}
                </option>
              ))}
            </select>
          </div>

          {/* Features note */}
          <div className="bg-surface-container-low border border-outline-variant/30 p-3 rounded-2xl text-[11px] text-on-surface-variant space-y-1">
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <span>✓ {t('no_card_needed', 'No credit card required')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span>✓ {t('free_lifetime_billing', 'Lifetime Free Basic Invoicing')}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-container text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98] cursor-pointer"
          >
            <span>{t('get_otp', 'Get Verification Code')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 border-t border-outline-variant/30"></div>
            <span className="text-[11px] font-bold text-on-surface-variant uppercase">{t('or_divider', 'OR')}</span>
            <div className="flex-1 border-t border-outline-variant/30"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold py-3 px-4 rounded-2xl shadow-2xs flex items-center justify-center gap-2.5 text-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{isGoogleLoading ? t('connecting', 'Connecting...') : t('login_with_google', 'Sign in with Google')}</span>
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
