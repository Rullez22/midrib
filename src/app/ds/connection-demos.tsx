"use client";

/**
 * Демки «Подключение пайщиков» (массовое/персональное · разовое/стабильное) для /ds.
 * Источник: Figma «UI фичи» (972:90307 таблица участников, 975:109181/979:92303 вкладки,
 * 1468:183455 распределение, 1472:204508 счёт пайщика, 1478:197920 сумма платежа).
 * 100% reuse DS: Tabs, TableHeader, Item, Checkbox, Link, Pagination, ProgressRing, Input,
 * IncrimentField. Новых компонентов нет.
 */
import { useState } from "react";
import {
  Tabs, Tab, TableHeader, Item, Checkbox, Link, Pagination, ProgressRing, Input,
  IncrimentField, Text, type TableColumn,
} from "@/components/ds";

const dark = "var(--color-dark-900)";
const blue = "var(--color-blue-midhub-500)";

const PEOPLE_COLS: TableColumn[] = [
  { key: "name", label: "Имя", sortable: true },
  { key: "addr", label: "Адрес", align: "center", sortable: true },
  { key: "country", label: "Страна", align: "right", sortable: true },
];

function Star() {
  return <svg viewBox="0 0 24 24" className="size-5 text-foreground-subtle" fill="none"><path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.3L12 17.8 7.2 18.8l.9-5.3L4.2 9.7l5.4-.8L12 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}

function PersonRow({ name }: { name: string }) {
  return (
    <Item
      leading={<><Checkbox size="xs" aria-label="Выбрать" /><Star /></>}
      trailing={<span style={{ color: blue }}>ENG</span>}
    >
      <div className="grid grid-cols-2 items-center">
        <span style={{ color: dark }}>{name}</span>
        <span className="text-center" style={{ color: blue }}>5c243af... 07db8</span>
      </div>
    </Item>
  );
}

export function ConnectionDemos() {
  const [page, setPage] = useState(1);
  const sort = { sortKey: "name", sortDir: "asc" as const, onSort: () => {} };
  return (
    <div className="flex max-w-[1120px] flex-col gap-8">
      {/* Выбор участников: вкладки + таблица + пагинация */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Выбор участников (Tabs + TableHeader + Item + Pagination)</span>
        <Tabs variant="solid-light" size="s" defaultValue="perm">
          <Tab value="perm">Постоянные участники</Tab>
          <Tab value="union">Объединение пайщиков</Tab>
        </Tabs>
        <div className="overflow-hidden rounded-[4px] border border-border">
          <div className="border-b border-border px-2 pt-2"><TableHeader selectable columns={PEOPLE_COLS} {...sort} /></div>
          {["Илья Антонов", "Мария Егорова", "Сергей Лебедев", "Валерий Варламов", "Оксана Кузнецова"].map((n) => <PersonRow key={n} name={n} />)}
          <div className="flex justify-center border-t border-border p-3">
            <Pagination size="s" view="full" page={page} total={200} onChange={setPage} />
          </div>
        </div>
      </div>

      {/* Конфигурация платежа: распределение + счёт пайщика */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Стабильное подключение (распределение + счёт пайщика)</span>
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex w-[560px] max-w-full flex-col gap-3">
            <IncrimentField label="Целевой счет" defaultValue={50} suffix="%" />
            <IncrimentField label="Счет инвестиционных токенов" defaultValue={50} suffix="%" />
          </div>

          <div className="flex w-[420px] max-w-full flex-col items-center gap-4 rounded-[4px] border border-border p-6">
            <div className="text-center">
              <Text variant="p3-medium">Счет пайщика</Text>
              <Text variant="caption" tone="subtle">Процент переведенный со счетов</Text>
            </div>
            <ProgressRing value={0} />
            <div className="flex w-full items-start justify-between gap-3">
              <Text variant="caption" tone="muted">Процент будет поступать до выплаты фиксированной суммы раз в n-дней</Text>
              <Checkbox size="xs" aria-label="Включить" />
            </div>
            <Input size="l" placeholder="Количество дней (опционально)" />
            <Input size="l" placeholder="Укажите сумму" />
          </div>
        </div>
      </div>

      {/* Итог по платежу */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Сумма платежа (итог)</span>
        <div className="flex flex-col gap-4 rounded-[4px] border border-border p-6">
          <Text variant="p2-medium">Сумма платежа</Text>
          <div className="flex flex-col gap-1"><Text variant="caption" tone="subtle">Количество получателей</Text><Text variant="p3">0</Text></div>
          <div className="flex flex-col gap-1"><Text variant="caption" tone="subtle">Общая сумма платежа</Text><Text variant="p3">0</Text></div>
        </div>
      </div>
    </div>
  );
}
