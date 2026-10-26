<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\HeroSlide;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class HeroSlideTest extends TestCase
{
    use RefreshDatabase;

    private function adminToken(): string
    {
        return Admin::create([
            'name' => 'Editor', 'email' => 'editor@thyaga.lk', 'password' => Hash::make('admin-pass-123'),
            'role' => 'editor', 'status' => 'active',
        ])->createToken('admin-token', ['admin'])->plainTextToken;
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title_line1' => 'Avurudu Sale', 'title_line2' => 'Big Discounts', 'subtext' => 'Limited time',
            'show_badge' => true, 'badge_top' => 'UP TO', 'badge_value' => '70%', 'badge_bottom' => 'OFF',
            'cta_text' => 'Shop Now', 'cta_link' => '/shop?category=home',
            'box_color' => '#ff0000', 'accent_color' => '#00ff00',
            'gradient_from' => '#000000', 'gradient_via' => '#111111', 'gradient_to' => '#222222',
            'is_active' => true,
        ], $overrides);
    }

    public function test_migration_seeds_the_original_five_slides(): void
    {
        $this->getJson('/api/hero-slides')
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('data.0.title_line1', 'Big Savings');
    }

    public function test_public_endpoint_only_returns_active_slides_in_order(): void
    {
        HeroSlide::query()->update(['is_active' => false]);
        HeroSlide::create($this->payload(['title_line1' => 'Second', 'sort_order' => 2]));
        HeroSlide::create($this->payload(['title_line1' => 'First', 'sort_order' => 1]));

        $this->getJson('/api/hero-slides')
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.title_line1', 'First');
    }

    public function test_customers_and_guests_cannot_manage_slides(): void
    {
        $this->postJson('/api/admin/hero-slides', $this->payload())->assertUnauthorized();

        $customer = User::create([
            'name' => 'C', 'email' => 'c@example.com', 'password' => Hash::make('x-pass-123'),
            'role' => 'customer', 'status' => 'active',
        ])->createToken('customer-token', ['customer'])->plainTextToken;

        $this->withToken($customer)->postJson('/api/admin/hero-slides', $this->payload())->assertForbidden();
    }

    public function test_admin_can_create_update_reorder_and_delete(): void
    {
        $token = $this->adminToken();

        $id = $this->withToken($token)->postJson('/api/admin/hero-slides', $this->payload())
            ->assertCreated()->json('data.id');

        $this->withToken($token)->putJson("/api/admin/hero-slides/{$id}", ['title_line1' => 'Renamed', 'is_active' => false])
            ->assertOk()->assertJsonPath('data.title_line1', 'Renamed');

        $ids = HeroSlide::orderByDesc('id')->pluck('id')->all();
        $this->withToken($token)->putJson('/api/admin/hero-slides/reorder', ['ids' => $ids])
            ->assertOk()->assertJsonPath('data.0.id', $ids[0]);

        $this->withToken($token)->deleteJson("/api/admin/hero-slides/{$id}")->assertOk();
        $this->assertDatabaseMissing('hero_slides', ['id' => $id]);
    }

    public function test_unsafe_links_and_bad_colours_are_rejected(): void
    {
        $token = $this->adminToken();

        foreach (['javascript:alert(1)', '//evil.example', 'http://insecure.example', 'data:text/html,hi'] as $link) {
            $this->withToken($token)->postJson('/api/admin/hero-slides', $this->payload(['cta_link' => $link]))
                ->assertUnprocessable()->assertJsonValidationErrors('cta_link');
        }

        $this->withToken($token)->postJson('/api/admin/hero-slides', $this->payload(['box_color' => 'red; background:url(x)']))
            ->assertUnprocessable()->assertJsonValidationErrors('box_color');

        $this->withToken($token)->postJson('/api/admin/hero-slides', $this->payload(['cta_link' => 'https://mall.thyaga.lk/deals']))
            ->assertCreated();
    }
}
