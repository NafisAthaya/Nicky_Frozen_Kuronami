import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-64">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}