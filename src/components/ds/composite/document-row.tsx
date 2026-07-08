"use client";

import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Link } from "../link";

/**
 * DocumentRow — строка обработанного документа/заявки (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / document (2124:234849 · 2124:234871 …),
 * экран «обработанные заявки» (2124:233330). Стили 1:1.
 *
 * Бордерная карточка-строка в три зоны (web-first grid):
 *   слева  — цветная точка статуса + «№ (grey-300) / наименование (dark-900)»;
 *   центр  — ссылка на транзакцию (blue) + инфо-иконка;
 *   справа — дата обработки.
 * Цвет точки = тип документа (`status`), палитра общая со StatCounter.
 *
 * @example
 *   <DocumentRow status="yellow" number="№123" name="Полный устав кооператива"
 *     transaction="eg33... k4k4" date="12.01.2020 - 15:00" />
 */

export type DocumentStatus = "yellow" | "green" | "blue";

export interface DocumentRowProps {
  /** Цвет точки-статуса (тип документа). */
  status: DocumentStatus;
  /** Номер документа (например «№123»). */
  number: ReactNode;
  /** Наименование документа. */
  name: ReactNode;
  /** Текст ссылки транзакции (например «eg33... k4k4»). */
  transaction?: ReactNode;
  /** Ссылка транзакции. По умолчанию «#». */
  transactionHref?: string;
  onTransactionClick?: () => void;
  /** Дата обработки (например «12.01.2020 - 15:00»). */
  date: ReactNode;
  className?: string;
}

const DOT_COLOR: Record<DocumentStatus, string> = {
  yellow: "var(--color-yellow-300)",
  green: "var(--color-green-300)",
  blue: "var(--color-blue-midhub-300)",
};

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

export function DocumentRow({
  status,
  number,
  name,
  transaction,
  transactionHref = "#",
  onTransactionClick,
  date,
  className,
}: DocumentRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[4px] border border-border bg-white px-6 py-3",
        className,
      )}
    >
      {/* Слева: точка статуса + № / наименование */}
      <div className="flex min-w-0 items-center gap-4">
        <span
          aria-hidden
          className="size-4 shrink-0 rounded-full"
          style={{ backgroundColor: DOT_COLOR[status] } as CSSProperties}
        />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="ds-p3 text-foreground-subtle">{number}</span>
          <span className="ds-p3 truncate text-foreground">{name}</span>
        </div>
      </div>

      {/* Центр: ссылка на транзакцию + инфо */}
      <div className="flex items-center justify-center gap-1">
        {transaction != null && (
          <>
            <Link href={transactionHref} size="p3" onClick={onTransactionClick}>
              {transaction}
            </Link>
            <InfoIcon />
          </>
        )}
      </div>

      {/* Справа: дата обработки */}
      <span className="ds-p3 text-right text-foreground">{date}</span>
    </div>
  );
}
