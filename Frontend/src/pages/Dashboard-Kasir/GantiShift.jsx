import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios';
import useAuthStore from '../../store/authStore';
import {
  HiOutlineRefresh,
  HiOutlineCash,
  HiOutlineDocumentReport,
  HiOutlineCheckCircle,
  HiOutlinePrinter,
  HiOutlineX,
  HiOutlineCreditCard,
  HiOutlineQrcode,
} from 'react-icons/hi';

function formatRupiah(num) {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
}

function getFormattedDate() {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const now = new Date();
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

export default function GantiShift() {
  const [uangLaci, setUangLaci] = useState('');
  const [showLaporan, setShowLaporan] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const shiftName = localStorage.getItem('shift') || 'Shift 1';
  let loginTime = localStorage.getItem('loginTime');
  if (!loginTime || loginTime === 'undefined' || loginTime === 'null') {
    loginTime = new Date().toISOString();
  }

  useEffect(() => {
    loadData();

    const handleGlobalSync = () => loadData();
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, []);
  const loadData = async () => {
  try {
    const trxResponse = await axiosInstance.get('/kasir/transaksi');
    const trxData = trxResponse.data.data || trxResponse.data;

    const pengeluaranResponse = await axiosInstance.get('/kasir/pengeluaran');
    const pengeluaranData = pengeluaranResponse.data.data || pengeluaranResponse.data;

    setTransactions(trxData);

    setExpenses(
      pengeluaranData.map((item) => ({
        nominal: Number(item.nominal),
        nama: item.nama_biaya,
      }))
    );
  } catch (error) {
    console.error(error);
  }
};

  // ═══ Calculate transaction totals by payment method ═══
  const totalTunai = useMemo(() => {
    return transactions
      .filter((t) => t.metode_pembayaran === 'tunai')
      .reduce((sum, t) => sum + Number(t.total_tagihan), 0);
  }, [transactions]);

  const totalDebit = useMemo(() => {
    return transactions
      .filter((t) => t.metode_pembayaran === 'debit')
      .reduce((sum, t) => sum + Number(t.total_tagihan), 0);
  }, [transactions]);

  const totalQris = useMemo(() => {
    return transactions
      .filter((t) => t.metode_pembayaran === 'qris')
      .reduce((sum, t) => sum + Number(t.total_tagihan), 0);
  }, [transactions]);

  const totalPenjualan = totalTunai + totalDebit + totalQris;

  const jumlahTransaksiTunai = useMemo(() => {
    return transactions.filter((t) => t.metode_pembayaran === 'tunai').length;
  }, [transactions]);

  const jumlahTransaksiDebit = useMemo(() => {
    return transactions.filter((t) => t.metode_pembayaran === 'debit').length;
  }, [transactions]);

  const jumlahTransaksiQris = useMemo(() => {
    return transactions.filter((t) => t.metode_pembayaran === 'qris').length;
  }, [transactions]);

  const jumlahTransaksiTotal = transactions.length;

  // ═══ Total pengeluaran ═══
  const totalPengeluaran = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.nominal || e.amount || 0), 0);
  }, [expenses]);

  const expectedCash = totalTunai - totalPengeluaran;

  // ═══ Net total ═══
  const totalBersih = totalPenjualan - totalPengeluaran;

  // ═══ Parse input ═══
  const parsedUangLaci = parseFloat((uangLaci || '0').replace(/[^0-9]/g, '')) || 0;
  const selisih = parsedUangLaci - expectedCash;

  const displayUangLaci = uangLaci
    ? parseInt(uangLaci.replace(/[^0-9]/g, ''), 10).toLocaleString('id-ID')
    : '';

  const handleUangLaciChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setUangLaci(raw);
  };

  const handleSelesaikan = () => {
    setShowLaporan(true);
  };

  const handleBatal = () => {
    setUangLaci('');
  };

  const handleSelesaiKeluar = async () => {
    // Save to backend
    try {

      const payload = {
        waktu_tutup: new Date().toISOString(),
        waktu_buka: loginTime,
        nama_shift: shiftName,
        saldo_awal: 0, // Should be fetched from previous session ideally
        total_penjualan: totalPenjualan,
        total_pengeluaran: totalPengeluaran,
        saldo_akhir_sistem: expectedCash,
        saldo_aktual: parsedUangLaci,
        selisih: selisih,
        catatan: ''
      };

      const res = await axiosInstance.post('/kasir/sesi-kasir', {
        ...payload,
        status: 'tutup',
      });
      const data = res.data;
      
      if (data.status === 'success') {
        setShowLaporan(false);
        setUangLaci('');
        // clear localStorage explicitly
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        
        // redirect to login or show success message
        const logout = useAuthStore.getState().logoutSuccess;
        if(logout) logout();
        window.location.href = '/';
      } else {
        toast.error(data.message || 'Gagal menyimpan laporan shift');
      }
    } catch (err) {
      console.error(err);
      
      const statusCode = err.response?.status;
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat menutup shift';

      if (statusCode === 401) {
        toast.error('Sesi kamu telah berakhir. Silakan login kembali.');
        // Auto logout
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        const logout = useAuthStore.getState().logoutSuccess;
        if (logout) logout();
        setTimeout(() => window.location.href = '/', 1500);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handlePrintLaporan = () => {
    window.print();
  };

  return (
    <div
  id="ganti-shift-page"
  className="flex flex-col min-h-screen p-8 overflow-y-auto"
>
      <h1 className="text-3xl font-bold text-[#082B7A] mb-6">
  Ganti Shift
</h1>

      {/* Shift Info Card */}
      <div
  id="gs-card"
  className="bg-white rounded-3xl border border-gray-200 shadow-md p-8 max-w-6xl w-full"
>
        {/* Shift Header */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">
              <HiOutlineRefresh />
            </div>
            <div>
              <h2>Shift Berakhir</h2>
              <p>Kasir: {user.name || 'Kasir'} • {shiftName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 font-semibold">TANGGAL</span>
            <span className="font-bold text-gray-800">{getFormattedDate()}</span>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
              <HiOutlineCash />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 font-semibold">Total Transaksi</span>
              <span className="text-xl font-bold text-gray-900">{jumlahTransaksiTotal}</span>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl">
              <HiOutlineDocumentReport />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 font-semibold">Total Penjualan</span>
              <span className="text-xl font-bold text-gray-900">{formatRupiah(totalPenjualan)}</span>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <HiOutlineCash />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 font-semibold">Total Pengeluaran</span>
              <span className="text-xl font-bold text-red-600">- {formatRupiah(totalPengeluaran)}</span>
            </div>
          </div>
        </div>

        {/* Two Column: Expected vs Actual */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left: Per Metode Pembayaran */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <div className="mb-5">
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Rincian Per Metode Pembayaran</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <HiOutlineCash className="text-blue-600 text-xl" />
                  <span>Tunai</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-xs text-gray-500">{jumlahTransaksiTunai} transaksi</span>
                  <strong>{formatRupiah(totalTunai)}</strong>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <HiOutlineCreditCard className="text-green-600 text-xl" />
                  <span>Kartu Debit</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-xs text-gray-500">{jumlahTransaksiDebit} transaksi</span>
                  <strong>{formatRupiah(totalDebit)}</strong>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <HiOutlineQrcode className="text-purple-600 text-xl" />
                  <span>QRIS</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-xs text-gray-500">{jumlahTransaksiQris} transaksi</span>
                  <strong>{formatRupiah(totalQris)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Uang Tunai di Laci */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <div className="mb-5">
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Uang Tunai di Laci</span>
                <span className="text-xs text-gray-500">(Actual)</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                <HiOutlineCash />
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Tunai Sistem (Expected)</span>
              <span className="font-bold text-lg">
                {formatRupiah(expectedCash)}
              </span>
            </div>

            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input
                type="text"
                id="uang-laci-input"
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 outline-none focus:border-blue-500"
                value={displayUangLaci}
                onChange={handleUangLaciChange}
                placeholder="Masukkan jumlah uang di laci"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Selisih</span>
              <span
                className={`font-bold ${
                selisih === 0
                    ? 'text-green-600'
                    : selisih > 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`}
              >
                {selisih === 0 ? 'Seimbang' : (selisih > 0 ? '+' : '-') + ' ' + formatRupiah(Math.abs(selisih))}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100" id="gs-btn-batal" onClick={handleBatal}>
            Batal
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition" id="gs-btn-selesai" onClick={handleSelesaikan}>
            <HiOutlineDocumentReport className="text-lg" />
            Selesaikan Shift & Cetak Laporan
          </button>
        </div>
      </div>

      {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-6">
        © 2026 Nicky Frozen. All rights reserved.
        </div>

      {/* ===== Laporan Popup Modal ===== */}
      {showLaporan && (
        <div
  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[500]"
  id="gs-overlay"
  onClick={() => setShowLaporan(false)}
>
          <div
  className="w-[450px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-8 shadow-2xl relative"
  onClick={(e) => e.stopPropagation()}
>
            {/* Close Button */}
            <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500" onClick={() => setShowLaporan(false)}>
              <HiOutlineX />
            </button>

            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl">
              <HiOutlineCheckCircle />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900">Laporan Berhasil Dicetak</h2>
            <p className="text-sm text-gray-500 text-center mt-2 mb-6">
              Silakan serahkan laporan beserta uang tunai ke brankas.
            </p>

            {/* Receipt Card */}
            <div
  id="gs-receipt"
  className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
>
              {/* Receipt Header */}
              <div className="p-5 text-center border-b border-dashed border-gray-300 flex flex-col gap-1">
                <strong>Nicky Frozen - Cabang Utama</strong>
                <span>LAPORAN TUTUP SHIFT</span>
                <span>{getFormattedDate()}</span>
              </div>

              {/* Receipt Kasir Info */}
              <div className="p-4 flex justify-between border-b border-dashed border-gray-300">
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Kasir</span>
                  <strong>{user.name || 'Kasir'}</strong>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-gray-400 mb-1">Shift</span>
                  <strong>{shiftName}</strong>
                </div>
              </div>

              {/* Ringkasan Kasir */}
              <div className="p-4 border-b border-dashed border-gray-300">
                <span className="block text-xs font-bold text-gray-500 uppercase mb-3">RINGKASAN KASIR</span>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Tunai (Sistem)</span>
                  <span>{formatRupiah(expectedCash)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Tunai (Laci)</span>
                  <span>{formatRupiah(parsedUangLaci)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Selisih</span>
                  <div className="flex items-center gap-2">
                    {selisih === 0 && <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold">Aman</span>}
                    <span
                    className={
                        selisih === 0
                        ? 'text-green-600 font-semibold'
                        : selisih > 0
                        ? 'text-blue-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                    >
                      {formatRupiah(Math.abs(selisih))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rincian Penjualan */}
              <div className="p-4 border-b border-dashed border-gray-300">
                <span className="block text-xs font-bold text-gray-500 uppercase mb-3">RINCIAN PENJUALAN</span>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Penjualan Tunai ({jumlahTransaksiTunai} trx)</span>
                  <span>{formatRupiah(totalTunai)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Penjualan Debit ({jumlahTransaksiDebit} trx)</span>
                  <span>{formatRupiah(totalDebit)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Penjualan QRIS ({jumlahTransaksiQris} trx)</span>
                  <span>{formatRupiah(totalQris)}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 font-bold">
                  <span>Total Penjualan ({jumlahTransaksiTotal} trx)</span>
                  <strong>{formatRupiah(totalPenjualan)}</strong>
                </div>
              </div>

              {/* Rincian Pengeluaran */}
              <div className="p-4 border-b border-dashed border-gray-300">
                <span className="block text-xs font-bold text-gray-500 uppercase mb-3">RINCIAN PENGELUARAN</span>
                {expenses.length > 0 ? (
                  <>
                    {expenses.map((exp, idx) => (
                      <div className="flex justify-between items-center text-sm mb-2" key={idx}>
                        <span>{exp.nama || exp.name || 'Pengeluaran'}</span>
                        <span className="text-red-600">- {formatRupiah(exp.nominal || exp.amount || 0)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 font-bold">
                      <span>Total Pengeluaran</span>
                      <strong className="text-red-600">- {formatRupiah(totalPengeluaran)}</strong>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-400 italic">Tidak ada pengeluaran</span>
                  </div>
                )}
              </div>

              {/* Total Bersih */}
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>TOTAL BERSIH</span>
                  <strong>{formatRupiah(totalBersih)}</strong>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button className="w-12 h-12 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-100" id="gs-btn-print" onClick={handlePrintLaporan}>
                <HiOutlinePrinter />
              </button>
              <button className="flex-1 h-12 rounded-xl bg-[#082B7A] text-white font-semibold hover:bg-[#0B3B91]" id="gs-btn-keluar" onClick={handleSelesaiKeluar}>
                Selesai & Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
