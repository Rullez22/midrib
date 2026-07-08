"use client";

/**
 * Демки «Обои» (walls) для витрины /ds.
 * Источник: Figma «UI фичи» / walls (node 1874:299154) — 12 обоев.
 * Reuse: WallpaperPicker / WallpaperTile / WALLPAPERS — новых атомов нет.
 */
import { useState } from "react";
import { WallpaperPicker, WallpaperTile, WALLPAPERS } from "@/components/ds";

export function WallpapersDemos() {
  const [selected, setSelected] = useState<string>("wall-1");

  return (
    <div className="flex max-w-[795px] flex-col gap-10">
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Пикер обоев — выбор одной из 12 (выделение кольцом + галочка)
        </span>
        <WallpaperPicker value={selected} onChange={setSelected} />
        <span className="ds-caption-up text-foreground-subtle">Выбрано: {selected}</span>
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Одна плитка WallpaperTile (картинка и градиент)
        </span>
        <div className="grid grid-cols-2 gap-3">
          <WallpaperTile wallpaper={WALLPAPERS[0]} />
          <WallpaperTile wallpaper={WALLPAPERS[11]} />
        </div>
      </div>
    </div>
  );
}
