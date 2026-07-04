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

export default axiosInstance;