import { useState, useEffect, useMemo, useRef } from 'react';
import { MdQrCodeScanner, MdSearch, MdClose } from 'react-icons/md';
import { useApp } from '../../context/AppContext';

export default function TambahProdukModal({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}) {
  const { categories, addProduct, updateProduct } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    expiryDate: '',
    stock: '',
    price: '',
    categoryIds: [],
  });

  const [error, setError] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categoryDropdownRef = useRef(null);

  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        sku: editData.sku || '',
        expiryDate: editData.expiryDate || '',
        stock: String(editData.stock || ''),
        price: String(editData.price || ''),
        categoryIds: editData.categoryIds || [],
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        expiryDate: '',
        stock: '',
        price: '',
        categoryIds: [],
      });
    }

    setError('');
    setCategorySearchQuery('');
    setIsCategoryDropdownOpen(false);
  }, [editData, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return categories;

    return categories.filter((cat) =>
      cat.name
        .toLowerCase()
        .includes(categorySearchQuery.toLowerCase())
    );
  }, [categories, categorySearchQuery]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError('');
  };

  const handleCategoryToggle = (catId) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim())
      return setError('Nama produk wajib diisi.');

    if (!formData.sku.trim())
      return setError('SKU wajib diisi.');

    if (!formData.price)
      return setError('Harga wajib diisi.');

    if (!formData.stock)
      return setError('Stok wajib diisi.');

    if (formData.categoryIds.length === 0)
      return setError(
        'Pilih minimal satu kategori.'
      );

    const payload = {
      name: formData.name,
      sku: formData.sku,
      expiryDate: formData.expiryDate,
      stock: Number(formData.stock),
      price: Number(formData.price),
      categoryIds: formData.categoryIds,
    };

    if (isEditMode) {
      updateProduct(editData.id, payload);
    } else {
      addProduct(payload);
    }

    onSuccess();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode
              ? 'Edit Produk'
              : 'Tambah Produk Baru'}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isEditMode && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <MdQrCodeScanner
                  size={48}
                  className="mx-auto mb-3 text-slate-500"
                />

                <p className="text-sm text-slate-600">
                  Gunakan scanner barcode
                  untuk mengisi SKU otomatis
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Nama Produk
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  handleChange(
                    'name',
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                SKU / Barcode
              </label>

              <input
                type="text"
                value={formData.sku}
                onChange={(e) =>
                  handleChange(
                    'sku',
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div ref={categoryDropdownRef}>
              <label className="mb-2 block text-sm font-semibold">
                Kategori Produk
              </label>

              <div className="relative">
                <MdSearch
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Cari kategori..."
                  value={categorySearchQuery}
                  onFocus={() =>
                    setIsCategoryDropdownOpen(
                      true
                    )
                  }
                  onChange={(e) =>
                    setCategorySearchQuery(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-slate-900"
                />
              </div>

              {isCategoryDropdownOpen && (
                <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border bg-white shadow-lg">
                  {filteredCategories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(
                          cat.id
                        )}
                        onChange={() =>
                          handleCategoryToggle(
                            cat.id
                          )
                        }
                      />

                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {formData.categoryIds.length >
                0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.categoryIds.map(
                    (id) => {
                      const cat =
                        categories.find(
                          (c) => c.id === id
                        );

                      if (!cat) return null;

                      return (
                        <span
                          key={id}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold"
                        >
                          {cat.name}
                        </span>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Tanggal Kadaluwarsa
              </label>

              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleChange(
                    'expiryDate',
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Stok
              </label>

              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  handleChange(
                    'stock',
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Harga Produk
              </label>

              <div className="flex overflow-hidden rounded-xl border border-slate-300">
                <span className="bg-slate-100 px-4 py-3 font-semibold">
                  Rp
                </span>

                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleChange(
                      'price',
                      e.target.value
                    )
                  }
                  className="flex-1 px-4 py-3 outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
          >
            {isEditMode
              ? 'Simpan Perubahan'
              : 'Simpan Produk'}
          </button>
        </div>
      </div>
    </div>
  );
}