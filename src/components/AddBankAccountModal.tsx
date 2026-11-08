import React, { useState } from 'react';
import { Building2, Check, AlertCircle, X, ShieldCheck } from 'lucide-react';

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'CURRENT' | 'SAVINGS';
  isDefault: boolean;
  addedAt: string;
}

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: BankAccount) => void;
  existingAccountsCount: number;
}

const POPULAR_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Canara Bank',
  'Union Bank of India',
];

export const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
  existingAccountsCount,
}) => {
  const [bankName, setBankName] = useState('State Bank of India');
  const [customBank, setCustomBank] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState<'CURRENT' | 'SAVINGS'>('CURRENT');
  const [isDefault, setIsDefault] = useState(existingAccountsCount === 0);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBank = bankName === 'OTHER' ? customBank.trim() : bankName;

    if (!finalBank) {
      setError('कृपया बैंक का नाम चुनें या लिखें');
      return;
    }
    if (!accountHolder.trim()) {
      setError('खाताधारक का नाम अनिवार्य है');
      return;
    }
    const cleanAcc = accountNumber.trim().replace(/\D/g, '');
    if (cleanAcc.length < 9 || cleanAcc.length > 18) {
      setError('कृपया 9 से 18 अंकों का वैध बैंक खाता नंबर दर्ज करें');
      return;
    }
    if (cleanAcc !== confirmAccountNumber.trim().replace(/\D/g, '')) {
      setError('दोनों खाता नंबर मेल नहीं खा रहे हैं (Account numbers do not match)');
      return;
    }
    const cleanIfsc = ifscCode.trim().toUpperCase();
    if (cleanIfsc.length !== 11) {
      setError('IFSC कोड 11 अक्षरों का होना चाहिए (e.g. SBIN0001234)');
      return;
    }

    setError('');
    const newAcc: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: finalBank,
      accountHolder: accountHolder.trim(),
      accountNumber: cleanAcc,
      ifscCode: cleanIfsc,
      accountType,
      isDefault,
      addedAt: new Date().toISOString(),
    };

    onAddAccount(newAcc);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                नया बैंक खाता जोड़ें
              </h3>
              <p className="text-[11px] text-slate-500">Add Bank Account for Daily Settlements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Bank Selection */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              बैंक का नाम (Bank Name) *
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-emerald-600 focus:bg-white"
            >
              {POPULAR_BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="OTHER">Other Bank (दूसरा बैंक)</option>
            </select>
            {bankName === 'OTHER' && (
              <input
                type="text"
                placeholder="बैंक का नाम लिखें (Enter bank name)"
                value={customBank}
                onChange={(e) => setCustomBank(e.target.value)}
                className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-emerald-600"
              />
            )}
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              खाताधारक का नाम (Account Holder Name) *
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Sharma / Store Trade Name"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-emerald-600 shadow-2xs"
            />
          </div>

          {/* Account Number & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                खाता संख्या (Account No.) *
              </label>
              <input
                type="password"
                placeholder="Enter Account No."
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-emerald-600 shadow-2xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                खाता संख्या दोबारा दर्ज करें *
              </label>
              <input
                type="text"
                placeholder="Re-enter Account No."
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-emerald-600 shadow-2xs"
              />
            </div>
          </div>

          {/* IFSC Code */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              IFSC कोड (11 Digits) *
            </label>
            <input
              type="text"
              maxLength={11}
              placeholder="e.g. SBIN0001234"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold uppercase text-xs focus:outline-emerald-600 shadow-2xs"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              आपकी बैंक पासबुक या चेकबुक पर दिया गया 11 अंकों का कोड
            </span>
          </div>

          {/* Account Type */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              खाते का प्रकार (Account Type)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('CURRENT')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                  accountType === 'CURRENT'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Current (चालू खाता)
              </button>
              <button
                type="button"
                onClick={() => setAccountType('SAVINGS')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                  accountType === 'SAVINGS'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Savings (बचत खाता)
              </button>
            </div>
          </div>

          {/* Default Settlement Toggle */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                डिफ़ॉल्ट सेटलमेंट खाता बनाएं
              </span>
              <span className="text-[10px] text-slate-500">
                Daily QR payout will be credited here
              </span>
            </div>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
            >
              रद्द करें (Cancel)
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>खाता जोड़ें (Save Account)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
