"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, Tab, MidhubLogo, HeaderExitIcon, Dropdown } from "@/components/ds";
import { cn } from "@/lib/cn";
import { FeedPost } from "./feed-post";

/**
 * SpacesScreen — «Пространства» глобального кооператива (Figma 7021-572134 /
 * 572628). Открывается по правой кнопке шапки «О компании». Две вкладки:
 *   • Пространства — матрица уровней (1–7) × направлений (сфер);
 *   • Лента — лента направлений с постами.
 * Собрано из DS: Header-примитивы (лого/выход), Tabs, Dropdown.
 */

// ── Иконки шапки (глобус/плюс/вопрос — небольшие инлайновые SVG) ───────────────
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function QIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.6 9.4a2.4 2.4 0 1 1 3 2.3c-.7.2-1.2.7-1.2 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.4" r="0.9" fill="currentColor" />
    </svg>
  );
}
function PersonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0H4Z" />
    </svg>
  );
}

/** Квадратная кнопка-инструмент шапки (grey-20, иконка grey-300). */
function ToolButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-[6px] bg-[var(--color-grey-20)] text-foreground-subtle transition-colors hover:bg-surface-sunken",
        active && "bg-[color:var(--color-blue-midhub-100)] text-[color:var(--color-blue-midhub-500)]",
      )}
    >
      <span className="flex size-4 items-center justify-center">{icon}</span>
    </button>
  );
}

// ── Данные матрицы ────────────────────────────────────────────────────────────
const LEVELS = [
  { n: 1, tier: "Базовый" },
  { n: 2, tier: "Базовый" },
  { n: 3, tier: "Продвинутый" },
  { n: 4, tier: "Продвинутый" },
  { n: 5, tier: "Институты" },
  { n: 6, tier: "Институты" },
  { n: 7, tier: "Институты" },
];

interface Sphere {
  name: string;
  /** Первая колонка — действие (Читать ленту / Подписаться) + иконка-персона. */
  action?: string;
  /** Уровни, где направление ещё не открыто (серые «?»). */
  lockedUntil?: number;
}
const SPHERES: Sphere[] = [
  { name: "Машиностроение", action: "Читать ленту" },
  { name: "Маркетинг", action: "Подписаться" },
  { name: "Дизайн", lockedUntil: 2 },
];

/** Цвет ячейки по тиру уровня (Базовый→teal, Продвинутый→blue, Институты→purple). */
function cellColor(level: number): string {
  if (level <= 2) return "#5fc4be";
  if (level <= 4) return "#66a6ef";
  return "#a78bfa";
}

function SpacesGrid() {
  const router = useRouter();
  return (
    <div className="w-full overflow-x-auto px-5 py-8 md:px-[50px]">
      {/* Одна сетка: 7 колонок × (шапка уровней + 3 направления). gap-px + серый
          фон дают линии строк и столбцов. */}
      <div className="min-w-[900px] overflow-hidden rounded-[8px] border border-border">
        <div className="grid grid-cols-7 gap-px bg-border">
          {/* Шапка — уровни */}
          {LEVELS.map((l) => (
            <div key={`h-${l.n}`} className="flex flex-col items-center gap-0.5 bg-[#fff] px-4 py-3 text-center">
              <span className="ds-p3 text-foreground">{l.n} уровень</span>
              <span className="ds-caption text-foreground-subtle">{l.tier}</span>
            </div>
          ))}

          {/* Ячейки направлений */}
          {SPHERES.map((s) =>
            LEVELS.map((l, ci) => {
              const locked = s.lockedUntil != null && l.n <= s.lockedUntil;
              const first = ci === 0;
              // Открытая ячейка ведёт в ленту направления и отзывается на курсор —
              // тем же осветлением, что ячейки КОБ на «Глобусе». Закрытая («?») —
              // обычный блок: вести из неё некуда.
              const Cell = locked ? "div" : "button";
              return (
                <Cell
                  key={`${s.name}-${l.n}`}
                  {...(locked
                    ? {}
                    : {
                        type: "button" as const,
                        onClick: () => router.push("/cabinet/spaces/mash"),
                        "aria-label": `${s.name}: ${l.n} уровень`,
                      })}
                  className={cn(
                    "relative flex min-h-[92px] flex-col justify-between px-4 py-3 text-left",
                    !locked && "cursor-pointer transition-opacity hover:opacity-90",
                  )}
                  style={{ backgroundColor: locked ? "var(--color-grey-20)" : cellColor(l.n) }}
                >
                  {locked ? (
                    <span className="flex flex-1 items-center justify-center text-[color:var(--color-grey-300)]">?</span>
                  ) : (
                    <>
                      <span className="ds-caption-medium text-[#fff]">{s.name}</span>
                      {first && s.action && (
                        <>
                          <span className="ds-caption text-[rgba(255,255,255,0.85)]">{s.action}</span>
                          <PersonIcon className="absolute right-2.5 top-2.5 size-4 text-[rgba(255,255,255,0.9)]" />
                        </>
                      )}
                    </>
                  )}
                </Cell>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}

// ── Лента направлений (Figma 7021-572628) ─────────────────────────────────────
const P = "https://images.unsplash.com/";
const FEED = [
  {
    name: "Машиностроение",
    count: 5,
    avatar: `${P}photo-1519085360753-af0119f7cbe7?w=80&q=80`,
    cover: `${P}photo-1518709268805-4e9042af9f23?w=800&q=80`,
    inner: `${P}photo-1565043666747-69f6646db940?w=800&q=80`,
    title: "Всё о машиностроении",
  },
  {
    name: "Маркетинг",
    count: 2,
    avatar: `${P}photo-1438761681033-6461ffad8d80?w=80&q=80`,
    cover: `${P}photo-1552664730-d307ca884978?w=800&q=80`,
    title: "Всё о маркетинге",
  },
  {
    name: "Дизайн",
    count: 2,
    avatar: `${P}photo-1507003211169-0a1dd7228f2d?w=80&q=80`,
    cover: `${P}photo-1561070791-2526d30994b5?w=800&q=80`,
    title: "Всё о дизайне",
  },
];
function FeedTab() {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col gap-12 px-5 py-8 md:px-[50px]">
      {FEED.map((f) => (
        <FeedPost
          key={f.name}
          avatar={f.avatar}
          name={f.name}
          count={f.count}
          title={f.title}
          cover={f.cover}
          inner={f.inner}
          onNameClick={() => router.push("/cabinet/spaces/mash")}
        />
      ))}
    </div>
  );
}

export function SpacesScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState(params.get("tab") === "feed" ? "feed" : "spaces");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Полоса 1 — приложение: лого слева, выход справа. Боковые отступы — как у
          всей страницы (px-5 / md:px-[50px]). */}
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

      {/* Полоса 2 — навигация: глобус + страна · вкладки · плюс/вопрос. */}
      <div className="sticky top-[60px] z-10 flex h-[64px] w-full items-center justify-between border-b border-border bg-surface px-5 md:px-[50px]">
        <div className="flex items-center gap-3">
          <ToolButton icon={<GlobeIcon className="size-4" />} label="Регион" onClick={() => router.push("/cabinet/spaces/globe")} />
          <Dropdown
            align="start"
            items={[
              { value: "ru", label: "Россия" },
              { value: "kz", label: "Казахстан" },
              { value: "by", label: "Беларусь" },
            ]}
            trigger={({ open }) => (
              <span className="flex h-9 min-w-[200px] cursor-pointer items-center justify-between gap-2 rounded-[6px] border border-border bg-[#fff] px-3">
                <span className="flex flex-col gap-0 leading-[1.15]">
                  <span className="ds-caption text-foreground-subtle leading-[1.15]">Глобальный кооператив</span>
                  <span className="ds-p3 text-foreground leading-[1.15]">🇷🇺 Россия</span>
                </span>
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none" className={cn("shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
                  <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          />
        </div>

        <nav className="-translate-x-1/2 absolute left-1/2">
          <Tabs value={tab} onValueChange={setTab} variant="solid" size="m" equal aria-label="Раздел">
            <Tab value="spaces">Пространства</Tab>
            <Tab value="feed">Лента</Tab>
          </Tabs>
        </nav>

        <div className="flex items-center gap-2">
          <ToolButton icon={<PlusIcon className="size-4" />} label="Добавить" />
          <ToolButton icon={<QIcon className="size-4" />} label="Справка" />
        </div>
      </div>

      {tab === "spaces" ? <SpacesGrid /> : <FeedTab />}
    </div>
  );
}
