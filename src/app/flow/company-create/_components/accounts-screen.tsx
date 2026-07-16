"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useTableSort } from "@/lib/use-table-sort";
import {
  Tabs,
  Tab,
  Button,
  Banner,
  Badge,
  Combobox,
  TableHeader,
  AccountCard,
  type AccountRow,
  type TableColumn,
} from "@/components/ds";
import { CoopSidebar } from "./coop-sidebar";
import { ValidatorModal } from "./validator-modal";
import { useEnsureAccountsReady, useRegFlow } from "./reg-flow";

/**
 * AccountsScreen — «Настройка счетов» (Счета). Разблокируется баннером «Завершить
 * настройку» на экране вопросов голосования. Источник: Figma 2484:275487.
 *
 * Reuse DS: CoopSidebar (current="accounts") · Tabs (счета / подразделы) ·
 * AccountCard (баланс + характеристики + футер «Редактировать %», 1:1 композит) ·
 * Button. Строки подсчётов («0% / название / PAEV / Подробнее») — локально
 * (готового композита нет).
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

/** ОКВЭД-коды целевого счёта. */
const OKVED = [
  "81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая;",
  "81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования;",
  "81.30 - Предоставление услуг по благоустройству ландшафта;",
];

/** Строки характеристик целевого счёта (Figma 675:64420). */
const CHAR_ROWS: AccountRow[] = [
  { label: "Наименование счета", value: "Целевой", secondary: { label: "Тип счета", value: "Матрешка" } },
  {
    label: "Коды и ОКВЭД",
    value: (
      <span className="flex flex-col gap-2">
        {OKVED.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </span>
    ),
  },
  {
    label: "Назначение счета",
    value:
      "Данный счет является основным расчетным счетом кооператива. Неделимый фонд. На него поступают все членские и целевые взносы.",
  },
  {
    label: "Источник поступлений",
    value: "Целевые и членские взносы от пайщиков. Никакие другие платежи не принимаются.",
  },
];

/** Названия подсчётов в строке распределения (порядок = distribution.subs). */
const DISTRIB_NAMES = [
  "Счет инвестиционных токенов",
  "Счет управляющих токенов",
  "Маршрутный счет",
];

/** Подсчёта целевого счёта (вкладка «Подсчета», Figma 759:70163). */
const SUBACCOUNTS = [
  { name: "Счет инвестиционных токенов", amount: "100 000 PAEV" },
  { name: "Счет управляющих токенов", amount: "100 000 PAEV" },
  { name: "Маршрутный счет", amount: "100 000 PAEV" },
];

/* ── Вкладки «Документооборот» / «Артефакты» (1:1 с demo LkDemos) ───────── */
const DOC_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип документа", flex: 2, sortable: true },
  { key: "status", label: "Статус", flex: 1.2, align: "center", sortable: true },
  { key: "verify", label: "Тип верификации", flex: 1.2, align: "center", sortable: true },
  { key: "date", label: "Дата", flex: 1, align: "right", sortable: true },
];
/** Документы целевого счёта (Figma 2504:300298 — «Устав»). */
const ACCOUNT_DOCS = [
  { type: "Устав", name: "Полный устав кооператива", status: "Не отвалидирован", badge: "Локальный", date: "28.01.2025" },
];
type AccountDoc = (typeof ACCOUNT_DOCS)[number];
const ART_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип артефакта", flex: 1, sortable: true },
  { key: "date", label: "Дата", flex: 1, align: "right", sortable: true },
];
const ARTIFACTS = [
  { type: "Документ", name: "Регламент проведения дезинфекции помещений", date: "14.02.2025" },
  { type: "Патент", name: "Способ обеззараживания помещений импульсным ультрафиолетом", date: "09.10.2023" },
];

const colStyle = (c: TableColumn): CSSProperties =>
  c.width ? { flex: `0 0 ${c.width}`, width: c.width } : { flex: c.flex ?? 1 };

function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

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

export function AccountsScreen({
  settingsHref,
  createPodschetHref,
  validationVoteHref,
  validatorChatHref,
}: {
  settingsHref?: string;
  createPodschetHref?: string;
  validationVoteHref?: string;
  validatorChatHref?: string;
}) {
  const router = useRouter();
  const flow = useRegFlow();
  useEnsureAccountsReady();
  // «Настроено» = голосование по распределению ЗАВЕРШЕНО (accountsVoteDone), а не
  // просто запущено: distribution выставляется при запуске голосования, но проценты
  // применяются к счетам только после его завершения. До этого — исходный вид
  // (0%, карта раскрыта, «Настройка счетов»). Источник: Figma 2493:283695.
  const committed = flow.accountsVoteDone ? flow.distribution : null;
  const configured = committed != null;
  const [open, setOpen] = useState(!configured); // панель характеристик раскрыта
  // Когда настроенность приходит ПОСЛЕ маунта (сид на финальном экране /прямой
  // заход) — сворачиваем карту один раз при переходе configured false→true.
  useEffect(() => {
    if (configured) setOpen(false);
  }, [configured]);
  // Активный подраздел счёта. Документооборот/Артефакты доступны только когда счёт
  // настроен (Figma 2504:300298 — после баннера табы разблокированы).
  const [subTab, setSubTab] = useState("podsc");
  // Попап «Подтвердить валидатора» (из баннера на стадиях searching/found).
  const [validatorOpen, setValidatorOpen] = useState(false);
  const stage = flow.validationStage;
  // Распределённые проценты подсчётов (после завершения голосования). Иначе 0%.
  const subPct = (i: number) => committed?.subs[i] ?? 0;
  const targetPct = committed?.target ?? 0;
  const distribRow: AccountRow = {
    label: "Распределение целевого счета и подсчетов",
    value: (
      <span className="flex flex-col gap-2">
        <span>{targetPct}% - Целевой счет</span>
        {DISTRIB_NAMES.map((name, i) => (
          <span key={name}>{subPct(i)}% - {name}</span>
        ))}
      </span>
    ),
  };
  const charRows: AccountRow[] = [...CHAR_ROWS, distribRow];
  // Подсчёта: 3 базовых (проценты из распределения) + созданные подсчёта
  // (добавляются после успешного голосования по созданию).
  const subRows = [
    ...SUBACCOUNTS.map((s, i) => ({ name: s.name, amount: s.amount, pct: subPct(i) })),
    ...flow.extraPodscheta.map((p) => ({ name: p.name, amount: "100 000 PAEV", pct: p.pct })),
  ];
  // «Настройка счета» — отдельная страница (редактор распределения %).
  const openSettings = () => settingsHref != null && router.push(settingsHref);
  // «Создать подсчет» — интро создания подсчёта.
  const openCreatePodschet = () => createPodschetHref != null && router.push(createPodschetHref);
  // Чат с валидатором (из жёлтого баннера / клика по документу при processing).
  const openValidatorChat = () => validatorChatHref != null && router.push(validatorChatHref);
  // Документ отвалидирован после работы с валидатором.
  const docValidated = stage === "validated";

  // Сортировка таблицы «Документооборот». Ключи колонок ≠ полям строки:
  // «Тип документа» показывает `type` (подпись над названием), «Статус» —
  // вычисляемое значение (после валидации подменяется на «Отвалидирован»),
  // «Тип верификации» — бейдж `badge`. Сортируем по тому, что реально видно.
  const docAccessor = useCallback(
    (d: AccountDoc, key: string) =>
      key === "status"
        ? docValidated
          ? "Отвалидирован"
          : d.status
        : key === "verify"
          ? d.badge
          : (d as unknown as Record<string, unknown>)[key],
    [docValidated],
  );
  const {
    sorted: docsSorted,
    sortKey: docSortKey,
    sortDir: docSortDir,
    onSort: onDocSort,
  } = useTableSort(ACCOUNT_DOCS, { key: "date", dir: "desc", accessor: docAccessor });

  // Сортировка таблицы «Артефакты»: ключи колонок (type/date) совпадают с полями
  // строки, accessor не нужен. По умолчанию — как в Figma: даты по убыванию.
  const {
    sorted: artifactsSorted,
    sortKey: artSortKey,
    sortDir: artSortDir,
    onSort: onArtSort,
  } = useTableSort(ARTIFACTS, { key: "date", dir: "desc" });

  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar current="accounts" />

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

        <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
          {/* Баннер «Отправка уставных документов на валидацию» — стейт-машина по
              flow.validationStage. Появляется после создания подсчёта. Источник:
              Figma 2496:290737 (idle) · 2507:298914 (voting) · 2537:305144
              (searching) · 2537:311986 (found) · 2537:312156 (processing). */}
          {flow.podschetVoteDone && (
            <>
              {stage === "idle" && (
                <Banner
                  tone="info"
                  title="Отправка уставных документов на валидацию"
                  actionLabel="Запустить голосование"
                  onAction={flow.startValidationVote}
                >
                  Перед отправкой документа на валидацию, вам необходимо зарегистрировать кооператив в государственных органах.
                </Banner>
              )}
              {stage === "voting" && (
                <Banner
                  tone="warning"
                  title="Отправка уставных документов на валидацию"
                  actionLabel="Проголосовать"
                  onAction={() => validationVoteHref != null && router.push(validationVoteHref)}
                >
                  В данный момент времени осуществляется голосование за отправку полного устава кооператива на валидацию. Пожалуйста, проголосуйте и дождитесь окончания голосования.
                </Banner>
              )}
              {stage === "searching" && (
                <div role="button" tabIndex={0} className="block w-full cursor-pointer text-left" onClick={() => setValidatorOpen(true)}>
                  <Banner tone="neutral" title="Отправка уставных документов на валидацию" loading>
                    В данный момент времени осуществляется поиск конкретного валидатора, который согласится обрабатывать ваши документы.
                  </Banner>
                </div>
              )}
              {stage === "found" && (
                <div role="button" tabIndex={0} className="block w-full cursor-pointer text-left" onClick={() => setValidatorOpen(true)}>
                  <Banner tone="warning" title="Отправка уставных документов на валидацию" actionLabel="Подтвердить валидатора" onAction={() => setValidatorOpen(true)}>
                    Найден валидатор, готовый обработать ваши документы. Подтвердите его, чтобы продолжить.
                  </Banner>
                </div>
              )}
              {stage === "processing" && (
                <Banner
                  tone="caution"
                  title="Отправка уставных документов на валидацию"
                  actionLabel="Перейти к документам"
                  onAction={openValidatorChat}
                >
                  В данный момент времени ваш документ обрабатывается валидатором, и этот процесс может занять некоторое время.
                </Banner>
              )}
              {stage === "validated" && (
                <Banner
                  tone="info"
                  title="Отправка уставных документов на  юрисдикцию"
                  actionLabel="Отправить на юрисдикцию"
                  onAction={() => {}}
                >
                  После успешной валидации документов, вам необходимо активировать кооператив и отправить пакет документов на юрисдикцию в которой вы зарегистрировали кооператив.
                </Banner>
              )}
            </>
          )}

          {/* Попап подтверждения валидатора: скелетон (searching) → готовый (found) */}
          <ValidatorModal
            open={validatorOpen}
            ready={stage === "found"}
            onClose={() => setValidatorOpen(false)}
            onConfirm={() => {
              flow.confirmValidator();
              setValidatorOpen(false);
            }}
          />

          {/* Шапка. До настройки (голосование не завершено) — исходный вид
              «Настройка счетов» / «Лицевой счет». После — «Целевой счет» слева +
              «Отчетность» справа (Figma 2493:283695, node 13:42079 / 13:27240). */}
          {configured ? (
            <div className="-mb-2 flex items-center justify-between gap-4">
              <h1 className="ds-h5 text-foreground">Целевой счет</h1>
              <Button variant="ghost" size="s">Отчетность</Button>
            </div>
          ) : (
            <>
              <h1 className="ds-p2-medium text-center text-foreground">Настройка счетов</h1>
              <h2 className="ds-h4 -mb-2 text-foreground">Лицевой счет</h2>
            </>
          )}

          {/* Карточка счёта (DS AccountCard): баланс + характеристики + футер.
              Крестик сворачивает карту до баланса с шестерёнкой; шестерёнка —
              дропдаун «Редактировать / Создать подсчет» (Figma 2496:290260),
              «Редактировать» снова раскрывает характеристики. */}
          {/* Карта + табы + контент — единая группа с gap 16px (счёт↔табы,
              табы↔плашки). */}
          <div className="flex flex-col gap-4">
            <AccountCard
              amount="1.231 ETH"
              secondaryAmount="15.88 USD"
              leftAction={<Button size="m" iconLeft={<ArrowIcon up />} className="w-[150px]">Реквизиты</Button>}
              rightAction={<Button size="m" iconLeft={<ArrowIcon />} className="w-[150px]">Перевод</Button>}
              title="Характеристики целевого счета"
              rows={charRows}
              collapsed={!open}
              onClose={() => setOpen(false)}
              menuItems={[
                { label: "Редактировать", onSelect: () => setOpen(true) },
                { label: "Создать подсчет", onSelect: openCreatePodschet },
              ]}
              editLabel="Редактировать % по распределению"
              onEdit={openSettings}
            />

            {/* Подразделы целевого счёта. Документооборот/Артефакты разблокируются,
                когда счёт настроен (configured); иначе залочены. */}
            <Tabs value={subTab} onValueChange={setSubTab} variant="basic" size="m" aria-label="Раздел счёта" className="w-full">
              <Tab value="podsc">Подсчета</Tab>
              <Tab value="doc" disabled={!configured}>Документооборот</Tab>
              <Tab value="art" disabled={!configured}>Артефакты</Tab>
            </Tabs>

            {/* Подсчёта: % распределения / название / сумма / Подробнее */}
            {subTab === "podsc" && (
              <div className="flex flex-col gap-3">
                {subRows.map((s) => (
                  <div
                    key={s.name}
                    className="ds-row flex items-center gap-4 rounded-[4px] border border-border bg-surface px-6 py-4"
                  >
                    <span className="ds-h4 shrink-0 text-primary">{s.pct} %</span>
                    <span className="ds-p3 flex-1 text-foreground">{s.name}</span>
                    <span className="ds-p3 hidden text-foreground sm:block">{s.amount}</span>
                    <Button variant="secondary" size="s">Подробнее</Button>
                  </div>
                ))}
              </div>
            )}

            {/* Документооборот: тулбар + таблица документов (reuse DS).
                Шапка таблицы (навигация) — 30px (size="s"); gap шапка↔строки 8px. */}
            {subTab === "doc" && (
              <div className="flex flex-col gap-4">
                <TableToolbar placeholder="Все шаблоны" addLabel="Добавить документ" />
                <div className="flex flex-col gap-2">
                  <TableHeader columns={DOC_COLUMNS} size="s" tone="muted" sortKey={docSortKey} sortDir={docSortDir} onSort={onDocSort} />
                  {docsSorted.map((d, i) => {
                    // Клик по документу при работе с валидатором (processing/validated)
                    // открывает окно с валидатором и чатом. Статус после валидации —
                    // «Отвалидирован».
                    const clickable = stage === "processing" || stage === "validated";
                    return (
                      <div
                        key={i}
                        role={clickable ? "button" : undefined}
                        tabIndex={clickable ? 0 : undefined}
                        onClick={clickable ? openValidatorChat : undefined}
                        className={cn(
                          "ds-row flex items-center gap-2 rounded-[4px] border border-border bg-surface px-6 py-3",
                          clickable && "cursor-pointer",
                        )}
                      >
                        <div className="flex flex-col gap-0.5" style={colStyle(DOC_COLUMNS[0])}>
                          <span className="ds-caption text-foreground-subtle">{d.type}</span>
                          <span className="ds-p3 text-foreground">{d.name}</span>
                        </div>
                        <div className="ds-p3 text-center text-foreground" style={colStyle(DOC_COLUMNS[1])}>
                          {docValidated ? "Отвалидирован" : d.status}
                        </div>
                        <div className="flex justify-center" style={colStyle(DOC_COLUMNS[2])}>
                          {d.badge && <Badge variant="solid" color="orange" className="w-[139px]">{d.badge}</Badge>}
                        </div>
                        <div className="ds-p3 text-right text-foreground" style={colStyle(DOC_COLUMNS[3])}>{d.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Артефакты: тулбар + таблица артефактов (reuse DS).
                Шапка 30px (size="s"); gap шапка↔строки 8px. */}
            {subTab === "art" && (
              <div className="flex flex-col gap-4">
                <TableToolbar placeholder="Все шаблоны артефактов" addLabel="Добавить артефакт" />
                <div className="flex flex-col gap-2">
                  <TableHeader columns={ART_COLUMNS} size="s" tone="muted" sortKey={artSortKey} sortDir={artSortDir} onSort={onArtSort} />
                  {artifactsSorted.map((a, i) => (
                    <div key={i} className="ds-row flex items-center rounded-[4px] border border-border bg-surface px-4 py-3">
                      <div className="flex flex-col gap-0.5 pr-3" style={colStyle(ART_COLUMNS[0])}>
                        <span className="ds-caption text-foreground-subtle">{a.type}</span>
                        <span className="ds-p3 text-foreground">{a.name}</span>
                      </div>
                      <div className="ds-p3 text-right text-foreground" style={colStyle(ART_COLUMNS[1])}>{a.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
