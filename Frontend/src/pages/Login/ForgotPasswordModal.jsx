import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, RotateCcw, Check, Info, ArrowLeft } from 'lucide-react';
import axiosInstance from '../../api/axios';

export default function ForgotPasswordModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axiosInstance.post('/forgot-password', { email });

    if (response.data.success) {
      toast.success('Permintaan berhasil dikirim ke Owner. Silakan tunggu notifikasi di halaman login.');
      if (onSuccess) onSuccess(email);
      setEmail('');
      onClose();
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error.response?.data?.message || 'Gagal mengirim email';
    toast.error(errorMessage);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
                required
                placeholder="contoh: admin@nickyfrozen.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 border border-gray-300 rounded-none px-12 text-base outline-none focus:border-blue-600"
              />
            </div>

            <div className="mt-8 border-t bg-slate-50 -mx-12 px-12 py-5 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => { setEmail(''); onClose(); }}
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
    </div>
  );
}