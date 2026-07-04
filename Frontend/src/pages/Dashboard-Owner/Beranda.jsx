import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

export default function Beranda() {
  const navigate = useNavigate();
  
  const [apiData, setApiData] = useState({
    total_pendapatan: 0,
    laba_bersih: 0,
    jumlah_transaksi_sukses: 0,
    produk_terlaris: [],
    grafik_mingguan: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const [hoveredWeek, setHoveredWeek] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Format full Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  // Format singkat untuk Y-Axis Chart (Contoh: Rp 10.5Jt)
  const formatShortRupiah = (angka) => {
    if (angka >= 1000000) return `Rp ${(angka / 1000000).toFixed(1)}Jt`;
    if (angka >= 1000) return `Rp ${(angka / 1000).toFixed(0)}Rb`;
    return `Rp ${angka}`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/owner/dashboard/stats');
        const resData = response.data.data || response.data;
        setApiData(resData);
      } catch (error) {
        console.error("Gagal mengambil data dasbor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();

    // Sinkronisasi Global
    const handleGlobalSync = () => fetchDashboardData();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);

  const stats = [
    {
      id: 1, title: 'TOTAL UANG MASUK', value: isLoading ? 'Memuat...' : formatRupiah(apiData.total_pendapatan),
      icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>), color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 2, title: 'LABA BERSIH', value: isLoading ? 'Memuat...' : formatRupiah(apiData.laba_bersih),
      icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>), color: 'bg-amber-50 text-amber-500',
    },
    {
      id: 3, title: 'JUMLAH NOTA TERJUAL', value: isLoading ? 'Memuat...' : `${apiData.jumlah_transaksi_sukses} Order`,
      icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>), color: 'bg-blue-50 text-blue-600',
    },
  ];

  const dynamicTopProducts = apiData.produk_terlaris.map((item, idx) => ({
    id: idx + 1,
    name: item.name,
    sold: `Terjual: ${item.total_sold} pcs`,
    growth: 'Aktif',
    image: item.image ? `http://127.0.0.1:8000/storage/produk/${item.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff&bold=true` 
  }));

  // --- LOGIKA PERHITUNGAN CHART MATEMATIS ---
  const dynamicChartWeeks = apiData.grafik_mingguan.length > 0 
    ? apiData.grafik_mingguan 
    : [{ week: 'Minggu 1', total: 0 }, { week: 'Minggu 2', total: 0 }, { week: 'Minggu 3', total: 0 }, { week: 'Minggu 4', total: 0 }];

  const maxChartValue = Math.max(...dynamicChartWeeks.map(w => w.total), 100000);

  const chartPoints = dynamicChartWeeks.map((week, index) => {
    const x = 60 + index * (480 / Math.max(dynamicChartWeeks.length - 1, 1)); 
    const y = 210 - (week.total / maxChartValue) * 180; 
    return { x, y, total: week.total, weekName: week.week, range: week.range || '' };
  });

  const createSmoothPath = (points) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`; 
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2; 
      d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };
  // ------------------------------------------

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleX = 600 / rect.width;
    const svgX = mouseX * scaleX;

    const chartWidth = 480; 
    const offsetLeft = 60; 
    const clickX = svgX - offsetLeft;
    const numPoints = dynamicChartWeeks.length;
    
    if (clickX >= -40 && clickX <= chartWidth + 40 && numPoints > 1) {
      const index = Math.round((clickX / chartWidth) * (numPoints - 1));
      if (index >= 0 && index < numPoints) {
        setHoveredWeek(index);
        setTooltipPos({ x: mouseX + 15, y: mouseY - 40 });
      }
    } else {
      setHoveredWeek(null);
    }
  };

  return (
    <div className="animate-fadeIn w-full h-full">
      <div className="mb-8">
        <h1 className="text-[48px] font-bold text-[#0B3B91] leading-tight">Dashboard Performa</h1>
        {/* Teks diperjelas menjadi Performa Bulanan */}
        <p className="text-sm text-slate-500 mt-1">Ringkasan performa dan pendapatan selama bulan ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-[18px] border border-[#D9DCE7] p-6 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">{stat.title}</p>
              <h2 className={`text-[32px] font-bold text-[#08224A] ${isLoading ? 'animate-pulse text-gray-300' : ''}`}>
                {stat.value}
              </h2>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        
        {/* Sales Chart */}
        <div className="bg-white rounded-[18px] border border-[#D9DCE7] p-6 shadow-sm relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Perbandingan Penjualan Mingguan</h3>
              <p className="text-xs text-slate-400 mt-0.5">Grafik pergerakan omzet cabang bulan ini.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /><span>Cabang Aktif</span></div>
            </div>
          </div>

          <div className="relative h-64 w-full cursor-crosshair select-none" onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredWeek(null)}>
            <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
              <line x1="60" y1="30" x2="540" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="60" y1="90" x2="540" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="60" y1="150" x2="540" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="60" y1="210" x2="540" y2="210" stroke="#e2e8f0" strokeWidth="1" />
              
              <text x="45" y="34" className="text-[10px] font-bold text-slate-400" textAnchor="end">{formatShortRupiah(maxChartValue)}</text>
              <text x="45" y="94" className="text-[10px] font-bold text-slate-400" textAnchor="end">{formatShortRupiah(maxChartValue * 0.66)}</text>
              <text x="45" y="154" className="text-[10px] font-bold text-slate-400" textAnchor="end">{formatShortRupiah(maxChartValue * 0.33)}</text>
              <text x="45" y="214" className="text-[10px] font-bold text-slate-400" textAnchor="end">Rp 0</text>

              {chartPoints.map((pt, idx) => (
                <text key={idx} x={pt.x} y="234" className="text-[10px] font-bold text-slate-400" textAnchor="middle">{pt.weekName}</text>
              ))}

              <path 
                d={createSmoothPath(chartPoints)} 
                fill="none" 
                stroke="#1d4ed8" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />

              {hoveredWeek !== null && (
                <>
                  <line 
                    x1={chartPoints[hoveredWeek].x} y1="30" 
                    x2={chartPoints[hoveredWeek].x} y2="210" 
                    stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" 
                  />
                  <circle 
                    cx={chartPoints[hoveredWeek].x} 
                    cy={chartPoints[hoveredWeek].y} 
                    r="8" fill="#1d4ed8" stroke="#ffffff" strokeWidth="3" 
                    className="shadow-xl pointer-events-none"
                  />
                </>
              )}

              {chartPoints.map((pt, idx) => (
                <circle 
                  key={`pt-${idx}`} 
                  cx={pt.x} cy={pt.y} r="4" 
                  fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" 
                  className="pointer-events-none"
                />
              ))}
            </svg>

            {hoveredWeek !== null && chartPoints[hoveredWeek] && (
              <div className="absolute bg-slate-900 text-white rounded-xl shadow-xl p-3 text-xs z-30 pointer-events-none transition-all duration-100 flex flex-col gap-1.5 border border-slate-750" style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}>
                <p className="font-bold text-slate-300">{chartPoints[hoveredWeek].weekName}</p>
                {chartPoints[hoveredWeek].range && (
                  <p className="text-[10px] text-slate-400">{chartPoints[hoveredWeek].range}</p>
                )}
                <div className="h-px bg-slate-800 my-0.5" />
                <div className="flex items-center justify-between gap-6">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Pendapatan</span>
                  <span className="font-bold">{formatRupiah(chartPoints[hoveredWeek].total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#0B46B3] rounded-2xl p-6 text-white shadow-lg h-fit flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold tracking-tight">Produk Terlaris Bulan Ini</h3>
          </div>
          
          <div className="space-y-4 flex-1">
            {dynamicTopProducts.length > 0 ? (
              dynamicTopProducts.map((prod) => (
                <div key={prod.id} className="bg-[#2B5EC3] rounded-xl p-3 flex items-center justify-between hover:bg-[#3569cf] transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-11 h-11 object-cover rounded-lg shrink-0 border border-white/20" />
                    <div>
                      <p className="text-xs font-bold text-white">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{prod.sold}</p>
                    </div>
                  </div>
                  <span className="bg-[#FFB800] text-black text-[10px] font-black px-2 py-1 rounded-lg">
                    {prod.growth}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 bg-[#2B5EC3]/50 rounded-xl border border-white/10 border-dashed">
                <p className="text-sm text-blue-200">Belum ada transaksi bulan ini.</p>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/owner/laporan')} className="mt-8 w-full bg-[#FFB800] hover:bg-[#FFC633] text-black text-sm font-bold py-4 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
            Lihat Laporan
          </button>
        </div>

      </div>
    </div>
  );
}