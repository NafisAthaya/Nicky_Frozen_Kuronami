<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Wajib ditambahkan
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'kasir') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Fitur ini khusus Owner dan Manager.'
            ], 403);
        }

        $bulanIni = Carbon::now()->month;
        $tahunIni = Carbon::now()->year;

        // Owner melihat SEMUA transaksi dari SEMUA cabang
        $totalPendapatan = Transaksi::where('status', 'berhasil')
            ->whereMonth('created_at', $bulanIni)
            ->whereYear('created_at', $tahunIni)
            ->sum('total_tagihan');

        $totalPengeluaran = Pengeluaran::whereMonth('tanggal', $bulanIni)
            ->whereYear('tanggal', $tahunIni)
            ->sum('nominal');

        $labaBersih = $totalPendapatan - $totalPengeluaran;

        $jumlahTransaksi = Transaksi::where('status', 'berhasil')
            ->whereMonth('created_at', $bulanIni)
            ->whereYear('created_at', $tahunIni)
            ->count();

        // Produk Terlaris Bulan Ini (dari semua cabang)
        $produkTerlaris = DB::table('detail_transaksis')
            ->join('transaksis', 'detail_transaksis.transaksi_id', '=', 'transaksis.id')
            ->join('produks', 'detail_transaksis.produk_id', '=', 'produks.id')
            ->where('transaksis.status', 'berhasil')
            ->whereMonth('transaksis.created_at', $bulanIni)
            ->whereYear('transaksis.created_at', $tahunIni)
            ->select('produks.nama_produk as name', 'produks.image as image', DB::raw('SUM(detail_transaksis.qty) as total_sold'))
            ->groupBy('produks.id', 'produks.nama_produk', 'produks.image')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // Grafik Penjualan Mingguan berdasarkan Kalender Asli (Senin-Minggu)
        $grafikMingguan = [];
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        
        // Hitung minggu berdasarkan kalender asli (7 hari per minggu)
        $weekStart = $startOfMonth->copy();
        $weekNumber = 1;
        
        while ($weekStart->lte($endOfMonth) && $weekNumber <= 5) {
            $weekEnd = $weekStart->copy()->addDays(6);
            // Jangan melewati akhir bulan
            if ($weekEnd->gt($endOfMonth)) {
                $weekEnd = $endOfMonth->copy();
            }

            $totalMingguIni = Transaksi::where('status', 'berhasil')
                ->whereBetween('created_at', [
                    $weekStart->startOfDay(),
                    $weekEnd->endOfDay()
                ])
                ->sum('total_tagihan');

            $grafikMingguan[] = [
                'week' => 'Minggu ' . $weekNumber,
                'total' => (float) $totalMingguIni,
                'range' => $weekStart->format('d') . '-' . $weekEnd->format('d M'),
            ];

            $weekStart = $weekEnd->copy()->addDay();
            $weekNumber++;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil mengambil data rekap bulanan',
            'data' => [
                'periode' => Carbon::now()->translatedFormat('F Y'),
                'total_pendapatan' => $totalPendapatan,
                'total_pengeluaran' => $totalPengeluaran,
                'laba_bersih' => $labaBersih,
                'jumlah_transaksi_sukses' => $jumlahTransaksi,
                'produk_terlaris' => $produkTerlaris,
                'grafik_mingguan' => $grafikMingguan
            ]
        ], 200);
    }
}