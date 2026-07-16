"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { QuestionCard } from "./question-card";

/**
 * VotingQuestionsAccordion — блок «Вопросы голосования» (композит MIDHUB DS).
 * Источник: Figma 2512:304778 (node 2567:330261). Стили 1:1.
 *
 * Внешняя карта — DS QuestionCard. Внутри — список раскрываемых строк-вопросов:
 * шапка (grey-20 + заголовок + кнопка «+»/«−» справа); при раскрытии — параметры
 * вопроса (label grey-300 + опц. ⓘ · value dark-900).
 *
 * @example
 *   <VotingQuestionsAccordion items={[
 *     { title: "Изменить управляющего", rows: [
 *       { label: "MIN продолжительность", value: "24 часа" },
 *       { label: "Кворум", value: "100 %", info: true },
 *     ] },
 *   ]} />
 */

export interface VotingSettingRow {
  label: ReactNode;
  value: ReactNode;
  /** Показать ⓘ-иконку рядом с подписью. */
  info?: boolean;
}

export interface VotingQuestionItem {
  title: ReactNode;
  rows: VotingSettingRow[];
}

export interface VotingQuestionsAccordionProps {
  title?: ReactNode;
  items: VotingQuestionItem[];
  /** Индекс изначально раскрытого вопроса. По умолчанию 0. */
  defaultOpenIndex?: number;
  className?: string;
}

/** ⓘ — alert/info рядом с подписью параметра. */
function AlertIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7v3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** Кнопка раскрытия «+» / «−». */
function Toggle({ open }: { open: boolean }) {
  return (
    <span className="flex size-4 items-center justify-center text-foreground-muted" aria-hidden>
      <svg viewBox="0 0 16 16" fill="none" className="size-4">
        <path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        {!open && <path d="M8 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
      </svg>
    </span>
  );
}

function Item({ item, defaultOpen }: { item: VotingQuestionItem; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 border-b border-border bg-[var(--color-grey-20)] px-6 py-2 text-left transition-colors hover:bg-[color:var(--color-grey-90)]"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ds-caption-medium text-foreground-muted">{item.title}</span>
        <Toggle open={open} />
      </button>
      {open && (
        <div className="flex flex-col">
          {item.rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr] items-center gap-2 border-b border-border px-6 py-3 sm:grid-cols-[300px_1fr]">
              <span className="ds-p3 flex items-center gap-1 text-foreground-subtle">
                {row.label}
                {row.info && <AlertIcon />}
              </span>
              <span className="ds-p3 text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function VotingQuestionsAccordion({
  title = "Вопросы голосования",
  items,
  defaultOpenIndex = 0,
  className,
}: VotingQuestionsAccordionProps) {
  return (
    <QuestionCard title={title} size="l" defaultOpen className={className}>
      {/* Отрицательные поля компенсируют паддинг тела QuestionCard (16px 23px 20px)
          — строки-вопросы идут от края до края. */}
      <div className={cn("-mx-[23px] -mb-[20px] -mt-[16px] flex flex-col")}>
        {items.map((it, i) => (
          <Item key={i} item={it} defaultOpen={i === defaultOpenIndex} />
        ))}
      </div>
    </QuestionCard>
  );
}
