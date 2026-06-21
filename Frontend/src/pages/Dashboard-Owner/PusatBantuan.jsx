import { useState } from 'react';

const faqs = [
  {
    id: 'faq-1',
    category: 'laporan',
    question: 'Bagaimana cara membaca grafik komparasi performa cabang?',
    steps: [
      'Buka tab Beranda atau Laporan pada sidebar menu.',
      'Pada grafik performa penjualan, pilih opsi komparasi antar cabang di menu dropdown filter.',
      'Anda akan melihat visualisasi diagram komparatif yang menampilkan omzet masing-masing cabang secara berdampingan.'
    ],
    showChart: true,
  },
  {
    id: 'faq-2',
    category: 'laporan',
    question: 'Bagaimana cara mengekspor laporan penjualan ke PDF/Excel?',
    steps: [
      'Masuk ke halaman Laporan di sidebar kiri.',
      'Klik tombol "Ekspor Laporan" di pojok kanan atas halaman.',
      'Tunggu hingga indikator loading penyiapan berkas selesai (1.5 detik), berkas PDF/Excel akan otomatis terunduh ke perangkat Anda.'
    ],
    showChart: false,
  },
  {
    id: 'faq-3',
    category: 'bisnis',
    question: 'Bagaimana cara menyesuaikan aturan pembulatan kembalian?',
    steps: [
      'Masuk ke menu "% Pajak & Pembulatan" di sidebar bagian bawah.',
      'Aktifkan toggle utama "Aturan Pembulatan" untuk mengaktifkan fitur pembulatan otomatis.',
      'Pilih nominal kelipatan pembulatan yang diinginkan (Kelipatan Rp 100, Rp 500, atau Rp 1.000).',
      'Pilih arah pembulatan (Selalu ke Bawah, Terdekat, atau Selalu ke Atas) dan klik "Simpan Perubahan".'
    ],
    showChart: false,
  },
  {
    id: 'faq-4',
    category: 'bisnis',
    question: 'Bagaimana cara mengatur hak akses dan peran karyawan baru?',
    steps: [
      'Klik menu "Profil" di sidebar, lalu pilih tab "Kelola Karyawan" di navigasi atas.',
      'Klik tombol "+ Tambah Karyawan Baru" di pojok kanan atas.',
      'Isi formulir nama, email, nomor telepon, peran jabatan (Kasir, Supervisor, Gudang), serta lokasi cabang bertugas.',
      'Klik "Simpan Karyawan" dan salin kata sandi awal staf yang di-generate sistem secara otomatis.'
    ],
    showChart: false,
  },
];

export default function PusatBantuan() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [votes, setVotes] = useState({}); // { [faqId]: 'ya' | 'tidak' }
  const [activeFilter, setActiveFilter] = useState('semua'); // 'semua', 'laporan', 'bisnis'
  const [liveChatOpen, setLiveChatOpen] = useState(false);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleVote = (faqId, value) => {
    setVotes({
      ...votes,
      [faqId]: value,
    });
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.steps.some(step => step.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'semua' || faq.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Pusat Bantuan Owner</h1>
        <p className="text-sm text-gray-500">Temukan jawaban cepat mengenai laporan keuangan, kelola cabang toko, dan pengaturan operasional POS Anda.</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Cari topik bantuan atau pertanyaan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all bg-white shadow-sm"
        />
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Laporan Keuangan Card */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'laporan' ? 'semua' : 'laporan')}
          className={`p-6 rounded-3xl border transition-all cursor-pointer ${
            activeFilter === 'laporan'
              ? 'border-blue-500 bg-blue-50/10 shadow-sm'
              : 'border-slate-100 hover:border-slate-200 bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">Laporan Keuangan</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Pelajari mengenai perhitungan omzet, ekspor data, & komparasi performa.</p>
        </div>

        {/* Pengaturan Bisnis Card */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'bisnis' ? 'semua' : 'bisnis')}
          className={`p-6 rounded-3xl border transition-all cursor-pointer ${
            activeFilter === 'bisnis'
              ? 'border-blue-500 bg-blue-50/10 shadow-sm'
              : 'border-slate-100 hover:border-slate-200 bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F26F21] mb-4 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">Pengaturan Bisnis</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Pelajari pengaturan pajak, aturan pembulatan, & kelola karyawan.</p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {/* Laporan Keuangan Section Title */}
        {(activeFilter === 'semua' || activeFilter === 'laporan') && (
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Kategori Laporan Keuangan (Eksklusif Owner)</h2>
            <div className="space-y-3">
              {filteredFaqs
                .filter(f => f.category === 'laporan')
                .map(faq => (
                  <div key={faq.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all shadow-sm">
                    {/* Trigger */}
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 text-sm hover:bg-slate-50/50 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${expandedId === faq.id ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expandable Body */}
                    {expandedId === faq.id && (
                      <div className="px-6 pb-6 pt-2 border-t border-slate-50 text-xs text-slate-500 leading-relaxed space-y-4 animate-fadeIn">
                        <ol className="list-decimal list-inside space-y-2.5">
                          {faq.steps.map((step, idx) => (
                            <li key={idx} className="pl-1">{step}</li>
                          ))}
                        </ol>

                        {/* Mini visual performance chart */}
                        {faq.showChart && (
                          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col items-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Grafik Performa Komparasi</p>
                            <div className="flex items-end justify-center gap-4 h-28 w-full max-w-xs">
                              {/* Branch 1 */}
                              <div className="flex flex-col items-center gap-1.5 flex-1">
                                <div className="w-full bg-blue-600 rounded-t-lg h-24 animate-scaleUp" />
                                <span className="text-[9px] font-bold text-slate-400">Utama</span>
                              </div>
                              {/* Branch 2 */}
                              <div className="flex flex-col items-center gap-1.5 flex-1">
                                <div className="w-full bg-orange-500 rounded-t-lg h-16 animate-scaleUp" />
                                <span className="text-[9px] font-bold text-slate-400">Seturan</span>
                              </div>
                              {/* Branch 3 */}
                              <div className="flex flex-col items-center gap-1.5 flex-1">
                                <div className="w-full bg-[#0052cc] rounded-t-lg h-20 animate-scaleUp" />
                                <span className="text-[9px] font-bold text-slate-400">Depok</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Feedback Vote */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px]">
                          <span className="font-bold text-slate-400">Apakah artikel ini membantu?</span>
                          <div className="flex items-center gap-2">
                            {votes[faq.id] ? (
                              <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                                {votes[faq.id] === 'ya' ? 'Terima kasih atas feedback Anda!' : 'Terima kasih, kami akan meningkatkan konten ini.'}
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleVote(faq.id, 'ya')}
                                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 font-bold rounded-lg transition-colors"
                                >
                                  Ya
                                </button>
                                <button
                                  onClick={() => handleVote(faq.id, 'tidak')}
                                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 font-bold rounded-lg transition-colors"
                                >
                                  Tidak
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Pengaturan Bisnis Section Title */}
        {(activeFilter === 'semua' || activeFilter === 'bisnis') && (
          <div className="pt-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Kategori Pengaturan Bisnis (Eksklusif Owner)</h2>
            <div className="space-y-3">
              {filteredFaqs
                .filter(f => f.category === 'bisnis')
                .map(faq => (
                  <div key={faq.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all shadow-sm">
                    {/* Trigger */}
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 text-sm hover:bg-slate-50/50 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${expandedId === faq.id ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expandable Body */}
                    {expandedId === faq.id && (
                      <div className="px-6 pb-6 pt-2 border-t border-slate-50 text-xs text-slate-500 leading-relaxed space-y-4 animate-fadeIn">
                        <ol className="list-decimal list-inside space-y-2.5">
                          {faq.steps.map((step, idx) => (
                            <li key={idx} className="pl-1">{step}</li>
                          ))}
                        </ol>

                        {/* Feedback Vote */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px]">
                          <span className="font-bold text-slate-400">Apakah artikel ini membantu?</span>
                          <div className="flex items-center gap-2">
                            {votes[faq.id] ? (
                              <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                                {votes[faq.id] === 'ya' ? 'Terima kasih atas feedback Anda!' : 'Terima kasih, kami akan meningkatkan konten ini.'}
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleVote(faq.id, 'ya')}
                                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 font-bold rounded-lg transition-colors"
                                >
                                  Ya
                                </button>
                                <button
                                  onClick={() => handleVote(faq.id, 'tidak')}
                                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 font-bold rounded-lg transition-colors"
                                >
                                  Tidak
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Help Banner at the Bottom */}
      <div className="bg-[#0052cc] rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 mt-10 shadow-lg shadow-blue-100">
        <div>
          <h3 className="font-black text-sm uppercase tracking-wider mb-0.5">Butuh Bantuan Darurat?</h3>
          <p className="text-[10px] text-blue-100 leading-relaxed">Hubungi technical support kami secara langsung jika Anda menemukan kendala teknis.</p>
        </div>
        <button
          onClick={() => setLiveChatOpen(true)}
          className="px-5 py-3 bg-white text-[#0052cc] text-xs font-bold rounded-2xl hover:bg-blue-50 transition-all shrink-0 shadow-md"
        >
          Hubungi Live Chat
        </button>
      </div>

      {/* Live Chat Modal Simulation */}
      {liveChatOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-scaleIn">
            <div className="bg-[#0052cc] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-bold text-xs">Technical Support Live</span>
              </div>
              <button onClick={() => setLiveChatOpen(false)} className="text-blue-100 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-slate-800">Menghubungkan ke Tim Support...</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">Saat ini Anda berada di antrean nomor 1. Customer service kami akan membalas dalam waktu kurang dari 2 menit.</p>
              <button
                onClick={() => setLiveChatOpen(false)}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold rounded-xl transition-all"
              >
                Tutup Antrean
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
