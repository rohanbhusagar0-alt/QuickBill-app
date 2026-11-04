import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';
import {
  SUPPORTED_LANGUAGES,
  LanguageOption,
  SPEECH_LOCALE_MAP,
  getTranslation,
} from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  supportedLanguages: LanguageOption[];
  speechLocale: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}> = ({ children, initialLanguage = 'hi', onLanguageChange }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('quickbill_language') as Language;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return initialLanguage;
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('quickbill_language', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  const speechLocale = SPEECH_LOCALE_MAP[language] || 'hi-IN';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        speechLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
