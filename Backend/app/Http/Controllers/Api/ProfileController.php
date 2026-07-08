<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Upload Foto Profil
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048',
            'user_id' => 'required|integer',
        ]);

        $user = User::findOrFail($request->user_id);

        if ($user->foto) {
            Storage::disk('public')->delete($user->foto);
        }

        $file = $request->file('photo');
        $path = '';

        if (function_exists('imagecreatefromstring')) {
            $image = @imagecreatefromstring(file_get_contents($file));
            if ($image) {
                $filename = time() . '_' . uniqid() . '.webp';
                $path = 'profile/' . $filename;
                
                ob_start();
                imagewebp($image, null, 80);
                $image_data = ob_get_clean();
                imagedestroy($image);
                
                Storage::disk('public')->put($path, $image_data);
            }
        }

        if (empty($path)) {
            // Fallback jika ekstensi GD tidak aktif
            $path = $file->store('profile', 'public');
        }

        $user->foto = $path;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Foto profil berhasil diperbarui',
            'photo' => asset('storage/' . $path),
            'path' => $path,
        ], 200);
    }

    /**
     * Update Profil
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui',
            'data' => $user,
        ], 200);
    }

    /**
     * Update Password
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current' => 'required',
            'new' => 'required|string|min:6',
        ]);

        if (!Hash::check($request->current, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password saat ini salah',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password berhasil diperbarui',
        ], 200);
    }
}