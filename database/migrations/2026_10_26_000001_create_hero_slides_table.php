<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('title_line1', 60);
            $table->string('title_line2', 60)->nullable();
            $table->string('subtext', 160)->nullable();
            $table->boolean('show_badge')->default(true);
            $table->string('badge_top', 12)->nullable();
            $table->string('badge_value', 8)->nullable();
            $table->string('badge_bottom', 12)->nullable();
            $table->string('cta_text', 30)->default('Shop Now');
            $table->string('cta_link', 255)->default('/shop');
            $table->string('box_color', 7)->default('#7c3aed');
            $table->string('accent_color', 7)->default('#f472b6');
            $table->string('gradient_from', 7)->default('#1a0033');
            $table->string('gradient_via', 7)->default('#2e0a5c');
            $table->string('gradient_to', 7)->default('#5b1a8f');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed with the slides that were previously hard-coded in the storefront.
        $now = now();
        $slides = [
            ['Big Savings', 'Brighter Living', 'Electronics, Home, Fashion, Beauty & more', '60%', '/shop', '#7c3aed', '#f472b6', '#1a0033', '#2e0a5c', '#5b1a8f'],
            ['Smarter Devices', 'Better Everyday', 'Premium Audio, Smartwatches & Gadgets', '50%', '/shop?category=electronics', '#2563eb', '#22d3ee', '#030a2e', '#0b1f5c', '#3b0a6b'],
            ['Trending Styles', 'Modern Living', 'Designer Apparel, Fragrances & Accessories', '45%', '/shop?category=fashion', '#e11d48', '#fbbf24', '#2a0018', '#5c0a33', '#8f1a4f'],
            ['Home & Living', 'Smart Essentials', 'Cookware, Bedding, Decor & Appliances', '55%', '/shop?category=home', '#0d9488', '#a3e635', '#001f1c', '#063d3a', '#2e0a5c'],
            ['Exclusive Deals', 'Mega Savings', 'Daily Essentials & Groceries Delivered Fast', '40%', '/shop', '#f59e0b', '#fb7185', '#240046', '#4a0a3d', '#8f2a0a'],
        ];

        DB::table('hero_slides')->insert(array_map(fn ($s, $i) => [
            'title_line1' => $s[0],
            'title_line2' => $s[1],
            'subtext' => $s[2],
            'show_badge' => true,
            'badge_top' => 'UP TO',
            'badge_value' => $s[3],
            'badge_bottom' => 'OFF',
            'cta_text' => 'Shop Now',
            'cta_link' => $s[4],
            'box_color' => $s[5],
            'accent_color' => $s[6],
            'gradient_from' => $s[7],
            'gradient_via' => $s[8],
            'gradient_to' => $s[9],
            'sort_order' => $i,
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ], $slides, array_keys($slides)));
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
    }
};
