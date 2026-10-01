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

# 2. Build Frontend
echo "📦 Building Next.js Frontend with basePath /ThyagaMall..."
cd "$WORKSPACE_DIR/frontend"
npm run build

echo "📋 Copying frontend static files to dist..."
cp -R out/* "$DIST_DIR/"
cp "$WORKSPACE_DIR/deployment/.htaccess" "$DIST_DIR/.htaccess"

# 3. Prepare Backend
echo "🐘 Preparing Laravel Backend..."
cd "$WORKSPACE_DIR/backend"
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

mkdir -p "$DIST_DIR/backend"
# Copy necessary backend files (excluding git, tests, node_modules)
echo "📋 Copying backend files..."
rsync -av --exclude='.git' \
          --exclude='node_modules' \
          --exclude='tests' \
          --exclude='storage/logs/*.log' \
          --exclude='.env' \
          "$WORKSPACE_DIR/backend/" "$DIST_DIR/backend/"

# Copy production .env template
cp "$WORKSPACE_DIR/backend/.env.production.example" "$DIST_DIR/backend/.env"
cp "$WORKSPACE_DIR/deployment/backend_htaccess" "$DIST_DIR/backend/.htaccess"

# Ensure storage directories exist and are writable
mkdir -p "$DIST_DIR/backend/storage/framework/cache/data"
mkdir -p "$DIST_DIR/backend/storage/framework/sessions"
mkdir -p "$DIST_DIR/backend/storage/framework/views"
mkdir -p "$DIST_DIR/backend/storage/logs"
mkdir -p "$DIST_DIR/backend/bootstrap/cache"

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
