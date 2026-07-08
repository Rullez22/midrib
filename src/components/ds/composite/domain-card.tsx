"use client";

import { type HTMLAttributes, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/cn";

/**
 * DomainCard — карточка домена (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Карточка домена (node 215:41782). Стили 1:1.
 *
 * Бордерная карточка: иконка (папка в сером круге 32) + заголовок (Medium 14/22)
 * и две строки-статистики (Regular 14/22) — «Всего документов» и «Поддоменов».
 * Заголовок переносится на вторую строку автоматически (вариант «two line» из Figma).
 *
 * Два вида (по `mine`):
 *   false — «не мой» домен: белый фон, серая рамка (grey-90).
 *   true  — «мой» домен: синий фон (blue-midhub-50), синяя рамка (blue-midhub-500),
 *           в правом верхнем углу шестерёнка настроек (показывается только при mine).
 *
 * Hover (по `:hover`):
 *   не мой → фон grey-20, рамка grey-300.
 *   мой    → фон blue-midhub-100, рамка blue-midhub-800.
 *
 * @example
 *   <DomainCard title="Формы компаний" documentsCount={1} subdomainsCount={0} />
 *
 *   <DomainCard
 *     mine
 *     title="Удостоверяющие личность"
 *     documentsCount={1}
 *     subdomainsCount={0}
 *     onSettings={openSettings}
 *     onClick={openDomain}
 *   />
 */

export interface DomainCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Название домена. */
  title: ReactNode;
  /** Всего документов в домене. */
  documentsCount: ReactNode;
  /** Количество поддоменов. */
  subdomainsCount: ReactNode;
  /** «Мой» домен — синяя палитра + шестерёнка настроек. По умолчанию false. */
  mine?: boolean;
  /** Иконка слева (32×32). По умолчанию — папка в сером круге. */
  icon?: ReactNode;
  /** Подпись строки документов. По умолчанию «Всего документов». */
  documentsLabel?: ReactNode;
  /** Подпись строки поддоменов. По умолчанию «Поддоменов». */
  subdomainsLabel?: ReactNode;
  /** Клик по шестерёнке настроек (рендерится только при `mine`). */
  onSettings?: () => void;
}

export function DomainCard({
  title,
  documentsCount,
  subdomainsCount,
  mine = false,
  icon,
  documentsLabel = "Всего документов",
  subdomainsLabel = "Поддоменов",
  onSettings,
  className,
  ...rest
}: DomainCardProps) {
  const handleSettings = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSettings?.();
  };

  return (
    <div
      className={cn("ds-domain", mine && "ds-domain--mine", className)}
      {...rest}
    >
      {mine && onSettings != null && (
        <button
          type="button"
          className="ds-domain__gear"
          aria-label="Настройки домена"
          onClick={handleSettings}
        >
          <SettingIcon />
        </button>
      )}

      <div className="ds-domain__header">
        <span className="ds-domain__icon" aria-hidden>
          {icon ?? <FolderIcon />}
        </span>
        <span className="ds-domain__title">{title}</span>
      </div>

      <div className="ds-domain__stats">
        <p className="ds-domain__stat">
          <span className="ds-domain__stat-label">{documentsLabel}: </span>
          <span className="ds-domain__stat-value">{documentsCount}</span>
        </p>
        <p className="ds-domain__stat">
          <span className="ds-domain__stat-label">{subdomainsLabel}: </span>
          <span className="ds-domain__stat-value">{subdomainsCount}</span>
        </p>
      </div>
    </div>
  );
}

/** Папка (Outline 24) — иконка по умолчанию, тонируется через currentColor. */
function FolderIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22 10.32V17c0 3-1.5 4-4.5 4h-11C3.5 21 2 20 2 17V7c0-3 1.5-4 4.5-4h1.88c1.06 0 1.36.27 1.76.81l1.13 1.5c.27.36.46.49 1.13.49h2.6c3 0 4.5 1 4.5 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Шестерёнка настроек (Outline 24), тонируется через currentColor. */
function SettingIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85a1.9 1.9 0 0 1 .7-2.59l1.73-.99c.78-.46 1.78-.18 2.24.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.46-.78 1.46-1.06 2.24-.6l1.73.99c.91.52 1.22 1.68.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.78.46-1.78.18-2.24-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.46.78-1.46 1.06-2.24.6l-1.73-.99a1.9 1.9 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
