import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdHistory,
  MdDateRange,
  MdQrCode,
  MdInventory,
} from 'react-icons/md';

import { fetchBatches } from '../../services/adminApi';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getProductEmoji(categoryNames = '') {
  const lower = categoryNames.toLowerCase();
  if (lower.includes('daging')) return '🥩';
  if (lower.includes('ayam')) return '🍗';
  if (lower.includes('ikan') || lower.includes('seafood')) return '🐟';
  if (lower.includes('sayur')) return '🥬';
  if (lower.includes('cemilan')) return '🍟';
  if (lower.includes('minuman')) return '🥤';
  return '📦';
}

export default function RiwayatBarangMasuk() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchBatches();
        setBatches(data);
      } catch (error) {
        console.error('Gagal memuat riwayat:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/admin/barang-masuk')}
        className="flex items-center gap-2 text-gray-500 hover:text-[#082B7A] transition mb-5"
      >
        <MdArrowBack />
        Kembali ke Form Barang Masuk
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#082B7A] flex items-center gap-3">
            <MdHistory className="text-4xl text-blue-500" />
            Riwayat Barang Masuk
          </h1>
          <p className="text-gray-500 mt-2">
            Catatan historis seluruh stok yang telah ditambahkan ke gudang cabang ini.
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20 bg-white border rounded-3xl text-gray-500">
            Memuat riwayat...
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-20 bg-white border rounded-3xl border-dashed">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdHistory size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              Belum Ada Riwayat
            </h3>
            <p className="text-gray-500">
              Riwayat barang masuk akan muncul di sini setelah Anda mencatat stok baru.
            </p>
          </div>
        ) : (
          batches.map((batch) => {
            const prod = batch.produk || {};
            const emoji = getProductEmoji(prod.kategori);

            return (
              <div 
                key={batch.id} 
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Decorative side accent */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500 group-hover:bg-blue-600 transition-colors" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">
                  
                  {/* Left: Product Info */}
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border flex items-center justify-center text-3xl shrink-0">
                      {emoji}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {prod.nama_produk || 'Produk Tidak Ditemukan'}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1 font-mono">
                          <MdQrCode /> {batch.barcode_custom}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <div>
                          {prod.kategori || 'Kategori N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex flex-wrap items-center gap-6 md:gap-10">
                    
                    <div>
                      <span className="block text-xs uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
                        <MdDateRange /> Tanggal Masuk
                      </span>
                      <span className="font-semibold text-gray-700">
                        {formatDate(batch.tanggal_masuk)}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs uppercase font-bold text-gray-400 mb-1">
                        Expired Date
                      </span>
                      <span className="font-semibold text-orange-600">
                        {formatDate(batch.expired_date)}
                      </span>
                    </div>

                    <div className="bg-green-50 px-5 py-3 rounded-2xl text-center min-w-[120px]">
                      <span className="block text-xs uppercase font-bold text-green-600 mb-1 flex items-center justify-center gap-1">
                        <MdInventory /> Stok Masuk
                      </span>
                      <span className="text-xl font-black text-green-700">
                        +{batch.stok}
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}