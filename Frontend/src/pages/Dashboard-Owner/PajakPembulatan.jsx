import { useState } from 'react';

export default function PajakPembulatan() {
  const [pajak, setPajak] = useState('10');
  const [biayaLayanan, setBiayaLayanan] = useState('5');
  const [hargaTermasukPajak, setHargaTermasukPajak] = useState(true);
  
  const [pembulatanAktif, setPembulatanAktif] = useState(true);
  const [nominalPembulatan, setNominalPembulatan] = useState('500'); // '100', '500', '1000'
  const [arahPembulatan, setArahPembulatan] = useState('terdekat'); // 'bawah', 'terdekat', 'atas'
  
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleSave = () => {
    setIsSuccessOpen(true);
  };

  return (
    <div className="animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Pengaturan Toko - Pajak & Pembulatan</h1>
        <p className="text-sm text-gray-500">Atur aturan perhitungan pajak, biaya layanan, dan pembulatan total harga.</p>
      </div>

      {/* Card 1: Pajak & Biaya Layanan */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Pajak & Biaya Layanan</h2>
            <p className="text-xs text-slate-400">Ditambahkan secara otomatis ke setiap transaksi pesanan.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pajak Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Pajak (PB1 / PPN)</label>
              <span className="text-xs text-slate-400">Persentase pajak yang dikenakan.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={pajak}
                  onChange={(e) => setPajak(e.target.value)}
                  className="w-24 px-3 py-2.5 pr-8 text-sm font-bold text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-center"
                />
                <span className="absolute right-3 text-xs font-bold text-slate-400">%</span>
              </div>
              <span className="text-xs font-semibold px-3 py-2 bg-slate-100 text-slate-600 rounded-xl">
                Saat ini: {pajak}%
              </span>
            </div>
          </div>

          {/* Biaya Layanan Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Biaya Layanan</label>
              <span className="text-xs text-slate-400">Service charge opsional.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={biayaLayanan}
                  onChange={(e) => setBiayaLayanan(e.target.value)}
                  className="w-24 px-3 py-2.5 pr-8 text-sm font-bold text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-center"
                />
                <span className="absolute right-3 text-xs font-bold text-slate-400">%</span>
              </div>
              <span className="text-xs font-semibold px-3 py-2 bg-slate-100 text-slate-600 rounded-xl">
                Saat ini: {biayaLayanan}%
              </span>
            </div>
          </div>

          {/* Harga Termasuk Pajak Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Harga Termasuk Pajak</label>
              <span className="text-xs text-slate-400">Jika aktif, harga produk di menu sudah termasuk nilai pajak di atas.</span>
            </div>
            <button
              onClick={() => setHargaTermasukPajak(!hargaTermasukPajak)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 ${hargaTermasukPajak ? 'bg-[#0052cc]' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${hargaTermasukPajak ? 'left-7' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Card 2: Aturan Pembulatan */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F26F21] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Aturan Pembulatan</h2>
              <p className="text-xs text-slate-400">Mencegah kembalian koin receh dengan membulatkan total pembayaran.</p>
            </div>
          </div>
          <button
            onClick={() => setPembulatanAktif(!pembulatanAktif)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 ${pembulatanAktif ? 'bg-[#0052cc]' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${pembulatanAktif ? 'left-7' : 'left-0.5'}`} />
          </button>
        </div>

        {pembulatanAktif && (
          <div className="space-y-6 animate-fadeIn">
            {/* Nominal Pembulatan Options */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3">Nominal Pembulatan</label>
              <div className="space-y-3">
                {/* 100 */}
                <div
                  onClick={() => setNominalPembulatan('100')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    nominalPembulatan === '100'
                      ? 'border-[#0052cc] bg-blue-50/20 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Custom Radio Button */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      nominalPembulatan === '100' ? 'border-[#0052cc]' : 'border-slate-300'
                    }`}>
                      {nominalPembulatan === '100' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0052cc]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Kelipatan Rp 100</p>
                      <p className="text-xs text-slate-400 mt-0.5">Cth: Rp 15.234 → Rp 15.200 / Rp 15.300</p>
                    </div>
                  </div>
                </div>

                {/* 500 */}
                <div
                  onClick={() => setNominalPembulatan('500')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    nominalPembulatan === '500'
                      ? 'border-[#0052cc] bg-blue-50/20 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Custom Radio Button */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      nominalPembulatan === '500' ? 'border-[#0052cc]' : 'border-slate-300'
                    }`}>
                      {nominalPembulatan === '500' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0052cc]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Kelipatan Rp 500</p>
                      <p className="text-xs text-slate-400 mt-0.5">Cth: Rp 15.234 → Rp 15.000 / Rp 15.500</p>
                    </div>
                  </div>
                </div>

                {/* 1000 */}
                <div
                  onClick={() => setNominalPembulatan('1000')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    nominalPembulatan === '1000'
                      ? 'border-[#0052cc] bg-blue-50/20 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Custom Radio Button */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      nominalPembulatan === '1000' ? 'border-[#0052cc]' : 'border-slate-300'
                    }`}>
                      {nominalPembulatan === '1000' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0052cc]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Kelipatan Rp 1.000</p>
                      <p className="text-xs text-slate-400 mt-0.5">Cth: Rp 15.234 → Rp 15.000 / Rp 16.000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arah Pembulatan Options */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3">Arah Pembulatan</label>
              <div className="grid grid-cols-3 gap-3">
                {/* Selalu Ke Bawah */}
                <button
                  onClick={() => setArahPembulatan('bawah')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    arahPembulatan === 'bawah'
                      ? 'border-[#0052cc] bg-blue-50/20 text-[#0052cc] font-bold shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-white'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                  </svg>
                  <span className="text-xs font-semibold">Selalu ke Bawah</span>
                </button>

                {/* Terdekat */}
                <button
                  onClick={() => setArahPembulatan('terdekat')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    arahPembulatan === 'terdekat'
                      ? 'border-[#0052cc] bg-blue-50/20 text-[#0052cc] font-bold shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-white'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                  <span className="text-xs font-semibold">Terdekat</span>
                </button>

                {/* Selalu Ke Atas */}
                <button
                  onClick={() => setArahPembulatan('atas')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    arahPembulatan === 'atas'
                      ? 'border-[#0052cc] bg-blue-50/20 text-[#0052cc] font-bold shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-white'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                  </svg>
                  <span className="text-xs font-semibold">Selalu ke Atas</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Submit Buttons */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <button 
          onClick={() => {
            setPajak('10');
            setBiayaLayanan('5');
            setHargaTermasukPajak(true);
            setPembulatanAktif(true);
            setNominalPembulatan('500');
            setArahPembulatan('terdekat');
          }}
          className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-xl transition-all"
        >
          Batal
        </button>
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-[#F26F21] hover:bg-[#ff7b2b] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-100"
        >
          Simpan Perubahan
        </button>
      </div>

      {/* Modal: Perubahan Berhasil Disimpan (Figma Design) */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            {/* Green Check Icon */}
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-800 mb-2">Perubahan Berhasil Disimpan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">
              Pengaturan pajak dan aturan pembulatan Anda telah diperbarui dalam sistem. Semua transaksi mendatang akan mengikuti konfigurasi baru ini.
            </p>

            {/* Button */}
            <button 
              onClick={() => setIsSuccessOpen(false)}
              className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
