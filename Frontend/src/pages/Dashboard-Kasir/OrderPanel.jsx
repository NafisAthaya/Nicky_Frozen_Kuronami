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
  diskonTotal,
  tax,
  layanan,
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



  return (
    <aside
        id="order-panel"
        className="
      w-[380px]
      h-full
      bg-white
      border-l
      border-gray-200
      shadow-2xl
      flex
      flex-col
      shrink-0
      z-30
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
            className="flex items-center gap-3 mx-4 my-2.5 p-3 bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] rounded-2xl hover:shadow-md hover:border-blue-100 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center text-gray-400 text-xl border border-gray-100">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <HiOutlinePhotograph />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div
                className="text-sm font-bold text-gray-800 truncate mb-0.5"
                title={item.name}
                >
                  {item.name}
                </div>
                <div className="text-xs font-medium text-gray-400 mb-2">
                  {formatRupiah(item.price)} / pcs
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#F5F7FB] rounded-full p-1 border border-gray-200">
                    <button
                      className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-[#082B7A] font-bold shadow-sm hover:bg-blue-50 transition-colors"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      id={`qty-minus-${item.id}`}
                    >
                      −
                    </button>
                    <div className="w-6 flex items-center justify-center text-xs font-bold text-gray-700">{item.quantity}</div>
                    <button
                      className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-[#082B7A] font-bold shadow-sm hover:bg-blue-50 transition-colors disabled:opacity-50"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      id={`qty-plus-${item.id}`}
                    >
                      +
                    </button>
                  </div>
                  {item.stock > 0 && item.quantity >= item.stock && (
                    <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">Max</span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 self-start mt-1">
                <div className="text-sm font-extrabold text-[#082B7A]">
                  {formatRupiah(item.price * item.quantity)}
                </div>
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
          {diskonTotal > 0 && (
            <div className="flex justify-between items-center mb-2 text-sm text-orange-500">
              <span className="text-orange-500">Diskon</span>
              <span className="font-semibold text-orange-500">- {formatRupiah(diskonTotal)}</span>
            </div>
          )}
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-500">Pajak (PB1/PPN)</span>
            <span className="font-semibold text-gray-900">{formatRupiah(tax)}</span>
          </div>
          {layanan > 0 && (
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-gray-500">Biaya Layanan</span>
              <span className="font-semibold text-gray-900">{formatRupiah(layanan)}</span>
            </div>
          )}
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
          <div className="flex flex-col mt-4 pt-4 border-t border-dashed border-gray-300 gap-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Tagihan</span>
            <span className="text-3xl font-black text-[#082B7A] tracking-tight">
            {formatRupiah(total)}
            </span>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="grid grid-cols-3 gap-3 px-5 py-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isActive = activePayment === method.id;
          return (
            <button
              key={method.id}
              className={`flex flex-col items-center justify-center gap-1.5 h-16 rounded-2xl border-2 transition-all duration-300 cursor-pointer
            ${
              isActive
                ? 'bg-blue-50/50 border-blue-600 text-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
            }`}
              onClick={() => setActivePayment(method.id)}
              id={`payment-${method.id}`}
            >
              <span className={`text-xl ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                <Icon />
              </span>
              <span className="text-[10px] font-bold">{method.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 pt-2">
        <button
          className="w-full h-14 bg-gradient-to-r from-[#FF7A00] to-[#FF5E00] hover:from-[#F06F00] hover:to-[#E05200] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(255,122,0,0.5)] hover:shadow-[0_10px_25px_-6px_rgba(255,122,0,0.6)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-0"
          id="pay-button"
          disabled={items.length === 0}
          onClick={handlePayNow}
        >
          <span className="text-lg">Bayar Sekarang</span>
          <span className="text-xl">
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


    </aside>
  );
}
