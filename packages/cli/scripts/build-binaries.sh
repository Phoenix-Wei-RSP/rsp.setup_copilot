#!/bin/bash
set -e

echo "🚀 Building RSP CLI binaries for all platforms..."

DIST_DIR="../../dist/binaries"
mkdir -p "$DIST_DIR"

echo ""
echo "📦 Building for macOS (darwin-arm64)..."
bun build src/index.ts --compile --target=bun-darwin-arm64 --outfile "$DIST_DIR/rsp-macos-arm64"

echo ""
echo "📦 Building for macOS (darwin-x64)..."
bun build src/index.ts --compile --target=bun-darwin-x64 --outfile "$DIST_DIR/rsp-macos-x64"

echo ""
echo "📦 Building for Linux (linux-x64)..."
bun build src/index.ts --compile --target=bun-linux-x64 --outfile "$DIST_DIR/rsp-linux-x64"

echo ""
echo "📦 Building for Linux (linux-arm64)..."
bun build src/index.ts --compile --target=bun-linux-arm64 --outfile "$DIST_DIR/rsp-linux-arm64"

echo ""
echo "📦 Building for Windows (windows-x64)..."
bun build src/index.ts --compile --target=bun-windows-x64 --outfile "$DIST_DIR/rsp-windows-x64.exe"

echo ""
echo "✅ All binaries built successfully!"
echo ""
echo "📂 Binaries location: $DIST_DIR"
ls -lh "$DIST_DIR"
