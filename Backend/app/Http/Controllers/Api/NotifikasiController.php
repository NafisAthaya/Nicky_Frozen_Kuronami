<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\Request;


class NotifikasiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $cabangId = $user->role === 'owner' ? null : $user->cabang_id;

        // 1. Sync Produk Kadaluarsa (H-7) ke dalam tabel Notifikasi
        $now = \Carbon\Carbon::now();
        $limit7Days = clone $now;
        $limit7Days->addDays(7);
        
        $batchQuery = \App\Models\ProdukBatch::with('produk')
            ->whereBetween('expired_date', [$now, $limit7Days])
            ->where('stok', '>', 0);
            
        if ($cabangId) {
            $batchQuery->where('cabang_id', $cabangId);
        }
        
        $expiredBatches = $batchQuery->get();
        foreach ($expiredBatches as $batch) {
            $daysLeft = \Carbon\Carbon::now()->diffInDays(\Carbon\Carbon::parse($batch->expired_date), false);
            $desc = "Produk {$batch->produk->nama_produk} akan kadaluarsa dalam " . (int)$daysLeft . " hari pada " . \Carbon\Carbon::parse($batch->expired_date)->format('d M Y') . ". (Batch #{$batch->id})";
            
            // Cek apakah notifikasi untuk batch ini sudah ada (belum dibaca)
            $exists = Notifikasi::where('type', 'danger')
                        ->where('description', $desc)
                        ->where('is_read', false)
                        ->exists();

            if (!$exists) {
                Notifikasi::create([
                    'cabang_id' => $batch->cabang_id,
                    'title' => 'Peringatan Kadaluarsa',
                    'description' => $desc,
                    'type' => 'danger',
                    'is_read' => false
                ]);
            }
        }

        // 2. Ambil Semua Notifikasi yang belum dibaca dari tabel
        $query = Notifikasi::where('is_read', false)->orderByDesc('created_at');
        
        if ($user->role !== 'owner') {
            $query->where('title', '!=', 'Permintaan Reset Password');
        }
        
        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }
        
        $notifikasis = $query->get();

        return response()->json(['data' => $notifikasis], 200);
    }

    // Tandai satu notifikasi sudah dibaca
    public function markAsRead(Request $request, $id)
    {
        $notifikasi = Notifikasi::findOrFail($id);
        
        // Opsional: cek $request->user()->cabang_id terhadap $notifikasi->cabang_id

        $notifikasi->update(['is_read' => true]);
        return response()->json(['status' => 'success'], 200);
    }

    // Tandai semua notifikasi sudah dibaca
    public function markAllRead(Request $request)
    {
        $user = $request->user();
        $query = Notifikasi::where('is_read', false);
        
        if ($user->role !== 'owner') {
            $query->where('title', '!=', 'Permintaan Reset Password');
            if ($user->cabang_id) {
                $query->where('cabang_id', $user->cabang_id);
            }
        }
        
        $query->update(['is_read' => true]);

        return response()->json(['status' => 'success'], 200);
    }
}