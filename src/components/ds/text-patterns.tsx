import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Text, type TextVariant } from "./text";

/**
 * Текстовые паттерны MIDHUB DS — «Примеры использования» из Figma «Стиль».
 * Композиции заголовок+тело, списки, заметки, цитаты, overline.
 * Отступы (gap) — 1:1 с Figma (2 / 4 / 8 / 16 px).
 *
 * Source nodes: 332:75 (Text example), 398:0 (overline).
 */

type Gap = 2 | 4 | 8 | 16;

/* ── TextBlock: Заголовок + тело ───────────────────────────────
   Базовый паттерн: title (Medium, dark 900) над body, вертикальный gap. */
export interface TextBlockProps {
  title: ReactNode;
  titleVariant?: Extract<TextVariant, "h5" | "p1-medium" | "p2-medium" | "p3-medium" | "caption-medium">;
  gap?: Gap;
  className?: string;
  children: ReactNode; // тело: <Text variant tone> или список/заметка
}

export function TextBlock({
  title,
  titleVariant = "h5",
  gap = 8,
  className,
  children,
}: TextBlockProps) {
  return (
    <div className={cn("flex flex-col items-start", className)} style={{ gap }}>
      <Text variant={titleVariant} tone="default">{title}</Text>
      {children}
    </div>
  );
}

/* ── TextList: маркированный / нумерованный список ──────────────
   Figma «+point» (•) и «+figures» (1. 2. 3.). Цвет — dark 800. */
export interface TextListProps {
  items: ReactNode[];
  marker?: "bullet" | "number";
  variant?: Extract<TextVariant, "p1" | "p2" | "p3" | "caption">;
  tone?: "muted" | "subtle" | "default";
  className?: string;
}

export function TextList({
  items,
  marker = "bullet",
  variant = "p3",
  tone = "muted",
  className,
}: TextListProps) {
  const Tag = marker === "number" ? "ol" : "ul";
  return (
    <Tag className={cn("flex flex-col gap-1", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <Text variant={variant} tone={tone} as="span" className="shrink-0 tabular-nums">
            {marker === "number" ? `${i + 1}.` : "•"}
          </Text>
          <Text variant={variant} tone={tone} as="span" className="flex-1">
            {item}
          </Text>
        </li>
      ))}
    </Tag>
  );
}

/* ── Note: заметка с акцентной полосой (Figma «+notes») ─────────
   Синяя полоса 4px (primary) + заголовок (P2 Medium) + текст (P3 Regular). */
export interface NoteProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Note({ title, children, className }: NoteProps) {
  return (
    <div className={cn("flex items-stretch gap-4", className)}>
      <span aria-hidden className="w-1 shrink-0 self-stretch rounded-pill bg-primary" />
      <div className="flex flex-1 flex-col gap-1">
        <Text variant="p2-medium" tone="default">{title}</Text>
        <Text variant="p3" tone="muted">{children}</Text>
      </div>
    </div>
  );
}

/* ── Quote: цитата (Figma «H5+Quotes») ─────────────────────────
   Крупная кавычка (H5, dark 900) над текстом цитаты (P2 Regular, dark 800). */
export interface QuoteProps {
  children: ReactNode;
  className?: string;
}

export function Quote({ children, className }: QuoteProps) {
  return (
    <figure className={cn("flex flex-col items-start", className)}>
      <Text variant="h5" tone="default" as="span" aria-hidden className="leading-none">
        “
      </Text>
      <Text variant="p2" tone="muted" as="blockquote">{children}</Text>
    </figure>
  );
}

/* ── Overline: надстрочная подпись + тело (Figma node 398:0) ────
   Маленькая подпись (grey 300) над более крупным телом (dark 900). */
export interface OverlineProps {
  label: ReactNode;
  overlineVariant?: Extract<TextVariant, "p1" | "p2" | "p3" | "caption">;
  bodyVariant?: Extract<TextVariant, "h3" | "h5" | "p1" | "p2" | "p3" | "caption">;
  gap?: Gap;
  className?: string;
  children: ReactNode;
}

export function Overline({
  label,
  overlineVariant = "p3",
  bodyVariant = "p2",
  gap = 4,
  className,
  children,
}: OverlineProps) {
  return (
    <div className={cn("flex flex-col items-start", className)} style={{ gap }}>
      <Text variant={overlineVariant} tone="subtle">{label}</Text>
      <Text variant={bodyVariant} tone="default">{children}</Text>
    </div>
  );
}
