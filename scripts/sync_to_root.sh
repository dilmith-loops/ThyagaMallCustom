#!/usr/bin/env bash
set -e

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Compiling frontend and syncing to repository root for Hostinger Git deployment..."
cd "$WORKSPACE_DIR/frontend"
npm run build

echo "📋 Syncing build artifacts to repository root..."
cd "$WORKSPACE_DIR"
cp deployment/.htaccess .htaccess
cp -R frontend/out/* .

echo "✅ Root updated! You can now run: git add -A && git commit -m 'deploy update' && git push"
