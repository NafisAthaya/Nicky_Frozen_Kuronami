import { useState, useEffect } from 'react';
import {
  HiOutlineCamera,
  HiOutlineInformationCircle,
  HiOutlineShieldCheck,
  HiOutlineKey,
  HiChevronRight,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineX,
  HiCheckCircle,
  HiArrowLeft
} from 'react-icons/hi';

export default function Profil({ onBack }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility State
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSavePassword = () => {
    // Basic validation
    if (newPassword.length < 8) {
      alert('Kata sandi baru minimal 8 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok');
      return;
    }
    
    // Success scenario
    setShowPasswordModal(false);
    setShowSuccessModal(true);
    
    // Clear fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleFinishSuccess = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-y-auto p-6 md:p-8 bg-[#F5F7FB]">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
  onClick={onBack}
  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#082B7A] transition"
>
          <HiArrowLeft className="text-lg" /> Kembali ke Dashboard
        </button>
        <h1 className="text-3xl font-extrabold text-[#082B7A] mb-1">Profil Kasir</h1>
        <p className="text-sm text-gray-500">Kelola data diri dan keamanan akun Anda.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Panel: Informasi Data Diri */}
        <div className="flex-[2] min-w-0 xl:min-w-[500px] bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#082B7A] mb-6">Informasi Data Diri</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 w-[120px] shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white text-4xl font-extrabold flex items-center justify-center shadow-lg border-4 border-white">
                M
              </div>
              <button className="w-full flex items-center justify-center gap-2 border border-blue-500 text-blue-500 rounded-xl py-2 text-sm font-semibold hover:bg-blue-50 transition">
                <HiOutlineCamera /> Ubah Foto
              </button>
            </div>

            {/* Form Section */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Nama Lengkap</label>
                <input className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"type="text" value="Minji Clarissa" readOnly className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">ID Karyawan / NIK</label>
                <input className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" type="text" value="KSR-0012" readOnly className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Role / Jabatan</label>
                <input type="text" value="Kasir Cabang Utama" readOnly className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed" />
              </div>

              {/* Info Note */}
              <div className="flex gap-3 p-4 bg-blue-50 rounded-xl mt-2">
                <HiOutlineInformationCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                <p className="text-xs text-[#082B7A] leading-relaxed">Data diri di atas bersifat paten dan hanya dapat diubah oleh Administrator Sistem atau pihak ADMIN.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Keamanan */}
        <div className="flex-1 min-w-[320px] bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#082B7A] mb-6">
            <HiOutlineShieldCheck className="text-blue-500 text-2xl" /> Keamanan
          </h2>
          
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Kelola akses masuk dan otorisasi transaksi Anda secara berkala untuk menjaga keamanan akun.
          </p>

          <button className="btn-ganti-sandi-trigger" onClick={() => setShowPasswordModal(true)}>
            <div className="flex items-center gap-3 font-bold text-[#082B7A]">
              <HiOutlineKey className="text-blue-500 text-xl" />
              <span>Ganti Kata Sandi</span>
            </div>
            <HiChevronRight className="text-gray-400 text-xl" />
          </button>
        </div>
      </div>

      <div className="mt-auto text-center pt-8 text-xs text-gray-400">
        © 2026 Nicky Frozen. All rights reserved.
      </div>

      {/* ===== Ganti Kata Sandi Modal ===== */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white rounded-3xl shadow-2xl w-[460px] max-w-[95vw] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#082B7A]">Ganti Kata Sandi</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <HiOutlineInformationCircle className="text-blue-500 text-xl shrink-0" />
                <p className="text-xs text-[#082B7A] leading-relaxed">Kata sandi harus terdiri dari minimal 8 karakter.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Kata Sandi Saat Ini</label>
                <div className="relative flex items-center">
                  <input className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    type={showCurrent ? "text" : "password"} 
                    placeholder="Masukkan kata sandi saat ini"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button className="btn-toggle-vis" onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Kata Sandi Baru</label>
                <div className="relative flex items-center">
                  <input className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    type={showNew ? "text" : "password"} 
                    placeholder="Masukkan kata sandi baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button className="btn-toggle-vis" onClick={() => setShowNew(!showNew)}>
                    {showNew ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Konfirmasi Kata Sandi Baru</label>
                <div className="relative flex items-center">
                  <input className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    type={showConfirm ? "text" : "password"} 
                    placeholder="Ketik ulang kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button className="btn-toggle-vis" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button className="btn-modal-batal" onClick={() => setShowPasswordModal(false)}>Batal</button>
              <button className="btn-modal-simpan" onClick={handleSavePassword}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Success Modal ===== */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white rounded-3xl shadow-2xl w-[400px] max-w-[95vw] p-8 flex flex-col items-center text-center">
            <div className="text-green-500 text-7xl mb-4">
              <HiCheckCircle />
            </div>
            <h3 className="text-xl font-bold text-[#082B7A]">Kata Sandi Berhasil Diubah!</h3>
            <p className="text-xs text-[#082B7A] leading-relaxed">Gunakan kata sandi baru Anda untuk masuk di sesi berikutnya.</p>
            
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
              <span className="animate-spin">↻</span> Mengalihkan...
            </div>

            <button className="btn-success-selesai" onClick={handleFinishSuccess}>Selesai</button>
          </div>
        </div>
      )}

    </div>
  );
}
