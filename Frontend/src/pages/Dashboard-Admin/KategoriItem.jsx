import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';

import { fetchKategoris } from '../../services/adminApi';
import SuccessModal from '../../components/admin/SuccessModal.jsx';
import TambahKategoriModal from '../../components/admin/TambahKategoriModal.jsx';
import WarningModal from '../../components/admin/WarningModal.jsx';

export default function KategoriItem() {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext(); // <--- UNIVERSAL SEARCH

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for modals
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCategoryData, setDeleteCategoryData] = useState(null);

  const loadData = async () => {
    try {
      const data = await fetchKategoris();
      setCategories(data);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleGlobalSync = () => loadData();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTambahKategori = () => {
    setEditCategoryData(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditKategori = (cat) => {
    setEditCategoryData(cat);
    setIsAddEditModalOpen(true);
  };

  const handleHapusKategori = (cat) => {
    setDeleteCategoryData(cat);
    setIsDeleteModalOpen(true);
  };

  const handleAddEditSuccess = () => {
    setIsAddEditModalOpen(false);
    setSuccessMessage(editCategoryData ? 'Kategori berhasil diperbarui.' : 'Kategori baru Anda telah berhasil tersimpan.');
    setIsSuccessModalOpen(true);
    loadData();
    window.dispatchEvent(new Event('global-sync'));
  };

  const confirmDelete = async () => {
    if (!deleteCategoryData) return;
    try {
      const { deleteKategori } = await import('../../services/adminApi');
      await deleteKategori(deleteCategoryData.id);
      setIsDeleteModalOpen(false);
      setSuccessMessage(`Kategori "${deleteCategoryData.name}" berhasil dihapus.`);
      setIsSuccessModalOpen(true);
      loadData();
      window.dispatchEvent(new Event('global-sync'));
    } catch (error) {
      toast.error("Gagal menghapus kategori");
    }
  };

  return (
    <div className="p-6 md:p-8 w-full relative">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#082B7A]">
            Kategori Produk
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Kelola daftar kategori untuk mengorganisir produk Anda.
          </p>
        </div>

        <button
          onClick={handleTambahKategori}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#082B7A] hover:bg-[#0B3B91] text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-900/20"
        >
          <MdAdd className="text-xl" />
          Tambah Kategori Baru
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 w-32">
                ID Kategori
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-500">
                Nama Kategori
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 w-48">
                Jumlah Produk
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-500 w-32">
                Tindakan
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-gray-500">
                  Memuat kategori...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-gray-500">
                  {searchQuery ? `Tidak ada kategori yang cocok dengan "${searchQuery}"` : 'Belum ada data kategori.'}
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat, idx) => {
                // Generate KAT-01, KAT-02, dst berdasarkan index
                const idKategori = `KAT-${String(idx + 1).padStart(2, '0')}`;

                return (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 text-sm font-medium">
                      {idKategori}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-[#082B7A] text-lg">
                        {cat.name}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                        {cat.product_count} Produk
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEditKategori(cat)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <MdEdit size={22} />
                        </button>
                        <button
                          onClick={() => handleHapusKategori(cat)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <MdDelete size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer / Pagination */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
          <span className="text-sm text-gray-500">
            Menampilkan 1-{filteredCategories.length} dari {filteredCategories.length} kategori
          </span>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
              <MdChevronLeft size={20} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
              <MdChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <TambahKategoriModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSuccess={handleAddEditSuccess}
        editData={editCategoryData}
      />

      <WarningModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Kategori?"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteCategoryData?.name}"?`}
        buttonText="Hapus"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successMessage.includes('dihapus') ? 'Kategori Dihapus' : (editCategoryData ? 'Kategori Diperbarui' : 'Kategori Berhasil Ditambahkan')}
        description={successMessage}
      />
    </div>
  );
}