<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProdukBatch extends Model
{
    use HasFactory;

    protected $table = 'produk_batches';

    protected $fillable = [
        'produk_id',
        'cabang_id',
        'barcode_custom',
        'stok',
        'expired_date',
        'tanggal_masuk',
        'harga_beli',
        'supplier',
        'catatan',
    ];

    protected $casts = [
        'expired_date' => 'date',
        'tanggal_masuk' => 'date',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class)->withTrashed();
    }

    public function cabang()
    {
        return $this->belongsTo(Cabang::class);
    }
}