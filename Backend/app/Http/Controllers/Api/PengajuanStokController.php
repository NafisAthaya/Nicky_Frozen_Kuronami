<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PengajuanStok;
use App\Models\Produk;
use App\Models\Notifikasi;
use Illuminate\Http\Request;

class PengajuanStokController extends Controller
{
    // Owner: List all pengajuan stok pending (and others)
    public function index(Request $request)
    {
        $user = $request->user();
        $query = PengajuanStok::with('produk');
        
        // As Owner, they oversee all branches. Admins see only their branch.
        if ($user && $user->cabang_id) {
            $query->where('cabang_id', $user->cabang_id);
        }
        
        $data = $query->latest()->get();
        return response()->json(['status' => 'success', 'data' => $data]);
    }

    // Admin: Mengajukan penambahan stok
    public function store(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'jumlah' => 'required|integer|min:1',
            'catatan' => 'nullable|string'
        ]);

        $user = $request->user();
        $pengajuan = PengajuanStok::create([
            'cabang_id' => ($user && $user->cabang_id) ? $user->cabang_id : 1, // fallback 1 for testing / owner
            'admin_id' => $user ? $user->id : 1, // fallback 1 for testing
            'produk_id' => $request->produk_id,
            'jumlah_request' => $request->jumlah,
            'catatan' => $request->catatan,
            'status' => 'pending',
            'tanggal_pengajuan' => \Carbon\Carbon::now()->format('Y-m-d')
        ]);
        
        // Notify Owner
        Notifikasi::create([
            'cabang_id' => $pengajuan->cabang_id,
            'title' => 'Pengajuan Stok Baru',
            'description' => "Terdapat pengajuan stok baru untuk produk ID {$pengajuan->produk_id} sejumlah {$pengajuan->jumlah_request}.",
            'type' => 'pengajuan_stok',
            'is_read' => false
        ]);

        return response()->json(['status' => 'success', 'message' => 'Pengajuan berhasil dikirim.', 'data' => $pengajuan], 201);
    }

    // Owner: Menyetujui / Menolak Pengajuan
    public function update(Request $request, $id)
    {
        // Normalize status
        if ($request->has('status')) {
            $request->merge(['status' => strtolower($request->status)]);
        }

        $request->validate([
            'status' => 'required|in:disetujui,ditolak',
        ]);

        $pengajuan = PengajuanStok::findOrFail($id);
        
        if (strtolower($pengajuan->status) !== 'pending') {
            return response()->json(['status' => 'error', 'message' => 'Pengajuan ini sudah diproses.'], 400);
        }

        $pengajuan->status = $request->status;
        $pengajuan->save();

        if ($request->status === 'disetujui') {
            $produk = Produk::findOrFail($pengajuan->produk_id);
            
            // Tambahkan batch baru ke produk_batches
            \App\Models\ProdukBatch::create([
                'produk_id' => $produk->id,
                'barcode_custom' => 'BC-' . strtoupper(\Illuminate\Support\Str::random(8)),
                'stok' => $pengajuan->jumlah_request,
                'expired_date' => $pengajuan->expired_date ?? \Carbon\Carbon::now()->addYear()->format('Y-m-d'),
                'tanggal_masuk' => \Carbon\Carbon::now()->format('Y-m-d')
            ]);
            
            // Update total stok produk
            $produk->increment('stok_total', $pengajuan->jumlah_request);
            
            $pesan = "Pengajuan stok untuk {$produk->nama_produk} disetujui.";
        } else {
            $pesan = "Pengajuan stok ID {$pengajuan->id} ditolak.";
        }
        
        // Notify Admin
        Notifikasi::create([
            'cabang_id' => $pengajuan->cabang_id,
            'title' => 'Status Pengajuan Stok',
            'description' => $pesan,
            'type' => 'pengajuan_stok_status',
            'is_read' => false
        ]);

        return response()->json(['status' => 'success', 'message' => "Pengajuan berhasil {$request->status}."]);
    }
}
