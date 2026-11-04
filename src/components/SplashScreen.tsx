import React, { useEffect, useState } from 'react';
import { AppScreen } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Store, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onNavigate: (screen: AppScreen) => void;
  shopName?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onNavigate,
  shopName = 'Sharma General Store',
}) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 17;
      });
    }, 250);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between items-center px-6 py-8 select-none text-on-surface">
      {/* Top Tagline */}
      <div className="w-full max-w-sm flex justify-between items-center pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>100% Bharat Made 🇮🇳</span>
        </div>
        <button
          onClick={() => onNavigate('home_dashboard')}
          className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          Skip to Store →
        </button>
      </div>

      {/* Main Brand Splash Emblem (PDF Screen 25) */}
      <div className="w-full max-w-sm flex flex-col items-center text-center my-auto">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-primary to-[#00875a] p-1 shadow-xl shadow-primary/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[22px] flex flex-col items-center justify-center p-3 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/10 rounded-full"></div>
              {/* App Icon matching Screen 25 */}
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
                <Store className="w-7 h-7 text-white" />
              </div>
              <span className="text-[11px] font-black tracking-tight text-primary mt-1.5 uppercase">
                QuickBill
              </span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md border border-outline-variant/30">
            <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI</span>
            </div>
          </div>
        </div>

        {/* App Title & Subtitle */}
        <h1 className="text-2xl font-black text-on-surface tracking-tight">
          QuickBill &amp; Khata <span className="text-primary">AI</span>
        </h1>
        <p className="text-xs font-bold text-primary mt-1">
          {shopName} • Active Business Hub
        </p>

        <p className="text-xs text-on-surface-variant mt-3 max-w-[280px] leading-relaxed">
          Smart AI Voice Billing, Digital Khata, Instant WhatsApp Invoices &amp; Vyapar Banking for Indian Retailers.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-[11px] font-semibold text-on-surface flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            AI Voice POS
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-[11px] font-semibold text-on-surface flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            Zero-Commission Khata
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-[11px] font-semibold text-on-surface flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            Instant Bank Payouts
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
            <span>Syncing store ledger...</span>
            <span className="font-bold text-primary">{Math.min(100, progress)}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Button & Footer */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3">
        <button
          onClick={() => onNavigate('home_dashboard')}
          className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-[#005a3c] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/25 transition-all cursor-pointer"
        >
          <span>Open Store Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 100% Bank Grade Safe
          </span>
          <span>•</span>
          <span>v4.2.0 Pro AI</span>
        </div>
      </div>
    </div>
  );
};
