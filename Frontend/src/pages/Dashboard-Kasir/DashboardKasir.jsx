import { useState, useMemo, useEffect, useCallback } from 'react';

import BarcodeScanner from './BarcodeScanner';
import CategoryTabs from './CategoryTabs';
import ProductGrid from './ProductGrid';
import OrderPanel from './OrderPanel';

import { useCart } from '../../hooks/UseCart';
import useAuthStore from '../../store/authStore';
import StatusPembayaran from './StatusPembayaran';
import axiosInstance from '../../api/axios';
import { useOutletContext } from 'react-router-dom';

export default function DashboardKasir() {
  const { token } = useAuthStore();
  const cart = useCart();
  console.log(cart);
  const [activeCategory, setActiveCategory] = useState('semua');
  const { globalSearch } = useOutletContext();

  const [productsData, setProductsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadData = useCallback(async () => {
  try {
    const [produksResponse, kategorisResponse] = await Promise.all([
      axiosInstance.get('/kasir/produks'),
      axiosInstance.get('/kasir/kategoris')
    ]);

    const data = produksResponse.data.data || produksResponse.data;
    const itemsArray = Array.isArray(data) ? data : [];

    const mappedProducts = itemsArray.map((item) => ({
      id: item.id,
      name: item.nama_produk,
      sku: item.sku,
      price: Number(item.harga_diskon ?? item.harga_jual),
      originalPrice: Number(item.harga_jual),
      isDiscounted: item.is_discounted,
      stock: Number(item.stok_total),
      image: item.gambar,
      categoryIds: [item.kategori?.toLowerCase()],
      available: Number(item.stok_total) > 0,
      batchBarcodes: item.batches?.map(b => b.barcode_custom?.toLowerCase()).filter(Boolean) || [],
    }));

    // Urutkan dari yang terbaru (id terbesar) ke yang terlama
    mappedProducts.sort((a, b) => b.id - a.id);

    setProductsData(mappedProducts);

    const katsData = kategorisResponse.data || [];
    
    setCategoriesData([
      { id: 'semua', name: 'Semua' },
      ...katsData.map((cat) => ({
        id: cat.name.toLowerCase(),
        name: cat.name,
      })),
    ]);

  } catch (error) {
    console.error(error);
  }
}, []);

  useEffect(() => {
    loadData();

    // Sinkronisasi Global: re-fetch semua data saat tombol sinkronisasi diklik
    const handleGlobalSync = () => loadData();
    window.addEventListener('global-sync', handleGlobalSync);

    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    let result = productsData;

    if (activeCategory !== 'semua') {
      result = result.filter((p) =>
        p.categoryIds?.includes(activeCategory)
      );
    }

    if (globalSearch) {
      const lowerQuery = globalSearch.toLowerCase();

      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.sku?.toLowerCase().includes(lowerQuery) ||
          p.batchBarcodes?.some((barcode) => barcode.includes(lowerQuery))
      );
    }

    return result;
  }, [productsData, activeCategory, globalSearch]);

  const handleBarcodeScan = (value) => {
    const lowerValue = value.toLowerCase();

    const product = productsData.find(
      (p) =>
        p.sku?.toLowerCase() === lowerValue ||
        p.name.toLowerCase() === lowerValue ||
        p.batchBarcodes?.includes(lowerValue)
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
      uang_diterima: paymentData.uangDiterima ?? cart.total,
      subtotal: cart.subtotal,
      diskon: cart.diskonTotal,
      pajak: cart.tax,
      biaya_layanan: cart.layanan,
      pembulatan_donasi: cart.donasi,
      total_tagihan: cart.total,
      items: cart.items.map((item) => ({
        produk_id: item.id,
        qty: item.quantity,
      })),
      shift: localStorage.getItem('shift') || null,
    };

    const response = await axiosInstance.post('/kasir/transaksi', payload);
    const result = response.data;

        if (result.status === 'success') {
      setSuccessData({
        transactionId: result.data.no_transaksi,
        items: [...cart.items],
        subtotal: cart.subtotal,
        diskonTotal: cart.diskonTotal,
        tax: cart.tax,
        layanan: cart.layanan,
        donasi: cart.donasi,
        total: cart.total,
        paymentMethod: metodePembayaran,
        paymentDetail: paymentData,
      });

      setShowSuccessPopup(true);

      await loadData();
    } else {
      setErrorMessage('Transaksi gagal, silakan coba lagi.');
      setTimeout(() => setErrorMessage(null), 4000);
    }
  } catch (error) {
    console.error(error);
    setErrorMessage(error?.response?.data?.message || 'Terjadi kesalahan saat memproses transaksi.');
    setTimeout(() => setErrorMessage(null), 4000);
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
            diskonTotal={cart.diskonTotal}
            tax={cart.tax}
            layanan={cart.layanan}
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
        diskonTotal={successData.diskonTotal}
        tax={successData.tax}
        layanan={successData.layanan}
        donasi={successData.donasi}
        total={successData.total}
        paymentMethod={successData.paymentMethod}
        paymentDetail={successData.paymentDetail}
        onNewTransaction={handleNewTransaction}
      />
    )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="font-medium text-sm">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-2 hover:bg-red-700 rounded-full p-1 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}