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
        Schema::create('hold_orders', function (Blueprint $table) {

            $table->id();

            $table->string('no_antrian');

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('cabang_id')
                ->constrained('cabangs')
                ->cascadeOnDelete();

            $table->string('nama_pelanggan')->nullable();

            $table->decimal('subtotal', 12, 2);

            $table->enum('status', [
                'hold',
                'completed',
            ])->default('hold');

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hold_orders');
    }
};