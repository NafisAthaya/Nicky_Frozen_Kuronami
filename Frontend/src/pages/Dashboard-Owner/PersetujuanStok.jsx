import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi';
import axiosInstance from '../../api/axios';

export default function PersetujuanStokOwner() {
  const { token } = useAuthStore();
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Custom Modal
  const [modalConfig, setModalConfig] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchPengajuan = async () => {
    try {
      const res = await axiosInstance.get('/owner/pengajuan-stok');
      const data = res.data;
      if (data.status === 'success') {
        setPengajuan(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPengajuan();

    const handleGlobalSync = () => { if (token) fetchPengajuan(); };
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, [token]);

  const handleActionClick = (id, status) => {
    setModalConfig({ id, status });
  };

  const submitAction = async () => {
    if (!modalConfig) return;
    const { id, status } = modalConfig;
    
    if (status === 'disetujui') {
      // Tidak perlu cek expiredDate di sini karena sudah diset oleh admin
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.put(`/owner/pengajuan-stok/${id}`, { 
        status
      });
      const result = res.data;
      
      if (result.status === 'success') {
        setFeedback({ type: 'success', text: result.message });
        fetchPengajuan(); // refresh data
        setModalConfig(null);
      } else {
        setFeedback({ type: 'error', text: result.message || 'Terjadi kesalahan' });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ 
        type: 'error', 
        text: err.response?.data?.message || 'Gagal memproses permintaan' 
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[calc(100vh-120px)]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Persetujuan Stok</h1>
          <p className="text-gray-500">Tinjau dan setujui permintaan penambahan stok dari Admin.</p>
        </div>
      </div>

      {feedback && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {feedback.type === 'success' ? <HiOutlineCheckCircle className="text-xl" /> : <HiOutlineXCircle className="text-xl" />}
          <span className="font-medium text-sm">{feedback.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#082B7A]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Produk</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Jumlah Diajukan</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Catatan Admin</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Tanggal</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pengajuan.length > 0 ? pengajuan.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">#{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{item.produk?.nama_produk}</div>
                    <div className="text-xs text-gray-500">SKU: {item.produk?.sku}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm">
                      +{item.jumlah_request}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                    {item.catatan || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    {item.status?.toLowerCase() === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        <HiOutlineClock /> Pending
                      </span>
                    )}
                    {item.status?.toLowerCase() === 'disetujui' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <HiOutlineCheckCircle /> Disetujui
                      </span>
                    )}
                    {item.status?.toLowerCase() === 'ditolak' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        <HiOutlineXCircle /> Ditolak
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center gap-2">
                    {item.status?.toLowerCase() === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleActionClick(item.id, 'disetujui')}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition shadow-sm"
                        >
                          Terima
                        </button>
                        <button
                          onClick={() => handleActionClick(item.id, 'ditolak')}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition"
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">Selesai</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Belum ada data pengajuan stok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {modalConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full mb-4 bg-gray-50">
              {modalConfig.status === 'disetujui' ? (
                <HiOutlineCheckCircle className="text-4xl text-green-500" />
              ) : (
                <HiOutlineXCircle className="text-4xl text-red-500" />
              )}
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Konfirmasi {modalConfig.status === 'disetujui' ? 'Persetujuan' : 'Penolakan'}
            </h3>
            
            <p className="text-center text-gray-500 text-sm mb-6">
              Apakah Anda yakin ingin <strong>{modalConfig.status === 'disetujui' ? 'menyetujui' : 'menolak'}</strong> pengajuan stok ini?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setModalConfig(null)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={submitAction}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 font-bold rounded-xl text-white transition-all shadow-lg ${
                  modalConfig.status === 'disetujui'
                    ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
                    : 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                }`}
              >
                {isSubmitting ? 'Memproses...' : 'Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
