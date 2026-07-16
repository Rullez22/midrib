"use client";

import { type ReactNode, useState } from "react";
import {
  Tabs,
  Tab,
  StatCounter,
  ReportPeriodBar,
  Calendar,
  Link,
  TableHeader,
  type CalendarRange,
  type TableColumn,
  type SortDir,
} from "@/components/ds";
import { ProcessedDocDetail } from "./validator-processed-screen";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * ValidatorReferralScreen — раздел «Реферальные» кабинета валидатора (№2).
 * Figma: tab1 «Доходы с клиентской сети» 6722-376784 · tab2 «Доходы с
 * партнёрской сети» 6722-376313.
 *
 * Reuse: DS Tabs · ReportPeriodBar (+ Calendar range) · StatCounter (3 цветные) ·
 * Link. Клик по документу в «Операциях» открывает ту же деталь, что и на
 * «Обработанных» — ProcessedDocDetail.
 */

type NetTab = "client" | "partner";
const TX = "0x0317f1ab4… 11ab4d";

const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const fmt = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

/** Операции — обработанные документы с вознаграждением (клик → деталь). */
const OPERATIONS = [
  { number: "№ 123", name: "Паспорт РФ", reward: "18 ETH", date: "03.06.2025 - 15:00" },
  { number: "№ 222", name: "Лицензия", reward: "9 ETH", date: "22.04.2025 - 10:25" },
];

/** Строки таблицы категории (Документ · Количество) — те же документы, что в «Операциях». */
const CATEGORY_ROWS = [
  { doc: "Паспорт РФ", count: 1 },
  { doc: "Лицензия", count: 1 },
];

/** Уровни партнёрской сети (только tab «partner»). */
const LEVELS = [
  { level: "1", partners: 14, reg: 137, lic: 96 },
  { level: "2", partners: 23, reg: 218, lic: 154 },
];

// ── Мелкие таблицы (бордерная карточка, DS-токены) ───────────────────────────
function Cell({ children, align = "left", muted, head }: { children: ReactNode; align?: "left" | "right" | "center"; muted?: boolean; head?: boolean }) {
  return (
    <span className={`${head ? "ds-caption-medium" : "ds-p3"} ${muted ? "text-foreground-subtle" : "text-foreground"} ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"} min-w-0 truncate`}>
      {children}
    </span>
  );
}

/** Таблица «Документ · Количество» + Итого + полоса доходности. */
function CategoryTable() {
  return (
    <div className="overflow-hidden rounded-[4px] border border-border">
      <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-3">
        <Cell head muted>Документ</Cell>
        <Cell head muted align="right">Количество</Cell>
      </div>
      {CATEGORY_ROWS.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] gap-4 border-t border-border px-6 py-3">
          <Cell>{r.doc}</Cell>
          <Cell align="right">{r.count}</Cell>
        </div>
      ))}
      <div className="grid grid-cols-[1fr_auto] gap-4 border-t border-border bg-[var(--color-grey-10)] px-6 py-3">
        <Cell muted>Итого</Cell>
        <Cell align="right">{CATEGORY_ROWS.reduce((s, r) => s + r.count, 0)}</Cell>
      </div>
      <div className="border-t border-border bg-[var(--color-blue-midhub-50,#eef5ff)] px-6 py-3 text-center">
        <span className="ds-p3 text-foreground">Доходность: 27 ETH</span>
      </div>
    </div>
  );
}

/** Таблица уровней партнёрской сети (tab «partner»). */
function LevelsTable() {
  const cols = "grid grid-cols-[1fr_1fr_1fr_1.6fr] gap-4 px-6 py-3";
  return (
    <div className="overflow-hidden rounded-[4px] border border-border">
      <div className={cols}>
        <Cell head muted>Уровень</Cell>
        <Cell head muted align="center">Партнеры</Cell>
        <Cell head muted align="center">Регистрация</Cell>
        <Cell head muted align="right">Лицензии выданные вашими партнерами</Cell>
      </div>
      {LEVELS.map((r, i) => (
        <div key={i} className={`${cols} border-t border-border`}>
          <Cell>{r.level}</Cell>
          <Cell align="center">{r.partners}</Cell>
          <Cell align="center">{r.reg}</Cell>
          <Cell align="right">{r.lic}</Cell>
        </div>
      ))}
      <div className={`${cols} border-t border-border bg-[var(--color-grey-10)]`}>
        <Cell muted>Итого</Cell>
        <Cell align="center">{LEVELS.reduce((s, r) => s + r.partners, 0)}</Cell>
        <Cell align="center">{LEVELS.reduce((s, r) => s + r.reg, 0)}</Cell>
        <Cell align="right">{LEVELS.reduce((s, r) => s + r.lic, 0)}</Cell>
      </div>
    </div>
  );
}

/** Колонки таблицы «Операции» (DS TableHeader + строки на тех же flex). */
const OP_COLUMNS: TableColumn[] = [
  { key: "name", label: "Наименование документа", sortable: true, flex: 2 },
  { key: "reward", label: "Вознаграждение", flex: 1 },
  { key: "tx", label: "Номер транзакции", align: "center", flex: 1.5 },
  { key: "date", label: "Дата обработки", align: "right", sortable: true, flex: 1 },
];

/** Таблица «Операции» — DS TableHeader + строки-плашки (единый стандарт
    со страницами «Заявки»/«Обработанные»). Клик по строке открывает деталь. */
function OperationsTable({ onOpen }: { onOpen: (name: string) => void }) {
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const onSort = (k: string) => {
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  };
  return (
    <div className="flex flex-col gap-2">
      <h2 className="ds-h6 text-foreground">Операции</h2>
      <TableHeader columns={OP_COLUMNS} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
      {OPERATIONS.map((r, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onOpen(r.name)}
          className="ds-row flex items-center gap-2 rounded-[4px] border border-border bg-[#fff] px-6 py-3 text-left"
        >
          <span style={{ flex: 2 }} className="flex min-w-0 flex-col gap-1">
            <span className="ds-caption text-foreground-subtle">{r.number}</span>
            <span className="ds-p3 truncate text-foreground">{r.name}</span>
          </span>
          <span style={{ flex: 1 }} className="ds-p3 min-w-0 text-foreground">{r.reward}</span>
          <span style={{ flex: 1.5 }} className="flex min-w-0 justify-center"><Link href="#" size="p3">{TX}</Link></span>
          <span style={{ flex: 1 }} className="ds-p3 min-w-0 truncate text-right text-foreground">{r.date}</span>
        </button>
      ))}
    </div>
  );
}

// ── Категорийный блок (общий для обоих табов) ────────────────────────────────
function CategoryAndStats({ onOpen }: { onOpen: (name: string) => void }) {
  const [cat, setCat] = useState("ruswan");
  const [calOpen, setCalOpen] = useState(false);
  const [range, setRange] = useState<CalendarRange>({ start: new Date(2025, 3, 1), end: new Date(2025, 5, 30) });
  const period = range.start ? `${fmt(range.start)} - ${range.end ? fmt(range.end) : "…"}` : "—";

  return (
    <>
      <div className="relative flex flex-col items-center">
        <ReportPeriodBar period={period} showHistory={false} onPickPeriod={() => setCalOpen((v) => !v)} />
        {calOpen && (
          <div className="absolute top-full z-20 mt-2 rounded-[8px] border border-border bg-[#fff] p-4 shadow-[0_8px_24px_rgba(90,100,111,0.18)]">
            <Calendar mode="range" range={range} onSelectRange={(r) => { setRange(r); if (r.start && r.end) setCalOpen(false); }} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCounter tone="yellow" label="Документы по желтому типу" value={2} />
        <StatCounter tone="green" label="Документы по зеленому типу" value={1} />
        <StatCounter tone="blue" label="Документы Ruswan" value={2} />
      </div>

      <Tabs value={cat} onValueChange={setCat} variant="solid-light" size="l" equal aria-label="Категория">
        <Tab value="cat1">Удостоверяющие личность</Tab>
        <Tab value="cat2">Финансовые документы</Tab>
        <Tab value="ruswan">Документы Ruswan</Tab>
      </Tabs>

      <CategoryTable />

      <OperationsTable onOpen={onOpen} />
    </>
  );
}

export function ValidatorReferralScreen({ cabinet, current }: { cabinet: CabinetConfig; current: string }) {
  const [tab, setTab] = useState<NetTab>("client");
  const [openedDoc, setOpenedDoc] = useState<string | null>(null);

  if (openedDoc) {
    return <ProcessedDocDetail name={openedDoc} onClose={() => setOpenedDoc(null)} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as NetTab)}
          variant="solid-light"
          size="l"
          equal
          aria-label="Сеть доходов"
          className="w-full rounded-none border-x-0 border-t-0 [grid-auto-columns:minmax(0,1fr)]"
        >
          <Tab value="client">Доходы с клиентской сети</Tab>
          <Tab value="partner">Доходы с партнерской сети</Tab>
        </Tabs>

        <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
          {tab === "partner" && <LevelsTable />}
          <CategoryAndStats onOpen={setOpenedDoc} />
        </div>
      </main>
    </div>
  );
}
