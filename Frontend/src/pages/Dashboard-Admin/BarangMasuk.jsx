import { useState, useEffect, useRef } from 'react';
import {
  MdQrCodeScanner,
  MdSave,
  MdHistory,
  MdKeyboardArrowDown,
  MdChevronLeft,
  MdChevronRight,
  MdSearch,
  MdOutlineLightbulb
} from 'react-icons/md';

import { fetchProduks, createBatch, fetchBatches, updateBatch } from '../../services/adminApi';
import SuccessModal from '../../components/admin/SuccessModal.jsx';
import BatchDetailModal from '../../components/admin/BatchDetailModal.jsx';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatRupiah(number) {
  if (!number) return '';
  return new Intl.NumberFormat('id-ID').format(number);
}

function parseRupiah(rupiahString) {
  return rupiahString.replace(/[^0-9]/g, '');
}

export default function BarangMasuk() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // History / Entry Terakhir states
  const [historyBatches, setHistoryBatches] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 5;
  
  // Modal states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  // Form states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editBatchId, setEditBatchId] = useState(null);
  
  const [formData, setFormData] = useState({
    productId: '',
    jumlah: '',
    tanggalMasuk: new Date().toISOString().split('T')[0],
    expiredDate: '',
    hargaBeli: '',
    supplier: '',
    catatan: '',
  });

  // Custom Combobox State
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadData = async () => {
    try {
      const [prods, batches] = await Promise.all([
        fetchProduks(),
        fetchBatches()
      ]);
      setProducts(prods);
      setHistoryBatches(batches);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle outside click for combobox
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'hargaBeli') {
      const rawValue = parseRupiah(value);
      setFormData(prev => ({ ...prev, [name]: rawValue }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError('');
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.jumlah || !formData.tanggalMasuk || !formData.expiredDate) {
      setError('Harap lengkapi semua field yang diwajibkan.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        produk_id: formData.productId,
        stok: Number(formData.jumlah),
        expired_date: formData.expiredDate,
        tanggal_masuk: formData.tanggalMasuk,
        harga_beli: formData.hargaBeli ? Number(formData.hargaBeli) : null,
        supplier: formData.supplier || null,
        catatan: formData.catatan || null,
      };

      if (editBatchId) {
        await updateBatch(editBatchId, payload);
        setSuccessMessage('Riwayat barang masuk berhasil diperbarui!');
      } else {
        await createBatch(payload);
        setSuccessMessage('Barang Masuk Berhasil Ditambahkan!');
      }

      // Clear form
      setFormData({
        productId: '',
        jumlah: '',
        tanggalMasuk: new Date().toISOString().split('T')[0],
        expiredDate: '',
        hargaBeli: '',
        supplier: '',
        catatan: '',
      });
      setSearchQuery('');
      setEditBatchId(null);
      setIsSuccessModalOpen(true);
      loadData(); // Refresh history
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data barang masuk.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatal = () => {
    setFormData({
      productId: '',
      jumlah: '',
      tanggalMasuk: new Date().toISOString().split('T')[0],
      expiredDate: '',
      hargaBeli: '',
      supplier: '',
      catatan: '',
    });
    setSearchQuery('');
    setEditBatchId(null);
    setError('');
  };

  const handleEditFromPopup = (batch) => {
    // Populate form
    setFormData({
      productId: batch.produk_id,
      jumlah: batch.stok,
      tanggalMasuk: batch.tanggal_masuk,
      expiredDate: batch.expired_date,
      hargaBeli: batch.harga_beli || '',
      supplier: batch.supplier || '',
      catatan: batch.catatan || '',
    });
    const prod = products.find(p => p.id === batch.produk_id);
    if (prod) setSearchQuery(prod.nama_produk);
    setEditBatchId(batch.id);
    setSelectedBatch(null); // Close popup
  };

  const handleSaveFromPopup = (batch) => {
    // According to instructions, this simulates saving only the history if needed
    // But since edit populates the main form, this button might just close the modal.
    setSelectedBatch(null);
  };

  // Pagination for History
  const totalPages = Math.ceil(historyBatches.length / itemsPerPage);
  const displayedHistory = historyBatches.slice((historyPage - 1) * itemsPerPage, historyPage * itemsPerPage);

  const handlePrevPage = () => {
    if (historyPage > 1) setHistoryPage(historyPage - 1);
  };
  const handleNextPage = () => {
    if (historyPage < totalPages) setHistoryPage(historyPage + 1);
  };

  const selectedProduct = products.find(p => p.id === Number(formData.productId));
  const filteredProducts = products.filter(p => p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="px-6 py-2 md:px-8 md:py-4 w-full relative">
      
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#082B7A] mb-2">
          Input Barang Masuk
        </h1>
        <p className="text-gray-500 text-sm">
          Kelola penambahan stok dan inventaris
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Col: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form 
            onSubmit={handleSimpan}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 h-full flex flex-col"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-6">
              
              {/* Custom Searchable Dropdown */}
              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-bold text-[#082B7A] mb-2 flex items-center gap-2">
                  <MdSearch size={18}/> Cari Produk
                </label>
                
                <div 
                  className="w-full h-12 border border-gray-200 rounded-xl flex items-center justify-between px-4 cursor-text bg-white focus-within:border-[#082B7A] focus-within:ring-1 focus-within:ring-[#082B7A] transition-all"
                  onClick={() => setIsDropdownOpen(true)}
                >
                  <input 
                    type="text"
                    placeholder="Pilih produk untuk menambah stok..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      if (formData.productId) {
                         setFormData(prev => ({...prev, productId: ''}));
                      }
                    }}
                    className="flex-1 w-full outline-none bg-transparent text-sm font-semibold text-gray-700"
                  />
                  <MdKeyboardArrowDown size={20} className="text-gray-400 ml-2" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 shadow-xl rounded-xl max-h-60 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <div 
                          key={p.id}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, productId: p.id }));
                            setSearchQuery(p.nama_produk);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="font-bold text-gray-800">{p.nama_produk}</div>
                          <div className="text-xs text-gray-500">Stok: {p.stok_total} Unit | SKU: {p.sku}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">Tidak ada produk ditemukan</div>
                    )}
                  </div>
                )}
              </div>

              {/* Data Terisi Otomatis */}
              {selectedProduct && (
                <div className="grid grid-cols-3 gap-4 p-5 bg-gray-50 border border-gray-100 rounded-xl">
                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Nama Produk</span>
                    <span className="text-[#082B7A] font-bold text-sm">{selectedProduct.nama_produk}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">SKU</span>
                    <span className="text-[#082B7A] font-bold text-sm">{selectedProduct.sku || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Stok Saat Ini</span>
                    <div className="text-[#082B7A] font-bold">
                       <span className="text-2xl mr-1">{selectedProduct.stok_total}</span>
                       <span className="text-xs">Unit</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tanggal & Jumlah */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Jumlah Stok Baru</label>
                  <input
                    type="number"
                    required
                    name="jumlah"
                    min="1"
                    placeholder="0"
                    value={formData.jumlah}
                    onChange={handleChange}
                    className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#082B7A] text-sm font-semibold"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Tanggal Kedaluwarsa</label>
                  <input
                    type="date"
                    required
                    name="expiredDate"
                    value={formData.expiredDate}
                    onChange={handleChange}
                    className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#082B7A] text-sm font-semibold text-gray-600"
                  />
                </div>
              </div>

              {/* Harga Beli & Supplier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Harga Beli per Unit (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">Rp</span>
                    <input
                      type="text"
                      name="hargaBeli"
                      placeholder="0"
                      value={formData.hargaBeli ? formatRupiah(formData.hargaBeli) : ''}
                      onChange={handleChange}
                      className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#082B7A] text-sm font-semibold"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    placeholder="Contoh: PT. Bintang Jaya"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#082B7A] text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Catatan / Keterangan</label>
                <textarea
                  name="catatan"
                  rows={3}
                  placeholder="Tambahkan informasi tambahan pengiriman atau kondisi barang..."
                  value={formData.catatan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#082B7A] text-sm font-semibold resize-none"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="mt-auto pt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleBatal}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 font-bold rounded-[20px] hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Batal
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2.5 bg-[#FF7A00] hover:bg-orange-600 text-white font-bold rounded-[20px] transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : (editBatchId ? 'Simpan Perubahan' : 'Simpan Stok')}
              </button>
            </div>
          </form>

        </div>

        {/* Right Col: Entry Terakhir Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#082B7A] tracking-wide uppercase text-sm">Riwayat Terakhir</h3>
              <MdHistory size={20} className="text-[#FF7A00]" />
            </div>

            <div className="flex-1 space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-400 font-medium text-sm">Memuat...</div>
              ) : displayedHistory.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-medium text-sm">Belum ada riwayat</div>
              ) : (
                displayedHistory.map(batch => {
                  const prod = batch.produk || {};
                  return (
                    <div 
                      key={batch.id} 
                      className="group p-4 rounded-2xl border border-gray-50 hover:bg-blue-50 hover:border-blue-100 cursor-pointer transition-all"
                      onClick={() => setSelectedBatch(batch)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-bold text-[#082B7A] text-sm group-hover:text-blue-800 line-clamp-1 pr-2">
                          {prod.nama_produk || 'Produk Unknown'}
                        </div>
                        <div className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-extrabold whitespace-nowrap">
                          +{batch.stok} Unit
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mb-1.5">
                        <MdHistory size={14} />
                        Hari ini, {new Date(batch.tanggal_masuk).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      
                      {batch.supplier && (
                        <div className="text-[11px] text-gray-400 font-medium truncate">
                          Supplier: {batch.supplier}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-center gap-4">
                <button 
                  onClick={handlePrevPage} 
                  disabled={historyPage === 1}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#082B7A] hover:bg-blue-50 disabled:opacity-30 transition-colors"
                >
                  <MdChevronLeft size={24} />
                </button>
                <span className="text-xs font-bold text-gray-400">
                  {historyPage} / {totalPages}
                </span>
                <button 
                  onClick={handleNextPage} 
                  disabled={historyPage === totalPages}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#082B7A] hover:bg-blue-50 disabled:opacity-30 transition-colors"
                >
                  <MdChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      <BatchDetailModal 
        isOpen={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        batch={selectedBatch}
        onEdit={handleEditFromPopup}
        onSave={handleSaveFromPopup}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Pemberitahuan"
        description={successMessage}
      />

    </div>
  );
}
