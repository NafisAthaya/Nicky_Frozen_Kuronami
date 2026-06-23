import { useState } from 'react';
import { HiX } from 'react-icons/hi';

function formatRupiah(num) {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
}

export default function PopupTunai({ total, onClose, onSubmit }) {
  const [uangDiterima, setUangDiterima] = useState('');

  const handleUangChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setUangDiterima(rawValue);
  };

  const uangDiterimaNum = parseInt(uangDiterima, 10) || 0;
  const kembalian = uangDiterimaNum - total;

  const handleSubmit = () => {
    if (uangDiterimaNum >= total) {
      onSubmit(uangDiterimaNum, kembalian);
    }
  };

  const displayUangDiterima = uangDiterimaNum > 0 ? uangDiterimaNum.toLocaleString('id-ID') : '';

  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
    <div className="bg-white rounded-2xl w-[400px] max-w-[90vw] shadow-2xl overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-dashed border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800">
          Pembayaran Tunai
        </h3>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <HiX className="text-xl" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-5">

        {/* Total */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <span className="block text-sm text-slate-500 mb-2">
            Total Tagihan
          </span>

          <span className="block text-3xl font-bold text-sky-700">
            {formatRupiah(total)}
          </span>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Uang Diterima
          </label>

          <div className="flex items-center border border-slate-300 rounded-lg px-4 py-3 bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
            <span className="text-slate-500 font-medium mr-2">
              Rp
            </span>

            <input
              type="text"
              value={displayUangDiterima}
              onChange={handleUangChange}
              placeholder="0"
              autoFocus
              className="flex-1 outline-none text-right text-lg font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* Kembalian */}
        <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200">
          <span className="font-semibold text-slate-700">
            Kembalian
          </span>

          <span className="text-lg font-bold text-slate-900">
            {kembalian >= 0
              ? formatRupiah(kembalian)
              : '-'}
          </span>
        </div>

      </div>

      {/* Footer */}
      <div className="flex gap-3 px-5 py-4 border-t border-slate-100">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold transition"
        >
          Batal
        </button>

        <button
          onClick={handleSubmit}
          disabled={uangDiterimaNum < total}
          className="flex-[2] py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
        >
          ✓ Selesaikan Pembayaran
        </button>
      </div>

    </div>
  </div>
);
}
