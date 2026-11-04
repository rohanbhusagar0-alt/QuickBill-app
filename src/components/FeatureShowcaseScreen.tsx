import React, { useState } from 'react';
import { AppScreen } from '../types';
import { Mic, MessageSquare, BookOpen, AlertTriangle, ArrowRight, ArrowLeft, Check, Volume2 } from 'lucide-react';
import { speakVoiceBillingConfirmation } from '../utils/audioSoundbox';
import { useLanguage } from '../context/LanguageContext';

interface FeatureShowcaseScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const FeatureShowcaseScreen: React.FC<FeatureShowcaseScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 'voice',
      badge: t('superpower_1', 'Superpower 1: AI Voice POS'),
      title: t('superpower_1_title', 'बोलकर पर्ची बनाएं'),
      subtitle: t('superpower_1_subtitle', 'हाथ से टाइप करने का झंझट खत्म, सिर्फ माइक दबाकर बोलें'),
      icon: <Mic className="w-8 h-8 text-primary" />,
      color: 'bg-surface-container-lowest border-primary/30',
      demoPrompt: `"${t('voice_sample_prompt_1', '2 किलो आशीर्वाद आटा, 1 फॉर्च्यून तेल और 3 पैकेट मैगी')}"`,
      demoActionLabel: t('play_audio_demo', '📢 बोलकर टेस्ट करें (Play Audio)'),
      onDemo: () => {
        speakVoiceBillingConfirmation(t('voice_sample_prompt_1', '2 किलो आशीर्वाद आटा, 1 फॉर्च्यून तेल और 3 पैकेट मैगी जोड़ो'));
      },
      bullets: [
        t('voice_bullet_1', 'हिंदी, इंग्लिश और हिंग्लिश तीनों भाषाएं समझता है'),
        t('voice_bullet_2', 'मात्रा (kg, g, pkt, ltr) खुद पहचानकर रेट लगाता है'),
        t('voice_bullet_3', 'दुकान पर भीड़ होने पर 5 गुना तेजी से बिलिंग')
      ]
    },
    {
      id: 'whatsapp',
      badge: t('superpower_2', 'Superpower 2: Digital WhatsApp Bill'),
      title: t('superpower_2_title', '1-क्लिक व्हाट्सएप बिल & UPI'),
      subtitle: t('superpower_2_subtitle', 'कागज़ की पर्ची छोड़ें, सीधे ग्राहक के फोन पर डिजिटल बिल भेजें'),
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      color: 'bg-surface-container-lowest border-primary/30',
      demoPrompt: t('demo_whatsapp_bill_prompt', 'व्हाट्सएप पर दुकान के नाम और UPI QR कोड के साथ प्रोफेशनल बिल'),
      demoActionLabel: t('preview_whatsapp_bill', '📱 डेमो बिल देखें (Preview WhatsApp Bill)'),
      onDemo: () => onNavigate('create_bill'),
      bullets: [
        t('whatsapp_bullet_1', 'कागजी रोल और थर्मल इंक के खर्च में भारी बचत'),
        t('whatsapp_bullet_2', 'बिल पर ग्राहक का नाम, आइटम लिस्ट और पेमेंट QR कोड'),
        t('whatsapp_bullet_3', 'ग्राहक कभी भी अपना पुराना बिल दोबारा देख सकता है')
      ]
    },
    {
      id: 'khata',
      badge: t('superpower_3', 'Superpower 3: Smart AI Khata'),
      title: t('superpower_3_title', 'उधारी वसूली AI रिमाइंडर'),
      subtitle: t('superpower_3_subtitle', 'उधारी नहीं डूबेगी! ऑटोमैटिक विनम्र व्हाट्सएप तकादा संदेश'),
      icon: <BookOpen className="w-8 h-8 text-amber-600" />,
      color: 'bg-surface-container-lowest border-amber-300/40',
      demoPrompt: `"${t('namaste', 'नमस्ते')} Sharma Ji, Ganesh Store: ₹4,250 ${t('udhaar_credit', 'उधार')}. ${t('pay_easy_link_line', 'कृपया भुगतान करें।')}"`,
      demoActionLabel: t('open_khata_demo', '📒 खाता बही देखें (Open Khata)'),
      onDemo: () => onNavigate('khata_book'),
      bullets: [
        t('khata_bullet_1', 'ग्राहक का नाम और पुराना बकाया 1-क्लिक में सामने'),
        t('khata_bullet_2', 'विनम्र, सामान्य और सख्त तकादा भाषा का विकल्प'),
        t('khata_bullet_3', 'संदेश में सीधे Google Pay/PhonePe पेमेंट लिंक')
      ]
    },
    {
      id: 'expiry',
      badge: t('superpower_4', 'Superpower 4: Expiry Loss Saver'),
      title: t('superpower_4_title', 'एक्सपायरी अलर्ट & सेल ऑफर'),
      subtitle: t('superpower_4_subtitle', 'सामान एक्सपायर होकर फेंकने की नौबत नहीं आएगी'),
      icon: <AlertTriangle className="w-8 h-8 text-rose-600" />,
      color: 'bg-surface-container-lowest border-rose-300/40',
      demoPrompt: t('demo_expiry_offer_prompt', 'अमुल मक्खन 7 दिन में एक्सपायर होगा → 35% छूट में व्हाट्सएप ऑफर शेयर करें'),
      demoActionLabel: t('create_sale_demo', '🏷️ डिस्काउंट सेल लगाएं (Create Clearance)'),
      onDemo: () => onNavigate('expiry_clearance_offer'),
      bullets: [
        t('expiry_bullet_1', '30 दिन पहले एक्सपायरी की चेतावनी'),
        t('expiry_bullet_2', 'तुरंत 20% से 50% छूट का आकर्षक पोस्टर बनता है'),
        t('expiry_bullet_3', 'ग्राहकों के ग्रुप पर शेयर करके तुरंत माल निकालें')
      ]
    }
  ];

  const current = slides[activeSlide];

  return (
    <div className="min-h-full bg-surface text-on-surface flex flex-col justify-between p-5 sm:p-7 select-none">
      {/* Header with Step Dots */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between pt-2 pb-4">
          <button
            onClick={() => onNavigate('welcome')}
            className="p-2 -ml-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeSlide ? 'w-6 bg-primary' : 'w-2 bg-outline-variant/40'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => onNavigate('merchant_login')}
            className="text-xs font-bold text-primary hover:underline px-2 py-1 cursor-pointer"
          >
            {t('skip', 'Skip')}
          </button>
        </div>

        {/* Slide Card Content */}
        <div className={`mt-3 p-5 sm:p-6 rounded-3xl ${current.color} border shadow-xs`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {current.badge}
            </span>
            <div className="p-2.5 rounded-2xl bg-surface border border-outline-variant/30 shadow-2xs">
              {current.icon}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface mb-2">
            {current.title}
          </h2>

          <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
            {current.subtitle}
          </p>

          {/* Interactive Demo Box */}
          <div className="bg-surface border border-outline-variant/30 p-3.5 rounded-2xl mb-4 shadow-2xs">
            <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1.5 mb-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('live_interactive_demo', 'Live Interactive Demo')}</span>
            </div>
            <p className="text-xs italic text-on-surface bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
              {current.demoPrompt}
            </p>
            <button
              onClick={current.onDemo}
              className="mt-2.5 w-full bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/30 active:scale-[0.98] transition-transform"
            >
              <span>{current.demoActionLabel}</span>
            </button>
          </div>

          {/* Bullet Points */}
          <ul className="space-y-2">
            {current.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-on-surface">
                <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-md mx-auto space-y-3 pt-6 pb-2">
        <div className="flex gap-2.5">
          {activeSlide > 0 && (
            <button
              onClick={() => setActiveSlide((prev) => prev - 1)}
              className="w-1/3 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold py-3.5 px-4 rounded-2xl text-sm border border-outline-variant/30 cursor-pointer shadow-2xs"
            >
              {t('back', 'पिछला (Back)')}
            </button>
          )}

          {activeSlide < slides.length - 1 ? (
            <button
              onClick={() => setActiveSlide((prev) => prev + 1)}
              className="flex-1 bg-primary hover:bg-primary-container text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span>{t('next_feature', 'अगला फीचर (Next)')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('merchant_login')}
              className="flex-1 bg-primary hover:bg-primary-container text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span>{t('get_started', 'शुरू करें (Get Started)')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="text-center">
          <p className="text-[11px] text-on-surface-variant">
            {t('superpower_footer', '⚡ QuickBill के साथ व्यापार को आधुनिक और डिजिटल बनाएं')}
          </p>
        </div>
      </div>
    </div>
  );
};
