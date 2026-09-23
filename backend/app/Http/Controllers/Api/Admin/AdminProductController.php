<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'images']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($request->query('stock_status') === 'low') {
            $query->where('stock_quantity', '<=', 5);
        }

        $products = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'nullable|string|max:50',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $slug = Str::slug($validated['name']) . '-' . Str::random(5);
        $sku = !empty($validated['sku']) ? $validated['sku'] : 'THY-' . strtoupper(Str::random(6));

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'category_id' => $validated['category_id'] ?? null,
            'sku' => $sku,
            'regular_price' => $validated['regular_price'],
            'sale_price' => $validated['sale_price'] ?? null,
            'stock_quantity' => $validated['stock_quantity'],
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if (!empty($validated['image_url'])) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $validated['image_url'],
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        ActivityLog::record(
            'CREATE_PRODUCT',
            "Created product '{$product->name}' (SKU: {$product->sku}, Price: Rs. {$product->regular_price})",
            'Product',
            $product->id,
            $request->user(),
            $request
        );

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product->load('images', 'category'),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'regular_price' => 'sometimes|required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'sku' => 'nullable|string|max:50',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $product->update($validated);

        if (!empty($validated['image_url'])) {
            $primaryImg = $product->images()->where('is_primary', true)->first();
            if ($primaryImg) {
                $primaryImg->update(['image_url' => $validated['image_url']]);
            } else {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $validated['image_url'],
                    'is_primary' => true,
                ]);
            }
        }

        ActivityLog::record(
            'UPDATE_PRODUCT',
            "Updated product '{$product->name}' specifications and pricing",
            'Product',
            $product->id,
            $request->user(),
            $request
        );

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product->load('images', 'category'),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $productName = $product->name;
        $product->delete();

        ActivityLog::record(
            'DELETE_PRODUCT',
            "Deleted product '{$productName}'",
            'Product',
            $id,
            $request->user(),
            $request
        );

        return response()->json([
            'success' => true,
            'message' => 'Product removed successfully',
        ]);
    }
}
