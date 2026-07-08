"use client";

import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  ProgressRing,
  Checkbox,
  DistributionRow,
  Input,
  Button,
  Tabs,
  Tab,
  Link,
  Pagination,
  Tooltip,
} from "@/components/ds";

/**
 * Общие части экранов платежей (Разовый/Стабильный/Массовое подключение)
 * раздела «Кооператив». Вынесено, чтобы не дублировать вёрстку между
 * /cabinet/payment/once · /stable и /cabinet/account/marketing/connect/mass.
 */

export const DOCS = [{ name: "Договор №1" }, { name: "Договор №2" }, { name: "Договор №3" }];

/* ── Образцовые данные получателей (общие для всех флоу выбора пайщиков) ───── */
export const ADDR = "5c243af…07db8";
export const FULL_ADDR = "0x5c243af6b9e8d1c4a7f20e3b5d8c1a9f4e7b07db8";
export const PRIVATE = ["Илья Антонов", "Андрей Андреев", "Олег Олегов", "Валерий Варламов", "Николай Николаев"];
export const LEGAL = [
  { name: "Компания 1", id: "3323" },
  { name: "Компания 2", id: "2323123" },
  { name: "Компания 3", id: "848494" },
  { name: "Компания 4", id: "9823882" },
  { name: "Компания 5", id: "7363" },
];

/* ── Базовые показатели пул-счёта (для «Массового подключения») ───────────── */
export const BASE_SHARES = 4; // всего долей в счёт-пуле сейчас
export const BASE_PAISHIKI = 1; // всего пайщиков в счёт-пуле сейчас (массовое)
// «Персональное подключение»: пайщик уже в пуле, кол-во пайщиков не растёт.
export const BASE_PERSONAL_PAISHIKI = 2;

/* ── Иконки ─────────────────────────────────────────────────────────────── */
export function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function CaretIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5 text-foreground-subtle">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

/* ── Хелперы вёрстки ────────────────────────────────────────────────────── */
export function SectionTitle({ children, noRule }: { children: ReactNode; noRule?: boolean }) {
  // Заголовок → gap 8px → разделитель на всю ширину. Отступ 16px до контента
  // даёт родительский контейнер (`flex flex-col gap-4`). `noRule` — без линии.
  return (
    <div className="flex flex-col gap-2">
      <span className="ds-p2-medium text-foreground">{children}</span>
      {!noRule && <span className="h-px w-full bg-border" />}
    </div>
  );
}
export function ReadField({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="ds-caption text-foreground-subtle">{label}</span>
      <span className="ds-p2 text-foreground">{value}</span>
    </div>
  );
}
export function BalancePill({ label = "Целевой счет" }: { label?: string }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 rounded-[4px] bg-[#e6f6e7] px-3 py-1.5">
      <span className="ds-caption-medium text-[#54be5a]">Баланс «{label}»:</span>
      <span className="ds-p3-medium text-[#54be5a]">0.1234 ETH (15.88 USD)</span>
    </div>
  );
}
export function Th({ children, style, right, center }: { children: ReactNode; style: CSSProperties; right?: boolean; center?: boolean }) {
  return (
    <button type="button" className={cn("flex items-center gap-1", right && "justify-end", center && "justify-center")} style={style}>
      <span className="ds-caption-medium text-foreground-subtle">{children}</span>
      <CaretIcon />
    </button>
  );
}

export function PageHeader({ title, onBack, children }: { title: ReactNode; onBack: () => void; children?: ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
      <button
        type="button"
        aria-label="Назад"
        onClick={onBack}
        className="flex size-10 items-center justify-center rounded-[4px] border border-border bg-surface-sunken text-foreground-subtle"
      >
        <BackIcon />
      </button>
      <h1 className="ds-h5 text-center text-foreground">{title}</h1>
      <div className="justify-self-end">{children ?? <BalancePill />}</div>
    </div>
  );
}

/* ── Таблица «Основание» (мультивыбор / read-only) ──────────────────────── */
/* Навигационная шапка строк — серая плашка bg-[#f9fafc] + Th с каретами,
 * select-all чекбоксом и статусом по центру. Единый DS-вид для once/stable. */
export function DocTable({
  mode,
  selected,
  onToggle,
  onToggleAll,
}: {
  mode: "select" | "readonly";
  selected: Set<number>;
  onToggle?: (i: number) => void;
  onToggleAll?: () => void;
}) {
  const rows = mode === "readonly" ? DOCS.map((d, i) => ({ d, i })).filter((r) => selected.has(r.i)) : DOCS.map((d, i) => ({ d, i }));
  const allChecked = selected.size === DOCS.length;
  const someChecked = selected.size > 0 && !allChecked;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 rounded-[4px] bg-[#f9fafc] px-4 py-2">
        {mode === "select" && (
          <Checkbox size="xs" checked={allChecked} indeterminate={someChecked} onChange={onToggleAll} aria-label="Выбрать все" />
        )}
        <Th style={{ flex: 2 }}>Тип документа</Th>
        <Th style={{ flex: 1 }} center>Статус</Th>
        <Th style={{ flex: 1 }} right>Дата</Th>
      </div>
      {rows.map(({ d, i }) => {
        const inner: ReactNode = (
          <>
            <div className="flex flex-col gap-0.5" style={{ flex: 2 }}>
              <span className="ds-caption text-foreground-subtle">Договор</span>
              <span className="ds-p3 text-foreground">{d.name}</span>
            </div>
            <div className="flex justify-center" style={{ flex: 1 }}>
              <span className="inline-flex items-center rounded-[4px] bg-[#e6f6e7] px-3 py-1.5 ds-caption-medium text-[#54be5a]">Согласован</span>
            </div>
            <div className="ds-p3 text-right text-foreground" style={{ flex: 1 }}>09.01.2020</div>
          </>
        );
        return mode === "select" ? (
          <label key={i} className="flex cursor-pointer items-center gap-3 rounded-[4px] border border-border bg-surface px-4 py-3">
            <Checkbox size="xs" checked={selected.has(i)} onChange={() => onToggle?.(i)} />
            {inner}
          </label>
        ) : (
          <div key={i} className="flex items-center gap-3 rounded-[4px] border border-border bg-surface px-4 py-3">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/* ── Сводная таблица пул-счёта (Тип счёта / Источник / Кол-во / Доли) ─────── */
/* Read-only бордерная таблица «label слева — value справа». Источник Figma
 * 2649:360975. Используется экраном «Массовое подключение» и его вопросом. */
export function PoolSummaryTable({ paishiki, shares }: { paishiki: number; shares: number }) {
  const rows: [string, ReactNode][] = [
    ["Тип счета", "Пул-счет"],
    ["Источник поступлений", "Целевой счет"],
    ["Количество пайщиков", paishiki],
    ["Всего долей в счет-пуле", shares],
  ];
  return (
    <div className="overflow-hidden rounded-[4px] border border-border">
      {rows.map(([label, value], i) => (
        <div key={i} className={cn("flex items-center gap-4 px-6 py-3.5", i < rows.length - 1 && "border-b border-border")}>
          <span className="ds-p3 w-[200px] shrink-0 text-foreground-subtle">{label}</span>
          <span className="ds-p3 text-foreground">{value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Иконки строки поиска / переноса для shuttle выбора пайщиков ──────────── */
function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M5 4h9M5 8h9M5 12h9M2 4h.01M2 8h.01M2 12h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 8h12M8 2c1.8 1.6 2.8 3.8 2.8 6S9.8 12.4 8 14M8 2C6.2 3.6 5.2 5.8 5.2 8S6.2 12.4 8 14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-foreground-subtle">
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function ArrowMove() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5 text-foreground-subtle">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Панель shuttle (карточка с белым фоном и бордером) ──────────────────── */
function Pane({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[387px] min-w-0 flex-1 flex-col overflow-hidden rounded-[4px] border border-border bg-white">
      {children}
    </div>
  );
}
/* Шапка панели (Имя · Адрес/ID · Страна) — 3 равные колонки, опц. select-all. */
function PaneHeader({ addressLabel, checkbox }: { addressLabel: string; checkbox?: ReactNode }) {
  return (
    <div className="flex items-center gap-4 border-b border-border bg-[#f9fafc] px-[20px] py-[5px]">
      <div className="flex flex-1 items-center gap-4">
        {checkbox}
        <Th style={{}}>Имя</Th>
      </div>
      <Th style={{ flex: 1 }} center>{addressLabel}</Th>
      <Th style={{ flex: 1 }} right>Страна</Th>
    </div>
  );
}
/* Строка пайщика (имя · адрес/ID · страна) — 3 равные колонки. */
function PaishikRow({ name, mid, leading }: { name: string; mid: string; leading?: ReactNode }) {
  return (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {leading}
        <span className="ds-p3 min-w-0 truncate text-foreground">{name}</span>
      </div>
      <span className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5">
        <Link href="#" size="p3">{mid}</Link>
        <Tooltip content={<span className="break-all">{FULL_ADDR}</span>} side="top" caption>
          <span className="inline-flex cursor-help"><InfoIcon /></span>
        </Tooltip>
      </span>
      <span className="ds-p3 flex-1 text-right text-foreground">ENG</span>
    </>
  );
}

/* ── «Выбор пайщиков»: двухпанельный shuttle (доступные → выбранные) ──────── */
/* Единый блок для «Разового платежа» и «Массового подключения» (Figma
 * 2655:429918 / 2653:357673). Чек в левой таблице переносит строку вправо; снятие
 * чека в правой возвращает обратно. Заголовок секции — снаружи (SectionTitle). */
export function PaishikShuttle({
  tab,
  onTabChange,
  sel,
  onToggleSel,
  onToggleSelAll,
  count,
  page,
  onPageChange,
  privateNames,
  hideChrome = false,
}: {
  tab: "private" | "legal";
  onTabChange: (t: "private" | "legal") => void;
  sel: Set<number>;
  onToggleSel: (i: number) => void;
  onToggleSelAll: () => void;
  count: number;
  page: number;
  onPageChange: (p: number) => void;
  /** Список частных пайщиков (по умолчанию мок PRIVATE). Для таба «Совет» —
   *  динамические кандидаты согласования из RegFlow. */
  privateNames?: string[];
  /** Спрятать встроенный header (поиск + «Отмечено» + пагинацию панелей),
   *  чтобы обёртка выдала своё chrome (например, таб «Согласование совета»
   *  использует тот же searchRow + Toolbar, что и остальные табы панели). */
  hideChrome?: boolean;
}) {
  const priv = privateNames ?? PRIVATE;
  const list = tab === "private" ? priv.map((name) => ({ name, mid: ADDR })) : LEGAL.map((r) => ({ name: r.name, mid: r.id }));
  const available = list.map((r, i) => ({ ...r, i })).filter((r) => !sel.has(r.i));
  const selected = list.map((r, i) => ({ ...r, i })).filter((r) => sel.has(r.i));
  const allSelected = list.length > 0 && sel.size === list.length;
  const addressLabel = tab === "private" ? "Адрес" : "ID";

  return (
    <>
      {!hideChrome && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[200px] flex-1"><Input size="m" placeholder="Поиск" leftIcon={<SearchIcon />} /></div>
            <Button variant="ghost" size="m" iconLeft={<ListIcon />}>Список</Button>
            <Button variant="ghost" size="m" iconLeft={<GlobeIcon />}>Страны</Button>
          </div>
          <div className="flex items-center justify-between rounded-[4px] border border-border bg-[#f3f6f9] px-4 py-2">
            <span className="ds-caption flex-1 text-center text-[#5a646e]">Отмечено: {count}</span>
            <button type="button" aria-label="Меню" className="text-[#5a646e]">⋮</button>
          </div>
        </>
      )}
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as "private" | "legal")} variant="basic" size="m" aria-label="Тип получателя" className="w-full">
        <Tab value="private">Частные пайщики</Tab>
        <Tab value="legal">Юридическое лицо</Tab>
      </Tabs>

      <div className="flex flex-col gap-[3px] lg:flex-row lg:items-stretch">
        {/* доступные — единая карточка с шапкой/разделителями/пагинацией */}
        <Pane>
          <PaneHeader
            addressLabel={addressLabel}
            checkbox={<Checkbox size="xs" checked={allSelected} indeterminate={sel.size > 0 && !allSelected} onChange={onToggleSelAll} aria-label="Выбрать все" />}
          />
          <div className="flex-1 pt-4">
            {available.map((r) => (
              <div key={r.i} className="mb-4">
                <label className="flex cursor-pointer items-center gap-4 px-[20px]">
                  <PaishikRow leading={<Checkbox size="xs" checked={false} onChange={() => onToggleSel(r.i)} />} name={r.name} mid={r.mid} />
                </label>
                <div className="ml-[60px] mr-[20px] mt-2 h-px bg-border" />
              </div>
            ))}
          </div>
          {!hideChrome && (
            <div className="flex justify-center px-4 py-3">
              <Pagination page={page} total={200} onChange={onPageChange} view="full" size="xs" />
            </div>
          )}
        </Pane>

        {/* стрелка-индикатор переноса (чек слева → строка уходит вправо) */}
        <div className="flex size-8 shrink-0 rotate-90 items-center justify-center self-center text-[#5a646e] lg:rotate-0">
          <ArrowMove />
        </div>

        {/* выбранные — единая карточка (в шапке без select-all) */}
        <Pane>
          <PaneHeader addressLabel={addressLabel} checkbox={<span className="size-6 shrink-0" aria-hidden />} />
          <div className="flex-1 pt-4">
            {selected.map((r) => (
              <div key={r.i} className="mb-4">
                <label className="flex cursor-pointer items-center gap-4 px-[20px]">
                  <PaishikRow leading={<Checkbox size="xs" checked onChange={() => onToggleSel(r.i)} />} name={r.name} mid={r.mid} />
                </label>
                <div className="ml-[60px] mr-[20px] mt-2 h-px bg-border" />
              </div>
            ))}
          </div>
        </Pane>
      </div>
    </>
  );
}

/* ── «Настройка %»: распределение целевого счёта + карточка «Счёт пайщика» ── */
/* Единый компонент для редактируемого экрана (config) и read-only детали
 * голосования. Доли тянутся из пула 100%, «Счёт пайщика» = остаток (payerShare),
 * поэтому max каждой строки = её значение + остаток. Figma 2659:494425. */
export interface StableDistribution {
  target: number;
  subs: { name: string; pct: number }[];
  payerShare: number;
  days: string;
  sum: string;
}
export function StablePercentConfig({
  target,
  subs,
  payerShare,
  days,
  sum,
  recurring,
  readOnly = false,
  onTargetChange,
  onSubChange,
  onDaysChange,
  onSumChange,
  onRecurringChange,
}: StableDistribution & {
  recurring: boolean;
  readOnly?: boolean;
  onTargetChange?: (v: number) => void;
  onSubChange?: (i: number, v: number) => void;
  onDaysChange?: (v: string) => void;
  onSumChange?: (v: string) => void;
  onRecurringChange?: (v: boolean) => void;
}) {
  return (
    /* Весь таб «Настройка %» — в бордерной карточке (корневой фрейм Figma). */
    <div className="flex flex-col gap-6 rounded-[4px] border border-border bg-surface p-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex w-full flex-col gap-4 lg:w-[444px]">
        <span className="ds-p3-medium text-foreground-subtle">Распределение целевого счета</span>
        <DistributionRow title="Целевой счет" value={target} onValueChange={onTargetChange} max={target + payerShare} readOnly={readOnly} />
        <span className="ds-p3-medium text-foreground-subtle">Распределение подсчетов целевого счета</span>
        {subs.map((s, i) => (
          <DistributionRow key={s.name} title={s.name} value={s.pct} onValueChange={(v) => onSubChange?.(i, v)} max={s.pct + payerShare} readOnly={readOnly} />
        ))}
      </div>
      {/* Карточка «Счет пайщика» — бордер blue-500, кольцо 160px, hairline,
          ряд «раз в n-дней» (чекбокс справа). Figma 2659:494425;1473:197888. */}
      <div className="flex w-full flex-col items-center gap-6 rounded-[4px] border border-[var(--color-blue-midhub-500)] bg-surface px-6 py-6 lg:w-[444px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="ds-p2-medium text-foreground">Счет пайщика</span>
          <span className="ds-p3 text-foreground-subtle">Процент переведенный со счетов</span>
        </div>
        <ProgressRing value={payerShare} size={160} thickness={12} color="#3996fc" label={<span className="ds-h3 text-foreground">{payerShare}%</span>} />
        <span className="h-px w-full bg-border" />
        <div className="flex w-full items-center justify-between gap-6">
          <span className="ds-caption text-foreground">
            Процент будет поступать до выплаты фиксированной суммы раз в{" "}
            <span className="text-primary">n-дней</span>
          </span>
          <Checkbox size="s" checked={recurring} disabled={readOnly} onChange={(e) => onRecurringChange?.(e.target.checked)} aria-label="Поступление раз в n-дней" />
        </div>
        <Input size="l" placeholder="Количество дней (опционально)" value={days} onChange={(e) => onDaysChange?.(e.target.value)} disabled={readOnly} />
        <Input size="l" placeholder="Укажите сумму" value={sum} onChange={(e) => onSumChange?.(e.target.value)} disabled={readOnly} />
      </div>
    </div>
  );
}
