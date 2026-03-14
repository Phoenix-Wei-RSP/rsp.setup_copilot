#!/bin/bash
set -e

echo "🚀 RSP CLI Installer"
echo ""

OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin)
    case "$ARCH" in
      arm64)
        BINARY_NAME="rsp-macos-arm64"
        ;;
      x86_64)
        BINARY_NAME="rsp-macos-x64"
        ;;
      *)
        echo "❌ Unsupported architecture: $ARCH"
        exit 1
        ;;
    esac
    ;;
  Linux)
    case "$ARCH" in
      x86_64)
        BINARY_NAME="rsp-linux-x64"
        ;;
      aarch64|arm64)
        BINARY_NAME="rsp-linux-arm64"
        ;;
      *)
        echo "❌ Unsupported architecture: $ARCH"
        exit 1
        ;;
    esac
    ;;
  *)
    echo "❌ Unsupported operating system: $OS"
    echo "For Windows, please download rsp-windows-x64.exe manually from:"
    echo "https://github.com/phoenix-wei-rsp/rsp.setup_copilot/releases/latest"
    exit 1
    ;;
esac

INSTALL_DIR="/usr/local/bin"
DOWNLOAD_URL="https://github.com/phoenix-wei-rsp/rsp.setup_copilot/releases/latest/download/$BINARY_NAME"

echo "📥 Downloading $BINARY_NAME..."
TMP_FILE=$(mktemp)
curl -L -o "$TMP_FILE" "$DOWNLOAD_URL"

echo "📦 Installing to $INSTALL_DIR/rsp..."
chmod +x "$TMP_FILE"

if [ -w "$INSTALL_DIR" ]; then
  mv "$TMP_FILE" "$INSTALL_DIR/rsp"
else
  echo "🔐 Need sudo privileges to install to $INSTALL_DIR"
  sudo mv "$TMP_FILE" "$INSTALL_DIR/rsp"
fi

echo ""
echo "✅ RSP CLI installed successfully!"
echo ""
echo "Usage:"
echo "  rsp init    # Initialize RSP in your project"
echo ""
echo "Documentation:"
echo "  https://phoenix-wei-rsp.github.io/rsp.setup_copilot"
