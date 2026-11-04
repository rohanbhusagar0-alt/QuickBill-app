import React, { useState } from 'react';
import { AppScreen } from '../types';
import {
  Check,
  CheckCircle2,
  HelpCircle,
  Lock,
  Sparkles,
  Mic,
  Smartphone,
  Ban,
  FileSpreadsheet,
  Store,
  Star,
  Award,
  Bell,
  CheckCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface ProSubscriptionScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const ProSubscriptionScreen: React.FC<ProSubscriptionScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [isTrialActive, setIsTrialActive] = useState(false);

  const handleStartTrial = () => {
    setIsTrialActive(true);
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#047857', '#10b981', '#34d399', '#6ee7b7', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-36">
      {/* Top Header - White & Green Store Branding */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 py-2.5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {/* Store branding */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              alt="QuickBill App Icon"
              className="w-8 h-8 object-contain shrink-0 rounded-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbgVuLmjKSwvXfdz5PRiz9Mog0fvtVbEaf8jSQ9e2hesrcrn6ikd5qB8QjnBkojXW8pQbgrAhJ8EtYY0mgJA9EQN4jIi-Leg6PZHVir-7fxQ5oO31JJLGjs1AeEjPYjzllSCAvAvFUQU_HERdtvcQSo1PG6yLvKV-03dTFmbohH6iJ9eMYnLyAGU-r3VIpcC4RpD5UBo5z5F8pBI3ZqU321BiNtv28iYj8qA_Uag3NuQ9Qb6lHqNQu"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-900 text-sm truncate">
                  Sharma General Store
                </span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 fill-emerald-100" />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>QuickBill &amp; Khata AI</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold tracking-wide">PRO AI</span>
              </div>
            </div>
          </div>

          {/* Right Actions: Notifications & Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('smart_soundbox')}
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            <div
              onClick={() => onNavigate('store_profile')}
              className="cursor-pointer"
              title="Store Profile & Settings"
            >
              <img
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgXDHZjALdnObN7V9teuDlyh6xzhDFACJx-T_uAtGcKb6ERAOlGbZfaxW22yEyoNbWck5L5Sk2TuhPcCSfrpl0LU9S7cnPvaF1hmlOHlUcdUrbgOJjOL4CakHy8jOFgfj0TINPI2kGFGz1qbx31wVXpLSh6O169PuKGYk3PQYIuQxkV33ftZsDLoXgJE04Gp3oWtlm26cgHCxma8HFvththdStG6shtXRC14hnoZSWkqKnrCwnhkzq"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-lg mx-auto w-full px-4 pt-4 flex flex-col gap-4">
        {/* Green Gradient Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#065f46] text-white p-5 shadow-sm">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-100 text-[11px] font-bold tracking-wide">
            <Sparkles className="w-3 h-3 text-emerald-200" />
            <span>TRY 7 DAYS FREE</span>
          </div>

          {/* Star Medal Graphic on the Right */}
          <div className="absolute right-3 top-3 pointer-events-none opacity-40">
            <Award className="w-24 h-24 text-emerald-200 stroke-[1.2]" />
          </div>

          {/* Heading */}
          <h1 className="text-xl font-black text-white mt-3.5 tracking-tight leading-snug">
            Pro AI &amp; Gold VIP Plan
          </h1>
          <p className="text-emerald-100/90 text-xs font-medium mt-1">
            Unlimited Automation &amp; Premium Business Features
          </p>

          {/* Badges Row */}
          <div className="flex items-center gap-2 mt-4 text-[11px] text-emerald-100 font-semibold">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Instant Activation</span>
            </span>
            <span className="text-emerald-300/60">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Cancel Anytime</span>
            </span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="flex flex-col gap-3 mt-1">
          {/* Card 1: Annual VIP Gold (Recommended) */}
          <div
            onClick={() => setSelectedPlan('annual')}
            className={`relative rounded-2xl transition-all cursor-pointer bg-white p-4 ${
              selectedPlan === 'annual'
                ? 'border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                : 'border border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            {/* Top Right Floating Badge */}
            <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-white" />
              <span>RECOMMENDED</span>
            </div>

            {/* Header */}
            <div className="flex items-start gap-3">
              {/* Radio / Check circle */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  selectedPlan === 'annual'
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {selectedPlan === 'annual' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Title & Badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Annual VIP Gold</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    50% Savings
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  7-Day Free Trial included • Cancel anytime
                </p>
              </div>
            </div>

            {/* Price Box */}
            <div className="mt-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-800">₹1,188</span>
                <span className="text-slate-500 text-xs font-medium">/year</span>
              </div>
              <div className="bg-white border border-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-lg shadow-2xs">
                Just ₹99 / mo
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="mt-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited AI Voice Billing &amp; Fast POS</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited Cloud Backup &amp; Live Multi-Device Sync</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Ban className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Zero Advertisements Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Accountant-Ready GSTR-1 &amp; GSTR-3B Excel Reports</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom Store Logo &amp; Tagline on All Invoices</span>
              </div>
            </div>
          </div>

          {/* Card 2: Monthly Flex */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`rounded-2xl transition-all cursor-pointer bg-white p-4 ${
              selectedPlan === 'monthly'
                ? 'border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                : 'border border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Radio circle */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {selectedPlan === 'monthly' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Title & Badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Monthly Flex</h3>
                  <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    Standard
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Pay-as-you-go flexibility, cancel whenever
                </p>

                {/* Price */}
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-900">₹199</span>
                    <span className="text-slate-500 text-xs font-medium">/month</span>
                  </div>
                  <span className="text-slate-500 text-xs font-medium">Billed monthly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-indigo-50/40 border border-indigo-100/60 rounded-2xl p-3 flex items-center gap-3">
          {/* Overlapping Avatars */}
          <div className="flex -space-x-2 shrink-0">
            <img
              alt="Shopkeeper 1"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=80&q=80"
            />
            <img
              alt="Shopkeeper 2"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80"
            />
            <img
              alt="Shopkeeper 3"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
            />
          </div>

          {/* Rating Text */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <div className="flex text-emerald-600 text-xs">
                {'★'.repeat(5)}
              </div>
              <span className="font-bold text-slate-900 text-xs">4.9 / 5</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-tight truncate">
              Trusted by 140,000+ modern shopkeepers across India
            </p>
          </div>
        </div>

        {/* Feature Matrix Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Feature Matrix</h3>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
              FREE VS GOLD
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {/* Column Headers */}
            <div className="grid grid-cols-12 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-6">KEY CAPABILITIES</div>
              <div className="col-span-3 text-center">FREE</div>
              <div className="col-span-3 text-center text-emerald-700">GOLD VIP</div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-12 py-3 items-center">
              <div className="col-span-6 pr-2">
                <div className="font-semibold text-slate-900">AI Voice Billing</div>
                <div className="text-[11px] text-slate-500">Speak to generate slips</div>
              </div>
              <div className="col-span-3 text-center text-slate-600">5 / Day</div>
              <div className="col-span-3 flex justify-center">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Unlimited
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-12 py-3 items-center">
              <div className="col-span-6 pr-2">
                <div className="font-semibold text-slate-900">Ad-Free Experience</div>
                <div className="text-[11px] text-slate-500">Zero distraction counter</div>
              </div>
              <div className="col-span-3 text-center text-slate-400 font-bold">—</div>
              <div className="col-span-3 flex justify-center">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-12 py-3 items-center">
              <div className="col-span-6 pr-2">
                <div className="font-semibold text-slate-900">Cloud Backup &amp; Sync</div>
                <div className="text-[11px] text-slate-500">Automatic ledger secure sync</div>
              </div>
              <div className="col-span-3 text-center text-slate-600">Manual</div>
              <div className="col-span-3 flex justify-center">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-12 py-3 items-center">
              <div className="col-span-6 pr-2">
                <div className="font-semibold text-slate-900">Multi-Device Access</div>
                <div className="text-[11px] text-slate-500">Phone, tablet, laptop login</div>
              </div>
              <div className="col-span-3 text-center text-slate-600">1 Phone</div>
              <div className="col-span-3 text-center text-emerald-700 font-bold">Up to 5</div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-12 py-3 items-center">
              <div className="col-span-6 pr-2">
                <div className="font-semibold text-slate-900">Branded Receipts</div>
                <div className="text-[11px] text-slate-500">Store logo &amp; barcode</div>
              </div>
              <div className="col-span-3 text-center text-slate-400 font-bold">—</div>
              <div className="col-span-3 flex justify-center">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-12 py-3 items-center">
              <div className="col-span-6 pr-2">
                <div className="font-semibold text-slate-900">GSTR Tax Reports</div>
                <div className="text-[11px] text-slate-500">Export instant audit spreadsheets</div>
              </div>
              <div className="col-span-3 text-center text-slate-400 font-bold">—</div>
              <div className="col-span-3 flex justify-center">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="bg-indigo-50/40 border border-indigo-100/70 rounded-2xl p-3.5">
            <h4 className="font-bold text-slate-900 text-xs">How does the 7-day free trial work?</h4>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              You get immediate access to all Gold VIP tools. You will not be charged if you cancel before the 7th day via Google Play subscriptions.
            </p>
          </div>

          <div className="bg-indigo-50/40 border border-indigo-100/70 rounded-2xl p-3.5">
            <h4 className="font-bold text-slate-900 text-xs">Will my existing shop data be preserved?</h4>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              Yes, completely. All customer balances, ledger records, and past receipts stay intact and immediately sync to encrypted cloud storage.
            </p>
          </div>
        </div>

        {/* Success Banner if trial started */}
        {isTrialActive && (
          <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-center text-xs text-emerald-900 font-bold shadow-xs">
            🎉 Gold VIP Plan is Active! Your 7-day free trial has started.
          </div>
        )}
      </main>

      {/* Sticky Bottom Action Button */}
      <div className="fixed bottom-16 left-0 right-0 z-20 px-4 py-2 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleStartTrial}
            className="w-full bg-[#065f46] hover:bg-[#047857] active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{isTrialActive ? 'Trial Active (VIP Unlocked)' : 'Start 7-Day Free Trial'}</span>
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-1.5">
            <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
            <span>Cancel anytime in Google Play Store • Billed after 7-day trial</span>
          </div>
        </div>
      </div>
    </div>
  );
};
