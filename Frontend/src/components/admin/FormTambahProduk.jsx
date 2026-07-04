import { useState, useEffect, useRef } from 'react';
import { MdQrCodeScanner, MdClose, MdImage } from 'react-icons/md';
import { createProduk, updateProduk } from '../../services/adminApi';

export default function FormTambahProduk({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  kategoris = [],
  isInline = false,
}) {
  const [formData, setFormData] = useState({
    nama_produk: '',
    sku: '',
    harga_beli: '',
    stok_total: '0',
    expired_date: '',
    kategori: '',
    supplier: '',
  });
  const [gambar, setGambar] = useState(null);
  const [gambarPreview, setGambarPreview] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData({
        nama_produk: editData.nama_produk || '',
        sku: editData.sku || '',
        harga_beli: String(editData.harga_beli || ''),
        stok_total: String(editData.stok_total || '0'),
        expired_date: '',
        kategori: editData.kategori || '',
        supplier: '',
      });
      setGambarPreview(editData.gambar || null);
    } else {
      setFormData({
        nama_produk: '',
        sku: '',
        harga_beli: '',
        stok_total: '0',
        expired_date: '',
        kategori: '',
        supplier: '',
      });
      setGambarPreview(null);
    }
    setGambar(null);
    setError('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    setFormData({
      nama_produk: '',
      sku: '',
      harga_beli: '',
      stok_total: '0',
      expired_date: '',
      kategori: '',
      supplier: '',
    });
    setGambar(null);
    setGambarPreview(null);
    setError('');
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      setGambarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_produk.trim()) return setError('Nama produk wajib diisi.');
    if (!formData.sku.trim()) return setError('SKU wajib diisi.');
    if (!formData.harga_beli) return setError('Harga beli wajib diisi.');
    if (!formData.kategori.trim()) return setError('Kategori wajib diisi.');

    if (Number(formData.stok_total) > 0 && !formData.expired_date) {
      return setError('Tanggal kedaluwarsa wajib diisi jika ada jumlah produk (stok).');
    }

    setLoading(true);
    try {
      const payload = new FormData();
      
      let cabangId = 1;
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        cabangId = user?.cabang_id || 1;
      } catch (e) {}
      
      payload.append('cabang_id', cabangId);
      payload.append('nama_produk', formData.nama_produk);
      payload.append('sku', formData.sku);
      payload.append('harga_beli', Number(formData.harga_beli));
      payload.append('stok_total', Number(formData.stok_total));
      payload.append('kategori', formData.kategori);
      if (formData.expired_date) {
        payload.append('expired_date', formData.expired_date);
      }
      if (formData.supplier) {
        payload.append('supplier', formData.supplier);
      }
      
      if (gambar) {
        payload.append('gambar', gambar);
      }

      if (isEditMode) {
        await updateProduk(editData.id, payload);
      } else {
        await createProduk(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan produk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={isInline ? "h-full w-full" : "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"}
      onClick={(e) => {
        if (!isInline && e.target === e.currentTarget) onClose();
      }}
    >
      <div className={isInline ? "bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col" : "flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"}>
        
        {/* HEADER */}
        {!isInline && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-xl font-bold text-slate-800">
              {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
              <MdClose size={22} />
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div className={isInline ? "p-6 md:p-8" : "flex-1 overflow-y-auto p-6"}>
          <form id="form-tambah-produk" onSubmit={handleSubmit} className="space-y-4">
            {!isEditMode && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <MdQrCodeScanner size={48} className="mx-auto mb-3 text-slate-500" />
                <p className="text-sm text-slate-600">
                  Gunakan scanner barcode untuk mengisi SKU otomatis
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#082B7A] mb-2">Gambar Produk</label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-300">
                  {gambarPreview ? (
                    <img src={gambarPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <MdImage size={32} className="text-slate-400" />
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleGambarChange} 
                  className="w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#082B7A] mb-2">Nama Produk</label>
                <input
                  type="text"
                  value={formData.nama_produk}
                  onChange={(e) => handleChange('nama_produk', e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#082B7A] focus:ring-1 focus:ring-[#082B7A] transition-all"
                  placeholder="Masukkan nama produk..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#082B7A] mb-2">SKU / Barcode</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#082B7A] focus:ring-1 focus:ring-[#082B7A] transition-all"
                  placeholder="Masukkan SKU/Barcode..."
                />
              </div>
            </div>

            <div className={`grid grid-cols-1 ${!isEditMode ? 'md:grid-cols-2' : ''} gap-4`}>
              <div>
                <label className="block text-sm font-bold text-[#082B7A] mb-2">Kategori Produk</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => handleChange('kategori', e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#082B7A] focus:ring-1 focus:ring-[#082B7A] transition-all bg-white cursor-pointer"
                >
                  <option value="" disabled>Pilih kategori...</option>
                  {kategoris.map((kat, idx) => (
                    <option key={idx} value={kat.name}>{kat.name}</option>
                  ))}
                </select>
              </div>
              
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-bold text-[#082B7A] mb-2">Nama Supplier</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama supplier..."
                    value={formData.supplier}
                    onChange={(e) => handleChange('supplier', e.target.value)}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#082B7A] focus:ring-1 focus:ring-[#082B7A] transition-all"
                  />
                </div>
              )}
            </div>

            {!isEditMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#082B7A] mb-2">Jumlah Produk</label>
                  <input
                    type="number"
                    value={formData.stok_total}
                    onFocus={() => {
                      if (formData.stok_total === '0') handleChange('stok_total', '');
                    }}
                    onBlur={() => {
                      if (formData.stok_total === '') handleChange('stok_total', '0');
                    }}
                    onChange={(e) => handleChange('stok_total', e.target.value)}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#082B7A] focus:ring-1 focus:ring-[#082B7A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#082B7A] mb-2">Tanggal Kedaluwarsa</label>
                  <input
                    type="date"
                    value={formData.expired_date}
                    onChange={(e) => handleChange('expired_date', e.target.value)}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#082B7A] focus:ring-1 focus:ring-[#082B7A] transition-all"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#082B7A] mb-2">Harga Beli</label>
                <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#082B7A] focus-within:ring-1 focus-within:ring-[#082B7A] transition-all">
                  <span className="bg-gray-50 border-r border-gray-200 px-4 flex items-center justify-center font-bold text-gray-500 text-sm">Rp</span>
                  <input
                    type="text"
                    value={formData.harga_beli ? Number(formData.harga_beli).toLocaleString('id-ID') : ''}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/[^0-9]/g, '');
                      handleChange('harga_beli', rawValue);
                    }}
                    className="flex-1 px-4 h-12 outline-none text-sm font-semibold text-gray-700"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}
        {isInline ? (
          <div className="flex items-center justify-center gap-4 mt-2 mb-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              form="form-tambah-produk"
              disabled={loading}
              className="px-6 py-3 bg-[#082B7A] text-white font-bold rounded-xl hover:bg-[#0B3B91] disabled:opacity-50 transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Produk Baru'}
            </button>
          </div>
        ) : (
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              form="form-tambah-produk"
              disabled={loading}
              className="rounded-xl bg-[#082B7A] px-5 py-3 font-medium text-white hover:bg-[#0B3B91] disabled:opacity-50 w-full md:w-auto"
            >
              {loading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Produk')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}