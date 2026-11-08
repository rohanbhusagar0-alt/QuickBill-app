import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { ArrowLeft, CheckCircle2, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface OtpVerificationScreenProps {
  onNavigate: (screen: AppScreen) => void;
  phone: string;
  onOtpSuccess?: () => void;
}

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  onNavigate,
  phone,
  onOtpSuccess,
}) => {
  const { t } = useLanguage();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (clean.length > 1) {
      val = clean[clean.length - 1];
    } else {
      val = clean;
    }
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setError('');

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleAutoFill = () => {
    setOtp(['7', '8', '9', '0']);
    setError('');
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 4) {
      setError(t('enter_valid_otp_error', 'Please enter 4-digit OTP or tap auto-fill below'));
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      localStorage.setItem('quickbill_session', 'true');
      if (onOtpSuccess) onOtpSuccess();

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // confetti fallback
      }
      setTimeout(() => {
        onNavigate('home_dashboard');
      }, 900);
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-surface text-on-surface p-5 sm:p-7 select-none">
      {/* Header */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-3 pt-2 pb-4">
          <button
            onClick={() => onNavigate('merchant_login')}
            className="p-2 -ml-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-on-surface">{t('otp_verification_title', 'OTP Verification')}</h1>
            <p className="text-xs text-on-surface-variant">{t('otp_verification_subtitle', 'Enter 4-digit verification code')}</p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-4 rounded-3xl text-center my-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-on-surface">
            {t('code_sent_to_number', 'Code sent to number')}:
          </p>
          <div className="text-base font-bold text-primary mt-0.5">
            +91 {phone || '9876543210'}
          </div>

          <div className="mt-2.5">
            <button
              type="button"
              onClick={handleAutoFill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800 cursor-pointer transition-colors shadow-2xs"
            >
              <span>⚡ {t('autofill_sms_otp', 'Auto-fill SMS OTP (7890)')}</span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center text-xs text-rose-600 font-bold mb-2">{error}</p>
        )}

        {/* 4-digit PIN Inputs */}
        <div className="flex justify-center gap-3 my-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              className="w-14 h-16 text-center text-2xl font-bold bg-white border-2 border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl text-on-surface outline-none transition-all shadow-2xs"
            />
          ))}
        </div>

        {/* Countdown & Resend */}
        <div className="text-center text-xs text-on-surface-variant mb-6">
          {timer > 0 ? (
            <span>{t('resend_otp_in', 'Resend OTP in')}: <b className="text-primary">{timer} {t('seconds', 's')}</b></span>
          ) : (
            <button
              onClick={() => {
                setTimer(30);
                setOtp(['7', '8', '9', '0']);
              }}
              className="inline-flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('resend_otp', 'Resend OTP')}</span>
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying || isSuccess}
          className={`w-full font-extrabold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-base transition-all active:scale-[0.98] cursor-pointer ${
            isSuccess
              ? 'bg-primary text-white'
              : 'bg-primary hover:bg-primary-container text-white'
          }`}
        >
          {isVerifying ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>{t('verified_success', 'Verified Successfully!')}</span>
            </>
          ) : (
            <>
              <span>{t('verify_and_proceed', 'Verify & Proceed')}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Security badge */}
      <div className="w-full max-w-md mx-auto pt-6 text-center text-[11px] text-on-surface-variant flex items-center justify-center gap-1">
        <span>🔒 {t('ssl_encrypted_login', '256-Bit SSL Bank-Grade Encryption')}</span>
      </div>
    </div>
  );
};
