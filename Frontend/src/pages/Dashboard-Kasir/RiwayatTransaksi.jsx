import { useState, useEffect } from 'react';
import { HiOutlineDocumentText, HiOutlinePrinter } from 'react-icons/hi';
import PopupStruk from './PopupStruk';
import axiosInstance from '../../api/axios';

// Dynamic filters will be generated inside the component

export default function RiwayatTransaksi({ transactions }) {
  const [activeFilter, setActiveFilter] = useState('Semua Waktu');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionsData, setTransactionsData] = useState([]);

  const shiftName = localStorage.getItem('shift') || '';
  
  let timeFilters = ['Semua Waktu'];
  if (shiftName.includes('Shift 1')) {
    timeFilters.push('06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00');
  } else if (shiftName.includes('Shift 2')) {
    timeFilters.push('10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00');
  } else if (shiftName.includes('Shift 3')) {
    timeFilters.push('14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00');
  } else if (shiftName.includes('Shift 4')) {
    timeFilters.push('18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00');
  } else {
    timeFilters = [
      'Semua Waktu',
      '06:00 - 08:00',
      '08:00 - 10:00',
      '10:00 - 12:00',
      '12:00 - 14:00',
      '14:00 - 16:00',
      '16:00 - 18:00',
      '18:00 - 20:00',
      '20:00 - 22:00',
    ];
  }

  useEffect(() => {
    const loadData = () => {
      axiosInstance.get('/kasir/transaksi')
        .then((res) => {
          const data = res.data.data || res.data;
          const mapped = Array.isArray(data) ? data.map((trx) => ({
            id: trx.no_transaksi,
            time: new Date(trx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            items: trx.details.map((d) => `${d.qty}x ${d.produk?.nama_produk || 'Produk'}`).join(', '),
            status: trx.status,
            total: Number(trx.total_tagihan),
            rawItems: trx.details.map((d) => ({
              id: d.id,
              name: d.produk?.nama_produk || 'Produk',
              quantity: Number(d.qty),
              price: Number(d.harga_satuan),
            })),
            subtotal: Number(trx.subtotal),
            paymentMethod: trx.metode_pembayaran,
          })) : [];
          setTransactionsData(mapped);
        })
        .catch(console.error);
    };

    loadData();

    const handleGlobalSync = () => loadData();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sourceTransactions = transactionsData;

  // Note 9: Filter transactions by time range
  const displayTransactions = sourceTransactions.filter((trx) => {
    if (activeFilter === 'Semua Waktu') return true;

    const [startStr, endStr] = activeFilter.split(' - ');
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const rawTime = String(trx.time).replace(/\./g, ':');
    const [trxH, trxM] = rawTime.split(':').map(Number);
    const trxMinutes = trxH * 60 + (trxM || 0);

    return trxMinutes >= startMinutes && trxMinutes < endMinutes;
  });

  return (
    <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
  Riwayat Transaksi
</h2>
        <p className="text-sm text-gray-500">
  Daftar transaksi hari ini
</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {timeFilters.map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition
${
  activeFilter === filter
    ? 'bg-[#082B7A] text-white border-[#082B7A]'
    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {displayTransactions.length === 0 ? (
        <div className="riwayat-empty" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <HiOutlineDocumentText className="text-6xl mb-4 opacity-50" />
          <p className="text-lg font-medium">Belum ada transaksi</p>
          <p className="text-sm mt-2">Transaksi yang Anda lakukan akan muncul di sini.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayTransactions.map((trx, index) => (
            <div
  key={index}
  className="flex items-center gap-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#082B7A] text-2xl shrink-0">
                <HiOutlineDocumentText className="trx-icon" />
              </div>

              <div className="flex flex-col min-w-[120px]">
                <div>
                  <strong className="block text-sm text-gray-900 mb-1">{trx.time} WIB</strong>
                  <span className="text-xs text-gray-500">{trx.id}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <p className="text-sm text-gray-900">{trx.items}</p>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-[#082B7A] text-xs font-semibold w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#082B7A]"></span>
                  {trx.status}
                </span>
              </div>

              <div className="flex flex-col items-end min-w-[140px]">
                <span className="text-xs text-gray-500 mb-1">Total Tagihan</span>
                <strong className="text-lg font-bold text-gray-900">{formatCurrency(trx.total)}</strong>
              </div>

              <div className="flex justify-end min-w-[170px]">
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-[#082B7A] text-[#082B7A] hover:bg-[#082B7A] hover:text-white rounded-xl text-sm font-semibold transition-colors" 
                  onClick={() => setSelectedTransaction(trx)}
                >
                  <HiOutlinePrinter className="text-lg" />
                  Cetak Ulang Struk
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTransaction && (
        <PopupStruk
          onClose={() => setSelectedTransaction(null)}
          transactionId={selectedTransaction.id}
          items={selectedTransaction.rawItems || []}
          subtotal={selectedTransaction.subtotal || 0}
          tax={selectedTransaction.tax || 0}
          donasi={selectedTransaction.donasi || 0}
          total={selectedTransaction.total}
          paymentMethod={selectedTransaction.paymentMethod || 'tunai'}
          paymentDetail={selectedTransaction.paymentDetail || {}}
        />
      )}
    </div>
  );
}
