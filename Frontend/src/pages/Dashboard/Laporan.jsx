import { useState } from 'react';

const summaryCards = [
  {
    label: 'Total Penjualan Kotor',
    value: 'Rp 12.450.000',
    sub: '+15% dari kemarin',
    subColor: 'text-green-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: 'Total Pembatalan',
    value: 'Rp 320.000',
    valueColor: 'text-red-500',
    sub: '3 Transaksi dibatalkan',
    subColor: 'text-gray-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
  },
  {
    label: 'Kas Akhir (Tunai)',
    value: 'Rp 4.150.000',
    valueColor: 'text-green-600',
    sub: 'Belum termasuk EDC/QRIS',
    subColor: 'text-gray-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const transactions = [
  { time: '14:32', struk: '#TRX-0921', kasir: 'Budi S.', metode: 'QRIS', total: 'Rp 245.000', status: 'Berhasil' },
  { time: '14:15', struk: '#TRX-0920', kasir: 'Budi S.', metode: 'Tunai', total: 'Rp 120.000', status: 'Dibatalkan' },
  { time: '13:50', struk: '#TRX-0919', kasir: 'Siti A.', metode: 'Kartu Debit', total: 'Rp 850.000', status: 'Berhasil' },
  { time: '13:22', struk: '#TRX-0918', kasir: 'Budi S.', metode: 'Tunai', total: 'Rp 175.000', status: 'Berhasil' },
  { time: '12:45', struk: '#TRX-0917', kasir: 'Siti A.', metode: 'QRIS', total: 'Rp 320.000', status: 'Berhasil' },
  { time: '12:10', struk: '#TRX-0916', kasir: 'Budi S.', metode: 'Tunai', total: 'Rp 95.000', status: 'Dibatalkan' },
  { time: '11:30', struk: '#TRX-0915', kasir: 'Siti A.', metode: 'Kartu Debit', total: 'Rp 1.250.000', status: 'Berhasil' },
];

const statusFilters = ['Semua', 'Berhasil', 'Dibatalkan'];

export default function Laporan() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportSuccess, setIsExportSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExportSuccess(true);
    }, 1500);
  };

  const filteredTrx = activeFilter === 'Semua'
    ? transactions
    : transactions.filter(t => t.status === activeFilter);


  return (
    <div className="animate-fadeIn">
      {/* Date & Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Selasa, 24 Oktober 2023</p>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Detail Transaksi - Hari Ini</h1>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-3 bg-[#0A2540] text-white text-sm font-semibold rounded-xl hover:bg-[#0d2f52] transition-all shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
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
              Ekspor Laporan
            </>
          )}
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Filter Status:</span>
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Waktu</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">No. Struk</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Kasir</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Metode Pembayaran</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrx.map((trx, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{trx.time}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-700">{trx.struk}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{trx.kasir}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{trx.metode}</td>
                  <td className={`px-6 py-4 text-sm font-semibold text-right ${trx.status === 'Dibatalkan' ? 'text-red-500 line-through' : 'text-gray-900'}`}>{trx.total}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      trx.status === 'Berhasil'
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-red-50 text-red-500 border border-red-200'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal: Ekspor Berhasil */}
      {isExportSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 text-center border border-slate-100 animate-scaleIn flex flex-col items-center">
            {/* Green Check Icon */}
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 mb-2">Laporan Berhasil Diekspor</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-sm">
              Berkas PDF/Excel laporan transaksi hari ini telah berhasil diunduh ke perangkat Anda.
            </p>

            {/* Button */}
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

