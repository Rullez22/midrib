"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Radio } from "../radio";
import { Badge } from "../badge";
import { Button } from "../button";
import { CheckMatrix } from "./check-matrix";

/**
 * RequirementForm — форма создания/редактирования требования (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Требование (nodes 120:0, 638:62786, 642:63109 …).
 * Стили 1:1.
 *
 * Сборка из DS: Input (название) + select-поле (раздел) + Textarea (описание) +
 * Radio+Badge (тип верификации) + CheckMatrix (уровень верификации) +
 * список документов + Button (Добавить документ / Создать / Отменить).
 *
 * Презентационная (минимум состояния — только матрица/радио).
 *
 * @example
 *   <RequirementForm />
 */

export interface RequirementFormProps {
  className?: string;
}

function ChevronDown() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="ds-p3 text-foreground">{children}</span>;
}

export function RequirementForm({ className }: RequirementFormProps) {
  const [level, setLevel] = useState<"green" | "yellow">("green");
  const [matrix, setMatrix] = useState<boolean[][]>([[true, false], [false, false]]);
  const toggle = (r: number, c: number) =>
    setMatrix((m) => m.map((row, ri) => (ri === r ? row.map((v, ci) => (ci === c ? !v : v)) : row)));

  return (
    <div className={cn("flex max-w-[814px] flex-col gap-5", className)}>
      <Input size="l" placeholder="Название требования" />

      <div className="flex flex-col gap-2">
        <FieldLabel>Раздел для добавления</FieldLabel>
        <Input size="l" placeholder="Сохранить в раздел" rightIcon={<ChevronDown />} readOnly />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Описание</FieldLabel>
        <Textarea size="l" placeholder="Текст описания" />
      </div>

      <div className="flex flex-col gap-3">
        <FieldLabel>Тип верификации</FieldLabel>
        <div className="flex flex-col gap-3">
          <Radio name="vlevel" value="green" size="xs" defaultChecked={level === "green"} onChange={() => setLevel("green")} label={<Badge variant="solid" color="green">Зелёный</Badge>} />
          <Radio name="vlevel" value="yellow" size="xs" defaultChecked={level === "yellow"} onChange={() => setLevel("yellow")} label={<Badge variant="solid" color="orange">Жёлтый</Badge>} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FieldLabel>Верификации к валидаторам</FieldLabel>
        <span className="ds-caption text-foreground-muted">
          1. Выберите уровень верификации, которому должен соответствовать запрашиваемый документ
        </span>
        <CheckMatrix
          rowHeader="Тип требований"
          columns={[<Badge key="y" variant="solid" color="orange">Жёлтый</Badge>, <Badge key="g" variant="solid" color="green">Зелёный</Badge>]}
          rows={[{ label: "Международный" }, { label: "Локальный" }]}
          checked={matrix}
          onToggle={toggle}
        />
        <span className="ds-caption text-foreground-muted">
          2. Выберите документы, подтверждающие соответствие требованиям
        </span>
        <Button variant="secondary" size="m" className="self-start">Добавить документ</Button>
      </div>

      <div className="flex items-center gap-4">
        <Button disabled>Создать требование</Button>
        <Button variant="negative-sec">Отменить</Button>
      </div>
    </div>
  );
}
