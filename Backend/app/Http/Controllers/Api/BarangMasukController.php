<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\ProdukBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BarangMasukController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        // 1. Keamanan Akses: Kasir tidak punya wewenang input barang masuk
        if ($user->role === 'kasir') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya Owner atau Manager yang dapat menginput barang masuk.'
            ], 403);
        }

        // 2. Validasi Input Data
        $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'stok' => 'required|integer|min:1',
            'expired_date' => 'required|date',
            'harga_beli' => 'required|numeric|min:0',
        ]);

        // Mulai Database Transaction untuk keamanan data
        DB::beginTransaction();

        try {
            $produk = Produk::findOrFail($request->produk_id);

            // 3. Meracik Barcode Custom
            // Ambil 2 huruf pertama dari nama produk (Misal: "Sosis Sapi" -> "SO")
            $inisial = strtoupper(substr($produk->nama_produk, 0, 2));
            // Format tanggal expired jadi bulan dan 2 digit tahun (Misal: "2026-12-31" -> "1226")
            $formatBulanTahun = Carbon::parse($request->expired_date)->format('my');
            // Tambahkan 3 karakter acak (huruf/angka)
            $acak = strtoupper(Str::random(3));
            
            $barcodeCustom = "{$inisial}-{$formatBulanTahun}-{$acak}";

            // Pastikan barcode benar-benar unik di database
            while (ProdukBatch::where('barcode_custom', $barcodeCustom)->exists()) {
                $acak = strtoupper(Str::random(3));
                $barcodeCustom = "{$inisial}-{$formatBulanTahun}-{$acak}";
            }

            // 4. Masukkan ke tabel Produk Batch
            $batch = ProdukBatch::create([
                'produk_id' => $produk->id,
                'cabang_id' => $request->cabang_id ?? $user->cabang_id ?? 1,
                'barcode_custom' => $barcodeCustom,
                'stok' => $request->stok,
                'expired_date' => $request->expired_date,
                'tanggal_masuk' => now()->toDateString(),
                'harga_beli' => $request->harga_beli,
                'supplier' => $request->supplier,
                'catatan' => $request->catatan,
            ]);

            // 5. Update otomatis Stok Total di tabel induk Produk
            $produk->stok_total += $request->stok;
            $produk->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Barang masuk berhasil dicatat. Silakan cetak barcode ini!',
                'data' => $batch
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }
}