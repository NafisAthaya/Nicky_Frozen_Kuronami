<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PasswordResetRequest;
use App\Models\Notifikasi;
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

        // Cek ketersediaan user
        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau Username salah.'
            ], 401);
        }

        // Cek kecocokan password
        if (! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password yang Anda masukkan salah.'
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

        // Clear any resolved password reset requests
        PasswordResetRequest::where('user_id', $user->id)
            ->where('status', 'resolved')
            ->update([
                'status' => 'completed',
                'new_password_plain' => null
            ]);

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
                'foto' => $user->foto,
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

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email tidak terdaftar.'
            ], 404);
        }

        // Create or update pending request
        PasswordResetRequest::updateOrCreate(
            ['user_id' => $user->id, 'status' => 'pending'],
            ['requested_email' => $request->email]
        );

        // Notify Owner
        Notifikasi::create([
            'cabang_id' => $user->cabang_id ?? 1, // Fallback to 1 if null just in case
            'type' => 'warning',
            'title' => 'Permintaan Reset Password',
            'description' => "{$user->name} ({$user->role}) meminta reset password. [email:{$user->email}]",
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan reset password berhasil dikirim ke Owner.'
        ]);
    }

    public function getPasswordNotification(Request $request)
    {
        $email = $request->query('email');
        if (!$email) {
            return response()->json(['success' => false], 400);
        }

        $user = User::with('cabang')->where('email', $email)->first();
        if (!$user) {
            return response()->json(['success' => false], 404);
        }

        $resetRequest = PasswordResetRequest::where('user_id', $user->id)
            ->where('status', 'resolved')
            ->first();

        if (!$resetRequest) {
            return response()->json(['success' => false, 'data' => null]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'email' => $user->email,
                'role' => ucfirst($user->role),
                'cabang_nama' => $user->cabang ? $user->cabang->nama_cabang : 'Belum Ditentukan',
                'new_password_plain' => $resetRequest->new_password_plain
            ]
        ]);
    }
}
