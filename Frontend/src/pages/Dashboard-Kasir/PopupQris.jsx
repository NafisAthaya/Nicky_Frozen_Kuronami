import { useState } from 'react';
import { HiX, HiCheckCircle, HiXCircle, HiOutlineQrcode } from 'react-icons/hi';

function formatRupiah(num) {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
}

export default function PopupQris({ total, onClose, onSubmit }) {
  const [status, setStatus] = useState('idle');

  const handleCheckStatus = () => {
    setStatus((prev) => {
      if (prev === 'idle' || prev === 'failed') return 'waiting';
      if (prev === 'waiting') return 'success';
      if (prev === 'success') return 'failed';
      return 'idle';
    });
  };

  const handleFinish = () => {
    onSubmit('qris');
  };

 return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
    <div className="bg-white rounded-2xl w-[450px] max-w-[90vw] shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-slate-800">
          Pembayaran QRIS
        </h3>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
        >
          <HiX className="text-xl" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-8 py-6">

        {/* Total */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-center mb-5">
          <span className="block text-sm text-slate-500 mb-2">
            Total Tagihan
          </span>

          <span className="block text-3xl font-bold text-sky-700">
            {formatRupiah(total)}
          </span>
        </div>

        <p className="text-slate-500 text-sm mb-4 text-center">
          Arahkan pelanggan untuk melakukan scan kode QR ini
        </p>

        {/* QR Placeholder */}
        <div className="bg-slate-800 p-6 rounded-2xl flex justify-center items-center mb-6 shadow-lg">
          <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-2">
            <HiOutlineQrcode className="text-7xl text-slate-800" />
            <span className="text-sm font-medium text-slate-700">
              QR Code
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl min-h-[56px] flex items-center justify-center px-4">
          {status === 'idle' && (
            <span className="text-slate-400">
              Menunggu scan...
            </span>
          )}

          {status === 'waiting' && (
            <div className="flex items-center gap-2 text-amber-600 font-medium">
              <div className="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
              <span>Menunggu pembayaran dari pelanggan...</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <HiCheckCircle className="text-xl" />
              <span>Pembayaran Berhasil</span>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex items-center gap-2 text-red-600 font-medium">
              <HiXCircle className="text-xl" />
              <span>Pembayaran Ditolak</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 p-6 border-t border-slate-100">
        <button
          onClick={handleFinish}
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition"
        >
          Selesaikan Transaksi
        </button>

        <button
          onClick={handleCheckStatus}
          className="w-full py-3 border border-slate-300 hover:bg-slate-50 rounded-lg font-semibold text-slate-700 transition"
        >
          Cek Status Pembayaran
        </button>
      </div>

    </div>
  </div>
);
}
