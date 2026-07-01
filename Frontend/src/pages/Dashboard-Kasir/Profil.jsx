import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ownerProfile from '../../assets/OwnerProfile.png';

import {
  HiOutlineCamera,
  HiOutlineInformationCircle,
  HiCheckCircle,
  HiArrowLeft
} from 'react-icons/hi';

export default function Profil() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const [photo, setPhoto] = useState(
    user?.foto
      ? `http://127.0.0.1:8000/storage/${user.foto}`
      : ownerProfile
  );

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

const handleChoosePhoto = () => {
  console.log(fileInputRef.current);

  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

const handlePhotoChange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const user = JSON.parse(localStorage.getItem("user"));

  const formData = new FormData();

  formData.append("photo", file);
  formData.append("user_id", user.id);

  try {
        const response = await fetch(
      "http://127.0.0.1:8000/api/profile/photo",
      {
        method: "POST",
        body: formData,
      }
    );

    console.log(response.status);

    const result = await response.json();

    console.log(result);

    if (!response.ok) {
      alert(result.message || "Upload gagal");
      return;
    }

    setPhoto(result.photo);

    const user = JSON.parse(localStorage.getItem("user"));

    user.foto = result.path;

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
    window.dispatchEvent(new Event("profile-updated"));

    setShowSuccess(true);

    setTimeout(() => {
        setShowSuccess(false);
    }, 2500);


    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(JSON.stringify(err));
      }
    }
  };


  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-y-auto p-6 md:p-8 bg-[#F5F7FB]">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/kasir')}
          className="..."
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
            <div className="flex flex-col items-center gap-4 w-[120px] shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">

              <img
                src={photo}
                alt=""
                className="w-full h-full object-cover"
              />

            </div>
              <button
                type="button"
                onClick={handleChoosePhoto}
                className="mt-5 z-50 relative flex items-center gap-2 border border-[#1D4ED8] text-[#1D4ED8] px-5 py-2 rounded-xl font-semibold hover:bg-blue-50"
              >
                <HiOutlineCamera />
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
                  value="Minji Clarissa"
                  readOnly
                  className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">ID Karyawan / NIK</label>
                <input
                  type="text"
                  value="KSR-0012"
                  readOnly
                  className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Role / Jabatan</label>
                <input type="text" value="Kasir Cabang Utama" readOnly className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed" />
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

                        <h3 className="font-semibold text-gray-800">
                            Berhasil
                        </h3>

                        <p className="text-sm text-gray-500">
                            Foto profil berhasil diperbarui.
                        </p>

                    </div>

                </div>

            </div>
        )}

    </div>
    </div>
  );
}
