import { useState } from 'react';
import { HiX, HiOutlineCreditCard, HiOutlineInformationCircle, HiOutlineDocumentText } from 'react-icons/hi';

function formatRupiah(num) {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
}

export default function PopupDebit({ total, onClose, onSubmit }) {
  const [referenceNumber, setReferenceNumber] = useState('');

  const handleSubmit = () => {
    onSubmit(referenceNumber);
  };

  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
    <div className="bg-white rounded-2xl w-[450px] max-w-[90vw] shadow-2xl overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-dashed border-gray-200">
        <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-800">
          <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xl">
            <HiOutlineCreditCard />
          </span>
          Pembayaran Kartu Debit
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

        {/* Info */}
        <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <HiOutlineInformationCircle className="text-sky-600 text-xl shrink-0 mt-0.5" />

          <p className="text-sm text-slate-600 leading-relaxed">
            Silakan gesek/masukkan kartu pada mesin EDC dan
            selesaikan transaksi sejumlah {formatRupiah(total)}
          </p>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nomor Referensi (Opsional)
          </label>

          <div className="flex items-center border border-slate-300 rounded-lg px-4 py-3 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
            <HiOutlineDocumentText className="text-slate-400 text-lg mr-3" />

            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Masukkan nomor referensi EDC"
              autoFocus
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex gap-3 px-5 py-4 border-t border-slate-100">
        <button
          onClick={onClose}
          className="flex-1 py-3 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          Batal
        </button>

        <button
          onClick={handleSubmit}
          className="flex-[2] py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition"
        >
          Konfirmasi Pembayaran Berhasil
        </button>
      </div>

    </div>
  </div>
);
}
