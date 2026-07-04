import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import useAuthStore from '../../store/authStore';
import logoNicky from '../../assets/logo-nicky-frozen.jpeg';

// Simple Barcode SVG Component
const BarcodePreview = ({ code }) => {
  const bars = [];
  const seed = code || 'TRX20261105-0012';
  for (let i = 0; i < seed.length * 2; i++) {
    const charCode = seed.charCodeAt(i % seed.length);
    const isBlack = (charCode + i) % 3 !== 0;
    const width = ((charCode + i) % 2 === 0) ? 2 : 1;
    bars.push({ isBlack, width });
  }

  const totalWidth = bars.reduce((sum, bar) => sum + bar.width + 1, 0);
  const startX = Math.max(0, (140 - totalWidth) / 2);

  return (
    <svg width="140" height="35" viewBox="0 0 140 35" className="mx-auto block">
      {bars.reduce((acc, bar, i) => {
        const x = acc.x;
        acc.elements.push(
          <rect key={i} x={x} y={0} width={bar.width} height={35} fill={bar.isBlack ? '#000' : '#fff'} />
        );
        acc.x += bar.width + 1;
        return acc;
      }, { x: startX, elements: [] }).elements}
    </svg>
  );
};

const timeFilters = ['Semua Waktu', 'Shift 1 (06:00 - 10:00)', 'Shift 2 (10:00 - 14:00)', 'Shift 3 (14:00 - 18:00)', 'Shift 4 (18:00 - 22:00)'];

export default function Transaksi() {
  const [activeFilter, setActiveFilter] = useState('Semua Waktu');
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  // State untuk data API
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Struk settings dari API
  const [strukSettings, setStrukSettings] = useState({
    judul_struk: 'Nicky Frozen Food',
    alamat_struk: 'Jl. Raya Boulevard No. 12, Gading Serpong, Tangerang',
    nomor_telepon: '0812-3456-7890',
    footer_struk: 'Terima Kasih Telah Berbelanja!',
    tampilkan_logo: false,
    tampilkan_barcode: true,
    tampilkan_nama_kasir: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axiosInstance.get('/owner/pengaturan-toko');
        if (res.data && res.data.data) {
          setStrukSettings(res.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil pengaturan struk", err);
      }
    };
    loadSettings();
  }, []);

  // Ambil nama kasir dari state global
  const userName = useAuthStore((state) => state.user?.name) || 'Kasir';

  // Format Helper
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const optionsDate = { day: '2-digit', month: 'short', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    return `${date.toLocaleDateString('id-ID', optionsDate).toUpperCase()}, ${date.toLocaleTimeString('id-ID', optionsTime)}`;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get('/owner/transaksi');
        const allData = response.data.data;

        // FILTER 1: Hanya ambil transaksi hari ini
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayTransactions = allData.filter((trx) => {
          const trxDate = new Date(trx.created_at);
          trxDate.setHours(0, 0, 0, 0);
          return trxDate.getTime() === today.getTime();
        });

        // Mapping data dari Backend agar sesuai dengan struktur Modal Struk milikmu
        const formattedData = todayTransactions.map((trx) => {
          // Buat string ringkasan item (contoh: "2x Sosis Sapi, 1x Bakso")
          const itemsSummary = trx.details
            .map((d) => `${d.qty}x ${d.produk?.nama_produk || 'Produk'}`)
            .join(', ');

          // Mapping array itemList untuk dirender di dalam struk
          const itemList = trx.details.map((d) => ({
            name: d.produk?.nama_produk || 'Produk Tidak Dikenal',
            qty: d.qty,
            price: formatRupiah(d.subtotal)
          }));

          // Karena di backend kita belum buat fitur PPN, kita set 0
          return {
            id: trx.no_transaksi,
            time: formatDateTime(trx.created_at),
            rawDate: new Date(trx.created_at), // Disimpan untuk filter jam
            items: itemsSummary,
            status: trx.status.charAt(0).toUpperCase() + trx.status.slice(1),
            total: formatRupiah(trx.total_tagihan),
            subtotal: formatRupiah(trx.subtotal),
            tax: formatRupiah(trx.pajak || 0),
            rounding: formatRupiah(trx.pembulatan_donasi || 0),
            metode: trx.metode_pembayaran.toUpperCase(),
            kasir: trx.user?.name || 'Kasir',
            itemList: itemList,
          };
        });

        setTransactions(formattedData);
      } catch (error) {
        console.error("Gagal mengambil data transaksi hari ini:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();

    const handleGlobalSync = () => fetchTransactions();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, [userName]);

  // FILTER 2: Filter Jam berdasarkan Shift
  const filteredTransactions = transactions.filter((trx) => {
    if (activeFilter === 'Semua Waktu') return true;
    
    const trxHour = trx.rawDate.getHours();
    
    // Extract time from format "Shift X (06:00 - 10:00)"
    const match = activeFilter.match(/\((\d{2}):\d{2} - (\d{2}):\d{2}\)/);
    if (match) {
      const startHour = parseInt(match[1], 10);
      const endHour = parseInt(match[2], 10);
      return trxHour >= startHour && trxHour < endHour;
    }
    
    return true;
  });

  const handlePrint = () => {
    setIsPrinting(true);
    setPrintSuccess(false);
    setTimeout(() => {
      setIsPrinting(false);
      setPrintSuccess(true);
      setTimeout(() => setPrintSuccess(false), 2500);
    }, 1200);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Menyiapkan daftar transaksi hari ini...</div>;
  }

  return (
    <div className="animate-fadeIn relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Riwayat Transaksi</h1>
        <p className="text-sm text-gray-500">Daftar transaksi hari ini ({new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})</p>
      </div>

      {/* Time Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {timeFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeFilter === f
                ? 'bg-[#0A2540] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transaction Cards */}
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((trx) => (
            <div key={trx.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Icon + Details */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${trx.status === 'Berhasil' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'}`}>
                    {trx.status === 'Berhasil' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-bold text-gray-900">{trx.time}</span>
                      <span className="text-xs text-gray-400">{trx.id}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{trx.items}</p>
                    <span className={`inline-flex items-center gap-1 mt-1.5 text-xs font-medium ${trx.status === 'Berhasil' ? 'text-green-600' : 'text-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${trx.status === 'Berhasil' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {trx.status}
                    </span>
                  </div>
                </div>

                {/* Right: Total + Action */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Tagihan</p>
                    <p className={`text-xl font-bold ${trx.status === 'Berhasil' ? 'text-[#0A2540]' : 'text-red-500 line-through'}`}>{trx.total}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTrx(trx)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Cetak Ulang Struk
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 shadow-sm text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 font-medium">Belum ada transaksi di rentang waktu ini.</p>
          </div>
        )}
      </div>

      {/* Modal: Cetak Ulang Struk (Figma Design) */}
      {selectedTrx && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTrx(null)}
        >
          <div 
            className="bg-[#f8fafc] rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row animate-scaleIn relative p-8 gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button 
              onClick={() => setSelectedTrx(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full transition-colors z-10 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Left Column: Visual Paper Receipt */}
            <div className="flex-1 bg-white rounded-3xl p-6 shadow-md border border-slate-100 relative flex flex-col justify-between">
              {/* Receipt Content */}
              <div>
                {/* Header with logo & store info */}
                <div className="text-center mb-4">
                  {strukSettings.tampilkan_logo && (
                    <img src={logoNicky} alt="Logo" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2" />
                  )}
                  <h4 className="text-base font-extrabold text-[#0A2540]">{strukSettings.judul_struk}</h4>
                  {strukSettings.alamat_struk && (
                    <p className="text-[9px] text-slate-400 mt-0.5 whitespace-pre-line leading-relaxed">{strukSettings.alamat_struk}</p>
                  )}
                  {strukSettings.nomor_telepon && (
                    <p className="text-[9px] text-slate-400 mt-0.5">Telp: {strukSettings.nomor_telepon}</p>
                  )}
                </div>

                {/* Transaction info row */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2 px-1">
                  <div className="flex flex-col">
                    <span>{selectedTrx.time}</span>
                    {strukSettings.tampilkan_nama_kasir && <span>Kasir: <span className="font-bold text-slate-700">{selectedTrx.kasir}</span></span>}
                  </div>
                  <div className="text-right">
                    <span>ID: {selectedTrx.id}</span>
                  </div>
                </div>

                {/* Dashed Line */}
                <div className="border-t border-dashed border-slate-200 my-4" />

                {/* Items List */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {selectedTrx.itemList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">{item.qty}x {item.name}</span>
                      <span className="text-slate-800 font-bold">{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Dashed Line */}
                <div className="border-t border-dashed border-slate-200 my-4" />

                {/* Calculation breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>{selectedTrx.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Pajak PPN (0%)</span>
                    <span>{selectedTrx.tax}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Pembulatan</span>
                    <span>{selectedTrx.rounding}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Footer */}
              <div>
                {/* Dashed Line */}
                <div className="border-t border-dashed border-slate-200 my-4" />

                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-400">METODE: {selectedTrx.metode}</span>
                  <span className="text-[10px] font-bold text-slate-400">{selectedTrx.time}</span>
                </div>

                {strukSettings.tampilkan_barcode && (
                  <div className="flex flex-col items-center">
                    <BarcodePreview code={selectedTrx.id} />
                    <p className="text-[8px] tracking-widest text-slate-400 mt-1 uppercase">{selectedTrx.id}</p>
                  </div>
                )}
                
                {strukSettings.footer_struk && (
                  <div className="mt-4 pt-4 border-t border-dashed border-slate-200 text-center text-[10px] text-slate-500 font-medium italic">
                    {strukSettings.footer_struk}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Status & Call to Actions */}
            <div className="md:w-[360px] flex flex-col justify-between py-4">
              <div className="flex flex-col items-center text-center mt-6">
                {/* Green Check Icon */}
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                  {selectedTrx.status === 'Berhasil' ? 'Transaksi Berhasil!' : 'Transaksi Dibatalkan'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  {selectedTrx.status === 'Berhasil' ? 'Terima kasih atas transaksi Anda di Nicky Frozen.' : 'Transaksi ini telah di-void oleh sistem.'}
                </p>
              </div>

              {/* Status Info Box */}
              <div className="my-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Total Tagihan</span>
                  </div>
                  <span className={`text-base font-black ${selectedTrx.status === 'Berhasil' ? 'text-slate-800' : 'text-red-500 line-through'}`}>{selectedTrx.total}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Kasir</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">{selectedTrx.kasir}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-auto">
                <button 
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="w-full bg-[#0A2540] hover:bg-[#081e33] text-white text-sm font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isPrinting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mencetak...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Cetak Struk
                    </>
                  )}
                </button>
              </div>

              {/* Printing Status Toast inside Modal */}
              {printSuccess && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Struk berhasil dikirim ke printer!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}