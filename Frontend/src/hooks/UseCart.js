import { useState, useCallback, useMemo, useEffect } from 'react';
import useAuthStore from '../store/authStore';

export function useCart() {
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({
    pajak_persen: 0,
    layanan_persen: 0,
    aktifkan_pembulatan: false,
    nominal_pembulatan: 100,
    arah_pembulatan: 'terdekat'
  });
  
  const { token } = useAuthStore();

  useEffect(() => {
    // Fetch setting toko untuk pajak dan pembulatan
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/kasir/pengaturan-toko', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          setSettings(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch pengaturan toko', err);
      }
    };
    if (token) fetchSettings();
  }, [token]);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const maxQty = Math.min(quantity, item.stock);
          return { ...item, quantity: maxQty };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const loadCart = useCallback((cartItems) => {
    setItems(cartItems);
  }, []);

  // Subtotal (Harga ASLI sebelum diskon)
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity, 0),
    [items]
  );

  // Total Diskon yang didapat
  const diskonTotal = useMemo(
    () => items.reduce((sum, item) => {
      const original = item.originalPrice ?? item.price;
      const discounted = item.price;
      return sum + ((original - discounted) * item.quantity);
    }, 0),
    [items]
  );

  // Nilai transaksi SETELAH diskon
  const subtotalSetelahDiskon = subtotal - diskonTotal;

  // Pajak dihitung dari transaksi SETELAH diskon
  const tax = useMemo(() => {
    const rate = Number(settings.pajak_persen) / 100;
    return Math.round(subtotalSetelahDiskon * rate);
  }, [subtotalSetelahDiskon, settings.pajak_persen]);

  // Biaya Layanan dihitung dari transaksi SETELAH diskon
  const layanan = useMemo(() => {
    const rate = Number(settings.layanan_persen) / 100;
    return Math.round(subtotalSetelahDiskon * rate);
  }, [subtotalSetelahDiskon, settings.layanan_persen]);

  // Donasi / Pembulatan
  const donasi = useMemo(() => {
    if (items.length === 0) return 0;
    if (!settings.aktifkan_pembulatan) return 0;
    
    const rawTotal = subtotalSetelahDiskon + tax + layanan;
    const nominal = Number(settings.nominal_pembulatan) || 100;
    
    let rounded = rawTotal;
    if (settings.arah_pembulatan === 'atas') {
      rounded = Math.ceil(rawTotal / nominal) * nominal;
    } else {
      rounded = Math.round(rawTotal / nominal) * nominal;
    }
    
    // Jika pembulatan ke bawah, donasi bisa negatif (diskon tambahan), tapi kita set 0 jika negatif atau simpan sebagai pembulatan
    return rounded - rawTotal;
  }, [subtotalSetelahDiskon, tax, layanan, items.length, settings]);

  const total = useMemo(
    () => (items.length > 0 ? subtotalSetelahDiskon + tax + layanan + donasi : 0),
    [subtotalSetelahDiskon, tax, layanan, donasi, items.length]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCart,
    subtotal,
    diskonTotal,
    tax,
    layanan,
    donasi,
    total,
    itemCount,
  };
}
