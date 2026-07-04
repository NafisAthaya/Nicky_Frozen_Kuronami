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
        Schema::table('pengaturan_tokos', function (Blueprint $table) {
            $table->string('judul_struk')->default('Nicky Frozen Food')->after('arah_pembulatan');
            $table->text('alamat_struk')->nullable()->after('judul_struk');
            $table->string('nomor_telepon')->nullable()->after('alamat_struk');
            $table->text('footer_struk')->default('Terima Kasih Telah Berbelanja!')->after('nomor_telepon');
            $table->boolean('tampilkan_logo')->default(false)->after('footer_struk');
            $table->boolean('tampilkan_barcode')->default(true)->after('tampilkan_logo');
            $table->boolean('tampilkan_nama_kasir')->default(true)->after('tampilkan_barcode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengaturan_tokos', function (Blueprint $table) {
            $table->dropColumn([
                'judul_struk',
                'alamat_struk',
                'nomor_telepon',
                'footer_struk',
                'tampilkan_logo',
                'tampilkan_barcode',
                'tampilkan_nama_kasir',
            ]);
        });
    }
};
