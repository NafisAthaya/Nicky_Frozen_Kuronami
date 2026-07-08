<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/api/kasir/sesi-kasir', 'POST', [
    'waktu_tutup' => '2026-07-07T09:07:00.000Z',
    'saldo_awal' => 0,
    'total_penjualan' => 0,
    'total_pengeluaran' => 0,
    'saldo_akhir_sistem' => 0,
    'saldo_aktual' => 0,
    'selisih' => 0,
    'catatan' => '',
    'nama_shift' => 'Shift 1'
]);
$request->headers->set('Accept', 'application/json');

// fake auth
$user = \App\Models\User::find(1);
$app->make('auth')->guard('sanctum')->setUser($user);

$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
