"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { Calendar, type CalendarRange } from "./calendar";

/**
 * Datepicker — поле выбора даты MIDHUB DS.
 * Источник: Figma «UI Контролы» / Datepicker (node 1346:59461). Стили 1:1.
 *
 * База — поле Input (.ds-field) с иконкой-календарём справа; по клику
 * разворачивается попап с <Calendar>. Поддерживает выбор одной даты
 * (`mode="single"`) и диапазона (`mode="range"`).
 *
 *   size  : "l" (48) · "m" (40) · "s" (32)
 *   state : default / hover / active(открыт) / disabled; error — проп
 *
 * Управляемый (`value`/`rangeValue` + onChange) или неуправляемый
 * (`defaultValue`/`defaultRange`).
 *
 * @example
 *   <Datepicker label="Дата" onChange={setDate} />
 *   <Datepicker mode="range" label="Период отчёта" onRangeChange={setRange} />
 */

export type DatepickerSize = "l" | "m" | "s";

export interface DatepickerProps {
  size?: DatepickerSize;
  mode?: "single" | "range";
  /** Выбранная дата (управляемый, mode="single"). */
  value?: Date | null;
  /** Дата по умолчанию (неуправляемый, mode="single"). */
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  /** Выбранный диапазон (управляемый, mode="range"). */
  rangeValue?: CalendarRange;
  /** Диапазон по умолчанию (неуправляемый, mode="range"). */
  defaultRange?: CalendarRange;
  onRangeChange?: (range: CalendarRange) => void;
  placeholder?: ReactNode;
  /** Плавающая подпись внутри поля. */
  label?: ReactNode;
  /** Вспомогательный текст под полем. */
  caption?: ReactNode;
  /** Минимально / максимально допустимая дата. */
  min?: Date;
  max?: Date;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  /** id для связи с внешним <label>. */
  id?: string;
}

const SIZE_CLASS: Record<DatepickerSize, string> = {
  l: "ds-field--l",
  m: "ds-field--m",
  s: "ds-field--s",
};

const MONTHS_GEN = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Datepicker({
  size = "l",
  mode = "single",
  value,
  defaultValue,
  onChange,
  rangeValue,
  defaultRange,
  onRangeChange,
  placeholder,
  label,
  caption,
  min,
  max,
  error = false,
  disabled = false,
  className,
  id,
}: DatepickerProps) {
  const [open, setOpen] = useState(false);
  const [internalDate, setInternalDate] = useState<Date | null>(defaultValue ?? null);
  const [internalRange, setInternalRange] = useState<CalendarRange>(
    defaultRange ?? { start: null, end: null },
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const curDate = value !== undefined ? value : internalDate;
  const curRange = rangeValue !== undefined ? rangeValue : internalRange;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function handleDate(date: Date) {
    if (value === undefined) setInternalDate(date);
    onChange?.(date);
    setOpen(false);
  }

  function handleRange(next: CalendarRange) {
    if (rangeValue === undefined) setInternalRange(next);
    onRangeChange?.(next);
    if (next.start != null && next.end != null) setOpen(false);
  }

  const hasValue =
    mode === "single"
      ? curDate != null
      : curRange.start != null;

  const placeholderText =
    placeholder ?? (mode === "single" ? "Выбрать дату" : "Выбрать период");

  let display: ReactNode = placeholderText;
  if (mode === "single" && curDate != null) {
    display = formatDate(curDate);
  } else if (mode === "range" && curRange.start != null) {
    display = curRange.end != null
      ? `${formatDate(curRange.start)} — ${formatDate(curRange.end)}`
      : formatDate(curRange.start);
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "ds-field",
        SIZE_CLASS[size],
        "ds-datepicker",
        open && "ds-datepicker--open",
        error && "ds-field--error",
        disabled && "ds-field--disabled",
        className,
      )}
    >
      <div className="ds-datepicker__anchor">
        <button
          type="button"
          id={id}
          className="ds-field__box ds-datepicker__trigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={error || undefined}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="ds-field__main">
            {label != null && <span className="ds-field__label" id={labelId}>{label}</span>}
            <span className={cn("ds-datepicker__value", !hasValue && "ds-datepicker__value--placeholder")}>
              {display}
            </span>
          </span>
          <span className="ds-field__icon ds-datepicker__calicon" aria-hidden="true">
            <CalendarIcon />
          </span>
        </button>

        {open && (
          <div className="ds-datepicker__popover" role="dialog" aria-label={typeof label === "string" ? label : "Выбор даты"}>
            {mode === "single" ? (
              <Calendar
                mode="single"
                selected={curDate}
                onSelectDate={handleDate}
                defaultMonth={curDate ?? undefined}
                min={min}
                max={max}
              />
            ) : (
              <Calendar
                mode="range"
                range={curRange}
                onSelectRange={handleRange}
                defaultMonth={curRange.start ?? undefined}
                min={min}
                max={max}
              />
            )}
          </div>
        )}
      </div>
      {caption != null && <div className="ds-field__caption">{caption}</div>}
    </div>
  );
}
