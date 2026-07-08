import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const borderColors = {
  danger: 'border-l-red-500',
  warning: 'border-l-orange-500',
  info: 'border-l-yellow-500',
  success: 'border-l-green-500',
};

const iconBgs = {
  danger: 'bg-red-100 text-red-600',
  warning: 'bg-orange-100 text-orange-600',
  info: 'bg-yellow-100 text-yellow-600',
  success: 'bg-green-100 text-green-600',
};

// Helper untuk merender SVG Ikon berdasarkan tipe notifikasi
const renderIcon = (type) => {
  switch (type) {
    case 'danger':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    case 'warning':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    case 'success':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
    default: // info
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

// Helper Format Waktu (Contoh: "24 Okt 2026, 14:30")
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

export default function Notifikasi() {
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // Tarik Data dari Database
  useEffect(() => {
    const fetchNotifikasi = async () => {
      try {
        const response = await axiosInstance.get('/notifikasi');
        setItems(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifikasi();

    const handleSync = (e) => {
      setItems(e.detail);
    };
    const handleGlobalSync = () => fetchNotifikasi();
    
    window.addEventListener('topbar-notifications-fetched', handleSync);
    window.addEventListener('global-sync', handleGlobalSync);

    return () => {
      window.removeEventListener('topbar-notifications-fetched', handleSync);
      window.removeEventListener('global-sync', handleGlobalSync);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.post('/notifikasi/read-all');
      setItems([]); // Kosongkan daftar karena semua sudah dibaca
      window.dispatchEvent(new Event('notifikasi-updated')); // Memicu TopBar untuk sinkronisasi
    } catch (error) {
      console.error("Gagal menandai notifikasi:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifikasi/${id}/read`);
      setItems(items.filter(n => n.id !== id));
      window.dispatchEvent(new Event('notifikasi-updated')); // Memicu TopBar untuk sinkronisasi
    } catch (error) {
      console.error("Gagal menandai notifikasi:", error);
    }
  };

  const filteredItems = items.filter((n) =>
    n.title.toLowerCase().includes(filter.toLowerCase()) ||
    n.description.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse font-medium">Memuat notifikasi...</div>;
  }

  return (
    <div className="animate-fadeIn w-full pb-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <input
              type="text"
              placeholder="Filter notifikasi..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all w-56"
            />
          </div>

          {/* Mark All Read */}
          <button
            onClick={handleMarkAllRead}
            disabled={items.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tandai Semua Dibaca
          </button>
        </div>
      </div>

      {/* Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-1">Belum Dibaca ({filteredItems.length})</h2>
        <div className="h-px bg-gray-200" />
      </div>

      {/* Notification Cards */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? filteredItems.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleMarkAsRead(notif.id)}
            className={`bg-white rounded-xl border border-gray-100 border-l-4 ${borderColors[notif.type] || borderColors.info} p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBgs[notif.type] || iconBgs.info}`}>
                {renderIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{notif.title}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(notif.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{notif.description}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-500 font-medium text-sm">Belum ada notifikasi baru saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}