import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Link — текстовая веб-ссылка MIDHUB DS.
 * Источник: Figma «UI Контролы» / Web-Links (node 759:0). Стили 1:1.
 *
 * Матрица дизайна:
 *   size : "p1" (18) · "p2" (16) · "p3" (14) · "caption" (12) · "caption-button"
 *   type : internal (только текст) · external (текст + иконка «open», `external`)
 *   state: default / hover / active / focus — нативные CSS-состояния.
 *
 * Внешние ссылки (`external`) по умолчанию открываются в новой вкладке
 * (target="_blank" rel="noopener noreferrer") и получают иконку справа.
 *
 * Стили — классы `.ds-link*` в link.css (палитра-токены MIDHUB).
 *
 * @example
 *   <Link href="/about">Внутренняя ссылка</Link>
 *   <Link href="https://…" external>Внешняя ссылка</Link>
 *   <Link href="https://…" size="p3" external>Подробнее</Link>
 *   <Link href="https://…" size="caption-button" external>Посетить сайт</Link>
 */

export type LinkSize = "p1" | "p2" | "p3" | "caption" | "caption-button";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Размер/начертание: p1=18, p2=16, p3=14, caption=12, caption-button. По умолчанию "p1". */
  size?: LinkSize;
  /** Внешняя ссылка: иконка «open» справа + открытие в новой вкладке. */
  external?: boolean;
  children?: ReactNode;
}

const SIZE_CLASS: Record<LinkSize, string> = {
  p1: "ds-link--p1",
  p2: "ds-link--p2",
  p3: "ds-link--p3",
  caption: "ds-link--caption",
  "caption-button": "ds-link--caption ds-link--button",
};

function ExternalIcon() {
  return (
    <span className="ds-link__icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 5h5v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 5l-7 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { size = "p1", external = false, className, children, target, rel, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn("ds-link", SIZE_CLASS[size], className)}
      target={external ? (target ?? "_blank") : target}
      rel={external ? (rel ?? "noopener noreferrer") : rel}
      {...rest}
    >
      <span className="ds-link__label">{children}</span>
      {external && <ExternalIcon />}
    </a>
  );
});
