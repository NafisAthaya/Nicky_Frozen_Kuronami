import { useState, useCallback, useMemo } from 'react';

const TAX_RATE = 0.11; // 11% pajak

export function useCart() {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Don't exceed available stock
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
          // Don't exceed available stock
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

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const tax = useMemo(() => Math.round(subtotal * TAX_RATE), [subtotal]);

  // Donasi pembulatan: bulatkan total ke ribuan terdekat ke atas
  const donasi = useMemo(() => {
    if (items.length === 0) return 0;
    const rawTotal = subtotal + tax;
    const rounded = Math.ceil(rawTotal / 1000) * 1000;
    return rounded - rawTotal;
  }, [subtotal, tax, items.length]);

  const total = useMemo(
    () => (items.length > 0 ? subtotal + tax + donasi : 0),
    [subtotal, tax, donasi, items.length]
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
    tax,
    donasi,
    total,
    itemCount,
  };
}
