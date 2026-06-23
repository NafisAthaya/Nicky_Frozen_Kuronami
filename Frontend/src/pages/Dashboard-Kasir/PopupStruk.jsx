import { useRef } from 'react';
import { HiOutlinePrinter, HiOutlineShare, HiOutlineDownload } from 'react-icons/hi';

function formatRupiah(num) {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
}

export default function PopupStruk({
  onClose,
  transactionId = '#NF-000000',
  kasir = 'Minji',
  items = [],
  subtotal = 0,
  tax = 0,
  donasi = 0,
  total = 0,
  paymentMethod = 'tunai',
  paymentDetail = {},
}) {
  const receiptRef = useRef(null);
  const settings = {
  title: 'Nicky Frozen',
  subtitle: 'Cabang Utama',
  address: 'Jl. Raya Pasar Minggu',
  footerMessage: 'Terima kasih atas kunjungan Anda!',
  showLogo: false,
  showBarcode: true,
  showKasir: true,
};

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

  const invoiceNumber = transactionId.replace('#', '').replace(/-/g, '');

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const lines = [
      settings.title,
      settings.subtitle,
      `ID: ${transactionId}`,
      ...(settings.showKasir !== false ? [`Kasir: ${kasir}`] : []),
      `Tgl: ${dateStr} ${timeStr}`,
      '─'.repeat(30),
      ...items.map((item) => `${item.quantity}x ${item.name} - ${formatRupiah(item.price * item.quantity)}`),
      '─'.repeat(30),
      `Subtotal: ${formatRupiah(subtotal)}`,
      `Pajak (11%): ${formatRupiah(tax)}`,
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
      settings.footerMessage,
    ];

    const text = lines.join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Struk berhasil disalin ke clipboard!');
      });
    } else {
      alert('Clipboard tidak tersedia');
    }
  };

  const handleDownload = () => {
    const lines = [
      settings.title,
      settings.subtitle,
      ...(settings.address ? settings.address.split('\n') : []),
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
      `${'Pajak (11%)'.padEnd(28)}${formatRupiah(tax)}`,
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
      settings.footerMessage,
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
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-5"
    onClick={onClose}
  >
    <div
      className="flex flex-col items-center gap-3 w-full max-w-[340px] max-h-[95vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handlePrint}
          title="Cetak"
          className="w-10 h-10 rounded-full bg-[#082B7A] text-white flex items-center justify-center text-xl hover:bg-[#0A379C] transition"
        >
          <HiOutlinePrinter />
        </button>

        <button
          onClick={handleShare}
          title="Bagikan"
          className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xl hover:bg-slate-300 transition"
        >
          <HiOutlineShare />
        </button>

        <button
          onClick={handleDownload}
          title="Download"
          className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xl hover:bg-slate-300 transition"
        >
          <HiOutlineDownload />
        </button>
      </div>

      {/* Receipt */}
      <div
        ref={receiptRef}
        className="bg-white w-full rounded p-5 shadow-xl overflow-y-auto max-h-[calc(100vh-100px)] font-mono text-[#333]"
      >
        {/* Header */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-bold text-[#082B7A] font-sans">
            {settings.title}
          </h2>

          <p className="font-semibold mb-1">
            {settings.subtitle}
          </p>

          {settings.address &&
            settings.address.split('\n').map((line, i) => (
              <p
                key={i}
                className="text-[11px] leading-[1.3]"
              >
                {line}
              </p>
            ))}
        </div>

        <div className="border-t border-dashed border-gray-300 my-3" />

        {/* Meta */}
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex justify-between">
            {settings.showKasir !== false && (
              <span>Kasir: {kasir}</span>
            )}
            <span>No: {transactionId}</span>
          </div>

          <div className="flex justify-between">
            <span>
              Tgl: {dateStr} {timeStr}
            </span>
            <span>
              Term: {methodLabel[paymentMethod] || paymentMethod}
            </span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 my-3" />

        {/* Items */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="text-xs">
              <p className="font-semibold mb-1">
                {item.quantity}x {item.name}
              </p>

              <div className="flex justify-between pl-3">
                <span>@ {formatRupiah(item.price)}</span>
                <span>
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-gray-300 my-3" />

        {/* Summary */}
        <div className="flex flex-col gap-2 text-xs">
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
              <span>Donasi (Pembulatan)</span>
              <span>{formatRupiah(donasi)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-gray-300 my-3" />

        {/* Total */}
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center font-bold text-[#082B7A]">
            <span>TOTAL</span>

            <span className="text-xl">
              {formatRupiah(total)}
            </span>
          </div>

          {paymentMethod === 'tunai' &&
            paymentDetail?.uangDiterima > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Tunai</span>
                  <span>
                    {formatRupiah(paymentDetail.uangDiterima)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Kembali</span>
                  <span>
                    {formatRupiah(paymentDetail.kembalian)}
                  </span>
                </div>
              </>
            )}
        </div>

        <div className="border-t border-dashed border-gray-300 my-3" />

        {/* Footer */}
        <div className="text-center text-xs">
          <p>{settings.footerMessage}</p>

          {settings.showBarcode !== false && (
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className="flex h-10 justify-center">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className={`bg-black mx-[1px] ${
                      i % 3 === 0 ? 'w-[3px]' : 'w-[1px]'
                    }`}
                  />
                ))}
              </div>

              <p>{invoiceNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
