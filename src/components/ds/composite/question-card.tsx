"use client";

import {
  useId,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * QuestionCard — раскрывающаяся карточка вопроса (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Questions · state=close/open/open-small
 * (nodes 903:85344, 903:85253, 1991:201794; кадры 903:85167, 296:0). Стили 1:1.
 *
 * Бордерная карточка: шапка (заголовок слева + статус-иконка · разделитель ·
 * шеврон справа) раскрывает панель с описанием и опциональным футером-кнопкой.
 *
 *   size : "l" (шапка 66, текст 14/22) · "s" (шапка 44, текст 12/20)
 *   icon : "lock" (заблокирован) · "share" (можно отправить) · ReactNode · нет
 *
 * Управляемый (`open` + `onOpenChange`) или неуправляемый (`defaultOpen`).
 *
 * @example
 *   <QuestionCard title="Изменить управляющего" icon="lock" />
 *
 *   <QuestionCard
 *     title="Изменить управляющего"
 *     icon="share"
 *     defaultOpen
 *     footer={<Button variant="secondary" size="s">Подробнее</Button>}
 *   >
 *     Тут описание вопроса, выносимый на голосование…
 *   </QuestionCard>
 */

export type QuestionCardSize = "l" | "s";
export type QuestionCardIcon = "lock" | "share";

export interface QuestionCardProps {
  /** Заголовок (в шапке). */
  title: ReactNode;
  /** Размер. По умолчанию "l". */
  size?: QuestionCardSize;
  /** Статус-иконка в шапке: "lock" · "share" · своя нода · нет. */
  icon?: QuestionCardIcon | ReactNode | null;
  /** Раскрыта (управляемый режим). */
  open?: boolean;
  /** Раскрыта по умолчанию (неуправляемый режим). */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Футер панели (обычно кнопка «Подробнее»). */
  footer?: ReactNode;
  /** Тело панели. */
  children?: ReactNode;
  className?: string;
}

const SIZE_CLASS: Record<QuestionCardSize, string> = {
  l: "ds-qcard--l",
  s: "ds-qcard--s",
};

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 12H9a5 5 0 0 0-5 5v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function renderIcon(icon: QuestionCardProps["icon"]): ReactNode {
  if (icon == null) return null;
  if (icon === "lock") return <LockIcon />;
  if (icon === "share") return <ShareIcon />;
  return icon;
}

export function QuestionCard({
  title,
  size = "l",
  icon,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  footer,
  children,
  className,
}: QuestionCardProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const current = open !== undefined ? open : internal;
  const panelId = useId();
  const iconNode = renderIcon(icon);

  function toggle() {
    if (disabled) return;
    if (open === undefined) setInternal((v) => !v);
    onOpenChange?.(!current);
  }

  return (
    <div
      className={cn(
        "ds-qcard",
        SIZE_CLASS[size],
        current && "ds-qcard--open",
        disabled && "ds-qcard--disabled",
        className,
      )}
    >
      <button
        type="button"
        className="ds-qcard__header"
        aria-expanded={current}
        aria-controls={panelId}
        disabled={disabled}
        onClick={toggle}
      >
        <span className="ds-qcard__title">{title}</span>
        <span className="ds-qcard__actions">
          {iconNode != null && (
            <>
              <span className="ds-qcard__icon" aria-hidden="true">{iconNode}</span>
              <span className="ds-qcard__divider" aria-hidden="true" />
            </>
          )}
          <span className="ds-qcard__chevron" aria-hidden="true">
            <ChevronIcon />
          </span>
        </span>
      </button>
      {current && (
        <div id={panelId} className="ds-qcard__panel" role="region">
          {children != null && <div className="ds-qcard__body">{children}</div>}
          {footer != null && <div className="ds-qcard__footer">{footer}</div>}
        </div>
      )}
    </div>
  );
}
