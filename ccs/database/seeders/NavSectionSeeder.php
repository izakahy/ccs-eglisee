<?php

namespace Database\Seeders;

use App\Models\NavSection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NavSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            ['key' => 'about', 'label' => 'ABOUT'],
            ['key' => 'connect', 'label' => 'CONNECT'],
            ['key' => 'gallery', 'label' => 'GALLERY'],
            ['key' => 'give', 'label' => 'GIVE']
        ];

        foreach ($sections as $section) {
            NavSection::firstOrCreate(
                ['key' => $section['key']],
                ['label' => $section['label']]
            );
        }
    }
}
