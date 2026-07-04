import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios';

export default function PajakPembulatan() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // State Utama Pengaturan
  const [settings, setSettings] = useState({
    pajak_persen: 0,
    layanan_persen: 0,
    harga_termasuk_pajak: false,
    aktifkan_pembulatan: false,
    nominal_pembulatan: 500,
    arah_pembulatan: 'terdekat',
  });

  // Fetch data dari database saat halaman dimuat
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/owner/pengaturan-toko');
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
  }, []);

  // Simpan perubahan ke database
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post('/owner/pengaturan-toko', settings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan ke server.");
      console.error(error);
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
        checked ? 'bg-[#0052cc]' : 'bg-gray-300'
      }`}
    >
      <span 
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
          checked ? 'left-6' : 'left-1'
        }`} 
      />
    </button>
  );

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse font-medium">Memuat pengaturan toko...</div>;
  }

  return (
    <div className="animate-fadeIn w-full pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Pengaturan Toko - Pajak & Pembulatan</h1>
        <p className="text-sm text-slate-500">Atur aturan perhitungan pajak, biaya layanan, dan pembulatan total harga.</p>
      </div>

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
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                  Saat ini: {settings.pajak_persen}%
                </span>
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
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                  Saat ini: {settings.layanan_persen}%
                </span>
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

          {/* Konfigurasi Pembulatan (Hanya bisa diklik jika toggle aktif) */}
          <div className={`space-y-8 ${!settings.aktifkan_pembulatan ? 'pointer-events-none grayscale-[50%]' : ''}`}>
            
            {/* Pilihan Nominal Kelipatan */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4">Nominal Pembulatan</h4>
              <div className="space-y-3">
                {/* 100 */}
                <div 
                  onClick={() => setSettings({...settings, nominal_pembulatan: 100})}
                  className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${settings.nominal_pembulatan === 100 ? 'border-[#0052cc] bg-blue-50/30' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${settings.nominal_pembulatan === 100 ? 'border-[#0052cc]' : 'border-slate-300'}`}>
                    {settings.nominal_pembulatan === 100 && <div className="w-2.5 h-2.5 bg-[#0052cc] rounded-full" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Kelipatan Rp 100</p>
                    <p className="text-xs text-slate-400 mt-0.5">Cth: Rp 15.234 &rarr; Rp 15.200 / Rp 15.300</p>
                  </div>
                </div>

                {/* 500 */}
                <div 
                  onClick={() => setSettings({...settings, nominal_pembulatan: 500})}
                  className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${settings.nominal_pembulatan === 500 ? 'border-[#0052cc] bg-blue-50/30' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${settings.nominal_pembulatan === 500 ? 'border-[#0052cc]' : 'border-slate-300'}`}>
                    {settings.nominal_pembulatan === 500 && <div className="w-2.5 h-2.5 bg-[#0052cc] rounded-full" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Kelipatan Rp 500</p>
                    <p className="text-xs text-slate-400 mt-0.5">Cth: Rp 15.234 &rarr; Rp 15.000 / Rp 15.500</p>
                  </div>
                </div>

                {/* 1000 */}
                <div 
                  onClick={() => setSettings({...settings, nominal_pembulatan: 1000})}
                  className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${settings.nominal_pembulatan === 1000 ? 'border-[#0052cc] bg-blue-50/30' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${settings.nominal_pembulatan === 1000 ? 'border-[#0052cc]' : 'border-slate-300'}`}>
                    {settings.nominal_pembulatan === 1000 && <div className="w-2.5 h-2.5 bg-[#0052cc] rounded-full" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Kelipatan Rp 1.000</p>
                    <p className="text-xs text-slate-400 mt-0.5">Cth: Rp 15.234 &rarr; Rp 15.000 / Rp 16.000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pilihan Arah Pembulatan */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4">Arah Pembulatan</h4>
              <div className="grid grid-cols-3 gap-4">
                {/* Selalu ke Bawah */}
                <div 
                  onClick={() => setSettings({...settings, arah_pembulatan: 'bawah'})}
                  className={`border rounded-2xl p-4 text-center cursor-pointer transition-all ${settings.arah_pembulatan === 'bawah' ? 'border-[#0052cc] text-[#0052cc] shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                  </svg>
                  <span className="text-xs font-bold">Selalu ke Bawah</span>
                </div>

                {/* Terdekat */}
                <div 
                  onClick={() => setSettings({...settings, arah_pembulatan: 'terdekat'})}
                  className={`border rounded-2xl p-4 text-center cursor-pointer transition-all ${settings.arah_pembulatan === 'terdekat' ? 'border-[#0052cc] text-[#0052cc] shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                  <span className="text-xs font-bold">Terdekat</span>
                </div>

                {/* Selalu ke Atas */}
                <div 
                  onClick={() => setSettings({...settings, arah_pembulatan: 'atas'})}
                  className={`border rounded-2xl p-4 text-center cursor-pointer transition-all ${settings.arah_pembulatan === 'atas' ? 'border-[#0052cc] text-[#0052cc] shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                  </svg>
                  <span className="text-xs font-bold">Selalu ke Atas</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Action Bar (Save) */}
      <div className="fixed bottom-0 right-0 w-[calc(100%-260px)] bg-white border-t border-slate-200 p-4 px-8 flex justify-end gap-3 z-30">
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
          className="px-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Batal
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-2.5 text-sm font-bold text-white bg-[#f26f21] rounded-xl hover:bg-[#ff7b2b] transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
      </div>

    </div>
  );
}