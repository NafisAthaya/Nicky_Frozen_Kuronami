import { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [emailOrId, setEmailOrId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailOrId.trim()) {
      setSubmitted(true);
      // Simulasi kirim reset link
      setTimeout(() => {
        setSubmitted(false);
        setEmailOrId('');
        onClose();
      }, 2000);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-md mx-4 animate-slideUp">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            aria-label="Tutup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {!submitted ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                Lupa Password?
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Masukkan email atau ID pengguna Anda. Kami akan mengirimkan tautan untuk mereset password.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email atau ID Pengguna"
                  type="text"
                  placeholder="contoh@email.com atau ID12345"
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
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
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  }
                />

                <Button type="submit" fullWidth disabled={!emailOrId.trim()}>
                  Kirim Tautan Reset
                </Button>
              </form>

              {/* Back to login */}
              <button
                onClick={onClose}
                className="w-full mt-4 text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 text-center"
              >
                ← Kembali ke Login
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center animate-bounceIn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Tautan Terkirim!</h2>
              <p className="text-sm text-gray-500">
                Silakan cek inbox email Anda untuk tautan reset password.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
