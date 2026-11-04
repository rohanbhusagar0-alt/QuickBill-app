import React, { useState } from 'react';
import { AppScreen, Bill } from '../types';
import { ArrowLeft, Download, FileSpreadsheet, TrendingUp, DollarSign, PieChart, Percent, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ReportsGstScreenProps {
  bills: Bill[];
  onNavigate: (screen: AppScreen) => void;
}

export const ReportsGstScreen: React.FC<ReportsGstScreenProps> = ({
  bills,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const [reportPeriod, setReportPeriod] = useState<'TODAY' | 'THIS_MONTH' | 'QUARTER'>('THIS_MONTH');
  const [activeReportTab, setActiveReportTab] = useState<'GST' | 'PROFIT_LOSS' | 'PAYMENT_MODES'>('GST');

  // Calculations
  const totalSales = bills.reduce((sum, b) => sum + b.grandTotal, 0);
  const totalGstCollected = bills.reduce((sum, b) => sum + b.totalGst, 0);
  const totalProfit = Math.round(totalSales * 0.165); // 16.5% average Kirana gross margin
  const cashSales = bills.filter((b) => b.paymentMode === 'CASH').reduce((sum, b) => sum + b.grandTotal, 0);
  const upiSales = bills.filter((b) => b.paymentMode === 'UPI').reduce((sum, b) => sum + b.grandTotal, 0);
  const udhaarSales = bills.filter((b) => b.paymentMode === 'UDHAAR').reduce((sum, b) => sum + b.grandTotal, 0);

  const handleExportExcel = () => {
    alert(t('exporting_excel_alert', 'GSTR-1 और सेल्स रिपोर्ट एक्सेल (.xlsx) डाउनलोड हो रही है...'));
  };

  return (
    <div className="min-h-full bg-surface text-on-surface flex flex-col justify-between p-4 sm:p-6 select-none pb-24">
      {/* Header */}
      <div className="max-w-3xl mx-auto w-full">
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
                <span>{t('reports_gst_title', 'रिपोर्ट्स & GST टैक्स फाइलिंग')}</span>
                <span className="text-[10px] bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded font-bold">
                  GSTR-1 & 3B READY
                </span>
              </h1>
              <p className="text-xs text-on-surface-variant">{t('reports_gst_subtitle', '1-क्लिक में CA के लिए सेल्स और टैक्स रिपोर्ट')}</p>
            </div>
          </div>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/30 text-primary px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('export_excel', 'एक्सेल एक्सपोर्ट')}</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-3.5 rounded-2xl">
            <div className="text-[11px] text-on-surface-variant font-medium">{t('total_sales', 'कुल बिक्री')}</div>
            <div className="text-base sm:text-xl font-black text-on-surface mt-1">
              ₹{totalSales.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-primary font-bold mt-0.5">↑ 12.4% vs last month</div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-3.5 rounded-2xl">
            <div className="text-[11px] text-on-surface-variant font-medium">{t('estimated_profit', 'अनुमानित मुनाफा')}</div>
            <div className="text-base sm:text-xl font-black text-primary mt-1">
              ₹{totalProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-on-surface-variant mt-0.5">~16.5% {t('margin', 'मार्जिन')}</div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-3.5 rounded-2xl">
            <div className="text-[11px] text-on-surface-variant font-medium">{t('gst_collected_title', 'GST संकलन')}</div>
            <div className="text-base sm:text-xl font-black text-blue-400 mt-1">
              ₹{totalGstCollected.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-on-surface-variant mt-0.5">{t('gstr1_ready', 'GSTR-1 तैयार')}</div>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex bg-surface-container-lowest border border-outline-variant/30 shadow-2xs p-1 rounded-xl text-xs mb-4">
          <button
            onClick={() => setActiveReportTab('GST')}
            className={`flex-1 py-2 rounded-lg font-bold cursor-pointer transition-all ${
              activeReportTab === 'GST' ? 'bg-emerald-500 text-slate-950' : 'text-on-surface-variant'
            }`}
          >
            {t('gst_slab_report', 'GST स्लैब रिपोर्ट')}
          </button>
          <button
            onClick={() => setActiveReportTab('PAYMENT_MODES')}
            className={`flex-1 py-2 rounded-lg font-bold cursor-pointer transition-all ${
              activeReportTab === 'PAYMENT_MODES' ? 'bg-emerald-500 text-slate-950' : 'text-on-surface-variant'
            }`}
          >
            {t('payment_modes', 'भुगतान माध्यम')}
          </button>
        </div>

        {activeReportTab === 'GST' ? (
          /* GST Slab Wise Breakdown */
          <div className="space-y-3">
            <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant mb-3">
                <span>{t('gstr1_slab_summary', 'GSTR-1 स्लैबवार विवरण')}</span>
                <span className="text-on-surface-variant font-normal">{t('month_sept_2026', 'महीना: सितम्बर 2026')}</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* 0% Exempt */}
                <div className="bg-surface p-3 rounded-xl border border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-on-surface">{t('gst_0_exempt', '0% छूट प्राप्त सामान (Exempted Foodgrains)')}</span>
                    <div className="text-[10px] text-on-surface-variant">{t('gst_0_desc', 'खुला आटा, दाल, चावल, ताजे फल')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-on-surface">₹14,500</div>
                    <div className="text-[10px] text-slate-500">Tax: ₹0</div>
                  </div>
                </div>

                {/* 5% GST */}
                <div className="bg-surface p-3 rounded-xl border border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-primary">{t('gst_5_bracket', '5% GST (ब्रैंडेड खाद्यान्न, तेल, चीनी)')}</span>
                    <div className="text-[10px] text-on-surface-variant">CGST (2.5%) + SGST (2.5%)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-on-surface">₹28,600</div>
                    <div className="text-[10px] text-primary font-bold">Tax: ₹1,430</div>
                  </div>
                </div>

                {/* 12% GST */}
                <div className="bg-surface p-3 rounded-xl border border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-blue-400">{t('gst_12_bracket', '12% GST (मक्खन, घी, पैकेज्ड फूड)')}</span>
                    <div className="text-[10px] text-on-surface-variant">CGST (6%) + SGST (6%)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-on-surface">₹9,400</div>
                    <div className="text-[10px] text-blue-400 font-bold">Tax: ₹1,128</div>
                  </div>
                </div>

                {/* 18% GST */}
                <div className="bg-surface p-3 rounded-xl border border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-purple-400">{t('gst_18_bracket', '18% GST (साबुन, शैम्पू, टूथपेस्ट, डिटर्जेंट)')}</span>
                    <div className="text-[10px] text-on-surface-variant">CGST (9%) + SGST (9%)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-on-surface">₹16,200</div>
                    <div className="text-[10px] text-purple-400 font-bold">Tax: ₹2,916</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Modes Breakdown */
          <div className="bg-surface-container-lowest border border-outline-variant/30 shadow-2xs rounded-2xl p-4 space-y-4">
            <div className="text-xs font-bold text-on-surface-variant">{t('payment_dist_title', 'भुगतान माध्यम वितरण')}</div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant font-medium">{t('cash_label', 'नकद')}</span>
                  <span className="font-bold text-on-surface">₹{cashSales.toLocaleString('en-IN')} (45%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[45%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant font-medium">UPI / QR (Google Pay, PhonePe)</span>
                  <span className="font-bold text-on-surface">₹{upiSales.toLocaleString('en-IN')} (38%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[38%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant font-medium">{t('udhaar_khata', 'उधारी खाता')}</span>
                  <span className="font-bold text-on-surface">₹{udhaarSales.toLocaleString('en-IN')} (17%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[17%]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="max-w-3xl mx-auto w-full pt-4">
        <button
          onClick={() => onNavigate('home_dashboard')}
          className="w-full bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-semibold py-3.5 rounded-2xl text-xs cursor-pointer border border-outline-variant/30"
        >
          {t('back_to_dashboard', 'डैशबोर्ड पर वापस जाएं')}
        </button>
      </div>
    </div>
  );
};
