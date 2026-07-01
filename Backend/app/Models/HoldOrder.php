<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HoldOrder extends Model
{
    protected $fillable = [
    'no_antrian',
    'nama_pelanggan',
    'user_id',
    'cabang_id',
    'subtotal',
    'status',
    ];

    public function items()
    {
        return $this->hasMany(HoldOrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}