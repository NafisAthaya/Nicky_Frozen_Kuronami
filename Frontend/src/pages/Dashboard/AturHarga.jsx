import { useState } from 'react';

const statsCards = [
  {
    label: 'Total Produk',
    value: '1,284',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    bgIcon: 'bg-blue-50',
  },
  {
    label: 'Untung Rendah',
    value: '12 Item',
    valueColor: 'text-red-500',
    border: 'border-red-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    bgIcon: 'bg-red-50',
  },
  {
    label: 'Rata-rata Untung',
    value: '24.5%',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    bgIcon: 'bg-green-50',
  },
  {
    label: 'Terakhir Update',
    value: '09:41',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgIcon: 'bg-gray-100',
  },
];

const products = [
  {
    name: 'Salmon Fillet Premium 500g',
    category: 'SEAFOOD',
    catColor: 'bg-blue-100 text-blue-700',
    sku: 'SEA-SAL-001',
    hargaBeli: 'Rp 85.000',
    hargaJual: 'Rp 115.000',
    untung: '26.1%',
    untungColor: 'bg-green-100 text-green-700',
    hargaBaru: 'Rp 130.000',
    image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a972?w=60&h=60&fit=crop&q=80',
  },
  {
    name: 'Beef Wagyu Slice A5 250g',
    category: 'DAGING',
    catColor: 'bg-red-100 text-red-700',
    sku: 'BEEF-WAG-05',
    hargaBeli: 'Rp 210.000',
    hargaJual: 'Rp 235.000',
    untung: '10.6%',
    untungColor: 'bg-red-100 text-red-600',
    untungWarn: 'Untung Terlalu Kecil',
    hargaBaru: 'Rp 250.000',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=60&h=60&fit=crop&q=80',
  },
  {
    name: 'Mixed Vegetables 1kg',
    category: 'SAYURAN',
    catColor: 'bg-green-100 text-green-700',
    sku: 'VEG-MIX-100',
    hargaBeli: 'Rp 22.000',
    hargaJual: 'Rp 32.500',
    untung: '32.3%',
    untungColor: 'bg-green-100 text-green-700',
    hargaBaru: 'Rp 50.000',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&h=60&fit=crop&q=80',
  },
  {
    name: 'Ayam Karage Premium 1kg',
    category: 'OLAHAN',
    catColor: 'bg-yellow-100 text-yellow-700',
    sku: 'CHIK-KAR-1K',
    hargaBeli: 'Rp 64.000',
    hargaJual: 'Rp 82.000',
    untung: '22.0%',
    untungColor: 'bg-green-100 text-green-700',
    hargaBaru: 'Rp 135.000',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=60&h=60&fit=crop&q=80',
  },
];

const originalPrices = products.reduce((acc, p) => ({ ...acc, [p.sku]: p.hargaBaru }), {});

export default function AturHarga() {
  const [prices, setPrices] = useState(originalPrices);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleSave = () => {
    // Check if any price has changed compared to baseline originalPrices
    const isChanged = Object.keys(prices).some(sku => prices[sku] !== originalPrices[sku]);

    if (!isChanged) {
      setToastMessage('Belum ada harga yang diubah!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSuccessOpen(true);
  };


  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Harga Produk</h1>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-3 bg-[#f26f21] hover:bg-[#ff7b2b] text-white text-sm font-semibold rounded-xl transition-all shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Simpan Semua Perubahan
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Ketik harga baru di kolom paling kanan. Sistem akan otomatis menghitung potensi untung Anda.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">SKU</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Harga Beli</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Harga Jual (Sekarang)</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Potensi Untung</th>
                <th className="text-right text-xs font-semibold text-gray-900 uppercase tracking-wider px-6 py-3 font-bold">Harga Jual Baru</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded ${product.catColor}`}>
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 font-mono">{product.sku}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 text-right">{product.hargaBeli}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 text-right">{product.hargaJual}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${product.untungColor}`}>
                        {product.untung}
                      </span>
                      {product.untungWarn && (
                        <span className="text-[10px] text-red-500 mt-1">{product.untungWarn}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <input
                      type="text"
                      value={prices[product.sku]}
                      onChange={(e) => setPrices({ ...prices, [product.sku]: e.target.value })}
                      className="w-32 px-3 py-2 text-sm font-semibold text-right border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    />
                  </td>
                </tr>
              ))}
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

      {/* Modal: Perubahan Berhasil Disimpan (Figma Design) */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-6 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            {/* Green Check Icon */}
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 mb-2">Perubahan Berhasil Disimpan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">
              Harga produk telah berhasil diperbarui dan akan segera disinkronkan.
            </p>

            {/* Button */}
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

