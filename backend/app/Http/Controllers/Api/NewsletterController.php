<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'source' => 'nullable|string|max:50',
        ]);

        $email = strtolower(trim($validated['email']));
        $source = $validated['source'] ?? 'home_banner';

        $subscriber = NewsletterSubscriber::where('email', $email)->first();

        if ($subscriber) {
            if ($subscriber->status === 'subscribed') {
                return response()->json([
                    'success' => true,
                    'message' => 'You are already subscribed to the Thyaga Mall newsletter!',
                    'already_subscribed' => true,
                    'data' => $subscriber,
                ]);
            }

            // Reactivate subscription if was unsubscribed
            $subscriber->update([
                'status' => 'subscribed',
                'source' => $source,
                'ip_address' => $request->ip(),
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Welcome back! Your newsletter subscription has been reactivated.',
                'data' => $subscriber,
            ]);
        }

        $subscriber = NewsletterSubscriber::create([
            'email' => $email,
            'status' => 'subscribed',
            'source' => $source,
            'ip_address' => $request->ip(),
            'subscribed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for subscribing! Check your inbox for exclusive Thyaga Mall offers.',
            'data' => $subscriber,
        ], 201);
    }
}
