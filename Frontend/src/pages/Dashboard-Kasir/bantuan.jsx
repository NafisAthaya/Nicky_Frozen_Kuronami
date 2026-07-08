import { useState } from 'react';
import {
  HiOutlineSearch,
  HiOutlineReceiptTax,
  HiOutlinePrinter,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiChevronDown,
  HiChevronUp,
  HiOutlineChatAlt2,
  HiArrowLeft,
  HiOutlineCash,
  HiOutlineShoppingCart,
  HiOutlineMinus,
  HiOutlineLink,
  HiOutlineLightBulb,
  HiOutlineCalculator,
  HiOutlineKey,
  HiOutlineExclamationCircle,
  HiOutlineLockClosed,
  HiOutlineDotsHorizontal,
  HiOutlinePause,
  HiOutlineBookmark,
  HiOutlineRefresh
} from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const HighlightText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) {
    return <span>{text}</span>;
  }
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-black px-1 rounded">{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const faqs = [
  {
    title: "1. Cara mengatasi barcode basah atau rusak sehingga gagal di-scan",
    content: [
      "Periksa angka SKU (Stock Keeping Unit) yang tertera di bawah garis barcode kemasan produk.",
      "Arahkan kursor ke kolom pencarian \"Scan barcode\" di area tengah layar Kasir.",
      "Ketik manual angka SKU atau nama produk (misal: \"Sosis Sapi Bratwurst\").",
      "Tekan Enter atau klik nama produk, sistem akan otomatis menambahkan barang tersebut ke keranjang."
    ]
  },

  {
    title: "3. Langkah membatalkan item barang yang salah masuk ke keranjang",
    content: [
      "Temukan item yang ingin dihapus pada daftar keranjang belanja.",
      "Klik tombol minus (-) di sebelah angka jumlah barang secara terus-menerus hingga angkanya menjadi nol (0).",
      "Item akan terhapus dan total tagihan akan otomatis berkurang."
    ]
  },
  {
    title: "4. Cara mengatasi printer struk macet atau kehabisan kertas",
    content: [
      "Jangan panik, transaksi yang baru saja terjadi sudah otomatis tersimpan di dalam sistem.",
      "Periksa printer fisik: Matikan tombol power, buka penutup atas, pastikan gulungan kertas kasir (thermal paper) tidak terbalik atau tersangkut, lalu nyalakan kembali.",
      "Setelah printer menyala normal, klik menu 'Riwayat Transaksi' pada sidebar sebelah kiri.",
      "Cari transaksi terakhir yang baru saja selesai di bagian paling atas daftar.",
      "Klik tombol 'Cetak Ulang Struk'. Printer akan langsung mencetak struk transaksi tersebut."
    ]
  },
  {
    title: "5. Cara mengatasi akun terkunci akibat salah PIN",
    content: [
      "Akun akan terkunci otomatis setelah 3x salah memasukkan PIN demi keamanan.",
      "Hubungi Manager Toko atau Admin untuk melakukan \"Reset PIN\" melalui menu Manajemen Pengguna.",
      "Gunakan PIN sementara yang diberikan untuk masuk, lalu segera ganti PIN baru di menu Profil."
    ]
  }
];

const cards = [
  {
    id: 'transaksi',
    icon: HiOutlineReceiptTax,
    title: "Transaksi & Pembayaran",
    desc: "Pelajari cara memproses pembayaran Tunai,..."
  },
  {
    id: 'printer',
    icon: HiOutlinePrinter,
    title: "Scanner & Printer",
    desc: "Solusi cepat untuk mengatasi scanner tidak terbaca, laci..."
  },
  {
    id: 'shift',
    icon: HiOutlineClock,
    title: "Antrean & Shift",
    desc: "Panduan mengatur pergantian shift dan..."
  },
  {
    id: 'akun',
    icon: HiOutlineShieldCheck,
    title: "Akun & Keamanan",
    desc: "Panduan cara mengganti kata sandi akun Kasir dan..."
  }
];

export default function Bantuan() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const renderMainGrid = () => (
    <>
      <h1 className="text-3xl font-extrabold text-[#082B7A] mb-2">Pusat Bantuan Kasir</h1>
      <p className="text-gray-500 mb-6 leading-relaxed">
        Temukan panduan operasional cepat dan solusi masalah teknis harian di meja kasir.
      </p>

      <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 h-12 mb-8">
        <HiOutlineSearch className="text-gray-400 text-xl mr-3" />
        <input className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Cari artikel, panduan, atau topik bantuan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
            key={card.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition" onClick={() => setActiveCategory(card.id)}>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Icon className="text-2xl text-blue-600" />
                </div>
              <h3 className="font-bold text-[#082B7A] mb-2">
                {card.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed">
                {card.desc}
                </p>
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold text-[#082B7A] mb-5">Solusi Masalah Cepat (FAQ)</h2>
        <div className="space-y-4 mb-10">        
            {faqs.map((faq, index) => {
              const q = search.toLowerCase();
              const matchesTitle = faq.title.toLowerCase().includes(q);
              const matchesContent = faq.content.some(c => c.toLowerCase().includes(q));
              
              if (search && !matchesTitle && !matchesContent) {
                return null;
              }
              
              const isExpanded = search ? true : openFaq === index;

              return (
                <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer"
              >
            <div onClick={() => toggleFaq(index)} className="flex justify-between items-center p-5 font-semibold text-[#082B7A]">
              <span><HighlightText text={faq.title} highlight={search} /></span>
              {isExpanded ? <HiChevronUp className="text-xl text-gray-500" /> : <HiChevronDown className="text-xl text-gray-500" />}
            </div>
            {isExpanded && (
              <div className="px-5 pb-5 text-gray-600">
                <ul className="list-decimal pl-6 space-y-2 text-gray-600 text-sm leading-7">
                {faq.content.map((item, i) => (
                  <li key={i}><HighlightText text={item} highlight={search} /></li>
                ))}
              </ul>
              </div>
            )}
          </div>
        )})}
      </div>

      <div className="mt-8 bg-gradient-to-r from-[#0d348a] to-[#144bc4] rounded-[20px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">
        <div className="mb-4 md:mb-0 max-w-lg">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Butuh Bantuan Darurat?</h2>
          <p className="text-blue-100 text-[15px]">Jika aplikasi error total atau mati lampu, segera hubungi Manajer Toko atau IT Support.</p>
        </div>
        <button
          onClick={() => {
            const user = JSON.parse(localStorage.getItem('user'));
            const nama = user?.name || 'Kasir';
            const msg = `Halo Tim IT,\n\nSaya ${nama} mengalami kendala teknis pada aplikasi POS Nicky Frozen.\n\nDetail Info:\n- Nama: ${nama}\n- Jabatan: Kasir\n- Waktu Kejadian: ${new Date().toLocaleString('id-ID')}\n\nKendala yang dialami:\n[Tulis detail masalah Anda di sini...]\n\nMohon bantuannya segera. Terima kasih.`;
            window.open(`https://wa.me/62882007588067?text=${encodeURIComponent(msg)}`, '_blank');
          }}
          className="bg-white text-green-700 hover:bg-green-50 hover:scale-105 border border-green-200 font-extrabold text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-green-100 transition-all duration-300"
        >
          <FaWhatsapp className="text-green-600 text-xl" />
          Hubungi Tim IT Sekarang
        </button>
      </div>
    </>
  );

  const renderDetailBanner = () => (
    <div className="mt-8 bg-gradient-to-r from-[#0d348a] to-[#144bc4] rounded-[20px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">
      <div className="mb-4 md:mb-0 max-w-lg">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Masalah belum terselesaikan?</h2>
        <p className="text-blue-100 text-[15px]">Tim IT Support kami siap membantu Anda.</p>
      </div>
      <button
        onClick={() => {
          const user = JSON.parse(localStorage.getItem('user'));
          const nama = user?.name || 'Kasir';
          const msg = `Halo Tim IT,\n\nSaya ${nama} mengalami kendala teknis pada aplikasi POS Nicky Frozen.\n\nDetail Info:\n- Nama: ${nama}\n- Jabatan: Kasir\n- Waktu Kejadian: ${new Date().toLocaleString('id-ID')}\n\nKendala yang dialami:\n[Tulis detail masalah Anda di sini...]\n\nMohon bantuannya segera. Terima kasih.`;
          window.open(`https://wa.me/62882007588067?text=${encodeURIComponent(msg)}`, '_blank');
        }}
        className="bg-white text-green-700 hover:bg-green-50 hover:scale-105 border border-green-200 font-extrabold text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-green-100 transition-all duration-300"
      >
        <FaWhatsapp className="text-green-600 text-xl" />
        Hubungi Tim IT Sekarang
      </button>
    </div>
  );

  const renderTransaksi = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#082B7A] mb-2">Transaksi & Pembayaran</h1>
      <p className="text-gray-500 mb-6">Temukan panduan dan solusi cepat untuk kelancaran operasional toko.</p>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl"><HiOutlineCash /></div>
          <h3>Bagaimana cara memproses pembayaran Tunai?</h3>
        </div>
       <p className="text-gray-500 mb-5">
        Ikuti langkah-langkah di bawah ini untuk menyelesaikan transaksi dengan uang tunai pada layar kasir.
        </p>
        <ul className="space-y-4 mt-5"></ul>
        
        <ul className="space-y-4 mt-5">
          <li className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</span>
            <span>Pastikan semua barang pelanggan sudah dipindai dan muncul di daftar 'Pesanan Saat Ini' di sisi kanan layar.</span>
          </li>
          <li className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">2</span>
            <span>Klik tombol <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">Bayar</span> yang terletak di bagian bawah ringkasan pesanan.</span>
          </li>
          <li className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                3
            </span>
            <span>
                Pada jendela pop-up metode pembayaran, pilih opsi 'Tunai'.
            </span>
            </li>
          <li className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">4</span>
            <span>Pilih nominal uang pas yang disarankan di layar, atau ketik nominal uang yang diterima dari pelanggan secara manual menggunakan numpad layar.</span>
          </li>
          <li className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">5</span>
            <span>Klik tombol <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">Konfirmasi Pembayaran</span> untuk mencetak struk dan menyelesaikan pesanan.</span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl"><HiOutlineShoppingCart /></div>
          <h3>Bagaimana cara membatalkan item barang yang salah masuk ke keranjang?</h3>
        </div>
        <p className="text-gray-500 mb-5">Jika terjadi kesalahan scan, ikuti langkah mudah ini untuk menghapus barang dari keranjang sebelum pembayaran.</p>
        
        <ul className="space-y-4 mt-5">
          <li className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</span>
            <span>Temukan nama produk yang salah di dalam daftar pesanan sebelah kanan.</span>
          </li>
          <li className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">2</span>
            <span>Klik tombol minus <span className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium inline-flex items-center gap-1"><HiOutlineMinus /></span> pada pengatur jumlah (kuantitas) barang tersebut.</span>
          </li>
          <li className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">3</span>
            <span>Kurangi jumlahnya hingga mencapai angka nol (0). Item tersebut akan otomatis terhapus dari daftar keranjang secara instan.</span>
          </li>
        </ul>
      </div>

      {renderDetailBanner()}
    </div>
  );

  const renderPrinter = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#082B7A] mb-2">Scanner & Printer</h1>
      <p className="text-gray-500 mb-6">Temukan panduan dan solusi cepat untuk kelancaran operasional toko.</p>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl"><HiOutlineLink /></div>
          <h3>Apa yang harus dilakukan jika Scanner Barcode tidak membaca produk?</h3>
        </div>
        <p className="text-gray-500 mb-5">Ikuti langkah-langkah diagnostik berikut sebelum menghubungi teknisi IT.</p>

        <div className="grid md:grid-cols-3 gap-4 mt-5">
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4"><HiOutlineLink /></div>
            <h4>1. Periksa Kabel USB</h4>
            <p>Pastikan kabel scanner terpasang erat pada port USB terminal kasir. Coba cabut dan pasang kembali (re-plug).</p>
          </div>
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl mb-4"><HiOutlineLightBulb /></div>
            <h4>2. Cek Sinar Inframerah</h4>
            <p>Tekan pelatuk scanner. Pastikan garis sinar merah menyala terang. Bersihkan kaca scanner jika berdebu menggunakan kain microfiber.</p>
          </div>
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4"><HiOutlineCalculator /></div>
            <h4>3. Gunakan Pencarian Manual</h4>
            <p>Jika barcode fisik produk rusak atau pudar, gunakan fitur "Cari Produk" (F2) pada layar kasir untuk memasukkan kode item secara manual.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl"><HiOutlinePrinter /></div>
          <h3>Bagaimana jika laci uang (Cash Drawer) tidak otomatis terbuka setelah transaksi?</h3>
        </div>
        <p className="text-gray-500 mb-5">Laci uang terhubung secara sinkron dengan printer struk. Periksa status printer terlebih dahulu.</p>

        <div className="space-y-4 mt-5">
          <div className="flex gap-4 p-5 border border-gray-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0"><HiOutlinePrinter /></div>
            <div className="flex-1">
              <h4>Pastikan Printer Struk Menyala & Memiliki Kertas</h4>
              <p>Sinyal untuk membuka laci uang dikirim melalui printer thermal. Periksa apakah indikator daya printer berwarna hijau. Jika lampu merah berkedip, kemungkinan kertas struk habis atau penutup atas printer tidak tertutup rapat. Isi ulang kertas roll thermal.</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 border border-gray-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl shrink-0"><HiOutlineKey /></div>
            <div className="flex-1">
              <h4>Hubungi Store Manager untuk Kunci Manual</h4>
              <p>Jika sistem kelistrikan terputus atau terjadi error software yang tidak dapat diselesaikan segera, hubungi Supervisor atau Store Manager yang bertugas. Mereka memiliki kunci fisik darurat untuk membuka laci uang agar pelayanan pelanggan tidak terhambat.</p>
            </div>
          </div>
        </div>
      </div>

      {renderDetailBanner()}
    </div>
  );

  const renderShift = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#082B7A] mb-2">Antrean & Shift</h1>
      <p className="text-gray-500 mb-6">Temukan panduan cepat untuk operasional kasir sehari-hari. Pilih kategori di bawah untuk menemukan solusi dari masalah yang sering terjadi.</p>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:flex gap-6">
        <div className="lg:w-1/3">
          <div className="w-14 h-14 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xl mb-4"><HiOutlineClock /></div>
          <h3>Bagaimana prosedur Ganti Shift yang benar?</h3>
        </div>
        <div className="lg:flex-1">
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">1</span>
              <span>Pastikan tidak ada transaksi yang menggantung. Klik tombol <span className="px-3 py-1 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium inline-flex items-center gap-1"><HiOutlineRefresh className="inline text-base"/> Ganti Shift</span> (biasanya berwarna oranye di sudut layar).</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">2</span>
              <span>Hitung uang fisik di laci kasir. Pastikan <strong>selisih (difference) bernilai nol</strong> antara catatan sistem dan uang fisik.</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">3</span>
              <span>Jika sudah sesuai, klik tombol <span className="px-3 py-1 rounded-lg bg-[#082B7A] text-white text-sm font-medium">Selesaikan Shift & Cetak Laporan</span>.</span>
            </li>
          </ul>
          <div className="flex gap-3 items-start bg-orange-50 border border-orange-200 rounded-xl p-4 mt-4">
            <HiOutlineExclamationCircle className="text-orange-500 text-xl shrink-0" />
            <span>Catatan: Laporan shift akan tercetak otomatis dan sistem akan logout untuk kasir berikutnya.</span>
          </div>
        </div>
      </div>

      {renderDetailBanner()}
    </div>
  );

  const renderAkun = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#082B7A] mb-2">Akun & Keamanan</h1>
      <p className="text-gray-500 mb-6">Temukan panduan cepat untuk operasional kasir sehari-hari. Pilih kategori di bawah untuk menemukan solusi dari masalah yang sering terjadi.</p>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl"><HiOutlineLockClosed /></div>
          <h3>Apa yang harus dilakukan jika akun terkunci karena salah PIN/Kata Sandi 3 kali?</h3>
        </div>
        <div className="space-y-5">
          <p>Sebagai langkah perlindungan sistem standar, terminal POS akan otomatis membekukan akses jika terdeteksi aktivitas login yang mencurigakan.</p>
          
          <div className="flex gap-3 items-start bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
            <HiOutlineExclamationCircle className="text-red-500 text-xl shrink-0" />
            <span className="text-red-600"><strong>Penting: Akun terkunci secara otomatis untuk keamanan. Anda tidak dapat melakukan reset atau membuka blokir secara mandiri melalui terminal ini.</strong></span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <strong>Langkah Penyelesaian:</strong>
            <p>Segera hentikan upaya login pada terminal.</p>
            <p>Laporkan status akun terkunci kepada Store Manager atau Supervisor yang bertugas saat ini.</p>
            <p>Tunggu hingga Store Manager melakukan proses pembukaan blokir (unblocking) melalui <strong>Admin Dashboard</strong> pusat.</p>
            <p>Setelah dikonfirmasi terbuka, coba login kembali dengan kredensial yang benar.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl"><HiOutlineDotsHorizontal /></div>
          <h3>Bagaimana cara mengganti kata sandi (Password) secara berkala?</h3>
        </div>
        <div className="space-y-5">
          <p>Penggantian kata sandi rutin sangat disarankan setiap 30 hari untuk menjaga integritas data penjualan. Ikuti langkah-langkah presisi berikut di terminal Anda:</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mt-5">
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#082B7A] text-white flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <span>Klik nama akun Anda yang berada di pojok kanan atas layar utama.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#082B7A] text-white flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <span>Pilih menu Pengaturan Akun dari dropdown yang muncul.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#082B7A] text-white flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <span>Masukkan kata sandi lama Anda pada kolom Password.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#082B7A] text-white flex items-center justify-center text-sm font-bold shrink-0">4</span>
                <span>Ketikkan kata sandi baru Anda pada kolom New Password (pastikan kombinasi kuat).</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#082B7A] text-white flex items-center justify-center text-sm font-bold shrink-0">5</span>
                <span>Klik tombol Save. Sistem akan meminta Anda untuk login ulang (relogin) menggunakan kata sandi yang baru.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#082B7A] text-white rounded-2xl p-6 flex gap-4 items-center mt-6">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0">
          <HiOutlineShieldCheck className="text-[#082B7A] text-2xl" />
        </div>
        <div>
          <h3>Panduan Keamanan POS</h3>
          <p>Berikut adalah instruksi resmi untuk menangani masalah akses akun dan pembaruan kredensial sistem kasir Anda. Pastikan untuk selalu menjaga kerahasiaan PIN dan Kata Sandi.</p>
        </div>
      </div>
    </div>
  );

  return (
  <div className="flex-1 min-h-screen bg-[#F5F7FB] p-8">
    <div className="max-w-6xl mx-auto">
        {activeCategory ? (
          <>
            <button className="flex items-center gap-2 mb-6 text-[#082B7A] font-semibold" onClick={() => setActiveCategory(null)}>
              <HiArrowLeft /> Kembali
            </button>
            {activeCategory === 'transaksi' && renderTransaksi()}
            {activeCategory === 'printer' && renderPrinter()}
            {activeCategory === 'shift' && renderShift()}
            {activeCategory === 'akun' && renderAkun()}
          </>
        ) : (
          renderMainGrid()
        )}
      </div>
    </div>
  );
}
