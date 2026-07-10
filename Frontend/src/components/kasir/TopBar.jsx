import ownerProfile from '../../assets/OwnerProfile.png';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function TopBar({ globalSearch, setGlobalSearch }) {

  const [showProfile, setShowProfile] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const photo = user?.foto ? `http://127.0.0.1:8000/storage/${user.foto}` : ownerProfile;
  
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isBantuanPage = location.pathname === '/kasir/bantuan';

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
    <header className="h-[72px] bg-white border-b border-gray-200 px-6 flex items-center justify-between">

      {/* Search */}
      <div className="flex-1 max-w-[460px]">
        {!isBantuanPage && (
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Cari (Universal)..."
             className="
              w-full
              bg-[#F5F7FB]
              rounded-2xl
              pl-12
              pr-4
              h-12
              text-sm
              outline-none
              "
            />
          </div>
        )}
      </div>

      {/* Right */}
      <div
          className="relative flex items-center gap-5"
          ref={profileRef}
      >

        {/* Wifi */}
        <button className="text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0"
            />
          </svg>
        </button>

        {/* Sinkronisasi Global */}
        <button 
          onClick={async () => {
            if (isSyncing) return;
            setIsSyncing(true);
            // Dispatch event global agar semua halaman/komponen me-refresh datanya
            window.dispatchEvent(new Event('global-sync'));
            // Tampilkan toast sinkronisasi
            setSyncToast(true);
            setTimeout(() => {
              setIsSyncing(false);
              setSyncToast(false);
            }, 2000);
          }}
          className={`w-11 h-11 flex items-center justify-center rounded-xl text-blue-700 hover:bg-gray-100 hover:text-blue-800 transition-all ${isSyncing ? 'pointer-events-none' : ''}`}
          title="Sinkronisasi Data"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-700 ${isSyncing ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>

        <div className="w-px h-8 bg-gray-300" />

        {/* User */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">
            {user?.name || 'Kasir'}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role === 'kasir' ? `Kasir • ${localStorage.getItem('shift') || 'Shift 1'}` : 'Kasir'}
          </p>
        </div>

        <button
          onClick={() => setShowProfile(!showProfile)}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#FF7A00] transition"
        >
          <img
            src={photo}
            alt="Kasir"
            className="w-full h-full object-cover"
          />
        </button>

        {showProfile && (
          <div className="absolute top-14 right-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">

            <div className="px-5 py-4">
              <h3 className="font-semibold text-slate-800">
                {user?.name || 'Kasir'}
              </h3>

              <p className="text-xs text-slate-500">
                {user?.email || 'kasir@nickyfrozen.com'}
              </p>
            </div>

            <div className="border-t" />

            <button
              onClick={() => navigate('/kasir/profil')}
              className="w-full px-5 py-3 flex items-center gap-2 text-sm hover:bg-slate-50"
            >
              Pengaturan Akun
            </button>

          </div>
        )}
      </div>
    </header>

      {/* Toast Sinkronisasi */}
      {syncToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-fadeIn">
          <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-semibold">Data berhasil disinkronkan!</span>
          </div>
        </div>
      )}
    </>
  );
}