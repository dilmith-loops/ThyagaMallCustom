<?php

namespace Database\Seeders;

use App\Models\NewsletterSubscriber;
use Illuminate\Database\Seeder;

class NewsletterSubscriberSeeder extends Seeder
{
    public function run(): void
    {
        $subscribers = [
            [
                'email' => 'nimal.perera@gmail.com',
                'status' => 'subscribed',
                'source' => 'home_banner',
                'ip_address' => '112.134.120.45',
                'subscribed_at' => now()->subDays(12),
            ],
            [
                'email' => 'dilani.senanayake@yahoo.com',
                'status' => 'subscribed',
                'source' => 'home_banner',
                'ip_address' => '175.157.88.12',
                'subscribed_at' => now()->subDays(9),
            ],
            [
                'email' => 'chathura.fernando@gmail.com',
                'status' => 'subscribed',
                'source' => 'checkout',
                'ip_address' => '124.43.91.5',
                'subscribed_at' => now()->subDays(6),
            ],
            [
                'email' => 'rashmi.de.silva@outlook.com',
                'status' => 'subscribed',
                'source' => 'home_banner',
                'ip_address' => '112.134.45.19',
                'subscribed_at' => now()->subDays(4),
            ],
            [
                'email' => 'anushka.wick@gmail.com',
                'status' => 'subscribed',
                'source' => 'home_banner',
                'ip_address' => '175.157.14.77',
                'subscribed_at' => now()->subDays(2),
            ],
            [
                'email' => 'suren.kavinda@hotmail.com',
                'status' => 'subscribed',
                'source' => 'footer',
                'ip_address' => '124.43.120.88',
                'subscribed_at' => now()->subHours(18),
            ],
            [
                'email' => 'thilina.gamage@gmail.com',
                'status' => 'unsubscribed',
                'source' => 'home_banner',
                'ip_address' => '112.135.22.61',
                'subscribed_at' => now()->subDays(20),
                'unsubscribed_at' => now()->subDays(3),
            ],
        ];

        foreach ($subscribers as $sub) {
            NewsletterSubscriber::updateOrCreate(['email' => $sub['email']], $sub);
        }
    }
}
