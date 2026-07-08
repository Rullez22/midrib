"use client";

/**
 * Демки SearchBar (композит) для витрины /ds.
 * Источник: Figma «UI фичи» / search with two button (975:109067).
 * Переиспользованы DS: SearchBar (Input) + Button (ghost).
 */
import { useState } from "react";
import { SearchBar, Button } from "@/components/ds";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" {...s} />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" {...s} />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" {...s} />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" {...s} />
      <path d="M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V20a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 18.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4 13H4a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 5.7 7L5.6 7a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 5.4V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 20 11h.1a2 2 0 1 1 0 4H20Z" {...s} />
    </svg>
  );
}

export function SearchBarDemos() {
  const [q, setQ] = useState("");
  const [q2, setQ2] = useState("");
  return (
    <div className="flex max-w-[1120px] flex-col gap-4">
      <SearchBar
        placeholder="Label"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        actions={
          <>
            <Button variant="ghost" size="m" iconLeft={<MenuIcon />}>
              Button
            </Button>
            <Button variant="ghost" size="m" iconLeft={<GlobeIcon />}>
              Button
            </Button>
          </>
        }
      />

      {/* Поиск с кнопкой настройки (214:2171): size l + gear */}
      <SearchBar
        size="l"
        placeholder="Поиск по названию, тегам и т.д."
        value={q2}
        onChange={(e) => setQ2(e.target.value)}
        actions={
          <Button variant="ghost" size="l" icon={<GearIcon />} aria-label="Настройки" />
        }
      />
    </div>
  );
}
