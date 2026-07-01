import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdSend,
  MdRemove,
  MdAdd,
} from 'react-icons/md';

import { fetchProduks } from '../../services/adminApi';
import SuccessModal from '../../components/admin/SuccessModal.jsx';

export default function PengajuanStok() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [jumlah, setJumlah] = useState(50);
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProduks();
        setProducts(data);
      } catch (error) {
        console.error("Gagal memuat produk:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleKurang = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
    }
  };

  const handleTambah = () => {
    setJumlah(jumlah + 1);
  };

  const handleChangeJumlah = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setJumlah(value);
    } else if (e.target.value === '') {
      setJumlah('');
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const selectedProduct = products.find(p => p.id === Number(selectedProductId));
  const hargaPokok = selectedProduct ? selectedProduct.harga_beli : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    // Untuk saat ini hanya memunculkan modal success karena backend pengajuan belum diimplementasi sepenuhnya
    // di request ini, fokus ke CRUD produk.
    setIsSuccessModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/admin/stok-barang');
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/stok-barang')}
        className="flex items-center gap-2 text-gray-500 hover:text-[#082B7A] transition mb-5"
      >
        <MdArrowBack />
        Kembali ke Stok Barang
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8"
      >
        {/* Header */}
        <div className="pb-5 border-b border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-[#082B7A] mb-2">
            Detail Pengajuan
          </h1>

          <p className="text-gray-500">
            Silakan lengkapi formulir di bawah ini untuk mengajukan restock barang.
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nama Produk */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Nama Produk
              <span className="text-red-500 ml-1">*</span>
            </label>

            {loading ? (
              <div className="w-full h-12 px-4 border border-gray-300 rounded-xl flex items-center bg-gray-50 text-gray-500">Memuat produk...</div>
            ) : (
              <select
                required
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
              >
                <option value="">Pilih produk...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama_produk} (Sisa: {p.stok_total})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Cabang */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Cabang Tujuan
              <span className="text-red-500 ml-1">*</span>
            </label>

            <select
              required
              defaultValue="Cabang Sudirman"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
            >
              <option>Cabang Sudirman</option>
              <option>Cabang Utama</option>
              <option>Cabang Melati</option>
            </select>
          </div>

          {/* Jumlah */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Jumlah Produk
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="flex border border-gray-300 rounded-xl overflow-hidden h-12">
              <button
                type="button"
                onClick={handleKurang}
                className="w-12 bg-gray-50 hover:bg-gray-100 flex items-center justify-center border-r border-gray-300"
              >
                <MdRemove size={20} />
              </button>

              <input
                type="number"
                value={jumlah}
                onChange={handleChangeJumlah}
                min="1"
                className="flex-1 text-center outline-none"
              />

              <button
                type="button"
                onClick={handleTambah}
                className="w-12 bg-gray-50 hover:bg-gray-100 flex items-center justify-center border-l border-gray-300"
              >
                <MdAdd size={20} />
              </button>
            </div>
          </div>

          {/* Estimasi */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Estimasi Biaya
            </label>

            <div className="flex items-center border border-gray-300 bg-gray-50 rounded-xl px-4 h-12">
              <span className="text-gray-500 mr-2">Rp</span>
              <input
                readOnly
                value={formatRupiah(jumlah * hargaPokok)}
                className="flex-1 font-bold text-lg outline-none bg-transparent"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              * Berdasarkan harga beli Rp {formatRupiah(hargaPokok)}/pcs
            </p>
          </div>

          {/* Catatan */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-2">
              Catatan Tambahan
            </label>

            <textarea
              rows={5}
              placeholder="Tambahkan catatan untuk pengajuan restock ini..."
              className="w-full border border-gray-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/stok-barang')}
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 text-gray-700"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={!selectedProductId}
            className="px-6 py-3 bg-[#082B7A] hover:bg-[#0B3B91] text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <MdSend size={20} />
            Kirim Pengajuan
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseModal}
        title="Pengajuan Terkirim!"
        description="Pengajuan restock Anda berhasil dikirim ke Owner."
      />
    </div>
  );
}