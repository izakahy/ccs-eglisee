<?php

namespace App\Http\Controllers;

use App\Models\YTPlayer;
use Illuminate\Http\Request;

class YTPlayerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return YTPlayer::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'yt_url' => 'required|string'
        ]);

        $ytPlayer = YTPlayer::create($data);

        return ['ytPlayer' => $ytPlayer];
    }

    /**
     * Display the specified resource.
     */
    public function show(YTPlayer $yTPlayer)
    {
        return ['yTPlayer' => $yTPlayer];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, YTPlayer $yTPlayer)
    {
        $data = $request->validate([
            'yt_url' => 'required|string'
        ]);

        $yTPlayer->update($data);
        return $yTPlayer;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(YTPlayer $yTPlayer)
    {
        //
    }
}
