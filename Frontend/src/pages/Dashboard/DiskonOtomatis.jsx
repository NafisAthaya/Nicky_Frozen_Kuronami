import { useState } from 'react';

const existingRules = [
  {
    id: 1,
    name: 'Cuci Gudang Kritis',
    description: 'Pemicu H-1 dengan Diskon 50%',
    tags: ['SEMUA ITEM', 'AKTIF'],
    active: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Potongan Harga Awal',
    description: 'Pemicu H-3 dengan Diskon 30%',
    tags: ['HANYA PRODUK SUSU', 'AKTIF'],
    active: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Peninjauan Standar',
    description: 'Pemicu H-7 dengan Diskon 15%',
    tags: ['SAYURAN BEKU', 'TIDAK AKTIF'],
    active: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

export default function DiskonOtomatis() {
  const [mainToggle, setMainToggle] = useState(true);
  const [rules, setRules] = useState(existingRules);
  const [pemicu, setPemicu] = useState('3');
  const [diskon, setDiskon] = useState('25');
  const [terapkan, setTerapkan] = useState('Semua Barang Beku');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleCreateRule = () => {
    if (!pemicu || !diskon) return;

    const newRule = {
      id: Date.now(),
      name: `Aturan ${terapkan}`,
      description: `Pemicu H-${pemicu} dengan Diskon ${diskon}%`,
      tags: [`${terapkan.toUpperCase()}`, 'AKTIF'],
      active: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    };

    setRules([newRule, ...rules]);
    setIsSuccessOpen(true);
  };

  const handleDeleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };


  return (
    <div className="animate-fadeIn">
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

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Left: Create New Rule */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
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
                  value={diskon}
                  onChange={(e) => setDiskon(e.target.value)}
                  className="w-24 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-center"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>

            {/* Terapkan Ke */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Terapkan Ke</label>
              <select
                value={terapkan}
                onChange={(e) => setTerapkan(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white"
              >
                <option>Semua Barang Beku</option>
                <option>Produk Susu</option>
                <option>Sayuran Beku</option>
                <option>Daging</option>
                <option>Seafood</option>
              </select>
            </div>

            {/* Submit */}
            <button 
              onClick={handleCreateRule}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 transition-all shadow-md mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Aktifkan Aturan
            </button>

          </div>
        </div>

        {/* Right: Active Configurations */}
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Konfigurasi Aktif</h2>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm transition-all ${!rule.active ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      {rule.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-500">
                        {rule.description.split('Diskon')[0]}
                        <span className="text-blue-600 font-semibold">Diskon{rule.description.split('Diskon')[1]}</span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        {rule.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wide">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Edit */}
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* Delete */}
                    <button 
                      onClick={() => handleDeleteRule(rule.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    {/* Toggle */}
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${rule.active ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${rule.active ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Aturan Berhasil Diaktifkan */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-6 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            {/* Green Check Icon */}
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 mb-2">Aturan Diaktifkan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">
              Aturan diskon otomatis baru berhasil disimpan dan akan segera diterapkan pada barang yang mendekati masa kadaluwarsa.
            </p>

            {/* Button */}
            <button 
              onClick={() => setIsSuccessOpen(false)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

