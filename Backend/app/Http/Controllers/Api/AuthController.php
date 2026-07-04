<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required',
        ]);
        $user = User::where('email', $request->username)
                    ->orWhere('username', $request->username)
                    ->first();

        // Validasi kecocokan username dan password
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Username atau password salah.'
            ], 401);
        }

        // Cek apakah akun karyawan aktif atau diblokir
        if ($user->is_active == false) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akun Anda sudah di-lock atau dihapus (sudah tidak terdaftar).'
            ], 403);
        }

        // Generate Token Akses Rahasia menggunakan Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // Load relasi cabang agar tersedia di frontend
        $user->load('cabang');

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'cabang_id' => $user->cabang_id,
                'cabang_nama' => $user->cabang?->nama_cabang ?? 'Belum Ditentukan',
            ]
        ], 200);
    }

    public function logout(Request $request)
    {
        // Hapus token yang sedang digunakan untuk logout
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil logout dari sistem.'
        ], 200);
    }
}
