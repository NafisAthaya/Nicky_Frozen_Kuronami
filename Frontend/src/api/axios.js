import axios from 'axios';
import useAuthStore from '../store/authStore';

const axiosInstance = axios.create({
  // Sesuaikan dengan URL Laravel kamu
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor: Otomatis menyisipkan Token di setiap request
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Interceptor: Menangkap error 401 dan otomatis logout
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan redirect jika error 401 berasal dari endpoint login itu sendiri (salah password)
    const isLoginEndpoint = error.config && error.config.url === '/login';
    
    if (error.response && error.response.status === 401 && !isLoginEndpoint) {
      console.warn("Token expired atau tidak valid. Memaksa logout...");
      useAuthStore.getState().logoutSuccess();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;