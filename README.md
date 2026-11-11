# Lufie Panel (Netlify)

Личный кабинет с входом через Discord.

## Как задеплоить на Netlify

1. Зайди на https://app.netlify.com
2. **Add new site** → **Import an existing project**
3. Подключи GitHub и выбери репозиторий `lufie-panel` (или `lufie`)
4. Настройки сборки обычно подхватываются сами:
   - Build command: `npm run build`
   - Publish directory: оставляй как есть (плагин сам разберётся)
5. Перед деплоем добавь **Environment variables** (Site settings → Environment variables):

```
DISCORD_CLIENT_ID = 1564353474324598934
DISCORD_CLIENT_SECRET = твой_секрет
NEXTAUTH_SECRET = lufie-super-secret-key-change-me-in-production-2026
NEXTAUTH_URL = https://твой-сайт.netlify.app
```

6. Нажми Deploy

## Discord Redirect

В Discord Developer Portal → OAuth2 → Redirects добавь:

```
https://твой-сайт.netlify.app/api/auth/callback/discord
```

(замени на свою ссылку Netlify)

## Локальный запуск

```bash
npm install
npm run dev
```

Открой http://localhost:3000
