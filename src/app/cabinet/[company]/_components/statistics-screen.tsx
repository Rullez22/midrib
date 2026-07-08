"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  LineChart,
  BarChart,
  DonutChart,
  GeoBars,
  ProgressRing,
  Tabs,
  Tab,
  Badge,
} from "@/components/ds";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";
import { GOALS } from "./goals-data";

/**
 * StatisticsScreen — раздел «Статистика» кабинета «Фонд» (Figma 7021:616815).
 * Сайдбар — наш (CompanySidebar). Насыщенный интерактивный дашборд:
 * переключатель периода (Неделя/Месяц/Год) меняет все данные, счётчики
 * анимированно пересчитываются (count-up) с трендами, график посещений —
 * с заливкой и наведением, кольцо годового плана, источники пожертвований
 * (DonutChart), пожертвования по периодам (BarChart), география (GeoBars),
 * топ целей по сборам и интерактивные теги.
 *
 * Reuse DS: LineChart · BarChart · DonutChart · GeoBars · ProgressRing · Tabs · Badge.
 */

/* ── Иконки счётчиков ───────────────────────────────────────── */

function CoinsIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-7 text-primary">
      <ellipse cx="16" cy="9" rx="9" ry="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 9v6c0 2.2 4 4 9 4s9-1.8 9-4V9M7 15v6c0 2.2 4 4 9 4s9-1.8 9-4v-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-7 text-primary">
      <path d="M16 26S5 19.5 5 12.5A5.5 5.5 0 0 1 16 10a5.5 5.5 0 0 1 11 2.5C27 19.5 16 26 16 26Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-7 text-primary">
      <path d="M10 6h12v5a6 6 0 0 1-12 0V6Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 8H6v2a4 4 0 0 0 4 4M22 8h4v2a4 4 0 0 1-4 4M16 17v4M12 26h8M13 26c0-2 1.3-3 3-3s3 1 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ReceiptIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-7 text-primary">
      <path d="M8 5h16v22l-3-2-3 2-3-2-3 2-3-2-1 .7V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 11h8M12 15h8M12 19h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <path d="M2.5 2.5h5l6 6-5 5-6-6v-5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="5.2" cy="5.2" r="1" fill="currentColor" />
    </svg>
  );
}
function TrendIcon({ up }: { up: boolean }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={up ? "size-3" : "size-3 rotate-180"}>
      <path d="M2 8l3-3 2 2 3-4M10 3v3M10 3H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Данные по периодам ─────────────────────────────────────── */

type PeriodKey = "week" | "month" | "year";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
  { key: "year", label: "Год" },
];

const rub = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;
const int = (n: number) => Math.round(n).toLocaleString("ru-RU");

interface Kpi {
  key: string;
  icon: ReactNode;
  label: string;
  value: number;
  format: (n: number) => string;
  /** Изменение к прошлому периоду, %. */
  delta: number;
}

interface PeriodData {
  kpis: Kpi[];
  /** График посещений. */
  visits: { points: { label: string; value: number }[]; yTicks: number[] };
  /** Источники пожертвований. */
  sources: { label: string; value: number; color: string }[];
  /** Пожертвования по подпериодам (2 серии). */
  bars: { labels: string[]; current: number[]; prev: number[]; yTicks: number[] };
  /** География доноров, %. */
  geo: { label: string; value: number }[];
  /** Годовой план сборов. */
  plan: { pct: number; collected: number; target: number };
  /** Подпись под графиком посещений. */
  visitsCaption: string;
}

const SOURCE_COLORS = [
  "var(--color-blue-midhub-500)",
  "var(--color-cyan-400)",
  "var(--color-green-500)",
  "var(--color-orange-400)",
  "var(--color-purple-500)",
];

const DATA: Record<PeriodKey, PeriodData> = {
  week: {
    kpis: [
      { key: "raised", icon: <CoinsIcon />, label: "Собрано за период", value: 318_400, format: rub, delta: 12 },
      { key: "donations", icon: <HeartIcon />, label: "Пожертвований", value: 214, format: int, delta: 8 },
      { key: "open", icon: <TrophyIcon />, label: "Открытых целей", value: 6, format: int, delta: 0 },
      { key: "avg", icon: <ReceiptIcon />, label: "Средний чек", value: 1_488, format: rub, delta: -3 },
    ],
    visits: {
      points: [
        { label: "Пн", value: 180 },
        { label: "Вт", value: 240 },
        { label: "Ср", value: 210 },
        { label: "Чт", value: 300 },
        { label: "Пт", value: 380 },
        { label: "Сб", value: 290 },
        { label: "Вс", value: 260 },
      ],
      yTicks: [0, 100, 200, 300, 400],
    },
    sources: [
      { label: "Сайт", value: 44, color: SOURCE_COLORS[0] },
      { label: "Telegram", value: 28, color: SOURCE_COLORS[1] },
      { label: "Партнёры", value: 18, color: SOURCE_COLORS[2] },
      { label: "Оффлайн", value: 10, color: SOURCE_COLORS[3] },
    ],
    bars: {
      labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      current: [32, 48, 40, 62, 78, 55, 51],
      prev: [28, 40, 44, 50, 60, 48, 46],
      yTicks: [0, 20, 40, 60, 80],
    },
    geo: [
      { label: "Москва", value: 46 },
      { label: "Санкт-Петербург", value: 22 },
      { label: "Казань", value: 14 },
      { label: "Новосибирск", value: 10 },
      { label: "Екатеринбург", value: 8 },
      { label: "Другие", value: 6 },
    ],
    plan: { pct: 9, collected: 318_400, target: 3_600_000 },
    visitsCaption: "1 860 визитов за неделю",
  },
  month: {
    kpis: [
      { key: "raised", icon: <CoinsIcon />, label: "Собрано за период", value: 1_246_800, format: rub, delta: 18 },
      { key: "donations", icon: <HeartIcon />, label: "Пожертвований", value: 842, format: int, delta: 15 },
      { key: "open", icon: <TrophyIcon />, label: "Открытых целей", value: 6, format: int, delta: 2 },
      { key: "avg", icon: <ReceiptIcon />, label: "Средний чек", value: 1_481, format: rub, delta: 4 },
    ],
    visits: {
      points: [
        { label: "1 нед", value: 1200 },
        { label: "2 нед", value: 1450 },
        { label: "3 нед", value: 1320 },
        { label: "4 нед", value: 1680 },
        { label: "5 нед", value: 1540 },
      ],
      yTicks: [0, 500, 1000, 1500, 2000],
    },
    sources: [
      { label: "Сайт", value: 41, color: SOURCE_COLORS[0] },
      { label: "Telegram", value: 30, color: SOURCE_COLORS[1] },
      { label: "Партнёры", value: 16, color: SOURCE_COLORS[2] },
      { label: "Оффлайн", value: 9, color: SOURCE_COLORS[3] },
      { label: "Реклама", value: 4, color: SOURCE_COLORS[4] },
    ],
    bars: {
      labels: ["1 нед", "2 нед", "3 нед", "4 нед"],
      current: [280, 340, 310, 420],
      prev: [240, 300, 290, 360],
      yTicks: [0, 100, 200, 300, 400],
    },
    geo: [
      { label: "Москва", value: 43 },
      { label: "Санкт-Петербург", value: 24 },
      { label: "Казань", value: 12 },
      { label: "Новосибирск", value: 11 },
      { label: "Екатеринбург", value: 6 },
      { label: "Другие", value: 4 },
    ],
    plan: { pct: 34, collected: 1_246_800, target: 3_600_000 },
    visitsCaption: "7 190 визитов за месяц",
  },
  year: {
    kpis: [
      { key: "raised", icon: <CoinsIcon />, label: "Собрано за период", value: 8_640_000, format: rub, delta: 27 },
      { key: "donations", icon: <HeartIcon />, label: "Пожертвований", value: 9_320, format: int, delta: 22 },
      { key: "open", icon: <TrophyIcon />, label: "Закрытых целей", value: 30, format: int, delta: 11 },
      { key: "avg", icon: <ReceiptIcon />, label: "Средний чек", value: 927, format: rub, delta: -6 },
    ],
    visits: {
      points: [
        { label: "Авг", value: 150 },
        { label: "Сен", value: 130 },
        { label: "Окт", value: 220 },
        { label: "Ноя", value: 175 },
        { label: "Дек", value: 195 },
        { label: "Янв", value: 200 },
        { label: "Фев", value: 165 },
        { label: "Мар", value: 235 },
        { label: "Апр", value: 300 },
        { label: "Май", value: 230 },
      ],
      yTicks: [0, 100, 200, 300],
    },
    sources: [
      { label: "Сайт", value: 38, color: SOURCE_COLORS[0] },
      { label: "Telegram", value: 31, color: SOURCE_COLORS[1] },
      { label: "Партнёры", value: 17, color: SOURCE_COLORS[2] },
      { label: "Оффлайн", value: 8, color: SOURCE_COLORS[3] },
      { label: "Реклама", value: 6, color: SOURCE_COLORS[4] },
    ],
    bars: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      current: [1800, 2400, 2100, 2900],
      prev: [1500, 1900, 2000, 2300],
      yTicks: [0, 1000, 2000, 3000],
    },
    geo: [
      { label: "Москва", value: 40 },
      { label: "Санкт-Петербург", value: 25 },
      { label: "Казань", value: 13 },
      { label: "Новосибирск", value: 12 },
      { label: "Екатеринбург", value: 6 },
      { label: "Другие", value: 4 },
    ],
    plan: { pct: 78, collected: 8_640_000, target: 11_000_000 },
    visitsCaption: "20 000 визитов за год",
  },
};

/* ── Топ целей (реальные данные фонда) ──────────────────────── */

function parseRub(s: string): number {
  return Number(s.replace(/[^\d]/g, "")) || 0;
}

const TOP_GOALS = GOALS.map((g) => {
  const collected = parseRub(g.collected);
  const total = parseRub(g.total) || 1;
  return {
    id: g.id,
    title: g.title,
    image: g.image,
    collected,
    total,
    pct: Math.min(100, Math.round((collected / total) * 100)),
    closed: g.category === "closed",
  };
})
  .sort((a, b) => b.collected - a.collected)
  .slice(0, 5);

const TAGS = ["спорт", "пенсионеры", "инвалиды", "сироты", "альцгеймер", "строительство", "хоккей", "образование"];

/* ── Хук count-up ───────────────────────────────────────────── */

function useCountUp(value: number, duration = 850) {
  const [n, setN] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    const to = value;
    if (start === to) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(start + (to - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return n;
}

/* ── Карточка счётчика ──────────────────────────────────────── */

function KpiCard({ kpi }: { kpi: Kpi }) {
  const animated = useCountUp(kpi.value);
  const up = kpi.delta > 0;
  const flat = kpi.delta === 0;
  return (
    <div className="flex flex-col gap-3 px-6 py-5">
      <div className="flex items-center justify-between">
        {kpi.icon}
        {!flat && (
          <span
            className={
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 ds-caption font-medium " +
              (up ? "bg-[var(--color-green-50)] text-[var(--color-green-600)]" : "bg-[var(--color-red-50)] text-[var(--color-red-600)]")
            }
          >
            <TrendIcon up={up} />
            {Math.abs(kpi.delta)}%
          </span>
        )}
      </div>
      <span className="flex flex-col gap-0.5">
        <span className="ds-h4 tabular-nums text-foreground">{kpi.format(animated)}</span>
        <span className="ds-caption text-foreground-subtle">{kpi.label}</span>
      </span>
    </div>
  );
}

/* ── Карточка-обёртка секции ────────────────────────────────── */

function Card({
  title,
  aside,
  children,
  className,
}: {
  title?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={"flex flex-col gap-4 rounded-[8px] border border-border bg-[#fff] p-6 " + (className ?? "")}>
      {(title || aside) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title && <span className="ds-p2-medium text-foreground">{title}</span>}
          {aside}
        </div>
      )}
      {children}
    </div>
  );
}

/* ── Экран ──────────────────────────────────────────────────── */

export function StatisticsScreen({ cabinet }: { cabinet: CabinetConfig }) {
  const [period, setPeriod] = useState<PeriodKey>("year");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const d = DATA[period];

  const toggleTag = (t: string) =>
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current="statistics" />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
          {/* Заголовок + переключатель периода */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <h1 className="ds-h3 text-foreground">Статистика</h1>
              <span className="ds-caption text-foreground-subtle">Обзор фонда «{cabinet.name}» · обновлено сегодня</span>
            </div>
            <Tabs
              variant="solid-light"
              size="s"
              value={period}
              onValueChange={(v) => setPeriod(v as PeriodKey)}
              aria-label="Период"
            >
              {PERIODS.map((p) => (
                <Tab key={p.key} value={p.key}>
                  {p.label}
                </Tab>
              ))}
            </Tabs>
          </div>

          {/* Счётчики */}
          <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-[8px] border border-border bg-[#fff] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 [&>*:not(:first-child)]:sm:border-l [&>*:not(:first-child)]:sm:border-border">
            {d.kpis.map((k) => (
              <KpiCard key={k.key} kpi={k} />
            ))}
          </div>

          {/* График посещений */}
          <Card
            title="Статистика посещения платформы"
            aside={<span className="ds-caption text-foreground-subtle">{d.visitsCaption}</span>}
          >
            <LineChart
              points={d.visits.points}
              yTicks={d.visits.yTicks}
              highlightIndex={Math.floor(d.visits.points.length / 2)}
              area
              interactive
            />
          </Card>

          {/* Пожертвования по подпериодам + Источники */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Card
              title="Пожертвования по периодам"
              aside={
                <span className="flex items-center gap-4">
                  <LegendDot color="var(--color-blue-midhub-500)" label="Текущий" />
                  <LegendDot color="var(--color-grey-200)" label="Прошлый" />
                </span>
              }
            >
              <BarChart
                series={[
                  { label: "Текущий", color: "var(--color-blue-midhub-500)" },
                  { label: "Прошлый", color: "var(--color-grey-200)" },
                ]}
                groups={d.bars.labels.map((label, i) => ({
                  label,
                  values: [d.bars.current[i], d.bars.prev[i]],
                }))}
                yTicks={d.bars.yTicks}
              />
            </Card>

            <Card title="Источники пожертвований">
              <div className="flex justify-center pt-2">
                <DonutChart segments={d.sources} size={148} thickness={40} />
              </div>
            </Card>
          </div>

          {/* Годовой план + География */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr]">
            <Card title="Годовой план сборов">
              <div className="flex items-center gap-6">
                <ProgressRing
                  value={d.plan.pct}
                  size={132}
                  thickness={12}
                  color="var(--color-cyan-400)"
                  label={<span className="ds-h3 text-foreground">{d.plan.pct}%</span>}
                />
                <div className="flex min-w-0 flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="ds-caption text-foreground-subtle">Собрано</span>
                    <span className="ds-p1-medium tabular-nums text-foreground">{rub(d.plan.collected)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="ds-caption text-foreground-subtle">Цель года</span>
                    <span className="ds-p1-medium tabular-nums text-foreground">{rub(d.plan.target)}</span>
                  </div>
                  <Badge color="cyan">Осталось {rub(Math.max(0, d.plan.target - d.plan.collected))}</Badge>
                </div>
              </div>
            </Card>

            <Card title="География доноров">
              <GeoBars
                rows={d.geo}
                columns={2}
                color="var(--color-blue-midhub-500)"
                className="pt-1"
              />
            </Card>
          </div>

          {/* Топ целей по сборам */}
          <Card title="Топ целей по сборам">
            <ul className="flex flex-col divide-y divide-border">
              {TOP_GOALS.map((g, i) => (
                <li key={g.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                  <span className="ds-caption w-4 shrink-0 text-center font-medium text-foreground-subtle tabular-nums">{i + 1}</span>
                  <span
                    className="size-10 shrink-0 rounded-[6px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${g.image})` }}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="ds-caption truncate text-foreground">{g.title}</span>
                      <span className="ds-caption shrink-0 tabular-nums text-foreground-subtle">
                        {rub(g.collected)} / {rub(g.total)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-grey-90)]">
                      <div
                        className="h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{
                          width: `${g.pct}%`,
                          backgroundColor: g.closed ? "var(--color-orange-400)" : "var(--color-green-500)",
                        }}
                      />
                    </div>
                  </div>
                  <Badge color={g.closed ? "orange" : "green"} className="shrink-0">
                    {g.pct}%
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>

          {/* Часто задаваемые теги (интерактивные фильтры) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="ds-p2-medium text-foreground">Часто задаваемые теги</span>
              {activeTags.size > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTags(new Set())}
                  className="ds-caption text-foreground-subtle transition-colors hover:text-foreground"
                >
                  Сбросить ({activeTags.size})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => {
                const on = activeTags.has(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={
                      "inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-1.5 ds-caption transition-colors " +
                      (on
                        ? "border-[var(--color-cyan-400)] bg-[var(--color-cyan-50)] text-[var(--color-cyan-700)]"
                        : "border-border bg-[#fff] text-foreground-subtle hover:border-[var(--color-cyan-300)] hover:text-foreground")
                    }
                  >
                    <TagIcon />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="ds-caption inline-flex items-center gap-1.5 text-foreground-subtle">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
