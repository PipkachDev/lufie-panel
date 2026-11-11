"use client";

export const dynamic = "force-dynamic";


import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    async function loadGuilds() {
      try {
        // @ts-expect-error custom field
        const accessToken = session.accessToken as string | undefined;
        if (!accessToken) {
          setError("Нет access token");
          setLoadingGuilds(false);
          return;
        }

        const res = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Discord API: ${res.status}`);
        }

        const data: Guild[] = await res.json();

        // Фильтруем серверы, где пользователь админ или владелец
        const manageable = data.filter((g) => {
          const perms = BigInt(g.permissions);
          const ADMIN = BigInt(0x8);
          const MANAGE = BigInt(0x20);
          return g.owner || (perms & ADMIN) === ADMIN || (perms & MANAGE) === MANAGE;
        });

        setGuilds(manageable);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Не удалось загрузить серверы");
      } finally {
        setLoadingGuilds(false);
      }
    }

    loadGuilds();
  }, [status, session]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Загрузка...</div>
      </main>
    );
  }

  if (!session) return null;

  // Кастомные поля из Discord
  const user = session.user as {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    username?: string;
    avatar?: string | null;
  };

  const avatarUrl = user.avatar && user.id
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : user.image || `https://cdn.discordapp.com/embed/avatars/0.png`;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800/80 sticky top-0 z-20 glass">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300">
              L
            </div>
            <span className="font-semibold">Lufie Panel</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-slate-300 hidden sm:inline">
                {user.username || user.name}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-800"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Твои серверы</h1>
        <p className="text-slate-400 text-sm mb-8">
          Серверы, где у тебя есть права администратора или управление сервером.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {loadingGuilds ? (
          <div className="text-slate-400">Загружаем список серверов...</div>
        ) : guilds.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-slate-400">
            <p>Нет серверов с правами управления.</p>
            <p className="text-sm mt-2">
              Добавь бота на сервер, где ты админ, и обнови страницу.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {guilds.map((g) => {
              const iconUrl = g.icon
                ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64`
                : null;

              return (
                <div
                  key={g.id}
                  className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-indigo-500/30 transition"
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt=""
                      className="w-12 h-12 rounded-xl"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-lg font-bold">
                      {g.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{g.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {g.owner ? "Владелец" : "Администратор"}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {g.id.slice(-6)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 glass rounded-2xl p-6">
          <h2 className="font-semibold mb-3">Что дальше?</h2>
          <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
            <li>Сейчас показываются серверы, где ты можешь управлять ботом.</li>
            <li>Позже сюда можно добавить: префикс, канал логов, приветствие, статистику.</li>
            <li>Для изменения настроек бота нужен API бота (у тебя уже есть /api/stats).</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
