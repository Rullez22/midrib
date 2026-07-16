"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Tabs,
  Tab,
  SearchBar,
  Dropdown,
  DomainCard,
  DomainNotifications,
  Flag,
  Accordion,
  TableHeader,
  Button,
  StatCounter,
  ArticlesTable,
  Combobox,
  Datepicker,
  EmptyState,
  Link,
  Badge,
  type TableColumn,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { useTableSort } from "@/lib/use-table-sort";
import { BackHeader } from "../../document/_components/document-shared";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";
import {
  RequirementFlow,
  type Requirement,
  type RequirementSegment,
} from "./requirement-flow";
import { TemplateFlow, type TemplateDoc } from "./template-flow";

/**
 * DomainRegistersScreen — раздел «Реестры» кабинета №4 «Домены».
 * Figma: Шаблоны 6752-444409 / 6752-444396 / 6752-444801 / 6752-444364
 * (drill-down: страны → категории → регионы → таблица шаблонов),
 * шестерёнки 6752-445967 / 6752-445971, Требования 6752-446139,
 * Вознаграждения 6752-443196 (личные доходы) / 6752-443884 (доходы с партнёров).
 *
 * Reuse-first (компоненты DS, ничего не верстаем заново без нужды):
 *   • Tabs/Tab — верхние вкладки (solid-light, во всю ширину) + сегменты
 *     подвкладок (solid);
 *   • DomainCard — карточки стран/категорий/регионов (сетка), вид «мой» с
 *     шестерёнкой; Flag — флаги стран в иконке карточки;
 *   • DomainNotifications — правая панель «Уведомления»;
 *   • SearchBar — поиск + слот действий (кнопка-шестерёнка);
 *   • Dropdown — меню шестерёнок («Создать папку» / «Передать в другой домен»);
 *   • Accordion — секции «Международная / Локальная проверка»;
 *   • TableHeader (+ Button) — таблица шаблонов и «Операции»;
 *   • StatCounter — баннер «Шаблонов под вашим управлением»;
 *   • ArticlesTable — сводные таблицы вознаграждений (со строкой «Итого»);
 *   • Combobox + Datepicker — фильтр периода вознаграждений;
 *   • EmptyState — пустое состояние вкладки «Требования»;
 *   • Link — ссылки транзакций в «Операциях»;
 *   • CompanySidebar — сайдбар кабинета; BackHeader — кнопка «назад».
 *
 * Новое (точного композита нет): локальные TemplateTable (строки документов с
 * колонками Документ/Валидаторы/Активация/Просмотр + «Подробнее») и OperationsTable
 * (строки операций вознаграждения) — собраны из TableHeader/Button/Link.
 */

type TopTab = "templates" | "requirements" | "rewards";

/** Снять серую заливку с авто-подсвеченного (на открытии) пункта меню-шестерёнки;
 *  hover-подсветка сохраняется. */
const MENU_NO_FILL = "[&_.ds-combo\\_\\_option[data-active=true]]:!bg-transparent";

/** Сводная таблица вознаграждений: общий бордер-рамка + плоская шапка (без
 *  собственных скруглений/боковых рамок) с нижним сепаратором как у строк. */
const SUMMARY_TABLE =
  "overflow-hidden rounded-[4px] border border-border " +
  "[&_.ds-thead]:rounded-none [&_.ds-thead]:border-x-0 [&_.ds-thead]:border-t-0 [&_.ds-thead]:border-b [&_.ds-thead]:border-border";

/** Иконка карточки (1:1 с Figma 1898:302391): флаг — без круга (прозрачный
 *  кружок); папка/глобус — белая залитая иконка в сером круге grey-300. */
const ICON_FLAG = "[&_.ds-domain\\_\\_icon]:!bg-transparent";
const ICON_CIRCLE = "[&_.ds-domain\\_\\_icon]:!bg-[var(--color-grey-300)] [&_.ds-domain\\_\\_icon]:!text-[#fff]";

// ── Иконки ───────────────────────────────────────────────────────────────────
function GearIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85a1.9 1.9 0 0 1 .7-2.59l1.73-.99c.78-.46 1.78-.18 2.24.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.46-.78 1.46-1.06 2.24-.6l1.73.99c.91.52 1.22 1.68.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.78.46-1.78.18-2.24-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.46.78-1.46 1.06-2.24.6l-1.73-.99a1.9 1.9 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
/** Залитая папка (fill = currentColor → белая в сером круге). */
function FolderFilledIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
      <path d="M2 7a2 2 0 0 1 2-2h5.2c.5 0 1 .22 1.3.62L11.8 7H20a2 2 0 0 1 2 2v1H2V7Z" />
      <path d="M2 11h20v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden className="inline-block shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

// ── Модель дерева доменов ─────────────────────────────────────────────────────
interface DocRow {
  name: string;
  validators: number;
  activation: string;
  view: string;
}
interface DocSection {
  title: string;
  defaultOpen?: boolean;
  rows: DocRow[];
}
interface RegNode {
  id: string;
  /** Заголовок карточки и страницы. */
  title: string;
  documents: number;
  subdomains: number;
  /** «Мой» домен — синяя карточка с шестерёнкой. */
  mine?: boolean;
  /** Код флага страны (рисуется в иконке карточки). */
  flag?: string;
  /** «Все страны» — иконка-глобус. */
  world?: boolean;
  /** Вложенные карточки (следующий уровень). */
  children?: RegNode[];
  /** Лист: таблица шаблонов (заголовок «Категория – Страна» + секции). */
  table?: { title: string; sections: DocSection[] };
}

// Общая таблица шаблонов листа (Общероссийские → Удостоверяющие личность – Россия).
const ID_DOCS: DocRow[] = [
  { name: "Паспорт", validators: 3, activation: "$0.1", view: "$0.3" },
  { name: "Свидетельство о рождении", validators: 2, activation: "$0.05", view: "$0.15" },
  { name: "Дипломатический паспорт", validators: 5, activation: "$0.4", view: "$1.2" },
  { name: "Служебный паспорт", validators: 4, activation: "$0.25", view: "$0.8" },
  { name: "Водительское удостоверение", validators: 2, activation: "$0.15", view: "$0.35" },
];

/** Лист-таблица для региона/категории без вложенности. */
function leafTable(category: string, country: string): RegNode["table"] {
  return {
    title: `${category} – ${country}`,
    sections: [
      { title: "Международная проверка", defaultOpen: true, rows: ID_DOCS },
      { title: "Локальная проверка", rows: ID_DOCS.slice(0, 2) },
    ],
  };
}

/** Регионы внутри категории (Общероссийские / Москва / Санкт-Петербург). */
function regions(category: string, country: string): RegNode[] {
  return [
    { id: "all-ru", title: "Общероссийские", documents: 7, subdomains: 0, mine: true, table: leafTable(category, country) },
    { id: "msk", title: "Москва", documents: 4, subdomains: 0, mine: true, table: leafTable(category, country) },
    { id: "spb", title: "Санкт-Петербург", documents: 5, subdomains: 0, mine: true, table: leafTable(category, country) },
  ];
}

/** Категории внутри страны. */
function categories(country: string): RegNode[] {
  return [
    { id: "id", title: "Удостоверяющие личность", documents: 5, subdomains: 1, mine: true, children: regions("Удостоверяющие личность", country) },
    { id: "edu", title: "Образование", documents: 5, subdomains: 1, mine: true, table: leafTable("Образование", country) },
    { id: "med", title: "Медицина", documents: 12, subdomains: 1, mine: true, table: leafTable("Медицина", country) },
    { id: "cert", title: "Сертификаты валидаторов", documents: 12, subdomains: 1, mine: true, table: leafTable("Сертификаты валидаторов", country) },
    { id: "civil", title: "Общегражданские", documents: 1, subdomains: 1, mine: true, table: leafTable("Общегражданские", country) },
    { id: "forms", title: "Формы компаний", documents: 1, subdomains: 0, table: leafTable("Формы компаний", country) },
  ];
}

const COUNTRIES: RegNode[] = [
  { id: "all", title: "Все страны", documents: 214, subdomains: 8, world: true, children: [] },
  { id: "ru", title: "Россия", documents: 36, subdomains: 6, mine: true, flag: "ru", children: categories("Россия") },
  { id: "at", title: "Австрия", documents: 12, subdomains: 3, mine: true, flag: "at", children: categories("Австрия") },
  { id: "be", title: "Бельгия", documents: 9, subdomains: 2, mine: true, flag: "be", children: categories("Бельгия") },
  { id: "bg", title: "Болгария", documents: 14, subdomains: 3, mine: true, flag: "bg", children: categories("Болгария") },
  { id: "hu", title: "Венгрия", documents: 7, subdomains: 2, mine: true, flag: "hu", children: categories("Венгрия") },
  { id: "gr", title: "Греция", documents: 11, subdomains: 2, mine: true, flag: "gr", children: categories("Греция") },
  { id: "de", title: "Германия", documents: 28, subdomains: 5, mine: true, flag: "de", children: categories("Германия") },
  { id: "gb", title: "Великобритания", documents: 23, subdomains: 4, mine: true, flag: "gb", children: categories("Великобритания") },
];

const ROOT: RegNode = { id: "root", title: "Midhub Global", documents: 0, subdomains: 0, children: COUNTRIES };

// ── Шаблоны: лист-таблица документов ──────────────────────────────────────────
const TEMPLATE_COLUMNS: TableColumn[] = [
  { key: "name", label: "Документ", flex: 2, sortable: true },
  { key: "validators", label: "Валидаторы", align: "center", sortable: true },
  { key: "activation", label: "Активация", align: "center", sortable: true },
  { key: "view", label: "Просмотр", align: "center", sortable: true },
  { key: "action", label: "", width: "120px" },
];

function TemplateRow({ row }: { row: DocRow }) {
  return (
    <div className="ds-row flex items-center gap-2 rounded-[4px] border border-border bg-[#fff] px-4 py-4">
      <span className="ds-p3 flex-[2] text-foreground">{row.name}</span>
      <span className="ds-p3 flex-1 text-center text-foreground">{row.validators}</span>
      <span className="ds-p3 flex-1 text-center text-foreground">{row.activation}</span>
      <span className="ds-p3 flex-1 text-center text-foreground">{row.view}</span>
      <span className="flex w-[120px] shrink-0 justify-end">
        <Button variant="secondary" size="s">Подробнее</Button>
      </span>
    </div>
  );
}

/** Строка-шаблон (созданный пользователем): имя + 0 валидаторов + $0/$0 +
 *  «Подробнее». На голосовании — оранжевая рамка. */
function TemplateDocRow({ tpl, onOpen }: { tpl: TemplateDoc; onOpen: () => void }) {
  return (
    <div
      className={cn(
        "ds-row flex items-center gap-2 rounded-[4px] border bg-[#fff] px-4 py-4",
        tpl.status === "voting" ? "border-[var(--color-orange-300)]" : "border-border",
      )}
    >
      <span className="ds-p3 flex-[2] text-foreground">{tpl.name}</span>
      <span className="ds-p3 flex-1 text-center text-foreground">0</span>
      <span className="ds-p3 flex-1 text-center text-foreground">$0</span>
      <span className="ds-p3 flex-1 text-center text-foreground">$0</span>
      <span className="flex w-[120px] shrink-0 justify-end">
        <Button variant="secondary" size="s" onClick={onOpen}>Подробнее</Button>
      </span>
    </div>
  );
}

/** Строка таблицы шаблонов: документ каталога либо созданный пользователем шаблон. */
type TplEntry = { row: "doc"; r: DocRow } | { row: "mine"; t: TemplateDoc };

function TemplateSection({
  section,
  templates = [],
  onOpenTemplate,
}: {
  section: DocSection;
  templates?: TemplateDoc[];
  onOpenTemplate?: (tpl: TemplateDoc) => void;
}) {
  // Каталог и «мои» шаблоны — под одной шапкой, сортируются как одна таблица.
  // По умолчанию порядок исходный: сначала каталог, затем созданные шаблоны.
  const rows: TplEntry[] = [
    ...section.rows.map((r) => ({ row: "doc" as const, r })),
    ...templates.map((t) => ({ row: "mine" as const, t })),
  ];
  const { sorted, sortKey, sortDir, onSort } = useTableSort(rows, {
    // У созданных шаблонов колонки-заглушки (0 валидаторов, $0/$0) — их и сортируем.
    accessor: (x, k) => {
      if (x.row === "doc") return x.r[k as keyof DocRow];
      if (k === "name") return x.t.name;
      if (k === "validators") return 0;
      if (k === "activation" || k === "view") return "$0";
      return undefined;
    },
  });

  return (
    <Accordion title={section.title} size="m" defaultOpen={section.defaultOpen || templates.length > 0}>
      <div className="flex flex-col gap-3 pt-2">
        <TableHeader columns={TEMPLATE_COLUMNS} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        {/* key по сортировке — при перестройке строк каскад играет заново. */}
        <div key={`${sortKey}-${sortDir}`} className="ds-content--stagger flex flex-col gap-3">
          {sorted.map((x) =>
            x.row === "doc" ? (
              <TemplateRow key={`doc-${x.r.name}`} row={x.r} />
            ) : (
              <TemplateDocRow key={x.t.id} tpl={x.t} onOpen={() => onOpenTemplate?.(x.t)} />
            ),
          )}
        </div>
      </div>
    </Accordion>
  );
}

/** Лист «Шаблоны»: назад + (плашка голосования) + заголовок + «Создать шаблон» +
 *  поиск + секции-таблицы (созданные шаблоны попадают в «Локальную проверку»). */
function TemplateLeaf({
  node,
  onBack,
  templates,
  onCreateTemplate,
  onOpenTemplate,
}: {
  node: RegNode;
  onBack: () => void;
  templates: TemplateDoc[];
  onCreateTemplate: (leafTitle: string) => void;
  onOpenTemplate: (tpl: TemplateDoc) => void;
}) {
  const [query, setQuery] = useState("");
  const table = node.table!;
  const mine = templates.filter((t) => t.leafTitle === table.title);
  const pending = mine.filter((t) => t.status === "voting");

  return (
    <div className="flex w-full flex-col gap-6">
      <BackHeader onBack={onBack} />

      {/* Плашки шаблонов на голосовании (Figma 6752-447014) — 80px до заголовка */}
      {pending.length > 0 && (
        <div className="mb-14 flex flex-col gap-4">
          <h2 className="ds-h5 text-foreground">Голосование</h2>
          {pending.map((t) => (
            <div
              key={t.id}
              className="ds-row flex items-center gap-4 rounded-[4px] border border-[var(--color-orange-300)] bg-[#fff] px-6 py-4"
            >
              <span className="ds-p3 flex-1 text-foreground">{t.name}</span>
              <span className="ds-p3 text-foreground-subtle">На голосовании</span>
              <Button variant="secondary" size="m" onClick={() => onOpenTemplate(t)}>Подробнее</Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="ds-h5 text-foreground">{table.title}</h1>
        <Button variant="primary" size="l" onClick={() => onCreateTemplate(table.title)}>Создать шаблон</Button>
      </div>
      <SearchBar
        size="l"
        placeholder="Поиск по названию, тегам и т.д."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        {table.sections.map((s, i) => (
          <TemplateSection
            key={i}
            section={s}
            templates={s.title === "Локальная проверка" ? mine : []}
            onOpenTemplate={onOpenTemplate}
          />
        ))}
      </div>
    </div>
  );
}

/** Сетка карточек уровня (страны / категории / регионы) + панель «Уведомления». */
function TemplateGrid({
  node,
  depth,
  onOpen,
  onBack,
}: {
  node: RegNode;
  depth: number;
  onOpen: (child: RegNode) => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState("");
  const cards = (node.children ?? []).filter((c) =>
    c.title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className="flex w-full flex-col gap-6">
      {depth > 0 && <BackHeader onBack={onBack} />}
      <h1 className="ds-h5 text-foreground">{node.title}</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <SearchBar
            size="l"
            placeholder="Поиск по названию, тегам и т.д."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            actions={
              <Dropdown
                align="end"
                aria-label="Настройки реестра"
                className={MENU_NO_FILL}
                items={[{ value: "folder", label: "Создать папку" }]}
                trigger={() => (
                  <span className="flex size-12 items-center justify-center rounded-[4px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground">
                    <GearIcon />
                  </span>
                )}
              />
            }
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((c) => (
              <div key={c.id} className="relative">
                <DomainCard
                  className={c.flag ? ICON_FLAG : ICON_CIRCLE}
                  mine={c.mine}
                  title={c.title}
                  documentsCount={c.documents}
                  subdomainsCount={c.subdomains}
                  icon={c.flag ? <Flag code={c.flag} width={28} /> : c.world ? <GlobeIcon /> : <FolderFilledIcon />}
                  onClick={() => onOpen(c)}
                />
                {c.mine && (
                  <div className="absolute right-3 top-3 z-10" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      align="end"
                      aria-label="Действия с доменом"
                      className={MENU_NO_FILL}
                      items={[{ value: "transfer", label: "Передать в другой домен" }]}
                      trigger={() => (
                        <span className="flex size-4 items-center justify-center text-[var(--color-blue-midhub-500)] transition-colors hover:text-[var(--color-blue-midhub-800)]">
                          <GearIcon size={16} />
                        </span>
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DomainNotifications className="lg:h-[596px] lg:w-[277px] lg:shrink-0" />
      </div>
    </div>
  );
}

/** Вкладка «Шаблоны» — drill-down по дереву доменов. */
function TemplatesTab({
  templates,
  onCreateTemplate,
  onOpenTemplate,
  stack,
  setStack,
}: {
  templates: TemplateDoc[];
  onCreateTemplate: (leafTitle: string) => void;
  onOpenTemplate: (tpl: TemplateDoc) => void;
  /** Стек drill-down поднят в родителя — чтобы переживать открытие флоу. */
  stack: RegNode[];
  setStack: Dispatch<SetStateAction<RegNode[]>>;
}) {
  const current = stack[stack.length - 1];
  const open = (child: RegNode) => setStack((s) => [...s, child]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  if (current.table) {
    return (
      <TemplateLeaf
        node={current}
        onBack={back}
        templates={templates}
        onCreateTemplate={onCreateTemplate}
        onOpenTemplate={onOpenTemplate}
      />
    );
  }
  return <TemplateGrid node={current} depth={stack.length - 1} onOpen={open} onBack={back} />;
}

// ── Вкладка «Требования» ──────────────────────────────────────────────────────
const REQ_COLUMNS: TableColumn[] = [
  { key: "name", label: "Название", flex: 2 },
  { key: "domain", label: "Домен", flex: 2, sortable: true },
  { key: "type", label: "Тип", width: "120px", align: "right", sortable: true },
];

function ReqLevelBadge({ level }: { level: "green" | "yellow" }) {
  return level === "green" ? (
    <Badge variant="solid" color="green">Зелёный</Badge>
  ) : (
    <Badge variant="solid" color="orange">Жёлтый</Badge>
  );
}

function RequirementsTab({
  requirements,
  onCreate,
  onOpen,
}: {
  requirements: Requirement[];
  onCreate: (segment: RequirementSegment) => void;
  onOpen: (req: Requirement) => void;
}) {
  const [seg, setSeg] = useState<RequirementSegment>("docs");
  const rows = requirements.filter((r) => r.segment === seg);
  const pending = rows.filter((r) => r.status === "voting");

  // Колонка «Тип» показывает бейдж уровня — сортируем по видимой подписи
  // («Жёлтый» / «Зелёный»), а не по коду level.
  const { sorted, sortKey, sortDir, onSort } = useTableSort(rows, {
    accessor: (r, k) => (k === "type" ? (r.level === "green" ? "Зелёный" : "Жёлтый") : r[k as keyof Requirement]),
  });

  return (
    <div className="flex w-full flex-col gap-8">
      <Tabs
        value={seg}
        onValueChange={(v) => setSeg(v as RequirementSegment)}
        variant="solid"
        size="m"
        equal
        aria-label="Тип требований"
        className="mx-auto w-[440px] max-w-full"
      >
        <Tab value="docs">Для документов</Tab>
        <Tab value="plots">Для участков</Tab>
        <Tab value="roles">Для ролей</Tab>
      </Tabs>

      {/* Плашки требований на голосовании (Figma 6752-446119) — клик «Подробнее»
          возвращает к незавершённому голосованию. */}
      {pending.map((r) => (
        <div
          key={r.id}
          className="ds-row flex items-center gap-4 rounded-[4px] border border-[var(--color-orange-300)] bg-[#fff] px-6 py-4"
        >
          <span className="ds-p3 flex-1 text-foreground">{r.name}</span>
          <span className="ds-p3 text-foreground-subtle">На голосовании</span>
          <Button variant="secondary" size="m" onClick={() => onOpen(r)}>Подробнее</Button>
        </div>
      ))}

      {rows.length === 0 ? (
        <EmptyState title="" className="py-4" action={<Button size="l" onClick={() => onCreate(seg)}>Создать требования</Button>} />
      ) : (
        <div className="flex flex-col gap-6">
          <Button variant="secondary" size="l" className="self-end" onClick={() => onCreate(seg)}>Создать требования</Button>
          <div className="flex flex-col gap-3">
            <TableHeader columns={REQ_COLUMNS} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            {sorted.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onOpen(r)}
                className="ds-row flex w-full items-center gap-2 rounded-[4px] border border-border bg-[#fff] px-6 py-4 text-left transition-colors"
              >
                <span className="ds-p3 flex-[2] text-foreground">{r.name}</span>
                <span className="ds-p3 flex-[2] text-foreground-muted">{r.domain}</span>
                <span className="flex w-[120px] shrink-0 justify-end"><ReqLevelBadge level={r.level} /></span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Вкладка «Вознаграждения» ──────────────────────────────────────────────────
interface OpRow {
  category: string;
  name: string;
  reward: string;
  tx: string;
  date: string;
}
const OP_ROWS: OpRow[] = [
  { category: "Счет на оплату", name: "Счёт-фактура за консультационные услуги", reward: "3 400 ₽", tx: "5c243af... 07db8", date: "03.06.2025 - 15:00" },
  { category: "Договор", name: "Договор на техническое обслуживание", reward: "8 400 ₽", tx: "5c243af... 07db8", date: "19.05.2025 - 12:10" },
  { category: "Акт выполненных работ", name: "Акт приёмки выполненных работ", reward: "1 750 ₽", tx: "5c243af... 07db8", date: "22.04.2025 - 09:40" },
];

const OP_COLUMNS: TableColumn[] = [
  { key: "name", label: "Наименование документа", flex: 2, sortable: true },
  { key: "reward", label: "Вознаграждение", flex: 1, sortable: true },
  { key: "tx", label: "Номер транзакции", flex: 1, align: "center" },
  { key: "date", label: "Дата обработки", flex: 1, align: "right", sortable: true },
];

/** Таблица «Операции» (одинакова для обоих подвкладок вознаграждений).
 *  Формат даты «03.06.2025 - 15:00» разбирает сам хук (useTableSort → asDate). */
function OperationsTable() {
  const { sorted, sortKey, sortDir, onSort } = useTableSort(OP_ROWS, {
    key: "date",
    dir: "desc",
  });

  return (
    <div className="flex flex-col gap-5">
      <h2 className="ds-h5 text-foreground">Операции</h2>
      <div className="flex flex-col gap-3">
        <TableHeader columns={OP_COLUMNS} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        {sorted.map((r, i) => (
          <div key={i} className="ds-row flex items-center gap-2 rounded-[4px] border border-border bg-[#fff] px-6 py-4">
            <span className="flex flex-[2] flex-col">
              <span className="ds-caption text-foreground-subtle">{r.category}</span>
              <span className="ds-p3 text-foreground">{r.name}</span>
            </span>
            <span className="ds-p3 flex-1 text-foreground">{r.reward}</span>
            <span className="flex flex-1 items-center justify-center gap-1.5 text-[var(--color-blue-midhub-500)]">
              <Link href="#" size="p3" onClick={(e) => e.preventDefault()}>{r.tx}</Link>
              <InfoIcon />
            </span>
            <span className="ds-p3 flex-1 text-right text-foreground">{r.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Фильтр периода вознаграждений: Combobox + два Datepicker + «Показать». */
function RewardFilter({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  const [from, setFrom] = useState<Date | null>(new Date(2025, 0, 1));
  const [to, setTo] = useState<Date | null>(new Date(2025, 5, 30));
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
      <Combobox options={options} value={value} onValueChange={onChange} size="l" className="w-full lg:flex-1" />
      <div className="flex items-center gap-3 lg:flex-1">
        <span className="ds-p2 shrink-0 text-foreground-subtle">с</span>
        <Datepicker size="l" value={from} onChange={setFrom} className="min-w-0 flex-1" />
        <span className="ds-p2 shrink-0 text-foreground-subtle">по</span>
        <Datepicker size="l" value={to} onChange={setTo} className="min-w-0 flex-1" />
        <Button size="l" className="shrink-0">Показать</Button>
      </div>
    </div>
  );
}

const PERSONAL_COLUMNS: TableColumn[] = [
  { key: "doc", label: "Документ", flex: 2 },
  { key: "count", label: "Ко-во транзакций", flex: 1, align: "right" },
  { key: "income", label: "Ваш доход", flex: 1, align: "right" },
];
const PARTNER_COLUMNS: TableColumn[] = [
  { key: "level", label: "Уровень", width: "90px" },
  { key: "domain", label: "Наименование домена", flex: 2 },
  { key: "profit", label: "Доходность", flex: 1, align: "right" },
  { key: "percent", label: "Ваш %", flex: 1, align: "right" },
  { key: "income", label: "Ваш доход", flex: 1, align: "right" },
];

function RewardsTab() {
  const [seg, setSeg] = useState("personal");
  const [scope, setScope] = useState("all");
  const personal = seg === "personal";
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Сегмент подвкладок + ссылка «Подробнее о вознаграждении» */}
      <div className="relative flex items-center justify-center">
        <Tabs
          value={seg}
          onValueChange={(v) => { setSeg(v); setScope("all"); }}
          variant="solid"
          size="m"
          equal
          aria-label="Тип вознаграждений"
          className="w-[380px] max-w-full"
        >
          <Tab value="personal">Личные доходы</Tab>
          <Tab value="partners">Доходы с партнеров</Tab>
        </Tabs>
        <Link href="#" size="p3" onClick={(e) => e.preventDefault()} className="absolute right-0 hidden items-center gap-1.5 lg:flex">
          Подробнее о вознаграждении <InfoIcon />
        </Link>
      </div>

      <StatCounter
        size="lg"
        label={personal ? "Шаблонов под вашим управлением" : "Шаблонов под вашим управлением вашей структуры"}
        value={personal ? 6 : 10}
      />

      {personal ? (
        <RewardFilter
          options={[{ value: "all", label: "Выбраны все шаблоны" }, { value: "contracts", label: "Договоры" }, { value: "invoices", label: "Счета на оплату" }]}
          value={scope}
          onChange={setScope}
        />
      ) : (
        <RewardFilter
          options={[{ value: "all", label: "Все уровни партнеров" }, { value: "1", label: "1 уровень" }, { value: "2", label: "2 уровень" }]}
          value={scope}
          onChange={setScope}
        />
      )}

      {personal ? (
        <ArticlesTable
          className={SUMMARY_TABLE}
          columns={PERSONAL_COLUMNS}
          rows={[
            { cells: ["Договор", "1472", "1706.42341  ETH"] },
            { cells: ["Счет на оплату", "142", "1722.42241  ETH"] },
            { cells: ["Акт выполненных работ", "213", "26.441  ETH"] },
          ]}
          total={{ label: "Итого", cells: ["1827", "3455.28682 ETH"] }}
        />
      ) : (
        <ArticlesTable
          className={SUMMARY_TABLE}
          columns={PARTNER_COLUMNS}
          rows={[
            { cells: ["1", "Медицинские сервисы", "3462.76  ETH", "50 %", "1731.38  ETH"] },
            { cells: ["1", "Банк", "1841.09  ETH", "25 %", "460.27  ETH"] },
            { cells: ["2", "Визовый центр", "720.35  ETH", "50 %", "360.18  ETH"] },
          ]}
          total={{ label: "Итого", cells: ["", "6024.20 ETH", "125 %", "2551.83 ETH"] }}
        />
      )}

      <OperationsTable />
    </div>
  );
}

/** Открытый флоу требования: создание (segment) или деталь/редактирование (id). */
type ReqFlowState = { mode: "create"; segment: RequirementSegment } | { mode: "open"; id: string };
/** Открытый флоу шаблона: создание (в листе) или просмотр (id). */
type TplFlowState = { mode: "create"; leafTitle: string } | { mode: "open"; id: string };

export function DomainRegistersScreen({ cabinet, current }: { cabinet: CabinetConfig; current: string }) {
  const [tab, setTab] = useState<TopTab>("templates");
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [reqFlow, setReqFlow] = useState<ReqFlowState | null>(null);
  const [templates, setTemplates] = useState<TemplateDoc[]>([]);
  const [tplFlow, setTplFlow] = useState<TplFlowState | null>(null);
  // Стек drill-down «Шаблонов» живёт здесь, чтобы переживать открытие флоу шаблона.
  const [templateStack, setTemplateStack] = useState<RegNode[]>([ROOT]);

  // Флоу шаблона — полноэкранный визард (без сайдбара), поверх вкладок.
  if (tplFlow) {
    const initial = tplFlow.mode === "open" ? templates.find((t) => t.id === tplFlow.id) : undefined;
    const leafTitle = tplFlow.mode === "create" ? tplFlow.leafTitle : initial?.leafTitle ?? "";
    return (
      <TemplateFlow
        leafTitle={leafTitle}
        initial={initial}
        onClose={() => setTplFlow(null)}
        onCommit={(tpl) => setTemplates((prev) => (prev.some((t) => t.id === tpl.id) ? prev : [tpl, ...prev]))}
        onUpdate={(tpl) => setTemplates((prev) => prev.map((t) => (t.id === tpl.id ? tpl : t)))}
      />
    );
  }

  // Флоу требования занимает весь экран (свой сайдбар) — поверх вкладок.
  if (reqFlow) {
    const initial = reqFlow.mode === "open" ? requirements.find((r) => r.id === reqFlow.id) : undefined;
    const segment = reqFlow.mode === "create" ? reqFlow.segment : initial?.segment ?? "docs";
    return (
      <RequirementFlow
        cabinet={cabinet}
        current={current}
        segment={segment}
        initial={initial}
        onClose={() => setReqFlow(null)}
        onCommit={(req) => setRequirements((prev) => (prev.some((r) => r.id === req.id) ? prev : [req, ...prev]))}
        onUpdate={(req) => setRequirements((prev) => prev.map((r) => (r.id === req.id ? req : r)))}
        onDelete={(id) => {
          setRequirements((prev) => prev.filter((r) => r.id !== id));
          setReqFlow(null);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TopTab)}
          variant="solid-light"
          size="l"
          equal
          aria-label="Реестры"
          className="w-full rounded-none border-x-0 border-t-0 [grid-auto-columns:minmax(0,1fr)]"
        >
          <Tab value="templates">Шаблоны</Tab>
          <Tab value="requirements">Требования</Tab>
          <Tab value="rewards">Вознаграждения</Tab>
        </Tabs>

        <div className={cn("flex w-full flex-col px-5 py-8 md:px-[50px]")}>
          {tab === "templates" && (
            <TemplatesTab
              templates={templates}
              onCreateTemplate={(leafTitle) => setTplFlow({ mode: "create", leafTitle })}
              onOpenTemplate={(tpl) => setTplFlow({ mode: "open", id: tpl.id })}
              stack={templateStack}
              setStack={setTemplateStack}
            />
          )}
          {tab === "requirements" && (
            <RequirementsTab
              requirements={requirements}
              onCreate={(segment) => setReqFlow({ mode: "create", segment })}
              onOpen={(req) => setReqFlow({ mode: "open", id: req.id })}
            />
          )}
          {tab === "rewards" && <RewardsTab />}
        </div>
      </main>
    </div>
  );
}
