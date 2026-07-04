import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePrinter, HiOutlineShare, HiOutlineDownload, HiOutlineDocumentText, HiOutlineCash, HiOutlineUser } from 'react-icons/hi';
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

export default function PopupStruk({
  onClose,
  transactionId = '#NF-000000',
  kasir = 'Minji',
  items = [],
  subtotal = 0,
  diskonTotal = 0,
  tax = 0,
  layanan = 0,
  donasi = 0,
  total = 0,
  paymentMethod = 'tunai',
  paymentDetail = {},
}) {
  const receiptRef = useRef(null);

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
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const methodLabel = {
    tunai: 'Tunai',
    debit: 'Kartu Debit',
    qris: 'QRIS',
  };

  const invoiceNumber = String(transactionId || '#NF-000000').replace('#', '').replace(/-/g, '');

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const lines = [
      settings.judulStruk,
      settings.alamatStruk,
      settings.nomorTelepon,
      `ID: ${transactionId}`,
      ...(settings.showKasir !== false ? [`Kasir: ${kasir}`] : []),
      `Tgl: ${dateStr} ${timeStr}`,
      '─'.repeat(30),
      ...items.map((item) => `${item.quantity}x ${item.name} - ${formatRupiah(item.price * item.quantity)}`),
      '─'.repeat(30),
      `Subtotal: ${formatRupiah(subtotal)}`,
      ...(diskonTotal > 0 ? [`Diskon: -${formatRupiah(diskonTotal)}`] : []),
      `Pajak (PB1/PPN): ${formatRupiah(tax)}`,
      ...(layanan > 0 ? [`Biaya Layanan: ${formatRupiah(layanan)}`] : []),
      ...(donasi > 0 ? [`Donasi: ${formatRupiah(donasi)}`] : []),
      `TOTAL: ${formatRupiah(total)}`,
      `Metode: ${methodLabel[paymentMethod] || paymentMethod}`,
      ...(paymentMethod === 'tunai' && paymentDetail?.uangDiterima
        ? [
            `Tunai: ${formatRupiah(paymentDetail.uangDiterima)}`,
            `Kembali: ${formatRupiah(paymentDetail.kembalian)}`,
          ]
        : []),
      '─'.repeat(30),
      settings.footerStruk,
    ];

    const text = lines.join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Struk berhasil disalin ke clipboard!');
      });
    } else {
      toast.error('Clipboard tidak tersedia');
    }
  };

  const handleDownload = () => {
    const lines = [
      settings.judulStruk,
      settings.alamatStruk,
      settings.nomorTelepon,
      '',
      ...(settings.showKasir !== false ? [`Kasir: ${kasir}    No: ${transactionId}`] : [`No: ${transactionId}`]),
      `Tgl: ${dateStr} ${timeStr}    Term: ${methodLabel[paymentMethod] || paymentMethod}`,
      '═'.repeat(40),
      ...items.map((item) => {
        const name = `${item.quantity}x ${item.name}`;
        const price = formatRupiah(item.price * item.quantity);
        const detail = `  @ ${formatRupiah(item.price)}`;
        return `${name}\n${detail.padEnd(30)}${price}`;
      }),
      '═'.repeat(40),
      `${'Subtotal'.padEnd(28)}${formatRupiah(subtotal)}`,
      ...(diskonTotal > 0 ? [`${'Diskon'.padEnd(28)}-${formatRupiah(diskonTotal)}`] : []),
      `${'Pajak (PB1/PPN)'.padEnd(28)}${formatRupiah(tax)}`,
      ...(layanan > 0 ? [`${'Biaya Layanan'.padEnd(28)}${formatRupiah(layanan)}`] : []),
      ...(donasi > 0 ? [`${'Donasi (Pembulatan)'.padEnd(28)}${formatRupiah(donasi)}`] : []),
      '',
      `TOTAL    ${formatRupiah(total)}`,
      ...(paymentMethod === 'tunai' && paymentDetail?.uangDiterima
        ? [
            `${'Tunai'.padEnd(28)}${formatRupiah(paymentDetail.uangDiterima)}`,
            `${'Kembali'.padEnd(28)}${formatRupiah(paymentDetail.kembalian)}`,
          ]
        : []),
      '═'.repeat(40),
      '',
      settings.footerStruk,
      '',
      invoiceNumber,
    ];

    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Struk_${invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-y-auto p-6 bg-slate-900/60 backdrop-blur-sm print:bg-white print:p-0"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl flex flex-col items-center print:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
            <HiOutlineDocumentText className="text-[#082B7A] text-5xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Detail Transaksi
          </h1>
          <p className="text-slate-200">
            Riwayat pemesanan untuk referensi dan cetak ulang.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-6 w-full">
          {/* Receipt Card */}
          <div className="bg-white rounded-[32px] p-8 w-[420px] shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div className="text-center w-full">
                {settings.tampilkan_logo && (
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-gray-100 shadow-sm">
                    <img src={logoNicky} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-blue-900">
                  {settings.judulStruk || 'Nicky Frozen'}
                </h3>
                {settings.alamatStruk && (
                  <p className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed max-w-[250px] mx-auto">
                    {settings.alamatStruk}
                  </p>
                )}
                {settings.nomorTelepon && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Telp: {settings.nomorTelepon}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4 text-xs text-slate-500 font-medium px-2">
              <div className="flex flex-col">
                <span>{dateStr} {timeStr}</span>
                {settings.tampilkan_nama_kasir && <span>Kasir: <span className="font-bold text-slate-700">{kasir}</span></span>}
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
              METODE: {methodLabel[paymentMethod] || String(paymentMethod || 'TUNAI').toUpperCase()}
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
          <div className="bg-white rounded-[32px] p-8 w-[320px] shadow-2xl flex flex-col gap-5">
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
                <span className="text-lg font-bold text-slate-900">{kasir}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={handlePrint}
                className="
                  w-full
                  h-14
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  bg-[#082B7A]
                  text-white
                  font-semibold
                  text-base
                  shadow-lg
                  shadow-blue-900/30
                  hover:bg-[#0A379C]
                  transition
                "
              >
                <HiOutlinePrinter className="text-xl" />
                <span>Cetak Ulang Struk</span>
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="
                    flex-1
                    h-12
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-slate-300
                    bg-white
                    text-slate-700
                    font-semibold
                    hover:bg-slate-50
                    transition
                  "
                >
                  <HiOutlineShare />
                  Bagikan
                </button>
                <button
                  onClick={handleDownload}
                  className="
                    flex-1
                    h-12
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-slate-300
                    bg-white
                    text-slate-700
                    font-semibold
                    hover:bg-slate-50
                    transition
                  "
                >
                  <HiOutlineDownload />
                  Unduh
                </button>
              </div>

              <button
                onClick={onClose}
                className="
                  w-full
                  h-12
                  flex
                  items-center
                  justify-center
                  rounded-full
                  text-slate-500
                  font-semibold
                  hover:text-slate-700
                  hover:bg-slate-100
                  transition
                  mt-2
                "
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Area (Hidden on Screen, Visible on Print) */}
      <div className="hidden print:block font-mono text-black w-[58mm] mx-auto text-[11px] leading-tight">
        <div className="text-center mb-3">
          {settings.tampilkan_logo && (
            <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-black" style={{ display: 'inline-block' }}>
              <img src={logoNicky} alt="Logo" className="w-full h-full object-cover grayscale" />
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">{settings.judul_struk}</h2>
          <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">{settings.alamat_struk}</p>
          <p className="text-sm text-gray-500">Telp: {settings.nomor_telepon}</p>
        </div>
        <div className="border-t border-dashed border-black my-2" />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            {settings.tampilkan_nama_kasir && <span>Kasir: {kasir}</span>}
            <span>No: {invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>{dateStr} {timeStr}</span>
            <span>Term: {methodLabel[paymentMethod] || paymentMethod}</span>
          </div>
        </div>
        <div className="border-t border-dashed border-black my-2" />
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id}>
              <p className="font-semibold">{item.quantity}x {item.name}</p>
              <div className="flex justify-between pl-2">
                <span>@ {formatRupiah(item.price)}</span>
                <span>{formatRupiah(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-black my-2" />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pajak (11%)</span>
            <span>{formatRupiah(tax)}</span>
          </div>
          {donasi > 0 && (
            <div className="flex justify-between">
              <span>Donasi</span>
              <span>{formatRupiah(donasi)}</span>
            </div>
          )}
        </div>
        <div className="border-t border-dashed border-black my-2" />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between font-bold text-[13px]">
            <span>TOTAL</span>
            <span>{formatRupiah(total)}</span>
          </div>
          {paymentMethod === 'tunai' && paymentDetail?.uangDiterima > 0 && (
            <>
              <div className="flex justify-between mt-1">
                <span>Tunai</span>
                <span>{formatRupiah(paymentDetail.uangDiterima)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembali</span>
                <span>{formatRupiah(paymentDetail.kembalian)}</span>
              </div>
            </>
          )}
        </div>
        <div className="border-t border-dashed border-black my-2" />
        {settings.tampilkan_barcode && (
          <div className="text-center my-4">
            <BarcodePreview code={transactionId} />
            <p className="mt-1">{transactionId}</p>
          </div>
        )}
        <div className="text-center mt-4">
          <p className="text-center text-sm text-gray-500 mt-6 italic">{settings.footer_struk}</p>
        </div>
      </div>
    </div>
  );
}
