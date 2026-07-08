import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * ProgressRing — кольцевой индикатор прогресса / донат (MIDHUB DS).
 * Источник: Figma «UI фичи» / Голосование — «Завершённость голосования» 75%/100%
 * (nodes 136:26218, 196:310). Стили 1:1.
 *
 * SVG-кольцо: серый трек + синяя дуга прогресса; в центре — значение (или `label`).
 *
 * @example
 *   <ProgressRing value={75} />
 *   <ProgressRing value={100} size={140} color="var(--color-green-500)" />
 */

export interface ProgressRingProps {
  /** Прогресс 0–100. */
  value: number;
  /** Диаметр, px. По умолчанию 120. */
  size?: number;
  /** Толщина кольца, px. По умолчанию 10. */
  thickness?: number;
  /** Цвет дуги. По умолчанию blue-midhub-500. */
  color?: string;
  /** Цвет трека. По умолчанию grey-90. */
  trackColor?: string;
  /** Контент в центре. По умолчанию `${value}%`. */
  label?: ReactNode;
  className?: string;
}

export function ProgressRing({
  value,
  size = 120,
  thickness = 10,
  color = "var(--color-blue-midhub-500)",
  trackColor = "var(--color-grey-90)",
  label,
  className,
}: ProgressRingProps) {
  const v = Math.min(100, Math.max(0, value));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - v / 100);
  const center = size / 2;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={center} cy={center} r={r} fill="none" stroke={trackColor} strokeWidth={thickness} />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <span className="absolute ds-h4 text-foreground">{label ?? `${v}%`}</span>
    </div>
  );
}
