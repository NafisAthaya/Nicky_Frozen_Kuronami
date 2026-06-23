import { useState, useMemo } from 'react';
import {
  MdAdd,
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdEdit,
  MdDelete,
} from 'react-icons/md';

import { useApp } from '../../context/AppContext';
import TambahKategoriModal from '../../components/admin/TambahKategoriModal';
import SuccessModal from '../../components/admin/SuccessModal.jsx';
import WarningModal from '../../components/admin/WarningModal';

const ITEMS_PER_PAGE = 10;

export default function KategoriItem() {
  const { categories, deleteCategory, getProductCountForCategory } = useApp();

  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = useState(false);

  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const q = searchQuery.toLowerCase();

    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.id.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)
  );

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenTambah = () => {
    setEditData(null);
    setIsTambahOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditData(cat);
    setIsTambahOpen(true);
  };

  const handleSuccessTambah = () => {
    setIsTambahOpen(false);

    setSuccessMessage(
      editData
        ? 'Kategori Berhasil Diperbarui'
        : 'Kategori Berhasil Ditambahkan'
    );

    setIsSuccessOpen(true);
    setEditData(null);
  };

  const handleOpenDelete = (cat) => {
    setDeleteTarget(cat);
    setIsDeleteWarningOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id);
    }

    setIsDeleteWarningOpen(false);
    setDeleteTarget(null);

    setSuccessMessage('Kategori Berhasil Dihapus');
    setIsSuccessOpen(true);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#082B7A]">
            Kategori Produk
          </h1>

          <p className="text-gray-500 mt-2">
            Kelola daftar kategori untuk mengorganisir produk Anda.
          </p>
        </div>

        <button
          onClick={handleOpenTambah}
          className="flex items-center gap-2 bg-[#0052CC] hover:bg-[#0043A6] text-white px-5 py-3 rounded-xl font-medium transition"
        >
          <MdAdd size={22} />
          Tambah Kategori Baru
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 h-12 shadow-sm">
          <MdSearch className="text-gray-400 text-xl mr-3" />

          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari nama kategori atau ID..."
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                ID Kategori
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Nama Kategori
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Jumlah Produk
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Tindakan
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan="4">
                  <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                    <p>
                      {searchQuery
                        ? 'Tidak ada kategori yang cocok dengan pencarian.'
                        : 'Belum ada data kategori. Klik "Tambah Kategori Baru" untuk memulai.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-md text-xs font-mono text-gray-700">
                      {cat.id}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        {cat.name}
                      </span>

                      {cat.description && (
                        <span className="text-xs text-gray-500 mt-1">
                          {cat.description}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-700">
                      {getProductCountForCategory(cat.id)} Produk
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">

                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                      >
                        <MdEdit size={18} />
                      </button>

                      <button
                        onClick={() => handleOpenDelete(cat)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                      >
                        <MdDelete size={18} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t bg-white">

          <span className="text-sm text-gray-500">
            Menampilkan {paginatedCategories.length} dari{' '}
            {filteredCategories.length} kategori
          </span>

          <div className="flex items-center gap-2">

            <button
              disabled={currentPage <= 1}
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <MdChevronLeft />
            </button>

            <span className="text-sm text-gray-600 px-2">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <MdChevronRight />
            </button>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-6">
        © 2026 Nicky Frozen. All rights reserved.
      </div>

      {/* Modal Tambah/Edit */}
      <TambahKategoriModal
        isOpen={isTambahOpen}
        onClose={() => {
          setIsTambahOpen(false);
          setEditData(null);
        }}
        onSuccess={handleSuccessTambah}
        editData={editData}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title={successMessage}
        description=""
        buttonText="Selesai"
      />

      {/* Delete Modal */}
      <WarningModal
        isOpen={isDeleteWarningOpen}
        onClose={() => {
          setIsDeleteWarningOpen(false);
          setDeleteTarget(null);
        }}
        title="Hapus Kategori?"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteTarget?.name}"? Kategori akan dihapus dari semua produk yang menggunakannya.`}
        buttonText="Ya, Hapus"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}