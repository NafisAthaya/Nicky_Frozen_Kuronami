<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HoldOrder;
use App\Models\HoldOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HoldOrderController extends Controller
{
    public function index()
    {
        $orders = HoldOrder::with('items.produk')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {

            $hold = HoldOrder::create([
            'no_antrian' => 'HD-' . now()->format('YmdHis'),
            'nama_pelanggan' => $request->nama_pelanggan,
            'user_id' => 1,
            'cabang_id' => 1,
            'subtotal' => $request->subtotal,
            'status' => 'hold',
            ]);

            foreach ($request->items as $item) {

                HoldOrderItem::create([
                    'hold_order_id' => $hold->id,
                    'produk_id' => $item['produk_id'],
                    'qty' => $item['qty'],
                    'harga' => $item['harga'],
                    'subtotal' => $item['qty'] * $item['harga'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil disimpan.',
                'data' => $hold
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ],500);

        }
    }

    public function show($id)
    {
        $order = HoldOrder::with('items.produk')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    public function destroy($id)
    {
        $hold = HoldOrder::findOrFail($id);

        HoldOrderItem::where(
            'hold_order_id',
            $hold->id
        )->delete();

        $hold->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dihapus.'
        ]);
    }
}