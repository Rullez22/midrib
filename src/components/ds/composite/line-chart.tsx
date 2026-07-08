"use client";

import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * LineChart — сглаженный линейный график с осями и тултипом (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Graph partner (677:27). Стили 1:1.
 *
 * Презентационный SVG: сглаженная линия (Catmull-Rom → Безье), горизонтальная
 * сетка с подписями по оси Y (справа), подписи по оси X (снизу), опциональная
 * подсвеченная точка с тёмным тултипом. Адаптивный (viewBox + 100% ширина).
 *
 * Опции насыщенности/интерактивности (обратно совместимы, по умолчанию off):
 * `area` — градиентная заливка под линией; `interactive` — курсор следует за
 * мышью и подсвечивает ближайшую точку с тултипом.
 *
 * @example
 *   <LineChart
 *     unit="ETH"
 *     yTicks={[100, 150, 200, 300]}
 *     points={[
 *       { label: "Авг 2018", value: 150 }, { label: "Сен 2018", value: 200 }, …
 *     ]}
 *     highlightIndex={4}
 *     area
 *     interactive
 *   />
 */

export interface LineChartPoint {
  label: ReactNode;
  value: number;
}

export interface LineChartProps {
  points: LineChartPoint[];
  /** Отметки оси Y (снизу вверх). */
  yTicks: number[];
  /** Единица измерения для подписей оси Y и тултипа. */
  unit?: string;
  /** Индекс подсвеченной точки (тултип). Игнорируется при наведении, если `interactive`. */
  highlightIndex?: number;
  /** Цвет линии. По умолчанию blue-midhub-500. */
  color?: string;
  /** Градиентная заливка под линией. По умолчанию false. */
  area?: boolean;
  /** Наведение мышью подсвечивает ближайшую точку и ведёт вертикальный курсор. */
  interactive?: boolean;
  className?: string;
}

const W = 1000;
const H = 240;
const PAD_R = 56; // место под подписи оси Y справа
const PAD_B = 32; // место под подписи оси X
const PAD_T = 28; // воздух сверху под тултип

/** Сглаженный путь через точки (Catmull-Rom → кубический Безье). */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function LineChart({
  points,
  yTicks,
  unit = "",
  highlightIndex,
  color = "var(--color-blue-midhub-500)",
  area = false,
  interactive = false,
  className,
}: LineChartProps) {
  const gradId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const plotW = W - PAD_R;
  const plotH = H - PAD_B - PAD_T;
  const minY = Math.min(...yTicks);
  const maxY = Math.max(...yTicks);
  const spanY = maxY - minY || 1;

  const xOf = (i: number) =>
    points.length > 1 ? (i / (points.length - 1)) * plotW : plotW / 2;
  const yOf = (v: number) => PAD_T + plotH - ((v - minY) / spanY) * plotH;

  const coords = points.map((p, i) => ({ x: xOf(i), y: yOf(p.value) }));
  const path = smoothPath(coords);
  const areaPath =
    coords.length > 1
      ? `${path} L ${coords[coords.length - 1].x} ${PAD_T + plotH} L ${coords[0].x} ${PAD_T + plotH} Z`
      : "";

  // Активная точка: наведение (если interactive) имеет приоритет над highlightIndex.
  const activeIndex =
    interactive && hover != null
      ? hover
      : highlightIndex != null && highlightIndex >= 0 && highlightIndex < points.length
        ? highlightIndex
        : null;
  const hi =
    activeIndex != null ? { ...coords[activeIndex], value: points[activeIndex].value } : null;

  // Якорь HTML-подписи по индексу: первая — слева, последняя — справа, прочие — по центру.
  const anchorX = (i: number) =>
    i === 0 ? "0" : i === points.length - 1 ? "-100%" : "-50%";

  // Ближайшая точка к курсору (координаты в долях ширины контейнера).
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < coords.length; i++) {
      const d = Math.abs(coords[i].x - svgX);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    setHover(best);
  };

  return (
    <div
      className={cn("relative w-full", className)}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      style={interactive ? { cursor: "crosshair" } : undefined}
    >
      {/* SVG — только векторная графика (сетка, линия, точка). Текст рендерим HTML-ом
          поверх, чтобы размер шрифта был ровно 12px и не масштабировался вместе с viewBox. */}
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
        {area && (
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}

        {/* Сетка оси Y */}
        {yTicks.map((t) => {
          const y = yOf(t);
          return (
            <line key={t} x1={0} y1={y} x2={plotW} y2={y} stroke="var(--color-border)" strokeWidth={1} />
          );
        })}

        {/* Заливка под линией */}
        {area && areaPath && <path d={areaPath} fill={`url(#${gradId})`} stroke="none" />}

        {/* Вертикальный курсор наведения */}
        {hi && interactive && (
          <line x1={hi.x} y1={PAD_T} x2={hi.x} y2={PAD_T + plotH} stroke={color} strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
        )}

        {/* Линия */}
        <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Подсвеченная точка */}
        {hi && (
          <g>
            <circle cx={hi.x} cy={hi.y} r={9} fill={color} opacity={0.18} />
            <circle cx={hi.x} cy={hi.y} r={5.5} fill="#fff" stroke={color} strokeWidth={2.5} />
          </g>
        )}
      </svg>

      {/* Подписи оси Y (справа) */}
      {yTicks.map((t) => (
        <span
          key={t}
          className="ds-caption pointer-events-none absolute -translate-y-1/2 whitespace-nowrap text-right"
          style={{ right: 0, top: `${(yOf(t) / H) * 100}%`, fontSize: 12, color: "var(--color-foreground-subtle)" }}
        >
          {t} {unit}
        </span>
      ))}

      {/* Подписи оси X (снизу) */}
      {points.map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute whitespace-nowrap"
          style={{
            left: `${(xOf(i) / W) * 100}%`,
            top: `${((H - 14) / H) * 100}%`,
            transform: `translateX(${anchorX(i)})`,
            fontSize: 12,
            color: "var(--color-foreground-subtle)",
          }}
        >
          {p.label}
        </span>
      ))}

      {/* Тултип подсвеченной точки */}
      {hi && (
        <span
          className="pointer-events-none absolute whitespace-nowrap rounded-md px-2.5 py-1 font-medium text-[#fff]"
          style={{
            left: `${(hi.x / W) * 100}%`,
            top: `${(hi.y / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 12px))",
            fontSize: 12,
            background: "var(--color-dark-900)",
          }}
        >
          {hi.value} {unit}
        </span>
      )}
    </div>
  );
}
