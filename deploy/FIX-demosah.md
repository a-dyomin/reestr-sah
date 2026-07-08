# Быстрый фикс для demosah.izhon.ru

На сервере выполните:

```bash
cd /var/www/demosah.izhon.ru   # ваш web-root
git fetch origin gh-pages
git checkout -f gh-pages
git reset --hard origin/gh-pages
ls assets/                      # должны быть .js и .css
```

Если `git` ещё не настроен:

```bash
cd /var/www/demosah.izhon.ru
rm -rf * .git 2>/dev/null
git init
git remote add origin https://github.com/a-dyomin/reestr-sah.git
git fetch origin gh-pages
git checkout -f gh-pages
```

Проверка: `curl -I https://demosah.izhon.ru/assets/` — не должен отдавать text/html для .js файлов.

В панели хостинга: **ветка деплоя = gh-pages**, не main.
