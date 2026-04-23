#!/usr/bin/env bash

set -euo pipefail

FRONT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACK_DIR="$(cd "$FRONT_DIR/../backend-altezza" && pwd)"

if [[ ! -d "$BACK_DIR" ]]; then
  echo "No se encontro backend-altezza en: $BACK_DIR" >&2
  exit 1
fi

if [[ -z "${NVM_DIR:-}" ]]; then
  export NVM_DIR="$HOME/.nvm"
fi

if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  source "$NVM_DIR/nvm.sh"
else
  echo "No se encontro nvm en $NVM_DIR/nvm.sh" >&2
  exit 1
fi

BACK_PID=""

cleanup() {
  if [[ -n "$BACK_PID" ]] && kill -0 "$BACK_PID" 2>/dev/null; then
    kill "$BACK_PID" 2>/dev/null || true
    wait "$BACK_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "[dev-local] backend -> nvm use && npm start"
(
  cd "$BACK_DIR"
  nvm use >/dev/null
  npm start
) &
BACK_PID=$!

echo "[dev-local] frontend -> nvm use && npm run dev"
cd "$FRONT_DIR"
nvm use >/dev/null
npm run dev
