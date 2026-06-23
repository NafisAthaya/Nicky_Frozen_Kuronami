import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Login & Branch
import Login from './pages/Login/Login';
import ResetPassword from './pages/Login/reset-password';
import BranchSelection from './pages/BranchSelection/BranchSelection';

// Owner Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Admin Layout
import AdminLayout from './components/admin/DashboardLayout';

// Kasir Layout
import KasirLayout from './components/kasir/DashboardLayout';


// Owner Pages
import AturHarga from './pages/Dashboard-Owner/AturHarga';
import Beranda from './pages/Dashboard-Owner/Beranda';
import CabangToko from './pages/Dashboard-Owner/CabangToko';
import DiskonOtomatis from './pages/Dashboard-Owner/DiskonOtomatis';
import Laporan from './pages/Dashboard-Owner/Laporan';
import NotifikasiOwner from './pages/Dashboard-Owner/Notifikasi';
import PajakPembulatan from './pages/Dashboard-Owner/PajakPembulatan';
import ProdukTerlaris from './pages/Dashboard-Owner/ProdukTerlaris';
import ProfilOwner from './pages/Dashboard-Owner/Profil';
import PusatBantuan from './pages/Dashboard-Owner/PusatBantuan';
import StokBarangOwner from './pages/Dashboard-Owner/StokBarang';
import Transaksi from './pages/Dashboard-Owner/Transaksi';

// Admin Pages
import DashboardOperasional from './pages/Dashboard-Admin/DashboardOperasional';
import NotifikasiAdmin from './pages/Dashboard-Admin/Notifikasi';
import StokBarangAdmin from './pages/Dashboard-Admin/StokBarang';
import PengajuanStok from './pages/Dashboard-Admin/PengajuanStok';
import KategoriItem from './pages/Dashboard-Admin/KategoriItem';
import BarangMasuk from './pages/Dashboard-Admin/BarangMasuk';
import ProfilAdmin from './pages/Dashboard-Admin/Profil';
import Pengaturan from './pages/Dashboard-Admin/Pengaturan';
import BantuanAdmin from './pages/Dashboard-Admin/Bantuan';
import RiwayatBarangMasuk from './pages/Dashboard-Admin/RiwayatBarangMasuk';

// Kasir Pages
import DashboardKasir from './pages/Dashboard-Kasir/DashboardKasir';
import BantuanKasir from './pages/Dashboard-Kasir/bantuan';
import GantiShift from './pages/Dashboard-Kasir/GantiShift';
import Pengeluaran from './pages/Dashboard-Kasir/Pengeluaran';
import ProfilKasir from './pages/Dashboard-Kasir/Profil';
import RiwayatTransaksi from './pages/Dashboard-Kasir/RiwayatTransaksi';

export default function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<BranchSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* OWNER */}
        <Route path="/owner" element={<DashboardLayout />}>
          <Route index element={<Beranda />} />
          <Route path="notifikasi" element={<NotifikasiOwner />} />
          <Route path="stok-barang" element={<StokBarangOwner />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="transaksi" element={<Transaksi />} />
          <Route path="atur-harga" element={<AturHarga />} />
          <Route path="diskon-otomatis" element={<DiskonOtomatis />} />
          <Route path="pajak-pembulatan" element={<PajakPembulatan />} />
          <Route path="cabang-toko" element={<CabangToko />} />
          <Route path="profil" element={<ProfilOwner />} />
          <Route path="pusat-bantuan" element={<PusatBantuan />} />
          <Route path="produk-terlaris" element={<ProdukTerlaris />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOperasional />} />
          <Route path="notifikasi" element={<NotifikasiAdmin />} />
          <Route path="stok-barang" element={<StokBarangAdmin />} />
          <Route path="pengajuan-stok" element={<PengajuanStok />} />
          <Route path="kategori-item" element={<KategoriItem />} />
          <Route path="barang-masuk" element={<BarangMasuk />} />
          <Route path="profil" element={<ProfilAdmin />} />
          <Route path="pengaturan" element={<Pengaturan />} />
          <Route path="bantuan" element={<BantuanAdmin />} />
          <Route path="riwayat-barang-masuk" element={<RiwayatBarangMasuk />} />
        </Route>
        
        {/* KASIR */}
        <Route path="/kasir" element={<KasirLayout />}>
        <Route index element={<DashboardKasir />} />

        <Route path="pengeluaran" element={<Pengeluaran />} />
        <Route path="riwayat-transaksi" element={<RiwayatTransaksi />} />
        <Route path="ganti-shift" element={<GantiShift />} />
        <Route path="profil" element={<ProfilKasir />} />
        <Route path="bantuan" element={<BantuanKasir />} />
      </Route>

      </Routes>
    </Router>
  );
}