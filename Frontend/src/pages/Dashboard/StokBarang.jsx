import { useState } from 'react';

const initialStockData = [
  {
    id: 1,
    name: 'Bakso Sapi Super (500g)',
    category: 'Frozen Foods / Meat',
    sku: 'BKSO-SP-001',
    stock: 24,
    expDate: '3 Des 2024',
    originalPrice: 45000,
    status: 'H-3',
    statusColor: 'bg-red-50 text-red-500 border-red-100',
    diskon: 0,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=80&q=80',
  },
  {
    id: 2,
    name: 'Kentang Goreng Shoestring (1kg)',
    category: 'Camilan',
    sku: 'KTNG-SH-009',
    stock: 15,
    expDate: '5 Des 2024',
    originalPrice: 38000,
    status: 'H-5',
    statusColor: 'bg-orange-50 text-orange-500 border-orange-100',
    diskon: 0,
    image: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?auto=format&fit=crop&w=80&q=80',
  },
  {
    id: 3,
    name: 'Dory Fillet Premium',
    category: 'Seafood / Fresh',
    sku: 'DORY-PR-609',
    stock: 42,
    expDate: '7 Des 2024',
    originalPrice: 55000,
    status: 'H-7',
    statusColor: 'bg-slate-100 text-slate-600 border-slate-200',
    diskon: 0,
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=80&q=80',
  },
];

export default function StokBarang() {
  const [stockData, setStockData] = useState(initialStockData);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountPercent, setDiscountPercent] = useState('');
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleOpenDiscountModal = (product) => {
    setSelectedProduct(product);
    setDiscountPercent(product.diskon || '');
    setIsDiscountModalOpen(true);
  };

  const handleDiscountChange = (value) => {
    // Only allow numbers between 0 and 100
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 100)) {
      setDiscountPercent(value);
    }
  };

  const handleActivatePromo = () => {
    if (!selectedProduct) return;
    
    // Update discount in state
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

  // Auto-calculated price
  const originalPrice = selectedProduct?.originalPrice || 0;
  const discountVal = parseInt(discountPercent) || 0;
  const newPrice = originalPrice * (1 - discountVal / 100);

  return (
    <div className="animate-fadeIn p-6 max-w-7xl mx-auto">
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
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">1,248</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12 dari bulan lalu</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Mendekati Kadaluwarsa (H-3)</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">48 Produk</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <button className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl uppercase tracking-wider">
              Status: Perlu Tindakan
            </button>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Potensi Kerugian Kadaluwarsa</p>
              <h2 className="text-2xl font-black text-red-600 tracking-tight">Rp 1.250.000</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
            </svg>
            <span>Menurun drastis setelah penjualan</span>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Produk Mendekati Kadaluwarsa</h3>
            <p className="text-xs text-slate-400 mt-0.5">Data stok yang akan kadaluwarsa dalam 7 hari ke depan</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-450 text-[10px] font-black uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-4 rounded-l-xl">Produk</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4 text-center">Sisa Stok</th>
                <th className="py-3.5 px-4 text-center">Tanggal Kadaluwarsa</th>
                <th className="py-3.5 px-4 text-center">Diskon</th>
                <th className="py-3.5 px-4 text-center rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  {/* Produk details */}
                  <td className="py-4 px-4 flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.category}</p>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-4 px-4 text-xs font-mono text-slate-500">{item.sku}</td>

                  {/* Sisa Stok */}
                  <td className="py-4 px-4 text-xs font-bold text-slate-800 text-center">{item.stock} Pcs</td>

                  {/* Exp Date */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-slate-700">{item.expDate}</span>
                      <span className={`mt-1 text-[9px] font-black px-2 py-0.5 rounded-full border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>

                  {/* Diskon tag */}
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1h1zm7-13h6m-6 3h6m-6 3h6M6 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Atur Diskon Otomatis */}
      {isDiscountModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 relative border border-slate-100 animate-scaleIn">
            {/* Close Button */}
            <button 
              onClick={() => setIsDiscountModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Title */}
            <h3 className="text-lg font-bold text-slate-800 mb-2">Atur Diskon Otomatis</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              <span className="font-bold text-slate-700">{selectedProduct.name}</span> (Sisa Stok: {selectedProduct.stock} Pcs).
              Dekati potongan harga untuk menghabiskan stok sebelum {selectedProduct.expDate}.
            </p>

            {/* Form */}
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

              {/* Dynamic Price Display */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Baru</span>
                <span className="text-xl font-black text-blue-700">{formatRupiah(newPrice)}</span>
                <span className="text-[10px] text-slate-400">
                  Terhitung otomatis dari harga asli {formatRupiah(selectedProduct.originalPrice)}
                </span>
              </div>
            </div>

            {/* Buttons */}
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
            {/* Green Check Icon */}
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 mb-2">Promo Berhasil Diaktifkan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-sm">
              Diskon {discountPercent}% untuk <span className="font-bold text-slate-700">{selectedProduct.name}</span> telah aktif dan tersinkronisasi dengan sistem kasir.
            </p>

            {/* Button */}
            <button 
              onClick={handleCloseSuccessModal}
              className="w-full bg-blue-750 hover:bg-blue-800 text-white text-xs font-black py-3.5 rounded-2xl shadow-lg shadow-blue-100 transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
