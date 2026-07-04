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
        Schema::table('produk_batches', function (Blueprint $table) {
            $table->decimal('harga_beli', 15, 2)->nullable();
            $table->string('supplier')->nullable();
            $table->text('catatan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produk_batches', function (Blueprint $table) {
            $table->dropColumn(['harga_beli', 'supplier', 'catatan']);
        });
    }
};
