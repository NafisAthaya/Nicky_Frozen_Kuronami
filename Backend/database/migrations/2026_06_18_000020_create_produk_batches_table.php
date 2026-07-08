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
    Schema::create('produk_batches', function (Blueprint $table) {
        $table->id();
        $table->foreignId('produk_id')->constrained('produks')->onDelete('cascade');
        $table->foreignId('cabang_id')->constrained('cabangs')->onDelete('cascade');
        $table->string('barcode_custom')->unique(); // ID stiker barcode buatanmu
        $table->integer('stok'); // Sisa stok khusus kelompok/batch ini
        $table->date('expired_date'); // Tanggal kadaluarsa spesifik batch ini
        $table->date('tanggal_masuk');
        $table->decimal('harga_beli', 15, 2)->default(0);
        $table->string('supplier')->nullable();
        $table->text('catatan')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk_batches');
    }
};
