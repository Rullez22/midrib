import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Text — типографический примитив MIDHUB DS.
 * Источник: Figma «Стиль» / Типографика_web. Все стили — 1:1 с дизайном.
 *
 * Варианты соответствуют именованным стилям DS:
 *   Заголовки: h1 h2 h3 h4 h5            (Medium 500)
 *   Тело:      p1 p2 p3 (+ -medium)      (Regular 400 / Medium 500)
 *   Подписи:   caption, caption-medium, caption-up (UPPERCASE +0.5)
 *
 * @example
 *   <Text variant="h2">Заголовок</Text>
 *   <Text variant="p2" tone="muted">Вторичный текст</Text>
 *   <Text variant="p1-medium" as="span">Акцент</Text>
 */

export type TextVariant =
  | "h1" | "h2" | "h3" | "h4" | "h5"
  | "p1" | "p1-medium"
  | "p2" | "p2-medium"
  | "p3" | "p3-medium"
  | "caption" | "caption-medium" | "caption-up";

export type TextTone =
  | "default"   // dark 900
  | "muted"     // dark 800
  | "subtle"    // grey 300
  | "primary"   // blue-midhub 500
  | "white";

const VARIANT_CLASS: Record<TextVariant, string> = {
  h1: "ds-h1", h2: "ds-h2", h3: "ds-h3", h4: "ds-h4", h5: "ds-h5",
  p1: "ds-p1", "p1-medium": "ds-p1-medium",
  p2: "ds-p2", "p2-medium": "ds-p2-medium",
  p3: "ds-p3", "p3-medium": "ds-p3-medium",
  caption: "ds-caption",
  "caption-medium": "ds-caption-medium",
  "caption-up": "ds-caption-up",
};

const TONE_CLASS: Record<TextTone, string> = {
  default: "text-foreground",
  muted: "text-foreground-muted",
  subtle: "text-foreground-subtle",
  primary: "text-primary",
  white: "text-on-primary",
};

const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5",
  p1: "p", "p1-medium": "p",
  p2: "p", "p2-medium": "p",
  p3: "p", "p3-medium": "p",
  caption: "span", "caption-medium": "span", "caption-up": "span",
};

export interface TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
}

export function Text({
  variant = "p2",
  tone = "default",
  as,
  className,
  children,
}: TextProps) {
  const Tag = as ?? DEFAULT_TAG[variant];
  return (
    <Tag className={cn(VARIANT_CLASS[variant], TONE_CLASS[tone], className)}>
      {children}
    </Tag>
  );
}
