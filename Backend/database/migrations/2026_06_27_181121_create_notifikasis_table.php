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
     Schema::create('notifikasis', function (Blueprint $table) {
         $table->id();
         $table->foreignId('cabang_id')->constrained('cabangs')->cascadeOnDelete();
         $table->string('type'); // danger, warning, info, success
         $table->string('title');
         $table->text('description');
         $table->boolean('is_read')->default(false);
         $table->timestamps();
     });
 }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifikasis');
    }
};
