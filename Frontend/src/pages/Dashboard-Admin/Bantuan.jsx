import { useState } from 'react';
import { MdInventory2, MdManageAccounts, MdKeyboardArrowDown } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa'; // Assuming react-icons/fa is available, otherwise will fallback to another icon

// Custom Accordion Component
const FaqAccordion = ({ question, children, isOpen, onClick }) => {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item--expanded' : ''}`}>
      <div className="faq-item__header" onClick={onClick}>
        <span className="faq-item__question">{question}</span>
        <MdKeyboardArrowDown className="faq-item__toggle-icon" />
      </div>
      <div className="faq-item__content">
        {children}
      </div>
    </div>
  );
};

export default function Bantuan() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
  <div className="max-w-5xl mx-auto p-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-blue-900">
        Pusat Bantuan Admin
      </h1>
      <p className="text-gray-500 mt-2">
        Panduan langkah-demi-langkah untuk mengelola sistem POS Nicky Frozen.
      </p>
    </div>

    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <MdInventory2 size={24} className="text-blue-600" />
        <h2 className="text-xl font-bold text-blue-600">
          Stok & Gudang
        </h2>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleAccordion(0)}
        >
          <span className="font-semibold">
            Bagaimana cara menginput barang masuk dari supplier?
          </span>
          <MdKeyboardArrowDown />
        </div>

        {openIndex === 0 && (
          <div className="mt-4 text-gray-600">
            <ul className="list-disc ml-6 space-y-1">
              <li>Buka menu Barang Masuk.</li>
              <li>Klik Tambah Stok Masuk.</li>
              <li>Pilih barang.</li>
              <li>Masukkan jumlah stok.</li>
              <li>Simpan data.</li>
            </ul>
          </div>
        )}
      </div>
    </div>

    <div className="bg-blue-800 rounded-2xl p-6 text-white flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">
          Butuh Bantuan Darurat?
        </h2>
        <p className="text-blue-100 mt-2">
          Hubungi IT Support atau Manajer Toko.
        </p>
      </div>

      <button className="bg-white text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
        <FaWhatsapp />
        WhatsApp
      </button>
    </div>
  </div>
);
}
