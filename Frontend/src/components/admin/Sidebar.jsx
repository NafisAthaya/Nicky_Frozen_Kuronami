import { useLocation, useNavigate } from 'react-router-dom';
import ownerProfile from '../../assets/OwnerProfile.png';
import { useState } from 'react';

const menuItems = [
  { id: 'beranda', label: 'Beranda', path: '/admin' },
  { id: 'stok', label: 'Stok Barang', path: '/admin/stok-barang' },
  { id: 'kategori', label: 'Kategori Item', path: '/admin/kategori-item' },
  { id: 'barangmasuk', label: 'Barang Masuk', path: '/admin/barang-masuk' },
  { id: 'pengajuan', label: 'Pengajuan Stok', path: '/admin/pengajuan-stok' },
  { id: 'profil', label: 'Profil', path: '/admin/profil' },
  { id: 'pengaturan', label: 'Pengaturan', path: '/admin/pengaturan' },
  { id: 'bantuan', label: 'Bantuan', path: '/admin/bantuan' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'Nicky Admin';

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }

    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const renderMenuItem = (item) => {
    const active = isActive(item.path);

    return (
      <button
        key={item.id}
        onClick={() => navigate(item.path)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left
          transition-all duration-200
          ${
            active
              ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-500/30'
              : 'text-blue-100 hover:bg-white/10 hover:text-white'
          }
        `}
      >
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#082B7A] flex flex-col z-50">
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Nicky Frozen
        </h1>
      </div>

      <div className="px-6 py-4 flex items-center gap-3 border-b border-[#5A7AC9]">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={ownerProfile}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-white text-sm font-semibold">
            Halo, {userName}
          </p>
          <span className="text-[10px] text-blue-300 font-bold uppercase">
            ADMIN
          </span>
        </div>
      </div>

      <nav className="flex-1 px-6 pt-5 space-y-2 overflow-y-auto">
        {menuItems.map(renderMenuItem)}
      </nav>

      <div className="mt-auto px-6 pb-8">
        <button
          onClick={() => setShowLogoutPopup(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
        >
          <span>Keluar</span>
        </button>
      </div>
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">

            <h2 className="text-2xl font-bold text-[#082B7A] mb-3">
              Keluar Sistem
            </h2>

            <p className="text-gray-600 mb-8">
              Apakah Anda yakin ingin keluar dari dashboard kasir?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Keluar
              </button>

            </div>
          </div>
        </div>
      )}
    </aside>
  );
}