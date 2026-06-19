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
    Schema::create('pengeluarans', function (Blueprint $table) {
        $table->id();
        $table->foreignId('cabang_id')->constrained('cabangs')->onDelete('cascade');
        $table->foreignId('user_id')->constrained('users'); // Pegawai yang mencatat biaya
        $table->string('kategori'); // e.g., Plastik, Kebersihan, Es Batu
        $table->string('nama_biaya');
        $table->decimal('nominal', 15, 2);
        $table->date('tanggal');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengeluarans');
    }
};
