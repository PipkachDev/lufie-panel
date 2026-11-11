import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Lufie — Панель управления",
  description: "Личный кабинет Discord-бота Lufie",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased bg-night-950 text-slate-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
