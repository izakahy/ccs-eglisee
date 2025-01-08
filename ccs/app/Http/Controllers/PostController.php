<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return all post
        return Post::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $array = $request->validate([
            'name' => 'required:max:100',
            'desc' => 'required|max:500'
        ]);

        $post = Post::create($array);

        return ['post' => $post];
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return ['post' => $post];
        //return $post; //using route model binding
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $array = $request->validate([
            'name' => 'required:max:100',
            'desc' => 'required|max:500'
        ]);

        $post->update($array);

        return $post;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return ['message' => 'Post deleted' ];
    }
}
