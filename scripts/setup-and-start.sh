#!/usr/bin/env zsh
set -euo pipefail

echo "== PassionProjectBuilder: setup-and-start =="

# Ensure we run from the repo root (script lives in scripts/)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="${SCRIPT_DIR%/scripts}"
cd "$REPO_ROOT"

# Install nvm if not present
if ! command -v nvm >/dev/null 2>&1; then
  echo "nvm not found — installing nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  # shellcheck disable=SC1090
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
else
  echo "nvm found"
fi

# Load nvm in this session (if installed by this script or previously)
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1090
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "Installing Node.js LTS via nvm..."
nvm install --lts
nvm use --lts

echo "Node:" $(node -v) " npm:" $(npm -v)

# Install project dependencies and start dev server
cd "$REPO_ROOT/passion-projects" || cd "$REPO_ROOT"

if [ -f package-lock.json ] || [ -f package.json ]; then
  echo "Installing project dependencies with npm..."
  npm install
else
  echo "No package.json found in project root. Please run this script from the repository root."
  exit 1
fi

echo "Starting Next.js dev server (npm run dev)..."
npm run dev
