import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Badge — статус-бейдж / пилюля MIDHUB DS.
 * Источник: Figma «UI фичи» — статусы «Согласован» (968:90167, soft green),
 * код «214» (672:5788, solid cyan), «Локальный» (soft orange). Стили 1:1.
 *
 *   variant : "soft" (фон color-50, текст color-400) · "solid" (фон color-200, текст white)
 *   color   : green · orange · red · blue · cyan · yellow · purple · grey
 *
 * Padding 6/16, радиус 4, Articulat Medium 12/20.
 *
 * @example
 *   <Badge color="green">Согласован</Badge>
 *   <Badge color="orange">Локальный</Badge>
 *   <Badge variant="solid" color="cyan">214</Badge>
 */

export type BadgeVariant = "soft" | "solid";
export type BadgeColor =
  | "green"
  | "orange"
  | "red"
  | "blue"
  | "cyan"
  | "yellow"
  | "purple"
  | "grey";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  children?: ReactNode;
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  soft: "ds-badge--soft",
  solid: "ds-badge--solid",
};

const COLOR_CLASS: Record<BadgeColor, string> = {
  green: "ds-badge--green",
  orange: "ds-badge--orange",
  red: "ds-badge--red",
  blue: "ds-badge--blue",
  cyan: "ds-badge--cyan",
  yellow: "ds-badge--yellow",
  purple: "ds-badge--purple",
  grey: "ds-badge--grey",
};

export function Badge({
  variant = "soft",
  color = "green",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn("ds-badge", VARIANT_CLASS[variant], COLOR_CLASS[color], className)}
      {...rest}
    >
      {children}
    </span>
  );
}
