<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OwnerDashboardController;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\Api\AdminDashboardController;

use App\Http\Controllers\Api\TransaksiController;

use App\Http\Controllers\Api\PengeluaranController;

Route::get('/owner/dashboard/stats', [OwnerDashboardController::class, 'stats']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/produks', [ProdukController::class, 'index']);
Route::get('/transaksi', [TransaksiController::class, 'index']);
Route::post('/transaksi', [TransaksiController::class, 'store']);
Route::get('/pengeluaran', [PengeluaranController::class, 'index']);
Route::post('/pengeluaran', [PengeluaranController::class, 'store']);

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('/dashboard-stats', [AdminDashboardController::class, 'stats']);
    Route::get('/produks', [AdminDashboardController::class, 'getProduks']);
    Route::post('/produks', [AdminDashboardController::class, 'storeProduk']);
    Route::put('/produks/{id}', [AdminDashboardController::class, 'updateProduk']);
    Route::delete('/produks/{id}', [AdminDashboardController::class, 'deleteProduk']);
    Route::get('/produk-batches', [AdminDashboardController::class, 'getBatches']);
    Route::post('/produk-batches', [AdminDashboardController::class, 'storeBatch']);
    Route::get('/kategoris', [AdminDashboardController::class, 'getKategoris']);
});