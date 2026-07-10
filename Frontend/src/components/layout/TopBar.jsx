import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import ownerProfile from '../../assets/OwnerProfile.png';
import useAuthStore from '../../store/authStore';

// Helper Format Waktu Relatif (Contoh: "10 menit yang lalu")
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

// Helper Ikon dan Warna Notifikasi
const getNotifStyle = (type) => {
  switch (type) {
    case 'danger':
      return {
        bg: 'bg-red-100 text-red-600',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      };
    case 'warning':
      return {
        bg: 'bg-amber-100 text-amber-600',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
      };
    case 'success':
      return {
        bg: 'bg-green-100 text-green-600',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      };
    case 'info':
    case 'pengajuan_stok':
    default: // pending / menunggu
      return {
        bg: 'bg-blue-100 text-blue-600',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      };
  }
};

export default function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Ambil data user dari Zustand
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || 'owner';
  const userName = user?.name || 'Loading...';
  
  const userAvatar = user?.foto 
    ? `http://127.0.0.1:8000/storage/${user.foto}`
    : (userRole === 'owner' 
      ? ownerProfile 
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff&bold=true&size=40`);

  // Fetch Notifikasi dari Backend
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifikasi');
      setNotifications(response.data.data);
      window.dispatchEvent(new CustomEvent('topbar-notifications-fetched', { detail: response.data.data }));
    } catch (error) {
      console.error("Gagal mengambil notifikasi topbar:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Auto-refresh notifikasi setiap 30 detik agar selalu up-to-date
    const interval = setInterval(() => {
      fetchNotifications();
    }, 3000);

    // Listen for custom event to force refresh (e.g. from Notifikasi page)
    const handleForceRefresh = () => fetchNotifications();
    window.addEventListener('notifikasi-updated', handleForceRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notifikasi-updated', handleForceRefresh);
    };
  }, []);

  // Handle klik di luar dropdown notifikasi
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleViewAll = () => {
    setShowNotifications(false);
    navigate(`/${userRole}/notifikasi`);
  };

  // Handle Search Input (Tekan Enter)
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      // Lempar ke halaman stok barang dan bawa query pencarian
      navigate(`/dashboard/stok-barang?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Kosongkan input setelah mencari
    }
  };

  // Hanya tampilkan 5 notifikasi terbaru di dropdown
  const topNotifications = notifications.slice(0, 5);
  const hasUnread = notifications.length > 0;

  return (
    <header className="topbar relative sticky top-0 z-40 h-20 bg-[#F6F7FB] border-b border-[#E5E7EB] flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <div className="relative w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari barang atau performa (Tekan Enter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#D9DCE7] rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        
        {/* Notification Bell */}
        <button 
          onClick={handleNotificationClick}
          className="relative w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Badge menyala jika ada notif */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#F6F7FB] shadow-sm animate-bounce">
              {notifications.length > 99 ? '99+' : notifications.length}
            </span>
          )}
        </button>

        {/* Dropdown Notifikasi */}
        {showNotifications && (
          <div className="absolute right-36 top-14 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl p-4 z-50 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-800">Notifikasi Baru</span>
              <button 
                onClick={handleViewAll}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Lihat Semua
              </button>
            </div>
            <div className="h-px bg-gray-100 mb-3" />
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {topNotifications.length > 0 ? topNotifications.map((notif) => {
                const style = getNotifStyle(notif.type);
                return (
                  <div 
                    key={notif.id} 
                    className="flex gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer" 
                    onClick={async () => {
                      try {
                        await axiosInstance.patch(`/notifikasi/${notif.id}/read`);
                        fetchNotifications();
                        setShowNotifications(false);
                        
                        if (notif.title === 'Permintaan Reset Password' && userRole === 'owner') {
                          const emailMatch = notif.description.match(/\[email:(.+?)\]/);
                          if (emailMatch && emailMatch[1]) {
                            navigate(`/owner/profil?tab=karyawan&edit_email=${encodeURIComponent(emailMatch[1])}`);
                            return;
                          }
                        }
                        
                        // Default fallback
                        navigate(`/${userRole}/notifikasi`);
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${style.bg}`}>
                      {style.icon}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{notif.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-normal line-clamp-2">
                        {notif.description}
                      </p>
                      <span className="text-[9px] text-gray-400 block mt-1">{getRelativeTime(notif.created_at)}</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-gray-400 font-medium">Tidak ada notifikasi baru.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sinkronisasi Global */}
        <button 
          onClick={async () => {
            if (isSyncing) return;
            setIsSyncing(true);
            // Dispatch event global agar semua halaman/komponen me-refresh datanya
            window.dispatchEvent(new Event('global-sync'));
            // Refresh notifikasi TopBar juga
            await fetchNotifications();
            // Tampilkan toast sinkronisasi
            setSyncToast(true);
            setTimeout(() => {
              setIsSyncing(false);
              setSyncToast(false);
            }, 2000);
          }}
          className={`w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all ${isSyncing ? 'pointer-events-none' : ''}`}
          title="Sinkronisasi Data"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-700 ${isSyncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* WiFi Indicator */}
        <button className="w-11 h-11 flex items-center justify-center rounded-xl text-green-500 hover:bg-gray-100 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-10 bg-[#D9DCE7] mx-2" />

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(userRole === 'owner' ? '/owner/profil' : '/admin/profil')}>
          <div className="text-right">
            <p className="text-sm font-bold text-[#0B3B91] capitalize">
              {userName}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {userRole}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-blue-100 flex items-center justify-center">
            <img
              src={userAvatar}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Toast Sinkronisasi */}
      {syncToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-fadeIn">
          <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-semibold">Data berhasil disinkronkan!</span>
          </div>
        </div>
      )}
    </header>
  );
}