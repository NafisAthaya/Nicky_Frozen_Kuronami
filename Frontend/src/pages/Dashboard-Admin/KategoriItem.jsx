import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for modals
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCategoryName, setDeleteCategoryName] = useState('');

  useEffect(() => {
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
    loadData();
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

  const handleHapusKategori = (catName) => {
    setDeleteCategoryName(catName);
    setIsDeleteModalOpen(true);
  };

  const handleAddEditSuccess = () => {
    setIsAddEditModalOpen(false);
    setSuccessMessage(editCategoryData ? 'Kategori berhasil diperbarui.' : 'Kategori baru Anda telah berhasil tersimpan.');
    setIsSuccessModalOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
    setSuccessMessage(`Kategori "${deleteCategoryName}" berhasil dihapus.`);
    setIsSuccessModalOpen(true);
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

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 mb-6 flex items-center gap-3">
        <MdSearch className="text-gray-400 text-2xl ml-2" />
        <input
          type="text"
          placeholder="Cari nama kategori atau ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 w-full text-sm outline-none bg-transparent"
        />
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
                          onClick={() => handleHapusKategori(cat.name)}
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
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteCategoryName}"?`}
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