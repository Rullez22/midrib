"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ReportPeriodBar } from "@/components/ds";
import { ReportBody } from "../report/_components/report-body";
import {
  Tabs,
  Tab,
  Button,
  Badge,
  Dropdown,
  TableHeader,
  AccountCard,
  TransactionsTable,
  type Transaction,
  type TableColumn,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { CoopSidebar } from "../../flow/company-create/_components/coop-sidebar";
import { useEnsureFinal, useRegFlow } from "../../flow/company-create/_components/reg-flow";
import { CABINET_ROUTES } from "./cabinet-seed";
import { ACCOUNT_DOCS, TEMPLATE_DOC_ID, EXTERNAL_DOC_ID, templateDocRow, externalDocRow } from "../document/_components/documents-data";

/**
 * CabinetScreen — «Личный кабинет» кооператива (сценарий 1 раздела «Кооператив»).
 * Источник: Figma 1857:649628 — верхние табы счетов, карточка «Целевой счёт»
 * (баланс + Реквизиты/Перевод), под-табы (Подсчета/Документооборот/Артефакты),
 * строки подсчётов и блок «Последние транзакции».
 *
 * Reuse DS: CoopSidebar (current="accounts") · Tabs · AccountCard (collapsed) ·
 * TransactionsTable (1:1 «транзакции-лк») · Button. Засидивает «всё готово»
 * (useEnsureFinal), чтобы кабинет показывал настроенный кооператив.
 */

/** Стрелка на кнопках баланса (Реквизиты — вверх-вправо, Перевод — вниз-вправо). */
function ArrowIcon({ up = false }: { up?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      {up ? (
        <path d="M11 9V5H7M11 5l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 7v4h4M5 11l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/** Подсчёта целевого счёта (Figma 1768:270396…270399). */
const SUBACCOUNTS = [
  { pct: 10, name: "Счет инвестиционных токенов", amount: "100 000 PAEV" },
  { pct: 10, name: "Счет управляющих токенов", amount: "100 000 PAEV" },
  { pct: 10, name: "Маршрутный счет", amount: "100 000 PAEV" },
  { pct: 40, name: "Маркетинговый счет", amount: "" },
];

/* ── Документооборот / Артефакты (Figma 1857:649624 / 1857:649651) ──────── */
const DOC_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип документа", flex: 2, sortable: true },
  { key: "status", label: "Статус", flex: 1.2, align: "center", sortable: true },
  { key: "verify", label: "Тип верификации", flex: 1.2, align: "center", sortable: true },
  { key: "date", label: "Дата", flex: 1, align: "right", sortable: true },
];
const ART_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип артефакта", flex: 1, sortable: true },
  { key: "date", label: "Дата", flex: 1, align: "right", sortable: true },
  { key: "action", label: "", width: "72px" },
];

/** Состояние делегирования артефакта: share=доступен · lock=фиксирован · person=передан. */
type ArtState = "share" | "lock" | "person";
const ARTIFACTS: { type: string; name: string; date: string; state: ArtState }[] = [
  { type: "Документ", name: "Документ в свободной форме", date: "09.01.2020", state: "share" },
  { type: "Документ", name: "Сочинение на тему: «Как я провел Лето»", date: "09.01.2020", state: "lock" },
  { type: "Патент", name: "Изобретение плазменного реактора", date: "09.01.2020", state: "person" },
];

const ART_FILTERS = [
  { value: "all", label: "Все" },
  { value: "fixed", label: "Фиксированные" },
  { value: "transfer", label: "Доступные к передаче" },
  { value: "passed", label: "Переданные" },
];

const colStyle = (c: TableColumn): CSSProperties =>
  c.width ? { flex: `0 0 ${c.width}`, width: c.width } : { flex: c.flex ?? 1 };

function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

/** Иконка-состояние артефакта (1:1 Figma 6523:328399/402/405): person — голубой, lock/share — серый. */
function ArtStateIcon({ state }: { state: ArtState }) {
  if (state === "person")
    return (
      <svg viewBox="0 0 26 24" fill="none" aria-hidden className="size-6 shrink-0 text-primary">
        <path d="M14.7817 14.6664V13.3331C15.0984 13.1844 16.0044 12.163 16.0994 11.365C16.3486 11.347 16.74 11.1303 16.8555 10.2749C16.9174 9.81558 16.671 9.55757 16.5218 9.47623C16.5218 9.47623 16.8935 8.80753 16.8935 8.00017C16.8935 6.38143 16.2226 5.00004 14.7817 5.00004C14.7817 5.00004 14.2812 4 12.6699 4C9.68377 4 8.44626 5.81408 8.44626 8.00017C8.44626 8.7362 8.81794 9.47623 8.81794 9.47623C8.6687 9.55757 8.42233 9.81624 8.48427 10.2749C8.59972 11.1303 8.9911 11.347 9.2403 11.365C9.33533 12.163 10.2413 13.1844 10.5581 13.3331V14.6664C9.85413 16.6665 4.22266 15.3331 4.22266 20H21.1171C21.1171 15.3331 15.4856 16.6665 14.7817 14.6664Z" fill="currentColor" />
      </svg>
    );
  if (state === "lock")
    return (
      <svg viewBox="0 0 26 24" fill="none" aria-hidden className="size-6 shrink-0 text-foreground-subtle">
        <path d="M18.3468 9.75H17.7749V7.5C17.7749 5.01819 15.7228 3 13.1993 3C10.6758 3 8.62372 5.01819 8.62372 7.5V9.75H8.05178C7.10617 9.75 6.33594 10.5067 6.33594 11.4375V19.3125C6.33594 20.2433 7.10617 21 8.05178 21H18.3468C19.2924 21 20.0626 20.2433 20.0626 19.3125V11.4375C20.0626 10.5067 19.2924 9.75 18.3468 9.75ZM10.149 7.5C10.149 5.84546 11.517 4.50005 13.1993 4.50005C14.8816 4.50005 16.2496 5.84546 16.2496 7.5V9.75H10.149V7.5Z" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 26 24" fill="none" aria-hidden className="size-6 shrink-0 text-foreground-subtle">
      <path d="M3.55198 19.9918C3.32756 19.9452 3.16797 19.7521 3.16797 19.5311C3.16797 11.8802 12.3943 10.2519 14.5346 9.97692V6.46733C14.5346 6.29467 14.6319 6.13511 14.789 6.05492C14.9452 5.97309 15.1323 5.98455 15.2777 6.07701L25.1341 12.6101C25.2638 12.6961 25.3419 12.8401 25.3419 13.0005C25.3419 13.1551 25.2638 13.2991 25.1341 13.3875L15.281 19.9198C15.1348 20.0139 14.9469 20.0237 14.7906 19.9435C14.6344 19.8617 14.5388 19.7005 14.5388 19.5295V15.7515C12.9869 15.763 11.7052 15.8317 10.6355 15.9577C5.51029 16.5542 4.1413 19.5843 4.08312 19.7136C4.00582 19.8879 3.8321 20 3.64591 20C3.61515 19.9992 3.58108 19.9975 3.55198 19.9918Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Тулбар таблицы: обычный дропдаун выбора шаблона (не комбобокс — чистая рамка
 * без inset-тени поля) + кнопка добавления. Figma 1977:802442.
 */
function TableToolbar({ placeholder, addLabel, onAdd }: { placeholder: string; addLabel: string; onAdd?: () => void }) {
  const [val, setVal] = useState("all");
  const items = [{ value: "all", label: placeholder }];
  const current = items.find((o) => o.value === val) ?? items[0];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="w-[240px]">
        <Dropdown
          value={val}
          items={items}
          onSelect={setVal}
          aria-label={placeholder}
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
      </div>
      <Button variant="secondary" size="m" iconLeft={<PlusIcon />} onClick={onAdd}>{addLabel}</Button>
    </div>
  );
}

/** Адреса пула маркетингового счёта (Figma «транзакции-маркетинговый счёт» 2642:356140). */
const POOL_ADDRESSES: Transaction[] = [
  { code: "214", color: "cyan", share: "4", hash: "5c243af…07db8", time: "29 секунд назад", from: "Кооператив Immatra", to: "ООО «Петрушка»", document: "Договор", documentSub: "Подключение к пул-счету", amount: "0.229937", commission: "0.0022" },
];

/** Транзакции целевого счёта (Figma «транзакции-лк» 2645:356986). */
const TRANSACTIONS: Transaction[] = [
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счет на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счет на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счет на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "216", color: "purple", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Взносы и целевые поступления", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "215", color: "green", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Поступления с маршрутных счетов", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
];

export interface CabinetScreenProps {
  /** Заголовок счёта. По умолчанию «Целевой счет». */
  title?: string;
  /** Кнопка «назад» в шапке (для под-счёта, напр. маркетингового). */
  onBack?: () => void;
  /**
   * Режим пул-счёта (маркетинговый счёт): первый под-таб — «Адреса пула» с
   * таблицей долей вместо «Подсчета», без нижнего блока «Последние транзакции».
   */
  pool?: boolean;
  /** Под-таб, открытый при входе («doc» — «Документооборот»). Из ?tab страницы. */
  initialTab?: string;
  /** Боковое меню. По умолчанию — админский CoopSidebar (кабинет №1). Кабинеты
   *  2–7 передают свой CompanySidebar. */
  sidebar?: ReactNode;
  /** Баннер «стать пайщиком» (кабинеты 2–7). Его наличие включает cabinet-режим:
   *  первый под-таб «Взаиморасчёты» (ReportBody) вместо «Подсчета», без h1/AccountCard. */
  banner?: ReactNode;
}

export function CabinetScreen({ title = "Целевой счет", onBack, pool = false, initialTab, sidebar, banner }: CabinetScreenProps = {}) {
  useEnsureFinal();
  const flow = useRegFlow();
  const router = useRouter();
  const cabinetMode = banner != null;
  const [subTab, setSubTab] = useState(cabinetMode ? "recon" : initialTab === "doc" ? "doc" : pool ? "pool" : "podsc");

  // Плашки in-flow документов (если флоу начат): сторонний шаблон + шаблон
  // компании отражают текущий этап и добавляются первыми в «Документооборот».
  const docRows = [
    ...(flow.externalDocStage ? [externalDocRow(flow.externalDocStage)] : []),
    ...(flow.templateDocStage ? [templateDocRow(flow.templateDocStage)] : []),
    ...ACCOUNT_DOCS,
  ];
  const [artFilter, setArtFilter] = useState("all");
  const artMatch = (s: ArtState) =>
    artFilter === "all" ||
    (artFilter === "fixed" && s === "lock") ||
    (artFilter === "transfer" && s === "share") ||
    (artFilter === "passed" && s === "person");

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar ?? <CoopSidebar current="accounts" routes={CABINET_ROUTES} />}

      <main className="min-w-0 flex-1">
        {/* Верхние табы счетов — на всю ширину, прилеплены к верху */}
        <Tabs
          defaultValue="acc86"
          variant="solid-light"
          size="l"
          equal
          aria-label="Счёт"
          className="w-full rounded-none border-x-0 border-t-0"
        >
          <Tab value="acc86">86-й счет</Tab>
          <Tab value="admin">Административные счета</Tab>
          <Tab value="paev">Паевые счета</Tab>
        </Tabs>

        <div className="flex w-full flex-col gap-10 px-5 pb-8 pt-4 md:px-10">
          {/* Кабинеты 2–7: баннер «стать пайщиком» вместо шапки счёта/AccountCard. */}
          {cabinetMode ? (
            <div className="-mb-6">{banner}</div>
          ) : (
            <>
              {/* Кнопка «назад» — DS Button (ghost, icon-only). Для под-счёта
                  (маркетинговый счёт). -mb-6 уменьшает gap-10 (40px) до 16px к шапке. */}
              {onBack && (
                <Button
                  variant="ghost"
                  size="m"
                  aria-label="Назад"
                  onClick={onBack}
                  className="-mb-6 self-start"
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
                      <path d="m14 7-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
              )}

              {/* Шапка: заголовок счёта + «Отчётность» (Figma 13:42079 / 13:27240). */}
              <div className="-mb-6 flex items-center justify-between gap-4">
                <h1 className="ds-h5 text-foreground">{title}</h1>
                <Button variant="ghost" size="s" onClick={() => router.push("/cabinet/report")}>Отчетность</Button>
              </div>
            </>
          )}

          {/* Карта счёта (свёрнутая) + под-табы + контент — единая группа gap 16px */}
          <div className="flex flex-col gap-4">
            {!cabinetMode && (
              <AccountCard
                amount="1.231 ETH"
                secondaryAmount="15.88 USD"
                leftAction={<Button size="m" iconLeft={<ArrowIcon up />} className="w-[150px]">Реквизиты</Button>}
                rightAction={<Button size="m" iconLeft={<ArrowIcon />} className="w-[150px]" onClick={() => router.push(pool ? "/cabinet/account/marketing/connect" : "/cabinet/payment")}>Перевод</Button>}
                collapsed
                menuItems={[
                  { label: "Редактировать", onSelect: () => {} },
                  { label: "Создать подсчет", onSelect: () => {} },
                ]}
              />
            )}

            {/* Под-разделы целевого счёта (кабинеты: Взаиморасчёты вместо Подсчета) */}
            <Tabs value={subTab} onValueChange={setSubTab} variant="basic" size="m" aria-label="Раздел счёта" className="w-full">
              {cabinetMode ? <Tab value="recon">Взаиморасчеты</Tab> : pool ? <Tab value="pool">Адреса пула</Tab> : <Tab value="podsc">Подсчета</Tab>}
              <Tab value="doc">Документооборот</Tab>
              <Tab value="art">Артефакты</Tab>
            </Tabs>

            {/* Взаиморасчёты (кабинеты): период + тело отчёта (готовые композиты) */}
            {cabinetMode && subTab === "recon" && (
              <div className="flex flex-col gap-6">
                <ReportPeriodBar period="15 декабря 2019 - 22 декабря 2019" periodLabel="Период отчета:" historyLabel="История отчетов" onPickPeriod={() => {}} />
                <ReportBody />
              </div>
            )}

            {/* Адреса пула (маркетинговый счёт): таблица долей */}
            {pool && subTab === "pool" && (
              <TransactionsTable transactions={POOL_ADDRESSES} title={null} showFilters={false} showMore={false} showShare />
            )}

            {/* Подсчёта: % распределения / название / сумма / Подробнее */}
            {!pool && subTab === "podsc" && (
              <div className="flex flex-col gap-3">
                {SUBACCOUNTS.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-[4px] border border-border bg-surface px-6 py-4"
                  >
                    <span className="ds-h4 shrink-0 text-primary">{s.pct} %</span>
                    <span className="ds-p3 flex-1 text-foreground">{s.name}</span>
                    {s.amount && <span className="ds-p3 hidden text-foreground sm:block">{s.amount}</span>}
                    <Button
                      variant="secondary"
                      size="s"
                      onClick={s.name === "Маркетинговый счет" ? () => router.push("/cabinet/account/marketing") : undefined}
                    >
                      Подробнее
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Документооборот: тулбар + таблица документов */}
            {subTab === "doc" && (
              <div className="flex flex-col gap-4">
                <TableToolbar placeholder="Все шаблоны" addLabel="Добавить документ" onAdd={() => router.push("/cabinet/document/new")} />
                <div className="flex flex-col gap-2">
                  <TableHeader columns={DOC_COLUMNS} size="s" tone="muted" />
                  {docRows.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        router.push(
                          d.id === TEMPLATE_DOC_ID
                            ? "/cabinet/document/create?resume=1"
                            : d.id === EXTERNAL_DOC_ID
                              ? "/cabinet/document/external?resume=1"
                              : `/cabinet/document/${d.id}`,
                        )
                      }
                      className="flex items-center gap-2 rounded-[4px] border border-border bg-surface px-6 py-3 text-left transition-colors hover:border-[var(--color-blue-midhub-300)]"
                    >
                      <div className="flex flex-col gap-0.5" style={colStyle(DOC_COLUMNS[0])}>
                        <span className="ds-caption text-foreground-subtle">{d.type}</span>
                        <span className="ds-p3 text-foreground">{d.name}</span>
                      </div>
                      <div className="ds-p3 text-center text-foreground" style={colStyle(DOC_COLUMNS[1])}>{d.status}</div>
                      <div className="flex justify-center" style={colStyle(DOC_COLUMNS[2])}>
                        {d.badge && <Badge variant={d.badgeVariant ?? "solid"} color={d.badgeColor ?? "orange"} className="w-[139px]">{d.badge}</Badge>}
                      </div>
                      <div className="ds-p3 text-right text-foreground" style={colStyle(DOC_COLUMNS[3])}>{d.date}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Артефакты: фильтр-табы + тулбар + таблица артефактов */}
            {subTab === "art" && (
              <div className="flex flex-col gap-4">
                <Tabs value={artFilter} onValueChange={setArtFilter} variant="basic" size="m" equal aria-label="Фильтр артефактов" className="w-full">
                  {ART_FILTERS.map((f) => (
                    <Tab key={f.value} value={f.value}>{f.label}</Tab>
                  ))}
                </Tabs>
                <TableToolbar placeholder="Все шаблоны артефактов" addLabel="Добавить артефакт" />
                <div className="flex flex-col gap-2">
                  <TableHeader columns={ART_COLUMNS} size="s" tone="muted" />
                  {ARTIFACTS.filter((a) => artMatch(a.state)).map((a, i) => (
                    <div key={i} className="flex items-center rounded-[4px] border border-border bg-surface px-4 py-3">
                      <div className="flex flex-col gap-0.5 pr-3" style={colStyle(ART_COLUMNS[0])}>
                        <span className="ds-caption text-foreground-subtle">{a.type}</span>
                        <span className="ds-p3 text-foreground">{a.name}</span>
                      </div>
                      <div className="ds-p3 text-right text-foreground" style={colStyle(ART_COLUMNS[1])}>{a.date}</div>
                      <div className="flex items-center justify-end gap-3" style={colStyle(ART_COLUMNS[2])}>
                        <div className="h-6 w-px bg-border" />
                        <ArtStateIcon state={a.state} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Последние транзакции (DS TransactionsTable, 1:1 «транзакции-лк») — только целевой счёт */}
          {!pool && <TransactionsTable transactions={TRANSACTIONS} showFilters={false} />}
        </div>
      </main>
    </div>
  );
}
