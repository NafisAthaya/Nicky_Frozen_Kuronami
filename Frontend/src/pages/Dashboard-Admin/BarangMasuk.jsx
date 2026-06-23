import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdSearch, MdKeyboardArrowDown, MdHistory, MdLightbulbOutline, MdCalendarToday } from 'react-icons/md';
import { useApp } from '../../context/AppContext';
import SuccessModal from '../../components/admin/SuccessModal.jsx';


function formatDateTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  if (diffHours < 24) {
    return `Hari ini, ${timeStr}`;
  } else if (diffDays < 2) {
    return `Kemarin, ${timeStr}`;
  } else {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + `, ${timeStr}`;
  }
}

export default function BarangMasuk() {
  const { products, addStockEntry, getRecentStockEntries, getProductById } = useApp();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const productDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [formData, setFormData] = useState({
    qty: '',
    expiryDate: '',
    buyPrice: '',
    supplier: '',
    notes: '',
  });

  const selectedProduct = useMemo(() => {
    return selectedProductId ? getProductById(selectedProductId) : null;
  }, [selectedProductId, getProductById]);

  const recentEntries = getRecentStockEntries(5);

  // Filter products for dropdown
  const filteredProducts = useMemo(() => {
    if (!searchQuery || !String(searchQuery).trim()) return products || [];
    const q = String(searchQuery).toLowerCase();
    return (products || []).filter(p => 
      String(p?.name || '').toLowerCase().includes(q) || String(p?.sku || '').toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    addStockEntry({
      productId: selectedProductId,
      productName: selectedProduct?.name || '',
      qty: Number(formData.qty),
      expiryDate: formData.expiryDate,
      buyPrice: Number(formData.buyPrice),
      supplier: formData.supplier,
      notes: formData.notes,
    });

    // Reset form
    setSelectedProductId('');
    setFormData({
      qty: '',
      expiryDate: '',
      buyPrice: '',
      supplier: '',
      notes: '',
    });

    setIsSuccessOpen(true);
  };

  const handleReset = () => {
    setSelectedProductId('');
    setFormData({
      qty: '',
      expiryDate: '',
      buyPrice: '',
      supplier: '',
      notes: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900"> Barang Masuk</h1>
      <p className="text-gray-500 mt-2">Kelola penambahan stok dan inventaris</p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            {/* Search / Select Product */}
            <div className="relative mb-8" ref={productDropdownRef}>
                <label className="flex items-center gap-2 text-blue-900 font-semibold mb-3">
                  <MdSearch />
                  Cari Produk
                </label>

                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-14 border border-gray-300 rounded-3xl px-5 flex items-center cursor-pointer"
                >
                  <input
                    type="text"
                    placeholder="Pilih produk untuk menambah stok..."
                    value={isDropdownOpen ? searchQuery : (selectedProduct?.name || '')}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    className="flex-1 outline-none bg-transparent"
                  />

                  <MdKeyboardArrowDown className="text-2xl text-gray-500" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border rounded-2xl shadow-lg z-50 max-h-60 overflow-auto">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p.id)}
                        className="p-4 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-sm text-gray-500">{p.sku}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            {/* Product Info Card */}
            {selectedProduct ? (
            <div className="grid grid-cols-3 gap-6 bg-gray-50 border rounded-3xl p-6 mb-8">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Nama Produk
                </p>
                <p className="text-blue-900 font-bold">
                  {selectedProduct.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  SKU
                </p>
                <p className="text-blue-900 font-bold">
                  {selectedProduct.sku}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Stok Saat Ini
                </p>

                <p className="text-4xl font-bold text-blue-900">
                  {selectedProduct.stock}
                  <span className="text-base font-normal ml-2">Unit</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="border rounded-3xl p-6 text-center text-gray-500 mb-8">
              Pilih produk terlebih dahulu untuk melihat informasi
            </div>
          )}

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bm-form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Stok Baru</label>
                <input 
                  type="number" 
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
                  value={formData.qty}
                  onChange={(e) => handleChange('qty', e.target.value)}
                  min="1"
                  placeholder="0"
                  required 
                />
              </div>
              
              <div className="bm-form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Kadaluwarsa</label>
                <input 
                  type="date" 
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                />
              </div>

              <div className="bm-form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Beli per Unit (Rp)</label>
                <div className="flex items-center border border-gray-300 rounded-md h-12 px-4">
                <span className="mr-2 text-gray-500">Rp</span>

                <input
                  type="number"
                  value={formData.buyPrice}
                  onChange={(e) => handleChange('buyPrice', e.target.value)}
                  placeholder="0"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
              </div>

              <div className="bm-form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                <div className="bm-supplier-search">
                  <MdSearch className="bm-supplier-search__icon" />
                  <input
                    type="text"
                    className="bm-input bm-supplier-search__input"
                    value={formData.supplier}
                    onChange={(e) => handleChange('supplier', e.target.value)}
                    placeholder="Masukkan nama supplier..."
                  />
                  {formData.supplier && (
                    <button
                      type="button"
                      className="bm-supplier-search__clear"
                      onClick={() => handleChange('supplier', '')}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="bm-form-group bm-form-group--full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan / Keterangan</label>
                <textarea 
                  className="w-full h-24 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Tambahkan informasi tambahan pengiriman atau kondisi barang..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-5 mt-10">
            <button
              type="button"
              onClick={handleReset}
              className="
                h-14
                px-10
                rounded-full
                border
                border-gray-400
                bg-white
                text-gray-700
                text-lg
                font-medium
                hover:bg-gray-50
                transition
              "
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={!selectedProductId || !formData.qty}
              className="
                h-14
                px-10
                rounded-full
                bg-[#FF7A00]
                text-white
                text-lg
                font-medium
                shadow-lg
                shadow-orange-300
                hover:bg-[#e86f00]
                disabled:bg-gray-300
                disabled:shadow-none
                transition
              "
            >
              Simpan Stok
            </button>
          </div>
          </form>
        </div>

        {/* History Section (Sidebar) */}
        <div className="bg-white rounded-xl border p-6">
          <div className="bm-history__header">
            <span className="bm-history__title">ENTRY TERAKHIR</span>
            <MdHistory className="bm-history__icon" />
          </div>

          <div className="bm-history__list">
            {recentEntries.length === 0 ? (
              <div className="bm-history__empty">
                <p>Belum ada riwayat barang masuk.</p>
              </div>
            ) : (
              recentEntries.map((entry) => (
                <div className="bm-history-item" key={entry.id}>
                  <div className="bm-history-item__header">
                    <span className="bm-history-item__name">{entry.productName}</span>
                    <span className="bm-history-item__badge">+{entry.qty} Unit</span>
                  </div>
                  <div className="bm-history-item__meta">
                    <MdCalendarToday /> {formatDateTime(entry.createdAt)}
                  </div>
                  {entry.supplier && (
                    <div className="bm-history-item__supplier">
                      Supplier: {entry.supplier}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {recentEntries.length > 0 && (
            <div className="bm-history__footer">
              <Link to="/admin/riwayat-barang-masuk"
              className="bm-history__link">
                Lihat Semua Riwayat
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Tips Banner */}
      <div className="mt-6 bg-blue-900 rounded-xl p-6 text-white flex justify-between items-center">
        <div className="bm-tips__content">
          <h3 className="bm-tips__title">Tips Manajemen Stok</h3>
          <p className="bm-tips__text">
            Pastikan memeriksa tanggal kedaluwarsa secara teliti untuk barang beku guna menjaga kualitas &quot;Premium Frozen Goods&quot; toko kita.
          </p>
        </div>
        <button className="bm-tips__btn">
          <MdLightbulbOutline className="bm-tips__btn-icon" />
          Pelajari
        </button>
      </div>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Stok Barang Berhasil Ditambahkan!"
        description="Stok baru telah tersimpan dan siap digunakan dalam transaksi."
        buttonText="Tutup"
      />

    </div>
  );
}
