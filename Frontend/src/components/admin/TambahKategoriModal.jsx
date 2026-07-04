import { useState, useEffect } from 'react';
import { MdClose, MdSave } from 'react-icons/md';
import { addKategori, updateKategori } from '../../services/adminApi';

export default function TambahKategoriModal({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setDescription(editData.description || '');
    } else {
      setName('');
      setDescription('');
    }

    setError('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await updateKategori(editData.id, { name, description });
      } else {
        await addKategori({ name, description });
      }

      setName('');
      setDescription('');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan kategori.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold text-[#082B7A]">
            {isEditMode
              ? 'Edit Kategori'
              : 'Tambah Kategori Baru'}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nama Kategori
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="Contoh: Daging Beku"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#082B7A] focus:ring-1 focus:ring-[#082B7A]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Deskripsi (Opsional)
            </label>

            <textarea
              rows={4}
              placeholder="Masukkan deskripsi kategori..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#082B7A] focus:ring-1 focus:ring-[#082B7A]"
            />
          </div>

          {error && (
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#E6EDFF] px-5 py-3 font-bold text-[#082B7A] hover:bg-[#D5E0FF] transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-white transition-colors shadow-sm ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#082B7A] hover:bg-[#0B3B91]'
              }`}
            >
              <MdSave size={20} />
              {loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}