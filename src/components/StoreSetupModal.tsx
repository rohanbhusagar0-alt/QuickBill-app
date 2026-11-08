import React, { useState } from 'react';
import { MerchantProfile } from '../types';
import {
  Store,
  User,
  Phone,
  QrCode,
  MapPin,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';

interface StoreSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantProfile;
  onSaveMerchant: (updated: Partial<MerchantProfile>) => void;
  onStartFreshStore: () => void;
  onRestoreDemoData: () => void;
  isFreshStore: boolean;
}

export const StoreSetupModal: React.FC<StoreSetupModalProps> = ({
  isOpen,
  onClose,
  merchant,
  onSaveMerchant,
  onStartFreshStore,
  onRestoreDemoData,
  isFreshStore,
}) => {
  const [shopName, setShopName] = useState(merchant.shopName || '');
  const [ownerName, setOwnerName] = useState(merchant.name || '');
  const [phone, setPhone] = useState(merchant.phone || '');
  const [upiId, setUpiId] = useState(merchant.upiId || '');
  const [address, setAddress] = useState(merchant.address || '');
  const [gstin, setGstin] = useState(merchant.gstin || '');

  if (!isOpen) return null;

  const handleSaveAndFresh = () => {
    onSaveMerchant({
      shopName: shopName.trim() || 'Apni Dukan',
      name: ownerName.trim() || 'Store Owner',
      phone: phone.trim() || '',
      upiId: upiId.trim() || '',
      address: address.trim(),
      gstin: gstin.trim(),
    });
    onStartFreshStore();
    onClose();
  };

  const handleSaveAndKeepDemo = () => {
    onSaveMerchant({
      shopName: shopName.trim() || 'Mera Kirana Store',
      name: ownerName.trim() || 'Dukandar Name',
      phone: phone.trim() || '9876543210',
      upiId: upiId.trim() || 'rohanstore@okaxis',
      address: address.trim(),
      gstin: gstin.trim(),
    });
    onRestoreDemoData();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                  Setup Aapki Apni Dukaan
                </h2>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Live POS
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Apni dukan ki asli details daliye aur billing shuru karein
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Mode Badge */}
        <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600 font-medium">Current Status:</span>
            <span className="font-bold text-slate-900">
              {isFreshStore ? 'Fresh Store (₹0 Sales)' : 'Sample Demo Mode Active'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            asia-south1 Synced
          </span>
        </div>

        {/* Form Inputs */}
        <div className="mt-4 space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Store className="w-3.5 h-3.5 text-emerald-700" />
              <span>Dukan Ka Naam (Shop Name) *</span>
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. Rohan Kirana & General Store"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-emerald-600 focus:border-emerald-600 shadow-2xs text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Malik Ka Naam (Owner) *</span>
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Rohan Bhusagar"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-emerald-600 focus:border-emerald-600 text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp Mobile *</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-emerald-600 focus:border-emerald-600 text-xs shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Settlement UPI ID (QR Payment Receive) *</span>
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. rohanstore@okaxis / 9876543210@paytm"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:outline-emerald-600 focus:border-emerald-600 shadow-2xs"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Grahak QR scan karke sidhe is UPI account par paise bhejenge.
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Dukan Ka Pata (Address)</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Main Bazar, Shop No. 12, Market..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600 focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>GSTIN (Optional)</span>
            </label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="07AABCS1429B1Z"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs uppercase text-slate-900 focus:outline-emerald-600 focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2.5 pt-3 border-t border-slate-100">
          <button
            onClick={handleSaveAndFresh}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Mera Real Store Shuru Karein (Fresh ₹0 Store)</span>
          </button>

          <button
            onClick={handleSaveAndKeepDemo}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Sample Demo Data Dekhein (Preloaded Kirana Items)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
