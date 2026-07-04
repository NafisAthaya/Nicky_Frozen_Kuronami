<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SesiKasir;
use Illuminate\Http\Request;

class SesiKasirController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'waktu_tutup' => 'required|date',
            'saldo_awal' => 'required|numeric',
            'total_penjualan' => 'required|numeric',
            'total_pengeluaran' => 'required|numeric',
            'saldo_akhir_sistem' => 'required|numeric',
            'saldo_aktual' => 'required|numeric',
            'selisih' => 'required|numeric',
            'catatan' => 'nullable|string',
            'nama_shift' => 'nullable|string',
        ]);

        $user = $request->user();

        $sesi = SesiKasir::create([
            'user_id' => $user ? $user->id : 1,
            'cabang_id' => ($user && $user->cabang_id) ? $user->cabang_id : 1,
            'nama_shift' => $request->nama_shift,
            'waktu_mulai' => $request->waktu_buka ? \Carbon\Carbon::parse($request->waktu_buka) : now()->subHours(8), // fallback
            'waktu_selesai' => \Carbon\Carbon::parse($request->waktu_tutup),
            'tunai_sistem' => $request->saldo_akhir_sistem,
            'tunai_laci' => $request->saldo_aktual,
            'selisih' => $request->selisih,
            'status' => 'selesai',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan shift berhasil disimpan',
            'data' => $sesi
        ], 201);
    }
}
