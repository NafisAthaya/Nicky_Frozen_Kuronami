const API_BASE = 'http://127.0.0.1:8000/api';

/**
 * Helper: get cabang_id from the logged-in user stored in localStorage
 */
function getCabangId() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.cabang_id || null;
  } catch {
    return null;
  }
}

/**
 * Helper: build query string with cabang_id
 */
function withCabang(params = {}) {
  const cabangId = getCabangId();
  if (cabangId) {
    params.cabang_id = cabangId;
  }
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : '';
}

// ─── Dashboard Stats ─────────────────────────────────
export async function fetchDashboardStats(filters = {}) {
  const params = { ...filters };
  const cabangId = getCabangId();
  if (cabangId) params.cabang_id = cabangId;

  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/admin/dashboard-stats${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('Gagal memuat statistik dashboard');
  return res.json();
}

// ─── Produk CRUD ──────────────────────────────────────
export async function fetchProduks(filters = {}) {
  const params = {};
  const cabangId = getCabangId();
  if (cabangId) params.cabang_id = cabangId;
  if (filters.kategori) params.kategori = filters.kategori;

  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/admin/produks${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('Gagal memuat produk');
  return res.json();
}

export async function createProduk(data) {
  const cabangId = getCabangId();
  const res = await fetch(`${API_BASE}/admin/produks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, cabang_id: cabangId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal menambahkan produk');
  return json;
}

export async function updateProduk(id, data) {
  const res = await fetch(`${API_BASE}/admin/produks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal memperbarui produk');
  return json;
}

export async function deleteProduk(id) {
  const res = await fetch(`${API_BASE}/admin/produks/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal menghapus produk');
  return json;
}

// ─── Produk Batches (Barang Masuk) ────────────────────
export async function fetchBatches(limit = null) {
  const params = {};
  const cabangId = getCabangId();
  if (cabangId) params.cabang_id = cabangId;
  if (limit) params.limit = limit;

  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/admin/produk-batches${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('Gagal memuat data barang masuk');
  return res.json();
}

export async function createBatch(data) {
  const res = await fetch(`${API_BASE}/admin/produk-batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal mencatat barang masuk');
  return json;
}

export async function updateBatch(id, data) {
  const res = await fetch(`${API_BASE}/admin/produk-batches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal memperbarui barang masuk');
  return json;
}

// ─── Kategoris ────────────────────────────────────────
export async function fetchKategoris() {
  const res = await fetch(`${API_BASE}/admin/kategoris${withCabang()}`);
  if (!res.ok) throw new Error('Gagal memuat kategori');
  return res.json();
}
