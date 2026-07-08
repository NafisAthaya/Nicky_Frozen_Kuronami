<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Cabang;
use App\Models\Produk;
use App\Models\ProdukBatch; // <--- PASTIKAN BARIS INI ADA
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Bikin Data Cabang Utama
        $cabangUtama = Cabang::create([
            'nama_cabang' => 'Nicky Frozen - Pusat Yogyakarta',
            'alamat' => 'Jl. Prambanan No. 12, Sleman, DIY',
        ]);

        // 2. Bikin Akun Owner
        User::create([
            'name' => 'Nicky Owner',
            'username' => 'owner_nicky',
            'password' => Hash::make('password123'),
            'role' => 'owner',
            'cabang_id' => $cabangUtama->id,
        ]);

        // 3. Bikin Akun Kasir
        User::create([
            'name' => 'Kasir_Nicky',
            'username' => 'kasir_nicky',
            'password' => Hash::make('kasir123'),
            'role' => 'kasir',
            'cabang_id' => $cabangUtama->id,
        ]);

        // 4. Bikin Beberapa Data Master Produk
        Produk::create([
            'sku' => '8991234567890',
            'nama_produk' => 'Sosis Sapi Bakar Premium 500g',
            'kategori' => 'Olahan Daging',
            'image' => null, 
            'harga_jual' => 45000,
            'stok_total' => 0, // Nanti bertambah via tabel produk_batches
        ]);

        ProdukBatch::create([
            'produk_id' => 1, // ID Sosis Sapi Bakar
            'cabang_id' => $cabangUtama->id,
            'barcode_custom' => 'SS-1224-001', // Ini yang discan kasir nanti
            'stok' => 50,
            'expired_date' => '2026-12-31',
            'tanggal_masuk' => now(),
            'harga_beli' => 35000,
            'supplier' => 'PT Sumber Sosis',
        ]);

        // Update stok total di tabel produk
        $produkSosis = Produk::find(1);
        $produkSosis->update(['stok_total' => 50]);
    }
}