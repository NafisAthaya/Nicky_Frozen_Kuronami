import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineShoppingCart,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineSwitchHorizontal,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';
import { MdOutlineLogout } from 'react-icons/md';

const menuItems = [
  {
    id: 'kasir',
    label: 'Kasir',
    path: '/kasir',
    icon: HiOutlineShoppingCart,
  },
  {
    id: 'riwayat',
    label: 'Riwayat Transaksi',
    path: '/kasir/riwayat-transaksi',
    icon: HiOutlineDocumentText,
  },
  {
    id: 'pengeluaran',
    label: 'Pengeluaran',
    path: '/kasir/pengeluaran',
    icon: HiOutlineCash,
  },
  {
    id: 'shift',
    label: 'Ganti Shift',
    path: '/kasir/ganti-shift',
    icon: HiOutlineSwitchHorizontal,
  },
];

const profileItem = null;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path) => {
    if (!path) return false;
    if (path === '/kasir') return location.pathname === '/kasir';
    return location.pathname.startsWith(path);
  };

  const handleClick = (item) => {
    if (item.disabled || !item.path) return;
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    navigate('/');
  };

  const renderMenuItem = (item) => {
    const active = isActive(item.path);
    return (
      <button
        key={item.id}
        onClick={() => handleClick(item)}
        disabled={item.disabled}
        className={`
          sidebar-menu-item group w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium
          transition-all duration-200 text-left
          ${active
            ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-500/30'
            : item.disabled
              ? 'text-blue-300/50 cursor-not-allowed'
              : 'text-blue-100 hover:bg-white/10 hover:text-white'
          }
        `}
      >
        <>
        {item.icon && (
          <item.icon className="w-5 h-5 shrink-0" />
        )}
        <span>{item.label}</span>
      </>
      </button>
    );
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#082B7A] flex flex-col z-50">
        {/* Brand */}
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-[22px] font-extrabold text-white">
          Nicky Frozen
        </h1>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-[#5A7AC9]">
          <div>
            <p className="text-blue-200 text-sm">
              Cabang Utama
            </p>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-5 pt-8 space-y-3 overflow-y-auto">

          {menuItems.map(renderMenuItem)}
          <div className="my-3 border-t border-[#5A7AC9]" />

          {profileItem && renderMenuItem(profileItem)}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto px-6 pb-8 space-y-3">
          <button
            onClick={() => navigate('/kasir/bantuan')}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <HiOutlineQuestionMarkCircle className="w-5 h-5" />
            <span>Bantuan Sistem</span>
          </button>
                  
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[360px] shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <MdOutlineLogout size={32} className="text-red-500 rotate-180" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Keluar</h3>
            <p className="text-gray-500 text-center mb-6">
              Apakah Anda yakin ingin keluar?
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
