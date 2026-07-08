"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Обои (Wallpapers) — обложки/фоны (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / walls (node 1874:299154) — 12 обоев: 11 изображений
 * (`public/walls/wall-1…11.jpg`) + 1 градиент `#9796f0 → #fbc7d4`. Пропорция плитки
 * 1279:494 (широкая обложка). Reuse: `cn` + токены DS (border / surface / primary),
 * новых атомов нет — плитка это `<img>` либо div с CSS-градиентом.
 *
 * Экспорты:
 *  - `WALLPAPERS` — реестр обоев (id · src | gradient · label).
 *  - `WallpaperTile` — одна плитка (картинка/градиент) с опц. выделением и галочкой.
 *  - `WallpaperPicker` — выбор обоев из сетки (controlled / uncontrolled).
 */

export interface Wallpaper {
  id: string;
  /** Подпись для a11y / выбора. */
  label: string;
  /** URL изображения обоев. */
  src?: string;
  /** CSS-градиент (для обоев без картинки). */
  gradient?: string;
}

/** Реестр обоев из Figma «walls». */
export const WALLPAPERS: Wallpaper[] = [
  { id: "wall-1", label: "Обои 1", src: "/walls/wall-1.jpg" },
  { id: "wall-2", label: "Обои 2", src: "/walls/wall-2.jpg" },
  { id: "wall-3", label: "Обои 3", src: "/walls/wall-3.jpg" },
  { id: "wall-4", label: "Обои 4", src: "/walls/wall-4.jpg" },
  { id: "wall-5", label: "Обои 5", src: "/walls/wall-5.jpg" },
  { id: "wall-6", label: "Обои 6", src: "/walls/wall-6.jpg" },
  { id: "wall-7", label: "Обои 7", src: "/walls/wall-7.jpg" },
  { id: "wall-8", label: "Обои 8", src: "/walls/wall-8.jpg" },
  { id: "wall-9", label: "Обои 9", src: "/walls/wall-9.jpg" },
  { id: "wall-10", label: "Обои 10", src: "/walls/wall-10.jpg" },
  { id: "wall-11", label: "Обои 11", src: "/walls/wall-11.jpg" },
  { id: "wall-12", label: "Градиент", gradient: "linear-gradient(90deg, #9796f0, #fbc7d4)" },
];

/** Маленькая галочка выбора (поверх плитки). */
function CheckBadge() {
  return (
    <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-on-primary shadow">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
        <path d="m4 8.2 2.6 2.6L12 5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export interface WallpaperTileProps {
  wallpaper: Wallpaper;
  selected?: boolean;
  className?: string;
  children?: ReactNode;
}

/** Одна плитка обоев. Пропорция 1279:494. */
export function WallpaperTile({ wallpaper, selected, className, children }: WallpaperTileProps) {
  return (
    <div
      className={cn(
        "relative aspect-[1279/494] w-full overflow-hidden rounded-[8px] bg-surface-muted",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className,
      )}
      style={wallpaper.gradient ? { backgroundImage: wallpaper.gradient } : undefined}
    >
      {wallpaper.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={wallpaper.src} alt={wallpaper.label} className="size-full object-cover" />
      )}
      {selected && <CheckBadge />}
      {children}
    </div>
  );
}

export interface WallpaperPickerProps {
  /** Список обоев (по умолчанию — весь реестр WALLPAPERS). */
  wallpapers?: Wallpaper[];
  /** Выбранный id (controlled). */
  value?: string;
  /** Начальный выбранный id (uncontrolled). */
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Число колонок сетки. По умолчанию 3. */
  columns?: number;
  className?: string;
}

/** Выбор обоев из сетки. Controlled (`value`) или uncontrolled (`defaultValue`). */
export function WallpaperPicker({
  wallpapers = WALLPAPERS,
  value,
  defaultValue,
  onChange,
  columns = 3,
  className,
}: WallpaperPickerProps) {
  const [inner, setInner] = useState<string | undefined>(defaultValue);
  const selected = value ?? inner;

  const handleSelect = (id: string) => {
    if (value === undefined) setInner(id);
    onChange?.(id);
  };

  return (
    <div
      className={cn("grid gap-3", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      role="radiogroup"
      aria-label="Выбор обоев"
    >
      {wallpapers.map((w) => {
        const isSelected = selected === w.id;
        return (
          <button
            key={w.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={w.label}
            onClick={() => handleSelect(w.id)}
            className="rounded-[8px] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
          >
            <WallpaperTile wallpaper={w} selected={isSelected} />
          </button>
        );
      })}
    </div>
  );
}
