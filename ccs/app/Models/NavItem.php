<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavItem extends Model
{
    protected $fillable = ['nav_section_id', 'label', 'path'];

    public function section() {
        return $this->belongsTo(NavSection::class);
    }
}
