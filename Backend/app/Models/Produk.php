<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Produk extends Model
{
    use SoftDeletes;

    protected $table = 'produks';

    protected $fillable = [
        'sku',
        'nama_produk',
        'kategori',
        'image',
        'harga_beli',
        'harga_jual',
        'stok_total',
        'cabang_id',
    ];

    public function batches()
    {
        return $this->hasMany(ProdukBatch::class);
    }
}