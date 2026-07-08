#!/bin/bash
set -e

REPO_URL="https://github.com/a-dyomin/reestr-sah.git"
REPO_DIR="/opt/demosah/repo"
DIST_DIR="/opt/demosah/dist"

echo "=== DEPLOY START ==="

if [ ! -d "$REPO_DIR/.git" ]; then
    echo "[INFO] Cloning repository..."
    git clone "$REPO_URL" "$REPO_DIR"
else
    echo "[INFO] Updating repository..."
    cd "$REPO_DIR"
    git fetch --all
    git reset --hard origin/main
fi

echo "[INFO] Installing dependencies..."
cd "$REPO_DIR"
npm ci

echo "[INFO] Building project..."
npm run build

if grep -q '/src/main.tsx' "$REPO_DIR/dist/index.html"; then
    echo "[ERROR] Сборка некорректна — index.html ссылается на исходники"
    exit 1
fi

if [ ! -f "$REPO_DIR/dist/assets/"*.js ]; then
    echo "[ERROR] Нет JS-файлов в dist/assets/"
    exit 1
fi

echo "[INFO] Updating dist..."
mkdir -p "$DIST_DIR"
rsync -a --delete "$REPO_DIR/dist/" "$DIST_DIR/"

# nginx (www-data) должен иметь доступ к файлам
chmod -R a+rX "$DIST_DIR"

echo "[INFO] Проверка файлов:"
ls -la "$DIST_DIR"
ls -la "$DIST_DIR/assets/"

JS_FILE=$(ls "$DIST_DIR/assets/"*.js | head -1)
if [ ! -f "$JS_FILE" ]; then
    echo "[ERROR] JS не найден"
    exit 1
fi

echo "[INFO] JS размер: $(wc -c < "$JS_FILE") байт (должно быть >100000)"

echo "=== DEPLOY FINISHED ==="
echo ""
echo "Проверьте nginx: root должен быть $DIST_DIR"
echo "  curl -I https://demosah.izhon.ru/assets/$(basename "$JS_FILE")"
echo "  Content-Type должен быть application/javascript, НЕ text/html"
