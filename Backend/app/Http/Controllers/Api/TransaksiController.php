<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use App\Models\DetailTransaksi;
use App\Models\Produk;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    public function index()
{
    return response()->json(
        Transaksi::with('details.produk')
            ->latest()
            ->get()
    );
}

    public function store(Request $request)
    {
        DB::beginTransaction();

    try {

        $subtotal = 0;

        foreach ($request->items as $item) {
            $produk = Produk::findOrFail($item['produk_id']);
            $subtotal += $produk->harga_jual * $item['qty'];
        }

        $tax = round($subtotal * 0.11);
        $rawTotal = $subtotal + $tax;
        $totalTagihan = ceil($rawTotal / 1000) * 1000;

        $transaksi = Transaksi::create([
            'no_transaksi' => 'TRX-' . time(),
            'user_id' => 1,
            'cabang_id' => 1,
            'nama_pelanggan' => null,
            'subtotal' => $subtotal,
            'diskon' => 0,
            'total_tagihan' => $totalTagihan,
            'metode_pembayaran' => $request->metode_pembayaran,
            'uang_diterima' => $request->uang_diterima,
            'kembalian' => $request->uang_diterima - $totalTagihan,
            'status' => 'berhasil',
        ]);

        foreach ($request->items as $item) {

            $produk = Produk::findOrFail($item['produk_id']);

            DetailTransaksi::create([
                'transaksi_id' => $transaksi->id,
                'produk_id' => $produk->id,
                'produk_batch_id' => null,
                'qty' => $item['qty'],
                'harga_satuan' => $produk->harga_jual,
                'subtotal' => $produk->harga_jual * $item['qty'],
            ]);

            $produk->decrement(
                'stok_total',
                $item['qty']
            );
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil',
            'transaksi_id' => $transaksi->id
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
    }
}