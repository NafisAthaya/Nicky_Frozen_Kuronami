<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class DiskonRule extends Model
{
    protected $fillable = ['cabang_id', 'nama_aturan', 'pemicu_hari', 'diskon_persen', 'target_kategori', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
}