import { useState, useEffect } from 'react';

import {
  HiOutlineCash,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

  function formatRupiah(num) {
    if (num === 0) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  function getTimeString() {
    return new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getBadge(nama) {
    return nama.charAt(0).toUpperCase();
  }

  function getBadgeColor(nama) {
    const text = nama.toLowerCase();

    if (text.includes("parkir"))
      return "bg-blue-100 text-blue-700";

    if (text.includes("perbaikan"))
      return "bg-orange-100 text-orange-700";

    if (text.includes("tisu"))
      return "bg-green-100 text-green-700";

    if (text.includes("listrik"))
      return "bg-yellow-100 text-yellow-700";

    if (text.includes("air"))
      return "bg-cyan-100 text-cyan-700";

    if (text.includes("internet"))
      return "bg-purple-100 text-purple-700";

    return "bg-gray-100 text-gray-700";
  }

export default function Pengeluaran() {
  const [namaBiaya, setNamaBiaya] = useState('');
  const [nominal, setNominal] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const loadExpenses = async () => {
  try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/pengeluaran'
    );

    const data = await response.json();

    const mapped = data.map((item) => ({
      id: item.id,
      nama: item.nama_biaya,
      nominal: Number(item.nominal),
      kategori: item.kategori,
      waktu: new Date(item.created_at).toLocaleTimeString(
        'id-ID',
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      ),
      kasir: 'Minji',
    }));

    setExpenses(mapped);
  } catch (error) {
    console.error(error);
  }
};

  // Calculate total
  const totalPengeluaran = expenses.reduce((sum, item) => sum + item.nominal, 0);

  useEffect(() => {
  loadExpenses();
}, []);

  // Auto-hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async () => {
    const num = parseFloat(nominal.replace(/[^0-9]/g, ''));
    if (!namaBiaya.trim()) {
      alert('Masukkan nama biaya terlebih dahulu.');
      return;
    }
    if (isNaN(num) || num <= 0) {
      alert('Masukkan nominal yang valid.');
      return;
    }

    // Determine category based on keywords
    let kategori = 'lainnya';
    const lower = namaBiaya.toLowerCase();
    if (lower.includes('parkir') || lower.includes('lakban') || lower.includes('sampah') || lower.includes('operasional')) {
      kategori = 'operasional';
    } else if (lower.includes('makan') || lower.includes('minum') || lower.includes('galon') || lower.includes('es krim') || lower.includes('konsumsi')) {
      kategori = 'konsumsi';
    } else if (lower.includes('kurir') || lower.includes('ongkir') || lower.includes('transport')) {
      kategori = 'transportasi';
    }

try {
  const response = await fetch(
    'http://127.0.0.1:8000/api/pengeluaran',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kategori,
        nama_biaya: namaBiaya.trim(),
        nominal: num,
      }),
    }
  );

  const result = await response.json();

  if (result.success) {
    await loadExpenses();
  }
} catch (error) {
  console.error(error);
}

    setNamaBiaya('');
    setNominal('');
    setShowToast(true);
  };

  // Format nominal input with thousand separator
  const handleNominalChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setNominal(raw);
  };

  const displayNominal = nominal
    ? parseInt(nominal, 10).toLocaleString('id-ID')
    : '';

  // Time-ago helper
  const getTimeAgo = (waktu) => {
    const now = new Date();
    const [h, m] = waktu.split(':').map(Number);
    const entryTime = new Date();
    entryTime.setHours(h, m, 0, 0);
    const diffMs = now - entryTime;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    return waktu;
  };

  // Capitalize first letter of category
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
  id="pengeluaran-page"
  className="flex flex-col h-full p-6 overflow-hidden relative"
>
      {/* Success Toast */}
      {showToast && (
        <div
        id="pengeluaran-toast"
        className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-semibold shadow-lg z-[200]"
        >
          <HiOutlineCheckCircle className="text-xl text-green-500" />
          <span>Pengeluaran berhasil dicatat</span>
        </div>
      )}

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Left Panel - Input Pengeluaran */}
        <div
        id="pengeluaran-input-panel"
        className="w-[300px] shrink-0 flex flex-col gap-5"
        >
          <h2 className="text-xl font-bold text-gray-900">Input Pengeluaran</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600" htmlFor="nama-biaya">
            Nama Biaya
        </label>

        <input
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="text"
            id="nama-biaya"
            value={namaBiaya}
            onChange={(e) => setNamaBiaya(e.target.value)}
            placeholder="Contoh: Bayar Parkir"
        />
        </div>

          <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600" htmlFor="nominal-input">
            Nominal (Rp)
        </label>

        <input
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="text"
            id="nominal-input"
            value={displayNominal}
            onChange={handleNominalChange}
            placeholder="0"
        />
        </div>

          <button
            className="flex items-center justify-center gap-2 py-3 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition"
            id="btn-ambil-laci"
            onClick={handleSubmit}
          >
            <HiOutlineCash className="text-lg" />
            Ambil dari Laci
          </button>
        </div>

        {/* Right Panel - Riwayat Hari Ini */}
        <div
        className="flex-1 flex flex-col overflow-hidden" id="pengeluaran-riwayat-panel">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Riwayat Hari Ini</h2>
            <div
            className="text-sm text-gray-500" id="riwayat-total">
              Total: <strong className="text-gray-900">{formatRupiah(totalPengeluaran)}</strong>
            </div>
          </div>

          {expenses.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
              <HiOutlineCash className="text-6xl opacity-40" />
              <p>Belum ada pengeluaran hari ini</p>
              <p className="text-sm opacity-70">Input pengeluaran dari panel sebelah kiri</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {expenses.map((item) => {

                return (
                  <div
                    className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl mb-3 hover:shadow-md transition" key={item.id} id={`riwayat-item-${item.id}`}>
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${getBadgeColor(item.nama)}`}
                      >
                        {getBadge(item.nama)}
                      </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 truncate">{item.nama}</span>
                      <span className="text-xs text-gray-500">
                        {capitalizeFirst(item.kategori)} • {getTimeAgo(item.waktu)}
                      </span>
                    </div>

                    <div className="text-right shrink-0 flex flex-col">
                      <span className="text-sm font-bold text-red-500">
                        - {formatRupiah(item.nominal)}
                      </span>
                      <span className="text-xs text-gray-500">Kasir: {item.kasir}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 text-xs text-gray-400">
        © 2026 Nicky Frozen. All rights reserved.
      </div>
    </div>
  );
}
