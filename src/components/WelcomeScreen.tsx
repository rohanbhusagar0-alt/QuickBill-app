import React, { useState } from 'react';
import { AppScreen, Language } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Phone, CheckCircle2, ShoppingBag, Globe2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelectorModal } from './LanguageSelectorModal';

interface WelcomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNavigate,
  onLanguageChange,
}) => {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [showLangModal, setShowLangModal] = useState(false);

  const handleLangSelect = (code: Language) => {
    setLanguage(code);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-surface text-on-surface p-5 sm:p-7 select-none">
      {/* Top Header & Language Bar */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between pt-2 pb-3">
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>{t('made_in_india', 'Made in India 🇮🇳')}</span>
          </div>

          <button
            onClick={() => setShowLangModal(true)}
            className="flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-2xs text-on-surface"
          >
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            <span>{supportedLanguages.find((l) => l.code === language)?.native || 'हिन्दी'}</span>
            <span className="text-[10px] bg-primary/10 text-primary px-1 rounded ml-0.5 font-bold">▼</span>
          </button>
        </div>

        {/* Hero Logo & Branding */}
        <div className="text-center mt-2 sm:mt-4">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-3xl bg-primary/10 shadow-sm mb-3 border border-primary/20">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-outline-variant/20">
              <span className="text-3xl sm:text-4xl font-extrabold text-primary">⚡</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
            Quick<span className="text-primary">Bill</span>{' '}
            <span className="text-amber-600 text-2xl sm:text-3xl font-bold">{t('vyapar_label', 'व्यापार')}</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-on-surface-variant font-medium max-w-xs mx-auto leading-relaxed">
            {t('app_tagline', 'भारत का #1 स्मार्ट बिलिंग, खाता, AI बोलकर पर्ची और स्टॉक अलर्ट ऐप')}
          </p>
        </div>

        {/* Value Props Pills */}
        <div className="grid grid-cols-2 gap-2.5 my-5 sm:my-6 text-left">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-3 rounded-2xl shadow-2xs flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-on-surface">
                {t('feature_voice', 'बोलकर बिल बनाएं')}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                {t('feature_voice_sub', '5 सेकंड में AI वॉइस बिलिंग')}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 p-3 rounded-2xl shadow-2xs flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-on-surface">
                {t('feature_whatsapp', 'व्हाट्सएप पर्ची & UPI')}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                {t('feature_whatsapp_sub', 'पेमेंट QR के साथ तुरंत शेयर')}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 p-3 rounded-2xl shadow-2xs flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-on-surface">
                {t('feature_khata', 'स्मार्ट खाता रिकवरी')}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                {t('feature_khata_sub', 'ऑटो AI तकादा रिमाइंडर')}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 p-3 rounded-2xl shadow-2xs flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-on-surface">
                {t('feature_expiry', 'एक्सपायरी सेल ऑफर')}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                {t('feature_expiry_sub', 'नुकसान से 100% बचाव')}
              </div>
            </div>
          </div>
        </div>

        {/* Business Categories Supported */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 text-center mb-5 shadow-2xs">
          <p className="text-[11px] uppercase tracking-wider text-primary font-bold mb-2">
            {t('trusted_merchants', '5,00,000+ दुकानदार व व्यापारियों का भरोसा')}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span className="bg-surface-container-high px-2 py-0.5 rounded-md border border-outline-variant/20">{t('cat_kirana', '🌾 किराना & जनरल')}</span>
            <span className="bg-surface-container-high px-2 py-0.5 rounded-md border border-outline-variant/20">{t('cat_medical', '💊 मेडिकल / फार्मेसी')}</span>
            <span className="bg-surface-container-high px-2 py-0.5 rounded-md border border-outline-variant/20">{t('cat_electronics', '📱 मोबाइल / इलेक्ट्रॉनिक्स')}</span>
            <span className="bg-surface-container-high px-2 py-0.5 rounded-md border border-outline-variant/20">{t('cat_garments', '👕 कपड़ा & गारमेंट्स')}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full max-w-md mx-auto space-y-3 pb-4">
        <button
          onClick={() => onNavigate('feature_showcase')}
          className="w-full bg-primary hover:bg-primary-container text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98] cursor-pointer"
        >
          <span>{t('explore_features', 'फीचर्स देखें (Feature Showcase)')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => onNavigate('merchant_login')}
          className="w-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-on-surface font-semibold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer shadow-2xs"
        >
          <Phone className="w-4 h-4 text-primary" />
          <span>{t('login_mobile', 'सीधे मोबाइल नंबर से लॉगिन करें')}</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant pt-1">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>{t('safe_cloud', '100% सुरक्षित और ऑटोमैटिक क्लाउड बैकअप')}</span>
        </div>
      </div>

      {/* Language Selection Modal */}
      <LanguageSelectorModal isOpen={showLangModal} onClose={() => setShowLangModal(false)} />
    </div>
  );
};
