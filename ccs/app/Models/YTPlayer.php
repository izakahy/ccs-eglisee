<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YTPlayer extends Model
{
    /** @use HasFactory<\Database\Factories\YTPlayerFactory> */
    use HasFactory;

    protected $fillable = ['yt_url'];
}
