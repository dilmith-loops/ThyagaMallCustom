<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\FlashSale;
use App\Models\FlashSaleItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminFlashSaleController extends Controller
{
    public function index(): JsonResponse
    {
        $flashSales = FlashSale::with(['items.product.images'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $flashSales,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'banner_url' => 'nullable|url',
            'is_active' => 'boolean',
        ]);

        $flashSale = FlashSale::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Flash Sale campaign created successfully',
            'data' => $flashSale,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $flashSale = FlashSale::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'banner_url' => 'nullable|url',
            'is_active' => 'boolean',
        ]);

        $flashSale->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Flash Sale campaign updated successfully',
            'data' => $flashSale->load('items.product.images'),
        ]);
    }

    public function addItem(Request $request, int $flashSaleId): JsonResponse
    {
        $flashSale = FlashSale::findOrFail($flashSaleId);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'flash_price' => 'required|numeric|min:1',
            'quantity_limit' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        $item = FlashSaleItem::updateOrCreate(
            [
                'flash_sale_id' => $flashSale->id,
                'product_id' => $product->id,
            ],
            [
                'flash_price' => $validated['flash_price'],
                'quantity_limit' => $validated['quantity_limit'],
                'quantity_sold' => 0,
                'sort_order' => $flashSale->items()->count(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Product added to Flash Sale successfully',
            'data' => $item->load('product.images'),
        ]);
    }

    public function removeItem(int $flashSaleId, int $itemId): JsonResponse
    {
        $item = FlashSaleItem::where('flash_sale_id', $flashSaleId)->where('id', $itemId)->firstOrFail();
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from Flash Sale',
        ]);
    }
}
