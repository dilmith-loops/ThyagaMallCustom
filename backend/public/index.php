<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Clean any stale bootstrap cache files on host
foreach (glob(__DIR__.'/../bootstrap/cache/*.php') as $cacheFile) {
    if (basename($cacheFile) !== '.gitignore') {
        @unlink($cacheFile);
    }
}

try {
    // Bootstrap Laravel and handle the request...
    /** @var Application $app */
    $app = require_once __DIR__.'/../bootstrap/app.php';

    // Ensure view factory is bound for error rendering
    if (! $app->bound('view')) {
        $app->register(\Illuminate\View\ViewServiceProvider::class);
    }

    // Normalize subfolder prefix if hosted under /ThyagaMall/api
    if (isset($_SERVER['REQUEST_URI'])) {
        if (preg_match('#^/ThyagaMall(/api.*)$#i', $_SERVER['REQUEST_URI'], $matches)) {
            $_SERVER['REQUEST_URI'] = $matches[1];
        }
    }

    $app->handleRequest(Request::capture());
} catch (\Throwable $e) {
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => explode("\n", $e->getTraceAsString()),
    ], JSON_PRETTY_PRINT);
}
