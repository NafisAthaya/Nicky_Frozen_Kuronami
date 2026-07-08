<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\DetailTransaksi;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaksi::with([
            'details.produk',
            'details.batch',
            'user',
            'cabang'
        ])->latest();

        $cabangId = $request->query('cabang_id');
        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }

        if ($request->user()) {
            if ($request->user()->role === 'kasir') {
                $query->where('cabang_id', $request->user()->cabang_id);
                
                $lastSesi = \App\Models\SesiKasir::where('cabang_id', $request->user()->cabang_id)
                    ->where('status', 'selesai')
                    ->latest('waktu_selesai')
                    ->first();

                if ($lastSesi) {
                    $query->where('created_at', '>', $lastSesi->waktu_selesai);
                }
            }
        }

    return response()->json(['data' => $query->get()]);
}
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();
            
            $transaksi = Transaksi::create([
                'no_transaksi' => 'TRX-' . time(),
                'user_id' => $user ? $user->id : 1,
                'cabang_id' => ($user && $user->cabang_id) ? $user->cabang_id : 1,
                'nama_pelanggan' => $request->nama_pelanggan ?? null,
                'subtotal' => $request->subtotal ?? 0,
                'diskon' => $request->diskon ?? 0,
                'pajak' => ($request->pajak ?? 0) + ($request->biaya_layanan ?? 0),
                'pembulatan_donasi' => $request->pembulatan_donasi ?? 0,
                'total_tagihan' => $request->total_tagihan ?? 0,
                'metode_pembayaran' => $request->metode_pembayaran,
                'uang_diterima' => $request->uang_diterima,
                'kembalian' => max(0, $request->uang_diterima - ($request->total_tagihan ?? 0)),
                'status' => 'berhasil',
            ]);

            foreach ($request->items as $item) {
                // Find product with batches for this branch ordered by expiry (FIFO)
                $produk = Produk::with(['batches' => function($q) use ($transaksi) {
                    $q->where('cabang_id', $transaksi->cabang_id)->where('stok', '>', 0)->orderBy('expired_date', 'asc');
                }])->findOrFail($item['produk_id']);
                
                $qtyNeeded = $item['qty'];
                $hargaSatuan = $item['harga'] ?? $produk->harga_jual;
                
                // Deduct from batches using FIFO logic
                foreach ($produk->batches as $batch) {
                    if ($qtyNeeded <= 0) break;
                    
                    $take = min($qtyNeeded, $batch->stok);
                    $batch->stok -= $take;
                    $batch->save();
                    
                    DetailTransaksi::create([
                        'transaksi_id' => $transaksi->id,
                        'produk_id' => $produk->id,
                        'produk_batch_id' => $batch->id,
                        'qty' => $take,
                        'harga_satuan' => $hargaSatuan,
                        'subtotal' => $hargaSatuan * $take,
                    ]);
                    
                    $qtyNeeded -= $take;
                }
                
                // If there is still qty needed (because batches were empty or insufficient),
                // we MUST still record the sale detail, just without a specific batch.
                if ($qtyNeeded > 0) {
                    DetailTransaksi::create([
                        'transaksi_id' => $transaksi->id,
                        'produk_id' => $produk->id,
                        'produk_batch_id' => null,
                        'qty' => $qtyNeeded,
                        'harga_satuan' => $hargaSatuan,
                        'subtotal' => $hargaSatuan * $qtyNeeded,
                    ]);
                }
                
                // Decrement total stock
                $produk->decrement('stok_total', $item['qty']);
                
                // Create Notifikasi if stock is low
                if ($produk->stok_total <= 5) {
                    \App\Models\Notifikasi::create([
                        'cabang_id' => $transaksi->cabang_id,
                        'title' => 'Stok Menipis',
                        'description' => "Stok produk {$produk->nama_produk} sisa {$produk->stok_total}!",
                        'type' => 'stok',
                        'is_read' => false
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil disimpan',
                'data' => $transaksi
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}