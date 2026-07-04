<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;

class PengeluaranController extends Controller
{
    public function index(Request $request)
    {
        $query = Pengeluaran::latest();

        if ($request->user()) {
            $query->where('cabang_id', $request->user()->cabang_id);
            
            // Filter expenses for the current shift only if user is kasir
            if ($request->user()->role === 'kasir') {
                $lastSesi = \App\Models\SesiKasir::where('cabang_id', $request->user()->cabang_id)
                    ->where('status', 'selesai')
                    ->latest('waktu_selesai')
                    ->first();
                    
                if ($lastSesi) {
                    $query->where('created_at', '>', $lastSesi->waktu_selesai);
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->get(),
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori' => 'required|string',
            'nama_biaya' => 'required|string',
            'nominal' => 'required|numeric|min:1',
        ]);

        $user = $request->user();

        $pengeluaran = Pengeluaran::create([
            'cabang_id' => $user ? $user->cabang_id : 1,
            'user_id' => $user ? $user->id : 1,
            'kategori' => $request->kategori,
            'nama_biaya' => $request->nama_biaya,
            'nominal' => $request->nominal,
            'tanggal' => $request->tanggal ?? now()->toDateString(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data pengeluaran berhasil disimpan',
            'data' => $pengeluaran,
        ], 201);
    }
}