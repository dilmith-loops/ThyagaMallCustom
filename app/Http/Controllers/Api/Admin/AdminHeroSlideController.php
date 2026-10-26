<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\HeroSlide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminHeroSlideController extends Controller
{
    private const HEX = 'regex:/^#[0-9a-fA-F]{6}$/';

    // Site-relative path or an https URL — never javascript:, data:, etc.
    private const LINK = 'regex:/^(\/(?!\/)[^\s]*|https:\/\/[^\s]+)$/';

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => HeroSlide::ordered()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $validated['sort_order'] = (int) HeroSlide::max('sort_order') + 1;

        $slide = HeroSlide::create($validated);

        ActivityLog::record('CREATE_HERO_SLIDE', "Created homepage hero slide '{$slide->title_line1}'", 'HeroSlide', $slide->id, $request->user(), $request);

        return response()->json([
            'success' => true,
            'message' => 'Hero slide created successfully',
            'data' => $slide,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $slide = HeroSlide::findOrFail($id);
        $validated = $request->validate($this->rules(partial: true));

        $slide->update($validated);

        ActivityLog::record('UPDATE_HERO_SLIDE', "Updated homepage hero slide '{$slide->title_line1}'", 'HeroSlide', $slide->id, $request->user(), $request);

        return response()->json([
            'success' => true,
            'message' => 'Hero slide updated successfully',
            'data' => $slide,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $slide = HeroSlide::findOrFail($id);
        $title = $slide->title_line1;
        $slide->delete();

        ActivityLog::record('DELETE_HERO_SLIDE', "Deleted homepage hero slide '{$title}'", 'HeroSlide', $id, $request->user(), $request);

        return response()->json([
            'success' => true,
            'message' => "Hero slide '{$title}' deleted",
        ]);
    }

    /**
     * Save a new display order: { "ids": [3, 1, 2, ...] }
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|distinct|exists:hero_slides,id',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['ids'] as $position => $id) {
                HeroSlide::whereKey($id)->update(['sort_order' => $position]);
            }
        });

        ActivityLog::record('REORDER_HERO_SLIDES', 'Reordered homepage hero slides', 'HeroSlide', null, $request->user(), $request);

        return response()->json([
            'success' => true,
            'message' => 'Slide order saved',
            'data' => HeroSlide::ordered()->get(),
        ]);
    }

    private function rules(bool $partial = false): array
    {
        $required = $partial ? 'sometimes|required' : 'required';

        return [
            'title_line1' => "{$required}|string|max:60",
            'title_line2' => 'nullable|string|max:60',
            'subtext' => 'nullable|string|max:160',
            'show_badge' => 'sometimes|boolean',
            'badge_top' => 'nullable|string|max:12',
            'badge_value' => 'nullable|string|max:8',
            'badge_bottom' => 'nullable|string|max:12',
            'cta_text' => "{$required}|string|max:30",
            'cta_link' => [$partial ? 'sometimes' : 'required', 'string', 'max:255', self::LINK],
            'box_color' => [$partial ? 'sometimes' : 'required', self::HEX],
            'accent_color' => [$partial ? 'sometimes' : 'required', self::HEX],
            'gradient_from' => [$partial ? 'sometimes' : 'required', self::HEX],
            'gradient_via' => [$partial ? 'sometimes' : 'required', self::HEX],
            'gradient_to' => [$partial ? 'sometimes' : 'required', self::HEX],
            'is_active' => 'sometimes|boolean',
        ];
    }
}
