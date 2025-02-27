<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class LogIncomingRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $requestId = Str::uuid()->toString();
        $timestamp = microtime(true);

        // Log everything about this request
        Log::channel('debug')->info("REQUEST START [$requestId]", [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'path' => $request->path(),                     // Separate path
            'query' => $request->query(),                   // Separate query parameters
            'ip' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'all_headers' => $request->headers->all(),
            'content' => $request->isMethod('post') || $request->isMethod('put') ? $request->getContent() : 'N/A', // Only log body for POST/PUT
            'referer' => $request->header('Referer', 'N/A'), // Where the request came from
            'x_requested_with' => $request->header('X-Requested-With', 'N/A'), // AJAX indicator
            'cookies' => $request->cookies->all(),          // All cookies
            'client_timestamp' => $request->header('X-Client-Timestamp', 'N/A'), // Client-side timestamp
            'client_request_id' => $request->header('X-Request-ID', 'N/A'), // Client-side unique ID
            'timestamp' => $timestamp,
        ]);

        $response = $next($request);

        // Log response details
        Log::channel('debug')->info("REQUEST END [$requestId]", [
            'status' => $response->getStatusCode(),
            'duration_ms' => (microtime(true) - $timestamp) * 1000,
            'response_headers' => $response->headers->all(),
        ]);

        return $response;
    }
}
