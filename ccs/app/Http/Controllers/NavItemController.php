<?php

namespace App\Http\Controllers;

use App\Models\NavItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NavItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return NavItem::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nav_section_id' => 'required|exists:nav_sections,id',
            'label' => 'required|string|max:255',
            'path' => [
                'required',
                'string',
                Rule::unique('nav_items')->where(function ($query) use ($request) {
                    return $query->where('nav_section_id', $request->nav_section_id);
                })
            ]
        ]);

        $item = NavItem::create($data);
        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(NavItem $item)
    {
        return response()->json($item, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NavItem $item)
    {
        $data = $request->validate([
            'label' => 'required|string|max:255',
            'path' => [
                'required',
                'string',
                Rule::unique('nav_items')
                    ->where('nav_section_id', $item->nav_section_id)
                    ->ignore($item->id)
            ]
        ]);

        $item->update($data);
        return response()->json($item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NavItem $item)
    {
        $item->delete();
        return response()->noContent();
    }
}
