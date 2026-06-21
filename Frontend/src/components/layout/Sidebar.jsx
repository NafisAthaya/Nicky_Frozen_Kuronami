import { useLocation, useNavigate } from 'react-router-dom';
import ownerProfile from '../../assets/OwnerProfile.png';

const menuItems = [
  {
    id: 'beranda',
    label: 'Beranda',
    path: '/dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'stok',
    label: 'Stok Barang',
    path: '/dashboard/stok-barang',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 'laporan',
    label: 'Laporan',
    path: '/dashboard/laporan',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'transaksi',
    label: 'Transaksi',
    path: '/dashboard/transaksi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'atur-harga',
    label: 'Atur Harga',
    path: '/dashboard/atur-harga',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'diskon',
    label: 'Diskon Otomatis',
    path: '/dashboard/diskon-otomatis',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
];

const menuItemsBottom = [
  {
    id: 'pajak',
    label: '% Pajak & Pembulatan',
    path: '/dashboard/pajak-pembulatan',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6m0-6h.01M9 15h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },

  {
    id: 'cabang',
    label: 'Cabang Toko',
    path: '/dashboard/cabang-toko',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

const profileItem = {
  id: 'profil',
  label: 'Profil',
  path: '/dashboard/profil',
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};


export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole') || 'owner';
  const userName = localStorage.getItem('userName') || 'Nicky Owner';
  const userAvatar = localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff&bold=true&size=40`;

  // Filter main menu
  const filteredMenuItems = menuItems.filter((item) => {
    if (userRole === 'kasir') {
      return item.id === 'transaksi';
    }
    if (userRole === 'admin') {
      return item.id === 'stok';
    }
    return true; // Owner has all
  });

  // Filter bottom menu
  const filteredMenuItemsBottom = menuItemsBottom.filter((item) => {
    if (userRole === 'kasir') {
      return false; // Kasir has no bottom settings
    }
    if (userRole === 'admin') {
      return item.id === 'cabang';
    }
    return true; // Owner has all
  });

  const isActive = (path) => {
    if (!path) return false;
    if (path === '/dashboard') return location.pathname === '/dashboard';
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
          sidebar-menu-item group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
          transition-all duration-200 text-left
          ${active
            ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-500/30'
            : item.disabled
              ? 'text-blue-300/50 cursor-not-allowed'
              : 'text-blue-100 hover:bg-white/10 hover:text-white'
          }
        `}
      >
        <span className={`shrink-0 ${active ? 'text-white' : ''}`}>{item.icon}</span>
        <span>{item.label}</span>
      </button>
    );
  };

  return (
   <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#082B7A] flex flex-col z-50">
      {/* Brand */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-xl font-bold text-white tracking-tight">Nicky Frozen</h1>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-[#5A7AC9]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
          <img
            src={ownerProfile}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-white text-sm font-semibold">Halo, {userName}</p>
          <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">{userRole}</span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-6 pt-5 space-y-2 overflow-y-auto">

        {userRole === 'owner' && (
          <>
            {filteredMenuItems.map(renderMenuItem)}
            <div className="my-5 border-t border-[#5A7AC9]" />
            {filteredMenuItemsBottom.map(renderMenuItem)}
          </>
        )}

        {userRole !== 'owner' && filteredMenuItems.map(renderMenuItem)}

        {(userRole === 'admin') && (
          <>
            <div className="my-3 border-t border-[#5A7AC9]" />
            {filteredMenuItemsBottom.map(renderMenuItem)}
          </>
        )}

        <div className="my-3 border-t border-[#5A7AC9]" />

        {renderMenuItem(profileItem)}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto px-6 pb-8 space-y-3">
        {userRole === 'owner' && (
          <button
            onClick={() => navigate('/dashboard/pusat-bantuan')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Bantuan Sistem</span>
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
