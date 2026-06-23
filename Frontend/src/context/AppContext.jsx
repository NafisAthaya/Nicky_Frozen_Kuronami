import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ─── Helper: localStorage ─────────────────────────────
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

// ─── Helper: ID generator ─────────────────────────────
let _idCounter = Date.now();
function generateId(prefix = '') {
  _idCounter++;
  return `${prefix}${_idCounter}`;
}

// ─── Context ──────────────────────────────────────────
const AppContext = createContext();

export function AppProvider({ children }) {
  // ─── State ────────────────────────────────────────
  const [categories, setCategories] = useState(() => loadFromStorage('nf_categories', []));
  const [products, setProducts] = useState(() => loadFromStorage('nf_products', []));
  const [stockEntries, setStockEntries] = useState(() => loadFromStorage('nf_stockEntries', []));

  // ─── Persist to localStorage on change ────────────
  useEffect(() => { saveToStorage('nf_categories', categories); }, [categories]);
  useEffect(() => { saveToStorage('nf_products', products); }, [products]);
  useEffect(() => { saveToStorage('nf_stockEntries', stockEntries); }, [stockEntries]);

  // ═══════════════════════════════════════════════════
  // CATEGORY CRUD
  // ═══════════════════════════════════════════════════

  const addCategory = useCallback((name, description = '') => {
    const newCat = {
      id: generateId('CAT-'),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  }, []);

  const updateCategory = useCallback((id, name, description) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id
          ? { ...cat, name: name.trim(), description: (description || '').trim() }
          : cat
      )
    );
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Also remove this category from any products that reference it
    setProducts(prev =>
      prev.map(p => ({
        ...p,
        categoryIds: (p.categoryIds || []).filter(cid => cid !== id),
      }))
    );
  }, []);

  const isCategoryNameTaken = useCallback((name, excludeId = null) => {
    return categories.some(
      cat => cat.name.toLowerCase() === name.trim().toLowerCase() && cat.id !== excludeId
    );
  }, [categories]);

  // ═══════════════════════════════════════════════════
  // PRODUCT CRUD
  // ═══════════════════════════════════════════════════

  const addProduct = useCallback((data) => {
    const newProduct = {
      id: generateId('PRD-'),
      name: data.name.trim(),
      sku: data.sku.trim(),
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 0,
      expiryDate: data.expiryDate || '',
      categoryIds: data.categoryIds || [],
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, data) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              name: data.name !== undefined ? data.name.trim() : p.name,
              sku: data.sku !== undefined ? data.sku.trim() : p.sku,
              price: data.price !== undefined ? Number(data.price) : p.price,
              stock: data.stock !== undefined ? Number(data.stock) : p.stock,
              expiryDate: data.expiryDate !== undefined ? data.expiryDate : p.expiryDate,
              categoryIds: data.categoryIds !== undefined ? data.categoryIds : p.categoryIds,
            }
          : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // Also remove related stock entries
    setStockEntries(prev => prev.filter(e => e.productId !== id));
  }, []);

  // ═══════════════════════════════════════════════════
  // STOCK ENTRY
  // ═══════════════════════════════════════════════════

  const addStockEntry = useCallback((data) => {
    const entry = {
      id: generateId('STK-'),
      productId: data.productId,
      productName: data.productName || '',
      qty: Number(data.qty) || 0,
      expiryDate: data.expiryDate || '',
      buyPrice: Number(data.buyPrice) || 0,
      supplier: (data.supplier || '').trim(),
      notes: (data.notes || '').trim(),
      createdAt: new Date().toISOString(),
    };
    setStockEntries(prev => [entry, ...prev]); // newest first

    // Update product stock and expiry
    setProducts(prev =>
      prev.map(p => {
        if (p.id === data.productId) {
          const updatedFields = {
            stock: p.stock + entry.qty,
          };
          // Update expiry if a new one is provided
          if (data.expiryDate) {
            // Keep the soonest expiry date
            if (!p.expiryDate || new Date(data.expiryDate) < new Date(p.expiryDate)) {
              updatedFields.expiryDate = data.expiryDate;
            }
          }
          return { ...p, ...updatedFields };
        }
        return p;
      })
    );

    return entry;
  }, []);

  // ═══════════════════════════════════════════════════
  // COMPUTED / DERIVED DATA
  // ═══════════════════════════════════════════════════

  const getCategoryName = useCallback((catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : '';
  }, [categories]);

  const getCategoryNames = useCallback((categoryIds = []) => {
    return categoryIds
      .map(id => getCategoryName(id))
      .filter(Boolean)
      .join(', ');
  }, [getCategoryName]);

  const getProductCountForCategory = useCallback((catId) => {
    return products.filter(p => (p.categoryIds || []).includes(catId)).length;
  }, [products]);

  const getExpiringProducts = useCallback((days = 7) => {
    const now = new Date();
    const limit = new Date(now);
    limit.setDate(limit.getDate() + days);

    return products
      .filter(p => {
        if (!p.expiryDate) return false;
        const exp = new Date(p.expiryDate);
        return exp >= now && exp <= limit;
      })
      .map(p => {
        const exp = new Date(p.expiryDate);
        const diffMs = exp - now;
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return { ...p, daysLeft };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [products]);

  const getTotalProducts = useCallback(() => {
    return products.length;
  }, [products]);

  const getTotalStock = useCallback(() => {
    return products.reduce((sum, p) => sum + p.stock, 0);
  }, [products]);

  const getExpiryLossEstimate = useCallback((days = 7) => {
    const expiring = getExpiringProducts(days);
    return expiring.reduce((sum, p) => sum + (p.price * p.stock), 0);
  }, [getExpiringProducts]);

  const getProductById = useCallback((id) => {
    return products.find(p => p.id === id) || null;
  }, [products]);

  const getRecentStockEntries = useCallback((limit = 5) => {
    return stockEntries.slice(0, limit);
  }, [stockEntries]);

  // ─── Context Value ────────────────────────────────
  const value = {
    // State
    categories,
    products,
    stockEntries,

    // Category CRUD
    addCategory,
    updateCategory,
    deleteCategory,
    isCategoryNameTaken,

    // Product CRUD
    addProduct,
    updateProduct,
    deleteProduct,

    // Stock Entry
    addStockEntry,

    // Computed
    getCategoryName,
    getCategoryNames,
    getProductCountForCategory,
    getExpiringProducts,
    getTotalProducts,
    getTotalStock,
    getExpiryLossEstimate,
    getProductById,
    getRecentStockEntries,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
