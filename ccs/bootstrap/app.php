<?php

use App\Http\Middleware\RemovePoweredByHeader;
use App\Http\Middleware\LogIncomingRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Register global middleware
        $middleware->use([
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // resgistar session middlewhere
        $middleware->web([
            Illuminate\Session\Middleware\StartSession::class,
        ]);
       
        $middleware->api([
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->append(RemovePoweredByHeader::class);
        $middleware->append( LogIncomingRequests::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
