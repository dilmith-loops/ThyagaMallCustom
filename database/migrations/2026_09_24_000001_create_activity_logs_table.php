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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id')->nullable()->index();
            $table->string('admin_name')->default('System');
            $table->string('action')->index(); // e.g. LOGIN, LOGOUT, UPDATE_ORDER, CREATE_PRODUCT, etc.
            $table->string('entity_type')->nullable()->index(); // e.g. Order, Product, User, FlashSale, Auth
            $table->string('entity_id')->nullable()->index();
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
