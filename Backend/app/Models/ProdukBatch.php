<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdukBatch extends Model
{
    protected $table = 'produk_batches';

    protected $fillable = [
        'produk_id',
        'barcode_custom',
        'stok',
        'expired_date',
        'tanggal_masuk',
    ];

    protected $casts = [
        'expired_date' => 'date',
        'tanggal_masuk' => 'date',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }
}
