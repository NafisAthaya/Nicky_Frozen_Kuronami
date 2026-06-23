import { useState } from 'react';
import {
  MdCameraAlt,
  MdManageAccounts,
  MdImage,
  MdSecurity,
} from 'react-icons/md';

import SuccessModal from '../../components/admin/SuccessModal.jsx';

function loadProfileFromStorage() {
  try {
    const raw = localStorage.getItem('nf_profile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProfileToStorage(data) {
  try {
    localStorage.setItem('nf_profile', JSON.stringify(data));
  } catch {}
}

export default function Profil() {
  const stored = loadProfileFromStorage();

  const [isSuccessOpen, setIsSuccessOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    nama: stored?.nama || 'Nicky Frozen',
    email:
      stored?.email ||
      'manager@nickyfrozen.com',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    saveProfileToStorage({
      nama: formData.nama,
      email: formData.email,
    });

    setFormData((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
    }));

    setIsSuccessOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex items-center gap-6 mb-8">

        <div className="relative">

          <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-white shadow flex items-center justify-center">
            <MdImage
              size={48}
              className="text-[#082B7A] opacity-50"
            />
          </div>

          <button
            className="
              absolute bottom-0 right-0
              w-9 h-9 rounded-full
              bg-orange-500 text-white
              border-2 border-white
              flex items-center justify-center
              hover:bg-orange-600 transition
            "
          >
            <MdCameraAlt />
          </button>

        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-[#082B7A]">
            {formData.nama}
          </h1>

          <p className="text-gray-500 mt-1">
            Admin
          </p>
        </div>

      </div>

      {/* CARD */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

        {/* TITLE */}
        <div className="flex items-center gap-3 mb-8">

          <MdManageAccounts
            size={28}
            className="text-[#082B7A]"
          />

          <h2 className="text-2xl font-bold text-[#082B7A]">
            Pengaturan Akun Pribadi
          </h2>

        </div>

        <form onSubmit={handleSubmit}>

          {/* NAMA */}
          <div className="mb-6">

            <label className="block mb-2 font-semibold text-[#082B7A]">
              Nama Lengkap
            </label>

            <input
              type="text"
              value={formData.nama}
              onChange={(e) =>
                handleChange(
                  'nama',
                  e.target.value
                )
              }
              className="
                w-full h-12 px-4
                border border-gray-300
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-blue-200
              "
            />

          </div>

          {/* EMAIL */}
          <div className="mb-6">

            <label className="block mb-2 font-semibold text-[#082B7A]">
              Alamat Email
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                handleChange(
                  'email',
                  e.target.value
                )
              }
              className="
                w-full h-12 px-4
                border border-gray-300
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-blue-200
              "
            />

          </div>

          {/* PASSWORD */}
          <h3 className="text-sm font-extrabold text-[#082B7A] uppercase tracking-wide mb-4 mt-8">
            Ubah Kata Sandi
          </h3>

          <div className="mb-6">

            <label className="block mb-2 font-semibold text-[#082B7A]">
              Kata Sandi Saat Ini
            </label>

            <input
              type="password"
              placeholder="Masukkan kata sandi saat ini"
              value={formData.currentPassword}
              onChange={(e) =>
                handleChange(
                  'currentPassword',
                  e.target.value
                )
              }
              className="
                w-full h-12 px-4
                border border-gray-300
                rounded-xl
              "
            />

          </div>

          <div className="mb-6">

            <label className="block mb-2 font-semibold text-[#082B7A]">
              Kata Sandi Baru
            </label>

            <input
              type="password"
              placeholder="Minimal 8 karakter"
              value={formData.newPassword}
              onChange={(e) =>
                handleChange(
                  'newPassword',
                  e.target.value
                )
              }
              className="
                w-full h-12 px-4
                border border-gray-300
                rounded-xl
              "
            />

          </div>

          {/* SECURITY */}
          <h3 className="text-sm font-extrabold text-[#082B7A] uppercase tracking-wide mb-4 mt-8">
            Keamanan Akun
          </h3>

          <div className="
            flex items-center justify-between
            bg-blue-50 rounded-2xl
            p-5 mb-8
          ">

            <div className="flex gap-4">

              <MdSecurity
                size={30}
                className="text-[#082B7A]"
              />

              <div>

                <h4 className="font-bold text-[#082B7A]">
                  Verifikasi Dua Langkah
                </h4>

                <p className="text-sm text-gray-600">
                  Amankan akun Anda dengan
                  lapisan keamanan tambahan.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="
                font-bold text-[#082B7A]
                hover:underline
              "
            >
              Aktifkan
            </button>

          </div>

          {/* BUTTON */}
          <div className="flex justify-end">

            <button
              type="submit"
              className="
                bg-[#082B7A]
                text-white
                px-8 h-12
                rounded-xl
                font-semibold
                hover:bg-[#0B3B91]
                transition
              "
            >
              Simpan Perubahan
            </button>

          </div>

        </form>

      </div>

      {/* FOOTER */}
      <footer className="text-center text-gray-400 text-sm mt-8">
        © 2026 Nicky Frozen. All rights reserved.
      </footer>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() =>
          setIsSuccessOpen(false)
        }
        title="Profil Berhasil Diperbarui"
        description="Perubahan informasi akun Anda telah berhasil disimpan."
        buttonText="Selesai"
      />

    </div>
  );
}