<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Content::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:50',
            'body' => 'required|string|max:1000'
        ]);

        $content = Content::create($data);
        return ['content' => $content];
    }

    /**
     * Display the specified resource.
     */
    public function show(Content $content)
    {
        return ['content' => $content];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Content $content)
    {
        $data = $request->validate([
            'title' => 'required|string|max:50',
            'body' => 'required|string|max:1000'
        ]);

        $content->update($data);
        return $content;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Content $content)
    {
        $content->delete();
        return ['message' => 'Content deleted'];
    }
}
