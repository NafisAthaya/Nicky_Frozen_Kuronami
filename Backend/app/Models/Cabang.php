<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cabang extends Model
{
    protected $fillable = [
        'nama_cabang',
        'alamat',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function produks()
    {
        return $this->hasMany(Produk::class);
    }
}
