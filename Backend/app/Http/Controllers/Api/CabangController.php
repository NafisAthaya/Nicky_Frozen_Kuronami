<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Cabang;
use Illuminate\Http\Request;

class CabangController extends Controller
{
    public function index() {
        return response()->json(['data' => Cabang::orderBy('id', 'asc')->get()]);
    }

    public function store(Request $request) {
        $request->validate([
            'nama_cabang' => 'required|string|max:255',
            'alamat' => 'required|string'
        ]);

        $cabang = Cabang::create([
            'nama_cabang' => $request->nama_cabang,
            'alamat' => $request->alamat,
            'manajer' => empty($request->manajer) ? 'Belum Ditentukan' : $request->manajer,
            'jam_operasional' => empty($request->jam_operasional) ? '08:00 - 21:00' : $request->jam_operasional,
            'status' => 'Buka'
        ]);
        return response()->json(['data' => $cabang]);
    }

    public function toggle($id) {
        $cabang = Cabang::findOrFail($id);
        $cabang->status = $cabang->status === 'Buka' ? 'Tutup/Renovasi' : 'Buka';
        $cabang->save();
        return response()->json(['data' => $cabang]);
    }

    public function destroy($id) {
        Cabang::destroy($id);
        return response()->json(['status' => 'success']);
    }
}