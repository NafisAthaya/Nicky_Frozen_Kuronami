import { useState } from 'react';
import { Mail, RotateCcw, Check, Info, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/forgot-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setSubmitted(true);
    }
  } catch (error) {
    console.error(error);
    alert('Gagal mengirim email');
  }
};

  const handleBackToLogin = () => {
    setSubmitted(false);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {!submitted ? (
       <div className="w-full max-w-lg mx-4 bg-white rounded-[28px] shadow-2xl overflow-hidden">

           <div className="px-6 pt-8 pb-0">

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                <RotateCcw size={28} className="text-blue-700" />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-center text-slate-900 mb-3">
              Lupa Kata Sandi?
            </h2>

            <p className="text-center text-gray-600 text-lg mb-8">
              Masukkan email terdaftar Anda untuk menerima
              instruksi pemulihan.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Email Terdaftar
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  placeholder="contoh: admin@nickyfrozen.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 border border-gray-300 rounded-none px-12 text-base outline-none focus:border-blue-600"
                />
              </div>

              <div className="mt-8 border-t bg-slate-50 -mx-12 px-12 py-5 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 h-12 rounded-full border border-gray-300 text-gray-700 font-semibold"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-8 h-12 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Kirim
                </button>
              </div>
            </form>

          </div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-4 bg-white rounded-[28px] shadow-2xl overflow-hidden">

          <div className="p-8 text-center">

            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <Check size={42} className="text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-slate-900 mb-5">
              Instruksi Pemulihan
              <br />
              Dikirim!
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Silakan periksa email Anda. Kami telah
              mengirimkan tautan untuk mengatur
              ulang kata sandi Anda.
            </p>

            <div className="bg-indigo-50 rounded-lg p-4 flex gap-3 items-start text-left mb-6">
              <Info
                size={18}
                className="text-blue-700 mt-1 shrink-0"
              />

              <p className="text-sm text-gray-700">
                Jika email tidak ditemukan, silakan cek
                folder spam atau hubungi admin IT.
              </p>
            </div>

            <button
              onClick={handleBackToLogin}
              className="w-full h-12 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Kembali ke Login
            </button>

          </div>
        </div>
      )}
    </div>
  );
}