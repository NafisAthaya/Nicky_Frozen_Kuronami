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
    Schema::create('detail_transaksis', function (Blueprint $table) {
        $table->id();
        $table->foreignId('transaksi_id')->constrained('transaksis')->onDelete('cascade');
        $table->foreignId('produk_id')->constrained('produks');
        $table->foreignId('produk_batch_id')->nullable()->constrained('produk_batches')->onDelete('set null');
        $table->integer('qty');
        $table->decimal('harga_satuan', 15, 2);
        $table->decimal('subtotal', 15, 2);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksis');
    }
};
