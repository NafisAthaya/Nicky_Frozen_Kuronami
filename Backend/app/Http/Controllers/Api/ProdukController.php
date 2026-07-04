<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\Request;

class ProdukController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Produk::with('batches');

        // Filter berdasarkan cabang jika user sudah login
        if ($user) {
            $cabangId = $user->cabang_id ?? 1; // Default ke cabang 1 (Utama) jika owner
            $query->where('cabang_id', $cabangId);
        }

        $produks = $query->get();
        
        $activeRules = collect();
        if ($user) {
            $cabangId = $user->cabang_id ?? 1;
            $activeRules = \App\Models\DiskonRule::where('cabang_id', $cabangId)
                ->where('is_active', true)
                ->get();
        }

        $produks->transform(function ($produk) use ($activeRules) {
            $produk->gambar = $produk->gambar
                ? asset('storage/produk/' . $produk->gambar)
                : null;
                
            $hargaDiskon = $produk->harga_jual;
            $isDiscounted = false;
            $persenDiskon = 0;

            foreach ($activeRules as $rule) {
                $targetKat = strtolower(trim($rule->target_kategori));
                $produkKat = strtolower(trim($produk->kategori));

                if ($targetKat === $produkKat || $targetKat === 'semua kategori' || $targetKat === 'semua') {
                    $isExpiringSoon = false;
                    foreach ($produk->batches as $batch) {
                        // Jangan hitung batch yang sudah habis atau tidak punya tanggal expired
                        if (empty($batch->expired_date) || $batch->stok <= 0) {
                            continue;
                        }
                        
                        $daysToExpiry = \Carbon\Carbon::now()->startOfDay()->diffInDays(\Carbon\Carbon::parse($batch->expired_date)->startOfDay(), false);
                        
                        if ($daysToExpiry <= $rule->pemicu_hari) {
                            $isExpiringSoon = true;
                            break;
                        }
                    }

                    if ($isExpiringSoon) {
                        if ($rule->diskon_persen > $persenDiskon) {
                            $persenDiskon = $rule->diskon_persen;
                        }
                    }
                }
            }

            if ($persenDiskon > 0) {
                $isDiscounted = true;
                $hargaDiskon = $produk->harga_jual - ($produk->harga_jual * ($persenDiskon / 100));
            }

            $produk->harga_diskon = $hargaDiskon;
            $produk->is_discounted = $isDiscounted;
            $produk->persen_diskon = $persenDiskon;

            return $produk;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil mengambil data produk',
            'data' => $produks,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'harga_jual' => 'required|numeric|min:0',
        ]);

        $query = Produk::query();

        if ($request->user()) {
            $cabangId = $request->user()->cabang_id ?? 1;
            $query->where('cabang_id', $cabangId);
        }

        $produk = $query->findOrFail($id);

        $produk->harga_jual = $request->harga_jual;
        $produk->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Harga produk berhasil diperbarui',
            'data' => $produk,
        ]);
    }
}