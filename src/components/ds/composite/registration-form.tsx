"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Flag } from "../flag";
import { Button } from "../button";
import { EmptyState } from "../empty-state";
import { EditPencilIcon } from "../edit-pencil-icon";

/**
 * RegistrationForm — 4-колоночная форма регистрации ПП (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / ПП · Форма регистрации (247:42756, 325:0,
 * 249:42966, 253:42897 … + complete 260:10, 338:0). Стили 1:1.
 *
 * Колонки: Страны (Flag + выбор) · Характеристики (списки) · Основания (слот
 * `bases` — карточки BasisCard) · Документы (EmptyState либо список + добавить).
 * Активная колонка подсвечивается. Режим «view» — read-only (без добавления).
 *
 * Сборка из DS: Flag, Button, EmptyState + слот BasisCard. Карточки оснований и
 * редактор основания — отдельные композиты (BasisCard / BasisEditor), здесь не
 * дублируются.
 *
 * @example
 *   <RegistrationForm
 *     countries={[{ code: "ru", label: "Россия" }, { code: "bg", label: "Болгария" }]}
 *     selectedCountry="ru"
 *     characteristics={[{ heading: "Запрос данных по очередности:", items: ["Жёлтая международная", "Зелёная международная"] }]}
 *     bases={<><BasisCard title="Согласие" /> …</>}
 *     activeColumn={2}
 *   />
 */

export interface RegCountry {
  code: string;
  label: ReactNode;
}
export interface RegCharGroup {
  heading: ReactNode;
  items: ReactNode[];
}
export interface RegDocument {
  title: ReactNode;
  sub?: ReactNode;
}

export interface RegistrationFormProps {
  mode?: "edit" | "view";
  countries?: RegCountry[];
  selectedCountry?: string;
  onSelectCountry?: (code: string) => void;
  characteristics?: RegCharGroup[];
  /** Подписи колонок. По умолчанию Страны/Характеристики/Основания/Документы. */
  headers?: ReactNode[];
  /** Кастомный контент 1-й колонки (вместо списка стран). */
  column1?: ReactNode;
  /** Кастомный контент 2-й колонки (вместо характеристик). */
  column2?: ReactNode;
  /** Убрать минимальную высоту тела (компактный вид одной строки). */
  compact?: boolean;
  /** Слот колонки «Основания» — карточки BasisCard. */
  /** Слот колонки «Основания»; пусто → EmptyState. */
  bases?: ReactNode;
  emptyBasesLabel?: ReactNode;
  /** Документы; пусто → EmptyState. */
  documents?: RegDocument[];
  emptyDocsLabel?: ReactNode;
  /** Кастомный контент колонки «Документы», когда документов нет (промпт+кнопка). */
  documentsPrompt?: ReactNode;
  onAddDocument?: () => void;
  /** Клик по карандашу карточки документа (редактирование). */
  onEditDocument?: (index: number) => void;
  /** Клик по всей карточке документа (открыть детали). Работает в любом режиме. */
  onDocumentClick?: (index: number) => void;
  /** Индекс активной (подсвеченной) колонки. -1 / вне 0..3 — без активной. */
  activeColumn?: number;
  className?: string;
}

const HEADERS = ["Страны", "Характеристики", "Основания", "Документы"] as const;

/** Иконка редактирования — залитый карандаш (как у локализаций оснований). */
function EditIcon() {
  return <EditPencilIcon className="size-4 text-[var(--color-blue-midhub-500)]" />;
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function RegistrationForm({
  mode = "edit",
  countries = [],
  selectedCountry,
  onSelectCountry,
  characteristics = [],
  headers,
  column1,
  column2,
  compact = false,
  bases,
  emptyBasesLabel = "Отсутствуют основания",
  documents,
  emptyDocsLabel = "Отсутствуют документы",
  documentsPrompt,
  onAddDocument,
  onEditDocument,
  onDocumentClick,
  activeColumn = 2,
  className,
}: RegistrationFormProps) {
  const view = mode === "view";

  return (
    <div className={cn("w-full overflow-hidden rounded-[4px] border border-border bg-white", className)}>
      {/* Заголовки колонок (шапка grey-10). Без вертикальных разделителей —
          в Figma они начинаются ниже шапки (только в теле). Колонки min-w-0,
          чтобы ширины были строго равны и совпадали с колонками тела. */}
      <div className="grid grid-cols-4 border-b border-border bg-surface-sunken">
        {(headers ?? HEADERS).map((h, i) => (
          <div
            key={i}
            className={cn(
              "ds-p3-medium min-w-0 px-4 py-[14px] text-center",
              i === activeColumn ? "text-foreground" : "text-foreground-subtle",
            )}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Тело колонок: grid-cols-4 (minmax(0,1fr)) → строго равные ширины,
          в синхрон с шапкой независимо от контента. */}
      <div className={cn("grid grid-cols-4", !compact && "min-h-[360px]")}>
        {/* 1 — Страны (зазор между карточками 8px, как в Figma) либо кастом */}
        {column1 != null ? (
          <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">{column1}</div>
        ) : (
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          {countries.map((c) => {
            const sel = c.code === selectedCountry;
            return (
              <button
                key={c.code}
                type="button"
                // В view-режиме выбор страны остаётся доступным, если задан
                // обработчик (read-only форма с переключением страны).
                disabled={view && !onSelectCountry}
                onClick={() => onSelectCountry?.(c.code)}
                className={cn(
                  "flex h-14 items-center gap-2 rounded-[4px] border px-4 text-left transition-colors",
                  sel
                    ? "bg-[var(--color-blue-midhub-50)]"
                    : "border-border bg-white hover:bg-[var(--color-grey-10)]",
                )}
                style={sel ? { borderColor: "var(--color-blue-midhub-500)" } : undefined}
              >
                <Flag code={c.code} width={24} />
                <span className={cn(sel ? "ds-p3-medium" : "ds-p3", "text-foreground")}>{c.label}</span>
              </button>
            );
          })}
        </div>
        )}

        {/* 2 — Характеристики либо кастом */}
        {column2 != null ? (
          <div className="flex min-w-0 flex-1 flex-col gap-2 border-l border-border p-4">{column2}</div>
        ) : (
        <div className="flex min-w-0 flex-1 flex-col gap-5 border-l border-border p-4">
          {characteristics.map((g, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="ds-p3-medium text-foreground">{g.heading}</span>
              <ul className="flex flex-col gap-1">
                {g.items.map((it, j) => (
                  <li key={j} className="ds-caption flex gap-2 text-foreground-muted">
                    <span className="text-foreground-subtle">•</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        )}

        {/* 3 — Основания: ячейки BasisCard встык либо EmptyState, если пусто */}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col border-l border-border",
            bases == null && "items-center justify-center p-4",
          )}
        >
          {bases ?? <EmptyState title={emptyBasesLabel} />}
        </div>

        {/* 4 — Документы (зазор между карточками 8px) */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 border-l border-border p-4">
          {documents && documents.length > 0 ? (
            <>
              {documents.map((d, i) => (
                <div
                  key={i}
                  role={onDocumentClick ? "button" : undefined}
                  tabIndex={onDocumentClick ? 0 : undefined}
                  onClick={onDocumentClick ? () => onDocumentClick(i) : undefined}
                  onKeyDown={onDocumentClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDocumentClick(i); } } : undefined}
                  className={cn(
                    "flex items-start justify-between gap-2 rounded-[8px] border border-border bg-white px-4 py-3",
                    onDocumentClick && "cursor-pointer text-left transition-colors hover:bg-[var(--color-grey-10)]",
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="ds-p3 text-foreground">{d.title}</span>
                    {d.sub != null && <span className="ds-caption text-foreground-subtle">{d.sub}</span>}
                  </div>
                  {!view && (
                    <button
                      type="button"
                      aria-label="Редактировать"
                      className="shrink-0"
                      onClick={(e) => { e.stopPropagation(); onEditDocument?.(i); }}
                    >
                      <EditIcon />
                    </button>
                  )}
                </div>
              ))}
              {!view && (
                <Button variant="secondary" size="m" fullWidth iconLeft={<PlusIcon />} onClick={onAddDocument}>
                  Добавить документ
                </Button>
              )}
            </>
          ) : documentsPrompt != null ? (
            <div className="flex flex-1 items-center justify-center">{documentsPrompt}</div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState title={emptyDocsLabel} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
