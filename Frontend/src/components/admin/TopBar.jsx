import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ownerProfile from '../../assets/OwnerProfile.png';

export default function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    navigate('/admin/notifikasi');
  };

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
            placeholder="Cari performa..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#D9DCE7] rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
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
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Dropdown Notifikasi */}
        {showNotifications && (
          <div className="absolute right-36 top-14 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl p-4 z-50 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-800">Notifikasi</span>
              <button 
                onClick={handleViewAll}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Lihat
              </button>
            </div>
            <div className="h-px bg-gray-100 mb-3" />
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* Item 1 */}
              <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer" onClick={handleViewAll}>
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-800">Pengajuan Dana Disetujui</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">
                    Pengajuan dana operasional untuk perbaikan freezer telah disetujui oleh Owner.
                  </p>
                  <span className="text-[9px] text-gray-400 block mt-1">10 menit yang lalu</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer" onClick={handleViewAll}>
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-800">Pengajuan Restok Diperbarui</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">
                    Pengajuan restok 50kg Sosis Bratwurst dari Cabang Utama telah diubah statusnya menjadi Dikirim.
                  </p>
                  <span className="text-[9px] text-gray-400 block mt-1">Hari ini, 09:00 AM</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer" onClick={handleViewAll}>
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-800">Pengajuan Void Ditolak</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">
                    Permintaan pembatalan transaksi #TRX-002 ditolak karena alasan tidak lengkap.
                  </p>
                  <span className="text-[9px] text-gray-400 block mt-1">Kemarin</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh */}
        <button className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* WiFi */}
        <button className="w-11 h-11 flex items-center justify-center rounded-xl text-green-500 hover:bg-gray-100 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-10 bg-[#D9DCE7] mx-2" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-[#0B3B91]">
            {userName}
          </p>
          <p className="text-xs text-slate-500 capitalize">
            {userRole}
          </p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
          <img
            src={ownerProfile}
            alt="Owner"
            className="w-full h-full object-cover"
          />
        </div>
        </div>
      </div>
    </header>
  );
}
