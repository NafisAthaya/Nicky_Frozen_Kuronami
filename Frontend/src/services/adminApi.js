import axiosInstance from '../api/axios';
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
  const res = await axiosInstance.get(`/admin/dashboard-stats${qs ? `?${qs}` : ''}`);
  return res.data;
}

// ─── Produk CRUD ──────────────────────────────────────
export async function fetchProduks(filters = {}) {
  const params = {};
  const cabangId = getCabangId();
  if (cabangId) params.cabang_id = cabangId;
  if (filters.kategori) params.kategori = filters.kategori;

  const qs = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/admin/produks${qs ? `?${qs}` : ''}`);
  return res.data;
}

export async function createProduk(data) {
  const cabangId = getCabangId();
  
  let options = { method: 'POST' };
  
  if (data instanceof FormData) {
    if (cabangId) data.append('cabang_id', cabangId);
    options.data = data;
    options.headers = { 'Content-Type': 'multipart/form-data' };
  } else {
    options.headers = { 'Content-Type': 'application/json' };
    options.data = { ...data, cabang_id: cabangId };
  }

  try {
    const res = await axiosInstance({
      method: options.method,
      url: '/admin/produks',
      data: options.data,
      headers: options.headers
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menambahkan produk');
  }
}

export async function updateProduk(id, data) {
  let options = { method: 'POST' }; // Use POST for update with FormData (Laravel requires POST + _method=PUT)
  
  if (data instanceof FormData) {
    data.append('_method', 'PUT'); // Laravel workaround for PUT requests with FormData
    options.data = data;
    options.headers = { 'Content-Type': 'multipart/form-data' };
  } else {
    options.method = 'PUT';
    options.headers = { 'Content-Type': 'application/json' };
    options.data = data;
  }

  try {
    const res = await axiosInstance({
      method: options.method,
      url: `/admin/produks/${id}`,
      data: options.data,
      headers: options.headers
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal memperbarui produk');
  }
}

export async function deleteProduk(id) {
  try {
    const res = await axiosInstance.delete(`/admin/produks/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menghapus produk');
  }
}

// ─── Produk Batches (Barang Masuk) ────────────────────
export async function fetchBatches(limit = null) {
  const params = {};
  const cabangId = getCabangId();
  if (cabangId) params.cabang_id = cabangId;
  if (limit) params.limit = limit;

  const qs = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/admin/produk-batches${qs ? `?${qs}` : ''}`);
  return res.data;
}

export async function createBatch(data) {
  try {
    const res = await axiosInstance.post(`/admin/produk-batches`, data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mencatat barang masuk');
  }
}

export async function updateBatch(id, data) {
  try {
    const res = await axiosInstance.put(`/admin/produk-batches/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal memperbarui barang masuk');
  }
}

// ─── Kategoris ────────────────────────────────────────
export async function fetchKategoris() {
  const res = await axiosInstance.get(`/admin/kategoris${withCabang()}`);
  return res.data;
}

export async function addKategori(data) {
  const res = await axiosInstance.post('/admin/kategoris', data);
  return res.data;
}

export async function updateKategori(id, data) {
  const res = await axiosInstance.put(`/admin/kategoris/${id}`, data);
  return res.data;
}

export async function deleteKategori(id) {
  const res = await axiosInstance.delete(`/admin/kategoris/${id}`);
  return res.data;
}
