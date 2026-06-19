import { useState } from 'react';

const timeFilters = ['Semua Waktu', '08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00'];

const transactionList = [
  {
    id: 'TRX-20231027-004',
    time: '24 OKT 2026, 14:32',
    items: '2x Salmon Fillet (250g), 1x Frozen Broccoli (1kg), 3x Sweet Corn Cob',
    status: 'Berhasil',
    total: 'Rp 277.500',
    subtotal: 'Rp 250.000',
    tax: 'Rp 25.000',
    rounding: 'Rp 2.500',
    metode: 'QRIS',
    kasir: 'Minji',
    itemList: [
      { name: 'Salmon Fillet (250g)', qty: 2, price: 'Rp 178.000' },
      { name: 'Frozen Broccoli (1kg)', qty: 1, price: 'Rp 45.000' },
      { name: 'Sweet Corn Cob', qty: 3, price: 'Rp 27.000' },
    ],
  },
  {
    id: 'TRX-20231027-003',
    time: '24 OKT 2026, 13:15',
    items: '1x Ice Cream Chocolate Large',
    status: 'Berhasil',
    total: 'Rp 27.500',
    subtotal: 'Rp 25.000',
    tax: 'Rp 2.500',
    rounding: 'Rp 0',
    metode: 'Tunai',
    kasir: 'Minji',
    itemList: [
      { name: 'Ice Cream Chocolate Large', qty: 1, price: 'Rp 25.000' }
    ],
  },
  {
    id: 'TRX-20231027-002',
    time: '24 OKT 2026, 11:05',
    items: '5x Nugget Ayam 500g, 2x Saus Sambal Botol',
    status: 'Berhasil',
    total: 'Rp 236.500',
    subtotal: 'Rp 215.000',
    tax: 'Rp 21.500',
    rounding: 'Rp 0',
    metode: 'Kartu Debit',
    kasir: 'Budi S.',
    itemList: [
      { name: 'Nugget Ayam 500g', qty: 5, price: 'Rp 175.000' },
      { name: 'Saus Sambal Botol', qty: 2, price: 'Rp 40.000' }
    ],
  },
  {
    id: 'TRX-20231027-001',
    time: '24 OKT 2026, 09:20',
    items: '3x Bakso Sapi Super, 1x Es Teh Manis',
    status: 'Berhasil',
    total: 'Rp 93.500',
    subtotal: 'Rp 85.000',
    tax: 'Rp 8.500',
    rounding: 'Rp 0',
    metode: 'Tunai',
    kasir: 'Siti A.',
    itemList: [
      { name: 'Bakso Sapi Super', qty: 3, price: 'Rp 75.000' },
      { name: 'Es Teh Manis', qty: 1, price: 'Rp 10.000' }
    ],
  }
];

export default function Transaksi() {
  const [activeFilter, setActiveFilter] = useState('Semua Waktu');
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setPrintSuccess(false);
    setTimeout(() => {
      setIsPrinting(false);
      setPrintSuccess(true);
      setTimeout(() => setPrintSuccess(false), 2500);
    }, 1200);
  };

  return (
    <div className="animate-fadeIn relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Riwayat Transaksi</h1>
        <p className="text-sm text-gray-500">Daftar transaksi hari ini</p>
      </div>

      {/* Time Filters */}
      <div className="flex items-center gap-2 mb-6">
        {timeFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeFilter === f
                ? 'bg-[#0A2540] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transaction Cards */}
      <div className="space-y-4">
        {transactionList.map((trx) => (
          <div key={trx.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              {/* Left: Icon + Details */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-gray-900">{trx.time}</span>
                    <span className="text-xs text-gray-400">{trx.id}</span>
                  </div>
                  <p className="text-sm text-gray-600">{trx.items}</p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {trx.status}
                  </span>
                </div>
              </div>

              {/* Right: Total + Action */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Tagihan</p>
                  <p className="text-xl font-bold text-[#0A2540]">{trx.total}</p>
                </div>
                <button 
                  onClick={() => setSelectedTrx(trx)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak Ulang Struk
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Cetak Ulang Struk (Figma Design) */}
      {selectedTrx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8fafc] rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row animate-scaleIn relative p-8 gap-8">
            
            {/* Left Column: Visual Paper Receipt */}
            <div className="flex-1 bg-white rounded-3xl p-6 shadow-md border border-slate-100 relative flex flex-col justify-between">
              {/* Receipt Content */}
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-base font-extrabold text-[#0A2540]">Nicky Frozen</h4>
                    <p className="text-[9px] font-bold text-slate-400 tracking-widest mt-0.5">ARCTIC POS SYSTEM</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 tracking-wider">TRANS ID</p>
                    <p className="text-[11px] font-black text-slate-700">#NF-882910</p>
                  </div>
                </div>

                {/* Dashed Line */}
                <div className="border-t border-dashed border-slate-200 my-4" />

                {/* Items List */}
                <div className="space-y-3">
                  {selectedTrx.itemList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">{item.qty}x {item.name}</span>
                      <span className="text-slate-800 font-bold">{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Dashed Line */}
                <div className="border-t border-dashed border-slate-200 my-4" />

                {/* Calculation breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>{selectedTrx.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Pajak PPN (10%)</span>
                    <span>{selectedTrx.tax}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Pembulatan</span>
                    <span>{selectedTrx.rounding}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Footer */}
              <div>
                {/* Dashed Line */}
                <div className="border-t border-dashed border-slate-200 my-4" />

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">METODE: {selectedTrx.metode}</span>
                  <span className="text-[10px] font-bold text-slate-400">{selectedTrx.time}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Status & Call to Actions */}
            <div className="md:w-[360px] flex flex-col justify-between py-4">
              <div className="flex flex-col items-center text-center mt-6">
                {/* Green Check Icon */}
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Pembayaran Berhasil!</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Terima kasih atas transaksi Anda di Nicky Frozen.
                </p>
              </div>

              {/* Status Info Box */}
              <div className="my-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Total Tagihan</span>
                  </div>
                  <span className="text-base font-black text-slate-800">{selectedTrx.total}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Kasir</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">{selectedTrx.kasir}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => setSelectedTrx(null)}
                  className="w-full bg-[#F26F21] hover:bg-[#ff7b2b] text-white text-xs font-black py-4 rounded-2xl shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Transaksi Baru
                </button>

                <button 
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-black py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isPrinting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mencetak...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Cetak Struk
                    </>
                  )}
                </button>
              </div>

              {/* Printing Status Toast inside Modal */}
              {printSuccess && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Struk berhasil dikirim ke printer!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
