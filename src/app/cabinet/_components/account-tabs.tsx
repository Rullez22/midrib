"use client";

import { useState, type CSSProperties } from "react";
import {
  Tabs,
  Tab,
  Button,
  Badge,
  Dropdown,
  TableHeader,
  type TableColumn,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { useTableSort } from "@/lib/use-table-sort";

/**
 * account-tabs — общие табы «Документооборот» и «Артефакты» экранов-счетов
 * (Figma 1857:649786/649794 — ЛК, 1857:649854/649862 — партнёр). Вычленены из
 * partner-account.tsx, переиспользуются экраном «Лицевой счёт» ЛК и «Счётом»
 * партнёра. Reuse DS: Tabs · TableHeader · Badge · Dropdown · Button.
 */

export type ArtifactState = "share" | "lock" | "person";

export interface AccountDocRow {
  type: string;
  name: string;
  status?: string;
  badge?: string;
  date: string;
}
export interface AccountArtifactRow {
  type: string;
  name: string;
  date: string;
  state: ArtifactState;
}

const colStyle = (c: TableColumn): CSSProperties =>
  c.width ? { flex: `0 0 ${c.width}`, width: c.width } : { flex: c.flex ?? 1 };

function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

/** Иконка-состояние артефакта: share (доступен) · lock (фиксирован) · person (передан). */
export function StateIcon({ state }: { state: ArtifactState }) {
  if (state === "person")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5 text-primary">
        <circle cx="12" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5.5 19c0-3.3 3-5.2 6.5-5.2s6.5 1.9 6.5 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  if (state === "lock")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5 text-foreground-subtle">
        <rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5 text-foreground-subtle">
      <path d="M14 5l5 5-5 5M19 10H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DOC_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип документа", flex: 2.2, sortable: true },
  { key: "status", label: "Статус", flex: 1.2, align: "center", sortable: true },
  { key: "verify", label: "Тип верификации", flex: 1.2, align: "center", sortable: true },
  { key: "date", label: "Дата", flex: 1, align: "right", sortable: true },
];
const ART_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип артефакта", flex: 1, sortable: true },
  { key: "date", label: "Дата", width: "120px", align: "right", sortable: true },
  { key: "action", label: "", width: "48px" },
];

const ART_FILTERS = [
  { value: "all", label: "Все" },
  { value: "fixed", label: "Фиксированные" },
  { value: "transfer", label: "Доступные к передаче" },
  { value: "passed", label: "Переданные" },
];

/**
 * Выбор шаблона — обычный дропдаун (не комбобокс): чистая рамка без inset-тени
 * поля ввода. Триггер-поле + меню DS Dropdown. Figma 1857:649854 / 1857:649862.
 */
export function TemplateDropdown({ options }: { options: { value: string; label: string }[] }) {
  const [val, setVal] = useState(options[0]?.value ?? "");
  const current = options.find((o) => o.value === val) ?? options[0];
  return (
    <Dropdown
      value={val}
      items={options}
      onSelect={setVal}
      aria-label={current?.label}
      className="w-full"
      trigger={({ open }) => (
        <div
          className={cn(
            "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-[4px] border bg-white px-4 transition-colors",
            open ? "border-[var(--color-blue-midhub-500)]" : "border-border hover:border-[var(--color-grey-200)]",
          )}
        >
          <span className="ds-p3 truncate text-foreground">{current?.label}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-5 shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
            <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    />
  );
}

/** Таб «Документооборот»: выбор шаблона + «Добавить документ» + таблица документов. */
export function AccountDocFlow({
  docs,
  templateLabel = "Все шаблоны",
  addLabel = "Добавить документ",
}: {
  docs: AccountDocRow[];
  templateLabel?: string;
  addLabel?: string;
}) {
  // Колонка «Тип верификации» (key=verify) показывает бейдж — поле row.badge.
  const { sorted, sortKey, sortDir, onSort } = useTableSort(docs, {
    key: "date",
    dir: "desc",
    accessor: (d, k) => (k === "verify" ? d.badge : d[k as keyof AccountDocRow]),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-[280px]">
          <TemplateDropdown options={[{ value: "all", label: templateLabel }]} />
        </div>
        <Button size="m" iconLeft={<PlusIcon />}>{addLabel}</Button>
      </div>

      <div className="flex flex-col gap-2">
        <TableHeader columns={DOC_COLUMNS} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        {sorted.map((d, i) => (
          <div key={i} className="ds-row flex items-center gap-2 rounded-[4px] border border-border bg-surface px-6 py-3 transition-colors">
            <div className="flex flex-col gap-0.5" style={colStyle(DOC_COLUMNS[0])}>
              <span className="ds-caption text-foreground-subtle">{d.type}</span>
              <span className="ds-p3 text-foreground">{d.name}</span>
            </div>
            <div className="ds-p3 text-center text-foreground" style={colStyle(DOC_COLUMNS[1])}>{d.status}</div>
            <div className="flex justify-center" style={colStyle(DOC_COLUMNS[2])}>
              {d.badge && <Badge variant="solid" color="orange" className="w-[139px]">{d.badge}</Badge>}
            </div>
            <div className="ds-p3 text-right text-foreground" style={colStyle(DOC_COLUMNS[3])}>{d.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Таб «Артефакты»: фильтр-табы + выбор шаблона + «Добавить артефакт» + таблица. */
export function AccountArtifacts({
  artifacts,
  templateLabel = "Все шаблоны артефактов",
  addLabel = "Добавить артефакт",
}: {
  artifacts: AccountArtifactRow[];
  templateLabel?: string;
  addLabel?: string;
}) {
  const [filter, setFilter] = useState("all");
  const match = (s: ArtifactState) =>
    filter === "all" || (filter === "fixed" && s === "lock") || (filter === "transfer" && s === "share") || (filter === "passed" && s === "person");

  // Сортируем отфильтрованные строки (фильтр-табы состояния — выше сортировки).
  const visible = artifacts.filter((a) => match(a.state));
  const { sorted, sortKey, sortDir, onSort } = useTableSort(visible, { key: "date", dir: "desc" });

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={filter} onValueChange={setFilter} variant="basic" size="m" equal aria-label="Фильтр артефактов" className="w-full">
        {ART_FILTERS.map((f) => (
          <Tab key={f.value} value={f.value}>{f.label}</Tab>
        ))}
      </Tabs>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-[280px]">
          <TemplateDropdown options={[{ value: "all", label: templateLabel }]} />
        </div>
        <Button size="m" iconLeft={<PlusIcon />}>{addLabel}</Button>
      </div>

      <div className="flex flex-col gap-2">
        <TableHeader columns={ART_COLUMNS} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        {sorted.map((a, i) => (
          <div key={i} className="ds-row flex items-center rounded-[4px] border border-border bg-surface px-4 py-3 transition-colors">
            <div className="flex flex-col gap-0.5 pr-3" style={colStyle(ART_COLUMNS[0])}>
              <span className="ds-caption text-foreground-subtle">{a.type}</span>
              <span className="ds-p3 text-foreground">{a.name}</span>
            </div>
            <div className="ds-p3 text-right text-foreground" style={colStyle(ART_COLUMNS[1])}>{a.date}</div>
            <div className="flex justify-end" style={colStyle(ART_COLUMNS[2])}>
              <StateIcon state={a.state} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
