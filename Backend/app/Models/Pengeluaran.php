<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengeluaran extends Model
{
    protected $table = 'pengeluarans';

    protected $fillable = [
        'cabang_id',
        'user_id',
        'kategori',
        'nama_biaya',
        'nominal',
        'tanggal',
    ];
}