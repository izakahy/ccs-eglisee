<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavSection extends Model
{
    protected $fillable = ['key', 'label'];
    protected $appends = ['path'];

    public function items() {
        return $this->hasMany(NavItem::class);
    }

    public function getPathAttribute()
    {
        return "/{$this->key}";
    }
}
