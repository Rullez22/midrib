"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * AccountCard — карточка счёта (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / карточка счета раскрыта (node 2237:231380). Стили 1:1.
 *
 * Три секции: баланс (две кнопки + сумма по центру) · характеристики (шапка с
 * заголовком и крестиком + строки label/value) · футер «Редактировать…».
 * Кнопки действий — DS Button (передаются в `leftAction`/`rightAction`).
 *
 * Строка `rows`:
 *   { label, value }                 — лейбл слева (grey-300) · значение справа (dark-900)
 *   { label, value, secondary }      — две stacked-ячейки с вертикальным разделителем
 *
 * @example
 *   <AccountCard
 *     amount="1.231 ETH" secondaryAmount="15.88 USD"
 *     leftAction={<Button size="m" iconLeft={<Up />}>Реквизиты</Button>}
 *     rightAction={<Button size="m" iconLeft={<Down />}>Перевод</Button>}
 *     title="Характеристики целевого счета" onClose={close}
 *     rows={[
 *       { label: "Наименование счета", value: "Целевой",
 *         secondary: { label: "Тип счета", value: "Матрешка" } },
 *       { label: "Назначение счета", value: "…" },
 *     ]}
 *     editLabel="Редактировать % по распределению" onEdit={edit}
 *   />
 *
 * Свёрнутый режим (`collapsed`): панель характеристик и футер скрыты, в правом
 * верхнем углу баланса — шестерёнка с дропдауном (`menuItems`). Источник: Figma
 * 2496:290267 (свёрнутая карта) + 2496:290260 (дропдаун Редактировать/Создать подсчет).
 */

export interface AccountMenuItem {
  label: ReactNode;
  onSelect?: () => void;
}

export interface AccountField {
  label: ReactNode;
  value: ReactNode;
}

export interface AccountRow extends AccountField {
  /** Правая ячейка — две stacked-колонки с вертикальным разделителем. */
  secondary?: AccountField;
}

export interface AccountCardProps {
  /** Подпись над суммой. По умолчанию «Баланс». */
  balanceLabel?: ReactNode;
  /** Сумма (крупно). */
  amount: ReactNode;
  /** Вторичная сумма (например, в USD). */
  secondaryAmount?: ReactNode;
  /** Кнопка слева от суммы. */
  leftAction?: ReactNode;
  /** Кнопка справа от суммы. */
  rightAction?: ReactNode;
  /** Заголовок панели характеристик. */
  title?: ReactNode;
  /** Крестик в шапке панели. */
  onClose?: () => void;
  /** Строки характеристик. */
  rows?: AccountRow[];
  /** Подпись кнопки-футера. */
  editLabel?: ReactNode;
  onEdit?: () => void;
  /**
   * Свёрнутый режим: панель характеристик и футер скрыты, в углу баланса —
   * шестерёнка с дропдауном `menuItems`.
   */
  collapsed?: boolean;
  /** Пункты дропдауна шестерёнки (виден только в свёрнутом режиме). */
  menuItems?: AccountMenuItem[];
  className?: string;
}

function Cell({ label, value }: AccountField) {
  return (
    <span className="ds-account__cell">
      <span className="ds-account__cell-label">{label}</span>
      <span className="ds-account__cell-value">{value}</span>
    </span>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Шестерёнка «отчётность и настройка» (свёрнутый режим). Источник: Figma. */
function GearIcon() {
  return (
    <svg viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.8791 14.64C22.9324 14.2133 22.9724 13.7867 22.9724 13.3333C22.9724 12.88 22.9324 12.4533 22.8791 12.0267L25.6924 9.82667C25.9458 9.62667 26.0124 9.26667 25.8524 8.97333L23.1858 4.36C23.0258 4.06667 22.6658 3.96 22.3724 4.06667L19.0524 5.4C18.3591 4.86667 17.6124 4.42667 16.7991 4.09333L16.2924 0.56C16.2524 0.24 15.9724 0 15.6391 0H10.3058C9.97244 0 9.69244 0.24 9.65244 0.56L9.14578 4.09333C8.33244 4.42667 7.58578 4.88 6.89244 5.4L3.57244 4.06667C3.26578 3.94667 2.91911 4.06667 2.75911 4.36L0.0924421 8.97333C-0.0808912 9.26667 -0.000891189 9.62667 0.252442 9.82667L3.06578 12.0267C3.01244 12.4533 2.97244 12.8933 2.97244 13.3333C2.97244 13.7733 3.01244 14.2133 3.06578 14.64L0.252442 16.84C-0.000891189 17.04 -0.0675579 17.4 0.0924421 17.6933L2.75911 22.3067C2.91911 22.6 3.27911 22.7067 3.57244 22.6L6.89244 21.2667C7.58578 21.8 8.33244 22.24 9.14578 22.5733L9.65244 26.1067C9.69244 26.4267 9.97244 26.6667 10.3058 26.6667H15.6391C15.9724 26.6667 16.2524 26.4267 16.2924 26.1067L16.7991 22.5733C17.6124 22.24 18.3591 21.7867 19.0524 21.2667L22.3724 22.6C22.6791 22.72 23.0258 22.6 23.1858 22.3067L25.8524 17.6933C26.0124 17.4 25.9458 17.04 25.6924 16.84L22.8791 14.64ZM12.9714 18C10.398 18 8.30469 15.9066 8.30469 13.3333C8.30469 10.76 10.398 8.66663 12.9714 8.66663C15.5447 8.66663 17.638 10.76 17.638 13.3333C17.638 15.9066 15.5447 18 12.9714 18Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Шестерёнка + дропдаун в углу баланса (свёрнутый режим). */
function GearMenu({ items }: { items: AccountMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="ds-account__gear">
      <button
        type="button"
        className="ds-account__gear-btn"
        aria-label="Настройки счёта"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <GearIcon />
      </button>
      {open && (
        <div className="ds-account__menu" role="menu">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              className="ds-account__menu-item"
              onClick={() => {
                setOpen(false);
                item.onSelect?.();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountCard({
  balanceLabel = "Баланс",
  amount,
  secondaryAmount,
  leftAction,
  rightAction,
  title,
  onClose,
  rows = [],
  editLabel,
  onEdit,
  collapsed = false,
  menuItems,
  className,
}: AccountCardProps) {
  return (
    <div className={cn("ds-account", className)}>
      {/* Баланс */}
      <div className="ds-account__balance">
        {leftAction != null && <span className="ds-account__action">{leftAction}</span>}
        <div className="ds-account__balance-center">
          <span className="ds-account__balance-label">{balanceLabel}</span>
          <span className="ds-account__balance-amount">{amount}</span>
          {secondaryAmount != null && (
            <span className="ds-account__balance-sub">{secondaryAmount}</span>
          )}
        </div>
        {rightAction != null && <span className="ds-account__action">{rightAction}</span>}
        {/* Свёрнутый режим: шестерёнка «отчётность и настройка» с дропдауном */}
        {collapsed && menuItems != null && menuItems.length > 0 && (
          <GearMenu items={menuItems} />
        )}
      </div>

      {/* Характеристики (скрыты в свёрнутом режиме) */}
      {!collapsed && (title != null || rows.length > 0) && (
        <div className="ds-account__panel">
          {(title != null || onClose) && (
            <div className="ds-account__subhead">
              <span className="ds-account__subhead-title">{title}</span>
              {onClose && (
                <button
                  type="button"
                  className="ds-account__subhead-close"
                  aria-label="Закрыть"
                  onClick={onClose}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          )}
          {rows.map((row, i) =>
            row.secondary ? (
              <div key={i} className="ds-account__row ds-account__row--pair">
                <Cell label={row.label} value={row.value} />
                <span className="ds-account__vdivider" aria-hidden="true" />
                <Cell label={row.secondary.label} value={row.secondary.value} />
              </div>
            ) : (
              <div key={i} className="ds-account__row">
                <span className="ds-account__label">{row.label}</span>
                <span className="ds-account__value">{row.value}</span>
              </div>
            ),
          )}
        </div>
      )}

      {/* Футер (скрыт в свёрнутом режиме) */}
      {!collapsed && editLabel != null && (
        <button type="button" className="ds-account__edit" onClick={onEdit}>
          {editLabel}
        </button>
      )}
    </div>
  );
}
