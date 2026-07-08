"use client";

/**
 * Демки «Обработанные заявки» (верификации) для витрины /ds.
 * Источник: Figma «UI фичи» / Кол-во (2124:232986), обработанные заявки (2124:233330).
 * Reuse: Tabs/Tab (XL-56 solid-light) · ReportPeriodBar (без истории, по центру) ·
 * StatCounter (новый: крупный нейтральный + цветные мини) · TableHeader (s/muted) ·
 * DocumentRow (новый).
 */
import { useState } from "react";
import {
  Tabs,
  Tab,
  ReportPeriodBar,
  StatCounter,
  TableHeader,
  DocumentRow,
  type DocumentStatus,
  type TableColumn,
  type SortDir,
} from "@/components/ds";

const COLUMNS: TableColumn[] = [
  { key: "name", label: "Наименование документа", sortable: true },
  { key: "tx", label: "Транзакция", align: "center", sortable: true },
  { key: "date", label: "Дата обработки", align: "right", sortable: true },
];

type Doc = {
  status: DocumentStatus;
  number: string;
  name: string;
  tx: string;
  date: string;
};

const DOCS: Doc[] = [
  { status: "yellow", number: "№123", name: "Полный устав кооператива", tx: "eg33... k4k4", date: "12.01.2020 - 15:00" },
  { status: "yellow", number: "№124", name: "Свидетельство о рождении", tx: "eg33... k4k4", date: "12.01.2020 - 15:00" },
  { status: "green", number: "№123", name: "Водительское удостоверение", tx: "eg33... k4k4", date: "12.01.2020 - 15:00" },
  { status: "blue", number: "№123", name: "Счет на оплату HBO", tx: "eg33... k4k4", date: "12.01.2020 - 15:00" },
  { status: "blue", number: "№123", name: "Лицензия", tx: "eg33... k4k4", date: "12.01.2020 - 15:00" },
];

export function ProcessedVerificationsDemos() {
  const [tab, setTab] = useState("own");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const onSort = (key: string) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* StatCounter — крупный нейтральный + цветные мини (атомы карточки) */}
      <div className="flex flex-col gap-4">
        <StatCounter
          size="lg"
          label="Общее количество выданных вами верификаций (за все время)"
          value={6}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCounter tone="yellow" label="Документы по желтому типу" value={2} />
          <StatCounter tone="green" label="Документы по зеленому типу" value={1} />
          <StatCounter tone="blue" label="Документы Ruswan" value={2} />
        </div>
      </div>

      {/* Полный экран «Обработанные заявки» */}
      <div className="flex flex-col gap-6 rounded-[8px] border border-border bg-white p-6">
        <Tabs value={tab} onValueChange={setTab} variant="solid-light" size="xl">
          <Tab value="own">Ваши верификации</Tab>
          <Tab value="staff">Верификации ваших сотрудников</Tab>
        </Tabs>

        <ReportPeriodBar period="15 декабря 2019 - 22 декабря 2019" showHistory={false} />

        <StatCounter
          size="lg"
          label="Общее количество выданных вами верификаций (за все время)"
          value={6}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCounter tone="yellow" label="Документы по желтому типу" value={2} />
          <StatCounter tone="green" label="Документы по зеленому типу" value={1} />
          <StatCounter tone="blue" label="Документы Ruswan" value={2} />
        </div>

        <div className="flex flex-col gap-2">
          <TableHeader
            columns={COLUMNS}
            size="s"
            tone="muted"
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
          />
          {DOCS.map((d, i) => (
            <DocumentRow
              key={i}
              status={d.status}
              number={d.number}
              name={d.name}
              transaction={d.tx}
              date={d.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
