"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { Combobox, type ComboboxOption } from "../combobox";
import { Input } from "../input";
import { Radio } from "../radio";
import { Button } from "../button";

/**
 * WebResourceFilter — фильтр веб-ресурса (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / фильтр веб-ресурс
 * (1939:312194 пусто · 1939:312378 заполнено · 1939:312555 без сохранённого ·
 * 1940:344107 открытый список). Стили 1:1.
 *
 * Карточка (white, рамка grey-90, тень) с полями фильтра, собранными из DS:
 * Combobox (сохранённые фильтры, возраст) + Input (идентификатор, слово) +
 * Radio (пол) + Button (Создать фильтр — tertiary link · Поиск — primary).
 *
 * Управляемый: значения и обработчики приходят через `value` / `onChange`.
 * Кнопки футера активны, когда задан хоть один критерий (или `canSearch`).
 *
 * @example
 *   const [v, setV] = useState<WebResourceFilterValue>({});
 *   <WebResourceFilter value={v} onChange={setV} onSearch={run} onCreateFilter={save} />
 */

export interface WebResourceFilterValue {
  /** Выбранный сохранённый фильтр. */
  savedFilter?: string;
  /** Идентификатор. */
  identifier?: string;
  /** Содержит слово. */
  word?: string;
  /** Возраст (диапазон). */
  age?: string;
  /** Пол. */
  gender?: "male" | "female";
}

export interface WebResourceFilterProps {
  value?: WebResourceFilterValue;
  onChange?: (next: WebResourceFilterValue) => void;
  /** Опции «Сохранённые фильтры». */
  savedFilterOptions?: ComboboxOption[];
  /** Опции «Возраст». */
  ageOptions?: ComboboxOption[];
  /** Отключить выбор сохранённого фильтра (ручной фильтр применён). */
  savedFilterDisabled?: boolean;
  /** Принудительно (де)активировать кнопки футера. По умолчанию — авто:
      активны, если задан хоть один критерий. */
  canSearch?: boolean;
  onSearch?: () => void;
  onCreateFilter?: () => void;
  className?: string;
}

const DEFAULT_SAVED: ComboboxOption[] = [
  { value: "a", label: "Фильтр А" },
  { value: "b", label: "Фильтр Б" },
  { value: "c", label: "Фильтр В" },
  { value: "d", label: "Фильтр Г" },
];

const DEFAULT_AGE: ComboboxOption[] = [
  { value: "0-20", label: "0-20" },
  { value: "21-30", label: "21-30" },
  { value: "31-40", label: "31-40" },
  { value: "41-60", label: "41-60" },
  { value: "60+", label: "60+" },
];

export function WebResourceFilter({
  value = {},
  onChange,
  savedFilterOptions = DEFAULT_SAVED,
  ageOptions = DEFAULT_AGE,
  savedFilterDisabled = false,
  canSearch,
  onSearch,
  onCreateFilter,
  className,
}: WebResourceFilterProps) {
  // Уникальное имя радиогруппы на инстанс — иначе несколько фильтров на странице
  // делят одну группу и снимают выбор друг у друга.
  const genderName = useId();

  const patch = (next: Partial<WebResourceFilterValue>) =>
    onChange?.({ ...value, ...next });

  const hasCriteria = Boolean(
    value.savedFilter || value.identifier || value.word || value.age || value.gender,
  );
  const active = canSearch ?? hasCriteria;

  return (
    <div
      className={cn(
        "flex w-full max-w-[955px] flex-col gap-6 rounded-[4px] border border-border bg-surface p-6",
        "shadow-[0px_4px_16px_0px_rgba(127,134,151,0.1)]",
        className,
      )}
    >
      {/* Сохранённые фильтры */}
      <Combobox
        size="m"
        className="w-full max-w-[298px]"
        options={savedFilterOptions}
        value={value.savedFilter}
        onValueChange={(v) => patch({ savedFilter: v })}
        label={value.savedFilter ? "Сохраненные фильтры" : undefined}
        placeholder="Сохраненные фильтры"
        disabled={savedFilterDisabled}
      />

      {/* Идентификатор */}
      <Input
        size="m"
        label={value.identifier ? "Идентификатор" : undefined}
        placeholder="Идентификатор"
        value={value.identifier ?? ""}
        onChange={(e) => patch({ identifier: e.target.value })}
      />

      {/* Содержит слово */}
      <Input
        size="m"
        label={value.word ? "Содержит слово" : undefined}
        placeholder="Содержит слово"
        value={value.word ?? ""}
        onChange={(e) => patch({ word: e.target.value })}
      />

      {/* Возраст */}
      <Combobox
        size="m"
        className="w-full max-w-[298px]"
        options={ageOptions}
        value={value.age}
        onValueChange={(v) => patch({ age: v })}
        label={value.age ? "Возраст" : undefined}
        placeholder="Возраст"
      />

      {/* Пол */}
      <div className="flex flex-col gap-3">
        <span className="ds-p3-medium text-foreground">Пол</span>
        <div className="flex items-center gap-6">
          <Radio
            size="xs"
            name={genderName}
            label="Мужской"
            checked={value.gender === "male"}
            onChange={() => patch({ gender: "male" })}
          />
          <Radio
            size="xs"
            name={genderName}
            label="Женский"
            checked={value.gender === "female"}
            onChange={() => patch({ gender: "female" })}
          />
        </div>
      </div>

      {/* Футер */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="tertiary" size="m" link disabled={!active} onClick={onCreateFilter}>
          Создать фильтр
        </Button>
        <Button variant="primary" size="m" disabled={!active} onClick={onSearch}>
          Поиск
        </Button>
      </div>
    </div>
  );
}
