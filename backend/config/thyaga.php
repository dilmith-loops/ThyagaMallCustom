<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Thyāga Gift Voucher Integration Mode
    |--------------------------------------------------------------------------
    | Supported: "sandbox", "live"
    */
    'mode' => env('THYAGA_VOUCHER_MODE', 'sandbox'),

    /*
    |--------------------------------------------------------------------------
    | Thyāga Partner API Key
    |--------------------------------------------------------------------------
    | Generated from the Thyāga Partner Portal.
    */
    'api_key' => env('THYAGA_VOUCHER_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | API Base URLs
    |--------------------------------------------------------------------------
    */
    'endpoints' => [
        'sandbox' => env('THYAGA_VOUCHER_SANDBOX_URL', 'https://dev-gyf-api-merchants.thyaga.xyz/v1.0/app/plugin/redemption/'),
        'live'    => env('THYAGA_VOUCHER_LIVE_URL', 'https://api-merchants.thyaga.lk/v1.0/app/plugin/redemption/'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Timeout in seconds for HTTP requests
    |--------------------------------------------------------------------------
    */
    'timeout' => (int) env('THYAGA_VOUCHER_TIMEOUT', 15),
];
