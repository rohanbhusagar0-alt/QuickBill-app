import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  QrCode,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface InstallApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallApkModal: React.FC<InstallApkModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live Shared App URL
  const appUrl = 'https://ais-pre-5f7k2ti23q35picl3iqcow-431676915468.asia-southeast1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`;

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        confetti({ particleCount: 50 });
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // In browser without prompt or desktop, copy URL and guide
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-white">Download Android App / APK</h3>
                <span className="text-[10px] font-bold bg-white text-emerald-900 px-1.5 py-0.2 rounded-full">
                  v3.4.2
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                QuickBill Vyapar Android Edition 🇮🇳
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Method 1: Instant Direct Install (Recommended) */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">
                  1
                </span>
                <h4 className="font-bold text-emerald-950 text-sm">
                  Phone me Direct Install (WebAPK)
                </h4>
              </div>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                Fastest • 1-Tap
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed text-[11px]">
              Android phone ke Chrome browser me ye link open karke direct app install ho jayega. Koi file download kiye bina Play Store jesi asli app phone me lag jayegi:
            </p>

            <button
              onClick={handleInstallClick}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{deferredPrompt ? 'Install QuickBill App Now' : 'Install on This Phone / Chrome'}</span>
            </button>

            {/* Steps Guide */}
            <div className="bg-white/90 rounded-xl p-3 border border-emerald-200/80 space-y-1.5 text-[11px] text-slate-700">
              <div className="font-semibold text-emerald-900 mb-1">Android Phone me Kaise Karein:</div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Chrome browser me upar <strong>तीन बिंदु (⋮ Menu)</strong> par tap karein.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span><strong>"Install App"</strong> ya <strong>"Add to Home Screen"</strong> chunein.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Phone ke desktop aur app drawer me QuickBill app icon aa jayega!</span>
              </div>
            </div>
          </div>

          {/* Copy Direct App Link */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700">
              Direct Phone Install Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-[10px] text-slate-700 select-all"
              />
              <button
                onClick={copyLink}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Method 2: Standalone .APK File Generation via PWABuilder */}
          <div className="bg-indigo-50/70 border border-indigo-200/90 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-[11px]">
                  2
                </span>
                <h4 className="font-bold text-indigo-950 text-sm">
                  Standalone .APK Package Download
                </h4>
              </div>
              <span className="text-[10px] font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">
                Microsoft PWABuilder
              </span>
            </div>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              Agar aapko alag se <strong>.apk</strong> file download karke share karni ho, toh official Microsoft PWABuilder tool se 1-click me signed Android APK generate kar sakte hain:
            </p>

            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer block text-center"
            >
              <span>PWABuilder se APK Generate Karein</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Features badge */}
          <div className="flex items-center justify-around py-2 border-t border-slate-200 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Virus Free
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Super Fast (1.2 MB)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Auto-Sync with Cloud
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-medium">
            India Datacenter asia-south1 Connected 🇮🇳
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-slate-800 cursor-pointer text-xs"
          >
            {t('close', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
