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
        Schema::create('pengaturan_tokos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cabang_id')->constrained('cabangs')->cascadeOnDelete();
            $table->integer('pajak_persen')->default(0);
            $table->integer('layanan_persen')->default(0);
            $table->boolean('harga_termasuk_pajak')->default(false);
            $table->boolean('aktifkan_pembulatan')->default(false);
            $table->integer('nominal_pembulatan')->default(100); // 100, 500, 1000
            $table->string('arah_pembulatan')->default('terdekat'); // bawah, terdekat, atas
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaturan_tokos');
    }
};
