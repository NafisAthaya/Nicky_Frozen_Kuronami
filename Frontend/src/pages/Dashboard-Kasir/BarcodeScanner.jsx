import { useState } from 'react';
import { HiOutlineQrcode } from 'react-icons/hi';

export default function BarcodeScanner({ onScan }) {
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      const result = onScan?.(value.trim());
      if (result === false) {
        setFeedback('Produk tidak ditemukan');
        setTimeout(() => setFeedback(null), 2000);
      } else {
        setFeedback('Produk ditambahkan!');
        setTimeout(() => setFeedback(null), 1500);
        setValue('');
      }
    }
  };

  return (
  <div
    id="barcode-scanner"
    className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-5 mb-4 transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
  >
    <h3 className="text-[15px] font-bold text-gray-800 text-center mb-3">
      Scan barcode
    </h3>

    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
        <HiOutlineQrcode />
      </span>

      <input
        type="text"
        placeholder="Tekan Enter atau scan barcode..."
        id="barcode-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-10 pl-11 pr-4 border border-gray-300 rounded-xl text-sm text-gray-800 bg-gray-50 outline-none transition-all focus:border-blue-600 focus:bg-white"
      />
    </div>

    {feedback && (
      <div
        className={`mt-3 px-4 py-2 rounded-xl text-sm font-medium ${
          feedback.includes('tidak')
            ? 'bg-red-100 text-red-600'
            : 'bg-green-100 text-green-600'
        }`}
      >
        {feedback}
      </div>
    )}
  </div>
);
}
