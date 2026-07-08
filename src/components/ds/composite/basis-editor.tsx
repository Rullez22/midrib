"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Combobox, type ComboboxOption } from "../combobox";
import { Textarea } from "../textarea";
import { Checkbox } from "../checkbox";
import { Button } from "../button";

/**
 * BasisEditor — редактор описания основания/локализации (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / ПП · Основание value (248:42696, 335:0). Стили 1:1.
 *
 * Сборка из DS: Combobox (язык основания) + Textarea (описание) + Checkbox
 * (сделать по умолчанию) + Button (Отменить / Сохранить описание).
 * Презентационная.
 *
 * @example
 *   <BasisEditor
 *     languages={[{ value: "ru", label: "Русский" }, { value: "bg", label: "Болгарский" }]}
 *     onSave={save} onCancel={cancel}
 *   />
 */

export interface BasisEditorProps {
  languages: ComboboxOption[];
  languageValue?: string;
  onLanguageChange?: (v: string) => void;
  description?: string;
  onDescriptionChange?: (v: string) => void;
  isDefault?: boolean;
  onDefaultChange?: (v: boolean) => void;
  onSave?: () => void;
  onCancel?: () => void;
  /** Заблокировать кнопку сохранения (например, пока описание пустое). */
  saveDisabled?: boolean;
  saveLabel?: ReactNode;
  cancelLabel?: ReactNode;
  className?: string;
}

export function BasisEditor({
  languages,
  languageValue,
  onLanguageChange,
  description,
  onDescriptionChange,
  isDefault,
  onDefaultChange,
  onSave,
  onCancel,
  saveDisabled = false,
  saveLabel = "Сохранить описание",
  cancelLabel = "Отменить",
  className,
}: BasisEditorProps) {
  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <Combobox
        size="l"
        label="Язык основания"
        className="max-w-[406px]"
        options={languages}
        value={languageValue}
        defaultValue={languageValue ?? languages[0]?.value}
        onValueChange={onLanguageChange}
      />

      <Textarea
        size="l"
        label="Описание"
        placeholder="Текст описания"
        value={description}
        onChange={(e) => onDescriptionChange?.(e.target.value)}
        rows={8}
      />

      <div className="mt-4 flex items-center justify-between gap-4">
        <Checkbox
          size="xs"
          label="Сделать по умолчанию"
          checked={isDefault}
          onChange={(e) => onDefaultChange?.(e.target.checked)}
        />
        <div className="flex items-center gap-3">
          <Button variant="negative-sec" size="l" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="primary" size="l" disabled={saveDisabled} onClick={onSave}>{saveLabel}</Button>
        </div>
      </div>
    </div>
  );
}
