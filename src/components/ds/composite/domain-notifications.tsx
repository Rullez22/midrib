"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * DomainNotifications — панель уведомлений домена (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / notification (node 217:41729). Стили 1:1.
 *
 * Бордерная панель (grey-10) с прилипающей шапкой (white, нижняя рамка grey-90,
 * лёгкая тень) и центрированным заголовком (Medium 14/22). Тело прокручивается и
 * принимает строки уведомлений через `children`; при их отсутствии — пустое
 * состояние (`emptyText`).
 *
 * @example
 *   <DomainNotifications />                       // пустая панель
 *
 *   <DomainNotifications title="Уведомления">
 *     <Item …/>
 *     <Item …/>
 *   </DomainNotifications>
 */

export interface DomainNotificationsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Заголовок шапки. По умолчанию «Уведомления». */
  title?: ReactNode;
  /** Строки уведомлений. Если пусто — показывается `emptyText`. */
  children?: ReactNode;
  /** Текст пустого состояния. По умолчанию «Нет уведомлений». */
  emptyText?: ReactNode;
}

export function DomainNotifications({
  title = "Уведомления",
  children,
  emptyText = "Нет уведомлений",
  className,
  ...rest
}: DomainNotificationsProps) {
  const isEmpty = children == null || children === false;

  return (
    <div className={cn("ds-notifications", className)} {...rest}>
      <div className="ds-notifications__header">
        <span className="ds-notifications__title">{title}</span>
      </div>
      <div className={cn("ds-notifications__body", isEmpty && "ds-notifications__body--empty")}>
        {isEmpty ? (
          <span className="ds-notifications__empty">{emptyText}</span>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
