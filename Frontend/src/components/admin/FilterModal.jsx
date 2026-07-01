import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  kategoris = [],
}) {
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [pilihSemua, setPilihSemua] = useState(true);

  // Jika modal ditutup lalu dibuka lagi, mungkin Anda ingin me-reset 
  // ke state dari parent, tapi untuk kesederhanaan kita taruh di sini dulu.

  if (!isOpen) return null;

  const handleTogglePilihSemua = () => {
    if (!pilihSemua) {
      setPilihSemua(true);
      setSelectedCategoryNames([]); // kosongkan yang spesifik
    } else {
      setPilihSemua(false);
    }
  };

  const handleToggleCategory = (catName) => {
    setPilihSemua(false);
    setSelectedCategoryNames((prev) =>
      prev.includes(catName)
        ? prev.filter((name) => name !== catName)
        : [...prev, catName]
    );
  };

  const handleApply = () => {
    onApply({
      pilihSemua,
      selectedCategoryNames,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-lg font-bold text-gray-800">
            Filter Kategori
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          
          <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition border border-transparent hover:border-gray-200">
            <input
              type="checkbox"
              checked={pilihSemua}
              onChange={handleTogglePilihSemua}
              className="w-5 h-5 rounded border-gray-300 text-[#082B7A] focus:ring-[#082B7A]"
            />
            <span className="font-semibold text-gray-700">Pilih Semua Kategori</span>
          </label>

          <div className="h-px bg-gray-100 my-2 ml-10"></div>

          <div className="space-y-1">
            {kategoris.map((kat, idx) => (
              <label 
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCategoryNames.includes(kat.name)}
                    onChange={() => handleToggleCategory(kat.name)}
                    className="w-5 h-5 rounded border-gray-300 text-[#082B7A] focus:ring-[#082B7A]"
                  />
                  <span className="text-gray-700">{kat.name}</span>
                </div>
                {kat.product_count !== undefined && (
                   <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-semibold">
                     {kat.product_count}
                   </span>
                )}
              </label>
            ))}
            {kategoris.length === 0 && (
              <div className="text-center py-4 text-sm text-gray-500">
                Belum ada data kategori.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="border-t p-5 bg-gray-50">
          <button
            onClick={handleApply}
            className="w-full py-3 bg-[#082B7A] hover:bg-[#0B3B91] text-white rounded-xl font-bold transition shadow-lg shadow-blue-900/20"
          >
            Terapkan Filter
          </button>
        </div>

      </div>
    </div>
  );
}