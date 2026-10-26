#!/usr/bin/env bash
set -e

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Compiling frontend and syncing to Laravel public/ for Hostinger Git deployment..."
cd "$WORKSPACE_DIR/resources/frontend"
npm run build

echo "📋 Syncing build artifacts to public/..."
cd "$WORKSPACE_DIR"
cp -R resources/frontend/out/* public/
mkdir -p "public/order-success/[orderNumber]"
cp public/order-success/index.html "public/order-success/[orderNumber]/index.html"

echo "✅ public/ updated! You can now run: git add -A && git commit -m 'deploy update' && git push"
