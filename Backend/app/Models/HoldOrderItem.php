<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HoldOrderItem extends Model
{
    protected $fillable = [
        'hold_order_id',
        'produk_id',
        'qty',
        'harga',
        'subtotal',
    ];

    public function holdOrder()
    {
        return $this->belongsTo(HoldOrder::class);
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }
}