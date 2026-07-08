"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MidhubLogo, HeaderExitIcon } from "@/components/ds";
import { cn } from "@/lib/cn";
import { FeedPost } from "../../_components/feed-post";

/**
 * MashFeedScreen — лента направления «Машиностроение» (Figma 7021-572695).
 * Открывается кликом по «Машиностроение» в сайдбаре «Культура 3». Верхняя полоса:
 * назад + заголовок + переключатель уровней 1–7. Ниже — посты авторов (FeedPost);
 * клик по «John Doe» ведёт к его публикациям.
 */

const P = "https://images.unsplash.com/";
const POSTS = [
  {
    name: "John Doe",
    avatar: `${P}photo-1500648767791-00dcc994a43e?w=80&q=80`,
    title: "Автозавод Tesla",
    cover: `${P}photo-1518709268805-4e9042af9f23?w=800&q=80`,
    inner: `${P}photo-1565043666747-69f6646db940?w=800&q=80`,
    href: "/cabinet/spaces/mash/publications",
  },
  {
    name: "Elen Der",
    avatar: `${P}photo-1544005313-94ddf0286df2?w=80&q=80`,
    title: "Новая гига-фабрика",
    cover: `${P}photo-1581092160562-40aa08e78837?w=800&q=80`,
  },
  {
    name: "Marta Reed",
    avatar: `${P}photo-1438761681033-6461ffad8d80?w=80&q=80`,
    title: "Производство",
    cover: `${P}photo-1504328345606-18bbc8c9d7d1?w=800&q=80`,
  },
];

function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const LEVELS = [1, 2, 3, 4, 5, 6, 7];

export function MashFeedScreen() {
  const router = useRouter();
  const [level, setLevel] = useState(2);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Полоса приложения: лого слева, выход справа. */}
      <header className="sticky top-0 z-20 flex h-[60px] w-full items-center justify-between border-b border-border bg-surface px-5 md:px-[50px]">
        <button type="button" aria-label="На главную" onClick={() => router.push("/cabinet/about")} className="flex items-center">
          <MidhubLogo className="size-8" />
        </button>
        <button
          type="button"
          aria-label="Выход"
          onClick={() => router.push("/cabinet/about")}
          className="flex size-9 items-center justify-center rounded-[6px] bg-[var(--color-grey-20)] text-foreground-subtle transition-colors hover:bg-surface-sunken"
        >
          <HeaderExitIcon className="size-4" />
        </button>
      </header>

      {/* Полоса навигации: назад + заголовок · уровни. */}
      <div className="sticky top-[60px] z-10 flex h-[64px] w-full items-center justify-between gap-4 border-b border-border bg-surface px-5 md:px-[50px]">
        <button
          type="button"
          aria-label="Назад"
          onClick={() => router.push("/cabinet/spaces?tab=feed")}
          className="flex size-9 items-center justify-center rounded-[6px] bg-[var(--color-grey-20)] text-foreground-subtle transition-colors hover:bg-surface-sunken"
        >
          <BackIcon className="size-4" />
        </button>
        <span className="-translate-x-1/2 absolute left-1/2 ds-p1-medium text-foreground">Машиностроение</span>
        <div className="flex items-center overflow-hidden rounded-[6px] border border-border">
          {LEVELS.map((l, i) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={cn(
                "flex h-9 w-9 items-center justify-center ds-p3-medium transition-colors",
                i > 0 && "border-l border-border",
                level === l ? "bg-[color:var(--color-green-400)] text-[#fff]" : "bg-[#fff] text-foreground hover:bg-surface-sunken",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Лента постов направления. */}
      <div className="flex w-full flex-col gap-12 px-5 py-8 md:px-[50px]">
        {POSTS.map((p) => (
          <FeedPost
            key={p.name}
            avatar={p.avatar}
            name={p.name}
            title={p.title}
            cover={p.cover}
            inner={p.inner}
            onNameClick={p.href ? () => router.push(p.href!) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
