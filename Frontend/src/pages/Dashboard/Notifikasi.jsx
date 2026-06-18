import { useState } from 'react';

const notifications = [
  {
    id: 1,
    type: 'danger',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Lupa Kata Sandi: Kasir Budi',
    description: 'Permintaan pemulihan kata sandi untuk akun KSR-002 (Budi). Segera lakukan reset melalui menu Kelola Pengguna.',
    time: 'Baru saja',
    actions: [
      { label: 'Reset Sekarang', variant: 'primary' },
      { label: 'Abaikan', variant: 'outline' },
    ],
  },
  {
    id: 2,
    type: 'warning',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    title: 'Stok Kritis: Bakso Sapi Super',
    description: 'Sisa stok di gudang utama kurang dari 5 pack. Segera lakukan pemesanan ulang ke supplier.',
    time: '10 menit yang lalu',
    actions: [
      { label: 'Lihat Inventori', variant: 'primary' },
    ],
  },
  {
    id: 3,
    type: 'info',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Pengajuan Restock Baru',
    description: 'Cabang Sudirman mengajukan restock 50 pack Nugget Ayam dan 20 pack Sosis Sapi.',
    time: '1 jam yang lalu',
    actions: [
      { label: 'Konfirmasi', variant: 'primary' },
      { label: 'Tolak', variant: 'outline' },
    ],
  },
  {
    id: 4,
    type: 'success',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: 'Shift Berhasil Ditutup',
    description: 'Shift pagi Cabang Seturan berhasil ditutup oleh Kasir Siti. Total penjualan: Rp 3.450.000.',
    time: '3 jam yang lalu',
    actions: [],
  },
  {
    id: 5,
    type: 'info',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Update Harga Supplier',
    description: 'Supplier PT. Sumber Laut mengirim update harga terbaru untuk 15 produk seafood.',
    time: '5 jam yang lalu',
    actions: [
      { label: 'Lihat Perubahan', variant: 'primary' },
    ],
  },
];

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

export default function Notifikasi() {
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState(notifications);

  const handleMarkAllRead = () => {
    // Simulasi tandai semua dibaca
  };

  const filteredItems = items.filter((n) =>
    n.title.toLowerCase().includes(filter.toLowerCase()) ||
    n.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="animate-fadeIn p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
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
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-all"
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
        <h2 className="text-lg font-semibold text-gray-700 mb-1">Hari Ini</h2>
        <div className="h-px bg-gray-200" />
      </div>

      {/* Notification Cards */}
      <div className="space-y-4">
        {filteredItems.map((notif) => (
          <div
            key={notif.id}
            className={`
              bg-white rounded-xl border border-gray-100 border-l-4 ${borderColors[notif.type]}
              p-5 shadow-sm hover:shadow-md transition-all duration-200
            `}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBgs[notif.type]}`}>
                {notif.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{notif.title}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{notif.description}</p>

                {/* Actions */}
                {notif.actions.length > 0 && (
                  <div className="flex items-center gap-2">
                    {notif.actions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`
                          px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200
                          ${action.variant === 'primary'
                            ? 'bg-[#0A2540] text-white hover:bg-[#0d2f52] shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
