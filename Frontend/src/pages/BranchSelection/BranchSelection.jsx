import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const branches = [
  {
    id: 1,
    name: 'Cabang Seturan',
    address: 'Jl. Seturan Raya No. 15, Sleman, Yogyakarta',
    phone: '(0274) 555-001',
    status: 'online',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=250&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Cabang Gejayan',
    address: 'Jl. Affandi No. 42, Caturtunggal, Sleman',
    phone: '(0274) 555-002',
    status: 'online',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Cabang Kaliurang',
    address: 'Jl. Kaliurang Km.6 No. 88, Sleman, Yogyakarta',
    phone: '(0274) 555-003',
    status: 'offline',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=250&fit=crop&q=80',
  },
];

export default function BranchSelection() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (branch) => {
    setSelectedBranch(branch.id);
    // Simulasi navigasi ke dashboard setelah delay singkat
    setTimeout(() => {
      // navigate('/dashboard');
      alert(`Anda memilih: ${branch.name}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-orange-50 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">ColdStack</h1>
              <p className="text-xs text-gray-400">Nicky Frozen POS</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Greeting */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Login berhasil
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang, Kasir! 👋
          </h2>
          <p className="text-gray-500 max-w-md">
            Pilih cabang toko tempat Anda akan bertugas hari ini untuk melanjutkan.
          </p>
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleSelect(branch)}
              className={`
                group relative text-left bg-white rounded-2xl border-2 overflow-hidden
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg hover:border-orange-400
                focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2
                ${selectedBranch === branch.id
                  ? 'border-orange-500 shadow-lg shadow-orange-100 -translate-y-1'
                  : 'border-gray-100 shadow-sm'
                }
              `}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Status Badge */}
                <div className={`
                  absolute top-3 right-3 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm
                  ${branch.status === 'online'
                    ? 'bg-green-500/20 text-green-100'
                    : 'bg-red-500/20 text-red-100'
                  }
                `}>
                  <span className={`w-1.5 h-1.5 rounded-full ${branch.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  {branch.status === 'online' ? 'Online' : 'Offline'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {branch.name}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs text-gray-500 leading-relaxed">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-xs text-gray-500">{branch.phone}</span>
                  </div>
                </div>

                {/* Select indicator */}
                <div className={`
                  mt-4 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                  ${selectedBranch === branch.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500'
                  }
                `}>
                  {selectedBranch === branch.id ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Terpilih
                    </>
                  ) : (
                    'Pilih Cabang'
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4">
        <p className="text-xs text-gray-400">
          © 2026 ColdStack — Nicky Frozen. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
