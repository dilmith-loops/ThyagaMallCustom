<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Merchant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'code',
        'business_type',
        'contact_person',
        'email',
        'phone',
        'city',
        'address',
        'commission_rate',
        'logo_url',
        'banner_url',
        'website',
        'description',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'commission_rate' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
