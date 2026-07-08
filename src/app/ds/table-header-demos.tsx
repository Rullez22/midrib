"use client";

/**
 * Демки TableHeader (шапка таблицы / навигация) для витрины /ds.
 * Источник: Figma «UI фичи» / Navigation (155:0, 6203:163486).
 */
import { useState } from "react";
import { TableHeader, type TableColumn, type SortDir } from "@/components/ds";

export function TableHeaderDemos() {
  const [sort, setSort] = useState<{ key: string; dir: SortDir }>({ key: "date", dir: "desc" });
  const [checked, setChecked] = useState(false);

  const onSort = (key: string) =>
    setSort((p) => (p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  // navigation транзакции — прозрачная шапка, сортируемые колонки
  const txCols: TableColumn[] = [
    { key: "code", label: "Код", sortable: true },
    { key: "tx", label: "Транзакция", sortable: true },
    { key: "from", label: "От кого / Кому" },
    { key: "doc", label: "Документооборот" },
    { key: "sum", label: "Сумма (ETH)", align: "right", sortable: true },
    { key: "fee", label: "Комиссия (PAEV)", align: "right", sortable: true },
  ];

  // navigation пайщикки — muted + чекбокс
  const peopleCols: TableColumn[] = [
    { key: "name", label: "Имя" },
    { key: "addr", label: "Адрес", align: "center" },
    { key: "date", label: "Дата заявки", align: "right", sortable: true },
  ];

  // navigation документы
  const docCols: TableColumn[] = [
    { key: "type", label: "Тип документа", sortable: true },
    { key: "status", label: "Статус", align: "center", sortable: true },
    { key: "date", label: "Дата", align: "right", sortable: true },
  ];

  const sortProps = { sortKey: sort.key, sortDir: sort.dir, onSort };

  return (
    <div className="flex max-w-[1120px] flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="ds-caption-medium text-foreground-subtle">default — транзакции</span>
        <TableHeader columns={txCols} {...sortProps} />
      </div>

      <div className="flex flex-col gap-1">
        <span className="ds-caption-medium text-foreground-subtle">muted + чекбокс — пайщики</span>
        <TableHeader
          tone="muted"
          selectable
          checked={checked}
          onCheckedChange={setChecked}
          columns={peopleCols}
          {...sortProps}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="ds-caption-medium text-foreground-subtle">muted — документы</span>
        <TableHeader tone="muted" columns={docCols} {...sortProps} />
      </div>

      <div className="flex flex-col gap-1">
        <span className="ds-caption-medium text-foreground-subtle">size m (46) — основания</span>
        <TableHeader
          size="m"
          tone="muted"
          columns={[
            { key: "src", label: "Источник" },
            { key: "dst", label: "Назначение" },
            { key: "code", label: "Код", align: "right", sortable: true },
            { key: "sum", label: "Сумма (ETH)", align: "right", sortable: true },
          ]}
          {...sortProps}
        />
      </div>
    </div>
  );
}
