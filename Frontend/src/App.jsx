import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Halaman Utama
import Login from './pages/Login/Login';
import BranchSelection from './pages/BranchSelection/BranchSelection';

// Import Halaman Dashboard
import AturHarga from './pages/Dashboard-Owner/AturHarga';
import Beranda from './pages/Dashboard-Owner/Beranda';
import CabangToko from './pages/Dashboard-Owner/CabangToko';
import DiskonOtomatis from './pages/Dashboard-Owner/DiskonOtomatis';
import Laporan from './pages/Dashboard-Owner/Laporan';
import Notifikasi from './pages/Dashboard-Owner/Notifikasi';
import PajakPembulatan from './pages/Dashboard-Owner/PajakPembulatan';
import ProdukTerlaris from './pages/Dashboard-Owner/ProdukTerlaris';
import Profil from './pages/Dashboard-Owner/Profil';
import PusatBantuan from './pages/Dashboard-Owner/PusatBantuan';
import StokBarang from './pages/Dashboard-Owner/StokBarang';
import Transaksi from './pages/Dashboard-Owner/Transaksi';
import ResetPassword from './pages/Login/reset-password';
import DashboardLayout from './components/layout/DashboardLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Awal */}
        <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Beranda />} />
        <Route path="notifikasi" element={<Notifikasi />} />
        <Route path="stok-barang" element={<StokBarang />} />
        <Route path="laporan" element={<Laporan />} />
        <Route path="transaksi" element={<Transaksi />} />
        <Route path="atur-harga" element={<AturHarga />} />
        <Route path="diskon-otomatis" element={<DiskonOtomatis />} />
        <Route path="pajak-pembulatan" element={<PajakPembulatan />} />
        <Route path="cabang-toko" element={<CabangToko />} />
        <Route path="profil" element={<Profil />} />
        <Route path="pusat-bantuan" element={<PusatBantuan />} />
        <Route path="produk-terlaris" element={<ProdukTerlaris />} />
        </Route>
      </Routes>
    </Router>
  );
}