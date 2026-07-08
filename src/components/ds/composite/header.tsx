"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  MidhubLogo,
  HeaderArrowLeftIcon,
  HeaderChatIcon,
  HeaderExitIcon,
} from "./header-icons";

/**
 * Header — верхняя шапка приложения (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / header (1586:189918 · 1580:189185 · 1118:97037).
 * Стили 1:1.
 *
 * Полоса white, h60, нижняя рамка grey-90. Три зоны:
 *   • слева  — кнопка «назад» (onBack) + логотип + вордмарк (brand) +
 *              разделитель + кнопки-инструменты (leftActions);
 *   • центр  — навигация (nav, абсолютно центрирована);
 *   • справа — чат (onChat) + выход (onExit) либо произвольный rightActions.
 *
 * Все элементы опциональны — комбинируй под нужный вариант:
 *   1) «пространства»  : onBack + leftActions (HeaderIconButton) + nav + onExit
 *   2) «бренд»         : brand="MIDHUB" + nav + onExit
 *   3) «минимальный»   : onChat + onExit
 *
 * Презентационный: значения и обработчики приходят пропсами.
 *
 * @example
 *   <Header brand="MIDHUB" nav={[{ label: "О компании" }, { label: "Парадная" }]} onExit={logout} />
 *
 *   <Header
 *     onBack={goBack}
 *     leftActions={<>
 *       <HeaderIconButton icon={<HeaderHomeIcon />} aria-label="Главная" />
 *       <HeaderIconButton icon={<HeaderGridIcon />} aria-label="Пространства" />
 *     </>}
 *     nav={[{ label: "О компании" }, { label: "Парадная" }]}
 *     onExit={logout}
 *   />
 */

export interface HeaderNavItem {
  label: ReactNode;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface HeaderProps {
  /** Логотип слева. По умолчанию — фирменная аура MIDHUB (32). */
  logo?: ReactNode;
  /** Текстовый вордмарк рядом с лого. Строка → H4 (Medium 24/32). */
  brand?: ReactNode;
  /** Кнопка «назад» перед лого. */
  onBack?: () => void;
  /** Кнопки-инструменты в левом кластере (HeaderIconButton). Перед ними —
      вертикальный разделитель. */
  leftActions?: ReactNode;
  /** Центральная навигация. */
  nav?: HeaderNavItem[];
  /** Кнопка чата справа. */
  onChat?: () => void;
  /** Кнопка выхода справа. */
  onExit?: () => void;
  /** Произвольные узлы справа (заменяют onChat/onExit). */
  rightActions?: ReactNode;
  className?: string;
}

/**
 * HeaderIconButton — квадратная кнопка-инструмент шапки (56×40, grey-20,
 * рамка grey-90, иконка 16 в grey-300). Требует `aria-label`.
 */
export function HeaderIconButton({
  icon,
  className,
  ...rest
}: {
  icon: ReactNode;
  "aria-label": string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-14 items-center justify-center rounded-[4px] border border-border bg-surface-muted",
        "text-foreground-subtle transition-colors hover:bg-surface-sunken",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...rest}
    >
      <span className="flex size-4 items-center justify-center [&>svg]:size-full">{icon}</span>
    </button>
  );
}

/** Внутренняя круглая/квадратная кнопка справа (32×32, grey-20, без рамки). */
function GhostIconButton({
  icon,
  className,
  ...rest
}: {
  icon: ReactNode;
  "aria-label": string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-8 items-center justify-center rounded-[4px] bg-surface-muted",
        "text-foreground-subtle transition-colors hover:bg-surface-sunken",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...rest}
    >
      <span className="flex size-4 items-center justify-center [&>svg]:size-full">{icon}</span>
    </button>
  );
}

export function Header({
  logo,
  brand,
  onBack,
  leftActions,
  nav,
  onChat,
  onExit,
  rightActions,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "relative flex h-[60px] w-full items-center justify-between gap-4 border-b border-border bg-surface px-[14px]",
        className,
      )}
    >
      {/* Левая зона */}
      <div className="flex items-center gap-4">
        {onBack != null && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Назад"
            className="flex size-6 items-center justify-center text-foreground-subtle transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <HeaderArrowLeftIcon className="size-6" />
          </button>
        )}

        <span className="flex size-8 items-center justify-center">
          {logo ?? <MidhubLogo className="size-8" />}
        </span>

        {brand != null &&
          (typeof brand === "string" ? (
            <span className="ds-h4 whitespace-nowrap text-foreground">{brand}</span>
          ) : (
            brand
          ))}

        {leftActions != null && (
          <>
            <span aria-hidden className="h-8 w-px bg-border" />
            {leftActions}
          </>
        )}
      </div>

      {/* Центральная навигация — абсолютно центрирована */}
      {nav != null && nav.length > 0 && (
        <nav className="-translate-x-1/2 absolute left-1/2 flex items-center gap-6">
          {nav.map((item, i) =>
            item.href != null ? (
              <a
                key={i}
                href={item.href}
                onClick={item.onClick}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "ds-p3-medium whitespace-nowrap text-foreground transition-colors hover:text-primary",
                  item.active && "text-primary",
                )}
              >
                {item.label}
              </a>
            ) : (
              <button
                key={i}
                type="button"
                onClick={item.onClick}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "ds-p3-medium whitespace-nowrap text-foreground transition-colors hover:text-primary",
                  item.active && "text-primary",
                )}
              >
                {item.label}
              </button>
            ),
          )}
        </nav>
      )}

      {/* Правая зона */}
      <div className="flex items-center gap-2">
        {rightActions ?? (
          <>
            {onChat != null && (
              <GhostIconButton
                icon={<HeaderChatIcon className="size-4" />}
                aria-label="Чат"
                onClick={onChat}
              />
            )}
            {onExit != null && (
              <GhostIconButton
                icon={<HeaderExitIcon className="size-4" />}
                aria-label="Выход"
                onClick={onExit}
              />
            )}
          </>
        )}
      </div>
    </header>
  );
}
