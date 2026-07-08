<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailTransaksi extends Model
{
    protected $table = 'detail_transaksis';

    protected $fillable = [
        'transaksi_id',
        'produk_id',
        'produk_batch_id',
        'qty',
        'harga_satuan',
        'subtotal',
    ];

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class);
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class)->withTrashed();
    }

    public function batch()
    {
        return $this->belongsTo(ProdukBatch::class, 'produk_batch_id');
    }
}