# Деплой с GitHub на demosah.izhon.ru

## Схема

```
GitHub (исходники)  →  сборка  →  demosah.izhon.ru (только dist/)
```

В репозитории хранятся **исходники**. Папка `dist/` в Git не попадает (см. `.gitignore`).

---

## Вариант A: Автодеплой через GitHub Actions (рекомендуется)

При каждом push в `main` GitHub собирает проект и заливает `dist/` на сервер по SSH.

### 1. На сервере

Создайте каталог для сайта:

```bash
mkdir -p /var/www/demosah.izhon.ru
```

Убедитесь, что nginx/apache указывает `root` на этот каталог (см. `nginx.conf`).

### 2. SSH-ключ для деплоя

На **своём компьютере**:

```bash
ssh-keygen -t ed25519 -C "github-deploy-reestr-sah" -f ~/.ssh/reestr-sah-deploy
```

Публичный ключ добавьте на сервер:

```bash
ssh-copy-id -i ~/.ssh/reestr-sah-deploy.pub user@your-server
```

Приватный ключ (`reestr-sah-deploy`, **без** `.pub`) — в GitHub.

### 3. Секреты в GitHub

Репозиторий → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Пример |
|---|---|
| `DEPLOY_HOST` | `demosah.izhon.ru` или IP сервера |
| `DEPLOY_USER` | `deploy` или ваш SSH-пользователь |
| `DEPLOY_SSH_KEY` | содержимое приватного ключа |
| `DEPLOY_PATH` | `/var/www/demosah.izhon.ru` |

### 4. Push — и деплой пойдёт сам

```bash
git push origin main
```

Статус: **Actions** на GitHub.

---

## Вариант B: Сборка на сервере (git pull)

Если на сервере есть Node.js:

```bash
# Первичная настройка (один раз)
git clone https://github.com/a-dyomin/reestr-sah.git /opt/reestr-sah
chmod +x /opt/reestr-sah/deploy/deploy.sh

# Каждый деплой
/opt/reestr-sah/deploy/deploy.sh /var/www/demosah.izhon.ru
```

Или вручную:

```bash
cd /opt/reestr-sah
git pull origin main
npm ci
npm run build
rsync -a --delete dist/ /var/www/demosah.izhon.ru/
```

---

## Проверка после деплоя

1. Откройте https://demosah.izhon.ru/
2. Ctrl+U — в HTML должно быть `/assets/index-*.js`, **не** `/src/main.tsx`

---

## Локальная проверка перед push

```bash
npm run deploy:check
npm run preview
```
