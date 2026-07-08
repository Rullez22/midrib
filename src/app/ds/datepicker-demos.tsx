"use client";

import { useState } from "react";
import {
  Calendar,
  Datepicker,
  type CalendarRange,
  type DatepickerSize,
} from "@/components/ds";

/**
 * Витрина Datepicker / Calendar — 1:1 с Figma «UI Контролы»
 * / Datepicker (1346:59461) и Calendar (1349:59464).
 */

const SIZES: { size: DatepickerSize; label: string }[] = [
  { size: "l", label: "L-48" },
  { size: "m", label: "M-40" },
  { size: "s", label: "S-32" },
];

export function DatepickerDemos() {
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<CalendarRange>({ start: null, end: null });
  const [calDate, setCalDate] = useState<Date | null>(new Date(2019, 11, 15));
  const [calRange, setCalRange] = useState<CalendarRange>({
    start: new Date(2019, 11, 15),
    end: new Date(2019, 11, 22),
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Поля: одна дата / диапазон × размеры */}
      <div className="grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <span className="ds-caption-up text-foreground-subtle">Одна дата</span>
          {SIZES.map(({ size, label }) => (
            <Datepicker
              key={size}
              size={size}
              label={label}
              value={date}
              onChange={setDate}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <span className="ds-caption-up text-foreground-subtle">Диапазон</span>
          {SIZES.map(({ size, label }) => (
            <Datepicker
              key={size}
              size={size}
              mode="range"
              label={`Период · ${label}`}
              rangeValue={range}
              onRangeChange={setRange}
            />
          ))}
        </div>
      </div>

      {/* Состояния */}
      <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Datepicker error caption="Обязательное поле" placeholder="Не выбрано" />
        <Datepicker disabled placeholder="Недоступно" />
      </div>

      {/* Календарь напрямую */}
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col gap-3">
          <span className="ds-caption-up text-foreground-subtle">Calendar · одна дата</span>
          <Calendar
            mode="single"
            selected={calDate}
            onSelectDate={setCalDate}
            defaultMonth={new Date(2019, 11, 1)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="ds-caption-up text-foreground-subtle">Calendar · диапазон</span>
          <Calendar
            mode="range"
            range={calRange}
            onSelectRange={setCalRange}
            defaultMonth={new Date(2019, 11, 1)}
          />
        </div>
      </div>
    </div>
  );
}
