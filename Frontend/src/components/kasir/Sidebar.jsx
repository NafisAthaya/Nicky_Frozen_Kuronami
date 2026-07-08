import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

import {
  HiOutlineShoppingCart,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineSwitchHorizontal,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';

const menuItems = [
  {
    id: 'kasir',
    label: 'Kasir',
    path: '/kasir',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },



  {
    id: 'riwayat',
    label: 'Riwayat Transaksi',
    path: '/kasir/riwayat-transaksi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },

  {
    id: 'pengeluaran',
    label: 'Pengeluaran',
    path: '/kasir/pengeluaran',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25V6.75A2.25 2.25 0 0018.75 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h12A2.25 2.25 0 0021 17.25v-1.5m0-7.5h-3a1.5 1.5 0 000 3h3"
        />
      </svg>
    )
  },

  {
    id: 'shift',
    label: 'Ganti Shift',
    path: '/kasir/ganti-shift',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h9m0 0l-3-3m3 3l-3 3M16.5 16.5h-9m0 0l3-3m-3 3l3 3"/>
      </svg>
    ),
  },
];

const profileItem = null;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutSuccess = useAuthStore((state) => state.logoutSuccess);
  
  const user = useAuthStore((state) => state.user);

  const userName = user?.name || 'Kasir';
  const userRole = 'Kasir';
  const rawCabang = user?.cabang?.nama_cabang || user?.cabang_nama || 'Belum Ditentukan';
  const userCabang = rawCabang.replace(/nicky frozen(\s*-\s*|\s+)?/gi, '').trim() || 'Belum Ditentukan';

  const userAvatar = user?.foto 
    ? `http://127.0.0.1:8000/storage/${user.foto}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff&bold=true&size=40`;


  const isActive = (path) => {
    if (!path) return false;
    if (path === '/kasir') return location.pathname === '/kasir';
    return location.pathname.startsWith(path);
  };

  const handleClick = (item) => {
    if (item.disabled || !item.path) return;
    navigate(item.path);
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
        <span className={`shrink-0 ${active ? 'text-white' : ''}`}>
          {item.icon}
        </span>
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
      <div className="px-6 py-4 flex items-center gap-3 border-b border-[#5A7AC9] mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#FF7A00]">
          <img
            src={userAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">
            Halo, {userName}
          </p>
          <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block truncate">
            {userRole} - {userCabang}
          </span>
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
      </div>
    </aside>
  </>
);
}