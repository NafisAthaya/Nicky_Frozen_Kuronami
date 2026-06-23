<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;

class PengeluaranController extends Controller
{
    public function index()
    {
        return response()->json(
            Pengeluaran::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $pengeluaran = Pengeluaran::create([
            'cabang_id' => 1,
            'user_id' => 1,
            'kategori' => $request->kategori,
            'nama_biaya' => $request->nama_biaya,
            'nominal' => $request->nominal,
            'tanggal' => now()->toDateString(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $pengeluaran
        ]);
    }
}