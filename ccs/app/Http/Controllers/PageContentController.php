<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Illuminate\Http\Request;

class PageContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contents = PageContent::all();
        return response()->json($contents);
    }

    /**
     * Display the specified resource.
     */
    public function show($path)
    {
        $normalizedPath = ltrim($path, '/') === $path ? '/' . $path : $path;
        $content = PageContent::where('path', $normalizedPath)->first();
        
        if (!$content) {
            return response()->json(['content' => ''], 200);
        }
        
        return response()->json($content);
    }

    /**
     * Store a new resource.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'path' => 'required|string|unique:page_contents,path',
            'content' => 'required'
        ]);

        $pageContent = PageContent::create($data);
        
        return response()->json($pageContent, 201);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, $path)
    {
        $data = $request->validate([
            'content' => 'required'
        ]);

        $normalizedPath = ltrim($path, '/') === $path ? '/' . $path : $path;

        $pageContent = PageContent::updateOrCreate(
            ['path' => $normalizedPath],
            ['content' => $data['content']]
        );
        
        return response()->json($pageContent);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy($path)
    {
        $normalizedPath = ltrim($path, '/') === $path ? '/' . $path : $path;
        $content = PageContent::where('path', $normalizedPath)->first();
        
        if ($content) {
            $content->delete();
        }
        
        return response()->json(null, 204);
    }
}