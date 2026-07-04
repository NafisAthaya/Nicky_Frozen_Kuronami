import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AdminLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-[280px]">
        <TopBar searchQuery={searchQuery} onSearch={(e) => setSearchQuery(e.target.value)} />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}