import { useState } from 'react';
import { 
  MdOutlineInventory2, 
  MdOutlineManageAccounts, 
  MdKeyboardArrowDown, 
  MdKeyboardArrowUp 
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

// Custom Accordion Component
const FaqAccordion = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-xl border mb-3 overflow-hidden transition-all ${isOpen ? 'border-[#a7c0e8]' : 'border-gray-200 bg-white'}`}>
      <div
        className={`flex justify-between items-center cursor-pointer p-4 transition-colors ${isOpen ? 'bg-white' : 'hover:bg-gray-50'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-[15px] text-[#111827]">
          {question}
        </span>

        {isOpen ? (
          <MdKeyboardArrowUp className="text-gray-500" size={20} />
        ) : (
          <MdKeyboardArrowDown className="text-gray-500" size={20} />
        )}
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-[14px] text-gray-600 bg-[#f4f7fb] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

export default function Bantuan() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-[#f8fafc] md:bg-transparent">
      <div className="w-full flex-grow p-8">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#0A1A3A] mb-2 tracking-tight">
            Pusat Bantuan Admin
          </h1>
          <p className="text-gray-500 text-[15px]">
            Panduan langkah-demi-langkah untuk mengelola sistem POS Nicky Frozen.
          </p>
        </div>

        {/* Stok & Gudang Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
            <MdOutlineInventory2 size={24} className="text-[#082B7A]" />
            <h2 className="text-lg font-bold text-[#082B7A]">
              Stok & Gudang
            </h2>
          </div>

          <FaqAccordion question="Bagaimana cara menginput barang masuk dari supplier?">
            <p className="mb-2">Ikuti langkah berikut untuk menambah stok dari supplier. Sistem akan otomatis memperbarui jumlah barang di layar kasir.</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Buka menu Barang Masuk di menu sebelah kiri.</li>
              <li>Klik tombol + Tambah Stok Masuk.</li>
              <li>Scan barcode barang atau Cari nama barang di kolom pencarian.</li>
              <li>Masukkan jumlah Qty (Kuantitas) barang yang diterima.</li>
              <li>Klik tombol Simpan.</li>
            </ul>
          </FaqAccordion>

          <FaqAccordion question="Bagaimana cara mengunduh laporan laba bersih bulanan?">
            <p className="mb-2">Lakukan Penyesuaian Stok (Stock Opname) agar data di sistem sama dengan barang fisik di toko.</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Buka menu Inventori (Stok Barang).</li>
              <li>Buka menu Inventori (Stok Barang).</li>
              <li>Cari barang yang ingin disesuaikan dan klik tombol Edit.</li>
              <li>Masukkan jumlah Stok Aktual (jumlah fisik saat ini).</li>
              <li>Wajib mengisi Catatan alasan selisih (contoh: barang rusak, salah hitung).</li>
              <li>Klik tombol <strong>Simpan</strong>.</li>
            </ol>
          </FaqAccordion>
        </div>

        {/* Manajemen Kasir Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
            <MdOutlineManageAccounts size={24} className="text-[#082B7A]" />
            <h2 className="text-lg font-bold text-[#082B7A]">
              Manajemen Kasir
            </h2>
          </div>

          <FaqAccordion question="Bagaimana cara menyesuaikan harga jual masal jika margin laba sedang kritis?">
            <p className="mb-2">Jika kasir salah memasukkan PIN/Password berkali-kali, akun akan terkunci. Buka akses dengan cara ini:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Buka menu Pengaturan.</li>
              <li>Pilih Kelola Pengguna.</li>
              <li>Cari nama kasir yang memiliki status Terkunci.</li>
              <li>Klik tombol Buka Akses pada baris nama tersebut.</li>
              <li>Klik Konfirmasi pada pop-up yang muncul. Status akan kembali menjadi 'Aktif' dan password akan di-reset ke default.</li>
            </ol>
          </FaqAccordion>

          <FaqAccordion question="Bagaimana cara mengubah logo struk cetak dan jam operasional toko?">
            <p className="mb-2">Untuk mendaftarkan pegawai baru agar bisa login ke mesin kasir:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Buka menu Pengaturan.</li>
              <li>Pilih Kelola Pengguna.</li>
              <li>Klik tombol biru + Tambah Pegawai Baru di pojok kanan atas.</li>
              <li>Isi formulir Data Diri (Nama, Username, PIN awal).</li>
              <li>Pilih opsi Role menjadi Kasir.</li>
              <li>Klik tombol Simpan di bagian bawah formulir.</li>
            </ol>
          </FaqAccordion>
        </div>

        {/* Butuh Bantuan Darurat? Section */}
        <div className="mt-8 bg-gradient-to-r from-[#0d348a] to-[#144bc4] rounded-[20px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">
          <div className="mb-4 md:mb-0 max-w-lg">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Butuh Bantuan Darurat?
            </h2>
            <p className="text-blue-100 text-[15px]">
              Jika aplikasi error total atau mati lampu, segera hubungi Manajer Toko atau IT Support.
            </p>
          </div>
          <button 
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('user'));
              const nama = user?.name || 'Admin';
              const msg = `Halo Tim IT,\n\nSaya ${nama} mengalami kendala teknis pada aplikasi admin Nicky Frozen.\n\nDetail Info:\n- Nama: ${nama}\n- Jabatan: Admin\n- Waktu Kejadian: ${new Date().toLocaleString('id-ID')}\n\nKendala yang dialami:\n[Tulis detail masalah Anda di sini...]\n\nMohon bantuannya segera. Terima kasih.`;
              window.open(`https://wa.me/62882007588067?text=${encodeURIComponent(msg)}`, '_blank');
            }}
            className="bg-white text-green-700 hover:bg-green-50 hover:scale-105 border border-green-200 font-extrabold text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-green-100 transition-all duration-300"
          >
            <FaWhatsapp className="text-green-600 text-xl" />
            Hubungi Tim IT Sekarang
          </button>
        </div>

      </div>
      
      {/* Footer */}
      <div className="w-full text-center pb-8 mt-auto">
        <p className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">
          © 2026 Nicky Frozen. All rights reserved.
        </p>
      </div>
    </div>
  );
};