import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PopupTunai from './PopupTunai';
import PopupDebit from './PopupDebit';
import PopupQris from './PopupQris';

import {
  HiOutlineShoppingCart,
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineQrcode,
  HiOutlinePhotograph,
  HiArrowRight,
  HiOutlineHeart,
} from 'react-icons/hi';

function formatRupiah(num) {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
}

const paymentMethods = [
  { id: 'tunai', label: 'Tunai', icon: HiOutlineCash },
  { id: 'debit', label: 'Kartu Debit', icon: HiOutlineCreditCard },
  { id: 'qris', label: 'QRIS', icon: HiOutlineQrcode },
];

export default function OrderPanel({
  items,
  subtotal,
  tax,
  donasi,
  total,
  itemCount,
  onUpdateQuantity,
  onRemoveItem,
  onPaymentSuccess,
}) {
  const navigate = useNavigate();
  const [activePayment, setActivePayment] = useState('tunai');
  const [showTunaiPopup, setShowTunaiPopup] = useState(false);
  const [showDebitPopup, setShowDebitPopup] = useState(false);
  const [showQrisPopup, setShowQrisPopup] = useState(false);
  const [showHoldPopup, setShowHoldPopup] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const handlePayNow = () => {
    if (items.length === 0) return;
    if (activePayment === 'tunai') {
      setShowTunaiPopup(true);
    } else if (activePayment === 'debit') {
      setShowDebitPopup(true);
    } else if (activePayment === 'qris') {
      setShowQrisPopup(true);
    }
  };

  const handleTunaiSubmit = (uangDiterima, kembalian) => {
    setShowTunaiPopup(false);
    if (onPaymentSuccess) {
      onPaymentSuccess('tunai', { uangDiterima, kembalian });
    }
  };

  const handleDebitSubmit = (referenceNumber) => {
    setShowDebitPopup(false);
    if (onPaymentSuccess) {
      onPaymentSuccess('debit', { referenceNumber });
    }
  };

  const handleQrisSubmit = () => {
    setShowQrisPopup(false);
    if (onPaymentSuccess) {
      onPaymentSuccess('qris', {});
    }
  };
  const handleSaveHoldOrder = async () => {

  if (customerName.trim() === '') {
    alert('Nama pelanggan wajib diisi.');
    return;
  }

  try {

    const response = await fetch(
      'http://127.0.0.1:8000/api/hold-orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

          nama_pelanggan: customerName,

          subtotal: subtotal,

          items: items.map(item => ({
            produk_id: item.id,
            qty: item.quantity,
            harga: item.price,
          })),

        }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      alert(result.message);
      return;
    }

    setShowHoldPopup(false);
setCustomerName('');

navigate('/kasir/tersimpan');

  } catch (error) {

    console.error(error);
    alert('Terjadi kesalahan.');

  }

};

  return (
    <aside
        id="order-panel"
        className="
      w-[360px]
      h-screen
      bg-white
      border-l
      border-gray-200
      shadow-lg
      flex
      flex-col
      fixed
      right-0
      top-0
      z-[90]
      "
>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
        <h2 className="text-base font-bold text-gray-900">Pesanan Saat Ini</h2>
        {itemCount > 0 && (
          <span className="w-6 h-6 rounded-full bg-[#082B7A] text-white text-xs font-bold flex items-center justify-center">{itemCount}</span>
        )}
      </div>

      {/* Order Items */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
          <span className="text-6xl opacity-40 mb-3">
            <HiOutlineShoppingCart />
          </span>
          <p>Belum ada pesanan</p>
          <p className="text-sm opacity-70">Klik produk untuk menambahkan</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-2">
          {items.map((item) => (
            <div
            key={item.id}
            id={`order-item-${item.id}`}
            className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <div className="w-11 h-11 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center text-gray-400 text-xl">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <HiOutlinePhotograph />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div
                className="text-sm font-semibold text-gray-900 truncate"
                title={item.name}
                >
                  {item.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatRupiah(item.price)} / pcs
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-gray-900 mb-2">
                  {formatRupiah(item.price * item.quantity)}
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    className="w-7 h-7 flex items-center justify-center text-[#082B7A] font-bold hover:bg-gray-100"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    id={`qty-minus-${item.id}`}
                  >
                    −
                  </button>
                  <div className="w-8 h-7 flex items-center justify-center border-x border-gray-300 text-sm font-semibold">{item.quantity}</div>
                  <button
                    className="w-7 h-7 flex items-center justify-center text-[#082B7A] font-bold hover:bg-gray-100"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    id={`qty-plus-${item.id}`}
                  >
                    +
                  </button>
                </div>
                {item.stock > 0 && item.quantity >= item.stock && (
                  <div className="text-[10px] text-red-500 mt-1">Stok maks</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary — NO Diskon Member (note 3) */}
      {items.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-900">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-500">Pajak (11%)</span>
            <span className="font-semibold text-gray-900">{formatRupiah(tax)}</span>
          </div>
          {donasi > 0 && (
            <div className="flex justify-between items-center mb-2 text-sm text-green-600">
              <span className="text-green-600">
                <HiOutlineHeart className="inline mr-1" />
                Donasi (Pembulatan)
              </span>
              <span className="font-semibold text-green-600">
            {formatRupiah(donasi)}
            </span>
            </div>
          )}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
            <span className="text-gray-500">Total Tagihan</span>
            <span className="text-4xl font-extrabold text-[#082B7A]">
            {formatRupiah(total)}
            </span>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="flex justify-center gap-4 px-5 py-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl border transition
            ${
            activePayment === method.id
                ? 'bg-blue-50 border-blue-500'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
              onClick={() => setActivePayment(method.id)}
              id={`payment-${method.id}`}
            >
              <span className="text-xl text-gray-600">
                <Icon />
              </span>
              <span>{method.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="p-5 space-y-3">

        <button
          className="w-full h-11 border-2 border-[#082B7A] text-[#082B7A] rounded-xl font-semibold hover:bg-blue-50 disabled:opacity-50"
          disabled={items.length === 0}
          onClick={() => setShowHoldPopup(true)}
        >
          Simpan Pesanan
        </button>

        <button
          className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          id="pay-button"
          disabled={items.length === 0}
          onClick={handlePayNow}
        >
          Bayar Sekarang
          <span className="text-lg">
            <HiArrowRight />
          </span>
        </button>

      </div>

      {showTunaiPopup && (
        <PopupTunai
          total={total}
          onClose={() => setShowTunaiPopup(false)}
          onSubmit={handleTunaiSubmit}
        />
      )}

      {showDebitPopup && (
        <PopupDebit
          total={total}
          onClose={() => setShowDebitPopup(false)}
          onSubmit={handleDebitSubmit}
        />
      )}

      {showQrisPopup && (
        <PopupQris
          total={total}
          onClose={() => setShowQrisPopup(false)}
          onSubmit={handleQrisSubmit}
        />
      )}

      {showHoldPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">

          <div className="bg-white rounded-xl w-[420px] p-6">

            <h2 className="text-xl font-bold mb-5">
              Simpan Pesanan
            </h2>

            <label className="block text-sm font-medium mb-2">
              Nama Pelanggan
            </label>

            <input
              type="text"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Budi"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6">

              <button
                className="px-5 py-2 rounded-lg border"
                onClick={() => {
                  setShowHoldPopup(false);
                  setCustomerName('');
                }}
              >
                Batal
              </button>

              <button
                className="px-5 py-2 rounded-lg bg-[#082B7A] text-white"
                onClick={handleSaveHoldOrder}>
                Simpan
              </button>

            </div>

          </div>

        </div>
      )}
    </aside>
  );
}
