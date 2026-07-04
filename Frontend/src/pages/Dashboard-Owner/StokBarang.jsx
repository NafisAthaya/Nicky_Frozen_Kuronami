import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';

export default function StokBarang() {
  // State Utama
  const [stockData, setStockData] = useState([]); // Data asli dari API
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Filter Tabel
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State Metrik
  const [metrics, setMetrics] = useState({
    totalQty: 0,
    expiringCount: 0,
    potentialLoss: 0
  });

  // State Modal & Diskon
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountPercent, setDiscountPercent] = useState('');
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Helper: Format Rupiah
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper: Hitung sisa hari menuju expired
  const calculateDaysLeft = (expDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(expDate);
    const diffTime = exp - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper: Format Tanggal (3 Des 2024)
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Ambil Data dari Database
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axiosInstance.get('/owner/stok');
        const rawProduks = response.data.data;

        let tempStockData = [];
        let tempTotalQty = 0;
        let tempExpiringCount = 0;
        let tempLoss = 0;

        rawProduks.forEach((produk) => {
          tempTotalQty += Number(produk.stok_total);

          // Bongkar relasi batches menjadi baris-baris tabel
          if (produk.batches && produk.batches.length > 0) {
            produk.batches.forEach((batch) => {
              if (batch.stok > 0) {
                const daysLeft = calculateDaysLeft(batch.expired_date);
                
                // Logika Warna Status berdasarkan jarak kadaluwarsa
                let statusText = '';
                let statusColor = '';
                
                if (daysLeft < 0) {
                  statusText = 'EXPIRED';
                  statusColor = 'bg-red-100 text-red-600 border-red-200';
                } else if (daysLeft <= 3) {
                  statusText = `H-${daysLeft}`;
                  statusColor = 'bg-red-50 text-red-500 border-red-100';
                } else if (daysLeft <= 7) {
                  statusText = `H-${daysLeft}`;
                  statusColor = 'bg-orange-50 text-orange-500 border-orange-100';
                } else {
                  statusText = 'Aman';
                  statusColor = 'bg-green-50 text-green-500 border-green-100';
                }

                // Kalkulasi Metrik (Hanya hitung yang H-7 atau kurang, dan belum expired)
                if (daysLeft <= 7 && daysLeft >= 0) {
                  tempExpiringCount += 1;
                  tempLoss += (batch.stok * produk.harga_beli);
                }

                tempStockData.push({
                  id: batch.id,
                  name: produk.nama_produk,
                  category: produk.kategori,
                  sku: batch.barcode_custom,
                  stock: batch.stok,
                  expDate: formatDate(batch.expired_date),
                  originalPrice: produk.harga_jual,
                  status: statusText,
                  statusColor: statusColor,
                  diskon: 0,
                  daysLeft: daysLeft,
                  rawExpDate: batch.expired_date,
                  // Murni mengambil data path image dari database backend
                  image: produk.image_url || null, 
                });
              }
            });
          }
        });

        // Urutkan barang dari yang paling mendekati expired
        tempStockData.sort((a, b) => a.daysLeft - b.daysLeft);

        setStockData(tempStockData);
        setMetrics({
          totalQty: tempTotalQty,
          expiringCount: tempExpiringCount,
          potentialLoss: tempLoss
        });

      } catch (error) {
        console.error("Gagal mengambil stok:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();

    // Sinkronisasi Global
    const handleGlobalSync = () => fetchStock();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  // LOGIKA FILTER: Menentukan data yang ditampilkan di tabel
  const displayData = stockData.filter(item => {
    if (!startDate && !endDate) return true;
    
    let matchDate = true;
    const expDate = new Date(item.rawExpDate);
    expDate.setHours(0, 0, 0, 0);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (expDate < start) matchDate = false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      if (expDate > end) matchDate = false;
    }
    return matchDate;
  });

  // --- LOGIKA MODAL & DISKON ---
  const handleOpenDiscountModal = (product) => {
    setSelectedProduct(product);
    setDiscountPercent(product.diskon || '');
    setIsDiscountModalOpen(true);
  };

  const handleDiscountChange = (value) => {
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 100)) {
      setDiscountPercent(value);
    }
  };

  const handleActivatePromo = () => {
    if (!selectedProduct) return;
    
    // Update data lokal (UI)
    setStockData(prevData =>
      prevData.map(p =>
        p.id === selectedProduct.id
          ? { ...p, diskon: parseInt(discountPercent) || 0 }
          : p
      )
    );

    setIsDiscountModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSelectedProduct(null);
    setDiscountPercent('');
  };

  // Kalkulasi harga tercoret di modal
  const originalPrice = selectedProduct?.originalPrice || 0;
  const discountVal = parseInt(discountPercent) || 0;
  const newPrice = originalPrice * (1 - discountVal / 100);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse font-medium">Memuat data dari brankas...</div>;
  }

  return (
    <div className="animate-fadeIn w-full">
      {/* Title */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Stok Barang</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau ketersediaan stok di semua gudang</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Total Produk</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {metrics.totalQty.toLocaleString('id-ID')}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Real-time Data</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Mendekati Kadaluwarsa (H-7)</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {metrics.expiringCount} Batch
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <button className={`text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider ${metrics.expiringCount > 0 ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-green-700 bg-green-50 border border-green-200'}`}>
              Status: {metrics.expiringCount > 0 ? 'Perlu Tindakan' : 'Aman'}
            </button>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Potensi Kerugian Kadaluwarsa</p>
              <h2 className={`text-2xl font-black tracking-tight ${metrics.potentialLoss > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                {formatRupiah(metrics.potentialLoss)}
              </h2>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${metrics.potentialLoss > 0 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Dihitung dari harga beli (HPP)</span>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Daftar Stok & Kadaluwarsa</h3>
            <p className="text-xs text-slate-400 mt-0.5">Data diurutkan dari barang yang paling cepat kadaluwarsa</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                !startDate && !endDate
                  ? 'bg-[#0A2540] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua
            </button>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
              />
              <span className="text-slate-400 text-xs font-medium">s/d</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-450 text-[10px] font-black uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-4 rounded-l-xl">Produk</th>
                <th className="py-3.5 px-4">SKU / Barcode</th>
                <th className="py-3.5 px-4 text-center">Sisa Stok</th>
                <th className="py-3.5 px-4 text-center">Tanggal Kadaluwarsa</th>
                <th className="py-3.5 px-4 text-center">Diskon</th>
                <th className="py-3.5 px-4 text-center rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayData.length > 0 ? (
                displayData.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {/* Render Gambar Database Berhasil atau Kotak Inisial CSS Bersih */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-black text-slate-400 tracking-wider">
                              {item.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.category}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-mono text-slate-500">{item.sku}</td>

                    <td className="py-4 px-4 text-xs font-bold text-slate-800 text-center">{item.stock} Pcs</td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-slate-700">{item.expDate}</span>
                        <span className={`mt-1 text-[9px] font-black px-2 py-0.5 rounded-full border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {item.diskon > 0 ? (
                          <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 border border-orange-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1h1zm7-13h6m-6 3h6m-6 3h6M6 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {item.diskon}%
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleOpenDiscountModal(item)}
                            className="w-8 h-8 rounded-full border border-orange-200 text-orange-500 bg-orange-50/50 hover:bg-orange-50 flex items-center justify-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/xl" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1h1zm7-13h6m-6 3h6m-6 3h6M6 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenDiscountModal(item)}
                          className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                    {(startDate || endDate)
                      ? "Tidak ada barang dengan tanggal kadaluwarsa pada rentang tanggal tersebut." 
                      : "Stok barang kosong atau belum ada data di database."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Atur Diskon Otomatis */}
      {isDiscountModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 relative border border-slate-100 animate-scaleIn">
            <button 
              onClick={() => setIsDiscountModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-2">Atur Diskon Otomatis</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              <span className="font-bold text-slate-700">{selectedProduct.name}</span> (Sisa Stok: {selectedProduct.stock} Pcs).
              Dekati potongan harga untuk menghabiskan stok sebelum {selectedProduct.expDate}.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Diskon (%)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Contoh: 50" 
                    value={discountPercent}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-left"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">%</span>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Baru</span>
                <span className="text-xl font-black text-blue-700">{formatRupiah(newPrice)}</span>
                <span className="text-[10px] text-slate-400">
                  Terhitung otomatis dari harga asli {formatRupiah(selectedProduct.originalPrice)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsDiscountModalOpen(false)}
                className="flex-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-black py-3 rounded-2xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleActivatePromo}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black py-3 rounded-2xl shadow-lg shadow-blue-100 transition-colors"
              >
                Aktifkan Promo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Promo Berhasil Diaktifkan */}
      {isSuccessModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 text-center border border-slate-100 animate-scaleIn flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Promo Berhasil Diaktifkan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-sm">
              Diskon {discountPercent}% untuk <span className="font-bold text-slate-700">{selectedProduct.name}</span> telah aktif dan tersinkronisasi dengan sistem kasir.
            </p>
            <button 
              onClick={handleCloseSuccessModal}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-black py-3.5 rounded-2xl shadow-lg shadow-blue-100 transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}