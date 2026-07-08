"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Графики статистики — композиты MIDHUB DS.
 * Источник: Figma «UI фичи» / профиль кооператива · Статистика (1795:298776):
 * «Пол / Возраст» (сгруппированные столбцы), «Девайсы» (кольцевая диаграмма),
 * «Гео» (строки с мини-прогрессом). Стили 1:1.
 *
 * Презентационные SVG/flex — данные приходят через props, цвета — CSS-токены.
 *
 * Экспорт: BarChart · DonutChart · GeoBars.
 */

/* ── BarChart (сгруппированные столбцы) ─────────────────────── */

export interface BarSeries {
  label: ReactNode;
  /** CSS-цвет столбца (например `var(--color-blue-midhub-500)`). */
  color: string;
}
export interface BarGroup {
  label: ReactNode;
  /** Значения по сериям (в тех же единицах, что и `yTicks`). */
  values: number[];
}

export interface BarChartProps {
  series: BarSeries[];
  groups: BarGroup[];
  /** Отметки оси Y снизу вверх, напр. [0, 20, 40]. */
  yTicks: number[];
  /** Единица для подписей оси Y, напр. "%". */
  unit?: string;
  className?: string;
}

const BC_W = 1000;
const BC_H = 320;
const BC_PAD_L = 48;
const BC_PAD_B = 32;
const BC_PAD_T = 12;
const BAR_W = 16;
const BAR_GAP = 4;

export function BarChart({ series, groups, yTicks, unit = "", className }: BarChartProps) {
  const plotW = BC_W - BC_PAD_L;
  const plotH = BC_H - BC_PAD_B - BC_PAD_T;
  const maxY = Math.max(...yTicks) || 1;
  const yOf = (v: number) => BC_PAD_T + plotH - (v / maxY) * plotH;
  const slot = plotW / groups.length;
  const clusterW = series.length * BAR_W + (series.length - 1) * BAR_GAP;

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={`0 0 ${BC_W} ${BC_H}`} className="h-auto w-full" role="img">
        {/* Сетка + подписи оси Y */}
        {yTicks.map((t) => {
          const y = yOf(t);
          return (
            <g key={t}>
              <line x1={BC_PAD_L} y1={y} x2={BC_W} y2={y} stroke="var(--color-grey-90)" strokeWidth={1} />
              <text x={BC_PAD_L - 10} y={y + 4} textAnchor="end" fill="var(--color-grey-300)" style={{ fontSize: 12 }}>
                {t}{unit}
              </text>
            </g>
          );
        })}

        {/* Столбцы по группам */}
        {groups.map((g, gi) => {
          const cx = BC_PAD_L + slot * gi + slot / 2;
          const startX = cx - clusterW / 2;
          return (
            <g key={gi}>
              {g.values.map((v, si) => {
                const x = startX + si * (BAR_W + BAR_GAP);
                const y = yOf(v);
                const h = BC_PAD_T + plotH - y;
                return (
                  <rect
                    key={si}
                    x={x}
                    y={y}
                    width={BAR_W}
                    height={Math.max(0, h)}
                    rx={3}
                    fill={series[si]?.color ?? "var(--color-grey-200)"}
                  />
                );
              })}
              <text x={cx} y={BC_H - 8} textAnchor="middle" fill="var(--color-grey-300)" style={{ fontSize: 12 }}>
                {g.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── DonutChart (кольцевая диаграмма) ───────────────────────── */

export interface DonutSegment {
  label: ReactNode;
  value: number;
  color: string;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  /** Размер кольца, px. По умолчанию 132. */
  size?: number;
  /** Толщина кольца, px. По умолчанию 38. */
  thickness?: number;
  /** Показывать легенду справа. По умолчанию true. */
  legend?: boolean;
  /** Показывать % на сегментах. По умолчанию true. */
  showLabels?: boolean;
  className?: string;
}

export function DonutChart({
  segments,
  size = 132,
  thickness = 38,
  legend = true,
  showLabels = true,
  className,
}: DonutChartProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  let acc = 0;
  const arcs = segments.map((seg) => {
    const frac = seg.value / total;
    const dash = frac * c;
    const offset = -acc * c;
    const mid = (acc + frac / 2) * 2 * Math.PI - Math.PI / 2;
    acc += frac;
    return {
      seg,
      dash,
      offset,
      labelX: cx + r * Math.cos(mid),
      labelY: cy + r * Math.sin(mid),
      pct: Math.round(frac * 100),
    };
  });

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={a.seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${a.dash} ${c - a.dash}`}
              strokeDashoffset={a.offset}
            />
          ))}
        </g>
        {showLabels &&
          arcs.map((a, i) => (
            <text
              key={i}
              x={a.labelX}
              y={a.labelY + 4}
              textAnchor="middle"
              fill="#fff"
              style={{ fontSize: 12, fontWeight: 500 }}
            >
              {a.pct}%
            </text>
          ))}
      </svg>

      {legend && (
        <ul className="flex flex-col gap-2">
          {segments.map((s, i) => (
            <li key={i} className="ds-caption flex items-center gap-2 text-foreground-muted">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── GeoBars (строки с мини-прогрессом) ─────────────────────── */

export interface GeoRow {
  label: ReactNode;
  /** Значение в процентах 0..100. */
  value: number;
}

export interface GeoBarsProps {
  rows: GeoRow[];
  /** Число колонок. По умолчанию 2. */
  columns?: number;
  /** Цвет заполнения. По умолчанию blue-midhub 500. */
  color?: string;
  className?: string;
}

export function GeoBars({
  rows,
  columns = 2,
  color = "var(--color-blue-midhub-500)",
  className,
}: GeoBarsProps) {
  return (
    <div
      className={cn("grid gap-x-10 gap-y-4", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {rows.map((r, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="ds-caption text-foreground">{r.label}</span>
            <span className="ds-caption text-foreground-subtle">{r.value}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-grey-90)]">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, r.value))}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
