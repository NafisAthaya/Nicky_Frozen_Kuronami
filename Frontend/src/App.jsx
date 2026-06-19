import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Halaman Utama
import Login from './pages/Login/Login';
import BranchSelection from './pages/BranchSelection/BranchSelection';

// Import Halaman Dashboard
import AturHarga from './pages/Dashboard/AturHarga';
import Beranda from './pages/Dashboard/Beranda';
import CabangToko from './pages/Dashboard/CabangToko';
import DiskonOtomatis from './pages/Dashboard/DiskonOtomatis';
import Laporan from './pages/Dashboard/Laporan';
import Notifikasi from './pages/Dashboard/Notifikasi';
import PajakPembulatan from './pages/Dashboard/PajakPembulatan';
import ProdukTerlaris from './pages/Dashboard/ProdukTerlaris';
import Profil from './pages/Dashboard/Profil';
import PusatBantuan from './pages/Dashboard/PusatBantuan';
import StokBarang from './pages/Dashboard/StokBarang';
import Transaksi from './pages/Dashboard/Transaksi';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Awal */}
        <Route path="/" element={<Login />} />
        <Route path="/branch-selection" element={<BranchSelection />} />

        {/* Rute Dashboard */}
        <Route path="/dashboard" element={<Beranda />} />
        <Route path="/dashboard/atur-harga" element={<AturHarga />} />
        <Route path="/dashboard/cabang-toko" element={<CabangToko />} />
        <Route path="/dashboard/diskon-otomatis" element={<DiskonOtomatis />} />
        <Route path="/dashboard/laporan" element={<Laporan />} />
        <Route path="/dashboard/notifikasi" element={<Notifikasi />} />
        <Route path="/dashboard/pajak-pembulatan" element={<PajakPembulatan />} />
        <Route path="/dashboard/produk-terlaris" element={<ProdukTerlaris />} />
        <Route path="/dashboard/profil" element={<Profil />} />
        <Route path="/dashboard/pusat-bantuan" element={<PusatBantuan />} />
        <Route path="/dashboard/stok-barang" element={<StokBarang />} />
        <Route path="/dashboard/transaksi" element={<Transaksi />} />
      </Routes>
    </Router>
  );
}