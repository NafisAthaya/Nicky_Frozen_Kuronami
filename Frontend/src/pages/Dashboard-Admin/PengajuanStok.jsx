import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdSend,
  MdRemove,
  MdAdd,
  MdSearch,
  MdKeyboardArrowDown,
} from 'react-icons/md';

import { fetchProduks, fetchKategoris } from '../../services/adminApi';
import useAuthStore from '../../store/authStore';
import axiosInstance from '../../api/axios';
import SuccessModal from '../../components/admin/SuccessModal.jsx';

export default function PengajuanStok() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [jumlah, setJumlah] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [kategoris, setKategoris] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [catatan, setCatatan] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prods, kats] = await Promise.all([
          fetchProduks(),
          fetchKategoris()
        ]);
        setProducts(prods);
        setKategoris(kats);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const handleGlobalSync = () => loadData();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleKurang = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
    }
  };

  const handleTambah = () => {
    setJumlah((jumlah || 0) + 1);
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
  const kategoriProduk = selectedProduct ? selectedProduct.kategori : '-';

  const filteredProducts = products.filter((p) => {
    const matchName = p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedKategori ? p.kategori === selectedKategori : true;
    return matchName && matchCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !jumlah) return;

    try {
      const response = await axiosInstance.post('/admin/pengajuan-stok', {
        produk_id: selectedProductId,
        jumlah: jumlah,
        catatan: catatan || 'Pengajuan dari form stok barang'
      });

      const data = response.data;
      if (data.status === 'success') {
        setIsSuccessModalOpen(true);
      } else {
        toast.error(data.message || 'Gagal mengajukan stok');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat mengajukan stok');
    }
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

          {/* Kategori Produk */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Kategori Produk
            </label>
            {loading ? (
              <div className="w-full h-12 px-4 border border-gray-300 rounded-xl flex items-center bg-gray-50 text-gray-500">Memuat kategori...</div>
            ) : (
              <select
                value={selectedKategori}
                onChange={(e) => {
                  setSelectedKategori(e.target.value);
                  setSelectedProductId('');
                  setSearchQuery('');
                }}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 cursor-pointer"
              >
                <option value="">Semua Kategori</option>
                {kategoris.map((kat) => (
                  <option key={kat.id} value={kat.name}>
                    {kat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Nama Produk */}
          <div ref={dropdownRef} className="relative">
            <label className="block font-semibold text-gray-700 mb-2">
              Nama Produk
              <span className="text-red-500 ml-1">*</span>
            </label>

            {loading ? (
              <div className="w-full h-12 px-4 border border-gray-300 rounded-xl flex items-center bg-gray-50 text-gray-500">Memuat produk...</div>
            ) : (
              <>
                <div
                  className="w-full h-12 border border-gray-300 rounded-xl flex items-center justify-between px-4 cursor-text bg-white focus-within:ring-2 focus-within:ring-blue-200 transition-all"
                  onClick={() => setIsDropdownOpen(true)}
                >
                  <MdSearch size={20} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Ketik untuk mencari produk..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      if (selectedProductId) {
                        setSelectedProductId('');
                      }
                    }}
                    className="flex-1 w-full outline-none bg-transparent text-sm text-gray-700"
                  />
                  <MdKeyboardArrowDown size={20} className="text-gray-400 ml-2" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 shadow-xl rounded-xl max-h-60 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          className={`p-3 hover:bg-blue-50 cursor-pointer flex justify-between border-b border-gray-50 last:border-0 ${selectedProductId === p.id ? 'bg-blue-50 font-bold text-[#082B7A]' : 'text-gray-700'}`}
                          onClick={() => {
                            setSelectedProductId(p.id);
                            setSearchQuery(p.nama_produk);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span>{p.nama_produk}</span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            Sisa: {p.stok_total}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">Produk tidak ditemukan</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Jumlah */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-2">
              Jumlah Produk
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="flex border border-gray-300 rounded-xl overflow-hidden h-12 w-full md:w-1/2">
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
                placeholder="0"
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



          {/* Catatan */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-2">
              Catatan Tambahan
            </label>

            <textarea
              rows={5}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
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