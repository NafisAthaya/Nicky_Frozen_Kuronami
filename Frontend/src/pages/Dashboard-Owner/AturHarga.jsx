import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';

export default function AturHarga() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk melacak harga yang diedit (menggunakan ID produk sebagai key)
  const [prices, setPrices] = useState({});
  const [originalPrices, setOriginalPrices] = useState({});

  // State Modal & Toast
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  // Mendapatkan batch terakhir yang memiliki harga_beli > 0
  const getLatestBatch = (product) => {
    if (!product.batches || product.batches.length === 0) return null;
    const validBatches = product.batches.filter(b => Number(b.harga_beli) > 0);
    if (validBatches.length === 0) return null;
    return validBatches.sort((a, b) => b.id - a.id)[0];
  };

  // Menghitung modal per pcs dari batch terakhir, atau fallback ke harga_beli produk
  const getModalPerPcs = (product) => {
    const batch = getLatestBatch(product);
    if (batch && batch.stok > 0) {
      return Number(batch.harga_beli) / Number(batch.stok);
    }
    return Number(product.harga_beli); // fallback
  };

  // Helper Kalkulasi Gross Margin (%)
  const calculateMargin = (modal, jual) => {
    if (!jual || jual <= 0) return 0;
    return (((jual - modal) / jual) * 100).toFixed(1);
  };

  // Ambil Data Produk dari Backend
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/owner/stok');
      const rawData = response.data.data;
      
      let initialPrices = {};
      rawData.forEach(p => {
        initialPrices[p.id] = p.harga_jual;
      });

      setProducts(rawData);
      setPrices(initialPrices);
      setOriginalPrices(initialPrices);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const handleGlobalSync = () => fetchProducts();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  // --- LOGIKA SIMPAN PERUBAHAN KE DATABASE ---
  const handleSave = async () => {
    // 1. Cari produk mana saja yang harganya berubah
    const changedProducts = Object.keys(prices).filter(
      (id) => Number(prices[id]) !== Number(originalPrices[id])
    );

    if (changedProducts.length === 0) {
      setToastMessage('Belum ada harga yang diubah!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSaving(true);

    try {
      // 2. Tembak API Update secara paralel (berbarengan) menggunakan Promise.all
      const updatePromises = changedProducts.map(id => 
        axiosInstance.put(`/owner/stok/${id}`, { harga_jual: prices[id] })
      );

      await Promise.all(updatePromises);

      // 3. Jika berhasil, perbarui originalPrices agar jadi patokan baru
      setOriginalPrices({ ...prices });
      setIsSuccessOpen(true);
      
    } catch (error) {
      console.error("Gagal menyimpan harga:", error);
      setToastMessage('Terjadi kesalahan saat menyimpan data ke server.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // --- KALKULASI METRIK DINAMIS ---
  let totalUntungRendah = 0;
  let totalMargin = 0;

  products.forEach(p => {
    const currentPrice = prices[p.id] || p.harga_jual;
    const modal = getModalPerPcs(p);
    const margin = calculateMargin(modal, currentPrice);
    totalMargin += Number(margin);
    if (margin < 15) totalUntungRendah += 1; // Jika untung di bawah 15%, anggap rendah
  });

  const avgMargin = products.length > 0 ? (totalMargin / products.length).toFixed(1) : 0;

  const statsCards = [
    {
      label: 'Total Produk',
      value: products.length.toLocaleString('id-ID'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgIcon: 'bg-blue-50',
    },
    {
      label: 'Untung Rendah (<15%)',
      value: `${totalUntungRendah} Item`,
      valueColor: totalUntungRendah > 0 ? 'text-red-500' : 'text-green-500',
      border: totalUntungRendah > 0 ? 'border-red-200' : 'border-gray-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${totalUntungRendah > 0 ? 'text-red-500' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      bgIcon: totalUntungRendah > 0 ? 'bg-red-50' : 'bg-green-50',
    },
    {
      label: 'Rata-rata Untung',
      value: `${avgMargin}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgIcon: 'bg-green-50',
    },
    {
      label: 'Status Data',
      value: 'Tersinkron',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgIcon: 'bg-gray-100',
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Menarik data dari server...</div>;
  }

  return (
    <div className="animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Harga Produk</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-3 bg-[#f26f21] hover:bg-[#ff7b2b] text-white text-sm font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          {isSaving ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          )}
          {isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Ketik harga baru di kolom paling kanan. Sistem akan otomatis menghitung potensi untung Anda.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-xl border ${stat.border || 'border-gray-100'} p-5 shadow-sm flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgIcon}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.valueColor || 'text-gray-900'}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Produk</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Kategori</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Biaya Sekali Stok</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Jumlah Masuk</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Potensi Untung Baru</th>
                <th className="text-right text-xs font-semibold text-gray-900 uppercase tracking-wider px-6 py-3 font-bold">Harga Jual (Edit)</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => {
                  const currentInputPrice = prices[product.id] || 0;
                  const modalPerPcs = getModalPerPcs(product);
                  const currentMargin = calculateMargin(modalPerPcs, currentInputPrice);
                  const isMarginLow = currentMargin < 15;
                  
                  const latestBatch = getLatestBatch(product);
                  const displayTotalBiaya = latestBatch ? Number(latestBatch.harga_beli) : Number(product.harga_beli);
                  const displayStok = latestBatch ? latestBatch.stok : "-";

                  return (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F0F4FF] flex items-center justify-center overflow-hidden shrink-0 border border-[#D1DEFA]">
                            <span className="text-xs font-bold text-[#082B7A] tracking-wider">
                              {(() => {
                                const name = product.nama_produk || '';
                                const words = name.trim().split(/\s+/);
                                if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
                                return name.substring(0, 2).toUpperCase();
                              })()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{product.nama_produk}</p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 uppercase tracking-wider">
                          {product.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 text-right font-medium">
                        {formatRupiah(displayTotalBiaya)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 text-center font-bold">
                        {displayStok} <span className="text-[10px] text-gray-400 font-normal">pcs</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${isMarginLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {currentMargin}%
                          </span>
                          <span className="text-[9px] text-gray-500 font-bold mt-1.5">
                            Untung: Rp {formatRupiah(currentInputPrice - modalPerPcs).replace('Rp', '').trim()} /pcs
                          </span>
                          {isMarginLow && (
                            <span className="text-[9px] text-red-500 font-bold mt-0.5 tracking-wider uppercase">Untung Kecil</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-400 font-bold">Rp</span>
                          <input
                            type="number"
                            min="0"
                            value={prices[product.id]}
                            onChange={(e) => setPrices({ ...prices, [product.id]: e.target.value })}
                            className={`w-28 px-3 py-2 text-sm font-bold text-right border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                              Number(prices[product.id]) !== Number(originalPrices[product.id])
                                ? 'border-orange-400 bg-orange-50 focus:ring-orange-200 text-orange-700'
                                : 'border-gray-200 focus:ring-blue-100 focus:border-blue-300 text-gray-700'
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 text-sm">
                    Belum ada produk di database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Warning Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-red-500 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 border border-red-400 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Modal: Perubahan Berhasil Disimpan */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-6 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Perubahan Berhasil Disimpan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">
              Harga produk telah berhasil diperbarui ke database dan langsung aktif di kasir.
            </p>
            <button 
              onClick={() => setIsSuccessOpen(false)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}