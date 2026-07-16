"use client";

/**
 * Демки «Лицевой счёт» для витрины /ds.
 * Источник: Figma «UI фичи» / лицевой счёт (1792:293949 взаиморасчёты,
 * 1792:293978 документооборот, 1792:294017 артефакты).
 * Целиком из готовых DS: AccountCard · Tabs · TransactionsTable · TableHeader ·
 * Badge · Combobox · Button. Новых компонентов нет.
 */
import { useState, type CSSProperties } from "react";
import {
  AccountCard,
  TransactionsTable,
  TableHeader,
  Badge,
  Combobox,
  Button,
  Tabs,
  Tab,
  type TableColumn,
  type Transaction,
} from "@/components/ds";

const TX: Transaction[] = [
  { code: "214", color: "cyan", hash: "5c243af… 07db8", time: "29 секунд назад", from: "ПК «Иматра»", to: "ИП Салютов Р. К.", document: "Счёт на оплату", documentSub: "Закупка игрового оборудования", amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "a94e71c… 2d80f", time: "14 минут назад", from: "ПК «Иматра»", to: "ПК «Гвозди и доски»", document: "Счёт на оплату", documentSub: "Поставка пиломатериалов", amount: "0.084500", commission: "0.0011" },
  { code: "216", color: "purple", hash: "0d5cb83… 4ef17", time: "3 часа назад", from: "ПК «Слонёнок»", to: "ПК «Иматра»", document: "Взносы и целевые поступления", documentSub: "Членский взнос за II квартал", amount: "0.512300", commission: "0.0034" },
  { code: "215", color: "green", hash: "e28f0a6… b3c94", time: "вчера, 18:42", from: "ПК «Иматра»", to: "ПК «Слонёнок»", document: "Поступления с маршрутных счетов", documentSub: "Совместная закупка материалов", amount: "1.104800", commission: "0.0058" },
];

const DOC_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип документа", flex: 2, sortable: true },
  { key: "status", label: "Статус", flex: 1.2, sortable: true },
  { key: "verify", label: "Тип верификации", flex: 1.2, sortable: true },
  { key: "date", label: "Дата", flex: 1, align: "right", sortable: true },
];

const DOCS = [
  { type: "Свидетельство", name: "Свидетельство о государственной регистрации программы ЭВМ", status: "Отвалидирован", badge: "Локальный", date: "19.05.2025" },
  { type: "Сертификат", name: "Сертификат соответствия", status: "Отвалидирован", badge: "Локальный", date: "23.11.2024" },
  { type: "Договор", name: "Договор подряда на монтаж площадки", status: "", badge: "", date: "11.04.2025" },
];

const ART_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип артефакта", flex: 1, sortable: true },
  { key: "date", label: "Дата", flex: 1, align: "right", sortable: true },
];

const ARTIFACTS = [
  { type: "Документ", name: "Документ в свободной форме", date: "02.09.2024", action: "share" as const },
  { type: "Документ", name: "Отчёт о целевом расходовании средств", date: "28.01.2025", action: "lock" as const },
  { type: "Патент", name: "Патент на полезную модель игрового комплекса", date: "17.03.2023", action: "person" as const },
];

function col(c: TableColumn): CSSProperties {
  return c.width ? { flex: `0 0 ${c.width}`, width: c.width } : { flex: c.flex ?? 1 };
}

function UpIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function DownIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="M17 7 7 17M15 17H7V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function ShareIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5"><path d="M14 7l5 5-5 5M19 12H9a5 5 0 0 0-5 5v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" /></svg>;
}
function PersonIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5"><circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" /><path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
const ART_ICON = { share: <ShareIcon />, lock: <LockIcon />, person: <PersonIcon /> };

/** Тулбар над таблицей: селект шаблонов слева + кнопка добавления справа. */
function TableToolbar({ placeholder, addLabel }: { placeholder: string; addLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="w-[240px]">
        <Combobox size="m" options={[{ value: "all", label: placeholder }]} defaultValue="all" placeholder={placeholder} />
      </div>
      <Button variant="secondary" size="m" iconLeft={<PlusIcon />}>{addLabel}</Button>
    </div>
  );
}

export function LkDemos() {
  const [tab, setTab] = useState("settle");
  const [artTab, setArtTab] = useState("all");

  return (
    <div className="flex max-w-[1000px] flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <span className="ds-h4 text-foreground">Лицевой счет</span>
        <Button variant="ghost" size="s">Отчетность</Button>
      </div>

      <AccountCard
        amount="1.231 ETH"
        secondaryAmount="15.88 USD"
        leftAction={<Button size="m" iconLeft={<UpIcon />}>Реквизиты</Button>}
        rightAction={<Button size="m" iconLeft={<DownIcon />}>Перевод</Button>}
      />

      <Tabs variant="basic" size="m" value={tab} onValueChange={setTab} aria-label="Лицевой счёт">
        <Tab value="settle">Взаиморасчеты</Tab>
        <Tab value="docs">Документооборот</Tab>
        <Tab value="artifacts">Артефакты</Tab>
      </Tabs>

      {tab === "settle" && <TransactionsTable transactions={TX} showMore={false} />}

      {tab === "docs" && (
        <div className="flex flex-col gap-4">
          <TableToolbar placeholder="Все шаблоны" addLabel="Добавить документ" />
          <TableHeader columns={DOC_COLUMNS} size="m" tone="muted" />
          <div className="flex flex-col gap-2">
            {DOCS.map((d, i) => (
              <div key={i} className="flex items-center rounded-[8px] border border-border bg-white px-4 py-3">
                <div className="flex flex-col gap-0.5 pr-3" style={col(DOC_COLUMNS[0])}>
                  <span className="ds-caption text-foreground-subtle">{d.type}</span>
                  <span className="ds-p3 text-foreground">{d.name}</span>
                </div>
                <div className="ds-p3 text-foreground" style={col(DOC_COLUMNS[1])}>{d.status}</div>
                <div style={col(DOC_COLUMNS[2])}>
                  {d.badge && <Badge variant="soft" color="orange">{d.badge}</Badge>}
                </div>
                <div className="ds-p3 text-right text-foreground" style={col(DOC_COLUMNS[3])}>{d.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "artifacts" && (
        <div className="flex flex-col gap-4">
          <Tabs variant="basic" size="m" value={artTab} onValueChange={setArtTab} aria-label="Артефакты">
            <Tab value="all">Все</Tab>
            <Tab value="fixed">Фиксированные</Tab>
            <Tab value="available">Доступные к передаче</Tab>
            <Tab value="transferred">Переданные</Tab>
          </Tabs>
          <TableToolbar placeholder="Все шаблоны артефактов" addLabel="Добавить артефакт" />
          <TableHeader columns={ART_COLUMNS} size="m" tone="muted" />
          <div className="flex flex-col gap-2">
            {ARTIFACTS.map((a, i) => (
              <div key={i} className="flex items-center rounded-[8px] border border-border bg-white px-4 py-3">
                <div className="flex flex-col gap-0.5 pr-3" style={col(ART_COLUMNS[0])}>
                  <span className="ds-caption text-foreground-subtle">{a.type}</span>
                  <span className="ds-p3 text-foreground">{a.name}</span>
                </div>
                <div className="ds-p3 text-right text-foreground" style={col(ART_COLUMNS[1])}>{a.date}</div>
                <span className="ml-4 flex size-6 shrink-0 items-center justify-center text-foreground-subtle">
                  {ART_ICON[a.action]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
