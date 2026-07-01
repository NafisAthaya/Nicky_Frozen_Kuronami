<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\ProdukBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Dashboard stats: total produk, total stok, produk mendekati kadaluwarsa, potensi kerugian
     */
    public function stats(Request $request)
    {
        $cabangId = $request->query('cabang_id');

        $produkQuery = Produk::query();
        if ($cabangId) {
            $produkQuery->where('cabang_id', $cabangId);
        }

        $produks = $produkQuery->get();
        $totalProduk = $produks->count();
        $totalStok = $produks->sum('stok_total');

        $now = Carbon::now();

        // --- 1. Calculate Stats for Cards (Always H-7) ---
        $limit7Days = Carbon::now()->addDays(7);
        $batch7DaysQuery = ProdukBatch::whereBetween('expired_date', [$now, $limit7Days]);
        
        if ($cabangId) {
            $batch7DaysQuery->whereHas('produk', function ($q) use ($cabangId) {
                $q->where('cabang_id', $cabangId);
            });
        }
        
        $batches7Days = $batch7DaysQuery->with('produk')->get();
        
        $produks7Days = $batches7Days->groupBy('produk_id')->map(function ($batches) {
            $produk = $batches->first()->produk;
            return [
                'stok_expiring' => $batches->sum('stok'),
                'harga_jual' => $produk->harga_jual,
            ];
        });
        
        $expiringCount = $produks7Days->count();
        $potensiKerugian = $produks7Days->sum(function ($p) {
            return $p['harga_jual'] * $p['stok_expiring'];
        });

        // --- 2. Calculate Table Data (All Products or Filtered by Date) ---
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $sortExpiry = $request->query('sort_expiry', 'asc');

        $tableQuery = Produk::with(['batches' => function ($q) use ($startDate, $endDate) {
            if ($startDate && $endDate) {
                $from = Carbon::parse($startDate)->startOfDay();
                $to = Carbon::parse($endDate)->endOfDay();
                $q->whereBetween('expired_date', [$from, $to]);
            }
        }]);

        if ($cabangId) {
            $tableQuery->where('cabang_id', $cabangId);
        }

        $allProduks = $tableQuery->get();

        $tableData = $allProduks->map(function ($produk) use ($now, $startDate, $endDate) {
            $validBatches = $produk->batches;
            
            // If filter applied, only show products that have batches in that date range
            if ($startDate && $endDate && $validBatches->isEmpty()) {
                return null;
            }

            $totalStokFiltered = $validBatches->sum('stok');
            $nearestExpiry = $validBatches->min('expired_date');
            
            $daysLeft = null;
            if ($nearestExpiry) {
                $daysLeft = (int) Carbon::parse($now)->startOfDay()->diffInDays(Carbon::parse($nearestExpiry)->startOfDay(), false);
            }

            return [
                'id' => $produk->id,
                'nama_produk' => $produk->nama_produk,
                'sku' => $produk->sku,
                'kategori' => $produk->kategori,
                'harga_jual' => $produk->harga_jual,
                'gambar' => $produk->gambar ? asset('storage/produk/' . $produk->gambar) : null,
                'stok_expiring' => $totalStokFiltered,
                'expired_date' => $nearestExpiry,
                'days_left' => $daysLeft,
            ];
        })->filter();

        // Sorting table data
        if ($sortExpiry === 'desc') {
            $tableData = $tableData->sortByDesc(function ($p) {
                return $p['days_left'] ?? -999999;
            })->values();
        } else {
            $tableData = $tableData->sortBy(function ($p) {
                return $p['days_left'] ?? 999999;
            })->values();
        }

        return response()->json([
            'total_produk' => $totalProduk,
            'total_stok' => $totalStok,
            'expiring_count' => $expiringCount,
            'potensi_kerugian' => $potensiKerugian,
            'table_data' => $tableData,
        ]);
    }

    /**
     * List semua produk (filter by cabang_id)
     */
    public function getProduks(Request $request)
    {
        $cabangId = $request->query('cabang_id');

        $query = Produk::query();
        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }

        // Filter by kategori
        if ($request->query('kategori')) {
            $query->where('kategori', $request->query('kategori'));
        }

        $produks = $query->orderBy('nama_produk')->get();

        $produks->transform(function ($produk) {
            $produk->gambar = $produk->gambar
                ? asset('storage/produk/' . $produk->gambar)
                : null;
            return $produk;
        });

        return response()->json($produks);
    }

    /**
     * Tambah produk baru
     */
    public function storeProduk(Request $request)
    {
        $request->validate([
            'sku' => 'required|string|unique:produks,sku',
            'nama_produk' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'harga_beli' => 'required|numeric|min:0',
            'harga_jual' => 'required|numeric|min:0',
            'stok_total' => 'nullable|integer|min:0',
            'cabang_id' => 'required|exists:cabangs,id',
        ]);

        $produk = Produk::create([
            'sku' => $request->sku,
            'nama_produk' => $request->nama_produk,
            'kategori' => $request->kategori,
            'harga_beli' => $request->harga_beli,
            'harga_jual' => $request->harga_jual,
            'stok_total' => $request->stok_total ?? 0,
            'cabang_id' => $request->cabang_id,
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'produk' => $produk,
        ], 201);
    }

    /**
     * Update produk
     */
    public function updateProduk(Request $request, $id)
    {
        $produk = Produk::findOrFail($id);

        $request->validate([
            'sku' => 'sometimes|string|unique:produks,sku,' . $id,
            'nama_produk' => 'sometimes|string|max:255',
            'kategori' => 'sometimes|string|max:255',
            'harga_beli' => 'sometimes|numeric|min:0',
            'harga_jual' => 'sometimes|numeric|min:0',
            'stok_total' => 'sometimes|integer|min:0',
        ]);

        $produk->update($request->only([
            'sku', 'nama_produk', 'kategori',
            'harga_beli', 'harga_jual', 'stok_total',
        ]));

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'produk' => $produk,
        ]);
    }

    /**
     * Hapus produk
     */
    public function deleteProduk($id)
    {
        $produk = Produk::findOrFail($id);
        $produk->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus',
        ]);
    }

    /**
     * List semua batch / riwayat barang masuk
     */
    public function getBatches(Request $request)
    {
        $cabangId = $request->query('cabang_id');

        $query = ProdukBatch::with('produk')->orderBy('created_at', 'desc');

        if ($cabangId) {
            $query->whereHas('produk', function ($q) use ($cabangId) {
                $q->where('cabang_id', $cabangId);
            });
        }

        $limit = $request->query('limit');
        if ($limit) {
            $batches = $query->limit((int) $limit)->get();
        } else {
            $batches = $query->get();
        }

        return response()->json($batches);
    }

    /**
     * Tambah barang masuk (batch baru)
     */
    public function storeBatch(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'stok' => 'required|integer|min:1',
            'expired_date' => 'required|date',
            'tanggal_masuk' => 'nullable|date',
        ]);

        // Generate barcode custom unik
        $barcodeCustom = 'BC-' . strtoupper(Str::random(8));

        $batch = ProdukBatch::create([
            'produk_id' => $request->produk_id,
            'barcode_custom' => $barcodeCustom,
            'stok' => $request->stok,
            'expired_date' => $request->expired_date,
            'tanggal_masuk' => $request->tanggal_masuk ?? now()->toDateString(),
        ]);

        // Update stok_total di produk
        $produk = Produk::find($request->produk_id);
        $produk->increment('stok_total', $request->stok);

        $batch->load('produk');

        return response()->json([
            'message' => 'Barang masuk berhasil dicatat',
            'batch' => $batch,
        ], 201);
    }

    /**
     * List kategori unik dari kolom kategori produk
     */
    public function getKategoris(Request $request)
    {
        $cabangId = $request->query('cabang_id');

        $query = Produk::query();
        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }

        $kategoris = $query->select('kategori')
            ->distinct()
            ->whereNotNull('kategori')
            ->where('kategori', '!=', '')
            ->orderBy('kategori')
            ->pluck('kategori');

        // Return with count of products per category
        $result = $kategoris->map(function ($kategori) use ($cabangId) {
            $query = Produk::where('kategori', $kategori);
            if ($cabangId) {
                $query->where('cabang_id', $cabangId);
            }
            return [
                'name' => $kategori,
                'product_count' => $query->count(),
            ];
        });

        return response()->json($result);
    }
}
