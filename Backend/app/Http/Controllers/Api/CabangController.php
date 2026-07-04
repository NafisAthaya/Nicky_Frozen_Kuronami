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
        $cabang = Cabang::create([
            'nama_cabang' => $request->nama_cabang,
            'alamat' => $request->alamat,
            'manajer' => $request->manajer ?? 'Belum Ditentukan',
            'jam_operasional' => $request->jam_operasional ?? '08:00 - 21:00',
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