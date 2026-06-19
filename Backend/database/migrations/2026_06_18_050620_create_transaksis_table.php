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
    Schema::create('transaksis', function (Blueprint $table) {
        $table->id();
        $table->string('no_transaksi')->unique();
        $table->foreignId('user_id')->constrained('users'); // Kasir bertugas
        $table->foreignId('cabang_id')->constrained('cabangs');
        $table->string('nama_pelanggan')->nullable();
        $table->decimal('subtotal', 15, 2);
        $table->decimal('diskon', 15, 2)->default(0);
        $table->decimal('total_tagihan', 15, 2);
        $table->enum('metode_pembayaran', ['tunai', 'transfer', 'debit', 'qris']);
        $table->decimal('uang_diterima', 15, 2)->nullable();
        $table->decimal('kembalian', 15, 2)->nullable();
        $table->enum('status', ['berhasil', 'pending', 'dibatalkan'])->default('berhasil');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
