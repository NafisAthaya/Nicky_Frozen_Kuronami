import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios';
import WarningModal from '../../components/admin/WarningModal';

export default function CabangToko() {
  // State API
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newHours, setNewHours] = useState('08:00 - 21:00');

  // Fetch Data
  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/owner/cabang');
      setBranches(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data cabang:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();

    const handleGlobalSync = () => fetchBranches();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  const totalBranches = branches.length;
  const activeBranches = branches.filter((b) => b.status === 'Buka').length;

  // Handlers
  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) return;
    setIsSaving(true);

    try {
      const payload = {
        nama_cabang: newName,
        alamat: newAddress,
        jam_operasional: newHours
      };

      const response = await axiosInstance.post('/owner/cabang', payload);
      setBranches([...branches, response.data.data]);
      
      setShowAddModal(false);
      setShowSuccessModal(true);
      window.dispatchEvent(new Event('global-sync'));

      // Clear form
      setNewName('');
      setNewAddress('');
      setNewHours('08:00 - 21:00');
    } catch (error) {
      console.error("Gagal menyimpan cabang:", error);
      const errMsg = error.response?.data?.message || error.message;
      toast.error(`Gagal menyimpan data: ${errMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDeleteBranch = (id) => {
    setBranchToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBranch = async () => {
    if (!branchToDelete) return;
    const id = branchToDelete;
    setIsDeleteModalOpen(false);
    setBranchToDelete(null);

    // Optimistic UI Update
    setBranches(branches.filter((b) => b.id !== id));

    try {
      await axiosInstance.delete(`/owner/cabang/${id}`);
    } catch (error) {
      console.error("Gagal menghapus cabang:", error);
      fetchBranches(); // Rollback jika gagal
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    // Optimistic UI Update
    setBranches(
      branches.map((b) =>
        b.id === id ? { ...b, status: b.status === 'Buka' ? 'Tutup/Renovasi' : 'Buka' } : b
      )
    );

    try {
      await axiosInstance.put(`/owner/cabang/${id}/toggle`);
    } catch (error) {
      console.error("Gagal mengubah status cabang:", error);
      // Rollback jika gagal
      setBranches(
        branches.map((b) =>
          b.id === id ? { ...b, status: currentStatus } : b
        )
      );
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Memuat daftar cabang toko...</div>;
  }

  return (
    <div className="animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Cabang Toko</h1>
          <p className="text-sm text-gray-500">Kelola informasi operasional, lokasi, dan status seluruh cabang Nicky Frozen.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#0052cc] text-white text-sm font-bold rounded-2xl hover:bg-[#0047b3] transition-all shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Cabang Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Cabang */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Cabang</p>
            <p className="text-2xl font-black text-slate-800">{totalBranches} Cabang</p>
          </div>
        </div>

        {/* Cabang Aktif */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cabang Aktif</p>
            <p className="text-2xl font-black text-green-600">{activeBranches} Beroperasi</p>
          </div>
        </div>
      </div>

      {/* Table of Branches */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-black tracking-wider">
              <th className="px-6 py-4">ID & Nama Cabang</th>
              <th className="px-6 py-4">Alamat</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {branches.length > 0 ? branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div>
                    <span className="text-xs font-bold text-slate-400">CBG-{branch.id.toString().padStart(3, '0')}</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{branch.nama_cabang}</p>
                    <span className="text-[10px] font-semibold text-slate-400">Manajer: {branch.manajer || '-'}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-500 max-w-xs leading-relaxed">
                  {branch.alamat}
                </td>
                <td className="px-6 py-5 text-center">
                  <button
                    onClick={() => toggleStatus(branch.id, branch.status)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                      branch.status === 'Buka'
                        ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${branch.status === 'Buka' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                    {branch.status}
                  </button>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => triggerDeleteBranch(branch.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                  Belum ada cabang yang terdaftar di sistem.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Tambah Cabang Baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAddBranch}
            className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-scaleIn"
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Tambah Cabang Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[70vh]">
              {/* Nama Cabang */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nama Cabang *</label>
                <input
                  type="text"
                  required
                  placeholder="Mis: Nicky Frozen Sudirman"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Alamat Lengkap *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Masukkan alamat lengkap cabang..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                />
              </div>

              {/* Jam Operasional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Jam Operasional</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Mis: 08:00 - 21:00"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-white text-slate-600 text-xs font-bold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-100 disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Cabang'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Success */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Cabang Berhasil Ditambahkan!</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">
              Data cabang baru telah berhasil disimpan ke database. Anda sekarang dapat mengelola stok dan transaksi untuk cabang ini.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Warning Modal Delete */}
      <WarningModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Cabang"
        description="Peringatan: Menghapus cabang mungkin akan mempengaruhi data transaksi yang terkait. Lanjutkan?"
        buttonText="Ya, Hapus"
        onConfirm={confirmDeleteBranch}
      />
    </div>
  );
}