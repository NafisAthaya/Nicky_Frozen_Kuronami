<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Daftarkan semua kolom dari migration agar bisa diisi (Mass Assignment)
#[Fillable([
    'cabang_id',
    'pajak_persen',
    'layanan_persen',
    'harga_termasuk_pajak',
    'aktifkan_pembulatan',
    'nominal_pembulatan',
    'arah_pembulatan',
    'judul_struk',
    'alamat_struk',
    'nomor_telepon',
    'footer_struk',
    'tampilkan_logo',
    'tampilkan_barcode',
    'tampilkan_nama_kasir',
])]
class PengaturanToko extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Sangat krusial agar React menerima nilai true/false (bukan angka 1/0)
            'harga_termasuk_pajak' => 'boolean',
            'aktifkan_pembulatan'  => 'boolean',
            'tampilkan_logo'       => 'boolean',
            'tampilkan_barcode'    => 'boolean',
            'tampilkan_nama_kasir' => 'boolean',
            
            // Opsional: Memastikan angka dikirim sebagai integer murni
            'pajak_persen'       => 'integer',
            'layanan_persen'     => 'integer',
            'nominal_pembulatan' => 'integer',
        ];
    }

    /**
     * Relasi balik ke tabel Cabang
     */
    public function cabang()
    {
        return $this->belongsTo(Cabang::class, 'cabang_id');
    }
}