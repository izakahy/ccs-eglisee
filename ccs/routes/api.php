<?php

use App\Http\Controllers\ContentController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\NavItemController;
use App\Http\Controllers\NavSectionController;
use App\Http\Controllers\PageContentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\YTPlayerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Authentication routes
Route::prefix('auth')->group(function () {
    Route::get('google/redirect', [GoogleAuthController::class, 'redirect']);
    Route::get('google/callback', [GoogleAuthController::class, 'callback']);
    Route::post('google/logout', [GoogleAuthController::class, 'logout'])
        ->middleware('auth:sanctum');
});

// Public routes
Route::get('yt-urls/{yTPlayer}', [YTPlayerController::class, 'show']);
Route::get('contents/{content}', [ContentController::class, 'show']);
Route::get('contents', [ContentController::class, 'index']);
Route::get('sections/{section}', [NavSectionController::class, 'show']);
Route::get('posts', [PostController::class, 'index']);
Route::get('posts/{post}', [PostController::class, 'show']);
Route::get('sections', [NavSectionController::class, 'index']);
Route::get('items', [NavItemController::class, 'show']);
Route::get('page-contents', [PageContentController::class, 'index']); 
Route::get('page-contents/{path}', [PageContentController::class, 'show'])->where('path', '.*');

// User routes
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json([
            'token' => $request->session()->get('token'),
            'user' => $request->user(),
        ]);
    });

    // Posts resource routes
    Route::apiResource('posts', PostController::class)
        ->except('index', 'show');
    Route::apiResource('yt-urls', YTPlayerController::class)
        ->parameters(['yt-urls' => 'yTPlayer'])
        ->except(['show']);
    Route::apiResource('contents', ContentController::class)
        ->except('index', 'show');
    Route::apiResource('sections', NavSectionController::class)
        ->except('index','show');
    Route::apiResource('items', NavItemController::class)
        ->except('index', 'show');
    Route::put('page-contents/{path}', [PageContentController::class, 'update'])->where('path', '.*');
    Route::delete('page-contents/{path}', [PageContentController::class, 'destroy'])->where('path', '.*');
    Route::post('page-contents', [PageContentController::class, 'store']);
});
