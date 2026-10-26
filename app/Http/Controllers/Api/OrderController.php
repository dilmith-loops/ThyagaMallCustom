<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string|max:100',
            'shipping_postal_code' => 'nullable|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'voucher_code' => 'nullable|string',
            'voucher_redemption_id' => 'nullable|string',
            'voucher_owner_name' => 'nullable|string',
            'voucher_amount' => 'nullable|numeric|min:0',
            'payment_method' => 'required|string|in:cod,card,webxpay,voucher,voucher_cod',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $subtotal = 0;
            $orderItemsData = [];

            foreach ($validated['items'] as $item) {
                $product = Product::with('images')->lockForUpdate()->findOrFail($item['product_id']);
                $price = $product->sale_price ?: $product->regular_price;
                $lineTotal = $price * $item['quantity'];
                $subtotal += $lineTotal;

                $primaryImg = $product->primary_image;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_image' => $primaryImg,
                    'unit_price' => $price,
                    'quantity' => $item['quantity'],
                    'total_price' => $lineTotal,
                ];

                // Decrement stock
                $product->decrement('stock_quantity', $item['quantity']);
            }

            // Calculate shipping fee: FREE if order over Rs. 2,999
            $shippingFee = ($subtotal >= 2999) ? 0.00 : 350.00;

            // Calculate voucher discount (Thyāga API or local DB)
            $discount = 0.00;
            $voucherCode = null;
            $redemptionId = $validated['voucher_redemption_id'] ?? null;
            $thyagaService = app(\App\Services\ThyagaVoucherService::class);

            if ($redemptionId) {
                // If Thyāga API is configured, validate the hold status is still OK
                if ($thyagaService->isConfigured()) {
                    $isHoldValid = $thyagaService->validateHoldStatus($redemptionId);
                    if (!$isHoldValid) {
                        return response()->json([
                            'success' => false,
                            'message' => 'The Thyāga voucher hold has expired or is invalid. Please re-verify your voucher.',
                        ], 422);
                    }
                }
                $discount = min($subtotal + $shippingFee, (float) ($validated['voucher_amount'] ?? 0));
                $voucherCode = $validated['voucher_code'] ?? 'THYAGA-VOUCHER';
            } elseif (!empty($validated['voucher_code'])) {
                $voucher = Voucher::where('code', strtoupper(trim($validated['voucher_code'])))->first();
                if ($voucher && $voucher->isValidForAmount($subtotal)) {
                    $discount = $voucher->calculateDiscount($subtotal);
                    $voucherCode = $voucher->code;
                    $voucher->increment('times_used');
                }
            }

            $total = max(0, ($subtotal - $discount) + $shippingFee);
            $orderNumber = 'THY-' . date('Ymd') . '-' . strtoupper(Str::random(4));

            $userId = auth('sanctum')->id();
            if (!$userId) {
                $userId = \App\Models\User::where('email', strtolower(trim($validated['customer_email'])))
                    ->where('role', 'customer')
                    ->value('id');
            }

            $isOnlinePayment = in_array($validated['payment_method'], ['card', 'webxpay']) && $total > 0;
            $paymentStatus = ($validated['payment_method'] === 'voucher' && $total == 0) ? 'paid' : 'pending';

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $userId,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'shipping_postal_code' => $validated['shipping_postal_code'] ?? null,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'voucher_code' => $voucherCode,
                'voucher_redemption_id' => $redemptionId,
                'voucher_owner_name' => $validated['voucher_owner_name'] ?? null,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $paymentStatus,
                'order_status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            // If order has a held Thyāga redemption and no online gateway pending (COD or fully paid by voucher), complete it immediately
            if ($redemptionId && !$isOnlinePayment && $thyagaService->isConfigured()) {
                $thyagaService->completeRedemption($redemptionId, $order->order_number);
            }

            $responseData = [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'total' => $order->total,
                'shipping_fee' => $order->shipping_fee,
                'discount' => $order->discount,
                'order_status' => $order->order_status,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
            ];

            if ($isOnlinePayment) {
                $webxpayService = app(\App\Services\WebxpayService::class);
                $paymentPayload = $webxpayService->preparePaymentPayload($order);
                $responseData['payment_url'] = $paymentPayload['gateway_url'];
                $responseData['payment_params'] = $paymentPayload['params'];
                $responseData['redirect_required'] = true;
            }

            return response()->json([
                'success' => true,
                'message' => $isOnlinePayment 
                    ? 'Order placed. Redirecting to WebXpay secure gateway...' 
                    : 'Thank you! Your order has been placed successfully.',
                'data' => $responseData,
            ], 201);
        });
    }

    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->with('items')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }
}
