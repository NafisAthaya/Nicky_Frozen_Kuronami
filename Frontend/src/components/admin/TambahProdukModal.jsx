import { useState, useEffect, useRef } from 'react';
import { MdQrCodeScanner, MdClose } from 'react-icons/md';
import { createProduk, updateProduk } from '../../services/adminApi';

export default function TambahProdukModal({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  kategoris = [],
}) {
  const [formData, setFormData] = useState({
    nama_produk: '',
    sku: '',
    harga_beli: '',
    harga_jual: '',
    stok_total: '0',
    kategori: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData({
        nama_produk: editData.nama_produk || '',
        sku: editData.sku || '',
        harga_beli: String(editData.harga_beli || ''),
        harga_jual: String(editData.harga_jual || ''),
        stok_total: String(editData.stok_total || '0'),
        kategori: editData.kategori || '',
      });
    } else {
      setFormData({
        nama_produk: '',
        sku: '',
        harga_beli: '',
        harga_jual: '',
        stok_total: '0',
        kategori: '',
      });
    }
    setError('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_produk.trim()) return setError('Nama produk wajib diisi.');
    if (!formData.sku.trim()) return setError('SKU wajib diisi.');
    if (!formData.harga_beli) return setError('Harga beli wajib diisi.');
    if (!formData.harga_jual) return setError('Harga jual wajib diisi.');
    if (!formData.kategori.trim()) return setError('Kategori wajib diisi.');

    setLoading(true);
    try {
      const payload = {
        nama_produk: formData.nama_produk,
        sku: formData.sku,
        harga_beli: Number(formData.harga_beli),
        harga_jual: Number(formData.harga_jual),
        stok_total: Number(formData.stok_total),
        kategori: formData.kategori,
      };

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <MdClose size={22} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEditMode && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <MdQrCodeScanner size={48} className="mx-auto mb-3 text-slate-500" />
                <p className="text-sm text-slate-600">
                  Gunakan scanner barcode untuk mengisi SKU otomatis
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold">Nama Produk</label>
              <input
                type="text"
                value={formData.nama_produk}
                onChange={(e) => handleChange('nama_produk', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">SKU / Barcode</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Kategori Produk</label>
              <input
                type="text"
                list="kategoris-list"
                value={formData.kategori}
                onChange={(e) => handleChange('kategori', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                placeholder="Ketik atau pilih kategori..."
              />
              <datalist id="kategoris-list">
                {kategoris.map((kat, idx) => (
                  <option key={idx} value={kat.name} />
                ))}
              </datalist>
            </div>

            {!isEditMode && (
              <div>
                <label className="mb-2 block text-sm font-semibold">Stok Awal (Opsional)</label>
                <input
                  type="number"
                  value={formData.stok_total}
                  onChange={(e) => handleChange('stok_total', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">Harga Beli</label>
                <div className="flex overflow-hidden rounded-xl border border-slate-300">
                  <span className="bg-slate-100 px-4 py-3 font-semibold">Rp</span>
                  <input
                    type="number"
                    value={formData.harga_beli}
                    onChange={(e) => handleChange('harga_beli', e.target.value)}
                    className="flex-1 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Harga Jual</label>
                <div className="flex overflow-hidden rounded-xl border border-slate-300">
                  <span className="bg-slate-100 px-4 py-3 font-semibold">Rp</span>
                  <input
                    type="number"
                    value={formData.harga_jual}
                    onChange={(e) => handleChange('harga_jual', e.target.value)}
                    className="flex-1 px-4 py-3 outline-none"
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
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Produk')}
          </button>
        </div>
      </div>
    </div>
  );
}