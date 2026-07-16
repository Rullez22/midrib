"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useTableSort } from "@/lib/use-table-sort";
import { Badge, type BadgeColor } from "../badge";
import { Button } from "../button";
import { Combobox } from "../combobox";
import { Link } from "../link";
import { TableHeader, type TableColumn } from "../table-header";

/**
 * TransactionsTable — таблица транзакций со статус-кодами (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / транзакции-партнёры (672:5508), транзакции-лк
 * (1248:108067), транзакции-отчётность (672:4215), -mini (875:0, 1255:115939 …),
 * транзакции-маркетинговый счёт (2194:230474). Стили 1:1.
 *
 * Сборка из DS: верхняя панель (заголовок + цветные фильтры кодов + Combobox
 * «Все коды»), TableHeader (сортируемые колонки), строки-карточки
 * (Badge-код + Link транзакции/контрагентов/документа + суммы), Button
 * «Показать ещё».
 *
 * Презентационная: данные приходят через `transactions`.
 *
 * @example
 *   <TransactionsTable
 *     transactions={[{ code: "214", color: "cyan", hash: "5c243af…07db8",
 *       time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»",
 *       document: "Счёт на оплату", documentSub: "Закупка площадок",
 *       amount: "0.229937", commission: "0.0022" }]}
 *   />
 */

export interface Transaction {
  /** Статус-код (214 / 216 / 215 …). */
  code: string;
  /** Цвет кода. */
  color: BadgeColor;
  /** Доля в счёте (крупное число) — только в режиме пул-счёта (`showShare`). */
  share?: ReactNode;
  /** Хэш/идентификатор транзакции. */
  hash: ReactNode;
  /** Время («29 секунд назад»). */
  time?: ReactNode;
  from: ReactNode;
  to: ReactNode;
  document: ReactNode;
  documentSub?: ReactNode;
  /** Документ-ссылка кликабельна (синяя). По умолчанию true. */
  documentLink?: boolean;
  amount: ReactNode;
  commission: ReactNode;
}

export interface TransactionsTableProps {
  transactions: Transaction[];
  /** Заголовок панели. По умолчанию «Последние транзакции». */
  title?: ReactNode;
  /** Цвета фильтров кодов (верхняя панель). По умолчанию cyan/purple/green. */
  codeFilters?: BadgeColor[];
  /** Опции селекта кодов. */
  codeOptions?: { value: string; label: string }[];
  /**
   * Показать панель фильтров (цветные квадраты-коды + селект «Все коды»).
   * По умолчанию true. На экране счёта/ЛК фильтров нет — только заголовок.
   */
  showFilters?: boolean;
  /** Показать кнопку «Показать ещё». По умолчанию true. */
  showMore?: boolean;
  /**
   * Режим пул-счёта: добавляет колонку «Доля в счёте» (крупное число) после кода.
   * Источник: Figma «транзакции-маркетинговый счёт». По умолчанию false.
   */
  showShare?: boolean;
  onShowMore?: () => void;
  className?: string;
}

const COLUMNS: TableColumn[] = [
  { key: "code", label: "Код", width: "92px", sortable: true },
  { key: "hash", label: "Транзакция", flex: 1.6, sortable: true },
  { key: "parties", label: "От кого / Кому", flex: 1.3 },
  { key: "document", label: "Документооборот", flex: 1.7 },
  { key: "amount", label: "Сумма (ETH)", align: "right", flex: 1, sortable: true },
  { key: "commission", label: "Комиссия (PAEV)", align: "right", flex: 1, sortable: true },
];

const SHARE_COLUMN: TableColumn = { key: "share", label: "Доля в счете", flex: 1, align: "center", sortable: true };

function colStyle(col: TableColumn): CSSProperties {
  return col.width ? { flex: `0 0 ${col.width}`, width: col.width } : { flex: col.flex ?? 1 };
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <path d="m3.5 8.5 3 3 6-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Цветной чекбокс-фильтр кода (специфичный контрол таблицы). Активный —
 *  цветная заливка + галочка; неактивный — пустой квадрат с цветной рамкой.
 *  Клик скрывает/показывает транзакции этого цвета-кода. */
function CodeFilter({ color, active, onToggle }: { color: BadgeColor; active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      onClick={onToggle}
      className="inline-flex size-6 cursor-pointer items-center justify-center rounded-[6px] border transition-colors"
      style={{
        backgroundColor: active ? `var(--color-${color}-200)` : "#fff",
        borderColor: `var(--color-${color}-200)`,
      }}
    >
      {active && <CheckIcon />}
    </button>
  );
}

export function TransactionsTable({
  transactions,
  title = "Последние транзакции",
  codeFilters = ["cyan", "purple", "green"],
  codeOptions = [{ value: "all", label: "Все коды" }],
  showFilters = true,
  showMore = true,
  showShare = false,
  onShowMore,
  className,
}: TransactionsTableProps) {
  const columns = showShare ? [COLUMNS[0], SHARE_COLUMN, ...COLUMNS.slice(1)] : COLUMNS;
  const showHeader = title != null || showFilters;

  // Активные цвета-коды (по умолчанию все активны → видны все транзакции). Клик по
  // чекбоксу скрывает/показывает транзакции этого кода. Транзакции с цветом вне
  // фильтров показываются всегда.
  const [activeCodes, setActiveCodes] = useState<Set<BadgeColor>>(() => new Set(codeFilters));
  const toggleCode = (c: BadgeColor) =>
    setActiveCodes((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  const visible = showFilters
    ? transactions.filter((t) => !codeFilters.includes(t.color) || activeCodes.has(t.color))
    : transactions;
  // Сортировка по клику на стрелку в шапке (код / доля / транзакция / сумма /
  // комиссия). Ключи колонок совпадают с полями Transaction, поэтому accessor не
  // нужен. Сортируем ПОСЛЕ фильтра, но ДО показа — «Показать ещё» отдаёт добор
  // строк наружу через `onShowMore`, так что порядок применяется ко всему набору.
  // Без ключа по умолчанию — исходный порядок транзакций сохраняется.
  const { sorted, sortKey, sortDir, onSort } = useTableSort(visible);
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {/* Верхняя панель: заголовок + (опц.) фильтры + селект кодов */}
      {showHeader && (
        <div className="flex flex-wrap items-center gap-4">
          {title != null && <span className="ds-p2-medium text-foreground">{title}</span>}
          {showFilters && (
            <>
              <div className="flex items-center gap-2">
                {codeFilters.map((c) => (
                  <CodeFilter key={c} color={c} active={activeCodes.has(c)} onToggle={() => toggleCode(c)} />
                ))}
              </div>
              <div className="ml-auto w-[180px]">
                <Combobox size="s" options={codeOptions} defaultValue={codeOptions[0]?.value} placeholder="Все коды" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Навигационная шапка (30px) + строки-карточки — общий блок с gap 8px */}
      <div className="flex flex-col gap-2">
        <TableHeader columns={columns} size="s" tone="muted" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        {sorted.map((t, i) => (
          <div
            key={i}
            className="ds-row flex items-center rounded-[8px] border border-border bg-white px-4 py-3 transition-colors"
          >
            {/* Код */}
            <div style={colStyle(COLUMNS[0])}>
              <Badge
                variant="solid"
                color={t.color}
                className="min-w-[56px] justify-center px-3 py-1.5 text-[14px]"
              >
                {t.code}
              </Badge>
            </div>

            {/* Доля в счёте (режим пул-счёта) */}
            {showShare && (
              <div className="ds-h4 text-center text-primary" style={colStyle(SHARE_COLUMN)}>
                {t.share}
              </div>
            )}

            {/* Транзакция */}
            <div className="flex flex-col gap-0.5 pr-3" style={colStyle(COLUMNS[1])}>
              <span className="inline-flex items-center gap-1.5">
                <Link href="#" size="p3">{t.hash}</Link>
                <InfoIcon />
              </span>
              {t.time != null && <span className="ds-caption text-foreground-subtle">{t.time}</span>}
            </div>

            {/* От кого / Кому */}
            <div className="flex flex-col gap-0.5 pr-3" style={colStyle(COLUMNS[2])}>
              <Link href="#" size="p3">{t.from}</Link>
              <Link href="#" size="p3">{t.to}</Link>
            </div>

            {/* Документооборот */}
            <div className="flex flex-col gap-0.5 pr-3" style={colStyle(COLUMNS[3])}>
              <span className="inline-flex items-center gap-1.5">
                {t.documentLink === false ? (
                  <span className="ds-p3 text-foreground">{t.document}</span>
                ) : (
                  <>
                    <Link href="#" size="p3">{t.document}</Link>
                    <InfoIcon />
                  </>
                )}
              </span>
              {t.documentSub != null && <span className="ds-p3 text-foreground">{t.documentSub}</span>}
            </div>

            {/* Сумма */}
            <div className="ds-p3 text-right text-foreground" style={colStyle(COLUMNS[4])}>
              {t.amount}
            </div>

            {/* Комиссия */}
            <div className="ds-p3 text-right text-foreground" style={colStyle(COLUMNS[5])}>
              {t.commission}
            </div>
          </div>
        ))}
      </div>

      {showMore && (
        <div className="flex justify-center pt-1">
          <Button variant="secondary" size="m" onClick={onShowMore}>
            Показать ещё
          </Button>
        </div>
      )}
    </div>
  );
}
