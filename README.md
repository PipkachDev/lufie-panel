# Lufie Panel — личный кабинет

Рабочий личный кабинет с входом через Discord (NextAuth + Discord OAuth2).

## Быстрый старт

1. **Добавь Redirect URL** в Discord Developer Portal → OAuth2 → Redirects:
   ```
   http://localhost:3000/api/auth/callback/discord
   ```

2. Установи зависимости (если ещё не стоят):
   ```bash
   cd lufie-panel
   npm install
   ```

3. Запусти:
   ```bash
   npm run dev
   ```

4. Открой http://localhost:3000

## Важно про безопасность

Ты отправил Client Secret в чат. После того как всё заработает — зайди в Developer Portal → OAuth2 → **Reset Secret** и обнови значение в файле `.env.local`.

## Структура

- `/` — страница входа
- `/dashboard` — личный кабинет (список твоих серверов)
- `/api/auth/[...nextauth]` — обработчик Discord OAuth

## Переменные окружения (`.env.local`)

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL=http://localhost:3000`

## Деплой (Vercel)

1. Залей папку на GitHub
2. Импортируй в Vercel
3. Добавь те же переменные окружения
4. Добавь в Discord Redirects:
   `https://твой-домен.vercel.app/api/auth/callback/discord`
5. Поставь `NEXTAUTH_URL=https://твой-домен.vercel.app`
