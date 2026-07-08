<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $table = 'transaksis';

    protected $fillable = [
        'no_transaksi',
        'user_id',
        'cabang_id',
        'nama_pelanggan',
        'subtotal',
        'diskon',
        'pajak',
        'pembulatan_donasi',
        'total_tagihan',
        'metode_pembayaran',
        'uang_diterima',
        'kembalian',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(DetailTransaksi::class);
    }

    public function cabang()
    {
        return $this->belongsTo(Cabang::class);
    }
}