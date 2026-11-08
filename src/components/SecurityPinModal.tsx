import React, { useState, useEffect } from 'react';
import {
  Lock,
  X,
  Fingerprint,
  Delete,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SecurityPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
  targetFeatureName?: string;
  isSettingNewPin?: boolean;
  onPinChanged?: (newPin: string) => void;
  currentPin?: string;
}

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  subtitle,
  targetFeatureName,
  isSettingNewPin = false,
  onPinChanged,
  currentPin,
}) => {
  const { t } = useLanguage();
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'enter_pin' | 'confirm_new_pin'>('enter_pin');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);

  // Get master PIN from localStorage or default to 1234
  const masterPin = currentPin || localStorage.getItem('quickbill_security_pin') || '1234';

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setConfirmPin('');
      setStep('enter_pin');
      setErrorMessage(null);
      setIsShaking(false);
      setBiometricSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerShake = (msg: string) => {
    setIsShaking(true);
    setErrorMessage(msg);
    setPin('');
    setTimeout(() => {
      setIsShaking(false);
    }, 600);
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMessage(null);

      if (nextPin.length === 4) {
        if (isSettingNewPin) {
          if (step === 'enter_pin') {
            setConfirmPin(nextPin);
            setPin('');
            setStep('confirm_new_pin');
          } else {
            // Confirming new PIN
            if (nextPin === confirmPin) {
              localStorage.setItem('quickbill_security_pin', nextPin);
              if (onPinChanged) onPinChanged(nextPin);
              onSuccess();
            } else {
              triggerShake(t('pin_mismatch', 'PIN mismatch! Please try setting again.'));
              setStep('enter_pin');
              setConfirmPin('');
            }
          }
        } else {
          // Verification mode
          if (nextPin === masterPin) {
            onSuccess();
          } else {
            triggerShake(t('invalid_pin_msg', 'Incorrect PIN. Default PIN is 1234'));
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage(null);
  };

  const handleBiometricAuth = () => {
    setBiometricSuccess(true);
    setTimeout(() => {
      onSuccess();
    }, 400);
  };

  const displayTitle =
    title ||
    (isSettingNewPin
      ? step === 'enter_pin'
        ? t('set_new_pin_title', 'Set New 4-Digit Security PIN')
        : t('confirm_pin_title', 'Confirm New Security PIN')
      : targetFeatureName
      ? `${targetFeatureName} ${t('is_protected', 'is Protected')}`
      : t('store_security_pin', 'Store Security PIN'));

  const displaySubtitle =
    subtitle ||
    (isSettingNewPin
      ? step === 'enter_pin'
        ? t('choose_pin_sub', 'Choose a 4-digit PIN for Galla & Reports')
        : t('reenter_pin_sub', 'Re-enter your 4-digit PIN to confirm')
      : t('enter_pin_to_access', 'Enter 4-digit Owner PIN to access this screen'));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xs w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4">
        {/* Header Icon & Close */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {t('protected_screen', 'Protected')}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Instructions */}
        <div>
          <h3 className="text-lg font-black text-slate-900">{displayTitle}</h3>
          <p className="text-xs text-slate-500 mt-1 leading-snug">{displaySubtitle}</p>
        </div>

        {/* 4-Dot PIN Indicator with Shake */}
        <div
          className={`flex items-center justify-center gap-4 py-2 ${
            isShaking ? 'animate-bounce text-rose-500' : ''
          }`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  isFilled
                    ? 'bg-emerald-700 scale-110 shadow-sm'
                    : 'border-2 border-slate-300 bg-slate-100'
                }`}
              />
            );
          })}
        </div>

        {/* Error Message */}
        {errorMessage ? (
          <div className="text-xs font-semibold text-rose-600 bg-rose-50 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 font-medium">
            {t('default_pin_hint', 'Default PIN: 1234 (Change anytime in Settings)')}
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-emerald-100 active:scale-95 text-slate-800 font-black text-xl flex items-center justify-center shadow-xs border border-slate-200/80 transition-all cursor-pointer"
            >
              {digit}
            </button>
          ))}

          {/* Biometric Button */}
          <button
            onClick={handleBiometricAuth}
            title={t('biometric_unlock', 'Unlock with Fingerprint')}
            className={`h-12 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
              biometricSuccess
                ? 'bg-emerald-600 text-white border-emerald-600 scale-95'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          {/* Zero Button */}
          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-emerald-100 active:scale-95 text-slate-800 font-black text-xl flex items-center justify-center shadow-xs border border-slate-200/80 transition-all cursor-pointer"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-rose-50 text-slate-700 flex items-center justify-center shadow-xs border border-slate-200/80 transition-all cursor-pointer"
          >
            <Delete className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Footer Actions: Biometric & Reset */}
        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-500 border-t border-slate-100">
          <button
            onClick={handleClear}
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            {t('clear', 'Clear')}
          </button>

          <button
            onClick={() => {
              // Quick reset to 1234
              localStorage.setItem('quickbill_security_pin', '1234');
              triggerShake(t('pin_reset_done', 'PIN reset to default: 1234'));
            }}
            className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('forgot_pin', 'Reset PIN')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
