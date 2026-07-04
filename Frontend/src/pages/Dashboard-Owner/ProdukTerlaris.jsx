import { useNavigate } from 'react-router-dom';

const topProductsList = [
  {
    id: 1,
    name: 'Sosis Sapi Premium (1kg)',
    category: 'Frozen Foods',
    qty: '1.240 Unit',
    growth: '+15%',
    progress: 'w-full', // 100%
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=80&q=80',
  },
  {
    id: 2,
    name: 'Bakso Ayam Super (500g)',
    category: 'Frozen Foods',
    qty: '982 Unit',
    growth: '+8%',
    progress: 'w-[79%]', // 79%
    image: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?auto=format&fit=crop&w=80&q=80',
  },
  {
    id: 3,
    name: 'Nugget Ayam Premium',
    category: 'Frozen Foods',
    qty: '854 Unit',
    growth: '+12%',
    progress: 'w-[69%]', // 69%
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=80&q=80',
  },
  {
    id: 4,
    name: 'Sosis Sapi Bakar 1kg',
    category: 'Frozen Foods',
    qty: '720 Unit',
    growth: '+5%',
    progress: 'w-[58%]', // 58%
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=80&q=80',
  },
  {
    id: 5,
    name: 'Sayuran Campuran (Mix)',
    category: 'Vegetables',
    qty: '645 Unit',
    growth: '+2%',
    progress: 'w-[52%]', // 52%
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=80&q=80',
  },
];

export default function ProdukTerlaris() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="animate-fadeIn w-full pb-10">
      {/* Back & Title Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Back link */}
          <button 
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors mb-3 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Produk Terlaris</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau performa inventori terbaik Anda berdasarkan volume penjualan tertinggi.</p>
        </div>

        {/* Download Button */}
        <div>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#0A2540] text-white text-xs font-black rounded-xl hover:bg-[#0d2f52] transition-all shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Laporan
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Total Unit Terjual</p>
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">12.480</h2>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                10.4%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">vs. bulan sebelumnya</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Produk Paling Stabil</p>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nugget</h2>
            <p className="text-[10px] text-slate-450 mt-2 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full inline-block">
              Fluktuasi ±2% bulanan
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Kategori Terpopuler</p>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Daging Olahan</h2>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              <span className="font-bold text-slate-600">45%</span> dari total transaksi
            </p>
          </div>
        </div>
      </div>

      {/* Top 5 Products Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-6">Top 5 Produk</h3>
        
        <div className="space-y-6">
          {topProductsList.map((prod, idx) => (
            <div key={prod.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Product Info (Left) */}
              <div className="flex items-center gap-3 md:w-64 shrink-0">
                {/* Ranking number badge */}
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-black flex items-center justify-center shrink-0 border border-blue-100">
                  {idx + 1}
                </span>
                
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-100"
                />
                
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{prod.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{prod.category}</p>
                </div>
              </div>

              {/* Progress Bar (Center) */}
              <div className="flex-1 min-w-0 h-4 bg-slate-50 border border-slate-100 rounded-full overflow-hidden relative self-center">
                <div className={`h-full bg-blue-600 rounded-full ${prod.progress} transition-all duration-500`} />
              </div>

              {/* Quantity Details (Right) */}
              <div className="flex items-center justify-end gap-3 md:w-36 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-black text-slate-800">{prod.qty}</p>
                  <span className="text-[9px] font-bold text-green-600 mt-0.5 block">{prod.growth} dari bulan lalu</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
