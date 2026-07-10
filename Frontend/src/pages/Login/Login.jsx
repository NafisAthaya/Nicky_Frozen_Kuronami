import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ForgotPasswordModal from './ForgotPasswordModal';
import { Eye, EyeOff, Bell, X } from 'lucide-react';

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

  // State untuk Notifikasi Reset Password
  const [failedEmail, setFailedEmail] = useState(localStorage.getItem('failedLoginEmail') || '');
  const [notifData, setNotifData] = useState(null);
  const [showNotifPopup, setShowNotifPopup] = useState(false);

  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess); 

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Polling untuk notifikasi reset password
  useEffect(() => {
    let interval;
    const checkNotification = async () => {
      if (!failedEmail) return;
      try {
        const response = await axiosInstance.get(`/password-notification?email=${failedEmail}`);
        if (response.data?.success && response.data?.data) {
          setNotifData(response.data.data);
        } else {
          setNotifData(null);
        }
      } catch (error) {
        console.error("Gagal mengecek notifikasi", error);
      }
    };

    if (failedEmail) {
      checkNotification();
      interval = setInterval(checkNotification, 10000); // Cek setiap 10 detik
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [failedEmail]);

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

    // Bersihkan state error login
    localStorage.removeItem('failedLoginEmail');
    setFailedEmail('');
    setNotifData(null);

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
      
    if (errorMessage.toLowerCase().includes('salah')) {
      // Simpan email yang gagal login
      localStorage.setItem('failedLoginEmail', username);
      setFailedEmail(username);
    }

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
        <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl p-10 relative">
          
          {/* Notification Bell */}
          {notifData && (
            <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={() => setShowNotifPopup(!showNotifPopup)}
                className="relative p-2 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
              >
                <Bell size={24} className="text-blue-700" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
              </button>

              {/* Notification Popup */}
              {showNotifPopup && (
                <div className="absolute top-12 right-0 w-[280px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
                    <h3 className="text-white font-semibold text-sm">Pemberitahuan</h3>
                    <button onClick={() => setShowNotifPopup(false)} className="text-blue-200 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col gap-3 text-sm text-gray-700">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email</span>
                      <span className="font-medium text-gray-900">{notifData.email}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Jabatan</span>
                      <span className="font-medium text-gray-900">{notifData.role}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Cabang Penempatan</span>
                      <span className="font-medium text-gray-900">{notifData.cabang_nama}</span>
                    </div>
                    <div className="flex flex-col gap-1 pt-2 border-t border-gray-100 mt-1">
                      <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Password Baru</span>
                      <span className="font-mono font-bold text-lg text-slate-900 bg-slate-100 py-1 px-2 rounded-lg break-all inline-block mt-1">
                        {notifData.new_password_plain}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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
        onSuccess={(email) => {
          setFailedEmail(email);
          localStorage.setItem('failedLoginEmail', email);
        }}
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