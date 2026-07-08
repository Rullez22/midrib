"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Input, type InputProps, type InputSize } from "../input";

/**
 * SearchBar — строка поиска с действиями (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / search with two button (node 975:109067). Стили 1:1.
 *
 * Поисковый <Input> (иконка-лупа слева) растягивается, справа — слот `actions`
 * (обычно ghost-кнопки фильтров). Собран из DS Input + Button.
 *
 * @example
 *   <SearchBar
 *     placeholder="Label"
 *     value={q}
 *     onChange={(e) => setQ(e.target.value)}
 *     actions={
 *       <>
 *         <Button variant="ghost" size="m" iconLeft={<MenuIcon />}>Меню</Button>
 *         <Button variant="ghost" size="m" iconLeft={<GlobeIcon />}>Язык</Button>
 *       </>
 *     }
 *   />
 */

export interface SearchBarProps
  extends Omit<InputProps, "leftIcon" | "size" | "label" | "caption"> {
  /** Размер поля. По умолчанию "m" (40). */
  size?: InputSize;
  /** Действия справа (кнопки фильтров). */
  actions?: ReactNode;
  /** Класс на внешний контейнер. */
  className?: string;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SearchBar({
  size = "m",
  actions,
  placeholder = "Поиск",
  className,
  inputClassName,
  ...inputProps
}: SearchBarProps) {
  return (
    <div className={cn("ds-searchbar", className)}>
      <Input
        size={size}
        leftIcon={<SearchIcon />}
        placeholder={placeholder}
        className="ds-searchbar__input"
        inputClassName={inputClassName}
        {...inputProps}
      />
      {actions != null && <div className="ds-searchbar__actions">{actions}</div>}
    </div>
  );
}
