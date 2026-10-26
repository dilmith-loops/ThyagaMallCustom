#!/usr/bin/env bash
set -e

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$WORKSPACE_DIR/dist_thyagamall"
ZIP_FILE="$WORKSPACE_DIR/ThyagaMall_Hostinger_Deploy.zip"

echo "=========================================================="
echo "🚀 Building Thyaga Mall Hostinger Deployment Package"
echo "Target URL: https://ai.loopsintegrated.co/ThyagaMall"
echo "=========================================================="

# 1. Clean previous dist
echo "🧹 Cleaning previous build artifacts..."
rm -rf "$DIST_DIR" "$ZIP_FILE"
mkdir -p "$DIST_DIR"

# 2. Build Frontend into public/
echo "📦 Building Next.js Frontend with basePath /ThyagaMall..."
"$WORKSPACE_DIR/scripts/sync_to_root.sh"

# 3. Prepare Laravel
echo "🐘 Preparing Laravel application..."
cd "$WORKSPACE_DIR"
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Copy the Laravel app (excluding git, frontend source, tests, local artifacts)
echo "📋 Copying application files..."
rsync -av --exclude='.git' \
          --exclude='node_modules' \
          --exclude='frontend' \
          --exclude='tests' \
          --exclude='scripts' \
          --exclude='database_dump' \
          --exclude='dist_thyagamall' \
          --exclude='ThyagaMall_Hostinger_Deploy.zip' \
          --exclude='storage/logs/*.log' \
          --exclude='.env' \
          "$WORKSPACE_DIR/" "$DIST_DIR/"

# Copy production .env template
cp "$WORKSPACE_DIR/.env.production.example" "$DIST_DIR/.env"

# Ensure storage directories exist and are writable
mkdir -p "$DIST_DIR/storage/framework/cache/data"
mkdir -p "$DIST_DIR/storage/framework/sessions"
mkdir -p "$DIST_DIR/storage/framework/views"
mkdir -p "$DIST_DIR/storage/logs"
mkdir -p "$DIST_DIR/bootstrap/cache"

# 4. Copy Database Dump
echo "🗄️ Copying MySQL Database Dump..."
mkdir -p "$DIST_DIR/database_sql"
cp "$WORKSPACE_DIR/database_dump/thyaga_mall_db.sql" "$DIST_DIR/database_sql/"

# 5. Create Zip Archive
echo "🤐 Creating Deployment ZIP: $ZIP_FILE..."
cd "$DIST_DIR"
zip -q -r "$ZIP_FILE" .

echo "=========================================================="
echo "✅ DEPLOYMENT PACKAGE CREATED SUCCESSFULLY!"
echo "File: $ZIP_FILE"
echo "Size: $(du -sh "$ZIP_FILE" | cut -f1)"
echo "=========================================================="
