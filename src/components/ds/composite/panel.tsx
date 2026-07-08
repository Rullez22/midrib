"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "../button";

/**
 * Panel — секция-карточка с шапкой и действием «Добавить» (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / шаблон документа — «Поля документа», «Требования…»,
 * «Описание к шаблону» (nodes 427:46, 601:61787, 434:0, 1405:166565…). Стили 1:1.
 *
 * Бордерная карточка: шапка (grey-10) с заголовком + тело (`children`) +
 * опциональный футер-кнопка «+ Добавить …» (по центру, tertiary).
 * Базовый каркас экранов-конструкторов (поля, требования, роли).
 *
 * @example
 *   <Panel title="Поля документа" addLabel="Добавить поле" onAdd={add}>
 *     {fields.map(f => <QuestionCard key={f} size="s" title={f} />)}
 *   </Panel>
 */

export interface PanelProps {
  title?: ReactNode;
  /** Подпись футер-кнопки «Добавить». Без неё футера нет. */
  addLabel?: ReactNode;
  onAdd?: () => void;
  children?: ReactNode;
  /** Класс на тело (по умолчанию padding 24; передай "p-0" для списков). */
  bodyClassName?: string;
  className?: string;
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Panel({
  title,
  addLabel,
  onAdd,
  children,
  bodyClassName,
  className,
}: PanelProps) {
  return (
    <div className={cn("overflow-hidden rounded-[4px] border border-border bg-surface", className)}>
      {title != null && (
        <div className="flex h-[66px] items-center border-b border-border bg-surface-sunken px-6">
          <span className="ds-p3 text-foreground">{title}</span>
        </div>
      )}
      {children != null && <div className={bodyClassName ?? "p-6"}>{children}</div>}
      {addLabel != null && (
        <div className="flex justify-center border-t border-border">
          <Button variant="tertiary" iconLeft={<PlusIcon />} onClick={onAdd}>
            {addLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
