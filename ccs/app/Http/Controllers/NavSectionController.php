<?php

namespace App\Http\Controllers;

use App\Models\NavSection;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NavSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sections = NavSection::with('items')->get();

        $formatted = $sections->mapWithKeys(function ($section) {
            return [
                $section->key => [
                    'path' => '/' . $section->key,
                    'label' => $section->label,
                    'items' => $section->items->map(function ($item) use ($section) {
                        return [
                            'label' => $item->label,
                            'path' => '/' . $section->key . '/' . ltrim($item->path, '/')
                        ];
                    })
                ]
            ];
        });

        return response()->json($formatted);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'key' => 'required|alpha_dash|unique:nav_sections',
            'label' => 'required|string|max:255'
        ]);

        $section = NavSection::create($data);
        return response()->json($section, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(NavSection $section)
    {
        return response()->json($section);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NavSection $section)
    {
        $data = $request->validate([
            'label' => 'required|string|max:255',
            'key' => [
                'required',
                'alpha_dash',
                Rule::unique('nav_sections')->ignore($section->id)
            ]
        ]);

        $section->update($data);
        return response()->json($section);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NavSection $section)
    {
        $section->items()->delete();
        $section->delete();
        return response()->noContent();
    }
}
