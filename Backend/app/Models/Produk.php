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

    public function batches()
    {
        return $this->hasMany(ProdukBatch::class);
    }

    public function cabang()
    {
        return $this->belongsTo(Cabang::class);
    }
}