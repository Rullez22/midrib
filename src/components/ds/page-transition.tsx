"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const FADE_CLASS = "ds-content--fade";

/**
 * PageTransition — плавная смена страниц внутри раздела.
 *
 * Ставится в layout раздела и оборачивает `children`.
 *
 * Почему НЕ key={pathname} и не корневой template.tsx (оба ре-монтируют
 * поддерево при навигации): под layout'ами живут провайдеры, чьё состояние
 * обязано переживать переход —
 *   • RegFlowProvider — форма создания компании на useState, без localStorage:
 *     ре-монт обнулял бы её между шагами 7 → 8;
 *   • CabinetUnlockProvider ([company]/layout) — ре-монт снова прятал бы
 *     разблокированные пункты меню ВУЗа;
 *   • SplashGate — показывал бы splash на каждый переход внутри /app.
 * Обёртка с key ре-монтирует и ВЛОЖЕННЫЕ layout'ы вместе с их провайдерами,
 * поэтому здесь ре-монта нет вовсе: DOM сохраняется, при смене pathname просто
 * перезапускается CSS-анимация (снять класс → reflow → вернуть класс).
 *
 * Вариант анимации — только fade (opacity), намеренно: `transform` на предке
 * создаёт containing block для position: fixed, и на время анимации мобильный
 * drawer/бургер/модалки уезжали бы вместе с контентом.
 *
 * `className` — когда обёртка встаёт между flex-контейнером и страницей,
 * которая рассчитывает быть flex-item (см. AppShell): пробрасываем те же
 * flex-классы, иначе страница теряет контекст и скролл ломается.
 */
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    // При первом монтировании анимация уже отработала из разметки.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const el = ref.current;
    if (!el) return;
    el.classList.remove(FADE_CLASS);
    void el.offsetWidth; // reflow: без него браузер не заметит перезапуск
    el.classList.add(FADE_CLASS);
  }, [pathname]);

  return (
    <div ref={ref} className={cn(FADE_CLASS, className)}>
      {children}
    </div>
  );
}
