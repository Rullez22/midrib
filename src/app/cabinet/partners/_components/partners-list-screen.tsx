"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  Tab,
  SearchBar,
  Combobox,
  Badge,
  Button,
  TableHeader,
  type TableColumn,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { CoopSidebar } from "../../../flow/company-create/_components/coop-sidebar";
import { CompanySidebar } from "../../[company]/_components/company-sidebar";
import { type CabinetConfig } from "../../[company]/_config/cabinets";
import { CABINET_ROUTES } from "../../_components/cabinet-seed";
import { OrgRow } from "./org-row";
import { EmployeeDocScreen } from "./employee-doc-screen";
import { ORGS, FIND_ORGS, EMPLOYEE_DOCS, DOC_STATUS_COLOR, VELESTA_CONTRACT, type EmployeeDoc, type OrgDocStatus } from "./partners-data";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";

/**
 * PartnersListScreen — «Партнёры» (Figma 6760-461828 / 462037 / 462553).
 * Три верхних таба: «Партнёры» (организации + статус-баннеры), «Ваши сотрудники»
 * (таблица документов), «Найти нового партнёра» (поиск + карточки организаций).
 *
 * Reuse DS: CoopSidebar · Tabs · SearchBar · Combobox · Banner (статус) · Badge ·
 * Button · TableHeader. Карточка организации — локальный OrgRow (лого + рейтинг).
 */

const colStyle = (c: TableColumn): CSSProperties =>
  c.width ? { flex: `0 0 ${c.width}`, width: c.width } : { flex: c.flex ?? 1 };

const EMP_COLUMNS: TableColumn[] = [
  { key: "name", label: "Наименование документа", flex: 2.4, sortable: true },
  { key: "staff", label: "Сотрудник", flex: 1.4, sortable: true },
  { key: "status", label: "Статус", flex: 1.2, align: "center", sortable: true },
  { key: "date", label: "Дата обработки", flex: 1.2, align: "right", sortable: true },
];

type SortDir = "asc" | "desc";
const parseDate = (s: string) => {
  const [d, m, y] = s.split(".").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).getTime();
};

function StatusInfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5 shrink-0">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6.4" r="1" fill="currentColor" />
    </svg>
  );
}
function SearchPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3.5-3.5M11 8.5v5M8.5 11h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 14h3v3M20 14v6M14 20h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Таб «Партнёры» ──────────────────────────────────────────────────────── */
function PartnersTab({ basePath }: { basePath: string }) {
  const router = useRouter();
  const { signedContracts } = useRegFlow();
  // Договор Velesta подписан → оранжевая плашка со статусом уходит.
  const bannerFor = (id: string, banner?: number) =>
    id === "velesta" && signedContracts.includes(VELESTA_CONTRACT.id) ? undefined : banner;
  return (
    <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
      <h1 className="ds-h4 text-center text-foreground">Организации, с которыми вы взаимодействуете</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar size="l" placeholder="Поиск" className="flex-1" />
        <div className="w-full sm:w-[277px]">
          <Combobox
            size="l"
            label="Выбрать страну"
            defaultValue="ru"
            options={[
              { value: "ru", label: "Россия" },
              { value: "by", label: "Беларусь" },
              { value: "kz", label: "Казахстан" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {ORGS.map((o) => {
          const banner = bannerFor(o.id, o.banner);
          const card = (
            <OrgRow
              media={<img src={o.media} alt="" className="size-full object-cover" />}
              name={o.name}
              address={o.address}
              description={o.short}
              rating={o.rating}
              bare={banner != null}
              onOpen={() => router.push(`${basePath}/org/${o.id}`)}
            />
          );
          // Со статусом — единый блок: оранжевая шапка + карточка встык.
          if (banner != null) {
            return (
              <div key={o.id} className="ds-row overflow-hidden rounded-[10px] border border-border bg-[#fff]">
                <div className="flex items-center justify-between gap-4 border-b border-border bg-[color:var(--color-orange-50)] px-4 py-2">
                  <span className="ds-p3-medium flex items-center gap-2 text-[color:var(--color-orange-500)]">
                    <StatusInfoIcon />
                    СТАТУС ДОКУМЕНТОВ:
                  </span>
                  <Badge variant="solid" color="orange" style={{ backgroundColor: "var(--color-orange-500)", color: "#fff" }}>Ожидают участия ({banner})</Badge>
                </div>
                {card}
              </div>
            );
          }
          return <div key={o.id}>{card}</div>;
        })}
      </div>
    </div>
  );
}

/* ── Таб «Ваши сотрудники» ───────────────────────────────────────────────── */
/** Стабильный ключ документа сотрудника (для RegFlow.approvedOrgDocs). */
const empDocKey = (d: EmployeeDoc) => `emp:${d.name}`;

function EmployeesTab() {
  const { approvedOrgDocs } = useRegFlow();
  const [sort, setSort] = useState<{ key: string; dir: SortDir }>({ key: "date", dir: "desc" });
  // Открытый документ (клик по строке) → просмотр с чатом и подписью.
  const [openDoc, setOpenDoc] = useState<EmployeeDoc | null>(null);
  const onSort = (key: string) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  // Подписанный/согласованный документ показывается как «Согласован».
  const effStatus = (d: EmployeeDoc): OrgDocStatus =>
    approvedOrgDocs.includes(empDocKey(d)) ? "Согласован" : d.status;

  const rows = [...EMPLOYEE_DOCS].sort((a, b) => {
    const c =
      sort.key === "date"
        ? parseDate(a.date) - parseDate(b.date)
        : sort.key === "staff"
          ? a.staff.localeCompare(b.staff)
          : sort.key === "status"
            ? a.status.localeCompare(b.status)
            : a.name.localeCompare(b.name);
    return c * (sort.dir === "asc" ? 1 : -1);
  });

  if (openDoc) {
    return <EmployeeDocScreen doc={openDoc} docKey={empDocKey(openDoc)} onBack={() => setOpenDoc(null)} />;
  }

  return (
    <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
      <h1 className="ds-h4 text-center text-foreground">Документы от ваших сотрудников</h1>

      <div className="flex flex-col gap-2">
        <TableHeader columns={EMP_COLUMNS} size="s" tone="muted" sortKey={sort.key} sortDir={sort.dir} onSort={onSort} />
        {rows.map((d, i) => {
          const status = effStatus(d);
          return (
            <button
              key={i}
              type="button"
              onClick={() => setOpenDoc(d)}
              className={cn(
                "flex items-center gap-2 rounded-[4px] border bg-surface px-6 py-3 text-left transition-colors hover:bg-surface-sunken",
                status !== "Согласован" && d.highlight ? "border-[color:var(--color-orange-400)]" : "border-border",
              )}
            >
              <div className="flex flex-col gap-0.5" style={colStyle(EMP_COLUMNS[0])}>
                <span className="ds-caption text-foreground-subtle">{d.type}</span>
                <span className="ds-p3 text-foreground">{d.name}</span>
              </div>
              <div className="ds-p3 text-foreground" style={colStyle(EMP_COLUMNS[1])}>{d.staff}</div>
              <div className="flex justify-center" style={colStyle(EMP_COLUMNS[2])}>
                <Badge variant="soft" color={DOC_STATUS_COLOR[status]}>{status}</Badge>
              </div>
              <div className="ds-p3 text-right text-foreground" style={colStyle(EMP_COLUMNS[3])}>{d.date}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Таб «Найти нового партнёра» ─────────────────────────────────────────── */
function FindTab() {
  return (
    <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
      <h1 className="ds-h4 text-center text-foreground">Выберите организацию для взаимодействия</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar size="l" placeholder="Поиск" className="flex-1" />
        <Button variant="ghost" size="l" iconLeft={<SearchPlusIcon />}>Расширенный поиск</Button>
        <Button variant="ghost" size="l" iconLeft={<QrIcon />}>QR-код</Button>
      </div>

      <div className="flex flex-col gap-3">
        {FIND_ORGS.map((o) => (
          <OrgRow
            key={o.id}
            media={<img src={o.media} alt="" className="size-full object-cover" />}
            name={o.name}
            address={o.address}
            description={o.short}
            rating={o.rating}
          />
        ))}
      </div>
    </div>
  );
}

export function PartnersListScreen({ cabinet }: { cabinet?: CabinetConfig }) {
  const [tab, setTab] = useState("partners");
  const basePath = cabinet ? `/cabinet/${cabinet.slug}/partners` : "/cabinet/partners";

  return (
    <div className="flex min-h-screen bg-background">
      {cabinet ? (
        <CompanySidebar cabinet={cabinet} current="partners" />
      ) : (
        <CoopSidebar current="partners" routes={CABINET_ROUTES} />
      )}

      <main className="min-w-0 flex-1">
        <Tabs
          value={tab}
          onValueChange={setTab}
          variant="solid-light"
          size="l"
          equal
          aria-label="Партнёры"
          className="w-full rounded-none border-x-0 border-t-0"
        >
          <Tab value="partners">Партнеры</Tab>
          <Tab value="employees">Ваши сотрудники</Tab>
          <Tab value="find">Найти нового партнера</Tab>
        </Tabs>

        {/* key={tab} — панель монтируется заново, .ds-content играет при смене таба. */}
        <div key={tab} className="ds-content">
          {tab === "partners" && <PartnersTab basePath={basePath} />}
          {tab === "employees" && <EmployeesTab />}
          {tab === "find" && <FindTab />}
        </div>
      </main>
    </div>
  );
}
