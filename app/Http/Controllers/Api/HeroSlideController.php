<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;

class HeroSlideController extends Controller
{
    /**
     * Active homepage hero slides, in display order.
     * Returns an empty list (storefront falls back to built-in slides) if the
     * table hasn't been created on this server yet.
     */
    public function index(): JsonResponse
    {
        try {
            $slides = HeroSlide::where('is_active', true)->ordered()->get();
        } catch (QueryException $e) {
            report($e);
            $slides = collect();
        }

        return response()->json([
            'success' => true,
            'data' => $slides,
        ]);
    }
}
