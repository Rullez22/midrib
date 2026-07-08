import Link from "next/link";

/**
 * FlowNav — служебный навигатор по шагам флоу (не из Figma).
 * Позволяет «пройти флоу» вперёд/назад независимо от состояния кнопок экрана.
 * Фиксирован справа снизу.
 */
export function FlowNav({ step, total }: { step: number; total: number }) {
  const prevHref = step <= 1 ? "/company-not-created" : `/flow/manager-invite/${step - 1}`;
  const nextHref = step >= total ? null : `/flow/manager-invite/${step + 1}`;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-pill border border-border bg-background/95 px-2 py-1.5 shadow-md backdrop-blur">
      <Link
        href={prevHref}
        className="ds-btn ds-btn--xs ds-btn--ghost"
        aria-label="Предыдущий шаг"
      >
        <span className="ds-btn__label">← Назад</span>
      </Link>
      <span className="ds-caption-medium px-1 text-foreground-muted">
        {step} / {total}
      </span>
      {nextHref ? (
        <Link href={nextHref} className="ds-btn ds-btn--xs ds-btn--primary" aria-label="Следующий шаг">
          <span className="ds-btn__label">Далее →</span>
        </Link>
      ) : (
        <span className="ds-btn ds-btn--xs ds-btn--ghost opacity-40">
          <span className="ds-btn__label">Далее →</span>
        </span>
      )}
    </div>
  );
}
