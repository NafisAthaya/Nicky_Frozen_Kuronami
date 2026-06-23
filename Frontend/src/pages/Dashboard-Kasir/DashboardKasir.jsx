import { useState, useMemo, useEffect, useCallback } from 'react';

import BarcodeScanner from './BarcodeScanner';
import CategoryTabs from './CategoryTabs';
import ProductGrid from './ProductGrid';
import OrderPanel from './OrderPanel';

import { useCart } from '../../hooks/useCart';
import StatusPembayaran from './StatusPembayaran';


export default function DashboardKasir() {
  const cart = useCart();

  const [activeCategory, setActiveCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const [productsData, setProductsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const loadData = useCallback(async () => {
  try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/produks'
    );

    const data = await response.json();

    const mappedProducts = data.map((item) => ({
      id: item.id,
      name: item.nama_produk,
      sku: item.sku,
      price: Number(item.harga_jual),
      stock: Number(item.stok_total),
      image: item.gambar,
      categoryIds: [item.kategori.toLowerCase()],
      available: Number(item.stok_total) > 0,
    }));

    setProductsData(mappedProducts);

    const uniqueCategories = [
      ...new Set(data.map((item) => item.kategori))
    ];

    setCategoriesData([
      { id: 'semua', name: 'Semua' },

      ...uniqueCategories.map((kategori) => ({
        id: kategori.toLowerCase(),
        name: kategori,
      })),
    ]);

  } catch (error) {
    console.error(error);
  }
}, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    let result = productsData;

    if (activeCategory !== 'semua') {
      result = result.filter((p) =>
        p.categoryIds?.includes(activeCategory)
      );
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();

      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.sku?.toLowerCase().includes(lowerQuery)
      );
    }

    return result;
  }, [productsData, activeCategory, searchQuery]);

  const handleBarcodeScan = (value) => {
    const lowerValue = value.toLowerCase();

    const product = productsData.find(
      (p) =>
        p.sku?.toLowerCase() === lowerValue ||
        p.name.toLowerCase() === lowerValue
    );

    if (!product) return false;

    cart.addItem(product);
    return true;
  };


  const handlePaymentSuccess = async (
  metodePembayaran,
  paymentData
) => {
  try {
    const payload = {
      metode_pembayaran: metodePembayaran,
      uang_diterima:
        paymentData.uangDiterima ?? cart.total,
      items: cart.items.map((item) => ({
        produk_id: item.id,
        qty: item.quantity,
      })),
    };

    const response = await fetch(
      'http://127.0.0.1:8000/api/transaksi',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

        if (result.success) {
      setSuccessData({
        transactionId: result.no_transaksi,
        items: [...cart.items],
        subtotal: cart.subtotal,
        tax: cart.tax,
        donasi: cart.donasi,
        total: cart.total,
        paymentMethod: metodePembayaran,
        paymentDetail: paymentData,
      });

      setShowSuccessPopup(true);

      await loadData();
    } else {
      alert('Transaksi gagal');
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan');
  }
};

const handleNewTransaction = () => {
  setShowSuccessPopup(false);
  setSuccessData(null);
  cart.clearCart();
};

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
        <BarcodeScanner onScan={handleBarcodeScan} />

        <CategoryTabs
          categories={categoriesData}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <ProductGrid
          products={filteredProducts}
          cartItems={cart.items}
          onAddToCart={cart.addItem}
        />
      </div>

      <OrderPanel
        items={cart.items}
        subtotal={cart.subtotal}
        tax={cart.tax}
        donasi={cart.donasi}
        total={cart.total}
        itemCount={cart.itemCount}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {showSuccessPopup && successData && (
      <StatusPembayaran
        transactionId={successData.transactionId}
        items={successData.items}
        subtotal={successData.subtotal}
        tax={successData.tax}
        donasi={successData.donasi}
        total={successData.total}
        paymentMethod={successData.paymentMethod}
        paymentDetail={successData.paymentDetail}
        onNewTransaction={handleNewTransaction}
      />
    )}
    </div>
  );
}