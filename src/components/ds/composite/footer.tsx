import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Footer — панель действий (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / footer component (node 1987:197573). Стили 1:1.
 *
 * Полоса (фон grey-20, рамка grey-90) с кнопками действий. Высота — от размера
 * кнопок (L-48 / M-40 / S-32). Собран из DS Button.
 *
 *   align    : "end" (по умолч.) · "start" · "between"
 *   attached : футер карточки — скругление только снизу, компактный паддинг
 *
 * @example
 *   <Footer>
 *     <Button variant="secondary">Редактировать</Button>
 *     <Button>Подписать</Button>
 *   </Footer>
 *
 *   <Footer align="start" attached>
 *     <Button variant="tertiary" size="s">Редактировать</Button>
 *   </Footer>
 */

export type FooterAlign = "end" | "start" | "between";

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Выравнивание кнопок. По умолчанию "end". */
  align?: FooterAlign;
  /** Футер карточки: скругление только снизу + компактный паддинг. */
  attached?: boolean;
  children?: ReactNode;
}

const ALIGN_CLASS: Record<FooterAlign, string> = {
  end: "ds-footer--end",
  start: "ds-footer--start",
  between: "ds-footer--between",
};

export function Footer({
  align = "end",
  attached = false,
  className,
  children,
  ...rest
}: FooterProps) {
  return (
    <footer
      className={cn("ds-footer", ALIGN_CLASS[align], attached && "ds-footer--attached", className)}
      {...rest}
    >
      {children}
    </footer>
  );
}
