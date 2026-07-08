"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { Tag, AddTag, type TagSize } from "./tag";
import { Dropdown } from "./dropdown";

/**
 * TagInput — поле ввода/выбора тегов MIDHUB DS.
 * Источник: Figma «UI Контролы» / Tags input (node 929:57942). База — поле Input.
 *
 * Два режима, общая обёртка-поле (.ds-field--tags, размер 48/40/32):
 *   • free-text (по умолчанию): Enter/запятая добавляют тег, Backspace
 *     на пустом вводе удаляет последний.
 *   • select (`options` задан): чипы + «+» (AddTag) → Dropdown оставшихся
 *     вариантов. Свободный ввод выключен — только выбор из пула.
 *
 *   size  : "l" (48) · "m" (40) · "s" (32)
 *   state : default / hover / focus / disabled; error — проп
 *
 * Управляемый (`value` + `onValueChange`) или неуправляемый (`defaultValue`).
 *
 * @example free-text
 *   <TagInput label="Навыки" placeholder="Добавьте тег" defaultValue={["React"]} />
 * @example select-from-pool
 *   <TagInput size="m" options={["Канада","Россия"]} addLabel="Выберите реестр" />
 */

export type TagInputSize = "l" | "m" | "s";

/** Вариант для режима выбора: значение + подпись (или просто строка). */
export type TagInputOption = string | { value: string; label: string };

export interface TagInputProps {
  size?: TagInputSize;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  placeholder?: string;
  /** Если задан — режим выбора из пула (чипы + «+»/Dropdown вместо ввода). */
  options?: TagInputOption[];
  /** Подсказка рядом с «+» в режиме выбора, когда ничего не выбрано. */
  addLabel?: string;
  label?: ReactNode;
  caption?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function normOption(o: TagInputOption): { value: string; label: string } {
  return typeof o === "string" ? { value: o, label: o } : o;
}

const SIZE_CLASS: Record<TagInputSize, string> = {
  l: "ds-field--l",
  m: "ds-field--m",
  s: "ds-field--s",
};

export function TagInput({
  size = "l",
  value,
  defaultValue = [],
  onValueChange,
  placeholder = "Добавьте тег",
  options,
  addLabel = "Выберите",
  label,
  caption,
  error = false,
  disabled = false,
  className,
  id,
}: TagInputProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tags = value ?? internal;

  // Режим выбора из пула, если задан options.
  const selectMode = options != null;
  const opts = (options ?? []).map(normOption);
  const labelOf = (v: string) => opts.find((o) => o.value === v)?.label ?? v;
  const available = opts.filter((o) => !tags.includes(o.value));

  function setTags(next: string[]) {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  }
  function addTag(raw: string) {
    const v = raw.trim();
    if (!v || tags.includes(v)) return;
    setTags([...tags, v]);
  }
  function removeAt(i: number) {
    setTags(tags.filter((_, j) => j !== i));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
      setDraft("");
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      removeAt(tags.length - 1);
    }
  }

  return (
    <div
      className={cn(
        "ds-field",
        SIZE_CLASS[size],
        "ds-field--tags",
        error && "ds-field--error",
        disabled && "ds-field--disabled",
        className,
      )}
    >
      <div
        className="ds-field__box"
        onMouseDown={(e) => {
          // в free-text режиме клик по полю (не по чипу) фокусирует ввод
          if (
            !selectMode &&
            (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("ds-taginput__row"))
          ) {
            e.preventDefault();
            inputRef.current?.focus();
          }
        }}
      >
        <span className="ds-field__main">
          {label != null && <span className="ds-field__label">{label}</span>}
          <span className="ds-taginput__row">
            {tags.map((t, i) => (
              <Tag key={`${t}-${i}`} size={size as TagSize} onRemove={disabled ? undefined : () => removeAt(i)}>
                {selectMode ? labelOf(t) : t}
              </Tag>
            ))}
            {selectMode ? (
              available.length > 0 &&
              !disabled && (
                <Dropdown
                  align="start"
                  aria-label={addLabel}
                  trigger={
                    <span className="ds-taginput__add">
                      <AddTag size={size as TagSize} aria-label={addLabel} />
                      {tags.length === 0 && <span className="ds-taginput__placeholder">{addLabel}</span>}
                    </span>
                  }
                  items={available.map((o) => ({ value: o.value, label: o.label }))}
                  onSelect={(v) => addTag(v)}
                />
              )
            ) : (
              <input
                ref={inputRef}
                id={id}
                className="ds-field__input ds-taginput__input"
                value={draft}
                placeholder={tags.length === 0 ? placeholder : ""}
                disabled={disabled}
                aria-invalid={error || undefined}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={() => {
                  if (draft.trim()) {
                    addTag(draft);
                    setDraft("");
                  }
                }}
              />
            )}
          </span>
        </span>
      </div>
      {caption != null && <div className="ds-field__caption">{caption}</div>}
    </div>
  );
}
