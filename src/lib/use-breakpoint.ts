"use client";

import { useEffect, useState } from "react";

/**
 * JS-responsive хук для случаев, когда одних Tailwind-классов мало —
 * условный рендер РАЗНЫХ деревьев компонентов по ширине экрана
 * (mobile drawer vs desktop split-view, разное число слайдов и т.п.).
 *
 * Для обычной адаптивности (padding/gap/шрифт/скрыть-показать) —
 * по-прежнему используем Tailwind-классы (`md:` / `lg:` / `xl:`),
 * см. docs/RESPONSIVE_FIRST_RULES.md. Хук — только когда классов недостаточно.
 *
 * Брейкпоинты выровнены под дефолты Tailwind v4: md=768, lg=1024, xl=1280.
 */
export const BP = { mobile: 767, tablet: 1024, desktop: 1280 } as const;

export interface Breakpoint {
  /** Текущая ширина окна (px). До монтирования — значение по умолчанию (desktop). */
  w: number;
  /** <= 767 — телефоны. */
  isMobile: boolean;
  /** 768–1024 — планшеты, малые ноутбуки. */
  isTablet: boolean;
  /** > 1024 — десктоп. */
  isDesktop: boolean;
  /** > 1280 — большие мониторы. */
  isLargeDesktop: boolean;
  /**
   * true после первого клиентского рендера. До монтирования хук отдаёт
   * серверный дефолт (desktop). Если по брейкпоинту рендерятся РАЗНЫЕ деревья,
   * ветвитесь только при `mounted`, иначе возможен hydration mismatch.
   */
  mounted: boolean;
}

/** Ширина по умолчанию до монтирования (SSR / первый рендер) — десктоп. */
const SSR_WIDTH = 1280;

export function useBreakpoint(): Breakpoint {
  const [w, setW] = useState<number>(SSR_WIDTH);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    onResize();
    setMounted(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    w,
    isMobile: w <= BP.mobile,
    isTablet: w > BP.mobile && w <= BP.tablet,
    isDesktop: w > BP.tablet,
    isLargeDesktop: w > BP.desktop,
    mounted,
  };
}
