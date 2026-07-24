#!/usr/bin/env bash
# Run Podman Desktop from the extensions-improvements prototype branch.
# Uses pnpm watch (dev Electron + Vite HMR) — not the installed /Applications app.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="extensions-improvements"
REMOTE="fork"

cd "$ROOT"

echo "==> Podman Desktop extensions prototype"
echo "    Repo:   $ROOT"
echo "    Branch: $BRANCH"
echo ""

CURRENT="$(git branch --show-current)"
if [[ "$CURRENT" != "$BRANCH" ]]; then
  echo "==> Switching from '$CURRENT' to '$BRANCH'"
  git checkout "$BRANCH"
fi

echo "==> Pulling latest from $REMOTE/$BRANCH"
git pull "$REMOTE" "$BRANCH"

if [[ ! -d node_modules ]]; then
  echo "==> Installing dependencies (first run)"
  pnpm install
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR" -lt 24 ]]; then
  echo "WARNING: Podman Desktop requires Node >= 24 (current: $(node -v))"
  echo "         Run: nvm use 24 (or install Node 24+)"
fi

echo ""
echo "==> Starting dev Electron (pnpm watch)"
echo "    Quit any other Podman Desktop window before this launches."
echo "    UI changes hot-reload; restart if a new file was added."
echo ""

exec pnpm watch
