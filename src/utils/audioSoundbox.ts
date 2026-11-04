/**
 * Audio Soundbox synthesizer for Indian QR / Soundbox experience
 * Creates realistic sound effects and loud Hindi announcement using SpeechSynthesis
 */

// Play realistic Soundbox UPI chime before speaking
export function playSoundboxChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        resolve();
        return;
      }
      const ctx = new AudioContextClass();

      // Play double cheerful chime
      const now = ctx.currentTime;
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      playTone(523.25, now, 0.18); // C5
      playTone(659.25, now + 0.12, 0.22); // E5
      playTone(783.99, now + 0.26, 0.35); // G5
      playTone(1046.50, now + 0.42, 0.45); // C6

      setTimeout(() => {
        resolve();
      }, 550);
    } catch {
      resolve();
    }
  });
}

import { Language } from '../types';

export function numberToHindiSpoken(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded} रुपये`;
}

export function getSoundboxMessage(amount: number, merchantName: string, lang: Language = 'hi'): { text: string; locale: string } {
  const rounded = Math.round(amount);
  switch (lang) {
    case 'en':
      return {
        text: `Payment of ${rounded} rupees received on ${merchantName}!`,
        locale: 'en-IN',
      };
    case 'hinglish':
      return {
        text: `${merchantName} par ${rounded} rupees praapt hue!`,
        locale: 'hi-IN',
      };
    case 'mr':
      return {
        text: `${merchantName} वर ${rounded} रुपये प्राप्त झाले!`,
        locale: 'mr-IN',
      };
    case 'gu':
      return {
        text: `${merchantName} પર ${rounded} રૂપિયા મળ્યા!`,
        locale: 'gu-IN',
      };
    case 'ta':
      return {
        text: `${merchantName} இல் ${rounded} ரூபாய் பெறப்பட்டது!`,
        locale: 'ta-IN',
      };
    case 'bn':
      return {
        text: `${merchantName}-এ ${rounded} টাকা সফলভাবে পাওয়া গেছে!`,
        locale: 'bn-IN',
      };
    case 'te':
      return {
        text: `${merchantName} లో ${rounded} రూపాయలు విజయవంతంగా వచ్చాయి!`,
        locale: 'te-IN',
      };
    case 'kn':
      return {
        text: `${merchantName} ನಲ್ಲಿ ${rounded} ರೂಪಾಯಿ ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ!`,
        locale: 'kn-IN',
      };
    case 'ml':
      return {
        text: `${merchantName}-ൽ ${rounded} രൂപ വിജയകരമായി ലഭിച്ചു!`,
        locale: 'ml-IN',
      };
    case 'pa':
      return {
        text: `${merchantName} 'ਤੇ ${rounded} ਰੁਪਏ ਸਫ਼ਲਤਾਪੂਰਵਕ ਪ੍ਰਾਪਤ ਹੋਏ!`,
        locale: 'pa-IN',
      };
    case 'or':
      return {
        text: `${merchantName} ରେ ${rounded} ଟଙ୍କା ସଫଳତାର ସହିତ ମିଳିଲା!`,
        locale: 'or-IN',
      };
    case 'hi':
    default:
      return {
        text: `${merchantName} पर ${rounded} रुपये प्राप्त हुए!`,
        locale: 'hi-IN',
      };
  }
}

// Speak full payment confirmation in selected regional language
export async function speakSoundboxPayment(
  amount: number,
  merchantName: string = 'QuickBill',
  lang: Language = 'hi'
): Promise<void> {
  await playSoundboxChime();

  if (!('speechSynthesis' in window)) return;

  const { text, locale } = getSoundboxMessage(amount, merchantName, lang);
  const utterance = new SpeechSynthesisUtterance(text);

  // Find matching regional voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.toLowerCase().includes(locale.toLowerCase().split('-')[0]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }
  utterance.lang = locale;
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  window.speechSynthesis.speak(utterance);
}

// Voice notification for Voice Billing response
export function speakVoiceBillingConfirmation(text: string, lang: Language = 'hi'): void {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const locale = lang === 'en' ? 'en-IN' : lang === 'ta' ? 'ta-IN' : lang === 'mr' ? 'mr-IN' : lang === 'gu' ? 'gu-IN' : 'hi-IN';
  const matchedVoice = voices.find(v => v.lang.toLowerCase().includes(locale.toLowerCase().split('-')[0]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }
  utterance.lang = locale;
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

