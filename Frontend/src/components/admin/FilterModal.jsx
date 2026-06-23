import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { useApp } from '../../context/AppContext';

export default function FilterModal({ isOpen, onClose, onApply }) {
  const { categories } = useApp();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [pilihSemua, setPilihSemua] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategoryIds([]);
      setPilihSemua(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePilihSemua = (checked) => {
    setPilihSemua(checked);

    if (checked) {
      setSelectedCategoryIds(categories.map((c) => c.id));
    } else {
      setSelectedCategoryIds([]);
    }
  };

  const handleCategoryToggle = (catId) => {
    setSelectedCategoryIds((prev) => {
      const updated = prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId];

      setPilihSemua(
        updated.length === categories.length &&
        categories.length > 0
      );

      return updated;
    });
  };

  const handleApply = () => {
    onApply({
      pilihSemua,
      selectedCategoryIds: pilihSemua ? [] : selectedCategoryIds,
    });

    onClose();
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
    setPilihSemua(false);

    onApply({
      pilihSemua: false,
      selectedCategoryIds: [],
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-slate-800">
            Filter Stok
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <MdClose size={22} />
          </button>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">
            Kategori Produk
          </h3>

          {categories.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              Belum ada kategori.
            </p>
          ) : (
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${
                  pilihSemua
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={pilihSemua}
                  onChange={(e) =>
                    handlePilihSemua(e.target.checked)
                  }
                />

                <span className="font-medium">
                  Pilih Semua
                </span>
              </label>

              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${
                    selectedCategoryIds.includes(cat.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() =>
                      handleCategoryToggle(cat.id)
                    }
                  />

                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-5 border-t">
          <button
            onClick={handleReset}
            className="flex-1 py-3 border rounded-xl font-medium hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}