"use client";

import { useState } from "react";
import {
  Tabs,
  Tab,
  StatCounter,
  ReportPeriodBar,
  TableHeader,
  DocumentRow,
  Calendar,
  QuestionCard,
  EmptyState,
  type DocumentStatus,
  type TableColumn,
  type SortDir,
  type CalendarRange,
} from "@/components/ds";
import {
  Shell,
  DefTable,
  DocThumb,
  BlockchainCard,
  VerificationBadge,
  VERIFY_ORANGE,
  type DefRow,
  type TxRow,
} from "../../document/_components/document-shared";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * ValidatorProcessedScreen — раздел «Обработанные» кабинета валидатора (№2).
 * Figma: список 6722-376827 · деталь документа 6722-377772 · календарь 6722-376952.
 *
 * Reuse — ничего не верстаем заново:
 *   • список: DS StatCounter (сводка + 3 цветные) · ReportPeriodBar (иконка →
 *     календарь) · TableHeader · DocumentRow (строки обработанных верификаций);
 *   • календарь периода: DS Calendar mode="range";
 *   • деталь документа: QuestionCard + DefTable + BlockchainCard (document-shared),
 *     в каркасе Shell (DocHeader). Те же блоки, что в детали заявки.
 */

type ProcTab = "own" | "staff";

type ProcDoc = {
  status: DocumentStatus;
  number: string;
  name: string;
  tx: string;
  date: string;
};

const DOCS: ProcDoc[] = [
  { status: "yellow", number: "№ 123", name: "Паспорт РФ", tx: "0x0317f1ab4… 11ab4d", date: "03.06.2025 - 15:00" },
  { status: "yellow", number: "№ 124", name: "Свидетельство о рождении", tx: "0x0317f1ab4… 11ab4d", date: "19.05.2025 - 12:40" },
  { status: "green", number: "№ 1222", name: "Водительское удостоверение", tx: "0x0317f1ab4… 11ab4d", date: "22.04.2025 - 09:15" },
  { status: "blue", number: "№ 1234", name: "Счет на оплату НВО", tx: "0x0317f1ab4… 11ab4d", date: "08.03.2025 - 17:05" },
  { status: "blue", number: "№ 727", name: "Лицензия", tx: "0x0317f1ab4… 11ab4d", date: "14.02.2025 - 11:30" },
];

const COLUMNS: TableColumn[] = [
  { key: "name", label: "Наименование документа", sortable: true },
  { key: "tx", label: "Номер транзакции", align: "center" },
  { key: "date", label: "Дата обработки", align: "right", sortable: true },
];

// Транзакции в блокчейне у обработанного документа (деталь, 6722-377772).
// Порядок — от свежих к старым: отправка (11:10) → подпись валидатора (14:35) →
// подпись создателя (16:20).
const DETAIL_TX: TxRow[] = [
  { action: "Подпись создателя документа", party: 'ООО "Сапфир"', date: "02.06.2025 - 16:20" },
  { action: "Подпись валидатора", party: 'ООО "Слон"', date: "02.06.2025 - 14:35" },
  { action: "Отправка валидатору", party: 'ООО "Сапфир"', date: "02.06.2025 - 11:10" },
];

const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const fmt = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

// ── Деталь обработанного документа (read-only) ───────────────────────────────
// Экспортируется: тот же вид документа переиспользуется в «Реферальных».
export function ProcessedDocDetail({ name, onClose }: { name: string; onClose: () => void }) {
  const fields: DefRow[] = [
    { label: "Тип верификации", value: <VerificationBadge label="Международный" color={VERIFY_ORANGE} /> },
    { label: "Документ", value: "pas1043" },
    { label: "Фамилия", value: "Никитин" },
    { label: "Имя", value: "Пётр" },
    { label: "Отчество", value: "Романович" },
    { label: "Дата рождения", value: "07.09.1986" },
    { label: "Пол", value: "Мужской" },
    { label: "Номер документа", value: "4012 673518" },
    { label: "Орган выдавший документ", value: "78 ОМ Невского района Санкт-Петербурга" },
    { label: "Код подразделения", value: "0120033" },
    { label: "Дата выдачи", value: "19.03.2007" },
    { label: "Прикрепленные документы", value: <DocThumb /> },
  ];
  return (
    <Shell onExit={onClose}>
      {/* Красный крестик — закрыть готовый документ (Figma 6722-377772). */}
      <div className="flex justify-end">
        <button
          type="button"
          aria-label="Закрыть документ"
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-[4px] border border-[var(--color-red-300)] text-[var(--color-red-300)] hover:bg-[var(--color-red-100)]"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
            <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <QuestionCard title={name} defaultOpen>
        <div className="-mx-[23px] -mb-5 -mt-4">
          <DefTable rows={fields} flush />
        </div>
      </QuestionCard>
      <BlockchainCard rows={DETAIL_TX} />
    </Shell>
  );
}

export function ValidatorProcessedScreen({ cabinet, current }: { cabinet: CabinetConfig; current: string }) {
  const [tab, setTab] = useState<ProcTab>("own");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [calOpen, setCalOpen] = useState(false);
  const [range, setRange] = useState<CalendarRange>({
    start: new Date(2025, 0, 1),
    end: new Date(2025, 5, 30),
  });
  const [openedDoc, setOpenedDoc] = useState<ProcDoc | null>(null);

  const onSort = (key: string) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const period = range.start
    ? `${fmt(range.start)} - ${range.end ? fmt(range.end) : "…"}`
    : "—";

  if (openedDoc) {
    return <ProcessedDocDetail name={openedDoc.name} onClose={() => setOpenedDoc(null)} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        {/* Табы во всю ширину (как в /zayavki): solid-light, XL, equal. */}
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as ProcTab)}
          variant="solid-light"
          size="l"
          equal
          aria-label="Верификации"
          className="w-full rounded-none border-x-0 border-t-0 [grid-auto-columns:minmax(0,1fr)]"
        >
          <Tab value="own">Ваши верификации</Tab>
          <Tab value="staff">Верификации ваших сотрудников</Tab>
        </Tabs>

        {tab === "own" ? (
          <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
            <StatCounter
              size="lg"
              label="Общее количество выданных вами верификаций (за все время)"
              value={6}
            />

            {/* Период отчёта + календарь (иконка → DS Calendar range) */}
            <div className="relative flex flex-col items-center">
              <ReportPeriodBar period={period} showHistory={false} onPickPeriod={() => setCalOpen((v) => !v)} />
              {calOpen && (
                <div className="absolute top-full z-20 mt-2 rounded-[8px] border border-border bg-[#fff] p-4 shadow-[0_8px_24px_rgba(90,100,111,0.18)]">
                  <Calendar
                    mode="range"
                    range={range}
                    onSelectRange={(r) => {
                      setRange(r);
                      if (r.start && r.end) setCalOpen(false);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <StatCounter tone="yellow" label="Документы по желтому типу" value={2} />
              <StatCounter tone="green" label="Документы по зеленому типу" value={1} />
              <StatCounter tone="blue" label="Документы Ruswan" value={2} />
            </div>

            <div className="flex flex-col gap-2">
              <TableHeader columns={COLUMNS} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              {DOCS.map((d, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer text-left outline-none"
                  onClick={() => setOpenedDoc(d)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpenedDoc(d); }}
                >
                  <DocumentRow status={d.status} number={d.number} name={d.name} transaction={d.tx} date={d.date} className="ds-row transition-colors" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-8 px-5 py-10 md:px-[50px]">
            <EmptyState title="Здесь пока пусто" className="py-16" />
          </div>
        )}
      </main>
    </div>
  );
}
