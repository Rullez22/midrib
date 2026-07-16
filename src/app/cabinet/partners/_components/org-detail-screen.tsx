"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  Tab,
  Button,
  Badge,
  Checkbox,
  Dropdown,
  TableHeader,
  ReportPeriodBar,
  StatSummary,
  TransactionsTable,
  type TableColumn,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { CoopSidebar } from "../../../flow/company-create/_components/coop-sidebar";
import { CompanySidebar } from "../../[company]/_components/company-sidebar";
import { type CabinetConfig } from "../../[company]/_config/cabinets";
import { CABINET_ROUTES } from "../../_components/cabinet-seed";
import { StarRating } from "./org-row";
import {
  PARTNER_SUMMARY,
  PARTNER_TRANSACTIONS,
  DOC_STATUS_COLOR,
  getContractForDoc,
  type Org,
  type OrgDoc,
} from "./partners-data";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { KINDS, PARTNER_DOC_ITEMS } from "./doc-kinds";

/**
 * OrgDetailScreen — детальный экран организации-партнёра (Figma 6760-461737 /
 * 467001 / 500491). CoopSidebar + шапка-профиль (лого, название, адрес, описание,
 * рейтинг, закладка, ⋮) + табы «Взаиморасчеты / Документооборот».
 *
 * Reuse DS: CoopSidebar · Tabs · TableHeader · Badge · Button · Dropdown ·
 * StatSummary · ReportPeriodBar · TransactionsTable. Рейтинг —
 * локальный StarRating (см. org-row).
 */

const colStyle = (c: TableColumn): CSSProperties =>
  c.width ? { flex: `0 0 ${c.width}`, width: c.width } : { flex: c.flex ?? 1 };

const DOC_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип документа", flex: 2.4, sortable: true },
  { key: "amount", label: "Сумма", flex: 1.2, align: "center", sortable: true },
  { key: "status", label: "Статус", flex: 1.4, align: "center", sortable: true },
  { key: "date", label: "Дата", flex: 1, align: "right", sortable: true },
];

type SortDir = "asc" | "desc";
const parseAmount = (s: string) => Number(s.replace(/\D/g, "")) || 0;
const parseDate = (s: string) => {
  const [d, m, y] = s.split(".").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).getTime();
};
const cmpDoc = (a: OrgDoc, b: OrgDoc, key: string): number => {
  switch (key) {
    case "amount": return parseAmount(a.amount) - parseAmount(b.amount);
    case "date": return parseDate(a.date) - parseDate(b.date);
    case "status": return a.status.localeCompare(b.status);
    default: return a.name.localeCompare(b.name);
  }
};

function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0">
      <path d="M8 14s5-4.2 5-8A5 5 0 0 0 3 6c0 3.8 5 8 5 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="8" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
      <path d="M5 3.5h10v13l-5-3.2-5 3.2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function KebabIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="size-5">
      <circle cx="10" cy="4" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="10" cy="16" r="1.6" />
    </svg>
  );
}
/* ── Документооборот ─────────────────────────────────────────────────────── */
function DocFlow({ org, cabinet }: { org: Org; cabinet?: CabinetConfig }) {
  const router = useRouter();
  const { signedContracts, createdContracts, approvedOrgDocs, cultureStarted, cultureClosed } = useRegFlow();
  const base = cabinet ? `/cabinet/${cabinet.slug}/partners/org/${org.id}` : `/cabinet/partners/org/${org.id}`;
  // Верхнеуровневые документы, созданные на странице партнёра (parentId === null).
  // Вложенные (созданные внутри документа) сюда не попадают — они внутри родителя.
  const myCreated = createdContracts.filter((c) => c.orgId === org.id && c.parentId === null);
  const [showContract, setShowContract] = useState(true);
  const [showPaishik, setShowPaishik] = useState(true);

  const [sort, setSort] = useState<{ key: string; dir: SortDir }>({ key: "date", dir: "desc" });
  const onSort = (key: string) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const contractCount = org.docs.filter((d) => d.group === "contract").length;
  const paishikCount = org.docs.filter((d) => d.group === "paishik").length;
  const docs = org.docs
    .filter((d) => (d.group === "contract" && showContract) || (d.group === "paishik" && showPaishik))
    .sort((a, b) => cmpDoc(a, b, sort.key) * (sort.dir === "asc" ? 1 : -1));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox
            size="xs"
            checked={showContract}
            onChange={(e) => setShowContract(e.target.checked)}
            label={`Договора и соглашения (${contractCount})`}
          />
          <Checkbox
            size="xs"
            checked={showPaishik}
            onChange={(e) => setShowPaishik(e.target.checked)}
            label={`Документы пайщика (${paishikCount})`}
          />
        </div>
        <Dropdown
          align="end"
          aria-label="Тип документа"
          items={PARTNER_DOC_ITEMS}
          onSelect={(v) => router.push(`${base}/contract-new?kind=${v}`)}
          trigger={<Button size="m" iconLeft={<PlusIcon />}>Добавить документ</Button>}
        />
      </div>

      <div className="flex flex-col gap-2">
        <TableHeader columns={DOC_COLUMNS} size="s" tone="muted" sortKey={sort.key} sortDir={sort.dir} onSort={onSort} />

        {/* Договоры, созданные из формы (сверху): «Ожидает участия» → «Согласован». */}
        {showContract && myCreated.map((c) => {
          const status = c.finalized ? "Согласован" : "Ожидает участия";
          // Вложенный документ требует действий → родитель тоже оранжевый и
          // показывает второй статус «Ожидает участия».
          const nestedPending = createdContracts.some((n) => n.parentId === c.id && !n.finalized);
          const orange = status === "Ожидает участия" || nestedPending;
          const openCreated = () => router.push(`${base}/doc/${c.id}`);
          return (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              onClick={openCreated}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCreated(); } }}
              className={cn(
                "flex items-center gap-2 rounded-[4px] border bg-surface px-6 py-3 cursor-pointer transition-shadow hover:shadow-sm",
                orange ? "border-[color:var(--color-orange-400)]" : "border-border",
              )}
            >
              <div className="flex flex-col gap-0.5" style={colStyle(DOC_COLUMNS[0])}>
                <span className="ds-caption text-foreground-subtle">{KINDS[c.kind].doc}</span>
                <span className="ds-p3 text-foreground">{c.name}</span>
              </div>
              <div className="ds-p3 text-center text-foreground" style={colStyle(DOC_COLUMNS[1])}>{c.amount}</div>
              <div className="flex flex-wrap justify-center gap-1.5" style={colStyle(DOC_COLUMNS[2])}>
                <Badge variant="soft" color={DOC_STATUS_COLOR[status]} className="min-w-[150px] justify-center">{status}</Badge>
                {nestedPending && status !== "Ожидает участия" && (
                  <Badge variant="soft" color="orange" className="min-w-[150px] justify-center">Ожидает участия</Badge>
                )}
              </div>
              <div className="ds-p3 text-right text-foreground" style={colStyle(DOC_COLUMNS[3])}>11.01.2020</div>
            </div>
          );
        })}

        {docs.map((d, i) => {
          const contract = getContractForDoc(d.name);
          const isSigned = contract != null && signedContracts.includes(contract.id);
          // Все документы кликабельны: флоу-договор НВО → его контракт; остальные
          // «обычные» доки → /doc/orgdoc-<индекс в org.docs> (PartnerDocScreen).
          const docId = contract ? contract.id : `orgdoc-${org.docs.indexOf(d)}`;
          // Исключение culture / Договор №1: Ожидает участия → Оценка → Закрыт.
          const isCulture = org.id === "culture" && d.name === "Договор №1";
          const status = isCulture
            ? (cultureClosed ? "Закрыт" : cultureStarted ? "Оценка" : d.status)
            : isSigned || approvedOrgDocs.includes(docId)
              ? "Согласован"
              : d.status;
          const statusColor = status === "Закрыт" ? "grey" : status === "Оценка" ? "orange" : DOC_STATUS_COLOR[status as keyof typeof DOC_STATUS_COLOR];
          // Вложенный документ требует действий → родитель тоже оранжевый и
          // показывает второй статус «Ожидает участия».
          const nestedPending = createdContracts.some((n) => n.parentId === docId && !n.finalized);
          const orange = status === "Ожидает участия" || status === "Оценка" || nestedPending;
          const open = () => router.push(`${base}/doc/${docId}`);
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={open}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
              className={cn(
                "flex items-center gap-2 rounded-[4px] border bg-surface px-6 py-3 cursor-pointer transition-shadow hover:shadow-sm",
                orange ? "border-[color:var(--color-orange-400)]" : "border-border",
              )}
            >
              <div className="flex flex-col gap-0.5" style={colStyle(DOC_COLUMNS[0])}>
                <span className="ds-caption text-foreground-subtle">{d.type}</span>
                <span className="ds-p3 text-foreground">{d.name}</span>
              </div>
              <div className="ds-p3 text-center text-foreground" style={colStyle(DOC_COLUMNS[1])}>{d.amount}</div>
              <div className="flex flex-wrap justify-center gap-1.5" style={colStyle(DOC_COLUMNS[2])}>
                <Badge variant="soft" color={statusColor} className="min-w-[150px] justify-center">{status}</Badge>
                {nestedPending && status !== "Ожидает участия" && (
                  <Badge variant="soft" color="orange" className="min-w-[150px] justify-center">Ожидает участия</Badge>
                )}
              </div>
              <div className="ds-p3 text-right text-foreground" style={colStyle(DOC_COLUMNS[3])}>{d.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Взаиморасчеты ───────────────────────────────────────────────────────── */
function Mutual() {
  return (
    <div className="flex flex-col gap-8">
      <ReportPeriodBar period="15 декабря 2019 - 22 декабря 2019" periodLabel="Период отчета:" historyLabel="История отчетов" />
      <StatSummary items={PARTNER_SUMMARY} />
      <TransactionsTable transactions={PARTNER_TRANSACTIONS} />
    </div>
  );
}

export function OrgDetailScreen({ org, cabinet }: { org: Org; cabinet?: CabinetConfig }) {
  const router = useRouter();
  const [tab, setTab] = useState("docs");
  const basePath = cabinet ? `/cabinet/${cabinet.slug}/partners` : "/cabinet/partners";

  return (
    <div className="flex min-h-screen bg-background">
      {cabinet ? (
        <CompanySidebar cabinet={cabinet} current="partners" />
      ) : (
        <CoopSidebar current="partners" routes={CABINET_ROUTES} />
      )}

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-5 px-5 py-6 md:px-[50px]">
          {/* Назад */}
          <button
            type="button"
            aria-label="Назад к партнёрам"
            onClick={() => router.push(basePath)}
            className="flex size-10 items-center justify-center self-start rounded-[6px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground"
          >
            <BackIcon />
          </button>

          {/* Шапка-профиль организации */}
          <div className="flex gap-5 rounded-[10px] border border-border bg-[#fff] p-5">
            <div className="size-[150px] shrink-0 overflow-hidden rounded-[8px] border border-border bg-surface-sunken">
              <img src={org.media} alt="" className="size-full object-cover" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="ds-h5 text-foreground">{org.name}</span>
                  <span className="ds-caption flex items-center gap-1 text-primary">
                    <PinIcon />
                    {org.address}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StarRating value={org.rating} />
                  <button type="button" aria-label="В закладки" className="text-foreground-subtle transition-colors hover:text-foreground">
                    <BookmarkIcon />
                  </button>
                  <Dropdown
                    align="end"
                    items={[
                      { value: "share", label: "Поделиться" },
                      { value: "report", label: "Пожаловаться" },
                    ]}
                    trigger={<button type="button" aria-label="Ещё" className="text-foreground-subtle transition-colors hover:text-foreground"><KebabIcon /></button>}
                  />
                </div>
              </div>
              {org.paragraphs.map((p, i) => (
                <p key={i} className="ds-p3 text-foreground-muted">{p}</p>
              ))}
              <span className="ds-caption mt-1 flex items-center gap-1 text-foreground-subtle">
                <ClockIcon />
                {org.activity}
              </span>
            </div>
          </div>

          {/* Табы счёта */}
          <Tabs value={tab} onValueChange={setTab} variant="basic" size="l" aria-label="Счёт организации" className="w-full">
            <Tab value="mutual">Взаиморасчеты</Tab>
            <Tab value="docs">Документооборот</Tab>
          </Tabs>

          {tab === "mutual" ? <Mutual /> : <DocFlow org={org} cabinet={cabinet} />}
        </div>
      </main>
    </div>
  );
}
