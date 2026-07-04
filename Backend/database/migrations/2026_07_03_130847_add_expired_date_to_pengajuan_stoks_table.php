<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengajuan_stoks', function (Blueprint $table) {
            $table->date('expired_date')->nullable()->after('jumlah_request');
        });
    }

    public function down(): void
    {
        Schema::table('pengajuan_stoks', function (Blueprint $table) {
            $table->dropColumn('expired_date');
        });
    }
};
