<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\PengeluaranController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\HoldOrderController;
use App\Http\Controllers\Api\KaryawanController;
use App\Http\Controllers\Api\PengaturanTokoController;
use App\Http\Controllers\Api\PengajuanStokController;
use App\Http\Controllers\Api\SesiKasirController;
use App\Http\Controllers\Api\DiskonRuleController;
use App\Http\Controllers\Api\NotifikasiController;
use App\Http\Controllers\Api\CabangController;
// Note: PengajuanStokController and SesiKasirController will be imported later when created.

// Public Routes (No Auth)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('/password-notification', [AuthController::class, 'getPasswordNotification']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    
    // ==========================================
    // NOTIFIKASI (Shared for all authenticated users)
    // ==========================================
    Route::get('/notifikasi', [NotifikasiController::class, 'index']);
    Route::patch('/notifikasi/{id}/read', [NotifikasiController::class, 'markAsRead']);
    Route::post('/notifikasi/read-all', [NotifikasiController::class, 'markAllRead']);

    // ==========================================
    // 1. OWNER ROUTES
    // ==========================================
    Route::prefix('owner')->group(function () {
        // Beranda / Stats
        Route::get('/dashboard/stats', [DashboardController::class, 'index']);
        
        // Karyawan
        Route::get('/karyawan', [KaryawanController::class, 'index']);
        Route::post('/karyawan', [KaryawanController::class, 'store']);
        Route::put('/karyawan/{id}', [KaryawanController::class, 'update']);
        Route::put('/karyawan/{id}/toggle', [KaryawanController::class, 'toggleStatus']);
        Route::delete('/karyawan/{id}', [KaryawanController::class, 'destroy']);
        
        // Pengaturan Toko (Pajak & Pembulatan)
        Route::get('/pengaturan-toko', [PengaturanTokoController::class, 'index']);
        Route::post('/pengaturan-toko', [PengaturanTokoController::class, 'update']);
        
        // Diskon Otomatis
        Route::get('/diskon-rules', [DiskonRuleController::class, 'index']);
        Route::post('/diskon-rules', [DiskonRuleController::class, 'store']);
        Route::put('/diskon-rules/{id}', [DiskonRuleController::class, 'update']);
        Route::delete('/diskon-rules/{id}', [DiskonRuleController::class, 'destroy']);
        Route::patch('/diskon-rules/{id}/toggle', [DiskonRuleController::class, 'toggleStatus']);
        
        // Pengajuan Stok (Owner Approval)
        Route::get('/pengajuan-stok', [PengajuanStokController::class, 'index']);
        Route::put('/pengajuan-stok/{id}', [PengajuanStokController::class, 'update']);
        
        // Stok Barang (Owner)
        Route::get('/stok', [ProdukController::class, 'index']);
        Route::put('/stok/{id}', [\App\Http\Controllers\Api\AdminDashboardController::class, 'updateProduk']);

        // Cabang
        Route::get('/cabang', [CabangController::class, 'index']);
        Route::post('/cabang', [CabangController::class, 'store']);
        Route::put('/cabang/{id}/toggle', [CabangController::class, 'toggle']);
        Route::delete('/cabang/{id}', [CabangController::class, 'destroy']);

        // Kategori
        Route::get('/kategoris', [App\Http\Controllers\Api\KategoriController::class, 'index']);
        
        // Laporan Transaksi
        Route::get('/transaksi', [TransaksiController::class, 'index']);
        Route::get('/laporan', [TransaksiController::class, 'index']);
    });

    // ==========================================
    // 2. ADMIN ROUTES
    // ==========================================
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard-stats', [AdminDashboardController::class, 'stats']);
        
        // Master Produk
        Route::get('/produks', [AdminDashboardController::class, 'getProduks']);
        Route::post('/produks', [AdminDashboardController::class, 'storeProduk']);
        Route::put('/produks/{id}', [AdminDashboardController::class, 'updateProduk']);
        Route::delete('/produks/{id}', [AdminDashboardController::class, 'deleteProduk']);
        
        // Master Kategori
        Route::get('/kategoris', [App\Http\Controllers\Api\KategoriController::class, 'index']);
        Route::post('/kategoris', [App\Http\Controllers\Api\KategoriController::class, 'store']);
        Route::put('/kategoris/{id}', [App\Http\Controllers\Api\KategoriController::class, 'update']);
        Route::delete('/kategoris/{id}', [App\Http\Controllers\Api\KategoriController::class, 'destroy']);
        
        // Barang Masuk (Batches)
        Route::get('/produk-batches', [AdminDashboardController::class, 'getBatches']);
        Route::post('/produk-batches', [AdminDashboardController::class, 'storeBatch']);
        Route::put('/produk-batches/{id}', [AdminDashboardController::class, 'updateBatch']);
        
        // Pengajuan Stok (Admin)
        Route::post('/pengajuan-stok', [PengajuanStokController::class, 'store']);
        Route::get('/pengajuan-stok', [PengajuanStokController::class, 'index']);

        // Pengaturan Toko (Struk Settings)
        Route::get('/pengaturan-toko', [PengaturanTokoController::class, 'index']);
        Route::post('/pengaturan-toko', [PengaturanTokoController::class, 'update']);
    });

    // ==========================================
    // 3. KASIR ROUTES
    // ==========================================
    Route::prefix('kasir')->group(function () {
        Route::get('/produks', [ProdukController::class, 'index']);
        Route::get('/kategoris', [App\Http\Controllers\Api\KategoriController::class, 'index']);
        
        // Transaksi (POS)
        Route::get('/transaksi', [TransaksiController::class, 'index']);
        Route::post('/transaksi', [TransaksiController::class, 'store']);
        
        // Pengeluaran Laci
        Route::get('/pengeluaran', [PengeluaranController::class, 'index']);
        Route::post('/pengeluaran', [PengeluaranController::class, 'store']);
        
        // Pengaturan Toko (Untuk info pajak)
        Route::get('/pengaturan-toko', [PengaturanTokoController::class, 'index']);
        
        // Pesanan Tersimpan (Hold)
        Route::get('/hold-orders', [HoldOrderController::class, 'index']);
        Route::post('/hold-orders', [HoldOrderController::class, 'store']);
        Route::get('/hold-orders/{id}', [HoldOrderController::class, 'show']);
        Route::delete('/hold-orders/{id}', [HoldOrderController::class, 'destroy']);
        
        // Sesi Kasir (Tutup Shift)
        Route::post('/sesi-kasir', [SesiKasirController::class, 'store']);
    });

    // ==========================================
    // GLOBAL PROTECTED ROUTES
    // ==========================================
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);
    Route::put('/profile/update', [ProfileController::class, 'updateProfile']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
});
