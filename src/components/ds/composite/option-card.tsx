import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * OptionCard — карточка-выбор варианта (композит MIDHUB DS).
 * Источник: Figma «For select part» (node 2655:394380/394381 и др.) — экраны
 * выбора типа действия: иллюстрация сверху → заголовок → описание → кнопка.
 *
 * Используется на экранах-развилках раздела «Кооператив»: Разовый/Стабильный
 * платёж, Массовое/Персональное подключение, Создание документа и т.п.
 *
 * @example
 *   <OptionCard
 *     media={<img src="/images/cabinet/payment-once.svg" alt="" className="size-[100px]" />}
 *     title="Разовый платеж"
 *     description="Может быть осуществлен как на один адрес…"
 *     action={<Button size="l" onClick={create}>Создать</Button>}
 *   />
 */

export interface OptionCardProps {
  /** Иллюстрация/иконка сверху (обычно 100×100). */
  media?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Кнопка действия снизу (DS Button). */
  action?: ReactNode;
  className?: string;
}

export function OptionCard({ media, title, description, action, className }: OptionCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 rounded-[4px] border border-border bg-surface px-6 py-6 text-center sm:px-12",
        className,
      )}
    >
      {media != null && <div className="flex items-center justify-center">{media}</div>}
      <div className="flex flex-col items-center gap-2">
        <span className="ds-p1-medium text-foreground">{title}</span>
        {description != null && <p className="ds-p3 text-foreground-subtle">{description}</p>}
      </div>
      {action}
    </div>
  );
}
