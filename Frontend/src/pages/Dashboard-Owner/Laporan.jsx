import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';

const statusFilters = ['Semua', 'Berhasil', 'Dibatalkan'];

export default function Laporan() {
  // State Data dari Backend
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Filter
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State Modal/Loading Export
  const [isExporting, setIsExporting] = useState(false);
  const [isExportSuccess, setIsExportSuccess] = useState(false);

  // Ambil Data dari API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get('/owner/laporan');
        const data = response.data.data || response.data;
        setTransactions(data || []);
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();

    const handleGlobalSync = () => fetchTransactions();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  // Format Helper
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateLabel = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // LOGIKA FILTER (Status & Rentang Tanggal)
  const filteredTrx = transactions.filter((trx) => {
    // 1. Filter Status
    // Data dari laravel biasanya huruf kecil (berhasil/gagal), kita pastikan cocok
    const matchStatus = activeFilter === 'Semua' 
      ? true 
      : (activeFilter === 'Berhasil' && trx.status.toLowerCase() === 'berhasil') || 
        (activeFilter === 'Dibatalkan' && (trx.status.toLowerCase() === 'dibatalkan' || trx.status.toLowerCase() === 'gagal'));

    // 2. Filter Tanggal
    let matchDate = true;
    const trxDate = new Date(trx.created_at);
    trxDate.setHours(0, 0, 0, 0); // Reset jam agar hitungan akurat

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (trxDate < start) matchDate = false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      if (trxDate > end) matchDate = false;
    }

    return matchStatus && matchDate;
  });

  // LOGIKA KALKULASI SUMMARY CARDS BERDASARKAN FILTER
  const totalKasMasuk = filteredTrx
    .filter(trx => trx.status.toLowerCase() === 'berhasil')
    .reduce((sum, trx) => sum + Number(trx.total_tagihan), 0);

  const totalPembatalan = filteredTrx
    .filter(trx => trx.status.toLowerCase() === 'dibatalkan' || trx.status.toLowerCase() === 'gagal')
    .reduce((sum, trx) => sum + Number(trx.total_tagihan), 0);

  const jumlahTransaksiBerhasil = filteredTrx
    .filter(trx => trx.status.toLowerCase() === 'berhasil')
    .length;

  const summaryCards = [
    {
      label: 'Total Kas Masuk (Semua Metode)',
      value: formatRupiah(totalKasMasuk),
      sub: 'Dana bersih yang diterima',
      subColor: 'text-green-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Pembatalan / Void',
      value: formatRupiah(totalPembatalan),
      valueColor: 'text-red-500',
      sub: 'Transaksi gagal/batal',
      subColor: 'text-gray-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
    },
    {
      label: 'Jumlah Transaksi Sukses',
      value: `${jumlahTransaksiBerhasil} Nota`,
      valueColor: 'text-blue-600',
      sub: 'Sesuai rentang tanggal dipilih',
      subColor: 'text-gray-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  // LOGIKA EKSPOR CSV (EXCEL) OTOMATIS
  const handleExport = () => {
    setIsExporting(true);

    // 1. Buat Header Kolom Excel
    const headers = ['Tanggal', 'Waktu', 'No. Struk', 'Kasir', 'Metode Pembayaran', 'Total Tagihan', 'Status'];
    
    // 2. Petakan data ke format baris
    const csvRows = filteredTrx.map(trx => {
      const tanggal = new Date(trx.created_at).toLocaleDateString('id-ID');
      const waktu = formatTime(trx.created_at);
      const kasir = trx.user?.name || 'Kasir'; // Fallback aman jika data user tidak diload
      const metode = trx.metode_pembayaran;
      const total = trx.total_tagihan;
      const status = trx.status.toUpperCase();
      
      return `${tanggal},${waktu},${trx.no_transaksi},${kasir},${metode},${total},${status}`;
    });

    // 3. Gabungkan jadi file teks utuh
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // 4. Buat file virtual di browser
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // 5. Trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Transaksi_Kuronami_${new Date().toLocaleDateString('id-ID')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Selesai
    setTimeout(() => {
      setIsExporting(false);
      setIsExportSuccess(true);
    }, 1000);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Menarik data dari buku kas...</div>;
  }

  return (
    <div className="animate-fadeIn">
      {/* Date & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {startDate || endDate 
              ? `Filter: ${startDate ? formatDateLabel(startDate) : 'Awal'} s/d ${endDate ? formatDateLabel(endDate) : 'Sekarang'}` 
              : `Hari Ini: ${formatDateLabel(new Date())}`
            }
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Detail Transaksi</h1>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting || filteredTrx.length === 0}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0A2540] text-white text-sm font-semibold rounded-xl hover:bg-[#0d2f52] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengekspor...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Ekspor Excel (CSV)
            </>
          )}
        </button>
      </div>

      {/* Summary Cards (Kalkulasi Dinamis) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              {card.icon}
              <span className="text-sm text-gray-500 font-medium">{card.label}</span>
            </div>
            <p className={`text-3xl font-bold ${card.valueColor || 'text-gray-900'}`}>
              {card.value}
            </p>
            {card.sub && (
              <p className={`text-xs mt-2 ${card.subColor}`}>
                {card.subColor === 'text-green-600' && (
                  <span className="inline-flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {card.sub}
                  </span>
                )}
                {card.subColor !== 'text-green-600' && card.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Filter Row */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-gray-100 gap-4">
          {/* Status Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <div className="flex gap-2">
              {statusFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    activeFilter === f
                      ? 'bg-[#0A2540] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Tanggal:</span>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {(startDate || endDate) && (
                <button 
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium ml-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Waktu</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">No. Struk</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Kasir</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Metode</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Total</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrx.length > 0 ? (
                filteredTrx.map((trx) => {
                  const isBerhasil = trx.status.toLowerCase() === 'berhasil';
                  return (
                    <tr key={trx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDateLabel(trx.created_at)} <span className="text-gray-400 ml-1">{formatTime(trx.created_at)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-700">{trx.no_transaksi}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{trx.user?.name || 'Kasir'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 uppercase">{trx.metode_pembayaran}</td>
                      <td className={`px-6 py-4 text-sm font-semibold text-right ${!isBerhasil ? 'text-red-500 line-through' : 'text-gray-900'}`}>
                        {formatRupiah(trx.total_tagihan)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
                          isBerhasil
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-red-50 text-red-500 border border-red-200'
                        }`}>
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 text-sm">
                    Tidak ada transaksi yang ditemukan untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Ekspor Berhasil */}
      {isExportSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 text-center border border-slate-100 animate-scaleIn flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Laporan Berhasil Diekspor</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-sm">
              Berkas CSV laporan transaksi telah berhasil diunduh ke perangkat Anda. Silakan buka menggunakan Microsoft Excel atau Google Sheets.
            </p>
            <button 
              onClick={() => setIsExportSuccess(false)}
              className="w-full bg-[#0A2540] hover:bg-[#0d2f52] text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}