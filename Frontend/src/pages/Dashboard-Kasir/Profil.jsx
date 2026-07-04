import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ownerProfile from '../../assets/OwnerProfile.png';
import useAuthStore from '../../store/authStore';

import {
  HiOutlineCamera,
  HiOutlineInformationCircle,
  HiCheckCircle,
  HiArrowLeft
} from 'react-icons/hi';

export default function Profil() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [photo, setPhoto] = useState(
    user?.foto
      ? `http://127.0.0.1:8000/storage/${user.foto}`
      : ownerProfile
  );

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChoosePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("user_id", user?.id);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/profile/photo",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Upload gagal");
        return;
      }

      setPhoto(result.photo);

      // Sync ke authStore & localStorage
      if (user) {
        updateUser({ ...user, foto: result.path });
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);

    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunggah foto. Silakan coba lagi.');
    }
  };

  // Ambil nama cabang dari data user
  const cabangName = user?.cabang?.nama_cabang || user?.cabang_nama || 'Belum Ditentukan';
  const userRole = user?.role || 'kasir';
  const userName = user?.name || 'Loading...';
  const userId = user?.id ? `KSR-${String(user.id).padStart(4, '0')}` : '-';

  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-y-auto p-6 md:p-8 bg-[#F5F7FB]">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/kasir')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-3 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all -ml-2"
        >
          <HiArrowLeft className="text-lg" /> Kembali ke Dashboard
        </button>
        <h1 className="text-3xl font-extrabold text-[#082B7A] mb-1">Profil Kasir</h1>
        <p className="text-sm text-gray-500">Kelola informasi akun dan foto profil Anda.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Panel: Informasi Data Diri */}
        <div className="flex-[2] min-w-0 xl:min-w-[500px] bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#082B7A] mb-6">Informasi Data Diri</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 w-[140px] shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-blue-100">
                <img
                  src={photo}
                  alt="Foto Profil"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleChoosePhoto}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <HiOutlineCamera className="text-lg" />
                Ubah Foto
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoChange}
              />
            </div>

            {/* Form Section */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Nama Lengkap</label>
                <input
                  type="text"
                  value={userName}
                  readOnly
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium cursor-not-allowed"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">ID Karyawan / NIK</label>
                <input
                  type="text"
                  value={userId}
                  readOnly
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Role / Cabang</label>
                <input 
                  type="text" 
                  value={`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} - ${cabangName}`} 
                  readOnly 
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium cursor-not-allowed" 
                />
              </div>

              {/* Info Note */}
              <div className="flex gap-3 p-4 bg-blue-50 rounded-xl mt-2">
                <HiOutlineInformationCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                <p className="text-xs text-[#082B7A] leading-relaxed">Data diri hanya dapat diubah oleh Owner. Kasir hanya dapat memperbarui foto profil.</p>
              </div>
            </div>
          </div>
        </div>

      {/* ===== Success Modal ===== */}
        {showSuccess && (
            <div className="fixed top-6 right-6 z-[9999]">
                <div className="bg-white shadow-2xl rounded-2xl border border-green-100 px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <HiCheckCircle className="text-2xl text-green-600"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Berhasil</h3>
                        <p className="text-sm text-gray-500">Foto profil berhasil diperbarui.</p>
                    </div>
                </div>
            </div>
        )}

    </div>
    </div>
  );
}
