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
        Schema::table('cabangs', function (Blueprint $table) {
            $table->string('manajer')->nullable();
            $table->string('jam_operasional')->default('08:00 - 21:00');
            $table->string('status')->default('Buka');
        });
    }

    public function down(): void
    {
        Schema::table('cabangs', function (Blueprint $table) {
            $table->dropColumn(['manajer', 'jam_operasional', 'status']);
        });
    }
};
