#!/usr/bin/env bash
set -euo pipefail

# Скрипт деплоя на сервере: git pull → сборка → публикация dist/
#
# Использование:
#   ./deploy/deploy.sh /var/www/demosah.izhon.ru
#
# Или задайте переменную окружения:
#   DEPLOY_DIR=/var/www/demosah.izhon.ru ./deploy/deploy.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOY_DIR="${1:-${DEPLOY_DIR:-}}"

if [[ -z "$DEPLOY_DIR" ]]; then
  echo "Укажите каталог публикации:"
  echo "  ./deploy/deploy.sh /var/www/demosah.izhon.ru"
  exit 1
fi

cd "$PROJECT_DIR"

echo "→ git pull"
git pull origin main

echo "→ npm ci"
npm ci

echo "→ npm run build"
npm run build

if grep -q '/src/main.tsx' dist/index.html; then
  echo "ОШИБКА: dist/index.html ссылается на исходники, сборка некорректна"
  exit 1
fi

echo "→ публикация в $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
rsync -a --delete dist/ "$DEPLOY_DIR/"

echo "✓ Готово: $(date -Iseconds)"
