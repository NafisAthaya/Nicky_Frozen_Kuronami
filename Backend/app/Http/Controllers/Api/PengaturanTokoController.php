<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\PengaturanToko;
use Illuminate\Http\Request;

class PengaturanTokoController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        $cabangId = ($user && $user->cabang_id) ? $user->cabang_id : 1;

        // Ambil pengaturan cabang milik owner ini. Jika belum ada, buatkan defaultnya otomatis.
        $settings = PengaturanToko::firstOrCreate(
            ['cabang_id' => $cabangId],
            [
                'pajak_persen' => 0, 'layanan_persen' => 0, 
                'harga_termasuk_pajak' => false, 'aktifkan_pembulatan' => false,
                'nominal_pembulatan' => 100, 'arah_pembulatan' => 'terdekat',
                'judul_struk' => 'Nicky Frozen Food',
                'alamat_struk' => 'Jl. Raya Boulevard No. 12, Gading Serpong, Tangerang',
                'nomor_telepon' => '0812-3456-7890',
                'footer_struk' => 'Terima Kasih Telah Berbelanja!',
                'tampilkan_logo' => false,
                'tampilkan_barcode' => true,
                'tampilkan_nama_kasir' => true,
            ]
        );
        return response()->json(['status' => 'success', 'data' => $settings]);
    }

    public function update(Request $request) {
        $user = $request->user();
        $cabangId = ($user && $user->cabang_id) ? $user->cabang_id : 1;

        $settings = PengaturanToko::where('cabang_id', $cabangId)->first();
        $settings->update($request->all());
        return response()->json(['status' => 'success', 'data' => $settings]);
    }
}
