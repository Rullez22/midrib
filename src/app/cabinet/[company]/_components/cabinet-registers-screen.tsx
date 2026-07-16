"use client";

import { useState } from "react";
import { Tabs, Tab, SearchBar, TableHeader, Button, type SortDir } from "@/components/ds";
import { CompanySidebar } from "./company-sidebar";
import { PdRequestFlow, PdRequestDetail, type PdDetailVariant } from "./pd-request-flow";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * CabinetRegistersScreen — «Сервисы» кабинета №6 (Регулятор). Реестр запросов
 * персональных данных (ПД) пользователей в трёх состояниях-вкладках:
 * (перенесено из «Реестры» кабинета №4 Домены, которое теперь пустое).
 * «Отправленные запросы» / «ПД получены» / «ПД обработаны».
 * Источник Figma: 6827-544875 / 6820-554901 / 6820-554915.
 *
 * Reuse DS: Tabs/Tab (solid-light, как в CabinetActivityScreen) · SearchBar
 * (+ secondary-кнопка «Фильтры» в actions) · TableHeader (muted, колонки
 * Идентификатор / Адрес сервиса / Дата запроса) · Button (primary) · сайдбар
 * CompanySidebar. Новое — только строка таблицы (карточка ID / сервис / дата),
 * совпадающего DS-композита нет; строки выровнены по колонкам TableHeader.
 */

type RequestStatus = "sent" | "received" | "processed";

interface RegisterRow {
  id: string;
  service: string;
  date: string;
  /** В каком табе показывается запрос. */
  status: RequestStatus;
}

/** Мок-данные реестра (по строке на сервис; id уникален, чтобы при клике деталь
 *  показывала именно ту строку, на которую нажали; status → таб). */
const SEED_ROWS: RegisterRow[] = [
  { id: "3018c28628613bC77f7A6D88F29C817770594FC5", service: "twitter.com", date: "11.03.2020 - 11.04.2020", status: "sent" },
  { id: "7a21f90b44e2dc11A8B3C99D02E7740156FA3D8", service: "facebook.com", date: "11.03.2020 - 11.04.2020", status: "sent" },
  { id: "c4d8e012ab9347ff21B0A77C56D8810934EE2B1", service: "instagram.com", date: "11.03.2020 - 11.04.2020", status: "received" },
  { id: "9f0b3c7715a8e244D6C1F88B03A9920745CD6E2", service: "tik-tok.com", date: "11.03.2020 - 11.04.2020", status: "received" },
  { id: "2e6a18d99c47b033E5F2A66C71B4480921AC7F4", service: "youtube.com", date: "11.03.2020 - 11.04.2020", status: "processed" },
];

/** Дата-диапазон запроса (сегодня + 30 дней) в формате дд.мм.гггг. */
function todayRange() {
  const p = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) => `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
  const now = new Date();
  return `${fmt(now)} - ${fmt(new Date(now.getTime() + 30 * 86400000))}`;
}

let idSeq = 0;
/** Генерация псевдо-хэша id нового запроса. */
function genId() {
  idSeq += 1;
  return (idSeq.toString(16).padStart(6, "0") + "f90b44e2dc11A8B3C99D02E7740156FA3D8").slice(0, 40);
}

const TABS = [
  { value: "sent", label: "Отправленные запросы" },
  { value: "received", label: "ПД получены" },
  { value: "processed", label: "ПД обработаны" },
] as const;

function FiltersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5">
      <path d="M4 7h10M17 7h3M4 12h3M10 12h10M4 17h10M17 17h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="15.5" cy="7" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="12" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15.5" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Строка реестра: ID (слева) · адрес сервиса-ссылка (центр) · дата (справа). */
function RegisterItem({ row, onClick }: { row: RegisterRow; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ds-row flex min-h-[66px] w-full items-center gap-2 rounded-[4px] border border-border bg-white px-6 text-left transition-colors"
    >
      <span className="ds-p3 min-w-0 flex-1 truncate text-foreground">{row.id}</span>
      <span className="ds-p3 flex-1 text-center text-[var(--color-blue-midhub-500)]">{row.service}</span>
      <span className="ds-p3 flex-1 text-right text-foreground">{row.date}</span>
    </button>
  );
}

function RegistersPanel({
  rows: allRows,
  onRequestPd,
  onOpenRow,
}: {
  rows: RegisterRow[];
  onRequestPd: () => void;
  onOpenRow: (row: RegisterRow) => void;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const onSort = (key: string) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const rows = allRows.filter(
    (r) => r.service.toLowerCase().includes(query.trim().toLowerCase()) || r.id.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
      <SearchBar
        size="l"
        placeholder="Поиск"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        actions={
          <Button variant="secondary" size="l" iconLeft={<FiltersIcon />}>
            Фильтры
          </Button>
        }
      />

      {/* Таблица: на узких экранах прокручивается по горизонтали (длинные ID). */}
      <div className="overflow-x-auto">
        <div className="flex min-w-[720px] flex-col gap-3">
          <TableHeader
            size="s"
            tone="muted"
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
            columns={[
              { key: "id", label: "Идентификатор запроса" },
              { key: "service", label: "Адрес сервиса", align: "center", sortable: true },
              { key: "date", label: "Дата запроса", align: "right", sortable: true },
            ]}
          />
          {rows.map((row, i) => (
            <RegisterItem key={i} row={row} onClick={() => onOpenRow(row)} />
          ))}
        </div>
      </div>

      <Button variant="primary" size="l" className="self-center" onClick={onRequestPd}>
        Запросить ПД пользователя
      </Button>
    </div>
  );
}

type View =
  | { type: "list" }
  | { type: "flow" }
  | { type: "detail"; variant: PdDetailVariant; service: string; rid: string };

export function CabinetRegistersScreen({ cabinet, current }: { cabinet: CabinetConfig; current: string }) {
  const [tab, setTab] = useState<string>("sent");
  const [view, setView] = useState<View>({ type: "list" });
  const [requests, setRequests] = useState<RegisterRow[]>(SEED_ROWS);

  /** Перевести запрос в новый статус. */
  const setStatus = (id: string, status: RequestStatus) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  if (view.type === "flow") {
    return (
      <PdRequestFlow
        cabinet={cabinet}
        current={current}
        onClose={() => setView({ type: "list" })}
        onSubmit={({ service, rid }) => {
          // Новый запрос попадает в таб «Отправленные запросы»…
          const id = rid.trim() || genId();
          const newReq: RegisterRow = { id, service: service.trim() || "—", date: todayRange(), status: "sent" };
          setRequests((prev) => [newReq, ...prev]);
          setTab("sent");
          setView({ type: "list" });
          // …а через несколько секунд сервис «отвечает» → таб «ПД получены».
          setTimeout(() => {
            setStatus(id, "received");
            setTab("received");
          }, 4000);
        }}
      />
    );
  }

  if (view.type === "detail") {
    const rid = view.rid;
    return (
      <PdRequestDetail
        cabinet={cabinet}
        current={current}
        variant={view.variant}
        service={view.service}
        rid={rid}
        onClose={() => setView({ type: "list" })}
        onComplete={() => {
          setStatus(rid, "processed");
          setTab("processed");
          setView({ type: "list" });
        }}
      />
    );
  }

  const tabRows = requests.filter((r) => r.status === tab);

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        <Tabs
          value={tab}
          onValueChange={setTab}
          variant="solid-light"
          size="l"
          equal
          aria-label="Реестры"
          className="w-full rounded-none border-x-0 border-t-0"
        >
          {TABS.map((t) => (
            <Tab key={t.value} value={t.value}>
              {t.label}
            </Tab>
          ))}
        </Tabs>
        <RegistersPanel
          rows={tabRows}
          onRequestPd={() => setView({ type: "flow" })}
          onOpenRow={(row) =>
            setView({ type: "detail", variant: tab as PdDetailVariant, service: row.service, rid: row.id })
          }
        />
      </main>
    </div>
  );
}
