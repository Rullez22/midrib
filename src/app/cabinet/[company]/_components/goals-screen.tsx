"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button, Combobox, Checkbox, Badge } from "@/components/ds";
import { cn } from "@/lib/cn";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";
import { GOALS, type Goal, type GoalCategory } from "./goals-data";
import { GoalProgressBar } from "./goal-progress";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";

/**
 * GoalsScreen — раздел «Цели» кабинета (Figma 7021:585816 — панель управления,
 * 7021:585702/585738/585589/585551/585666/585787 — карточки целей с прогрессом).
 * Сайдбар — наш (CompanySidebar), из макета взят только контент. Reuse DS:
 * Input · Button · Combobox.
 */


/** Счётчик берётся из GOALS, иначе подпись фильтра разъезжается с данными. */
const FILTER_TITLES: { key: GoalCategory; title: string }[] = [
  { key: "raising", title: "Сбор средств" },
  { key: "collected", title: "Средства собраны" },
  { key: "closed", title: "Закрытые цели" },
];
const FILTERS: { key: GoalCategory; label: string }[] = FILTER_TITLES.map(({ key, title }) => ({
  key,
  label: `${title} (${GOALS.filter((g) => g.category === key).length})`,
}));

/* ── Иконки ─────────────────────────────────────────────────────────────── */
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cn("size-4 text-foreground-subtle", className)}>
      <rect x="2.5" y="3" width="11" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 6h11M5.5 1.8v2.4M10.5 1.8v2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cn("size-4 text-primary", className)}>
      <path d="M8 14s5-4.2 5-8a5 5 0 0 0-10 0c0 3.8 5 8 5 8Z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="6" r="1.8" fill="currentColor" />
    </svg>
  );
}
function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}
function PencilIcon() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4"><path d="M11 2.5 13.5 5 6 12.5 3 13l.5-3L11 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
}
function SearchIcon() {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5 text-foreground-subtle"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" /><path d="m14 14 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}
function CheckCircle() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-[var(--color-grey-300)]"><circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.2" /><path d="m5.5 8 1.7 1.7L11 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function StatusInfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M8 2 15 14H1L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8 6.5v3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11.6" r="0.7" fill="currentColor" />
    </svg>
  );
}
function SortIcon() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-foreground-subtle"><path d="M3 4h10M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
}

/* ── Карточка цели ──────────────────────────────────────────────────────── */
function GoalCard({ g, href, onEdit, pending }: { g: Goal; href: string; onEdit: () => void; pending: number }) {
  // Плашка «требует решения»: статический баннер цели + незакрытые договоры.
  const bannerCount = (g.banner ? Number(g.banner) : 0) + pending;
  return (
    <Link
      href={href}
      className={cn(
        "ds-row block overflow-hidden rounded-[8px] border bg-[#fff]",
        bannerCount > 0 ? "border-[color:var(--color-orange-400)]" : "border-border",
      )}
    >
      {bannerCount > 0 && (
        // Плашка «Статус документов» — 1:1 из раздела «Партнёры».
        <div className="flex items-center justify-between gap-4 border-b border-border bg-[color:var(--color-orange-50)] px-4 py-2">
          <span className="ds-p3-medium flex items-center gap-2 text-[color:var(--color-orange-500)]">
            <StatusInfoIcon />
            СТАТУС ДОКУМЕНТОВ:
          </span>
          <Badge variant="solid" color="orange" style={{ backgroundColor: "var(--color-orange-500)", color: "#fff" }}>Ожидают участия ({bannerCount})</Badge>
        </div>
      )}
      <div className="flex flex-col gap-5 p-4 sm:flex-row">
        <div
          className={cn("h-[150px] w-full shrink-0 overflow-hidden rounded-[6px] bg-cover bg-center sm:w-[240px]", g.closed && "opacity-90")}
          style={{ backgroundImage: `url("${g.image}")` }}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3 py-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {g.closed ? (
              <span className="inline-flex items-center gap-1.5"><CheckCircle /><span className="ds-caption text-[var(--color-grey-300)]">Цель закрыта</span></span>
            ) : (
              <span className="inline-flex items-center gap-1.5"><CalendarIcon /><span className="ds-caption text-foreground-subtle">{g.dates}</span></span>
            )}
            {g.action === "edit" ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <PencilIcon />
                <span className="ds-p3-medium">Редактировать</span>
              </button>
            ) : g.action === "process" ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <PlusIcon />
                <span className="ds-p3-medium">Процесс исполнения</span>
              </span>
            ) : null}
          </div>
          <span className={cn("ds-h4", g.closed ? "text-[var(--color-grey-300)]" : "text-foreground")}>{g.title}</span>
          <span className="inline-flex items-center gap-1.5">
            <PinIcon className={g.closed ? "text-[var(--color-grey-300)]" : "text-primary"} />
            <span className="ds-caption text-foreground-subtle">{g.location}</span>
          </span>
          {g.progress && <div className="mt-1"><GoalProgressBar p={g.progress} /></div>}
        </div>
      </div>
    </Link>
  );
}

export function GoalsScreen({ cabinet }: { cabinet: CabinetConfig }) {
  const router = useRouter();
  const { createdContracts } = useRegFlow();
  // «Просмотреть все цели» — якорь: плавный скролл к списку целей.
  const listRef = useRef<HTMLDivElement>(null);
  const scrollToList = () => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const pendingFor = (goalId: string) =>
    createdContracts.filter((c) => c.orgId === goalId && c.parentId === null && !c.finalized).length;
  // Активные категории (по умолчанию все) — чекбоксы фильтруют карточки.
  const [active, setActive] = useState<Set<GoalCategory>>(() => new Set(["raising", "collected", "closed"]));
  const toggle = (k: GoalCategory) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  const visible = GOALS.filter((g) => active.has(g.category));

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current="goals" />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-5 px-5 py-8 md:px-[50px]">
          {/* Панель управления целями */}
          <div className="flex flex-col items-center gap-5 rounded-[8px] border border-border bg-[linear-gradient(135deg,#eaf1fd_0%,#f6f8fc_100%)] px-6 py-12 text-center">
            <span className="ds-h4 text-foreground">Панель управления целями</span>
            <p className="ds-p2 max-w-[560px] text-foreground-muted">
              На этой странице Вы можете создать новые благотворительные цели и управлять уже существующими.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="l" onClick={() => router.push(`/cabinet/${cabinet.slug}/goals/create`)}>Добавить новую цель</Button>
              <Button variant="secondary" size="l" onClick={scrollToList}>Просмотреть все цели</Button>
            </div>
          </div>

          {/* Поиск + страна */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <Input size="l" leftIcon={<SearchIcon />} placeholder="Поиск" aria-label="Поиск целей" />
            </div>
            <div className="w-full sm:w-[320px]">
              <Combobox options={[{ value: "ru", label: "Россия" }]} defaultValue="ru" placeholder="Страна" aria-label="Страна" />
            </div>
          </div>

          {/* Фильтр-чипы + сортировка */}
          <div className="my-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5">
              {FILTERS.map((f) => (
                <Checkbox
                  key={f.key}
                  size="xs"
                  checked={active.has(f.key)}
                  onChange={() => toggle(f.key)}
                  label={f.label}
                />
              ))}
            </div>
            <button type="button" className="inline-flex items-center gap-2 text-foreground-subtle hover:text-foreground">
              <SortIcon />
              <span className="ds-caption-medium uppercase">By date</span>
              <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          {/* Карточки целей (6, у каждой свой прогресс). Первая — якорь для
              кнопки «Просмотреть все цели» (scroll-mt-8 — отступ при скролле). */}
          {visible.map((g, i) => (
            <div key={g.id} ref={i === 0 ? listRef : undefined} className="scroll-mt-8">
              <GoalCard
                g={g}
                href={`/cabinet/${cabinet.slug}/goals/${g.id}`}
                onEdit={() => router.push(`/cabinet/${cabinet.slug}/goals/${g.id}/edit`)}
                pending={pendingFor(g.id)}
              />
            </div>
          ))}
          {visible.length === 0 && (
            <p className="ds-p1 py-16 text-center text-[var(--color-grey-300)]">Целей не найдено</p>
          )}
        </div>
      </main>
    </div>
  );
}
