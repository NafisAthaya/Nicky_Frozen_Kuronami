import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('access_token') || null,

  // Fungsi untuk menyimpan data setelah login sukses
  loginSuccess: (userData, tokenData) => {
    localStorage.setItem('access_token', tokenData);
    set({ user: userData, token: tokenData });
  },

  // Fungsi untuk memperbarui data user yang sedang login
  updateUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },

  // Fungsi untuk hapus data saat logout
  logoutSuccess: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  }
}));

export default useAuthStore;