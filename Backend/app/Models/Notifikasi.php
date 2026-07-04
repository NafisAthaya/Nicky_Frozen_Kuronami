<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    use HasFactory;

    // Tentukan kolom apa saja yang boleh diisi
    protected $fillable = [
        'cabang_id', 
        'type', 
        'title', 
        'description', 
        'is_read'
    ];

    // Konversi is_read menjadi tipe boolean (true/false)
    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }
}