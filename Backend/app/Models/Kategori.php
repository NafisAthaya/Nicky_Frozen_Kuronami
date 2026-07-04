<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $fillable = [
        'cabang_id',
        'nama_kategori',
        'description',
    ];

    public function cabang()
    {
        return $this->belongsTo(Cabang::class);
    }
}
