<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'payment/*',
            'payment/webxpay/*',
            'api/payment/webxpay/*',
            'checkout',
            'checkout/*',
            '*webxpay*',
            '*checkout*',
            'ThyagaMall/api/payment/webxpay/*',
            'ThyagaMall/checkout',
            'ThyagaMall/checkout/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, Request $request) {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'class' => get_class($e),
                'trace' => array_slice(explode("\n", $e->getTraceAsString()), 0, 10),
            ], 500);
        });
    })->create();
