<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('merchants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('code')->unique()->nullable();
            $table->string('business_type')->nullable(); // e.g. Retail, Electronics, Fashion, Gourmet Food, Gift Store
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('city')->nullable();
            $table->text('address')->nullable();
            $table->decimal('commission_rate', 5, 2)->default(10.00); // e.g. 10.00%
            $table->string('logo_url')->nullable();
            $table->string('banner_url')->nullable();
            $table->string('website')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'pending', 'inactive'])->default('active');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        // Add merchant_id to products
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('merchant_id')
                ->nullable()
                ->after('brand_id')
                ->constrained('merchants')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['merchant_id']);
            $table->dropColumn('merchant_id');
        });

        Schema::dropIfExists('merchants');
    }
};
