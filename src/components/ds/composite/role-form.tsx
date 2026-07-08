"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Button } from "../button";

/**
 * RoleForm — форма создания / просмотра роли (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / создание роли (690:0 · 690:37 · 690:100) и
 * готовая роль (692:0 · 693:4). Стили 1:1.
 *
 * Сборка из DS: Input (название роли) + Textarea (должностные обязанности) +
 * Button «Добавить требования». Карточки требований приходят через `children`
 * (слот) — это QuestionCard + Badge + Item (см. RequirementForm /
 * requirement-template), чтобы не дублировать карточку.
 *
 *   mode : "create" (редактируемая форма) · "view" (готовая роль, read-only)
 *
 * Презентационная: значения и список требований приходят пропсами/children.
 *
 * @example
 *   <RoleForm
 *     name={name} onNameChange={setName}
 *     duties={duties} onDutiesChange={setDuties}
 *     onAddRequirement={addReq}
 *   >
 *     <QuestionCard … />
 *   </RoleForm>
 *
 *   // Готовая роль — read-only
 *   <RoleForm mode="view" duties="Ведение переписки от имени организации…">
 *     <QuestionCard … />
 *   </RoleForm>
 */

export interface RoleFormProps {
  /** Режим: создание (редактируемая) или просмотр (read-only). По умолчанию "create". */
  mode?: "create" | "view";
  /** Название роли (только create). */
  name?: string;
  onNameChange?: (value: string) => void;
  /** Должностные обязанности / описание роли. */
  duties?: string;
  onDutiesChange?: (value: string) => void;
  /** Карточки требований для роли (QuestionCard list). */
  children?: ReactNode;
  /** Клик по «Добавить требования» (только create). */
  onAddRequirement?: () => void;
  className?: string;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="ds-p2-medium text-foreground">{children}</span>;
}

export function RoleForm({
  mode = "create",
  name,
  onNameChange,
  duties,
  onDutiesChange,
  children,
  onAddRequirement,
  className,
}: RoleFormProps) {
  const view = mode === "view";

  return (
    <div className={cn("flex w-full max-w-[814px] flex-col gap-6", className)}>
      {/* Название роли — только в режиме создания (плавающий лейбл при заполнении) */}
      {!view && (
        <Input
          size="l"
          label={name ? "Название роли" : undefined}
          placeholder="Название роли"
          value={name ?? ""}
          onChange={(e) => onNameChange?.(e.target.value)}
        />
      )}

      {/* Должностные обязанности */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Должностные обязанности</FieldLabel>
        {view ? (
          <div className="rounded-[4px] border border-border px-6 py-4">
            <span className="ds-p3 whitespace-pre-line text-foreground-muted">{duties}</span>
          </div>
        ) : (
          <Textarea
            size="l"
            placeholder="Описание"
            value={duties ?? ""}
            onChange={(e) => onDutiesChange?.(e.target.value)}
          />
        )}
      </div>

      {/* Требования для роли */}
      <div className="flex flex-col gap-3">
        <FieldLabel>Требования для роли</FieldLabel>
        {children}
        {!view && (
          <Button
            variant="secondary"
            size="m"
            className="self-start"
            onClick={onAddRequirement}
          >
            Добавить требования
          </Button>
        )}
      </div>
    </div>
  );
}
