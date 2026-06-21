<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\Transaksi;

class OwnerDashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalProduk' => Produk::count(),
            'totalTransaksi' => Transaksi::count(),
        ]);
    }
}