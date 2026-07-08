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

        $query = Produk::query();

        // Filter berdasarkan cabang
        $cabangId = 1;
        if ($user) {
            $cabangId = $request->query('cabang_id') ?? $user->cabang_id ?? 1;
            $query->whereHas('batches', function($q) use ($cabangId) {
                $q->where('cabang_id', $cabangId);
            });
            $query->with(['batches' => function($q) use ($cabangId) {
                $q->where('cabang_id', $cabangId);
            }]);
        } else {
            $query->with('batches');
        }

        $produks = $query->get();
        
        $activeRules = collect();
        if ($user) {
            $activeRules = \App\Models\DiskonRule::where('cabang_id', $cabangId)
                ->where('is_active', true)
                ->get();
        }

        $produks->transform(function ($produk) use ($activeRules) {
            $produk->gambar = $produk->image
                ? asset('storage/produk/' . $produk->image)
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

            // Calculate dynamic stok_total based only on the loaded batches for this branch
            $stokCabang = 0;
            foreach ($produk->batches as $batch) {
                $stokCabang += $batch->stok;
            }
            $produk->stok_total = $stokCabang;

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
            $cabangId = $request->query('cabang_id') ?? $request->user()->cabang_id ?? 1;
            $query->whereHas('batches', function($q) use ($cabangId) {
                $q->where('cabang_id', $cabangId);
            });
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