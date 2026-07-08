"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Calendar — календарь MIDHUB DS.
 * Источник: Figma «UI Контролы» / Calendar (node 1349:59464). Стили 1:1.
 *
 * Поддерживает выбор одной даты (`mode="single"`) и диапазона
 * (`mode="range"`). Шапка переключает режимы: ‹ Месяц▾ Год▾ ›, клик по
 * названию месяца/года открывает панель выбора. Неделя начинается с Пн.
 *
 * Управляемый по значению; режим просмотра (месяц) — внутренний с
 * возможностью контроля через `month` + `onMonthChange`.
 *
 * @example
 *   <Calendar mode="single" selected={date} onSelectDate={setDate} />
 *   <Calendar mode="range" range={range} onSelectRange={setRange} />
 */

export type CalendarMode = "single" | "range";

export interface CalendarRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarProps {
  mode?: CalendarMode;
  /** Выбранная дата (mode="single"). */
  selected?: Date | null;
  onSelectDate?: (date: Date) => void;
  /** Выбранный диапазон (mode="range"). */
  range?: CalendarRange;
  onSelectRange?: (range: CalendarRange) => void;
  /** Контролируемый месяц просмотра (любой день месяца). */
  month?: Date;
  /** Месяц просмотра по умолчанию (неуправляемый режим). */
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Минимально / максимально допустимая дата. */
  min?: Date;
  max?: Date;
  className?: string;
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS_FULL = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const MONTHS_SHORT = [
  "Янв", "Фев", "Март", "Апр", "Май", "Июнь",
  "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек",
];
const YEARS_PER_PAGE = 16;

/* ── Утилиты дат (без времени) ───────────────────────────────── */
function atMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
/** Смещение первого дня месяца при старте недели с понедельника. */
function leadingBlanks(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}
function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return (
    a != null && b != null &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function compareDay(a: Date, b: Date): number {
  return atMidnight(a).getTime() - atMidnight(b).getTime();
}
function isDisabled(d: Date, min?: Date, max?: Date): boolean {
  if (min != null && compareDay(d, min) < 0) return true;
  if (max != null && compareDay(d, max) > 0) return true;
  return false;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m14 7-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m10 7 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type View = "days" | "months" | "years";

export function Calendar({
  mode = "single",
  selected,
  onSelectDate,
  range,
  onSelectRange,
  month,
  defaultMonth,
  onMonthChange,
  min,
  max,
  className,
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState<Date>(() =>
    startOfMonth(defaultMonth ?? selected ?? range?.start ?? new Date()),
  );
  const [view, setView] = useState<View>("days");
  /** Превью второго конца диапазона при наведении. */
  const [hover, setHover] = useState<Date | null>(null);

  const viewMonth = startOfMonth(month ?? internalMonth);
  const year = viewMonth.getFullYear();
  const monthIdx = viewMonth.getMonth();

  function setMonth(next: Date) {
    const m = startOfMonth(next);
    if (month === undefined) setInternalMonth(m);
    onMonthChange?.(m);
  }

  /* Стрелки: дни → ±месяц, месяцы → ±год, годы → ±страница лет. */
  function nav(dir: 1 | -1) {
    if (view === "days") setMonth(addMonths(viewMonth, dir));
    else if (view === "months") setMonth(new Date(year + dir, monthIdx, 1));
    else setMonth(new Date(year + dir * YEARS_PER_PAGE, monthIdx, 1));
  }

  function pickDay(day: number) {
    const date = new Date(year, monthIdx, day);
    if (isDisabled(date, min, max)) return;
    if (mode === "single") {
      onSelectDate?.(date);
      return;
    }
    const cur = range ?? { start: null, end: null };
    if (cur.start == null || cur.end != null) {
      onSelectRange?.({ start: date, end: null });
    } else if (compareDay(date, cur.start) < 0) {
      onSelectRange?.({ start: date, end: cur.start });
    } else {
      onSelectRange?.({ start: cur.start, end: date });
    }
  }

  /* ── Состояние ячеек диапазона ─────────────────────────────── */
  function dayFlags(date: Date) {
    const isSelectedSingle = mode === "single" && isSameDay(date, selected);
    let start = range?.start ?? null;
    let end = range?.end ?? null;
    // Превью при наведении (выбран только старт)
    if (mode === "range" && start != null && end == null && hover != null) {
      end = compareDay(hover, start) < 0 ? start : hover;
      start = compareDay(hover, start) < 0 ? hover : start;
    }
    const isStart = mode === "range" && isSameDay(date, start);
    const isEnd = mode === "range" && isSameDay(date, end);
    const inside =
      mode === "range" && start != null && end != null &&
      compareDay(date, start) > 0 && compareDay(date, end) < 0;
    const hasRange = start != null && end != null && compareDay(start, end) !== 0;
    return {
      selected: isSelectedSingle || isStart || isEnd,
      band: hasRange && (isStart || isEnd || inside),
      isStart: hasRange && isStart,
      isEnd: hasRange && isEnd,
      inside,
    };
  }

  /* ── Рендер сетки дней ─────────────────────────────────────── */
  const blanks = leadingBlanks(year, monthIdx);
  const total = daysInMonth(year, monthIdx);
  const cells: ReactNode[] = [];
  for (let i = 0; i < blanks; i++) {
    cells.push(<div key={`b${i}`} className="ds-cal__cell" aria-hidden="true" />);
  }
  for (let day = 1; day <= total; day++) {
    const date = new Date(year, monthIdx, day);
    const col = (blanks + day - 1) % 7;
    const f = dayFlags(date);
    const disabled = isDisabled(date, min, max);
    // Скругление концов сегмента подложки
    const roundLeft = f.band && (f.isStart || col === 0 || day === 1);
    const roundRight = f.band && (f.isEnd || col === 6 || day === total);
    cells.push(
      <div
        key={day}
        className={cn(
          "ds-cal__cell",
          f.band && "ds-cal__cell--range",
          f.isStart && !f.isEnd && "ds-cal__cell--range-start",
          f.isEnd && !f.isStart && "ds-cal__cell--range-end",
          roundLeft && "ds-cal__cell--round-left",
          roundRight && "ds-cal__cell--round-right",
        )}
      >
        <button
          type="button"
          className={cn("ds-cal__day", f.selected && "ds-cal__day--selected")}
          aria-pressed={f.selected}
          disabled={disabled}
          onClick={() => pickDay(day)}
          onMouseEnter={() => mode === "range" && setHover(date)}
          onMouseLeave={() => mode === "range" && setHover(null)}
        >
          {day}
        </button>
      </div>,
    );
  }
  // Хвостовые пустые ячейки до полной строки
  while (cells.length % 7 !== 0) {
    cells.push(<div key={`t${cells.length}`} className="ds-cal__cell" aria-hidden="true" />);
  }

  return (
    <div className={cn("ds-cal", className)}>
      <div className="ds-cal__head">
        <button type="button" className="ds-cal__nav" aria-label="Назад" onClick={() => nav(-1)}>
          <ChevronLeft />
        </button>
        <div className="ds-cal__switch">
          <button
            type="button"
            className="ds-cal__switch-btn"
            aria-expanded={view === "months"}
            onClick={() => setView((v) => (v === "months" ? "days" : "months"))}
          >
            {MONTHS_FULL[monthIdx]}
            <span className="ds-cal__switch-chevron"><ChevronDown /></span>
          </button>
          <button
            type="button"
            className="ds-cal__switch-btn"
            aria-expanded={view === "years"}
            onClick={() => setView((v) => (v === "years" ? "days" : "years"))}
          >
            {year}
            <span className="ds-cal__switch-chevron"><ChevronDown /></span>
          </button>
        </div>
        <button type="button" className="ds-cal__nav" aria-label="Вперёд" onClick={() => nav(1)}>
          <ChevronRight />
        </button>
      </div>

      {view === "days" && (
        <div className="ds-cal__grid" role="grid">
          {WEEKDAYS.map((w) => (
            <div key={w} className="ds-cal__wd">{w}</div>
          ))}
          {cells}
        </div>
      )}

      {view === "months" && (
        <div className="ds-cal__panel">
          {MONTHS_SHORT.map((m, i) => (
            <button
              key={m}
              type="button"
              className={cn("ds-cal__pick", i === monthIdx && "ds-cal__pick--selected")}
              onClick={() => {
                setMonth(new Date(year, i, 1));
                setView("days");
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {view === "years" && (
        <div className="ds-cal__panel">
          {Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
            const start = year - (year % YEARS_PER_PAGE);
            const y = start + i;
            return (
              <button
                key={y}
                type="button"
                className={cn("ds-cal__pick", y === year && "ds-cal__pick--selected")}
                onClick={() => {
                  setMonth(new Date(y, monthIdx, 1));
                  setView("months");
                }}
              >
                {y}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
