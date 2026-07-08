import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Item — строка списка MIDHUB DS.
 * Источник: Figma «UI фичи» / items (node 303:0; варианты 303:18982,
 * 292:45855, 2008:257447, 979:92139, 6203:163650, 107:34134, 1006:92319).
 *
 * Бордерная строка-контейнер: слот `leading` (иконка/чекбокс) · основной
 * контент (`children`, растягивается) · слот `trailing` (действия). Колонки,
 * ссылки, даты — обычная композиция внутри (DS Link / Checkbox / DeleteButton).
 *
 *   size : "l" (66, 14/22) · "m" (56, 12/20) · "s" (48, 14/22) · "xs" (48, 12/20)
 *   tone : "default" (white) · "muted" (grey-10) — только фон; текст dark-900 Regular
 *
 * @example
 *   <Item leading={<IdIcon />} trailing={<Chevron />}>Илья Антонов</Item>
 *   <Item tone="muted" size="m" trailing={<KebabIcon />}>…роль…</Item>
 */

export type ItemSize = "l" | "m" | "s" | "xs";
export type ItemTone = "default" | "muted";

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер: l=66, m=56, s=48, xs=48 компакт. По умолчанию "l". */
  size?: ItemSize;
  /** Тон (фон): default (белый) · muted (grey-10). По умолчанию "default". */
  tone?: ItemTone;
  /** Рамка. По умолчанию true; false — для строк-таблиц (line). */
  bordered?: boolean;
  /** Слот в начале строки (иконка, чекбокс+звезда и т.п.). */
  leading?: ReactNode;
  /** Слот в конце строки (шеврон, дата, иконки-действия). */
  trailing?: ReactNode;
  /** Интерактивная строка: hover-фон и cursor pointer. */
  interactive?: boolean;
  /** Выбранное состояние (рамка blue-500). */
  selected?: boolean;
  children?: ReactNode;
}

const SIZE_CLASS: Record<ItemSize, string> = {
  l: "ds-item--l",
  m: "ds-item--m",
  s: "ds-item--s",
  xs: "ds-item--xs",
};

const TONE_CLASS: Record<ItemTone, string> = {
  default: "ds-item--default",
  muted: "ds-item--muted",
};

export const Item = forwardRef<HTMLDivElement, ItemProps>(function Item(
  {
    size = "l",
    tone = "default",
    bordered = true,
    leading,
    trailing,
    interactive = false,
    selected = false,
    children,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const clickable = interactive || onClick != null;

  return (
    <div
      ref={ref}
      className={cn(
        "ds-item",
        SIZE_CLASS[size],
        TONE_CLASS[tone],
        !bordered && "ds-item--borderless",
        clickable && "ds-item--interactive",
        selected && "ds-item--selected",
        className,
      )}
      onClick={onClick}
      {...(clickable ? { role: "button", tabIndex: 0 } : {})}
      {...rest}
    >
      {leading != null && <span className="ds-item__leading">{leading}</span>}
      <div className="ds-item__content">{children}</div>
      {trailing != null && <span className="ds-item__trailing">{trailing}</span>}
    </div>
  );
});

/** Вертикальный разделитель для слота `trailing`. */
export function ItemDivider() {
  return <span className="ds-item__divider" aria-hidden="true" />;
}
