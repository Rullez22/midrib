"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Radio } from "../radio";

/**
 * QuestionForm — форма создания/редактирования вопроса голосования (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / create new question (nodes 577:61505, 574:61417,
 * 518:59374). Стили 1:1.
 *
 * Собрана из DS: Input (название + числовые параметры со степпером), Textarea
 * (описание), Radio (Да/Нет «Доступен к передаче?»), select-поле «Тип роли».
 *
 * Презентационная (неуправляемая). Числовые поля — Input с иконкой-степпером.
 *
 * @example
 *   <QuestionForm transferable="no" />
 */

const NUM_FIELDS = [
  "MIN продолжительность",
  "MAX продолжительность",
  "Кворум",
  "Первоначальный кворум",
  "Консенсус",
] as const;

function StepperIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m8 10 4-4 4 4M8 14l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface QuestionFormProps {
  /** Подпись «Тип роли» (select-поле). */
  roleLabel?: ReactNode;
  /** Значение радио «Доступен к передаче?». */
  transferable?: "yes" | "no";
  className?: string;
}

export function QuestionForm({
  roleLabel = "Тип роли",
  transferable = "no",
  className,
}: QuestionFormProps) {
  return (
    <div className={cn("rounded-[4px] border border-border bg-surface p-6", className)}>
      <div className="flex flex-col gap-3">
        <Input size="l" placeholder="Название вопроса" />
        <Textarea size="l" placeholder="Описание вопроса" />

        <div className="mt-1 flex max-w-[320px] flex-col gap-3">
          {NUM_FIELDS.map((f) => (
            <Input key={f} size="l" placeholder={f} rightIcon={<StepperIcon />} />
          ))}
          {/* Тип роли — select-поле (переход к выбору роли) */}
          <Input size="l" placeholder={typeof roleLabel === "string" ? roleLabel : undefined} rightIcon={<ArrowRight />} readOnly />
        </div>

        <div className="mt-2 flex flex-col gap-3">
          <span className="ds-p3 text-foreground">Доступен к передаче?</span>
          <div className="flex items-center gap-8">
            <Radio name="transferable" value="yes" size="xs" label="Да" defaultChecked={transferable === "yes"} />
            <Radio name="transferable" value="no" size="xs" label="Нет" defaultChecked={transferable === "no"} />
          </div>
        </div>
      </div>
    </div>
  );
}
