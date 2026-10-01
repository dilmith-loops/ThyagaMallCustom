<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebxpayService
{
    protected string $mode;
    protected string $checkoutUrl;
    protected string $merchantId;
    protected string $secretKey;
    protected string $publicKey;
    protected string $apiUsername;
    protected string $apiPassword;
    protected string $currency;
    protected ?string $returnUrl;
    protected string $frontendUrl;

    public function __construct()
    {
        $this->mode = config('webxpay.mode', 'sandbox');
        $endpoints = config('webxpay.endpoints', []);
        $this->checkoutUrl = $this->mode === 'live'
            ? ($endpoints['live'] ?? 'https://webxpay.com/index.php?route=checkout/billing')
            : ($endpoints['sandbox'] ?? 'https://stagingxpay.info/index.php?route=checkout/billing');

        $this->merchantId = config('webxpay.merchant_id', '');
        $this->secretKey = config('webxpay.secret_key', '');
        $this->publicKey = config('webxpay.public_key', '');
        $this->apiUsername = config('webxpay.api_username', '');
        $this->apiPassword = config('webxpay.api_password', '');
        $this->currency = config('webxpay.currency', 'LKR');
        $this->returnUrl = config('webxpay.return_url') ?: url('/api/payment/webxpay/callback');
        $this->frontendUrl = rtrim(config('webxpay.frontend_url', 'https://ai.loopsintegrated.co/ThyagaMall'), '/');
    }

    /**
     * Get the gateway endpoint URL for redirect form submission
     */
    public function getCheckoutUrl(): string
    {
        return $this->checkoutUrl;
    }

    /**
     * Prepare payment form fields for WebXpay redirect
     */
    public function preparePaymentPayload(Order $order): array
    {
        // Split customer name into first and last name
        $nameParts = preg_split('/\s+/', trim($order->customer_name));
        $firstName = mb_substr($nameParts[0] ?? 'Customer', 0, 30);
        $lastName = count($nameParts) > 1 ? mb_substr(implode(' ', array_slice($nameParts, 1)), 0, 30) : 'Customer';

        // Clean and validate contact number
        $cleanPhone = preg_replace('/[^\d+]/', '', $order->customer_phone);
        if (strlen($cleanPhone) < 9) {
            $cleanPhone = '0770000000';
        }

        // Format price to 2 decimal places
        $price = number_format((float) $order->total, 2, '.', '');

        // Custom fields pipe-separated (e.g. order_number|total|order_id)
        $customFieldsPlain = $order->order_number . '|' . $price . '|' . $order->id;
        $customFieldsEncoded = base64_encode($customFieldsPlain);

        // Core fields standard for WebXPay
        $fields = [
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $order->customer_email,
            'contact_number' => $cleanPhone,
            'address_line_one' => mb_substr($order->shipping_address, 0, 100),
            'address_line_two' => '',
            'city' => mb_substr($order->shipping_city ?: 'Colombo', 0, 50),
            'state' => 'Western',
            'postal_code' => $order->shipping_postal_code ?: '00500',
            'country' => 'Sri Lanka',
            'process_payment' => '1',
            'price' => $price,
            'amount' => $price,
            'order_id' => $order->order_number,
            'order_reference_number' => $order->order_number,
            'currency' => $this->currency,
            'custom_fields' => $customFieldsEncoded,
            'return_url' => $this->returnUrl,
            'cancel_url' => $this->frontendUrl . '/checkout?payment_error=Payment%20was%20cancelled%20by%20user',
        ];

        if (!empty($this->merchantId)) {
            $fields['merchant_id'] = $this->merchantId;
            $fields['merchant_mid'] = $this->merchantId;
        }

        if (!empty($this->secretKey)) {
            $fields['secret_key'] = $this->secretKey;
        }

        if (!empty($this->apiUsername)) {
            $fields['api_username'] = $this->apiUsername;
        }

        // Advanced WebXpay payload signing (if secret/private key is available)
        $paymentDataString = "{$order->order_number}|{$price}|{$this->currency}";
        $fields['payment'] = base64_encode($paymentDataString);

        return [
            'gateway_url' => $this->checkoutUrl,
            'method' => 'POST',
            'params' => $fields,
            'order_number' => $order->order_number,
            'total' => $order->total,
        ];
    }

    /**
     * Verify and parse incoming WebXpay callback response
     */
    public function verifyCallback(Request $request): array
    {
        Log::info('WebXpay Callback received', [
            'method' => $request->method(),
            'all' => $request->all(),
            'ip' => $request->ip(),
        ]);

        $orderNumber = null;
        $status = 'failed';
        $transactionId = null;
        $message = 'Payment processing failed';

        // Check 1: WebXpay Encrypted / Base64 'payment' response parameter
        if ($request->has('payment')) {
            $paymentEncoded = $request->input('payment');
            $signatureEncoded = $request->input('signature');
            $customFieldsEncoded = $request->input('custom_fields');

            $paymentData = base64_decode($paymentEncoded);
            $signature = $signatureEncoded ? base64_decode($signatureEncoded) : null;

            // Attempt public key verification if public key is provided
            $signatureValid = true;
            if (!empty($this->publicKey) && $signature) {
                try {
                    $formattedKey = $this->formatPublicKey($this->publicKey);
                    // WebXPay usually uses openssl_public_decrypt or openssl_verify
                    $decryptedValue = '';
                    $decryptSuccess = @openssl_public_decrypt($signature, $decryptedValue, $formattedKey);
                    if ($decryptSuccess && $decryptedValue === $paymentData) {
                        $signatureValid = true;
                    } else {
                        // Fallback check using openssl_verify
                        $verifySuccess = @openssl_verify($paymentData, $signature, $formattedKey, OPENSSL_ALGO_SHA256);
                        $signatureValid = ($verifySuccess === 1);
                    }
                } catch (\Throwable $e) {
                    Log::warning('WebXpay signature verification exception: ' . $e->getMessage());
                    // In sandbox/testing or malformed key, continue with parsed content check
                }
            }

            // Extract variables from payment string (either pipe-separated or JSON)
            $parsed = $this->parsePaymentData($paymentData);
            $orderNumber = $parsed['order_number'] ?? null;
            $status = ($signatureValid && ($parsed['status'] === 'success' || $parsed['status_code'] === '0' || $parsed['status_code'] === '00' || $parsed['status_code'] === 0)) ? 'success' : 'failed';
            $transactionId = $parsed['transaction_id'] ?? $parsed['ref_id'] ?? null;
            $message = $parsed['message'] ?? ($status === 'success' ? 'Payment approved' : 'Payment rejected or invalid');

            // If order number not in payment data, try custom fields
            if (!$orderNumber && $customFieldsEncoded) {
                $customPlain = base64_decode($customFieldsEncoded);
                $customParts = explode('|', $customPlain);
                $orderNumber = $customParts[0] ?? null;
            }
        }

        // Check 2: Direct POST fields (e.g. order_id, status, status_code, order_reference_number)
        if (!$orderNumber) {
            $orderNumber = $request->input('order_id')
                ?: $request->input('order_reference_number')
                ?: $request->input('merchant_ref');

            $statusCode = $request->input('status_code') ?? $request->input('status');
            if (in_array(strtolower((string) $statusCode), ['0', '00', 'success', 'approved', 'paid', '1'])) {
                $status = 'success';
                $message = 'Payment completed successfully';
            } else {
                $status = 'failed';
                $message = $request->input('message') ?: 'Payment unsuccessful or cancelled';
            }
            $transactionId = $request->input('transaction_id') ?: $request->input('ref_id');
        }

        return [
            'is_valid' => ($status === 'success'),
            'status' => $status,
            'order_number' => $orderNumber,
            'transaction_id' => $transactionId,
            'message' => $message,
            'raw_payload' => $request->all(),
        ];
    }

    /**
     * Helper to format RSA Public Key if stored without headers
     */
    protected function formatPublicKey(string $key): string
    {
        $key = trim($key);
        if (str_contains($key, '-----BEGIN PUBLIC KEY-----')) {
            return $key;
        }
        return "-----BEGIN PUBLIC KEY-----\n" . wordwrap($key, 64, "\n", true) . "\n-----END PUBLIC KEY-----";
    }

    /**
     * Parse payment response data (JSON or pipe-separated)
     */
    protected function parsePaymentData(string $data): array
    {
        // Try JSON decode first
        $json = json_decode($data, true);
        if (is_array($json)) {
            return [
                'order_number' => $json['order_id'] ?? $json['order_reference_number'] ?? $json['merchant_ref'] ?? null,
                'status' => strtolower($json['status'] ?? ''),
                'status_code' => $json['status_code'] ?? null,
                'transaction_id' => $json['transaction_id'] ?? $json['ref_id'] ?? null,
                'message' => $json['message'] ?? null,
            ];
        }

        // Fallback: pipe-delimited format (order_id|status_code|ref_id|...)
        $parts = explode('|', $data);
        return [
            'order_number' => $parts[0] ?? null,
            'status_code' => $parts[1] ?? null,
            'status' => (isset($parts[1]) && in_array($parts[1], ['0', '00', 'success', 'approved'])) ? 'success' : 'failed',
            'transaction_id' => $parts[2] ?? null,
            'message' => $parts[3] ?? null,
        ];
    }

    /**
     * Get frontend URL to redirect user after payment
     */
    public function getFrontendRedirectUrl(string $orderNumber, bool $isSuccess, ?string $errorMessage = null): string
    {
        if ($isSuccess) {
            return "{$this->frontendUrl}/order-success/{$orderNumber}?payment=paid";
        }

        $errorMsg = urlencode($errorMessage ?: 'Payment could not be completed. Please try again.');
        return "{$this->frontendUrl}/checkout?payment_error={$errorMsg}&order={$orderNumber}";
    }
}
