<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'title_line1',
        'title_line2',
        'subtext',
        'show_badge',
        'badge_top',
        'badge_value',
        'badge_bottom',
        'cta_text',
        'cta_link',
        'box_color',
        'accent_color',
        'gradient_from',
        'gradient_via',
        'gradient_to',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'show_badge' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
