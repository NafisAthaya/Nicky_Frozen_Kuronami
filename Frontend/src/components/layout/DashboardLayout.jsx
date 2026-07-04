import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#F6F7FB]">
      {/* Sidebar Statis di Kiri (Lebar: 280px) */}
      <Sidebar />

      {/* Area Kanan: Tambahkan ml-[280px] agar terdorong ke kanan */}
      <div className="flex-1 flex flex-col overflow-hidden ml-[280px]">
        
        {/* TopBar Statis di Atas */}
        <TopBar />

        {/* Area Konten Utama (Outlet) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <Outlet /> {/* Ini tempat Beranda.jsx dirender */}
        </main>

      </div>
    </div>
  );
}