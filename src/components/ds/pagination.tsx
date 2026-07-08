import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Pagination — постраничная навигация MIDHUB DS.
 * Источник: Figma «UI Контролы» / Pagination (node 928:29174 …). Стили 1:1.
 *
 *   view : "full"    — [Первая] [‹] [N из M] [›] [Последняя]
 *          "medium"  — [‹] [N из M] [›]
 *          "basic"   — [‹] [›]
 *          "compact" — [‹ Назад] [Далее ›]  (Figma «full (without input)»)
 *   size : "l" (48) · "m" (40) · "s" (32) · "xs" (24)
 *
 * Кнопки гаснут на границах (страница 1 / последняя). Поле «N из M» —
 * редактируемый номер текущей страницы (вызывает onChange).
 *
 * @example
 *   <Pagination page={1} total={200} onChange={setPage} />
 *   <Pagination view="basic" size="s" page={p} total={t} onChange={setPage} />
 */

export type PaginationSize = "l" | "m" | "s" | "xs";
export type PaginationView = "full" | "medium" | "basic" | "compact";

const SIZE_CLASS: Record<PaginationSize, string> = {
  l: "ds-pagination--l",
  m: "ds-pagination--m",
  s: "ds-pagination--s",
  xs: "ds-pagination--xs",
};

function ChevronLeft() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M10.5 3 5.5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5.5 3 10.5 8l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Текущая страница (1-based). */
  page: number;
  /** Всего страниц. */
  total: number;
  /** Колбэк смены страницы (значение уже зажато в [1, total]). */
  onChange?: (page: number) => void;
  view?: PaginationView;
  size?: PaginationSize;
  firstLabel?: string;
  lastLabel?: string;
  backLabel?: string;
  nextLabel?: string;
  /** Слово между номером и общим числом: «N из M». */
  ofLabel?: string;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    total,
    onChange,
    view = "full",
    size = "l",
    firstLabel = "Первая",
    lastLabel = "Последняя",
    backLabel = "Назад",
    nextLabel = "Далее",
    ofLabel = "из",
    className,
    ...rest
  },
  ref,
) {
  const go = (p: number) => {
    const clamped = Math.min(Math.max(p, 1), total);
    if (clamped !== page) onChange?.(clamped);
  };
  const atStart = page <= 1;
  const atEnd = page >= total;

  const prevBtn = (
    <button
      type="button"
      className="ds-pagination__btn ds-pagination__btn--icon"
      aria-label="Предыдущая страница"
      disabled={atStart}
      onClick={() => go(page - 1)}
    >
      <ChevronLeft />
    </button>
  );

  const nextBtn = (
    <button
      type="button"
      className="ds-pagination__btn ds-pagination__btn--icon"
      aria-label="Следующая страница"
      disabled={atEnd}
      onClick={() => go(page + 1)}
    >
      <ChevronRight />
    </button>
  );

  const field = (
    <span className="ds-pagination__field">
      <input
        className="ds-pagination__input"
        inputMode="numeric"
        aria-label="Номер страницы"
        value={page}
        style={{ width: `calc(${String(page).length}ch + 2px)` }}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!Number.isNaN(v)) go(v);
        }}
      />
      <span className="ds-pagination__of">
        {ofLabel} {total}
      </span>
    </span>
  );

  return (
    <nav
      ref={ref}
      aria-label="Постраничная навигация"
      className={cn("ds-pagination", SIZE_CLASS[size], className)}
      {...rest}
    >
      {view === "compact" ? (
        <>
          <button
            type="button"
            className="ds-pagination__btn ds-pagination__btn--compact"
            disabled={atStart}
            onClick={() => go(page - 1)}
          >
            <ChevronLeft />
            {backLabel}
          </button>
          <button
            type="button"
            className="ds-pagination__btn ds-pagination__btn--compact"
            disabled={atEnd}
            onClick={() => go(page + 1)}
          >
            {nextLabel}
            <ChevronRight />
          </button>
        </>
      ) : (
        <>
          {view === "full" && (
            <button
              type="button"
              className="ds-pagination__btn ds-pagination__btn--label"
              disabled={atStart}
              onClick={() => go(1)}
            >
              {firstLabel}
            </button>
          )}
          {prevBtn}
          {(view === "full" || view === "medium") && field}
          {nextBtn}
          {view === "full" && (
            <button
              type="button"
              className="ds-pagination__btn ds-pagination__btn--label"
              disabled={atEnd}
              onClick={() => go(total)}
            >
              {lastLabel}
            </button>
          )}
        </>
      )}
    </nav>
  );
});
