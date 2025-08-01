<?php

namespace Database\Seeders;

use App\Models\NavItem;
use App\Models\NavSection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NavItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            'about' => [
                ['label' => 'Our Story', 'path' => 'story'],
                ['label' => 'Mission', 'path' => 'mission'],
                ['label' => 'Team', 'path' => 'team']
            ],
            'connect' => [
                ['label' => 'House Fellowship', 'path' => 'house-fellowship']
            ]
        ];

        foreach ($items as $sectionKey => $sectionItems) {
            $section = NavSection::where('key', $sectionKey)->first();

            foreach ($sectionItems as $item) {
                NavItem::firstOrCreate([
                    'nav_section_id' => $section->id,
                    'label' => $item['label'],
                    'path' => $item['path']
                ]);
            }
        }
    }
}
