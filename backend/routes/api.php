<?php

use App\Http\Controllers\Api\Admin\AdminActivityLogController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminFlashSaleController;
use App\Http\Controllers\Api\Admin\AdminMerchantController;
use App\Http\Controllers\Api\Admin\AdminNewsletterController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminStaffController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FlashSaleController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerAuthController;
use App\Http\Controllers\Api\Payment\WebxpayController;
use App\Http\Controllers\Api\ThyagaVoucherController;
use App\Http\Controllers\Api\VoucherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health Check & Root API Status
Route::get('/', function () {
    return response()->json([
        'status' => 'online',
        'app' => 'Thyaga Mall API',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/health', function () {
    try {
        $dbStatus = \Illuminate\Support\Facades\DB::connection()->getPdo() ? 'connected' : 'disconnected';
    } catch (\Throwable $e) {
        $dbStatus = 'error: ' . $e->getMessage();
    }
    return response()->json([
        'status' => 'ok',
        'database' => $dbStatus,
    ]);
});

// Public Customer Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [CustomerAuthController::class, 'register']);
    Route::post('/login', [CustomerAuthController::class, 'login']);
});

// Authenticated Customer Endpoints
Route::middleware(['auth:sanctum'])->prefix('user')->group(function () {
    Route::get('/me', [CustomerAuthController::class, 'me']);
    Route::get('/orders', [CustomerAuthController::class, 'orders']);
    Route::post('/logout', [CustomerAuthController::class, 'logout']);
});

// Public Storefront Endpoints
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{slug}', [CategoryController::class, 'show']);
});

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/featured', [ProductController::class, 'featured']);
    Route::get('/{slug}', [ProductController::class, 'show']);
});

Route::get('/flash-sale/active', [FlashSaleController::class, 'active']);

Route::post('/vouchers/apply', [VoucherController::class, 'apply']);

// Thyāga Gift Voucher Endpoints
Route::prefix('vouchers/thyaga')->group(function () {
    Route::get('/health', [ThyagaVoucherController::class, 'health']);
    Route::get('/details/{code}', [ThyagaVoucherController::class, 'details']);
    Route::post('/initiate', [ThyagaVoucherController::class, 'initiate']);
    Route::post('/verify-otp', [ThyagaVoucherController::class, 'verifyOtp']);
    Route::post('/cancel', [ThyagaVoucherController::class, 'cancel']);
});

Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

Route::prefix('orders')->group(function () {
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{order_number}', [OrderController::class, 'show']);
});

// WebXpay Payment Gateway Endpoints
Route::prefix('payment/webxpay')->group(function () {
    Route::post('/initiate/{order_number}', [WebxpayController::class, 'initiate']);
    Route::match(['get', 'post'], '/callback', [WebxpayController::class, 'callback'])->name('payment.webxpay.callback');
});

// Admin Authentication (Public)
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// Admin Protected Routes
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);

    // Dashboard
    Route::get('/stats', [AdminDashboardController::class, 'stats']);

    // Products Management
    Route::get('/products/export', [AdminProductController::class, 'export']);
    Route::get('/products/template', [AdminProductController::class, 'sampleTemplate']);
    Route::post('/products/import', [AdminProductController::class, 'import']);
    Route::get('/products', [AdminProductController::class, 'index']);
    Route::post('/products', [AdminProductController::class, 'store']);
    Route::put('/products/{id}', [AdminProductController::class, 'update']);
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);

    // Merchants Management
    Route::get('/merchants', [AdminMerchantController::class, 'index']);
    Route::post('/merchants', [AdminMerchantController::class, 'store']);
    Route::get('/merchants/{id}', [AdminMerchantController::class, 'show']);
    Route::put('/merchants/{id}', [AdminMerchantController::class, 'update']);
    Route::delete('/merchants/{id}', [AdminMerchantController::class, 'destroy']);
    Route::patch('/merchants/{id}/status', [AdminMerchantController::class, 'toggleStatus']);
    Route::get('/merchants/{id}/products', [AdminMerchantController::class, 'products']);

    // Flash Sales Management
    Route::get('/flash-sales', [AdminFlashSaleController::class, 'index']);
    Route::post('/flash-sales', [AdminFlashSaleController::class, 'store']);
    Route::put('/flash-sales/{id}', [AdminFlashSaleController::class, 'update']);
    Route::post('/flash-sales/{id}/items', [AdminFlashSaleController::class, 'addItem']);
    Route::delete('/flash-sales/{id}/items/{itemId}', [AdminFlashSaleController::class, 'removeItem']);

    // Orders Management
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);

    // Customers Management (users table)
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // Administrators Management (admins table)
    Route::get('/admins', [AdminStaffController::class, 'index']);
    Route::post('/admins', [AdminStaffController::class, 'store']);
    Route::put('/admins/{id}', [AdminStaffController::class, 'update']);
    Route::delete('/admins/{id}', [AdminStaffController::class, 'destroy']);

    // Activity Logs
    Route::get('/activity-logs', [AdminActivityLogController::class, 'index']);

    // Newsletter Subscribers Management
    Route::get('/newsletter-subscribers', [AdminNewsletterController::class, 'index']);
    Route::post('/newsletter-subscribers', [AdminNewsletterController::class, 'store']);
    Route::patch('/newsletter-subscribers/{id}/status', [AdminNewsletterController::class, 'toggleStatus']);
    Route::delete('/newsletter-subscribers/{id}', [AdminNewsletterController::class, 'destroy']);
});
