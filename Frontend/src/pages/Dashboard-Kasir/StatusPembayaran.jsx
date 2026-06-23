import { useState } from 'react';
import {
  HiCheckCircle,
  HiOutlineShoppingCart,
  HiPrinter,
  HiOutlineCash,
  HiOutlineUser,
} from 'react-icons/hi';
import PopupStruk from './PopupStruk';
import cabangBg from '../../assets/branch-bg.png';

function formatRupiah(num) {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
}

export default function StatusPembayaran({
  transactionId,
  items,
  subtotal,
  tax,
  donasi,
  total,
  paymentMethod,
  paymentDetail,
  onNewTransaction,
  kasirName = 'Minji',
}) {
  const [showStruk, setShowStruk] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const methodLabel = {
    tunai: 'TUNAI',
    debit: 'KARTU DEBIT',
    qris: 'QRIS',
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-y-auto p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${cabangBg})`,
      }}
    >
      <div className="text-center mb-10">
        <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-6">
          <HiCheckCircle className="text-[#22C55E] text-7xl" />
        </div>
        <h1 className="text-5xl font-extrabold text-[#082B7A] mb-3">
  Pembayaran Berhasil!
</h1>
        <p className="text-lg text-slate-600">
  Terima kasih atas transaksi Anda di Nicky Frozen.
</p>
      </div>

      <div className="flex flex-wrap justify-center items-start gap-6 w-full max-w-5xl">
        {/* Receipt Card */}
        <div className="bg-white rounded-[32px] p-8 w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-blue-900">
  Nicky Frozen
</h3>
              <span className="text-xs tracking-widest text-slate-500">ARCTIC POS SYSTEM</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs text-slate-500">
  TRANS ID
</span>
              <strong className="text-sm text-slate-900">
  {transactionId}
</strong>
            </div>
          </div>

          <div className="border-y border-dashed border-slate-300 py-5 mb-5 flex flex-col gap-3">
            {items.map((item) => (
              <div className="flex justify-between text-sm text-slate-700" key={item.id}>
                <span>
                  {item.quantity}x {item.name}
                </span>
                <strong className="text-slate-900">
                {formatRupiah(item.price * item.quantity)}
                </strong>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Pajak (11%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            {donasi > 0 && (
              <div className="flex justify-between text-sm text-slate-500">
                <span>Donasi (Pembulatan)</span>
                <span>{formatRupiah(donasi)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3 mt-1 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
            METODE: {methodLabel[paymentMethod] || paymentMethod.toUpperCase()}
            {' - '}{dateStr.toUpperCase()}, {timeStr}
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-[32px] p-8 w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col gap-5">
          <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xl">
              <HiOutlineCash />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Total Tagihan</span>
              <span className="text-lg font-bold text-slate-900">{formatRupiah(total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
              <HiOutlineUser />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Kasir</span>
              <span className="text-lg font-bold text-slate-900">{kasirName}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <button
            onClick={onNewTransaction}
            className="
              w-full
              h-14
              flex
              items-center
              justify-center
              gap-3
              rounded-full
              bg-[#FF7A00]
              text-white
              font-semibold
              text-base
              shadow-lg
              shadow-orange-500/30
              hover:bg-[#F06F00]
              transition
            "
          >
            <HiOutlineShoppingCart className="text-xl" />
            <span>Transaksi Baru</span>
          </button>
            <button
              className="
                w-full
                h-14
                flex
                items-center
                justify-center
                gap-3
                rounded-full
                border
                border-slate-300
                bg-white
                text-[#082B7A]
                font-semibold
                hover:bg-slate-50
                transition
              " onClick={() => setShowStruk(true)}>
              <HiPrinter />
              Cetak Struk
            </button>
          </div>

          <div className="text-center text-sm text-slate-500">
            Butuh bantuan? <a href="#" className="underline text-slate-400 hover:text-slate-600">Hubungi IT Support</a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-xs text-slate-400">
        © 2026 Nicky Frozen. All rights reserved.
      </div>

      {/* Popup Struk */}
      {showStruk && (
        <PopupStruk
          onClose={() => setShowStruk(false)}
          transactionId={transactionId}
          kasir={kasirName}
          items={items}
          subtotal={subtotal}
          tax={tax}
          donasi={donasi}
          total={total}
          paymentMethod={paymentMethod}
          paymentDetail={paymentDetail}
        />
      )}
    </div>
  );
}
