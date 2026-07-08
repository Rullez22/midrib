"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/ds";
import { CultureShell } from "../../_components/culture-shell";

/**
 * CategoriesScreen — «Категории» кооператива «Культура 3» (Figma 7021-572213).
 * Открывается кликом по ячейке матрицы КОБ. Сетка направлений 3×N с эмодзи;
 * клик по «Бизнес» ведёт к списку под-направлений. Собран из DS: SearchBar.
 */

interface Category {
  emoji: string;
  label: string;
  href?: string;
}
const CATEGORIES: Category[] = [
  { emoji: "💼", label: "Бизнес", href: "/cabinet/spaces/categories/business" },
  { emoji: "🖼️", label: "Графика и дизайн" },
  { emoji: "❤️", label: "Здоровье" },
  { emoji: "🔬", label: "Медицина" },
  { emoji: "🎧", label: "Музыка" },
  { emoji: "🏢", label: "Новости" },
  { emoji: "☂️", label: "Погода" },
  { emoji: "🔋", label: "Производительность" },
  { emoji: "🚏", label: "Путешествия" },
  { emoji: "🗂️", label: "Социальные сети" },
  { emoji: "🏙️", label: "Спорт" },
  { emoji: "🔍", label: "Справочники" },
];

export function CategoriesScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <CultureShell active="mash">
      {/* Верхняя полоса: заголовок + поиск. */}
      <div className="flex h-[64px] items-center gap-6 border-b border-border px-8">
        <span className="ds-p1-medium shrink-0 text-foreground">Категории</span>
        <SearchBar className="flex-1" placeholder="Поиск" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {/* Сетка направлений: 3 колонки, каждый элемент с нижним разделителем. */}
      <div className="grid grid-cols-1 gap-x-8 px-8 py-6 md:grid-cols-2 xl:grid-cols-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => c.href && router.push(c.href)}
            className="flex items-center gap-3 border-b border-border py-3 text-left transition-colors hover:bg-surface-sunken"
          >
            <span className="text-[18px] leading-none">{c.emoji}</span>
            <span className="ds-p2 text-foreground">{c.label}</span>
          </button>
        ))}
      </div>
    </CultureShell>
  );
}
