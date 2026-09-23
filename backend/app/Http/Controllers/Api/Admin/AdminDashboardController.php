<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\FlashSale;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalSales = Order::where('payment_status', 'paid')
            ->orWhere('order_status', 'delivered')
            ->sum('total');

        // If newly seeded and no completed orders yet, calculate an illustrative metric or real sum
        $orderCount = Order::count();
        $pendingOrders = Order::where('order_status', 'pending')->count();
        $totalProducts = Product::count();
        $lowStockCount = Product::where('stock_quantity', '<=', 5)->count();
        $activeFlashSales = FlashSale::where('is_active', true)
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now())
            ->count();

        $recentOrders = Order::with('items')->latest()->take(6)->get();

        $topCategories = Category::whereNull('parent_id')
            ->withCount('products')
            ->orderBy('products_count', 'desc')
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_sales' => (float) $totalSales,
                'total_orders' => $orderCount,
                'pending_orders' => $pendingOrders,
                'total_products' => $totalProducts,
                'low_stock_products' => $lowStockCount,
                'active_flash_sales' => $activeFlashSales,
                'recent_orders' => $recentOrders,
                'top_categories' => $topCategories,
            ],
        ]);
    }
}
