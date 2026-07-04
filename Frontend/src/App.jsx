import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore'; // Import Zustand Store
import { Toaster } from 'react-hot-toast';

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
// Import Halaman Dashboard Owner
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
import PersetujuanStokOwner from './pages/Dashboard-Owner/PersetujuanStok';

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
import { ErrorBoundary } from './components/ErrorBoundary';
import BantuanKasir from './pages/Dashboard-Kasir/bantuan';
import GantiShift from './pages/Dashboard-Kasir/GantiShift';
import Pengeluaran from './pages/Dashboard-Kasir/Pengeluaran';
import ProfilKasir from './pages/Dashboard-Kasir/Profil';
import RiwayatTransaksi from './pages/Dashboard-Kasir/RiwayatTransaksi';

// ----------------------------------------------------------------------
// 1. SATPAM HALAMAN PUBLIK (Mencegah user yg sudah login buka page Login)
// ----------------------------------------------------------------------
const PublicRoute = ({ children }) => {
  const { token, user } = useAuthStore();

  if (token && user) {
    // Arahkan sesuai jabatan masing-masing
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'kasir') return <Navigate to="/kasir" replace />;
    return <Navigate to="/owner" replace />;
  }

  return children;
};

// ----------------------------------------------------------------------
// 2. SATPAM HALAMAN TERLINDUNGI (Mengecek Token & Jabatan)
// ----------------------------------------------------------------------
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useAuthStore();

  // Kalau tidak ada token (belum login), tendang ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Kalau punya token, tapi jabatannya tidak sesuai dengan rute yang dituju
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Lempar kembali ke ruangan masing-masing
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'kasir') return <Navigate to="/kasir" replace />;
    return <Navigate to="/owner" replace />;
  }

  return children;
};


export default function App() {
  const { token, user } = useAuthStore();

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
  
        {/* ==================== RUTE PILIH CABANG ==================== */}
        <Route
            path="/"
            element={<BranchSelection />}
        />

        {/* OWNER */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Beranda />} />
          <Route path="notifikasi" element={<NotifikasiOwner />} />
          <Route path="stok-barang" element={<StokBarangOwner />} />
          <Route path="persetujuan-stok" element={<PersetujuanStokOwner />} />

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
        <Route
          path="/admin"
          element={
      <ProtectedRoute allowedRoles={['admin', 'owner']}>
        <AdminLayout />
        </ProtectedRoute>
    }
>
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
        <Route
          path="/kasir"
          element={
        <ProtectedRoute allowedRoles={['kasir', 'owner']}>
            <KasirLayout />
        </ProtectedRoute>
    }
>
        <Route index element={
          <ErrorBoundary>
            <DashboardKasir />
          </ErrorBoundary>
        } />
        <Route path="pengeluaran" element={<Pengeluaran />} />
        <Route path="riwayat-transaksi" element={<RiwayatTransaksi />} />
        <Route path="ganti-shift" element={<GantiShift />} />
        <Route path="profil" element={<ProfilKasir />} />
        <Route path="bantuan" element={<BantuanKasir />} />
      </Route>

        {/* ==================== RUTE FALLBACK (404) ==================== */}
        {/* Kalau user mengetik URL yang ngawur */}
        <Route 
          path="*" 
          element={
            !token ? <Navigate to="/login" /> :
            user?.role === 'admin' ? <Navigate to="/admin" /> :
            user?.role === 'kasir' ? <Navigate to="/kasir" replace /> :
            user?.role === 'owner' ? <Navigate to="/owner" replace /> :
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
    </>
    );
  }