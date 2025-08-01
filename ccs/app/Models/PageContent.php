<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $fillable = ['path', 'content'];

    /**
     * Cast content to/from JSON automatically
     * @var array
     */
    protected $casts = [
        'content' => 'json',
    ];
}
