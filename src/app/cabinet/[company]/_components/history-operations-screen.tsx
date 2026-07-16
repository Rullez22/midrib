"use client";

import { useState } from "react";
import {
  Tabs,
  Tab,
  StatCounter,
  TableHeader,
  DocumentRow,
  Item,
  Datepicker,
  Button,
  Combobox,
  type TableColumn,
  type SortDir,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import {
  BackHeader,
  DefTable,
  DocThumb,
  BlockchainCard,
  type DefRow,
  type TxRow,
} from "../../document/_components/document-shared";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * HistoryOperationsScreen — раздел «История операций» кабинета ВУЗы (обработанные
 * документы выдачи дипломов/дополнений). Figma: 6970-551336 (Обработано вами) /
 * 6970-551560 (Обработано вашими сотрудниками).
 *
 * Reuse — ничего не верстаем заново, как в валидаторском «Обработанные»:
 *   • Tabs/Tab — верхние вкладки и сегмент «Лицензии/Сотрудники»;
 *   • StatCounter — общий счётчик; TableHeader + DocumentRow — таблица обработанных;
 *   • Datepicker ×2 + Button — выбор периода; Combobox — фильтр по сотрудникам.
 */

type Tab1 = "own" | "staff";

const TX = "0x031711ab4d2769a177eb95d8a79d3553e26d8a5833c243506f44cbe15b06243e";
const ROWS = Array.from({ length: 5 }, () => ({
  number: "№ 9873...5530",
  tx: TX,
  date: "12.01.2020 - 15:00",
}));

const COLUMNS: TableColumn[] = [
  { key: "number", label: "№ документа" },
  { key: "tx", label: "Транзакции" },
  { key: "date", label: "Дата обработки", align: "right", sortable: true },
];

/** Сотрудники + число выданных лицензий (сегмент «Сотрудники», Figma 6970:551681). */
const STAFF_ROWS = [
  { name: "Панин Н.Н.", count: 3 },
  { name: "Вовкин К.Н.", count: 2 },
  { name: "Печкин П.П", count: 1 },
  { name: "Птушкин А.С.", count: 8 },
  { name: "Птушкин А.С.", count: 10 },
];

const STAFF_COLUMNS: TableColumn[] = [
  { key: "name", label: "Ф.И.О." },
  { key: "licenses", label: "Выданных лицензий", align: "right", sortable: true },
];

const staffFilterOptions = (label: string) => [
  { value: "all", label },
  { value: "ilya", label: "Илья Антонов" },
  { value: "rozalina", label: "Розалина Курт" },
];

/** Опции группировки сегмента «Сотрудники»: «Все сотрудники» + сами сотрудники. */
const EMP_OPTIONS = [
  { value: "all", label: "Все сотрудники" },
  ...Array.from(new Set(STAFF_ROWS.map((r) => r.name))).map((name) => ({ value: name, label: name })),
];

/** Таблица обработанных документов (вкладка «вами» и сегмент «Лицензии»).
 *  Клик по транзакции/строке открывает документ (`onOpenDoc`). */
function ProcessedTable({
  sortKey,
  sortDir,
  onSort,
  onOpenDoc,
}: {
  sortKey: string;
  sortDir: SortDir;
  onSort: (key: string) => void;
  onOpenDoc?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <TableHeader columns={COLUMNS} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
      {ROWS.map((r, i) => (
        <div
          key={i}
          role="button"
          tabIndex={0}
          className="cursor-pointer outline-none"
          onClick={onOpenDoc}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onOpenDoc?.();
          }}
        >
          <DocumentRow
            status="blue"
            number={r.number}
            name=""
            transaction={r.tx}
            date={r.date}
            className="py-5 transition-colors hover:bg-[color:var(--color-grey-10)]"
            onTransactionClick={onOpenDoc}
          />
        </div>
      ))}
    </div>
  );
}

/** Документ из истории (Figma 6970:550963): сверху ПП, с которого создавался
 *  документ, снизу поля + транзакции в блокчейне. Реюз document-shared (DefTable,
 *  DocThumb, BlockchainCard) + DS Item/BackHeader. */
function HistoryDocDetail({
  cabinet,
  current,
  onBack,
}: {
  cabinet: CabinetConfig;
  current: string;
  onBack: () => void;
}) {
  const fields: DefRow[] = [
    { label: "Дата рождения", value: "21.02.1988" },
    { label: "Имя", value: "Штольц" },
    { label: "Фамилия", value: "Максим" },
    { label: "Отчество", value: "Констанстинов" },
    { label: "Серия", value: "PP" },
    { label: "Номер", value: "9715286548" },
    { label: "Дата выдачи", value: "21.09.2019" },
    { label: "Квалификация", value: 'Юрист по специальности "Международные отношения"' },
    { label: "Прикрепленные документы", value: <DocThumb /> },
  ];
  const tx: TxRow[] = [
    { action: "Подпись ВУЗа", party: 'ООО "Слон"', date: "11.01.2020 - 15:00" },
    { action: "Отправка документа", party: 'ООО "Сапфир"', date: "11.01.2020 - 11:00" },
  ];
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
          <BackHeader onBack={onBack} />

          {/* ПП, с которого создавался документ */}
          <Item size="l" trailing={<span className="ds-p3 text-foreground-subtle">01.06.2020</span>}>
            <span className="flex w-full items-center justify-between gap-4">
              <span className="ds-p3 text-foreground">Форма регистрации для граждан Болгарии</span>
              <span className="ds-p3 text-[var(--color-red-300)]">Лиц №2345431(+1240/99%) ???</span>
            </span>
          </Item>

          {/* Поля документа */}
          <DefTable rows={fields} />

          {/* Транзакции в блокчейне */}
          <BlockchainCard rows={tx} />
        </div>
      </main>
    </div>
  );
}

/** Таблица «Ф.И.О. → число выданных лицензий» (сегмент «Сотрудники»).
 *  `filter` — выбранный в дропдауне сотрудник ("all" — все). */
function StaffTable({
  filter,
  sortKey,
  sortDir,
  onSort,
}: {
  filter: string;
  sortKey: string;
  sortDir: SortDir;
  onSort: (key: string) => void;
}) {
  const rows = filter === "all" ? STAFF_ROWS : STAFF_ROWS.filter((r) => r.name === filter);
  return (
    <div className="flex flex-col gap-2">
      <TableHeader columns={STAFF_COLUMNS} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
      {rows.map((r, i) => (
        <Item key={i} size="l" trailing={<span className="ds-p3 text-foreground">{r.count}</span>}>
          {r.name}
        </Item>
      ))}
    </div>
  );
}

/** Выбор периода: «[label] с [дата] по [дата] [Показать]» — два DS Datepicker
 *  (от/до) + кнопка. `align` — центр (вкладка «вами») или вправо (сегменты). */
function PeriodPicker({ label, align = "center" }: { label?: string; align?: "center" | "end" }) {
  const [from, setFrom] = useState<Date | null>(new Date(2017, 8, 9));
  const [to, setTo] = useState<Date | null>(new Date(2017, 3, 29));
  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-3",
        align === "end" ? "justify-end" : "justify-center",
      )}
    >
      {label && <span className="ds-p2-medium text-foreground">{label}</span>}
      <span className="ds-p2 text-foreground-subtle">с</span>
      <Datepicker size="m" value={from} onChange={setFrom} className="w-[150px] [&_button]:[box-shadow:none]" />
      <span className="ds-p2 text-foreground-subtle">по</span>
      <Datepicker size="m" value={to} onChange={setTo} className="w-[150px] [&_button]:[box-shadow:none]" />
      <Button size="m">Показать</Button>
    </div>
  );
}

export function HistoryOperationsScreen({ cabinet, current }: { cabinet: CabinetConfig; current: string }) {
  const [tab, setTab] = useState<Tab1>("own");
  const [segment, setSegment] = useState("licenses");
  const [staff, setStaff] = useState("all");
  const [empFilter, setEmpFilter] = useState("all");
  const [openedDoc, setOpenedDoc] = useState(false);
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const onSort = (key: string) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (openedDoc) {
    return <HistoryDocDetail cabinet={cabinet} current={current} onBack={() => setOpenedDoc(false)} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        {/* Верхние вкладки во всю ширину */}
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as Tab1)}
          variant="solid-light"
          size="l"
          equal
          aria-label="Обработанные документы"
          className="w-full rounded-none border-x-0 border-t-0 [grid-auto-columns:minmax(0,1fr)]"
        >
          <Tab value="own">Обработано вами</Tab>
          <Tab value="staff">Обработано вашими сотрудниками</Tab>
        </Tabs>

        {tab === "own" ? (
          <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
            <StatCounter
              size="lg"
              label="Общее количество обработанных вами документов"
              value={5}
            />
            <PeriodPicker label="Выбрать период" />
            <ProcessedTable sortKey={sortKey} sortDir={sortDir} onSort={onSort} onOpenDoc={() => setOpenedDoc(true)} />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
            {/* Сегмент «Лицензии / Сотрудники» */}
            <Tabs
              value={segment}
              onValueChange={setSegment}
              variant="solid"
              size="m"
              equal
              aria-label="Тип"
              className="mx-auto w-[440px] max-w-full"
            >
              <Tab value="licenses">Лицензии</Tab>
              <Tab value="employees">Сотрудники</Tab>
            </Tabs>

            {/* Фильтр: группировка по сотруднику + период (период — справа) */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {segment === "employees" ? (
                <Combobox
                  options={EMP_OPTIONS}
                  value={empFilter}
                  onValueChange={setEmpFilter}
                  size="m"
                  className="w-full lg:max-w-[360px]"
                />
              ) : (
                <Combobox
                  options={staffFilterOptions("Всеми сотрудниками")}
                  value={staff}
                  onValueChange={setStaff}
                  size="m"
                  className="w-full lg:max-w-[360px]"
                />
              )}
              <div className="flex-1">
                <PeriodPicker align="end" />
              </div>
            </div>

            {segment === "employees" ? (
              <StaffTable filter={empFilter} sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            ) : (
              <ProcessedTable sortKey={sortKey} sortDir={sortDir} onSort={onSort} onOpenDoc={() => setOpenedDoc(true)} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
