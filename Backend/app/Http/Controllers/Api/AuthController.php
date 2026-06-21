<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('username', $request->username)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Username atau password salah'
            ], 401);
        }

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user
        ]);
    }

   public function forgotPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email'
    ]);

    Mail::raw(
    'Klik link berikut untuk reset password:

    http://localhost:5173/reset-password',

    function ($message) use ($request) {
        $message->to($request->email)
                ->subject('Reset Password');
    }
);

    return response()->json([
        'success' => true
    ]);
}
}
