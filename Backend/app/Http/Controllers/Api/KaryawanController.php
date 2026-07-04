<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class KaryawanController extends Controller
{
    // 1. Tampilkan semua staf di cabang tempat Owner bertugas
    public function index(Request $request)
    {
        $owner = $request->user();

        // Owner melihat SEMUA karyawan dari semua cabang (bukan hanya cabang owner)
        $query = User::with('cabang')
            ->where('id', '!=', $owner->id) // Sembunyikan akun owner itu sendiri
            ->whereIn('role', ['kasir', 'admin']) // Hanya tampilkan kasir & admin
            ->orderByDesc('id');

        $karyawan = $query->get();

        return response()->json(['data' => $karyawan], 200);
    }

    // 2. Simpan Staf (Kasir/Admin) Baru ke Database
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:kasir,admin',
            'cabang_id' => 'required|exists:cabangs,id',
        ]);

        // MENGAKALI ERROR: Buat username otomatis dari email (contoh: irzhafahri354)
        $autoUsername = explode('@', $request->email)[0] . rand(10, 99);

        $user = User::create([
            'name' => $request->name,
            'username' => $autoUsername, // <--- Data ini yang bikin error sebelumnya
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role,
            'cabang_id' => $request->cabang_id,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'is_active' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Karyawan baru berhasil didaftarkan',
            'data' => $user->load('cabang')
        ], 210);
    }
    // Update Data Karyawan
 public function update(Request $request, $id)
 {
     $user = User::findOrFail($id);

     $request->validate([
         'name' => 'required|string|max:255',
         'email' => 'required|string|email|max:255|unique:users,email,' . $id,
         'role' => 'required|in:kasir,admin',
         'cabang_id' => 'required|exists:cabangs,id',
     ]);

     $user->name = $request->name;
     $user->email = $request->email;
     $user->phone = $request->phone;
     $user->role = $request->role;
     $user->cabang_id = $request->cabang_id;

     // Jika password diisi, maka update passwordnya. Jika kosong, biarkan password lama.
     if ($request->filled('password')) {
         $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
     }

     $user->save();

     return response()->json([
         'status' => 'success',
         'message' => 'Data karyawan berhasil diperbarui',
         'data' => $user->load('cabang')
     ], 200);
     
 }
    // Toggle Status Aktif/Nonaktif Karyawan
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Status karyawan berhasil diperbarui',
            'data' => $user
        ], 200);
    }

    // Hapus Karyawan
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Karyawan berhasil dihapus',
        ], 200);
    }
}