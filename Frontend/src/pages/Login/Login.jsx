import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ForgotPasswordModal from './ForgotPasswordModal';
import { Eye, EyeOff } from 'lucide-react';

import bgLogin from '../../assets/login-bg.webp';
import logoNicky from '../../assets/logo-nicky.png';

// Import "Suntikan" API dan State Management
import useAuthStore from '../../store/authStore';
import axiosInstance from '../../api/axios';

export default function Login() {
  const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch'));
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shift, setShift] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess); 

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

  try {
    const response = await axiosInstance.post('/login', {
      username,
      password,
    });

    const { user, access_token } = response.data;

    if (user.role === 'kasir' && !shift) {
      showToast('Kasir wajib memilih shift terlebih dahulu');
      setIsLoading(false);
      return;
    }

    // Validasi cabang
    if (
      user.role !== 'owner' &&
      selectedBranch &&
      user.cabang_id !== selectedBranch.id
    ) {
      showToast('Akun tidak sesuai dengan cabang yang dipilih');
      return;
    }

    // Simpan token & user
    loginSuccess(user, access_token);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.role === 'kasir') {
      localStorage.setItem('shift', shift);
      localStorage.setItem('loginTime', new Date().toISOString());
    }

    // Redirect sesuai role
    if (user.role === 'owner') {
      navigate('/owner');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'kasir') {
      navigate('/kasir');
    } else {
      navigate('/owner');
    }

  } catch (error) {
    console.error(error);

    const errorMessage =
      error.response?.data?.message || 'Gagal terhubung ke server';

    showToast(errorMessage);

  } finally {
    setIsLoading(false);
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgLogin})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl p-10">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <img
                src={logoNicky}
                alt="Nicky Frozen"
                className="w-24 h-24 object-contain"
              />
            </div>

            <h1 className="text-4xl font-bold text-gray-800">
              Nicky Frozen
            </h1>

            <p className="text-gray-500 mt-2">
              Sistem Point of Sale
            </p>

            {selectedBranch && (
              <>
                <p className="mt-3 text-sm font-semibold text-blue-700">
                  {selectedBranch.name}
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  Ganti Cabang
                </button>
              </>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email / Username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                }
              />

              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-600">
                    Tampilkan password
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-blue-700 hover:text-blue-800 font-medium"
                >
                  Lupa Password?
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Shift (Khusus Kasir)</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white"
              >
                <option value="">Pilih Shift</option>
                <option value="Shift 1">Shift 1 (06.00 - 10.00)</option>
                <option value="Shift 2">Shift 2 (10.00 - 14.00)</option>
                <option value="Shift 3">Shift 3 (14.00 - 18.00)</option>
                <option value="Shift 4">Shift 4 (18.00 - 22.00)</option>
              </select>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={!username.trim() || !password.trim() || isLoading}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl h-14 transition-colors duration-200 mt-2"
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 mt-8">
            © 2026 Nicky Frozen. All rights reserved.
          </p>
        </div>
      </div>

      {/* Server Status */}
      <div className="absolute bottom-8 w-full max-w-md px-6 flex justify-between text-xs text-white tracking-widest font-medium">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          SERVER TERHUBUNG
        </div>

        <div>V2.4.0-KURONAMI</div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 bg-red-600 text-white font-medium rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}