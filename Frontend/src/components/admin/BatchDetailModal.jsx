import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

function formatRupiah(number) {
  if (!number) return '0';
  return new Intl.NumberFormat('id-ID').format(number);
}

export default function BatchDetailModal({
  isOpen,
  onClose,
  batch,
  onEdit,
  onSave
}) {
  const [formData, setFormData] = useState({
    hargaBeli: '',
    supplier: '',
    catatan: '',
  });

  useEffect(() => {
    if (batch) {
      setFormData({
        hargaBeli: batch.harga_beli || '',
        supplier: batch.supplier || '',
        catatan: batch.catatan || '',
      });
    }
  }, [batch]);

  if (!isOpen || !batch) return null;

  const prod = batch.produk || {};

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold text-[#082B7A]">
            Detail Riwayat Barang Masuk
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <MdClose size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="block text-xs uppercase font-bold text-gray-500 mb-1">Nama Produk</span>
              <span className="font-semibold text-[#082B7A]">{prod.nama_produk || '-'}</span>
            </div>
            <div>
              <span className="block text-xs uppercase font-bold text-gray-500 mb-1">SKU</span>
              <span className="font-semibold text-[#082B7A]">{batch.barcode_custom || prod.sku || '-'}</span>
            </div>
            <div>
              <span className="block text-xs uppercase font-bold text-gray-500 mb-1">Jumlah Stok</span>
              <span className="font-semibold text-gray-900">{batch.stok} Unit</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harga Beli per Unit (Rp)</label>
            <input 
              type="text" 
              readOnly 
              value={`Rp ${formatRupiah(formData.hargaBeli)}`} 
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold bg-gray-50 text-gray-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supplier</label>
            <input 
              type="text" 
              readOnly 
              value={formData.supplier || '-'} 
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold bg-gray-50 text-gray-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catatan / Keterangan</label>
            <textarea 
              readOnly 
              rows={3}
              value={formData.catatan || '-'} 
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold bg-gray-50 text-gray-600 outline-none"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="rounded-xl bg-white border border-gray-300 px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onEdit(batch)}
            className="rounded-xl bg-[#E6EDFF] px-5 py-2.5 font-bold text-[#082B7A] hover:bg-[#D5E0FF] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onSave(batch)}
            className="rounded-xl bg-[#082B7A] px-5 py-2.5 font-bold text-white hover:bg-[#0B3B91] transition-colors shadow-sm"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
