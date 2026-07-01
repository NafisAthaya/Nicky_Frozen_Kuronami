<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
            public function uploadPhoto(Request $request)
        {
            $request->validate([
                'photo' => 'required|image|max:2048',
                'user_id' => 'required|integer',
            ]);

            $user = \App\Models\User::findOrFail($request->user_id);

            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }

            $path = $request->file('photo')->store(
                'profile',
                'public'
            );

            $user->foto = $path;
            $user->save();

            return response()->json([
                'success' => true,
                'photo' => asset('storage/' . $path),
                'path'  => $path,
            ]);
        }
}