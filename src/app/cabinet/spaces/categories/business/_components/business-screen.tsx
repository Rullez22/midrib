"use client";

import { useRouter } from "next/navigation";
import { CultureShell } from "../../../_components/culture-shell";

/**
 * BusinessScreen — «Бизнес» кооператива «Культура 3» (Figma 7021-572597).
 * Открывается кликом по направлению «Бизнес» в категориях. Список под-направлений
 * карточками (обложка + подпись).
 */

const P = "https://images.unsplash.com/";
const CARDS = [
  { title: "Промышленные\nмашины", img: `${P}photo-1565043666747-69f6646db940?w=200&q=80` },
  { title: "Легковой\nи грузовой транспорт", img: `${P}photo-1502877338535-766e1452684a?w=200&q=80` },
  { title: "ЖД и Авиа\nтранспорт", img: `${P}photo-1436491865332-7a61a109cc05?w=200&q=80` },
];

function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BusinessScreen() {
  const router = useRouter();

  return (
    <CultureShell active="mash">
      {/* Верхняя полоса: назад + заголовок по центру. */}
      <div className="relative flex h-[64px] items-center border-b border-border px-8">
        <button
          type="button"
          aria-label="Назад"
          onClick={() => router.push("/cabinet/spaces/categories")}
          className="flex size-9 items-center justify-center rounded-[6px] bg-[var(--color-grey-20)] text-foreground-subtle transition-colors hover:bg-surface-sunken"
        >
          <BackIcon className="size-4" />
        </button>
        <span className="-translate-x-1/2 absolute left-1/2 ds-p1-medium text-foreground">Бизнес</span>
      </div>

      {/* Карточки под-направлений. */}
      <div className="grid grid-cols-1 gap-5 px-8 py-6 md:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <button
            key={c.title}
            type="button"
            className="flex items-center gap-4 rounded-[10px] border border-border bg-[#fff] p-3 text-left transition-shadow hover:shadow-sm"
          >
            <img src={c.img} alt="" className="size-16 shrink-0 rounded-[8px] object-cover" />
            <span className="ds-p3-medium whitespace-pre-line text-foreground">{c.title}</span>
          </button>
        ))}
      </div>
    </CultureShell>
  );
}
