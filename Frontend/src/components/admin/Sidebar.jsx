import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MdGridView,
  MdOutlineInventory2,
  MdOutlineCategory,
  MdOutlineMoveToInbox,
  MdOutlinePersonOutline,
  MdOutlineSettings,
  MdOutlineLogout
} from 'react-icons/md';
import ownerProfile from '../../assets/OwnerProfile.png';

const topMenuItems = [
  { id: 'beranda', label: 'Beranda', path: '/admin', icon: <MdGridView size={20} /> },
  { id: 'stok', label: 'Stok Barang', path: '/admin/stok-barang', icon: <MdOutlineInventory2 size={20} /> },
  { id: 'kategori', label: 'Kategori Item', path: '/admin/kategori-item', icon: <MdOutlineCategory size={20} /> },
  { id: 'barangmasuk', label: 'Barang Masuk', path: '/admin/barang-masuk', icon: <MdOutlineMoveToInbox size={20} /> },
];

const bottomMenuItems = [
  { id: 'profil', label: 'Profil', path: '/admin/profil', icon: <MdOutlinePersonOutline size={20} /> },
  { id: 'pengaturan', label: 'Pengaturan', path: '/admin/pengaturan', icon: <MdOutlineSettings size={20} /> },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Ambil data user yang login dari localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const userName = user?.name || 'Admin';
  const userRole = user?.role || 'admin';

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const renderMenuItem = (item) => {
    const active = isActive(item.path);

    return (
      <button
        key={item.id}
        onClick={() => navigate(item.path)}
        className={`
          w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-left
          transition-all duration-200
          ${
            active
              ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-500/30'
              : 'text-[#6F8BCE] hover:bg-white/5 hover:text-white'
          }
        `}
      >
        <span className={active ? 'text-white' : 'text-[#6F8BCE]'}>{item.icon}</span>
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#0A2266] flex flex-col z-50">
        
        {/* Brand space */}
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Nicky Frozen
          </h1>
        </div>

        <div className="px-6 py-4 flex items-center gap-3 border-b border-[#24428B] mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
            <img
              src={ownerProfile}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              Halo, {userName}
            </p>
            <span className="text-[10px] text-[#6F8BCE] font-bold uppercase tracking-wider">
              {userRole}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {/* Top Menu */}
          {topMenuItems.map(renderMenuItem)}

          {/* Divider */}
          <div className="my-6 px-4">
            <div className="h-px w-full bg-[#24428B]"></div>
          </div>

          {/* Bottom Menu */}
          {bottomMenuItems.map(renderMenuItem)}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto px-4 pb-8 space-y-4">
          <button
            onClick={() => navigate('/admin/bantuan')}
            className={`w-full flex justify-center items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
              isActive('/admin/bantuan')
                ? 'bg-[#FF7A00] hover:bg-[#e66e00] shadow-lg shadow-orange-500/30'
                : 'bg-[#1C3A86] hover:bg-[#24428B]'
            }`}
          >
            <span>Bantuan Sistem</span>
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 px-4 py-2 text-sm font-semibold text-[#6F8BCE] hover:text-white transition-all duration-200"
          >
            <MdOutlineLogout size={20} className="rotate-180" />
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