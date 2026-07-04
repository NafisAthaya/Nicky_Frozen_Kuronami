<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Produk;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    public function index(Request $request)
    {
        $cabangId = $request->query('cabang_id');
        
        $query = Kategori::query();
        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }
        
        $kategoris = $query->get()->map(function ($kategori) {
            return [
                'id' => $kategori->id,
                'name' => $kategori->nama_kategori,
                'description' => $kategori->description,
                'product_count' => Produk::where('kategori', $kategori->nama_kategori)
                    ->where('cabang_id', $kategori->cabang_id)
                    ->count(),
            ];
        });

        return response()->json($kategoris);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $user = $request->user();
        $cabangId = ($user && $user->cabang_id) ? $user->cabang_id : 1; // Fallback for testing

        // Check if category name already exists in this branch
        $exists = Kategori::where('cabang_id', $cabangId)
            ->where('nama_kategori', $request->name)
            ->exists();
            
        if ($exists) {
            return response()->json(['message' => 'Kategori dengan nama ini sudah ada.'], 400);
        }

        $kategori = Kategori::create([
            'cabang_id' => $cabangId,
            'nama_kategori' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori berhasil ditambahkan',
            'data' => [
                'id' => $kategori->id,
                'name' => $kategori->nama_kategori,
                'description' => $kategori->description,
                'product_count' => 0
            ]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $kategori = Kategori::findOrFail($id);
        
        // Check if new name exists and is not this one
        $exists = Kategori::where('cabang_id', $kategori->cabang_id)
            ->where('nama_kategori', $request->name)
            ->where('id', '!=', $id)
            ->exists();
            
        if ($exists) {
            return response()->json(['message' => 'Kategori dengan nama ini sudah ada.'], 400);
        }

        $oldName = $kategori->nama_kategori;
        $newName = $request->name;

        $kategori->nama_kategori = $newName;
        $kategori->description = $request->description;
        $kategori->save();

        // Update all related products with the new category name
        if ($oldName !== $newName) {
            Produk::where('cabang_id', $kategori->cabang_id)
                ->where('kategori', $oldName)
                ->update(['kategori' => $newName]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori berhasil diupdate',
            'data' => [
                'id' => $kategori->id,
                'name' => $kategori->nama_kategori,
                'description' => $kategori->description,
                'product_count' => Produk::where('kategori', $newName)
                    ->where('cabang_id', $kategori->cabang_id)
                    ->count(),
            ]
        ]);
    }

    public function destroy($id)
    {
        $kategori = Kategori::findOrFail($id);
        
        // Remove category name from products (set to null or empty)
        Produk::where('cabang_id', $kategori->cabang_id)
            ->where('kategori', $kategori->nama_kategori)
            ->update(['kategori' => null]);
            
        $kategori->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori berhasil dihapus'
        ]);
    }
}
