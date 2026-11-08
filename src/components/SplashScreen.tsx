import React, { useEffect, useState } from 'react';
import { AppScreen } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Store, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onNavigate: (screen: AppScreen) => void;
  shopName?: string;
  isLoggedIn?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onNavigate,
  shopName,
  isLoggedIn = false,
}) => {
  const [progress, setProgress] = useState(15);

  const handleProceed = () => {
    if (isLoggedIn) {
      onNavigate('home_dashboard');
    } else {
      onNavigate('merchant_login');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            handleProceed();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between items-center px-6 py-8 select-none text-on-surface">
      {/* Top Tagline */}
      <div className="w-full max-w-sm flex justify-between items-center pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>Made in India 🇮🇳</span>
        </div>
        <button
          onClick={handleProceed}
          className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          {isLoggedIn ? 'Dashboard →' : 'Login / Sign Up →'}
        </button>
      </div>

      {/* Main Brand Splash Emblem */}
      <div className="w-full max-w-sm flex flex-col items-center text-center my-auto">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-800 to-slate-900 p-1 shadow-xl shadow-emerald-950/20 flex items-center justify-center">
            <div className="w-full h-full bg-emerald-700 rounded-[22px] flex flex-col items-center justify-center p-3 relative overflow-hidden">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-md">
                <Store className="w-7 h-7 text-white" />
              </div>
              <span className="text-[10px] font-black tracking-wider text-white mt-1.5 uppercase">
                QuickBill
              </span>
            </div>
          </div>
        </div>

        {/* App Title & Subtitle */}
        <h1 className="text-2xl font-black text-on-surface tracking-tight">
          QuickBill &amp; Khata <span className="text-primary">Vyapar</span>
        </h1>
        <p className="text-xs font-bold text-primary mt-1">
          {shopName || 'Retail & Kirana POS Accounting'}
        </p>

        <p className="text-xs text-on-surface-variant mt-3 max-w-[280px] leading-relaxed">
          Smart Voice Billing, Digital Khata, Instant WhatsApp Invoices &amp; Real-time UPI Payouts for Indian Retailers.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-[11px] font-semibold text-on-surface flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            Fast POS Billing
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-[11px] font-semibold text-on-surface flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            Digital Udhaar Khata
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-[11px] font-semibold text-on-surface flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            Thermal 58mm Print
          </span>
        </div>

        {/* Loading Bar */}
        <div className="w-full max-w-[240px] mt-8">
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-on-surface-variant mt-2 font-medium">
            <span>Starting app engine...</span>
            <span className="font-bold text-primary">{Math.min(100, progress)}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Button & Footer */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3">
        <button
          onClick={handleProceed}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/25 transition-all cursor-pointer"
        >
          <span>{isLoggedIn ? 'Open Store Dashboard' : 'शुरू करें (Get Started)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 100% Encrypted &amp; Cloud Synced
          </span>
          <span>•</span>
          <span>v4.2.0</span>
        </div>
      </div>
    </div>
  );
};
