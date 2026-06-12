import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const stats = [
  {
    id: 1,
    title: 'TOTAL UANG MASUK',
    value: 'Rp 1.450.280.000',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 2,
    title: 'LABA BERSIH',
    value: 'Rp 482.150.000',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'bg-amber-50 text-amber-500',
  },
  {
    id: 3,
    title: 'JUMLAH NOTA TERJUAL',
    value: '45.281 Order',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600',
  },
];

const bestProducts = [
  {
    id: 1,
    name: 'Nugget Ayam Premium',
    sold: 'Sold: 4.2k items',
    growth: '+18%',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=80&q=80',
  },
  {
    id: 2,
    name: 'Bakso Sapi Super',
    sold: 'Sold: 3.8k items',
    growth: '+12%',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=80&q=80',
  },
  {
    id: 3,
    name: 'Sosis Bratwurst Jumbo',
    sold: 'Sold: 2.3k items',
    growth: '+5%',
    image: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?auto=format&fit=crop&w=80&q=80',
  },
];

const chartWeeks = [
  { week: 'Minggu 1', sudirman: 240, margonda: 180 },
  { week: 'Minggu 2', sudirman: 290, margonda: 210 },
  { week: 'Minggu 3', sudirman: 260, margonda: 190 },
  { week: 'Minggu 4', sudirman: 410, margonda: 225 },
];

export default function Beranda() {
  const navigate = useNavigate();
  const [hoveredWeek, setHoveredWeek] = useState(null);

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map X coordinate to week index
    // Chart content width goes from x=60 to x=540 (total width = 600)
    const chartWidth = 480;
    const offsetLeft = 60;
    const clickX = x - offsetLeft;
    
    if (clickX >= 0 && clickX <= chartWidth) {
      const index = Math.round((clickX / chartWidth) * 3);
      if (index >= 0 && index <= 3) {
        setHoveredWeek(index);
        setTooltipPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top - 40 });
      }
    } else {
      setHoveredWeek(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredWeek(null);
  };

  return (
    <div className="animate-fadeIn p-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Performa</h1>
        <p className="text-sm text-slate-500 mt-1">Pantau kinerja real-time seluruh unit bisnis Anda.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">{stat.title}</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & Best Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Perbandingan Penjualan Tiap Cabang</h3>
              <p className="text-xs text-slate-400 mt-0.5">Data performa mingguan akumulatif</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Sudirman</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Margonda</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div 
            className="relative h-64 w-full cursor-crosshair select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <svg viewBox="0 0 600 240" className="w-full h-full">
              {/* Gridlines */}
              <line x1="60" y1="30" x2="540" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="60" y1="90" x2="540" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="60" y1="150" x2="540" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="60" y1="210" x2="540" y2="210" stroke="#e2e8f0" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="45" y="34" className="text-[10px] font-bold text-slate-400" textAnchor="end">Rp 600jt</text>
              <text x="45" y="94" className="text-[10px] font-bold text-slate-400" textAnchor="end">Rp 400jt</text>
              <text x="45" y="154" className="text-[10px] font-bold text-slate-400" textAnchor="end">Rp 200jt</text>
              <text x="45" y="214" className="text-[10px] font-bold text-slate-400" textAnchor="end">Rp 0</text>

              {/* X Axis Labels */}
              <text x="60" y="234" className="text-[10px] font-bold text-slate-400" textAnchor="middle">Minggu 1</text>
              <text x="220" y="234" className="text-[10px] font-bold text-slate-400" textAnchor="middle">Minggu 2</text>
              <text x="380" y="234" className="text-[10px] font-bold text-slate-400" textAnchor="middle">Minggu 3</text>
              <text x="540" y="234" className="text-[10px] font-bold text-slate-400" textAnchor="middle">Minggu 4</text>

              {/* Sudirman Line (Blue) - Values: W1:240, W2:290, W3:260, W4:410 */}
              {/* Formula to map value to Y coordinate: y = 210 - (val / 600) * 180 */}
              {/* W1: 210 - 72 = 138, W2: 210 - 87 = 123, W3: 210 - 78 = 132, W4: 210 - 123 = 87 */}
              <path 
                d="M 60 138 C 140 128, 140 118, 220 123 C 300 128, 300 142, 380 132 C 460 122, 460 87, 540 87" 
                fill="none" 
                stroke="#1d4ed8" 
                strokeWidth="4" 
                strokeLinecap="round"
              />

              {/* Margonda Line (Yellow) - Values: W1:180, W2:210, W3:190, W4:225 */}
              {/* W1: 210 - 54 = 156, W2: 210 - 63 = 147, W3: 210 - 57 = 153, W4: 210 - 67.5 = 142.5 */}
              <path 
                d="M 60 156 C 140 151, 140 142, 220 147 C 300 152, 300 158, 380 153 C 460 148, 460 142.5, 540 142.5" 
                fill="none" 
                stroke="#d97706" 
                strokeWidth="4" 
                strokeLinecap="round"
              />

              {/* Active Hover Column vertical line */}
              {hoveredWeek !== null && (
                <line 
                  x1={60 + hoveredWeek * 160} 
                  y1="30" 
                  x2={60 + hoveredWeek * 160} 
                  y2="210" 
                  stroke="#94a3b8" 
                  strokeWidth="1.5" 
                  strokeDasharray="4"
                />
              )}

              {/* Points on lines */}
              {chartWeeks.map((w, idx) => {
                const sx = 60 + idx * 160;
                // coords calculated above
                const sy = [138, 123, 132, 87][idx];
                const my = [156, 147, 153, 142.5][idx];
                return (
                  <g key={idx}>
                    {/* Sudirman point */}
                    <circle 
                      cx={sx} 
                      cy={sy} 
                      r={hoveredWeek === idx ? "7" : "4"} 
                      fill="#1d4ed8" 
                      stroke="#ffffff" 
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                    {/* Margonda point */}
                    <circle 
                      cx={sx} 
                      cy={my} 
                      r={hoveredWeek === idx ? "7" : "4"} 
                      fill="#d97706" 
                      stroke="#ffffff" 
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom Interactive HTML Tooltip */}
            {hoveredWeek !== null && (
              <div 
                className="absolute bg-slate-900 text-white rounded-xl shadow-xl p-3 text-xs z-30 pointer-events-none transition-all duration-100 flex flex-col gap-1.5 border border-slate-750"
                style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
              >
                <p className="font-bold text-slate-300">{chartWeeks[hoveredWeek].week}</p>
                <div className="h-px bg-slate-800 my-0.5" />
                <div className="flex items-center justify-between gap-6">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Sudirman
                  </span>
                  <span className="font-bold">Rp {chartWeeks[hoveredWeek].sudirman}.000.000</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Margonda
                  </span>
                  <span className="font-bold">Rp {chartWeeks[hoveredWeek].margonda}.000.000</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#0A2540] rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold tracking-tight">Produk Terlaris</h3>
              <button className="text-white opacity-70 hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M12 12a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0-14a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {bestProducts.map((prod) => (
                <div key={prod.id} className="bg-[#122e4c] rounded-xl p-3 flex items-center justify-between hover:bg-[#18395d] transition-colors">
                  <div className="flex items-center gap-3">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-11 h-11 object-cover rounded-lg shrink-0 border border-slate-700"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{prod.sold}</p>
                    </div>
                  </div>
                  <span className="bg-[#F26F21] text-white text-[10px] font-black px-2 py-1 rounded-lg">
                    {prod.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Button */}
          <button 
            onClick={() => navigate('/dashboard/produk-terlaris')}
            className="mt-8 w-full bg-[#F26F21] hover:bg-[#ff7b2b] text-white text-xs font-black py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
          >
            Lihat Semua Laporan
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

        </div>

      </div>
    </div>
  );
}
