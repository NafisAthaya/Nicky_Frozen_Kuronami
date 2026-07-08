import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  MdStorefront,
  MdAccessTime,
  MdSave,
  MdReceipt,
} from 'react-icons/md';

import SuccessModal from '../../components/admin/SuccessModal.jsx';
import WarningModal from '../../components/admin/WarningModal';
import logoNicky from '../../assets/logo-nicky-frozen.jpeg';

import axiosInstance from '../../api/axios';

// Simple Barcode SVG Component
const BarcodePreview = ({ code }) => {
  const bars = [];
  const seed = code || 'TRX20261105-0012';
  for (let i = 0; i < seed.length * 2; i++) {
    const charCode = seed.charCodeAt(i % seed.length);
    const isBlack = (charCode + i) % 3 !== 0;
    const width = ((charCode + i) % 2 === 0) ? 2 : 1;
    bars.push({ isBlack, width });
  }
  
  const totalWidth = bars.reduce((sum, bar) => sum + bar.width + 1, 0);
  const startX = Math.max(0, (160 - totalWidth) / 2);

  return (
    <svg width="160" height="40" viewBox="0 0 160 40" className="mx-auto block">
      {bars.reduce((acc, bar, i) => {
        const x = acc.x;
        acc.elements.push(
          <rect
            key={i}
            x={x}
            y={0}
            width={bar.width}
            height={40}
            fill={bar.isBlack ? '#000' : '#fff'}
          />
        );
        acc.x += bar.width + 1;
        return acc;
      }, { x: startX, elements: [] }).elements}
    </svg>
  );
};

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState('toko');

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  // ─── Struk Settings State ───
  const [strukSettings, setStrukSettings] = useState({
    judul_struk: 'Nicky Frozen Food',
    alamat_struk: 'Jl. Raya Boulevard No. 12, Gading Serpong, Tangerang',
    nomor_telepon: '0812-3456-7890',
    footer_struk: 'Terima Kasih Telah Berbelanja!',
    tampilkan_logo: false,
    tampilkan_barcode: true,
    tampilkan_nama_kasir: true,
  });
  
  const [initialSettings, setInitialSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/admin/pengaturan-toko');
        if (response.data.data) {
          setStrukSettings(response.data.data);
          setInitialSettings(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data pengaturan:", error);
      }
    };
    fetchSettings();

    const handleGlobalSync = () => fetchSettings();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  const handleStrukChange = (field, value) => {
    setStrukSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleStrukToggle = (key) => {
    setStrukSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveStruk = async () => {
    try {
      await axiosInstance.post('/admin/pengaturan-toko', strukSettings);
      setInitialSettings(strukSettings);
      setIsSuccessOpen(true);
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan struk ke server.");
      console.error(error);
    }
  };

  const handleCancelStruk = () => {
    setIsWarningOpen(true);
  };

  const confirmCancelStruk = () => {
    if (initialSettings) setStrukSettings(initialSettings);
    setIsWarningOpen(false);
  };

  // ─── Toko Tab State ───
  const [jamOperasional, setJamOperasional] = useState([
    { label: 'Senin - Jumat', buka: '08:00', tutup: '21:00' },
    { label: 'Sabtu - Minggu', buka: '09:00', tutup: '22:00' },
  ]);
  const [editingJamIndex, setEditingJamIndex] = useState(null);
  const [tempJam, setTempJam] = useState({ buka: '', tutup: '' });

  const handleEditJam = (index) => {
    setTempJam({ buka: jamOperasional[index].buka, tutup: jamOperasional[index].tutup });
    setEditingJamIndex(index);
  };

  const handleSaveJam = () => {
    if (editingJamIndex === null) return;
    setJamOperasional((prev) =>
      prev.map((item, i) =>
        i === editingJamIndex ? { ...item, buka: tempJam.buka, tutup: tempJam.tutup } : item
      )
    );
    setEditingJamIndex(null);
    setIsSuccessOpen(true);
  };

  const handleSaveToko = () => {
    setIsSuccessOpen(true);
  };

  const handleCancelToko = () => {
    setIsWarningOpen(true);
  };

  const confirmCancelToko = () => {
    setIsWarningOpen(false);
  };

  // ─── Render: Toko Tab ───
  const renderTokoTab = () => (
    <>
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

              {jamOperasional.map((jam, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <span className="font-semibold text-[#082B7A]">
                    {jam.label}
                  </span>

                  <span className="font-bold text-[#082B7A]">
                    {jam.buka} - {jam.tutup}
                  </span>

                  <button
                    onClick={() => handleEditJam(index)}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Ubah
                  </button>
                </div>
              ))}

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
              onClick={handleCancelToko}
              className="w-full py-3 border border-white/30 rounded-xl"
            >
              Batalkan
            </button>

          </div>

        </div>

      </div>

      {/* Modal Edit Jam Operasional */}
      {editingJamIndex !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-3xl w-[420px] p-8 shadow-2xl">

            <h3 className="text-xl font-bold text-[#082B7A] mb-1">
              Ubah Jam Operasional
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {jamOperasional[editingJamIndex]?.label}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#082B7A] mb-2">Jam Buka</label>
                <input
                  type="time"
                  value={tempJam.buka}
                  onChange={(e) => setTempJam({ ...tempJam, buka: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl text-center text-lg font-bold text-[#082B7A] focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#082B7A] mb-2">Jam Tutup</label>
                <input
                  type="time"
                  value={tempJam.tutup}
                  onChange={(e) => setTempJam({ ...tempJam, tutup: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl text-center text-lg font-bold text-[#082B7A] focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingJamIndex(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveJam}
                className="flex-1 py-3 rounded-xl bg-[#082B7A] text-white font-semibold hover:bg-[#0B3B91] transition"
              >
                Simpan
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );

  // ─── Render: Struk Tab ───
  const renderStrukTab = () => (
    <div className="grid lg:grid-cols-5 gap-6">

      {/* LEFT – Form Settings (3 cols) */}
      <div className="lg:col-span-3">

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">
            <MdReceipt
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
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                value={strukSettings.judul_struk}
                onChange={(e) => handleStrukChange('judul_struk', e.target.value)}
                placeholder="Nama toko di struk..."
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Alamat di Struk
              </label>

              <textarea
                rows={3}
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition resize-none"
                value={strukSettings.alamat_struk}
                onChange={(e) => handleStrukChange('alamat_struk', e.target.value)}
                placeholder="Alamat toko..."
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Nomor Telepon
              </label>

              <input
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                value={strukSettings.nomor_telepon}
                onChange={(e) => handleStrukChange('nomor_telepon', e.target.value)}
                placeholder="Nomor telepon toko..."
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#082B7A]">
                Footer Struk
              </label>

              <textarea
                rows={3}
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition resize-none"
                value={strukSettings.footer_struk}
                onChange={(e) => handleStrukChange('footer_struk', e.target.value)}
                placeholder="Pesan di bawah struk..."
              />
            </div>

            {/* TOGGLE SWITCHES */}
            <div className="pt-2">
              {[
                ['tampilkan_logo', 'Tampilkan Logo'],
                ['tampilkan_barcode', 'Tampilkan Barcode'],
                ['tampilkan_nama_kasir', 'Tampilkan Nama Kasir'],
              ].map(([key, label]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0"
                >
                  <span className="font-semibold text-[#082B7A]">
                    {label}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleStrukToggle(key)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      strukSettings[key]
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        strukSettings[key]
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Buttons inside card */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleCancelStruk}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Batalkan
            </button>

            <button
              onClick={handleSaveStruk}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <MdSave size={18} />
              Simpan Perubahan
            </button>
          </div>

        </div>

      </div>

      {/* RIGHT – Live Preview (2 cols) */}
      <div className="lg:col-span-2">
        <div className="sticky top-24">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Pratinjau Struk
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 font-mono text-[11px] relative overflow-hidden">
            {/* Receipt paper effect */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-gray-100 to-transparent" />
            
            <div className="text-center pt-2">

              {strukSettings.tampilkan_logo && (
                <div className="w-14 h-14 rounded-full mx-auto mb-3 overflow-hidden border-2 border-gray-100 shadow-sm">
                  <img src={logoNicky} alt="Logo" className="w-full h-full object-cover" />
                </div>
              )}

              <h3 className="font-bold text-sm">
                {strukSettings.judul_struk || 'Nama Toko'}
              </h3>

              {strukSettings.alamat_struk && (
                <p className="mt-1 text-[10px] text-gray-500 leading-relaxed whitespace-pre-line">
                  {strukSettings.alamat_struk}
                </p>
              )}

              {strukSettings.nomor_telepon && (
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Telp: {strukSettings.nomor_telepon}
                </p>
              )}

            </div>

            <div className="border-t border-dashed border-gray-300 my-4" />

            {/* Sample Transaction Info */}
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>04/07/2026 14:30</span>
              <span>#NF-240704-001</span>
            </div>
            {strukSettings.tampilkan_nama_kasir && (
              <div className="text-[10px] text-gray-500 mb-2">
                Kasir: <span className="font-semibold text-gray-700">Kasir Aktif</span>
              </div>
            )}

            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Sample Items */}
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

            <div className="border-t border-dashed border-gray-300 my-4" />

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>128.000</span>
              </div>

              <div className="flex justify-between font-bold text-xs">
                <span>TOTAL</span>
                <span>128.000</span>
              </div>
            </div>

            {strukSettings.tampilkan_barcode && (
              <div className="my-4 text-center">
                <BarcodePreview code="NF240704001" />
                <p className="text-[10px] text-gray-400 mt-1">NF-240704-001</p>
              </div>
            )}

            <div className="border-t border-dashed border-gray-300 my-3" />

            {strukSettings.footer_struk && (
              <div className="text-center text-[10px] text-gray-500 italic">
                {strukSettings.footer_struk}
              </div>
            )}

            {/* Receipt paper bottom effect */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-gray-100 to-transparent" />
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <div className="p-6 pb-10">

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
        onConfirm={activeTab === 'struk' ? confirmCancelStruk : confirmCancelToko}
      />

    </div>
  );
}