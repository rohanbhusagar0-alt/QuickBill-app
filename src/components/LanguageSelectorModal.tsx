import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  useEffect(() => {
    setSelectedLang(language);
  }, [language, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    setLanguage(selectedLang);
    onClose();
  };

  const handleSelectOption = (code: Language) => {
    setSelectedLang(code);
  };

  return (
    <div
      className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-50 transition-opacity flex justify-center items-end"
      id="lang-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-surface rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl pb-safe animate-in slide-in-from-bottom duration-200"
        id="lang-modal-panel"
      >
        {/* Modal Header */}
        <div className="p-space-md border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">language</span>
            </div>
            <div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface" data-i18n="langModalTitle">
                {t('select_language_title', 'अपनी भाषा चुनें')}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant" data-i18n="langModalSubtitle">
                {t('supported_languages_subtitle', '12 भारतीय भाषाएं उपलब्ध हैं')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-all cursor-pointer"
            id="lang-modal-close"
            aria-label="Close language selector"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Language List (Grid of All Indian Languages) */}
        <div className="overflow-y-auto p-space-md grid grid-cols-2 gap-2.5 max-h-[60vh]">
          {supportedLanguages.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectOption(lang.code)}
                className={`lang-option text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-xs'
                    : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/60'
                }`}
                data-lang-code={lang.code}
              >
                <div className="flex flex-col min-w-0 pr-1">
                  <span className="font-title-md text-title-md font-bold text-on-surface truncate">
                    {lang.native}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {lang.subtext || lang.label}
                  </span>
                </div>
                {isSelected ? (
                  <span className="lang-check material-symbols-outlined text-primary text-[20px] flex-shrink-0">
                    check_circle
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-outline-variant/60 flex-shrink-0"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Dismiss / Apply Button */}
        <div className="px-space-md pt-1 pb-4">
          <button
            onClick={handleApply}
            className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-title-md font-semibold text-center shadow-sm hover:bg-primary-container active:scale-98 transition-all cursor-pointer"
            data-i18n="applyLanguage"
            id="lang-modal-done"
          >
            {t('apply_language', 'भाषा लागू करें')}
          </button>
        </div>
      </div>
    </div>
  );
};
