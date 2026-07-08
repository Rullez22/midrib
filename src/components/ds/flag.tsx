import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Flag — флаг страны (+ опц. название) MIDHUB DS.
 * Источник: Figma «UI Контролы» / WEB-flag → «страна» (node 1417:61949).
 *
 * Анатомия: флаг 16px + gap 8 + название (P2 Regular, dark 900).
 *
 * Изображение флага по ISO-коду страны (alpha-2) берётся с flagcdn.com
 * (прямоугольные флаги, без зависимостей). Можно переопределить через `src`.
 *
 * @example
 *   <Flag code="ru" label="Россия" />
 *   <Flag code="us" />                       // только флаг
 *   <Flag src="/flags/custom.svg" label="…" />
 */

export interface FlagProps {
  /** ISO 3166-1 alpha-2 код страны (например "ru", "us", "kz"). */
  code?: string;
  /** Название страны. Если не задано — рендерится только флаг. */
  label?: ReactNode;
  /** Прямой src изображения (переопределяет flagcdn по code). */
  src?: string;
  /** Ширина флага в px. По умолчанию 16. */
  width?: number;
  className?: string;
}

export function Flag({ code, label, src, width = 16, className }: FlagProps) {
  const imgSrc =
    src ?? (code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : undefined);

  return (
    <span className={cn("ds-flag", className)}>
      {imgSrc != null && (
        <img
          className="ds-flag__img"
          src={imgSrc}
          alt={typeof label === "string" ? label : (code ?? "")}
          width={width}
          loading="lazy"
        />
      )}
      {label != null && <span className="ds-flag__label">{label}</span>}
    </span>
  );
}
