"use client";

import { useMemo, useState } from "react";

/**
 * Единая сортировка таблиц платформы.
 *
 * Раньше логика сортировки дублировалась ad-hoc в каждом экране (свои
 * parseAmount/parseDate/cmp), а в большинстве таблиц её не было вовсе —
 * колонка помечена `sortable`, стрелка рисуется, но клик ничего не делал.
 * Здесь — один компаратор на всё: даты «дд.мм.гггг», суммы вида «120 000 PAEV»,
 * числа, проценты, строки (по-русски). Пустые значения всегда в конце.
 *
 * @example
 *   const { sorted, sortKey, sortDir, onSort } = useTableSort(docs, { key: "date", dir: "desc" });
 *   <TableHeader columns={COLUMNS} sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
 *   {sorted.map(...)}
 *
 * Если ключ колонки не совпадает с полем строки — передайте `accessor`:
 *   useTableSort(rows, { key: "type", accessor: (r, k) => (k === "type" ? r.kind : r[k]) })
 */

export type SortDir = "asc" | "desc";

/** «25.12.2005» и «11.04.2025 - 19:07» (время опционально). */
const DATE_RE = /^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s*[-–—,]?\s*(\d{1,2}):(\d{2}))?\s*$/;

/** «25.12.2005» / «11.04.2025 - 19:07» → timestamp. NaN, если не дата.
 *  Время учитываем: без него даты с временем сравнивались бы как строки и
 *  ломались на переходе через месяц/год. */
function asDate(v: string): number {
  const m = DATE_RE.exec(v);
  if (!m) return NaN;
  return new Date(
    Number(m[3]),
    Number(m[2]) - 1,
    Number(m[1]),
    m[4] ? Number(m[4]) : 0,
    m[5] ? Number(m[5]) : 0,
  ).getTime();
}

/** «120 000 PAEV», «1 234,56 ₽», «-15 %» → число. NaN, если цифр нет. */
function asNumber(v: string): number {
  if (!/\d/.test(v)) return NaN;
  // Оставляем цифры, минус и разделитель дробной части; пробелы-разряды убираем.
  const cleaned = v.replace(/\s/g, "").replace(/,/g, ".").replace(/[^\d.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/** Сравнение двух значений ячеек по возрастанию. Пустые — в конец. */
export function compareValues(a: unknown, b: unknown): number {
  const aEmpty = a == null || a === "";
  const bEmpty = b == null || b === "";
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);

  const as = String(a);
  const bs = String(b);

  const ad = asDate(as);
  const bd = asDate(bs);
  if (!Number.isNaN(ad) && !Number.isNaN(bd)) return ad - bd;

  const an = asNumber(as);
  const bn = asNumber(bs);
  if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;

  return as.localeCompare(bs, "ru");
}

export interface UseTableSortOptions<T> {
  /** Колонка по умолчанию. Без неё таблица показывается в исходном порядке. */
  key?: string;
  /** Направление по умолчанию. */
  dir?: SortDir;
  /** Достать значение ячейки, если ключ колонки ≠ поле строки. */
  accessor?: (row: T, key: string) => unknown;
}

export function useTableSort<T>(rows: T[], opts: UseTableSortOptions<T> = {}) {
  const { key, dir = "asc", accessor } = opts;
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(
    key ? { key, dir } : null,
  );

  /** Клик по колонке: та же — переворот направления, другая — сортировка по ней. */
  const onSort = (k: string) =>
    setSort((s) => (s && s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const get = accessor ?? ((row: T, k: string) => (row as Record<string, unknown>)[k]);
    // Копия — исходный массив (часто из модуля-константы) не мутируем.
    return [...rows].sort(
      (a, b) => compareValues(get(a, sort.key), get(b, sort.key)) * (sort.dir === "asc" ? 1 : -1),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort?.key, sort?.dir, accessor]);

  return { sorted, sortKey: sort?.key, sortDir: sort?.dir ?? "asc", onSort };
}
