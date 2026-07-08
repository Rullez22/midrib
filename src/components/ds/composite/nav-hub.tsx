"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Text } from "../text";
import { Button } from "../button";
import { Link as DsLink } from "../link";
import { HeaderArrowLeftIcon } from "./header-icons";

/**
 * NavHub — каркас навигационного хаб-экрана / карты переходов MIDHUB (композит DS).
 * Источник: Figma «Midhub ERP» / Navigation (3501:453400), menu 1 (2570:334921),
 * Компания создана (1857:650053). Стили 1:1.
 *
 * Хаб-экран = floating back-кнопка (top-left, grey-20, rounded-4) + центрированный
 * заголовок H1 + сетка sunken-панелей (grey-10, rounded-16). Контейнер 1200px по
 * центру, адаптивный (mobile→desktop). Собран из DS: Text, Button, Link, иконка.
 *
 * @example
 *   <NavHubPage title="Компания не создана" backHref="/">
 *     <div className="grid gap-6 md:grid-cols-2">
 *       <NavHubCard title="Представитель компании">
 *         <NavHubLinkList items={[{ label: "Создание компании", href: "#" }]} />
 *       </NavHubCard>
 *     </div>
 *   </NavHubPage>
 */

/* ── Back-кнопка (grey-20, рамка grey-90, rounded-4, иконка 24) ─────────── */
function BackButton({ backHref }: { backHref?: string }) {
  const router = useRouter();
  const className = cn(
    "inline-flex items-center justify-center rounded-[4px] border border-border bg-surface-muted p-3",
    "text-foreground-subtle transition-colors hover:bg-surface-sunken",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  );
  const icon = <HeaderArrowLeftIcon className="size-6" />;

  if (backHref != null) {
    return (
      <Link href={backHref} aria-label="Назад" className={className}>
        {icon}
      </Link>
    );
  }
  return (
    <button type="button" aria-label="Назад" onClick={() => router.back()} className={className}>
      {icon}
    </button>
  );
}

export interface NavHubPageProps {
  title: ReactNode;
  /** Куда ведёт «назад». Без значения — router.back(). */
  backHref?: string;
  /** Скрыть кнопку «назад» (напр. на корневом лаунчере). */
  hideBack?: boolean;
  children?: ReactNode;
  className?: string;
}

export function NavHubPage({ title, backHref, hideBack, children, className }: NavHubPageProps) {
  return (
    <main className={cn("min-h-screen bg-background", className)}>
      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-8 md:py-12">
        {/* Шапка: back-кнопка + центрированный заголовок (grid, без overlay) */}
        <header className="mb-10 grid grid-cols-[auto_1fr_auto] items-center gap-3 md:mb-14 md:gap-4">
          {hideBack ? (
            <span aria-hidden className="size-12" />
          ) : (
            <BackButton backHref={backHref} />
          )}
          <Text
            variant="h1"
            className="text-center text-[28px] leading-tight md:text-[48px] md:leading-[56px]"
          >
            {title}
          </Text>
          {/* Балансир ширины back-кнопки, чтобы заголовок был строго по центру */}
          <span aria-hidden className="size-12" />
        </header>

        {children}
      </div>
    </main>
  );
}

/* ── Sunken-панель (grey-10, rounded-16) с заголовком ──────────────────── */
export interface NavHubCardProps {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function NavHubCard({ title, children, className }: NavHubCardProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-6 rounded-[16px] bg-surface-sunken p-6 md:p-8",
        className,
      )}
    >
      {title != null && (
        <Text variant="h4" className="text-[24px] leading-[32px]">
          {title}
        </Text>
      )}
      {children}
    </section>
  );
}

/* ── Маркированный список ссылок (P1 Medium underline, синий) ──────────── */
export interface NavHubLinkItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export function NavHubLinkList({
  items,
  className,
}: {
  items: NavHubLinkItem[];
  className?: string;
}) {
  return (
    <ul className={cn("flex list-disc flex-col gap-4 pl-6 marker:text-primary", className)}>
      {items.map((item, i) => (
        <li key={i}>
          <DsLink
            href={item.href ?? "#"}
            onClick={item.onClick}
            className="break-words font-medium underline decoration-1 underline-offset-2"
          >
            {item.label}
          </DsLink>
        </li>
      ))}
    </ul>
  );
}

/* ── Кликабельная карточка выбора (описание + «Продолжить» + декор) ────── */
export interface NavHubChoiceCardProps {
  title: ReactNode;
  description?: ReactNode;
  href: string;
  actionLabel?: ReactNode;
  /** Выравнивание содержимого: слева (по умолчанию) или по центру. */
  align?: "start" | "center";
  /** Декоративная иллюстрация в правом нижнем углу (src). */
  illustrationSrc?: string;
  className?: string;
}

export function NavHubChoiceCard({
  title,
  description,
  href,
  actionLabel = "Продолжить",
  align = "start",
  illustrationSrc,
  className,
}: NavHubChoiceCardProps) {
  const centered = align === "center";
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-[16px] bg-surface-sunken p-6 transition-colors hover:bg-surface-muted md:p-8",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        centered && "items-center text-center",
        className,
      )}
    >
      <Text variant="h4" className="text-[24px] leading-[32px]">
        {title}
      </Text>
      {description != null && (
        <Text variant="p2" tone="muted" className="max-w-[452px]">
          {description}
        </Text>
      )}
      {/* «Продолжить» — визуальный secondary-button (без вложенного интерактива) */}
      <span
        className={cn(
          "ds-btn ds-btn--m ds-btn--secondary mt-2",
          centered ? "self-center" : "self-start",
        )}
      >
        <span className="ds-btn__label">{actionLabel}</span>
      </span>

      {illustrationSrc != null && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={illustrationSrc}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-4 right-4 size-24 opacity-90 md:bottom-6 md:right-8"
        />
      )}
    </Link>
  );
}
