"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  IncomeSources,
  Link,
  type Transaction,
  type StatSummaryItem,
  type LineChartPoint,
  type AccountCharRow,
} from "@/components/ds";

/**
 * Данные и под-блоки экрана «Отчётность» (Figma 2616:397631 …). Вынесены, чтобы
 * переиспользоваться экраном отчёта и вопросом голосования «Финансовый отчёт».
 * Все табличные части собраны из DS-композитов (ArticlesTable / IncomeSources).
 */

export const PERIOD_DEFAULT = "15 декабря 2019 - 22 декабря 2019";

/* ── Шапка: 5 показателей периода (StatSummary) ──────────────────────────── */
export const STAT_ITEMS: StatSummaryItem[] = [
  { label: "Текущий баланс", value: "1000 ETH" },
  { label: "Начало периода", value: "97 ETH" },
  { label: "Поступило за период", value: "618 ETH" },
  { label: "Распределено за период", value: "518 ETH" },
  { label: "Конец периода", value: "97 ETH" },
];

/* ── График (LineChart) ─────────────────────────────────────────────────── */
export const GRAPH_POINTS: LineChartPoint[] = [
  { label: "Авг 2018", value: 150 },
  { label: "Сен 2018", value: 205 },
  { label: "Окт 2018", value: 175 },
  { label: "Ноя 2018", value: 150 },
  { label: "Дек 2018", value: 200 },
  { label: "Янв 2019", value: 223 },
  { label: "Фев 2019", value: 180 },
  { label: "Мар 2019", value: 210 },
  { label: "Апр 2019", value: 295 },
  { label: "Май 2019", value: 180 },
];
export const Y_TICKS = [100, 150, 200, 300];

/* ── Характеристики целевого счёта (AccountCharacteristics) ──────────────── */
export const CHARACTERISTICS: AccountCharRow[] = [
  { cells: [
    { label: "Наименование счета", value: "Целевой" },
    { label: "Тип счета", value: "Матрешка" },
  ] },
  { label: "Коды и ОКВЭД", value: [
    "81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая;",
    "81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования;",
    "81.30 - Предоставление услуг по благоустройству ландшафта;",
  ] },
  { label: "Назначение счета", value: "Данный счет является основным расчетным счетом кооператива. Неделимый фонд. На него поступают все членские и целевые взносы." },
  { label: "Источник поступлений", value: "Целевые и членские взносы от пайщиков. Никакие другие платежи не принимаются." },
  { label: "Распределение целевого счета и подсчетов", value: [
    "30% - Целевой счет",
    "20% - Счет инвестиционных токенов",
    "20% - Счет управляющих токенов",
    "20% - Маршрутный счет",
    "10% - Маркетинговый счет",
  ] },
];

/* ── Источники поступлений (заголовок + IncomeSources) ───────────────────── */
const INCOME_ROWS = [
  { account: "Целевой счет", color: "cyan" as const, description: "Взносы и иный целевые поступления", code: "214", value: "10" },
  { account: "Маршрутный счет", color: "green" as const, description: "Прибыль с направлений", code: "216", value: "22" },
  { account: "Прочее", color: "purple" as const, description: "Прибыль от предпринимательской и иной деятельности", code: "215", value: "4" },
];

export function IncomeBlock() {
  return <IncomeSources rows={INCOME_ROWS} showHeader />;
}

/* ── Статьи расходов: единый непрерывный «монолит» (Figma 2616:354425 …) ──────
 * Все группы используют ОДНУ колоночную сетку, поэтому «Код»/«%» стоят строго
 * друг под другом во всех группах (Код — right-844, % — right-706.5). Группы без
 * «Текущего баланса» расширяют «Переведено» на 2 колонки (col-span-2). */

// name(1fr) · Код 80 · % 195 · Переведено 191 · Текущий баланс 270 · Подробнее 148.
const EXP_GRID = "grid grid-cols-[minmax(0,1fr)_80px_195px_191px_270px_148px] items-center";

/** Иконка группы (инфо-кружок, цвет — по типу группы). Figma «Icons / Alert». */
function GroupIcon({ color }: { color: string }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] text-[#fff]" style={{ backgroundColor: color }}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
      </svg>
    </span>
  );
}

interface ExpenseRow {
  name: string;
  code: string;
  pct: string;
  moved: string;
  balance?: string;
}
interface ExpenseGroup {
  name: string;
  color: string;
  withBalance: boolean;
  rows: ExpenseRow[];
  total: { pct: string; moved: string; balance?: string };
}

const PAYERS: ExpenseRow[] = [
  { name: "Счет инвестиционных токенов", code: "214", pct: "20", moved: "400", balance: "400" },
  { name: "Счет управляющих токенов", code: "214", pct: "20", moved: "400", balance: "400" },
  { name: "Маршрутный счет", code: "214", pct: "20", moved: "400", balance: "400" },
  { name: "Маркетинговый счет", code: "214", pct: "10", moved: "400", balance: "400" },
];
const addrRows = (names: string[]): ExpenseRow[] => names.map((n, i) => ({ name: n, code: "214", pct: i === 3 ? "10" : "20", moved: "400" }));

const EXPENSE_GROUPS: ExpenseGroup[] = [
  { name: "Пайщики", color: "#fac06c", withBalance: true, rows: PAYERS, total: { pct: "70", moved: "1 000", balance: "350" } },
  { name: "Стабильные адреса", color: "#e89297", withBalance: false, rows: addrRows(['ООО "Ромашка"', 'ООО "Малина"', 'ООО "Калина"', 'ООО "Хмель"']), total: { pct: "70", moved: "230" } },
  { name: "Произвольные адреса", color: "#9ed89f", withBalance: false, rows: addrRows(['ООО "Чай"', "Иван Аверин", "Антонина Шмитер", 'ИП "Март"']), total: { pct: "70", moved: "230" } },
  { name: "Коммерческая деятельность", color: "#93d9df", withBalance: false, rows: addrRows(['ООО "Чай"', "Иван Аверин", "Антонина Шмитер", 'ИП "Март"']), total: { pct: "70", moved: "230" } },
];

const Cell = ({ children, span }: { children?: ReactNode; span?: boolean }) => (
  <span className={cn("ds-p3 text-center text-foreground", span && "col-span-2")}>{children}</span>
);

export function ExpenseGroups() {
  return (
    <div className="flex flex-col">
      {EXPENSE_GROUPS.map((g) => (
        <div key={g.name} className="flex flex-col">
          {/* Заголовок группы (серая плашка): иконка + название + подписи колонок */}
          <div className={cn(EXP_GRID, "border-b border-border bg-[#f9fafc] py-2.5")}>
            <div className="flex items-center gap-3 pl-4">
              <GroupIcon color={g.color} />
              <span className="ds-caption-medium text-foreground">{g.name}</span>
            </div>
            <span className="ds-caption-medium text-center text-foreground">Код</span>
            <span className="ds-caption-medium text-center text-foreground">%</span>
            <span className={cn("ds-caption-medium text-center text-foreground", !g.withBalance && "col-span-2")}>Переведено за период (ETH)</span>
            {g.withBalance && <span className="ds-caption-medium text-center text-foreground">Текущий баланс (ETH)</span>}
            <span aria-hidden />
          </div>
          {/* Строки группы */}
          {g.rows.map((r, i) => (
            <div key={i} className={cn(EXP_GRID, "border-b border-border py-4")}>
              <span className="ds-p3 truncate pl-[60px] text-foreground">{r.name}</span>
              <Cell>{r.code}</Cell>
              <Cell>{r.pct}</Cell>
              <Cell span={!g.withBalance}>{r.moved}</Cell>
              {g.withBalance && <Cell>{r.balance}</Cell>}
              <span className="text-center"><Link href="#" size="p3">Подробнее</Link></span>
            </div>
          ))}
          {/* Итого (серая плашка) */}
          <div className={cn(EXP_GRID, "border-b border-border bg-[#f9fafc] py-4")}>
            <span className="ds-p3-medium pl-[60px] text-foreground">Итого</span>
            <span aria-hidden />
            <span className="ds-p3-medium text-center text-foreground">{g.total.pct}</span>
            <span className={cn("ds-p3-medium text-center text-foreground", !g.withBalance && "col-span-2")}>{g.total.moved}</span>
            {g.withBalance && <span className="ds-p3-medium text-center text-foreground">{g.total.balance}</span>}
            <span aria-hidden />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Последние транзакции (TransactionsTable) ───────────────────────────── */
export const TRANSACTIONS: Transaction[] = [
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счет на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счет на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счет на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "216", color: "purple", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Взносы и целевые поступления", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "215", color: "green", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Поступления с маршрутных счетов", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
];

/* ── Форматирование периода из диапазона календаря ──────────────────────── */
const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
function fmtDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
export function formatRange(start: Date | null, end: Date | null): string | null {
  if (!start || !end) return null;
  return `${fmtDate(start)} - ${fmtDate(end)}`;
}
