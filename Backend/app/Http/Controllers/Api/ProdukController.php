<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;

class ProdukController extends Controller
{
            public function index()
        {
            $produks = Produk::all();

            $produks->transform(function ($produk) {
                $produk->gambar = $produk->gambar
                    ? asset('storage/produk/' . $produk->gambar)
                    : null;

                return $produk;
            });

            return response()->json($produks);
        }
}