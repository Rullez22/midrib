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
 * Combobox — выпадающий список (select) MIDHUB DS.
 * Источник: Figma «UI Контролы» / Combobox (node 205:4202). База — поле Input.
 *
 *   size  : "l" (48) · "m" (40) · "s" (32)
 *   state : default / hover / active(открыт) / disabled; error — проп
 *   view  : шеврон справа всегда; опц. иконка слева (`leftIcon`)
 *
 * Управляемый (`value` + `onValueChange`) или неуправляемый (`defaultValue`).
 *
 * @example
 *   <Combobox
 *     label="Город" placeholder="Выберите"
 *     options={[{value:"msk",label:"Москва"},{value:"spb",label:"Санкт-Петербург"}]}
 *     onValueChange={setCity}
 *   />
 */

export interface ComboboxOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export type ComboboxSize = "l" | "m" | "s";

export interface ComboboxProps {
  size?: ComboboxSize;
  options: ComboboxOption[];
  /** Выбранное значение (управляемый режим). */
  value?: string;
  /** Значение по умолчанию (неуправляемый режим). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: ReactNode;
  /** Плавающая подпись внутри поля. */
  label?: ReactNode;
  /** Вспомогательный текст под полем. */
  caption?: ReactNode;
  /** Иконка слева. */
  leftIcon?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  /** id для связи с внешним <label>. */
  id?: string;
}

const SIZE_CLASS: Record<ComboboxSize, string> = {
  l: "ds-field--l",
  m: "ds-field--m",
  s: "ds-field--s",
};

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="ds-combo__check" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Combobox({
  size = "l",
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Выберите",
  label,
  caption,
  leftIcon,
  error = false,
  disabled = false,
  className,
  id,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const [activeIdx, setActiveIdx] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const current = value !== undefined ? value : internal;
  const selected = options.find((o) => o.value === current);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (open) {
      const sel = options.findIndex((o) => o.value === current);
      setActiveIdx(sel >= 0 ? sel : firstEnabled(options));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(idx: number) {
    const o = options[idx];
    if (!o || o.disabled) return;
    if (value === undefined) setInternal(o.value);
    onValueChange?.(o.value);
    setOpen(false);
  }

  function step(from: number, dir: 1 | -1): number {
    const n = options.length;
    for (let i = 1; i <= n; i++) {
      const j = (from + dir * i + n * i) % n;
      if (!options[j]?.disabled) return j;
    }
    return from;
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else setActiveIdx((i) => step(i, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else setActiveIdx((i) => step(i, -1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && activeIdx >= 0) choose(activeIdx);
        else setOpen(true);
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
    <div
      ref={rootRef}
      className={cn(
        "ds-field",
        SIZE_CLASS[size],
        "ds-combo",
        open && "ds-combo--open",
        error && "ds-field--error",
        disabled && "ds-field--disabled",
        className,
      )}
    >
      <div className="ds-combo__anchor">
        <button
          type="button"
          id={id}
          className="ds-field__box ds-combo__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error || undefined}
          aria-activedescendant={open && activeIdx >= 0 ? `${baseId}-opt-${activeIdx}` : undefined}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
        >
          {leftIcon != null && (
            <span className="ds-field__icon" aria-hidden="true">{leftIcon}</span>
          )}
          <span className="ds-field__main">
            {label != null && <span className="ds-field__label">{label}</span>}
            <span className={cn("ds-combo__value", selected == null && "ds-combo__value--placeholder")}>
              {selected != null ? selected.label : placeholder}
            </span>
          </span>
          <span className="ds-field__icon ds-combo__chevron" aria-hidden="true">
            <ChevronDown />
          </span>
        </button>

        {open && (
          <ul className="ds-anim-menu ds-combo__menu" role="listbox" aria-label={typeof label === "string" ? label : undefined}>
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${baseId}-opt-${i}`}
                role="option"
                aria-selected={o.value === current}
                aria-disabled={o.disabled || undefined}
                data-active={i === activeIdx}
                className="ds-combo__option"
                onMouseEnter={() => !o.disabled && setActiveIdx(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
              >
                <span className="ds-combo__option-label">{o.label}</span>
                {o.value === current && <CheckIcon />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {caption != null && <div className="ds-field__caption">{caption}</div>}
    </div>
  );
}

function firstEnabled(options: ComboboxOption[]): number {
  const i = options.findIndex((o) => !o.disabled);
  return i;
}
