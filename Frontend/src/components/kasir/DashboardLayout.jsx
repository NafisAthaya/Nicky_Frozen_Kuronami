import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-[280px]">
        <TopBar globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />

        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ globalSearch, setGlobalSearch }} />
        </main>
      </div>
    </div>
  );
}