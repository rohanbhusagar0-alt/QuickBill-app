import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { User } from 'firebase/auth';
import { loginWithGoogle, logoutUser, subscribeToAuth } from '../services/firebase';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  ShieldCheck,
  Lock,
  RotateCcw,
  UserPlus,
  KeyRound,
  FileText,
  Landmark,
  Bike,
  History,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Shield,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StaffManagementScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

interface StaffDetail {
  id: string;
  name: string;
  avatarText: string;
  phone: string;
  role: string;
  roleBadgeColor: 'green' | 'blue' | 'slate';
  status: string;
  statusColor: 'green' | 'slate';
  lastActive: string;
  assignedRights: string;
  pinLast2: string;
  fullPin: string;
  isOnline: boolean;
  permissions: {
    canBill: boolean;
    canAcceptPayment: boolean;
    canPrintInvoice: boolean;
    canViewProfit: boolean;
    canViewUdhaar: boolean;
    canEditInventory: boolean;
    canViewReports: boolean;
  };
}

interface ShiftSummary {
  cashierName: string;
  shiftName: string;
  startTime: string;
  openingCash: number;
  cashSalesInflow: number;
  billCount: number;
  cashExpensesPaid: number;
  expensesNote: string;
  expectedDrawerTotal: number;
}

const initialStaffList: StaffDetail[] = [
  {
    id: 'staff-1',
    name: 'Amit Kumar',
    avatarText: 'AK',
    phone: '+9198765 43210',
    role: 'Head Cashier',
    roleBadgeColor: 'green',
    status: 'On Duty',
    statusColor: 'green',
    lastActive: '2 mins ago',
    assignedRights: 'Billing Only • Accept Cash & UPI • Print Invoices',
    pinLast2: '8 2',
    fullPin: '2482',
    isOnline: true,
    permissions: {
      canBill: true,
      canAcceptPayment: true,
      canPrintInvoice: true,
      canViewProfit: false,
      canViewUdhaar: false,
      canEditInventory: false,
      canViewReports: false,
    },
  },
  {
    id: 'staff-2',
    name: 'Suresh Patel',
    avatarText: 'SP',
    phone: '+9198123 45678',
    role: 'Store Helper',
    roleBadgeColor: 'blue',
    status: 'Active',
    statusColor: 'green',
    lastActive: '18 mins ago',
    assignedRights: 'View Delivery Orders • Mark Dispatched • Customer Phone',
    pinLast2: '4 9',
    fullPin: '1349',
    isOnline: true,
    permissions: {
      canBill: false,
      canAcceptPayment: false,
      canPrintInvoice: true,
      canViewProfit: false,
      canViewUdhaar: false,
      canEditInventory: true,
      canViewReports: false,
    },
  },
  {
    id: 'staff-3',
    name: 'Neha Verma',
    avatarText: 'NV',
    phone: '+9197234 11223',
    role: 'Inventory Assist',
    roleBadgeColor: 'slate',
    status: 'Offline',
    statusColor: 'slate',
    lastActive: 'Yesterday',
    assignedRights: 'Stock Count Entry • Add New Barcodes • Inventory Edit',
    pinLast2: '1 5',
    fullPin: '7815',
    isOnline: false,
    permissions: {
      canBill: false,
      canAcceptPayment: false,
      canPrintInvoice: false,
      canViewProfit: false,
      canViewUdhaar: false,
      canEditInventory: true,
      canViewReports: false,
    },
  },
];

const auditLogsData = [
  { id: '1', user: 'Amit Kumar', action: 'billed #QB-9042 (₹1,840)', time: '12:15 PM', dotColor: 'emerald' },
  { id: '2', user: 'Suresh Patel', action: 'marked Order #412 Dispatched', time: '11:40 AM', dotColor: 'blue' },
  { id: '3', user: 'Amit Kumar', action: 'recorded Cash Expense (₹350 Milk)', time: '10:05 AM', dotColor: 'rose' },
  { id: '4', user: 'Amit Kumar', action: 'logged in to Shift 1 with PIN ****82', time: '08:30 AM', dotColor: 'emerald' },
  { id: '5', user: 'Neha Verma', action: 'updated stock for Tata Tea Gold (+24 pcs)', time: 'Yesterday 06:12 PM', dotColor: 'slate' },
];

export const StaffManagementScreen: React.FC<StaffManagementScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [staffList, setStaffList] = useState<StaffDetail[]>(initialStaffList);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    return subscribeToAuth((user) => {
      setCurrentUser(user);
    });
  }, []);

  // Shift & Galla Tally State
  const [shift, setShift] = useState<ShiftSummary>({
    cashierName: 'Amit Kumar',
    shiftName: 'Current Shift (Morning)',
    startTime: '08:30 AM',
    openingCash: 2000,
    cashSalesInflow: 18450,
    billCount: 34,
    cashExpensesPaid: 1200,
    expensesNote: 'Milk & packing petty',
    expectedDrawerTotal: 19250,
  });

  // Modals
  const [showGallaModal, setShowGallaModal] = useState(false);
  const [physicalCashInput, setPhysicalCashInput] = useState('');
  const [shiftCloseSuccess, setShiftCloseSuccess] = useState(false);

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Head Cashier' | 'Store Helper' | 'Inventory Assist' | 'Accountant / Munim' | 'Delivery Boy'>('Head Cashier');
  const [newStaffPin, setNewStaffPin] = useState('');

  const [editingStaff, setEditingStaff] = useState<StaffDetail | null>(null);
  const [editPin, setEditPin] = useState('');
  const [editRights, setEditRights] = useState<StaffDetail['permissions']>({
    canBill: true,
    canAcceptPayment: true,
    canPrintInvoice: true,
    canViewProfit: false,
    canViewUdhaar: false,
    canEditInventory: false,
    canViewReports: false,
  });

  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (staff: StaffDetail) => {
    setEditingStaff(staff);
    setEditPin(staff.fullPin);
    setEditRights({ ...staff.permissions });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    const pinLast2 = editPin.length >= 2 ? `${editPin.slice(-2, -1)} ${editPin.slice(-1)}` : '• •';
    
    // Auto-generate assigned rights text summary
    const rightsParts: string[] = [];
    if (editRights.canBill) rightsParts.push('Billing Only');
    if (editRights.canAcceptPayment) rightsParts.push('Accept Cash & UPI');
    if (editRights.canPrintInvoice) rightsParts.push('Print Invoices');
    if (editRights.canEditInventory) rightsParts.push('Inventory Edit');
    if (editRights.canViewReports) rightsParts.push('GST Reports');

    const updated = staffList.map((s) =>
      s.id === editingStaff.id
        ? {
            ...s,
            fullPin: editPin,
            pinLast2,
            permissions: { ...editRights },
            assignedRights: rightsParts.length > 0 ? rightsParts.join(' • ') : 'View Only',
          }
        : s
    );
    setStaffList(updated);
    setEditingStaff(null);
    showToast(`Staff ${editingStaff.name} access updated successfully!`);
  };

  const handleAddNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName) return;
    const pin = newStaffPin || '1234';
    const pinLast2 = pin.length >= 2 ? `${pin.slice(-2, -1)} ${pin.slice(-1)}` : '• •';
    const initials = newStaffName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    let rightsSummary = 'Billing Only • Accept Cash & UPI • Print Invoices';
    let badgeColor: 'green' | 'blue' | 'slate' = 'green';
    if (newStaffRole === 'Store Helper') {
      rightsSummary = 'View Delivery Orders • Mark Dispatched • Customer Phone';
      badgeColor = 'blue';
    } else if (newStaffRole === 'Inventory Assist') {
      rightsSummary = 'Stock Count Entry • Add New Barcodes • Inventory Edit';
      badgeColor = 'slate';
    } else if (newStaffRole === 'Accountant / Munim') {
      rightsSummary = 'Full Khata • GST Reports • Vendor Statements';
      badgeColor = 'blue';
    } else if (newStaffRole === 'Delivery Boy') {
      rightsSummary = 'Delivery Orders • Drop Address • Customer Phone';
      badgeColor = 'slate';
    }

    const newMember: StaffDetail = {
      id: `staff-${Date.now()}`,
      name: newStaffName,
      avatarText: initials || 'ST',
      phone: newStaffPhone ? `+91 ${newStaffPhone}` : '+91 99999 00000',
      role: newStaffRole,
      roleBadgeColor: badgeColor,
      status: 'Active',
      statusColor: 'green',
      lastActive: 'Just now',
      assignedRights: rightsSummary,
      pinLast2,
      fullPin: pin,
      isOnline: true,
      permissions: {
        canBill: newStaffRole === 'Head Cashier',
        canAcceptPayment: newStaffRole === 'Head Cashier',
        canPrintInvoice: true,
        canViewProfit: false,
        canViewUdhaar: newStaffRole === 'Accountant / Munim',
        canEditInventory: newStaffRole === 'Inventory Assist',
        canViewReports: newStaffRole === 'Accountant / Munim',
      },
    };

    setStaffList([...staffList, newMember]);
    setShowAddStaffModal(false);
    setNewStaffName('');
    setNewStaffPhone('');
    setNewStaffPin('');
    showToast(`Staff ${newMember.name} added to directory!`);
  };

  const handleVerifyShiftClose = (e: React.FormEvent) => {
    e.preventDefault();
    const counted = parseFloat(physicalCashInput);
    if (isNaN(counted)) return;

    setShiftCloseSuccess(true);
    setTimeout(() => {
      setShiftCloseSuccess(false);
      setShowGallaModal(false);
      setPhysicalCashInput('');
      showToast('Shift verified and Galla Tally saved successfully!');
    }, 1500);
  };

  const difference = physicalCashInput ? parseFloat(physicalCashInput) - shift.expectedDrawerTotal : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-sans pb-24 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#006948] text-white px-5 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home_dashboard')}
              className="p-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                Quickbill Staff & Cashier A..
              </h1>
              <p className="text-xs text-slate-500 font-medium">Sharma General Store</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Search Staff"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="More Options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Options Dropdown */}
            {showMenuDropdown && (
              <div className="absolute right-0 top-11 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-48 z-40 text-xs">
                <button
                  onClick={() => {
                    setShowMenuDropdown(false);
                    setShowAddStaffModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-emerald-700" />
                  Add New Staff
                </button>
                <button
                  onClick={() => {
                    setShowMenuDropdown(false);
                    setShowGallaModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-blue-700" />
                  Verify Galla Shift
                </button>
                <button
                  onClick={() => {
                    setShowMenuDropdown(false);
                    setShowAuditModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <History className="w-4 h-4 text-slate-600" />
                  View Audit Logs
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toggleable Search Bar */}
        {showSearch && (
          <div className="max-w-2xl mx-auto mt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name, phone or role..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Screen Content */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-3 space-y-3.5">
        
        {/* Firebase Authentication & Staff Role Authorization */}
        <div className="bg-emerald-950 text-white rounded-2xl p-4 shadow-sm border border-emerald-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center font-bold text-lg">
                🔐
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">Firebase Google Auth & RBAC</h3>
                  <span className="text-[10px] font-bold bg-emerald-800/80 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded-full">
                    asia-south1 (Mumbai)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 mt-0.5">
                  {currentUser ? `Owner: ${currentUser.email || currentUser.displayName}` : 'Owner Account & Role Protection Active'}
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                if (currentUser) {
                  await logoutUser();
                  showToast('Signed out of Google account.');
                } else {
                  const u = await loginWithGoogle();
                  if (u) {
                    showToast(`Signed in as ${u.displayName || u.email}!`);
                  }
                }
              }}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-950 font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              {currentUser ? 'Sign Out' : 'Sign In with Google'}
            </button>
          </div>
        </div>

        {/* 1. Dukaan Suraksha PIN Lock Card */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-900 leading-snug">
                  Dukaan Suraksha PIN Lock
                </h2>
                <p className="text-xs text-slate-500 font-medium">Owner Master Control Active</p>
              </div>
            </div>

            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/50">
              Pro Plan
            </span>
          </div>

          {/* Progress Bar: Staff Limit Used */}
          <div className="mt-3.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-600 font-medium">Staff Limit Used</span>
              <span className="text-slate-900 font-bold">
                {staffList.length} <span className="text-slate-400 font-normal">/ 5 Members</span>
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#006948] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (staffList.length / 5) * 100)}%` }}
              />
            </div>
          </div>

          {/* Privacy Callout */}
          <div className="bg-[#f0f4fc] rounded-xl p-3 flex items-start gap-2.5 mt-3 text-xs leading-relaxed text-slate-700 border border-blue-100/50">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 font-semibold">100% Privacy:</strong> Cashiers and
              helpers cannot view your profit margins, net revenue, or Udhaar Khata ledger without
              your 4-digit Master PIN.
            </p>
          </div>
        </div>

        {/* 2. Daily Galla & Shift Hisab Card */}
        <div className="bg-[#f4f7fd] border border-slate-200/60 rounded-2xl p-4 shadow-xs">
          {/* Card Title & Live Shift Pill */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-200/70 text-slate-700 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Daily Galla & Shift Hisab</h2>
            </div>

            <div className="bg-white border border-slate-200/80 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Shift
            </div>
          </div>

          {/* Inner White Box */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-2xs">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">{shift.shiftName}</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  Cashier: {shift.cashierName}
                </p>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md">
                Started {shift.startTime}
              </span>
            </div>

            {/* 4 Stat Boxes (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              {/* Box 1: Opening Cash */}
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
                <p className="text-[11px] text-slate-500 font-medium">Opening Cash (Galla)</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">
                  ₹{shift.openingCash.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Physical base float</p>
              </div>

              {/* Box 2: Cash Sales Inflow */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5">
                <p className="text-[11px] text-slate-500 font-medium">Cash Sales Inflow</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">
                  +₹{shift.cashSalesInflow.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{shift.billCount} Counter bills</p>
              </div>

              {/* Box 3: Cash Expenses Paid */}
              <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-2.5">
                <p className="text-[11px] text-slate-500 font-medium">Cash Expenses Paid</p>
                <p className="text-lg font-bold text-rose-600 mt-0.5">
                  -₹{shift.cashExpensesPaid.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{shift.expensesNote}</p>
              </div>

              {/* Box 4: Expected Drawer Total */}
              <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-2.5">
                <p className="text-[11px] text-slate-500 font-medium">Expected Drawer Total</p>
                <p className="text-lg font-bold text-blue-900 mt-0.5">
                  ₹{shift.expectedDrawerTotal.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Tally match ready</p>
              </div>
            </div>
          </div>

          {/* Action Button: Verify & Close Shift */}
          <button
            onClick={() => setShowGallaModal(true)}
            className="w-full bg-[#0d1b2a] hover:bg-[#1a2d42] active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mt-3 cursor-pointer shadow-sm text-xs sm:text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
            <span>Verify & Close Shift (Galla Tally)</span>
          </button>
        </div>

        {/* 3. Active Staff Directory Header & Add Button */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Staff Directory</h2>
            <p className="text-xs text-slate-500">Individual logins with customized permissions</p>
          </div>

          <button
            onClick={() => setShowAddStaffModal(true)}
            className="bg-[#006948] hover:bg-[#00553a] active:scale-95 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff</span>
          </button>
        </div>

        {/* Staff Members List */}
        <div className="space-y-3">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-slate-200 transition-colors"
            >
              {/* Member Top Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                        member.roleBadgeColor === 'green'
                          ? 'bg-blue-100 text-blue-800'
                          : member.roleBadgeColor === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {member.avatarText}
                    </div>
                    {/* Status dot */}
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 border-white absolute -bottom-0.5 -right-0.5 ${
                        member.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {member.name}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                          member.roleBadgeColor === 'green'
                            ? 'bg-emerald-100 text-emerald-800'
                            : member.roleBadgeColor === 'blue'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{member.phone}</p>
                  </div>
                </div>

                {/* Right Status */}
                <div className="text-right">
                  <div
                    className={`text-xs font-semibold flex items-center gap-1 justify-end ${
                      member.statusColor === 'green' ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        member.statusColor === 'green' ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                    />
                    {member.status}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{member.lastActive}</p>
                </div>
              </div>

              {/* Assigned Rights Box */}
              <div className="bg-[#f0f5ff] rounded-xl p-2.5 my-2.5 border border-blue-50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  ASSIGNED RIGHTS
                </p>
                <p className="text-xs text-slate-800 font-medium mt-0.5">{member.assignedRights}</p>
              </div>

              {/* Bottom Row: PIN & Edit Action */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                  <span className="text-slate-400 text-sm">:::</span>
                  <span>PIN: • • {member.pinLast2}</span>
                </div>

                <button
                  onClick={() => handleOpenEdit(member)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                >
                  Edit Access / PIN
                </button>
              </div>
            </div>
          ))}

          {filteredStaff.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs">
              No staff members found matching "{searchQuery}".
            </div>
          )}
        </div>

        {/* 4. Quick Role Presets (Pre-Configured) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-base font-bold text-slate-900">Quick Role Presets</h2>
            <span className="text-xs font-semibold text-emerald-700">Pre-Configured</span>
          </div>

          <div className="space-y-2.5">
            {/* Preset 1: Cashier Mode */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Cashier Mode</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    Most Popular
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Fast billing & counter print. Customer credit (Udhaar) ledger and gross profit
                  margins are completely hidden.
                </p>
              </div>
            </div>

            {/* Preset 2: Accountant / Munim Mode */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Accountant / Munim Mode</h3>
                  <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    Reports Only
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Full Khata, GST reports & vendor statements access. Item sale prices & inventory
                  cannot be modified.
                </p>
              </div>
            </div>

            {/* Preset 3: Delivery Boy Mode */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Bike className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Delivery Boy Mode</h3>
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    Field Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Customer phone and delivery drop address visible. Restricts financial balances and
                  shop ledger summaries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Staff Activity Audit Log */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900">Staff Activity Audit Log</h2>
            </div>
            <button
              onClick={() => setShowAuditModal(true)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              View All (42)
            </button>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2.5">
            {auditLogsData.slice(0, 3).map((log) => (
              <div key={log.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      log.dotColor === 'emerald'
                        ? 'bg-emerald-500'
                        : log.dotColor === 'blue'
                        ? 'bg-blue-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <p className="text-slate-700 truncate">
                    <strong className="text-slate-900 font-semibold">{log.user}</strong> {log.action}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 font-medium">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal 1: Verify & Close Shift (Galla Tally) */}
      {showGallaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-base">Galla Tally & Shift Close</h3>
              </div>
              <button
                onClick={() => setShowGallaModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {shiftCloseSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2 animate-bounce" />
                <p className="text-base font-bold text-slate-900">Shift Closed Successfully!</p>
                <p className="text-xs text-slate-500 mt-1">Galla verified and shift report exported.</p>
              </div>
            ) : (
              <form onSubmit={handleVerifyShiftClose} className="mt-4 space-y-3.5 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Cashier In-Charge:</span>
                    <strong className="text-slate-900">{shift.cashierName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shift Duration:</span>
                    <span>Started {shift.startTime} (Active)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Opening Float (Galla):</span>
                    <span>₹{shift.openingCash}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Cash Bills Inflow:</span>
                    <span className="text-emerald-700 font-semibold">+₹{shift.cashSalesInflow}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Petty Cash Expenses:</span>
                    <span className="text-rose-600 font-semibold">-₹{shift.cashExpensesPaid}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Expected System Cash:</span>
                    <span className="text-blue-900">₹{shift.expectedDrawerTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Enter Physical Cash Counted in Drawer (₹)
                  </label>
                  <input
                    type="number"
                    value={physicalCashInput}
                    onChange={(e) => setPhysicalCashInput(e.target.value)}
                    placeholder="e.g. 19250"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {physicalCashInput && (
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                      difference === 0
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : difference > 0
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <span>Tally Result:</span>
                    <span>
                      {difference === 0
                        ? '✓ 100% Perfect Match'
                        : difference > 0
                        ? `+₹${difference} Surplus`
                        : `-₹${Math.abs(difference)} Cash Shortage`}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGallaModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#006948] hover:bg-[#00553a] text-white font-bold cursor-pointer shadow-sm"
                  >
                    Confirm & Close Shift
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Add Staff Member */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">Add New Staff Member</h3>
              </div>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewStaff} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Staff Full Name</label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role Preset</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Head Cashier">Head Cashier (Counter Fast Billing)</option>
                  <option value="Store Helper">Store Helper (Order & Dispatch)</option>
                  <option value="Inventory Assist">Inventory Assist (Stock & Barcodes)</option>
                  <option value="Accountant / Munim">Accountant / Munim (Khata & GST)</option>
                  <option value="Delivery Boy">Delivery Boy (Field Deliveries)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Assign 4-Digit Login PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newStaffPin}
                  onChange={(e) => setNewStaffPin(e.target.value)}
                  placeholder="e.g. 5678"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 tracking-widest font-mono text-center text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 leading-relaxed border border-emerald-100">
                Staff member will log in on mobile/POS with this PIN. Gross profits and wholesale
                purchase rates remain confidential.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#006948] hover:bg-[#00553a] text-white font-bold cursor-pointer shadow-sm"
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Edit Access / PIN */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">Edit Staff Access & PIN</h3>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{editingStaff.name}</p>
                  <p className="text-slate-500 text-[11px]">{editingStaff.role} • {editingStaff.phone}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                  {editingStaff.status}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Change 4-Digit Security PIN
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={editPin}
                  onChange={(e) => setEditPin(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-mono text-center text-sm font-bold tracking-widest text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Customized Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <span className="text-slate-800 font-medium">Create POS Bill & Accept Cash/UPI</span>
                    <input
                      type="checkbox"
                      checked={editRights.canBill}
                      onChange={(e) => setEditRights({ ...editRights, canBill: e.target.checked })}
                      className="accent-[#006948] w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <span className="text-slate-800 font-medium">Print Invoices / Bluetooth Receipts</span>
                    <input
                      type="checkbox"
                      checked={editRights.canPrintInvoice}
                      onChange={(e) => setEditRights({ ...editRights, canPrintInvoice: e.target.checked })}
                      className="accent-[#006948] w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <span className="text-slate-800 font-medium">Edit Inventory Stock & Barcodes</span>
                    <input
                      type="checkbox"
                      checked={editRights.canEditInventory}
                      onChange={(e) => setEditRights({ ...editRights, canEditInventory: e.target.checked })}
                      className="accent-[#006948] w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <span className="text-slate-800 font-medium">View Customer Udhaar Khata</span>
                    <input
                      type="checkbox"
                      checked={editRights.canViewUdhaar}
                      onChange={(e) => setEditRights({ ...editRights, canViewUdhaar: e.target.checked })}
                      className="accent-[#006948] w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <span className="text-slate-800 font-medium">View Profit Margins & Purchase Rate</span>
                    <input
                      type="checkbox"
                      checked={editRights.canViewProfit}
                      onChange={(e) => setEditRights({ ...editRights, canViewProfit: e.target.checked })}
                      className="accent-[#006948] w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#006948] hover:bg-[#00553a] text-white font-bold cursor-pointer shadow-sm"
                >
                  Save Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Full Audit Logs */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">All Staff Activity Audit Logs</h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 mt-3 space-y-2.5 pr-1 text-xs">
              {auditLogsData.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <span
                      className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                        log.dotColor === 'emerald'
                          ? 'bg-emerald-500'
                          : log.dotColor === 'blue'
                          ? 'bg-blue-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{log.user}</p>
                      <p className="text-slate-600 text-[11px]">{log.action}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">{log.time}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 mt-2">
              <button
                onClick={() => setShowAuditModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
