import React, { useState } from 'react';
import { MapPin, FileText, X, Check, Store } from 'lucide-react';
import { MerchantProfile } from '../types';

interface EditStoreDetailsModalProps {
  isOpen: boolean;
  activeTab: 'location' | 'bill_notes';
  onClose: () => void;
  merchant: MerchantProfile;
  onUpdateMerchant: (updated: Partial<MerchantProfile>) => void;
}

export const EditStoreDetailsModal: React.FC<EditStoreDetailsModalProps> = ({
  isOpen,
  activeTab: initialTab,
  onClose,
  merchant,
  onUpdateMerchant,
}) => {
  const [tab, setTab] = useState<'location' | 'bill_notes'>(initialTab);

  // Location fields
  const [addressLine, setAddressLine] = useState(merchant.address || '');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400001');

  // Bill Notes fields
  const [headerTitle, setHeaderTitle] = useState(merchant.shopName || '');
  const [headerContact, setHeaderContact] = useState(merchant.phone || '');
  const [footerTagline, setFooterTagline] = useState(
    merchant.billFooterNote || 'उधार प्रेम की कैंची है / Thank you, visit again!'
  );
  const [termsNote, setTermsNote] = useState('Goods once sold will not be taken back without bill.');

  if (!isOpen) return null;

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${addressLine.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`;
    onUpdateMerchant({ address: fullAddress });
    onClose();
  };

  const handleSaveBillNotes = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMerchant({
      shopName: headerTitle.trim() || merchant.shopName,
      phone: headerContact.trim() || merchant.phone,
      billFooterNote: footerTagline.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('location')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                tab === 'location'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Shop Location & PIN</span>
            </button>
            <button
              onClick={() => setTab('bill_notes')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                tab === 'bill_notes'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bill Header & Footer</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {tab === 'location' ? (
          <form onSubmit={handleSaveLocation} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                दुकान का पूरा पता (Shop Number / Building / Market) *
              </label>
              <textarea
                rows={2}
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="e.g. Shop No. 14, Main Market, Sector 18"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  शहर (City)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-emerald-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  राज्य (State)
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                पिन कोड (PIN Code - 6 Digits)
              </label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-emerald-600"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save Address</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveBillNotes} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                बिल शीर्षक (Bill Header Shop Name)
              </label>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                हेडर मोबाइल नंबर (Header Helpline / WhatsApp)
              </label>
              <input
                type="text"
                value={headerContact}
                onChange={(e) => setHeaderContact(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                बिल फुटर टैगलाइन (Footer Tagline Note)
              </label>
              <input
                type="text"
                value={footerTagline}
                onChange={(e) => setFooterTagline(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl italic focus:outline-emerald-600"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Prints at bottom of thermal receipt & WhatsApp invoice
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                नियम व शर्तें (Terms & Conditions / Return Policy)
              </label>
              <input
                type="text"
                value={termsNote}
                onChange={(e) => setTermsNote(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-600"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save Bill Settings</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
