import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ForgotPasswordModal from './ForgotPasswordModal';
import { Eye, EyeOff } from 'lucide-react';

import bgLogin from '../../assets/login-bg.png';
import logoNicky from '../../assets/logo-nicky.png';

export default function Login() {
  const selectedBranch = JSON.parse(
  localStorage.getItem('selectedBranch')
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem(
      'user',
      JSON.stringify(data.user)
    );

    if (data.user.role === 'owner') {
      navigate('/dashboard');
    }

    if (data.user.role === 'admin') {
      navigate('/admin-dashboard');
    }

    if (data.user.role === 'kasir') {
      navigate('/kasir-dashboard');
    }
  } catch (error) {
    console.error(error);
    alert('Gagal terhubung ke server');
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
              label="Username / ID Pengguna"
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
                className="text-gray-400 hover:text-gray-600"
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
                    className="w-4 h-4"
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

            <Button
              type="submit"
              fullWidth
              disabled={!username.trim() || !password.trim()}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl h-14"
            >
              Login
            </Button>
          </form>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 mt-8">
            © 2026 Nicky Frozen. All rights reserved.
          </p>
        </div>
      </div>

      {/* Server Status */}
      <div className="absolute bottom-8 w-full max-w-md px-6 flex justify-between text-xs text-white tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          SERVER TERHUBUNG
        </div>

        <div>V2.4.0-ARCTIC</div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
}