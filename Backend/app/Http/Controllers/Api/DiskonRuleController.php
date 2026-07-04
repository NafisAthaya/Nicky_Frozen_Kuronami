<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\DiskonRule;
use Illuminate\Http\Request;

class DiskonRuleController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        $cabangId = ($user && $user->cabang_id) ? $user->cabang_id : 1;
        $rules = DiskonRule::where('cabang_id', $cabangId)->orderByDesc('id')->get();
        return response()->json(['data' => $rules]);
    }

    public function store(Request $request) {
        $user = $request->user();
        $cabangId = ($user && $user->cabang_id) ? $user->cabang_id : 1;
        $rule = DiskonRule::create([
            'cabang_id' => $cabangId,
            'nama_aturan' => $request->nama_aturan,
            'pemicu_hari' => $request->pemicu_hari,
            'diskon_persen' => $request->diskon_persen,
            'target_kategori' => $request->target_kategori,
            'is_active' => true
        ]);
        return response()->json(['data' => $rule]);
    }

    public function toggleStatus($id) {
        $rule = DiskonRule::findOrFail($id);
        $rule->is_active = !$rule->is_active;
        $rule->save();
        return response()->json(['data' => $rule]);
    }

    public function destroy($id) {
        DiskonRule::destroy($id);
        return response()->json(['status' => 'success']);
    }
}