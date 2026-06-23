<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OwnerDashboardController;
use App\Http\Controllers\Api\ProdukController;

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