<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $table = 'produks';

    protected $fillable = [
        'cabang_id',
        'sku',
        'nama_produk',
        'kategori',
        'gambar',
        'harga_beli',
        'harga_jual',
        'stok_total',
    ];

    public function batches()
    {
        return $this->hasMany(ProdukBatch::class);
    }

    public function cabang()
    {
        return $this->belongsTo(Cabang::class);
    }
}