import { useState, useEffect } from 'react';
import {
  MdInventory2,
  MdFilterList,
  MdTrendingUp,
  MdTrendingDown,
} from 'react-icons/md';
import { fetchDashboardStats } from '../../services/adminApi';

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

// Fallback initial if image is broken
function getInitials(name) {
  return (name || 'P')
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

export default function DashboardOperasional() {
  const [stats, setStats] = useState({
    total_produk: 0,
    total_stok: 0,
    expiring_count: 0,
    expiring_produks: [],
    potensi_kerugian: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filterParams, setFilterParams] = useState({
    start_date: '',
    end_date: '',
    sort_expiry: 'asc',
  });

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardStats(filterParams);
        setStats(data);
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [filterParams]);

  const handleResetFilter = () => {
    setFilterParams({
      start_date: '',
      end_date: '',
      sort_expiry: 'asc',
    });
  };

  return (
    <div className="p-6 md:p-8 w-full relative">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Card 1: Total Produk */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[13px] font-bold text-gray-400">
                Total Produk
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#082B7A]">
                <MdInventory2 size={20} />
              </div>
            </div>
            <div className="text-[40px] leading-none font-bold text-[#0A1A3C]">
              {formatRupiah(stats.total_produk)}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-green-500 text-[13px] font-semibold mt-6">
            <MdTrendingUp size={16} />
            <span>+12 dari bulan lalu</span>
          </div>
        </div>

        {/* Card 2: Kadaluwarsa */}
        <div className="bg-white rounded-3xl border-2 border-orange-400 p-6 shadow-sm shadow-orange-100 flex flex-col justify-between">
          <div>
            <div className="text-[13px] font-bold text-gray-400 uppercase mb-2">
              Mendekati Kadaluwarsa (H-7)
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] leading-none font-bold text-[#0A1A3C]">
                {stats.expiring_count}
              </span>
              <span className="text-base text-gray-500 font-medium">Produk</span>
            </div>
          </div>
          <div className="mt-6">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[11px] font-bold uppercase rounded-lg">
              Status: Perlu Tindakan
            </span>
          </div>
        </div>

        {/* Card 3: Kerugian */}
        <div className="bg-gradient-to-br from-red-50/40 to-white rounded-3xl border border-red-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[13px] font-bold text-gray-400 uppercase mb-2">
              Potensi Kerugian Kadaluwarsa
            </div>
            <div className="text-[36px] leading-tight font-bold text-red-600">
              Rp {formatRupiah(stats.potensi_kerugian)}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-red-500 text-[13px] font-medium mt-6">
            <MdTrendingDown size={16} />
            <span>Menurun drastis setelah penjualan</span>
          </div>
        </div>

      </div>

      {/* Header Table */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div>
          <h2 className="text-[22px] font-bold text-[#082B7A]">
            Daftar Produk & Kadaluwarsa
          </h2>
          <p className="text-[14px] text-gray-500 mt-1">
            Data stok dan informasi tanggal kadaluwarsa produk
          </p>
        </div>

        {/* Filter Controls (Inline) */}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Dari Tanggal</label>
            <input 
              type="date"
              value={filterParams.start_date}
              onChange={(e) => setFilterParams({ ...filterParams, start_date: e.target.value })}
              className="h-10 px-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:border-[#082B7A]"
            />
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Sampai Tanggal</label>
            <input 
              type="date"
              value={filterParams.end_date}
              onChange={(e) => setFilterParams({ ...filterParams, end_date: e.target.value })}
              className="h-10 px-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:border-[#082B7A]"
            />
          </div>

          <button 
            onClick={handleResetFilter}
            className="h-10 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors whitespace-nowrap"
          >
            Semua
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-wider text-gray-500 w-[40%]">
                PRODUK
              </th>
              <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-wider text-gray-500 w-[20%]">
                SKU
              </th>
              <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-wider text-gray-500 w-[20%]">
                SISA STOK
              </th>
              <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-wider text-gray-500 w-[20%]">
                TANGGAL KADALUWARSA
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {stats.table_data && stats.table_data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-gray-400 font-medium">
                  Belum ada data produk untuk ditampilkan.
                </td>
              </tr>
            ) : (
              stats.table_data && stats.table_data.map((product) => {
                let expiryStatus = 'normal';
                if (product.days_left !== null) {
                   expiryStatus = getExpiryClass(product.days_left);
                }

                let dateColor = 'text-gray-700';
                let daysColor = 'text-gray-500';

                if (expiryStatus === 'critical') {
                  dateColor = 'text-red-600';
                  daysColor = 'text-red-600';
                } else if (expiryStatus === 'warning') {
                  dateColor = 'text-orange-600';
                  daysColor = 'text-orange-600';
                }

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Image */}
                        <div className="w-[52px] h-[52px] rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.gambar ? (
                            <img 
                              src={product.gambar} 
                              alt={product.nama_produk} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 font-bold text-lg">
                              {getInitials(product.nama_produk)}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold text-[#1a202c] text-[15px] truncate">
                            {product.nama_produk}
                          </div>
                          <div className="text-[13px] text-gray-400 truncate mt-0.5">
                            {product.kategori || '-'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-[14px] text-gray-500">
                        {product.sku || '-'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-[#1a202c] text-[15px]">
                        {product.stok_expiring} Pcs
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {product.expired_date ? (
                        <div className="flex flex-col">
                          <span className={`font-bold text-[15px] ${dateColor}`}>
                            {formatDate(product.expired_date)}
                          </span>
                          <span className={`text-[12px] font-bold mt-0.5 ${daysColor}`}>
                            {product.days_left >= 0 ? `H-${product.days_left}` : `Terlewat ${Math.abs(product.days_left)} hari`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm font-medium">Belum ada stok masuk</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
