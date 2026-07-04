import { useState, useEffect } from 'react';
import {
  HiCheckCircle,
  HiOutlineShoppingCart,
  HiPrinter,
  HiOutlineCash,
  HiOutlineUser,
} from 'react-icons/hi';
import PopupStruk from './PopupStruk';
import cabangBg from '../../assets/branch-bg.png';
import logoNicky from '../../assets/logo-nicky-frozen.jpeg';
import axiosInstance from '../../api/axios';

function formatRupiah(num) {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
}

// Simple Barcode SVG Component
const BarcodePreview = ({ code }) => {
  const bars = [];
  const seed = code || 'TRX20261105-0012';
  for (let i = 0; i < seed.length * 2; i++) {
    const charCode = seed.charCodeAt(i % seed.length);
    const isBlack = (charCode + i) % 3 !== 0;
    const width = ((charCode + i) % 2 === 0) ? 2 : 1;
    bars.push({ isBlack, width });
  }

  const totalWidth = bars.reduce((sum, bar) => sum + bar.width + 1, 0);
  const startX = Math.max(0, (160 - totalWidth) / 2);

  return (
    <svg width="160" height="40" viewBox="0 0 160 40" className="mx-auto block">
      {bars.reduce((acc, bar, i) => {
        const x = acc.x;
        acc.elements.push(
          <rect key={i} x={x} y={0} width={bar.width} height={40} fill={bar.isBlack ? '#000' : '#fff'} />
        );
        acc.x += bar.width + 1;
        return acc;
      }, { x: startX, elements: [] }).elements}
    </svg>
  );
};


export default function StatusPembayaran({
  transactionId,
  items,
  subtotal,
  diskonTotal,
  tax,
  layanan,
  donasi,
  total,
  paymentMethod,
  paymentDetail,
  onNewTransaction,
  kasirName = 'Kasir',
}) {
  const [showStruk, setShowStruk] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const activeKasir = user.name || kasirName;

  const [settings, setSettings] = useState({
    judul_struk: 'Nicky Frozen Food',
    alamat_struk: 'Jl. Raya Boulevard No. 12, Gading Serpong, Tangerang',
    nomor_telepon: '0812-3456-7890',
    footer_struk: 'Terima Kasih Telah Berbelanja!',
    tampilkan_logo: false,
    tampilkan_barcode: true,
    tampilkan_nama_kasir: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axiosInstance.get('/kasir/pengaturan-toko');
        if (res.data && res.data.data) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil pengaturan struk", err);
      }
    };
    loadSettings();
  }, []);

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
              <div className="text-center w-full">
                {settings.tampilkan_logo && (
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-gray-100 shadow-sm">
                    <img src={logoNicky} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-blue-900">
                  {settings.judul_struk || 'Nicky Frozen'}
                </h3>
                {settings.alamat_struk && (
                  <p className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed max-w-[250px] mx-auto">
                    {settings.alamat_struk}
                  </p>
                )}
                {settings.nomor_telepon && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Telp: {settings.nomor_telepon}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 text-xs text-slate-500 font-medium px-2">
              <div className="flex flex-col">
                <span>{dateStr} {timeStr}</span>
                {settings.tampilkan_nama_kasir && <span>Kasir: <span className="font-bold text-slate-700">{activeKasir}</span></span>}
              </div>
              <div className="flex flex-col text-right">
                <span>ID: {transactionId}</span>
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
            {diskonTotal > 0 && (
              <div className="flex justify-between text-sm text-orange-500">
                <span>Diskon</span>
                <span>-{formatRupiah(diskonTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-slate-500">
              <span>Pajak (PB1/PPN)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            {layanan > 0 && (
              <div className="flex justify-between text-sm text-slate-500">
                <span>Biaya Layanan</span>
                <span>{formatRupiah(layanan)}</span>
              </div>
            )}
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

          <div className="text-center text-xs text-slate-400 bg-slate-50 p-3 rounded-lg mb-4">
            METODE: {methodLabel[paymentMethod] || paymentMethod.toUpperCase()}
          </div>

          {settings.tampilkan_barcode && (
            <div className="mb-4 text-center">
              <BarcodePreview code={transactionId} />
              <p className="text-[10px] text-slate-400 mt-1">{transactionId}</p>
            </div>
          )}

          {settings.footer_struk && (
            <div className="text-center text-xs text-slate-500 italic px-4">
              {settings.footer_struk}
            </div>
          )}
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
