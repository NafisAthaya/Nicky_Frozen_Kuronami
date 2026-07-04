import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios';
import WarningModal from '../../components/admin/WarningModal';

export default function DiskonOtomatis() {
  const [mainToggle, setMainToggle] = useState(true);
  
  // State API
  const [rules, setRules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State Form
  const [pemicu, setPemicu] = useState('3');
  const [diskon, setDiskon] = useState('25');
  const [terapkan, setTerapkan] = useState('Semua Kategori');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  
  // State Modal Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  // Ambil Data dari Database
  const fetchData = async () => {
    try {
      const [rulesRes, catsRes] = await Promise.all([
        axiosInstance.get('/owner/diskon-rules'),
        axiosInstance.get('/owner/kategoris')
      ]);
      setRules(rulesRes.data.data);
      setCategories(catsRes.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleGlobalSync = () => fetchData();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  // Simpan Aturan Baru ke Database
  const handleCreateRule = async () => {
    if (!pemicu || !diskon) return;
    setIsSaving(true);

    try {
      const payload = {
        nama_aturan: `Aturan ${terapkan}`,
        pemicu_hari: pemicu,
        diskon_persen: diskon,
        target_kategori: terapkan
      };

      const response = await axiosInstance.post('/owner/diskon-rules', payload);
      // Tambahkan data baru dari database langsung ke barisan teratas UI
      setRules([response.data.data, ...rules]); 
      setIsSuccessOpen(true);
      
      // Reset Form
      setPemicu('');
      setDiskon('');
    } catch (error) {
      console.error("Gagal menyimpan aturan:", error);
      toast.error('Gagal menyimpan aturan ke server.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Aktif/Nonaktif di Database
  const toggleRule = async (id, currentStatus) => {
    // Optimistic Update (Ubah UI dulu biar kerasa cepat)
    setRules(rules.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r));
    
    try {
      await axiosInstance.patch(`/owner/diskon-rules/${id}/toggle`);
    } catch (error) {
      console.error("Gagal toggle aturan:", error);
      // Rollback jika server gagal
      setRules(rules.map(r => r.id === id ? { ...r, is_active: currentStatus } : r));
    }
  };

  // Hapus Aturan dari Database
  const triggerDeleteRule = (id) => {
    setRuleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRule = async () => {
    if (!ruleToDelete) return;
    const id = ruleToDelete;
    setIsDeleteModalOpen(false);
    setRuleToDelete(null);

    // Optimistic Update (Hapus dari UI dulu)
    setRules(rules.filter(r => r.id !== id));

    try {
      await axiosInstance.delete(`/owner/diskon-rules/${id}`);
    } catch (error) {
      console.error("Gagal hapus aturan:", error);
      fetchData(); // Muat ulang dari server jika gagal
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Menarik data aturan diskon dari server...</div>;
  }

  return (
    <div className="animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diskon Otomatis</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola penurunan harga produk yang mendekati masa kedaluwarsa.
          </p>
        </div>
        {/* Main Toggle */}
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 shadow-sm flex items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Sakelar Utama</p>
            <p className="text-xs text-gray-400">Aktifkan penurunan harga otomatis secara global</p>
          </div>
          <button
            onClick={() => setMainToggle(!mainToggle)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${mainToggle ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${mainToggle ? 'left-7' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left: Create New Rule */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Buat Aturan Baru</h2>
          </div>

          <div className="space-y-5">
            {/* Pemicu Aturan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pemicu Aturan</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={pemicu}
                  onChange={(e) => setPemicu(e.target.value)}
                  className="w-20 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-center"
                />
                <span className="text-sm text-gray-500">Hari</span>
                <span className="text-sm font-semibold text-gray-700">H -</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Sebelum tanggal kedaluwarsa</p>
            </div>

            {/* Jumlah Diskon */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Diskon</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={diskon}
                  onChange={(e) => setDiskon(e.target.value)}
                  className="w-24 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-center"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>

            {/* Terapkan Ke */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Terapkan Ke Kategori</label>
              <select
                value={terapkan}
                onChange={(e) => setTerapkan(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white"
              >
                <option value="Semua Kategori">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name || cat.nama_kategori}>
                    {cat.name || cat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button 
              onClick={handleCreateRule}
              disabled={isSaving || !pemicu || !diskon}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#f26f21] text-white text-sm font-semibold rounded-xl hover:bg-[#ff7b2b] transition-all shadow-md mt-2 disabled:opacity-50"
            >
              {isSaving ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              {isSaving ? 'Menyimpan...' : 'Aktifkan Aturan'}
            </button>

          </div>
        </div>

        {/* Right: Active Configurations */}
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Konfigurasi Tersimpan</h2>
          <div className="space-y-4">
            {rules.length > 0 ? rules.map((rule) => (
              <div key={rule.id} className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm transition-all ${!rule.is_active ? 'opacity-60 grayscale-[30%]' : ''}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{rule.nama_aturan}</h3>
                      <p className="text-sm text-gray-500">
                        Pemicu H-{rule.pemicu_hari} dengan <span className="text-blue-600 font-semibold">Diskon {rule.diskon_persen}%</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wide">
                          {rule.target_kategori}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {rule.is_active ? 'AKTIF' : 'TIDAK AKTIF'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Delete */}
                    <button 
                      onClick={() => triggerDeleteRule(rule.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    {/* Toggle Database */}
                    <button
                      onClick={() => toggleRule(rule.id, rule.is_active)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${rule.is_active ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${rule.is_active ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm text-center">
                <p className="text-sm text-gray-500 font-medium">Belum ada aturan diskon yang dibuat.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Aturan Berhasil Diaktifkan */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-6 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">Aturan Diaktifkan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">
              Aturan diskon otomatis baru berhasil disimpan dan akan langsung berjalan pada *server*.
            </p>

            <button 
              onClick={() => setIsSuccessOpen(false)}
              className="w-full bg-[#0B3B91] hover:bg-blue-900 text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
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
        title="Hapus Aturan"
        description="Yakin ingin menghapus aturan ini? Aturan ini akan dihapus permanen dan tidak dapat dikembalikan."
        buttonText="Ya, Hapus"
        onConfirm={confirmDeleteRule}
      />
    </div>
  );
}