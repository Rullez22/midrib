"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Dropdown — выпадающее меню MIDHUB DS.
 * Источник: Figma «UI Контролы» / Dropdown (node 335:3394).
 *
 * Универсальное меню с любым триггером (Button / Icon / собственный элемент).
 * Для триггера-поля используйте <Combobox> (Dropdown=Basic),
 * для раскрытия панели — <Accordion> (Dropdown=Accordion).
 *
 * @example
 *   <Dropdown
 *     trigger={({ open }) => (
 *       <Button iconRight={<DropdownChevron open={open} />}>Действия</Button>
 *     )}
 *     items={[
 *       { value: "edit", label: "Редактировать" },
 *       { value: "del", label: "Удалить", icon: <TrashIcon /> },
 *     ]}
 *     onSelect={(v) => console.log(v)}
 *   />
 */

export interface DropdownItem {
  value: string;
  label: ReactNode;
  /** Иконка слева. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  /** Триггер: элемент или рендер-функция, получающая { open }. */
  trigger: ReactNode | ((state: { open: boolean }) => ReactNode);
  items: DropdownItem[];
  /** Подсветить выбранный пункт (синий + галочка). */
  value?: string;
  onSelect?: (value: string, item: DropdownItem) => void;
  /** Выравнивание меню относительно триггера. */
  align?: "start" | "end";
  /** Подпись для screen-reader. */
  "aria-label"?: string;
  className?: string;
}

/** Шеврон для кнопки-триггера: поворачивается на 180° при открытии. */
export function DropdownChevron({ open = false }: { open?: boolean }) {
  return (
    <span className={cn("ds-dropdown__chevron", open && "ds-dropdown__chevron--open")} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Check() {
  return (
    <span className="ds-combo__check" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Dropdown({
  trigger,
  items,
  value,
  onSelect,
  align = "start",
  className,
  ...rest
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (open) setActiveIdx(firstEnabled(items));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function step(from: number, dir: 1 | -1): number {
    const n = items.length;
    for (let i = 1; i <= n; i++) {
      const j = (from + dir * i + n * i) % n;
      if (!items[j]?.disabled) return j;
    }
    return from;
  }

  function choose(idx: number) {
    const it = items[idx];
    if (!it || it.disabled) return;
    onSelect?.(it.value, it);
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setOpen(true);
        if (open) setActiveIdx((i) => step(i, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setOpen(true);
        if (open) setActiveIdx((i) => step(i, -1));
        break;
      case "Enter":
      case " ":
        if (open && activeIdx >= 0) {
          e.preventDefault();
          choose(activeIdx);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className={cn("ds-dropdown", className)} onKeyDown={onKeyDown}>
      <div
        className="ds-dropdown__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {typeof trigger === "function" ? trigger({ open }) : trigger}
      </div>

      {open && (
        <ul
          className={cn("ds-combo__menu", "ds-dropdown__menu", align === "end" && "ds-dropdown__menu--end")}
          role="menu"
          aria-label={rest["aria-label"]}
        >
          {items.map((it, i) => (
            <li
              key={it.value}
              id={`${baseId}-item-${i}`}
              role="menuitem"
              aria-selected={value != null ? it.value === value : undefined}
              aria-disabled={it.disabled || undefined}
              data-active={i === activeIdx}
              className="ds-combo__option"
              onMouseEnter={() => !it.disabled && setActiveIdx(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
            >
              {it.icon != null && <span className="ds-combo__option-icon">{it.icon}</span>}
              <span className="ds-combo__option-label">{it.label}</span>
              {value != null && it.value === value && <Check />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function firstEnabled(items: DropdownItem[]): number {
  return items.findIndex((it) => !it.disabled);
}
