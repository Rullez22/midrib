"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * InfoCard — компактная карточка ленты: задание / новость (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / миссия · task (1108:97377), новость (1097:107713).
 * Стили 1:1.
 *
 * Бордерная карточка: мета-строка (иконка + подпись) · опц. прогресс-бар ·
 * заголовок · описание · действие (ссылка/кнопка). Один интерфейс на оба
 * варианта (task = с прогрессом, новость = с временем) — без дублей.
 *
 * @example
 *   <InfoCard meta="Выполнено: 55%" progress={55} title="Задание №1"
 *     description="…" action={<Link href="#" size="p3">Продолжить</Link>} />
 *   <InfoCard meta="1 час назад" title="Новость 1" description="…"
 *     action={<Link href="#" size="p3">Подробнее</Link>} />
 */

export interface InfoCardProps {
  /** Мета-подпись (например «Выполнено: 55%» или «1 час назад»). */
  meta?: ReactNode;
  /** Иконка перед мета-подписью. */
  metaIcon?: ReactNode;
  /** Значение прогресса 0..100 (показывает зелёный бар). */
  progress?: number;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function InfoCard({
  meta,
  metaIcon,
  progress,
  title,
  description,
  action,
  className,
}: InfoCardProps) {
  return (
    <div className={cn("flex w-full max-w-[320px] flex-col gap-3 rounded-[10px] border border-border bg-white p-4", className)}>
      {(meta != null || metaIcon != null) && (
        <span className="ds-caption inline-flex items-center gap-1.5 text-foreground-subtle">
          {metaIcon}
          {meta}
        </span>
      )}

      {progress != null && (
        <div className="relative h-1.5 w-full rounded-full bg-[var(--color-grey-90)]">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: "var(--color-green-300)" }}
          />
          <div
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#fff]"
            style={{ left: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: "var(--color-green-300)" }}
          />
        </div>
      )}

      <span className="ds-p2-medium text-foreground">{title}</span>
      {description != null && <span className="ds-p3 text-foreground-muted">{description}</span>}
      {action != null && <div>{action}</div>}
    </div>
  );
}
