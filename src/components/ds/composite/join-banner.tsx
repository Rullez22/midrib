import { Button } from "../button";
import { cn } from "@/lib/cn";

/**
 * JoinBanner — баннер «Хотите стать пайщиком подразделения?» (композит MIDHUB DS).
 * Источник: Figma cabinet mains / счета. Используется в профиле подразделения
 * (DeptProfile) и на экране «Счета».
 *
 * Почему не собран на DS `<Banner tone="info">`: тон info даёт ровно эти рамку
 * и фон (blue-midhub-500 / blue-midhub-50), но типографика у Banner крупнее —
 * заголовок 16/24 и описание 14/22, тогда как здесь по макету 14/22 и 12/20.
 * Переиспользование сломало бы 1:1 с Figma, поэтому вёрстка своя.
 *
 * Отклик на наведение — общий `ds-row` (лифт мягкой тени), как у остальных
 * блоков платформы.
 *
 * @example
 *   <JoinBanner onApply={() => openRequest()} />
 */

export interface JoinBannerProps {
  /** Заголовок. По умолчанию — «Хотите стать пайщиком подразделения ?». */
  title?: string;
  /** Пояснение под заголовком. */
  description?: string;
  /** Подпись кнопки. По умолчанию — «Оставить заявку». */
  actionLabel?: string;
  /** Клик по кнопке. */
  onApply?: () => void;
  className?: string;
}

function JoinIcon() {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 24 24" className="size-7 text-primary" aria-hidden>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" {...s} />
      <circle cx="8.5" cy="11" r="2" {...s} />
      <path d="M5.5 16c.5-1.6 5-1.6 6 0M14 10h4M14 13.5h4" {...s} />
    </svg>
  );
}

export function JoinBanner({
  title = "Хотите стать пайщиком подразделения ?",
  description = "Чтобы стать пайщиком, необходимо оставить заявку на вступление",
  actionLabel = "Оставить заявку",
  onApply,
  className,
}: JoinBannerProps) {
  return (
    <div
      className={cn(
        "ds-row flex flex-col gap-3 rounded-[4px] border border-primary bg-primary-soft px-6 py-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <JoinIcon />
        <div className="flex flex-col">
          <span className="ds-p3-medium text-foreground">{title}</span>
          <span className="ds-caption text-foreground-muted">{description}</span>
        </div>
      </div>
      <Button size="m" className="md:self-auto" onClick={onApply}>
        {actionLabel}
      </Button>
    </div>
  );
}
