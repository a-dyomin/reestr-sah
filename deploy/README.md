# Деплой на demosah.izhon.ru

## Диагностика вашей ошибки

Сейчас на сервере **index.html правильный**, но папки `assets/` **нет** (или nginx отдаёт index.html вместо JS).

Проверка: откройте в браузере  
`https://demosah.izhon.ru/assets/index-DVhUIltk.js`

- Если видите **HTML-код** — файла нет, nginx подставляет index.html
- Должен открыться **JavaScript** (~200 КБ)

---

## Решение: деплой из ветки `gh-pages`

GitHub Actions при каждом push в `main`:
1. Собирает проект (`npm run build`)
2. Публикует **только dist/** в ветку **`gh-pages`**

На сервере нужно деплоить **ветку `gh-pages`**, а не `main`.

### На сервере (SSH)

```bash
# Если каталог пустой или с неправильной веткой main:
cd /var/www/demosah.izhon.ru
rm -rf .git *
git init
git remote add origin https://github.com/a-dyomin/reestr-sah.git
git fetch origin gh-pages
git checkout -f gh-pages

# Проверка — должны быть index.html И папка assets/
ls -la
ls -la assets/
```

### Обновление при каждом релизе

```bash
cd /var/www/demosah.izhon.ru
git fetch origin gh-pages
git checkout -f gh-pages
git reset --hard origin/gh-pages
```

### В панели хостинга (izhon.ru)

Если есть «Git-деплой»:
- Репозиторий: `https://github.com/a-dyomin/reestr-sah`
- **Ветка: `gh-pages`** (не `main`!)
- Каталог публикации: корень сайта

---

## Nginx

См. `nginx.conf` — для `/assets/` нельзя делать fallback на `index.html`.

После смены конфига:

```bash
nginx -t && systemctl reload nginx
```

---

## Альтернатива: сборка на сервере

```bash
git clone -b main https://github.com/a-dyomin/reestr-sah.git /opt/reestr-sah
/opt/reestr-sah/deploy/deploy.sh /var/www/demosah.izhon.ru
```

---

## Проверка после деплоя

| URL | Ожидание |
|-----|----------|
| `/` | Страница реестра |
| Ctrl+U | `<script src="/assets/index-....js">` |
| `/assets/index-....js` | JavaScript, не HTML |
| `/src/main.tsx` | 404 (файла быть не должно) |

Очистите кэш браузера: **Ctrl+Shift+R**
