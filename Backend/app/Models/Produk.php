<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $table = 'produks';

    protected $fillable = [
        'sku',
        'nama_produk',
        'kategori',
        'harga_beli',
        'harga_jual',
        'stok_total',
        'gambar',
        'cabang_id'
    ];
}