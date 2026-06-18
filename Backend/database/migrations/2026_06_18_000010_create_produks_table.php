<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('produks', function (Blueprint $table) {
        $table->id();
        $table->string('sku')->unique(); // Barcode pabrik bawaan
        $table->string('nama_produk');
        $table->string('kategori'); // e.g., Daging Sapi, Olahan Seafood
        $table->decimal('harga_beli', 15, 2);
        $table->decimal('harga_jual', 15, 2);
        $table->integer('stok_total')->default(0); // Akumulasi stok dari seluruh batch
        $table->foreignId('cabang_id')->constrained('cabangs')->onDelete('cascade');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produks');
    }
};
