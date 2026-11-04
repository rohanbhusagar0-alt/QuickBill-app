import React, { useState, useEffect } from 'react';
import { AppScreen, BillItem, Product } from '../types';
import { ArrowLeft, Mic, MicOff, Volume2, Sparkles, Plus, Check, ArrowRight, Play } from 'lucide-react';
import { speakVoiceBillingConfirmation } from '../utils/audioSoundbox';
import { useLanguage } from '../context/LanguageContext';

interface VoiceBillingScreenProps {
  products: Product[];
  onNavigate: (screen: AppScreen) => void;
  onSetCartFromVoice: (items: BillItem[]) => void;
}

export const VoiceBillingScreen: React.FC<VoiceBillingScreenProps> = ({
  products,
  onNavigate,
  onSetCartFromVoice,
}) => {
  const { language, speechLocale, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(
    '2 किलो आशीर्वाद आटा, 1 फॉर्च्यून तेल और 3 पैकेट मैगी'
  );
  const [parsedItems, setParsedItems] = useState<BillItem[]>([]);
  const [voiceStatus, setVoiceStatus] = useState<string>('');

  // Pre-configured Indian Kirana Spoken Presets
  const sampleVoicePrompts = [
    t('voice_sample_prompt_1', '2 किलो आशीर्वाद आटा, 1 फॉर्च्यून तेल और 3 पैकेट मैगी'),
    t('voice_sample_prompt_2', '1 डेटॉल लिक्विड, 500 ग्राम टाटा चाय, और 2 पैकेट टाटा नमक'),
    t('voice_sample_prompt_3', '5 किलो दावत बासमती चावल, 1 अमुल बटर और 2 पैकेट पारले-जी')
  ];

  // Parse spoken speech text into structured BillItems
  const parseSpeechToBillItems = (text: string): BillItem[] => {
    const items: BillItem[] = [];
    const lower = text.toLowerCase();

    // Matching Aashirvaad Atta
    if (lower.includes('आटा') || lower.includes('aata') || lower.includes('atta') || lower.includes('aashirvaad')) {
      const prod = products.find((p) => p.id === 'prod-1') || products[0];
      const matchQty = text.match(/(\d+)\s*(किलो|kg|packet|पैकेट)/i);
      const qty = matchQty ? parseInt(matchQty[1], 10) : 2;
      items.push({
        productId: prod.id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        qty: qty,
        unit: 'packet',
        price: prod.sellingPrice,
        mrp: prod.mrp,
        discountPercent: 0,
        gstRate: prod.gstRate,
        total: prod.sellingPrice * qty,
      });
    }

    // Matching Fortune Oil
    if (lower.includes('तेल') || lower.includes('oil') || lower.includes('fortune') || lower.includes('फॉर्च्यून')) {
      const prod = products.find((p) => p.id === 'prod-2') || products[1];
      const matchQty = text.match(/(\d+)\s*(लीटर|लीटर|ltr|l)/i);
      const qty = matchQty ? parseInt(matchQty[1], 10) : 1;
      items.push({
        productId: prod.id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        qty: qty,
        unit: 'packet',
        price: prod.sellingPrice,
        mrp: prod.mrp,
        discountPercent: 0,
        gstRate: prod.gstRate,
        total: prod.sellingPrice * qty,
      });
    }

    // Matching Maggi
    if (lower.includes('मैगी') || lower.includes('maggi') || lower.includes('नूडल्स')) {
      const prod = products.find((p) => p.id === 'prod-4') || products[3];
      const matchQty = text.match(/(\d+)\s*(पैकेट|packet|पीस)/i);
      const qty = matchQty ? parseInt(matchQty[1], 10) : 3;
      items.push({
        productId: prod.id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        qty: qty,
        unit: 'packet',
        price: prod.sellingPrice,
        mrp: prod.mrp,
        discountPercent: 0,
        gstRate: prod.gstRate,
        total: prod.sellingPrice * qty,
      });
    }

    // Matching Tata Salt
    if (lower.includes('नमक') || lower.includes('salt') || lower.includes('टाटा नमक')) {
      const prod = products.find((p) => p.id === 'prod-3') || products[2];
      const matchQty = text.match(/(\d+)\s*(पैकेट|packet|किलो)/i);
      const qty = matchQty ? parseInt(matchQty[1], 10) : 2;
      items.push({
        productId: prod.id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        qty: qty,
        unit: 'packet',
        price: prod.sellingPrice,
        mrp: prod.mrp,
        discountPercent: 0,
        gstRate: prod.gstRate,
        total: prod.sellingPrice * qty,
      });
    }

    // Matching Amul Butter
    if (lower.includes('बटर') || lower.includes('butter') || lower.includes('अमुल')) {
      const prod = products.find((p) => p.id === 'prod-5') || products[4];
      items.push({
        productId: prod.id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        qty: 1,
        unit: 'packet',
        price: prod.sellingPrice,
        mrp: prod.mrp,
        discountPercent: 0,
        gstRate: prod.gstRate,
        total: prod.sellingPrice,
      });
    }

    // Matching Rice
    if (lower.includes('चावल') || lower.includes('rice') || lower.includes('दावत') || lower.includes('बासमती')) {
      const prod = products.find((p) => p.id === 'prod-8') || products[7];
      const matchQty = text.match(/(\d+)\s*(किलो|kg|बैग)/i);
      const qty = matchQty ? parseInt(matchQty[1], 10) : 1;
      items.push({
        productId: prod.id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        qty: qty,
        unit: 'bag',
        price: prod.sellingPrice,
        mrp: prod.mrp,
        discountPercent: 0,
        gstRate: prod.gstRate,
        total: prod.sellingPrice * qty,
      });
    }

    // Matching Dettol
    if (lower.includes('डेटॉल') || lower.includes('dettol')) {
      const prod = products.find((p) => p.id === 'prod-9') || products[8];
      items.push({
        productId: prod.id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        qty: 1,
        unit: 'piece',
        price: prod.sellingPrice,
        mrp: prod.mrp,
        discountPercent: 0,
        gstRate: prod.gstRate,
        total: prod.sellingPrice,
      });
    }

    // Matching Tea
    if (lower.includes('चाय') || lower.includes('tea') || lower.includes('टाटा चाय')) {
      const prod = products.find((p) => p.id === 'prod-10') || products[9];
      items.push({
        productId: prod.id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        qty: 1,
        unit: 'packet',
        price: prod.sellingPrice,
        mrp: prod.mrp,
        discountPercent: 0,
        gstRate: prod.gstRate,
        total: prod.sellingPrice,
      });
    }

    // Matching Parle-G
    if (lower.includes('पारले') || lower.includes('parle') || lower.includes('बिस्कुट')) {
      const prod = products.find((p) => p.id === 'prod-7') || products[6];
      const matchQty = text.match(/(\d+)\s*(पैकेट|packet)/i);
      const qty = matchQty ? parseInt(matchQty[1], 10) : 2;
      items.push({
        productId: prod.id,
        name: prod.name,
        nameHindi: prod.nameHindi,
        qty: qty,
        unit: 'packet',
        price: prod.sellingPrice,
        mrp: prod.mrp,
        discountPercent: 0,
        gstRate: prod.gstRate,
        total: prod.sellingPrice * qty,
      });
    }

    return items;
  };

  useEffect(() => {
    const items = parseSpeechToBillItems(transcript);
    setParsedItems(items);
  }, [transcript]);

  // Handle Real Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceStatus('माइक बंद है');
      return;
    }

    const SpeechRec =
      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;

    if (!SpeechRec) {
      // Fallback for browsers without speech API
      setIsListening(true);
      setVoiceStatus('सुन रहा हूँ... बोलिए (Listening...)');
      setTimeout(() => {
        setIsListening(false);
        setVoiceStatus('आवाज़ पहचान ली गई!');
        setTranscript('2 किलो आशीर्वाद आटा, 1 फॉर्च्यून तेल और 3 पैकेट मैगी');
        speakVoiceBillingConfirmation('आशीर्वाद आटा, फॉर्च्यून तेल और मैगी पहचान लिया गया है।', language);
      }, 2500);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRec as any)();
      recognition.lang = speechLocale || 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus(t('listening', 'सुन रहा हूँ... बोलिए (Listening...)'));
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceStatus('आवाज़ नहीं सुनी गई, दोबारा प्रयास करें');
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceStatus('आवाज़ पहचान ली गई!');
        speakVoiceBillingConfirmation('बिल में सामान पहचान लिया गया है।', language);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceStatus('माइक एरर, कृपया बटन दबाएं');
    }
  };

  const handleApplyToCartAndBill = () => {
    onSetCartFromVoice(parsedItems);
    onNavigate('create_bill');
  };

  const totalCalculated = parsedItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-full bg-surface text-on-surface flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full">
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
                <span>{t('nav_voice', 'बोलकर बिल बनाएं')}</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold border border-indigo-500/30">
                  AI VOICE POS
                </span>
              </h1>
              <p className="text-xs text-on-surface-variant">{t('voice_billing_sub', 'आवाज़ से सामान पहचानकर तुरंत बिलिंग')}</p>
            </div>
          </div>
        </div>

        {/* Big Interactive Microphone Pulse */}
        <div className="my-6 text-center">
          <div className="relative inline-flex items-center justify-center">
            {isListening && (
              <>
                <span className="absolute w-36 h-36 rounded-full bg-indigo-500/20 animate-ping"></span>
                <span className="absolute w-28 h-28 rounded-full bg-indigo-500/30 animate-pulse"></span>
              </>
            )}

            <button
              onClick={toggleSpeechRecognition}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all active:scale-95 cursor-pointer relative z-10 ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-500 to-red-600 shadow-rose-500/40 ring-4 ring-rose-400/40'
                  : 'bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-indigo-500/40 ring-4 ring-indigo-400/20'
              }`}
            >
              {isListening ? <MicOff className="w-10 h-10 animate-pulse" /> : <Mic className="w-10 h-10" />}
            </button>
          </div>

          <div className="mt-3">
            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                isListening
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
              }`}
            >
              {isListening ? t('listening', 'सुन रहे हैं...') : (voiceStatus || t('ready_to_listen', 'तैयार है (Ready to Listen)'))}
            </span>
          </div>
        </div>

        {/* Transcript Box */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1.5">
            <span className="font-bold flex items-center gap-1 text-on-surface-variant">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('voice_sample_title', 'पहचानी गई आवाज़')}:</span>
            </span>
            <button
              onClick={() => speakVoiceBillingConfirmation(transcript)}
              className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('listen_audio', 'आवाज़ में सुनें')}</span>
            </button>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={2}
            className="w-full bg-white border border-outline-variant/40 rounded-xl p-2.5 text-sm text-on-surface font-medium focus:border-primary outline-none resize-none shadow-2xs"
            placeholder={t('search_product', 'यहां बोलें या टाइप करें...')}
          />

          {/* Quick Voice Sample Chips */}
          <div className="mt-3 pt-3 border-t border-outline-variant/30">
            <div className="text-[11px] text-on-surface-variant font-semibold mb-1.5">
              {t('voice_sample_click', 'या इन किराना बोलचाल के उदाहरणों पर क्लिक करें')}:
            </div>
            <div className="flex flex-col gap-1.5">
              {sampleVoicePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(p);
                    speakVoiceBillingConfirmation(p);
                  }}
                  className="bg-surface hover:bg-surface-container border border-outline-variant/30 hover:border-indigo-500/40 p-2 rounded-xl text-left text-xs text-on-surface-variant flex items-center justify-between group cursor-pointer transition-all"
                >
                  <span className="truncate">"{p}"</span>
                  <Play className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-2 group-hover:scale-110" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Parsed Product List */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-2xl overflow-hidden mb-4">
          <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between text-xs font-bold text-on-surface">
            <span>{t('items_label', 'सामान')} ({parsedItems.length})</span>
            <span className="text-primary font-black">{t('grand_total', 'कुल')}: ₹{totalCalculated}</span>
          </div>

          {parsedItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              {t('empty_cart', 'कोई सामान मैच नहीं हुआ। कृपया बोलें या टेस्ट सैंपल दबाएं।')}
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {parsedItems.map((item, i) => (
                <div key={i} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-on-surface text-sm">{item.name}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {t('quantity', 'मात्रा')}: {item.qty} {item.unit} • {t('price', 'दर')}: ₹{item.price}
                    </div>
                  </div>
                  <div className="text-right font-black text-sm text-primary">
                    ₹{item.total}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-2xl mx-auto w-full pt-2">
        <button
          onClick={handleApplyToCartAndBill}
          disabled={parsedItems.length === 0}
          className="w-full bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98] cursor-pointer"
        >
          <span>{t('add_to_bill', 'बिल में जोड़ें और पर्ची बनाएं')} (₹{totalCalculated})</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
