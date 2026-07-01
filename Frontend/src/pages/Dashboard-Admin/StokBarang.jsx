import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdFilterList,
  MdAdd,
  MdEdit,
  MdDelete,
} from 'react-icons/md';

import { fetchProduks, deleteProduk, fetchKategoris } from '../../services/adminApi';
import FilterModal from '../../components/admin/FilterModal';
import TambahProdukModal from '../../components/admin/TambahProdukModal';
import SuccessModal from '../../components/admin/SuccessModal.jsx';
import WarningModal from '../../components/admin/WarningModal';

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID').format(number);
}

function getStockStatus(stock) {
  if (stock <= 0)
    return {
      label: 'Habis',
      bg: 'bg-red-100',
      text: 'text-red-600',
    };

  if (stock < 10)
    return {
      label: 'Stok Rendah',
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
    };

  return {
    label: 'Tersedia',
    bg: 'bg-green-100',
    text: 'text-green-700',
  };
}

function getProductEmoji(categoryNames = '') {
  const lower = categoryNames.toLowerCase();

  if (lower.includes('daging')) return '🥩';
  if (lower.includes('ayam')) return '🍗';
  if (lower.includes('ikan')) return '🐟';
  if (lower.includes('sayur')) return '🥬';
  if (lower.includes('cemilan')) return '🍟';
  if (lower.includes('minuman')) return '🥤';

  return '📦';
}

export default function StokBarang() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = useState(false);

  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');

  const [activeFilter, setActiveFilter] = useState({
    pilihSemua: false,
    selectedCategoryNames: [],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const prods = await fetchProduks();
      setProducts(prods);
      const kats = await fetchKategoris();
      setKategoris(kats);
    } catch (error) {
      console.error('Gagal memuat produk', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (
      activeFilter.pilihSemua ||
      activeFilter.selectedCategoryNames.length === 0
    ) {
      return products;
    }

    return products.filter((p) =>
      activeFilter.selectedCategoryNames.includes(p.kategori)
    );
  }, [products, activeFilter]);

  const handleApplyFilter = (filters) => {
    // Note: FilterModal needs to return selectedCategoryNames instead of IDs
    setActiveFilter(filters);
  };

  const handleOpenTambah = () => {
    setEditData(null);
    setIsTambahOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditData(product);
    setIsTambahOpen(true);
  };

  const handleSuccessTambah = () => {
    setIsTambahOpen(false);

    setSuccessMessage(
      editData
        ? 'Produk Berhasil Diperbarui!'
        : 'Produk Baru Berhasil Ditambahkan!'
    );

    setIsSuccessOpen(true);
    setEditData(null);
    loadData(); // Reload data after success
  };

  const handleOpenDelete = (product) => {
    setDeleteTarget(product);
    setIsDeleteWarningOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteProduk(deleteTarget.id);
        setSuccessMessage('Produk Berhasil Dihapus!');
        setIsSuccessOpen(true);
        loadData();
      } catch (error) {
        console.error('Gagal menghapus', error);
      }
    }

    setDeleteTarget(null);
    setIsDeleteWarningOpen(false);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold text-[#082B7A]">
          Stok Barang
        </h1>

        <div className="flex items-center gap-3">

          <button
            onClick={() => setIsFilterOpen(true)}
            className="
              flex items-center gap-2
              px-4 h-10
              bg-white
              border
              rounded-xl
              hover:bg-gray-50
            "
          >
            <MdFilterList />

            Filter

            {activeFilter.selectedCategoryNames.length > 0 &&
              !activeFilter.pilihSemua && (
                <span className="
                  w-5 h-5
                  rounded-full
                  bg-orange-500
                  text-white
                  text-[10px]
                  font-bold
                  flex items-center justify-center
                ">
                  {activeFilter.selectedCategoryNames.length}
                </span>
              )}
          </button>

          <button
            onClick={handleOpenTambah}
            className="
              flex items-center gap-2
              px-4 h-10
              bg-orange-500
              hover:bg-orange-600
              text-white
              rounded-xl
            "
          >
            <MdAdd />
            Tambah Produk Baru
          </button>

          <button
            onClick={() => navigate('/admin/pengajuan-stok')}
            className="
              px-4 py-2
              bg-[#082B7A]
              hover:bg-[#0B3B91]
              text-white
              rounded-xl
              text-sm
              font-medium
            "
          >
            Pengajuan
            <br />
            Stok Barang
          </button>

        </div>

      </div>

      {/* Table */}
      <div className="
        bg-white
        border
        rounded-3xl
        overflow-hidden
        shadow-sm
      ">

        <table className="w-full">

          <thead>

            <tr className="border-b bg-gray-50">

              <th className="px-5 py-4 text-left text-sm font-bold">
                Produk
              </th>

              <th className="px-5 py-4 text-left text-sm font-bold">
                SKU
              </th>

              <th className="px-5 py-4 text-left text-sm font-bold">
                Kategori
              </th>

              <th className="px-5 py-4 text-left text-sm font-bold">
                Harga Jual
              </th>

              <th className="px-5 py-4 text-left text-sm font-bold">
                Stok & Status
              </th>

              <th className="px-5 py-4 text-left text-sm font-bold">
                Tindakan
              </th>

            </tr>

          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-20 text-gray-500">Memuat data produk...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (

              <tr>

                <td colSpan={6}>

                  <div className="
                    flex
                    items-center
                    justify-center
                    py-20
                    text-gray-500
                  ">
                    {products.length === 0
                      ? 'Belum ada data produk. Klik "Tambah Produk Baru" untuk memulai.'
                      : 'Tidak ada produk yang cocok dengan filter.'}
                  </div>

                </td>

              </tr>

            ) : (

              filteredProducts.map((product) => {
                const categoryNames = product.kategori || '-';

                const status =
                  getStockStatus(product.stok_total);

                const emoji =
                  getProductEmoji(categoryNames);

                return (
                  <tr
                    key={product.id}
                    className="
                      border-b
                      hover:bg-gray-50
                    "
                  >
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="
                          w-10 h-10
                          rounded-xl
                          bg-gray-100
                          flex items-center justify-center
                        ">
                          <span className="text-xl">
                            {emoji}
                          </span>
                        </div>

                        <div>

                          <p className="font-semibold text-[#082B7A]">
                            {product.nama_produk}
                          </p>

                          <p className="text-xs text-gray-500">
                            {categoryNames}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-gray-600">
                      {product.sku}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {categoryNames}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      Rp {formatRupiah(product.harga_jual)}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex flex-col gap-1">

                        <span className="font-bold">
                          {product.stok_total} Pcs
                        </span>

                        <span className={`
                          inline-block
                          w-fit
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-semibold
                          ${status.bg}
                          ${status.text}
                        `}>
                          {status.label}
                        </span>

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleOpenEdit(product)
                          }
                          className="
                            w-9 h-9
                            rounded-xl
                            border
                            flex items-center justify-center
                            text-blue-600
                            hover:bg-blue-50
                          "
                        >
                          <MdEdit />
                        </button>

                        <button
                          onClick={() =>
                            handleOpenDelete(product)
                          }
                          className="
                            w-9 h-9
                            rounded-xl
                            border
                            flex items-center justify-center
                            text-red-600
                            hover:bg-red-50
                          "
                        >
                          <MdDelete />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <footer className="
        text-center
        text-sm
        text-gray-400
        mt-8
      ">
        © 2026 Nicky Frozen. All rights reserved.
      </footer>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilter}
        kategoris={kategoris}
      />

      <TambahProdukModal
        isOpen={isTambahOpen}
        onClose={() => {
          setIsTambahOpen(false);
          setEditData(null);
        }}
        onSuccess={handleSuccessTambah}
        editData={editData}
        kategoris={kategoris}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title={successMessage}
        description=""
        buttonText="Tutup"
      />

      <WarningModal
        isOpen={isDeleteWarningOpen}
        onClose={() => {
          setIsDeleteWarningOpen(false);
          setDeleteTarget(null);
        }}
        title="Hapus Produk?"
        description={`Apakah Anda yakin ingin menghapus produk "${deleteTarget?.nama_produk}"? Data stok dan riwayat masuk terkait juga akan dihapus.`}
        buttonText="Ya, Hapus"
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}