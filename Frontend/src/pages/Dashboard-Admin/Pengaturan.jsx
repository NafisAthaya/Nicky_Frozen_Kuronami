import { useState } from 'react';
import {
  MdStorefront,
  MdAccessTime,
  MdSave,
  MdAcUnit,
} from 'react-icons/md';

import SuccessModal from '../../components/admin/SuccessModal.jsx';
import WarningModal from '../../components/admin/WarningModal';

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState('toko');

  const [isSuccessOpen, setIsSuccessOpen] =
    useState(false);

  const [isWarningOpen, setIsWarningOpen] =
    useState(false);

  const [toggles, setToggles] = useState({
    logo: false,
    barcode: true,
    kasir: true,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveToko = () => {
    setIsSuccessOpen(true);
  };

  const handleSaveStruk = () => {
    setIsSuccessOpen(true);
  };

  const handleCancel = () => {
    setIsWarningOpen(true);
  };

  const confirmCancel = () => {
    setIsWarningOpen(false);
  };

  const renderTokoTab = () => (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">

        {/* Informasi Toko */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <MdStorefront
              size={26}
              className="text-[#082B7A]"
            />

            <h2 className="text-xl font-bold text-[#082B7A]">
              Informasi Toko
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Nama Toko
              </label>

              <input
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50"
                defaultValue="Nicky Frozen Food"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Telepon Toko
              </label>

              <input
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50"
                defaultValue="+62 812-3456-7890"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Alamat Lengkap
              </label>

              <textarea
                rows={4}
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50"
                defaultValue="Jl. Raya Industri No. 42, Jababeka, Cikarang, Bekasi, Jawa Barat 17530"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Email Kontak
              </label>

              <input
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50"
                defaultValue="contact@nickyfrozen.com"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Website
              </label>

              <input
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50"
                defaultValue="www.nickyfrozen.com"
              />
            </div>

          </div>
        </div>

        {/* Jam Operasional */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">
            <MdAccessTime
              size={26}
              className="text-[#082B7A]"
            />

            <h2 className="text-xl font-bold text-[#082B7A]">
              Jam Operasional
            </h2>
          </div>

          <div className="space-y-3">

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <span className="font-semibold text-[#082B7A]">
                Senin - Jumat
              </span>

              <span className="font-bold text-[#082B7A]">
                08:00 - 21:00
              </span>

              <button className="text-blue-600 hover:underline">
                Ubah
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <span className="font-semibold text-[#082B7A]">
                Sabtu - Minggu
              </span>

              <span className="font-bold text-[#082B7A]">
                09:00 - 22:00
              </span>

              <button className="text-blue-600 hover:underline">
                Ubah
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* RIGHT */}
      <div>

        <div className="bg-blue-600 text-white rounded-3xl p-6 sticky top-24">

          <h3 className="text-xl font-bold mb-2">
            Simpan Perubahan?
          </h3>

          <p className="text-sm text-blue-100 mb-6">
            Pastikan semua data sudah benar sebelum
            memperbarui pengaturan sistem.
          </p>

          <button
            onClick={handleSaveToko}
            className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold mb-3"
          >
            Simpan Sekarang
          </button>

          <button
            onClick={handleCancel}
            className="w-full py-3 border border-white/30 rounded-xl"
          >
            Batalkan
          </button>

        </div>

      </div>

    </div>
  );

  const renderStrukTab = () => (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="lg:col-span-2">

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">
            <MdStorefront
              size={26}
              className="text-[#082B7A]"
            />

            <h2 className="text-xl font-bold text-[#082B7A]">
              Informasi Struk
            </h2>
          </div>

          <div className="space-y-5">

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Judul Struk
              </label>

              <input
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50"
                defaultValue="Nicky Frozen Food"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Alamat di Struk
              </label>

              <textarea
                rows={4}
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50"
                defaultValue="Jl. Raya Boulevard No. 12, Gading Serpong, Tangerang"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Nomor Telepon
              </label>

              <input
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50"
                defaultValue="0812-3456-7890"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Footer Struk
              </label>

              <textarea
                rows={4}
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50"
                defaultValue="Terima Kasih Telah Berbelanja!"
              />
            </div>

            {/* TOGGLE */}

            {[
              ['logo', 'Tampilkan Logo'],
              ['barcode', 'Tampilkan Barcode'],
              ['kasir', 'Tampilkan Nama Kasir'],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex justify-between items-center py-3 border-b"
              >
                <span className="font-semibold text-[#082B7A]">
                  {label}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggle(key)}
                  className={`w-12 h-6 rounded-full transition ${
                    toggles[key]
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full mt-0.5 transition ${
                      toggles[key]
                        ? 'translate-x-6'
                        : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* PREVIEW */}
      <div>

        <p className="text-center text-xs font-bold text-gray-500 mb-4">
          PRATINJAU STRUK
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-lg font-mono text-[11px]">

          <div className="text-center">

            {toggles.logo && (
              <div className="w-10 h-10 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-2">
                <MdAcUnit className="text-blue-600" />
              </div>
            )}

            <h3 className="font-bold text-sm">
              Nicky Frozen Food
            </h3>

            <p className="mt-2">
              Tangerang, Banten
            </p>

          </div>

          <div className="border-t border-dashed my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Bakso Premium</span>
              <span>45.000</span>
            </div>

            <div className="flex justify-between">
              <span>Nugget Ayam</span>
              <span>45.000</span>
            </div>

            <div className="flex justify-between">
              <span>Siomay Udang</span>
              <span>38.000</span>
            </div>
          </div>

          <div className="border-t border-dashed my-4" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>128.000</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>TOTAL</span>
              <span>128.000</span>
            </div>
          </div>

          {toggles.barcode && (
            <div className="my-5 text-center">
              <div className="h-8 bg-black mx-auto w-32 mb-2" />
              <p>TRX#20231105-0012</p>
            </div>
          )}

          <div className="border-t border-dashed my-4" />

          <div className="text-center">
            Terima Kasih Telah Berbelanja
          </div>

        </div>

      </div>

    </div>
  );

  return (
    <div className="p-6 pb-28">

      {/* TAB */}
      <div className="flex gap-8 border-b mb-8">

        <button
          onClick={() => setActiveTab('toko')}
          className={`pb-3 font-semibold border-b-2 ${
            activeTab === 'toko'
              ? 'text-[#082B7A] border-[#082B7A]'
              : 'text-gray-500 border-transparent'
          }`}
        >
          Pengaturan Toko
        </button>

        <button
          onClick={() => setActiveTab('struk')}
          className={`pb-3 font-semibold border-b-2 ${
            activeTab === 'struk'
              ? 'text-[#082B7A] border-[#082B7A]'
              : 'text-gray-500 border-transparent'
          }`}
        >
          Pengaturan Struk
        </button>

      </div>

      {activeTab === 'toko'
        ? renderTokoTab()
        : renderStrukTab()}

      {activeTab === 'toko' && (
        <footer className="text-center text-gray-400 text-sm mt-10">
          © 2026 Nicky Frozen. All rights reserved.
        </footer>
      )}

      {activeTab === 'struk' && (
        <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t px-8 py-4 flex justify-end gap-3 shadow-lg">

          <button
            onClick={handleCancel}
            className="px-6 py-3 border rounded-xl"
          >
            Batalkan
          </button>

          <button
            onClick={handleSaveStruk}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2"
          >
            <MdSave />
            Simpan Perubahan
          </button>

        </div>
      )}

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Perubahan Berhasil Disimpan"
        description="Data berhasil diperbarui."
        buttonText="Selesai"
      />

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        title="Batalkan Perubahan?"
        description="Perubahan yang belum disimpan akan hilang."
        buttonText="Ya, Batalkan"
        onConfirm={confirmCancel}
      />

    </div>
  );
}