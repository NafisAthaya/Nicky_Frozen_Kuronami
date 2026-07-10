import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';

export default function PajakPembulatan() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // State untuk Cabang
  const [cabangList, setCabangList] = useState([]);
  const [selectedCabang, setSelectedCabang] = useState('');

  // State Utama Pengaturan
  const [settings, setSettings] = useState({
    pajak_persen: 0,
    layanan_persen: 0,
    harga_termasuk_pajak: false,
    aktifkan_pembulatan: false,
    nominal_pembulatan: 500,
    arah_pembulatan: 'terdekat',
  });

  // 1. Fetch Daftar Cabang saat halaman pertama dimuat
  useEffect(() => {
    const fetchCabang = async () => {
      try {
        const response = await axiosInstance.get('/owner/cabang');
        const list = response.data.data || [];
        setCabangList(list);
        
        if (list.length > 0 && !selectedCabang) {
          setSelectedCabang(list[0].id);
        }
      } catch (error) {
        console.error("Gagal mengambil data cabang:", error);
        setIsLoading(false);
      }
    };
    fetchCabang();
    window.addEventListener('global-sync', fetchCabang);
    return () => window.removeEventListener('global-sync', fetchCabang);
  }, []);

  // 2. Fetch Pengaturan setiap kali dropdown Cabang diganti
  useEffect(() => {
    if (!selectedCabang) return; // Tunggu sampai ada cabang yang dipilih

    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Kirim cabang_id yang dipilih ke backend
        const response = await axiosInstance.get(`/owner/pengaturan-toko?cabang_id=${selectedCabang}`);
        if (response.data.data) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data pengaturan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();

    const handleGlobalSync = () => fetchSettings();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, [selectedCabang]);

  // Simpan perubahan ke database
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Sisipkan cabang_id agar backend tahu pengaturan ini untuk cabang yang mana
      // Gunakan POST sesuai definisi route di api.php
      await axiosInstance.post('/owner/pengaturan-toko', { ...settings, cabang_id: selectedCabang });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Gagal menyimpan pengaturan ke server.";
      alert(`Oops! ${errMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper untuk Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
        checked ? 'bg-[#0B3B91]' : 'bg-gray-300'
      }`}
    >
      <span 
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
          checked ? 'left-6' : 'left-1'
        }`} 
      />
    </button>
  );

  return (
    <div className="animate-fadeIn p-6 max-w-4xl mx-auto pb-20">
      
      {/* Header & Filter Cabang */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Pajak & Pembulatan</h1>
          <p className="text-sm text-slate-500">Atur aturan perhitungan pajak, biaya layanan, dan pembulatan per cabang.</p>
        </div>

        {/* Dropdown Filter Cabang */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <span className="pl-3 text-sm font-bold text-slate-700">Cabang:</span>
          <select 
            value={selectedCabang}
            onChange={(e) => setSelectedCabang(e.target.value)}
            className="pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0B3B91] focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
            disabled={isLoading || cabangList.length === 0}
          >
            {cabangList.length > 0 ? (
              cabangList.map(cabang => (
                <option key={cabang.id} value={cabang.id}>{cabang.nama_cabang}</option>
              ))
            ) : (
              <option value="">Memuat cabang...</option>
            )}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-[24px] border border-slate-100 p-12 text-center text-slate-500 animate-pulse font-medium shadow-sm">
          Memuat pengaturan toko untuk cabang terpilih...
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* CARD 1: PAJAK & BIAYA LAYANAN */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Pajak & Biaya Layanan</h3>
                <p className="text-xs text-slate-500 mt-1">Ditambahkan secara otomatis ke setiap transaksi pesanan.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Input Pajak */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">Pajak (PB1 / PPN)</p>
                  <p className="text-xs text-slate-400 mt-1">Persentase pajak yang dikenakan.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input 
                      type="number" 
                      min="0" max="100"
                      value={settings.pajak_persen}
                      onChange={(e) => setSettings({...settings, pajak_persen: e.target.value})}
                      className="w-24 pl-4 pr-8 py-2.5 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Input Biaya Layanan */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">Biaya Layanan</p>
                  <p className="text-xs text-slate-400 mt-1">Service charge opsional.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input 
                      type="number" 
                      min="0" max="100"
                      value={settings.layanan_persen}
                      onChange={(e) => setSettings({...settings, layanan_persen: e.target.value})}
                      className="w-24 pl-4 pr-8 py-2.5 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Toggle Harga Termasuk Pajak */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">Harga Termasuk Pajak</p>
                  <p className="text-xs text-slate-400 mt-1">Jika aktif, harga produk di menu sudah termasuk nilai pajak di atas.</p>
                </div>
                <ToggleSwitch 
                  checked={settings.harga_termasuk_pajak} 
                  onChange={() => setSettings({...settings, harga_termasuk_pajak: !settings.harga_termasuk_pajak})}
                />
              </div>
            </div>
          </div>

          {/* CARD 2: ATURAN PEMBULATAN */}
          <div className={`bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm transition-all duration-300 ${!settings.aktifkan_pembulatan ? 'opacity-80' : ''}`}>
            
            {/* Header & Main Toggle */}
            <div className="flex items-start justify-between gap-4 mb-8">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${settings.aktifkan_pembulatan ? 'bg-orange-50 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Aturan Pembulatan</h3>
                  <p className="text-xs text-slate-500 mt-1">Mencegah kembalian koin receh dengan membulatkan total pembayaran.</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={settings.aktifkan_pembulatan} 
                onChange={() => setSettings({...settings, aktifkan_pembulatan: !settings.aktifkan_pembulatan})}
              />
            </div>

            {/* Konfigurasi Pembulatan */}
            <div className={`space-y-8 ${!settings.aktifkan_pembulatan ? 'pointer-events-none grayscale-[50%]' : ''}`}>
              
              {/* Pilihan Nominal Kelipatan */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4">Nominal Pembulatan</h4>
                <div className="space-y-3">
                  {[100, 500, 1000].map(nominal => (
                    <div 
                      key={nominal}
                      onClick={() => setSettings({...settings, nominal_pembulatan: nominal})}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${settings.nominal_pembulatan === nominal ? 'border-[#0B3B91] bg-blue-50/30' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${settings.nominal_pembulatan === nominal ? 'border-[#0B3B91]' : 'border-slate-300'}`}>
                        {settings.nominal_pembulatan === nominal && <div className="w-2.5 h-2.5 bg-[#0B3B91] rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Kelipatan Rp {nominal.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Cth: Rp 15.234 &rarr; Rp 15.000 / Rp 15.{nominal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pilihan Arah Pembulatan */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4">Arah Pembulatan</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'bawah', label: 'Selalu ke Bawah', icon: 'M19 13l-7 7-7-7m14-8l-7 7-7-7' },
                    { id: 'terdekat', label: 'Terdekat', icon: 'M8 9l4-4 4 4m0 6l-4 4-4-4' },
                    { id: 'atas', label: 'Selalu ke Atas', icon: 'M5 11l7-7 7 7M5 19l7-7 7 7' }
                  ].map(arah => (
                    <div 
                      key={arah.id}
                      onClick={() => setSettings({...settings, arah_pembulatan: arah.id})}
                      className={`border rounded-2xl p-4 text-center cursor-pointer transition-all ${settings.arah_pembulatan === arah.id ? 'border-[#0B3B91] text-[#0B3B91] shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={arah.icon} />
                      </svg>
                      <span className="text-xs font-bold">{arah.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Floating Action Bar (Save) */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-260px)] bg-white border-t border-slate-200 p-4 px-8 flex justify-end gap-3 z-30">
        {showSuccess && (
          <div className="flex items-center gap-2 text-green-600 mr-4 animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-bold">Disimpan!</span>
          </div>
        )}
        <button 
          onClick={() => window.location.reload()}
          disabled={isLoading || isSaving}
          className="px-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Batal
        </button>
        <button 
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="px-8 py-2.5 text-sm font-bold text-white bg-[#f26f21] rounded-xl hover:bg-[#ff7b2b] transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}