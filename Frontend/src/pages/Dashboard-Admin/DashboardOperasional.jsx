import {
  MdInventory2,
  MdFilterList,
  MdTrendingUp,
  MdTrendingDown,
  MdWarningAmber,
} from 'react-icons/md';
import { useApp } from '../../context/AppContext';

function getExpiryClass(daysLeft) {
  if (daysLeft <= 3) return 'critical';
  if (daysLeft <= 5) return 'warning';
  return 'normal';
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID').format(number);
}

// Emoji based on category
function getProductEmoji(categoryNames) {
  const lower = (categoryNames || '').toLowerCase();
  if (lower.includes('daging') || lower.includes('meat')) return '🥩';
  if (lower.includes('ayam') || lower.includes('chicken')) return '🍗';
  if (lower.includes('ikan') || lower.includes('seafood') || lower.includes('fish')) return '🐟';
  if (lower.includes('sayur') || lower.includes('vegetable')) return '🥬';
  if (lower.includes('cemilan') || lower.includes('snack')) return '🍟';
  if (lower.includes('minuman') || lower.includes('drink')) return '🥤';
  return '📦';
}

export default function DashboardOperasional() {
  const { 
    getTotalProducts, 
    getExpiringProducts, 
    getExpiryLossEstimate,
    getTotalStock,
    getCategoryNames 
  } = useApp();

  const totalProducts = getTotalProducts();
  const totalStock = getTotalStock();
  const expiringProducts = getExpiringProducts(7);
  const expiryLoss = getExpiryLossEstimate(7);

return (
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      {/* Total Produk */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs uppercase font-semibold text-gray-500">
            Total Produk
          </span>

          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
            <MdInventory2 />
          </div>
        </div>

        <div className="text-4xl font-bold text-gray-800">
          {totalProducts > 0 ? formatRupiah(totalStock) : '0'}
        </div>

        <div className="flex items-center gap-1 text-green-600 text-sm mt-3">
          <MdTrendingUp />
          <span>{totalProducts} jenis produk terdaftar</span>
        </div>
      </div>

      {/* Kadaluwarsa */}
      <div
        className={`bg-white rounded-2xl p-6 shadow-sm ${
          expiringProducts.length > 0
            ? 'border-2 border-orange-500'
            : 'border'
        }`}
      >
        <div className="text-xs uppercase font-semibold text-gray-500 mb-3">
          Mendekati Kadaluwarsa (H-7)
        </div>

        <div className="text-4xl font-bold text-gray-800">
          {expiringProducts.length}
          <span className="text-lg font-normal ml-2">Produk</span>
        </div>

        {expiringProducts.length > 0 ? (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold mt-3">
            <MdWarningAmber />
            STATUS: PERLU TINDAKAN
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-600 text-sm mt-3">
            <MdTrendingUp />
            Aman, tidak ada produk kadaluwarsa
          </div>
        )}
      </div>

      {/* Kerugian */}
      <div
        className={`rounded-2xl p-6 shadow-sm ${
          expiryLoss > 0
            ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white'
            : 'bg-white border'
        }`}
      >
        <div className="text-xs uppercase font-semibold opacity-80 mb-3">
          Potensi Kerugian Kadaluwarsa
        </div>

        <div className="text-3xl font-bold">
          Rp {formatRupiah(expiryLoss)}
        </div>

        {expiryLoss > 0 ? (
          <div className="flex items-center gap-1 text-red-200 text-sm mt-3">
            <MdTrendingDown />
            Segera lakukan tindakan penjualan
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-600 text-sm mt-3">
            <MdTrendingUp />
            Tidak ada potensi kerugian
          </div>
        )}
      </div>
    </div>

    {/* Header */}
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-blue-900">
        Produk Mendekati Kadaluwarsa
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Data stok yang akan kedaluwarsa dalam 7 hari ke depan
      </p>
    </div>

    {/* Table */}
    <div className="bg-white rounded-2xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
              Produk
            </th>
            <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
              SKU
            </th>
            <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
              Sisa Stok
            </th>
            <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
              Tanggal Kadaluwarsa
            </th>
          </tr>
        </thead>

        <tbody>
          {expiringProducts.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-12 text-gray-500">
                {totalProducts === 0
                  ? 'Belum ada data produk.'
                  : '🎉 Tidak ada produk mendekati kadaluwarsa'}
              </td>
            </tr>
          ) : (
            expiringProducts.map((product) => {
              const expiryStatus = getExpiryClass(product.daysLeft);
              const categoryNames = getCategoryNames(product.categoryIds);
              const emoji = getProductEmoji(categoryNames);

              return (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                        {emoji}
                      </div>

                      <div>
                        <div className="font-semibold text-gray-800">
                          {product.name}
                        </div>

                        <div className="text-xs text-gray-400">
                          {categoryNames || '-'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {product.sku}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {product.stock} Pcs
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span
                        className={
                          expiryStatus === 'critical'
                            ? 'text-red-600 font-semibold'
                            : expiryStatus === 'warning'
                            ? 'text-orange-500 font-semibold'
                            : 'text-gray-600 font-semibold'
                        }
                      >
                        {formatDate(product.expiryDate)}
                      </span>

                      <span
                        className={
                          expiryStatus === 'critical'
                            ? 'text-red-600 text-xs'
                            : expiryStatus === 'warning'
                            ? 'text-orange-500 text-xs'
                            : 'text-gray-400 text-xs'
                        }
                      >
                        H-{product.daysLeft}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>

    <footer className="text-center text-xs text-gray-400 py-8">
      © 2026 Nicky Frozen. All rights reserved.
    </footer>
  </div>
);
}
