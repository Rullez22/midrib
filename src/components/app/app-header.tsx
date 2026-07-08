"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ds";
import { AvatarPersonIcon, ArrowLeftIcon } from "./app-icons";

/**
 * AppHeader — верхняя шапка экрана мобильной апки MIDHUB.
 * Макеты: аватар/back (слева) · заголовок (+подзаголовок, по центру) ·
 * действия (справа). Стиль — MIDHUB (Articulat, токены).
 *
 * `pt-11` — safe-area под прозрачный iOS-статусбар: серый фон шапки
 * заходит под статусбар, так что полоски сверху нет.
 *
 * Выравнивание по верху (`items-start`): иконки и ПЕРВАЯ строка заголовка
 * на одном уровне; при переносе на 2 строки вторая опускается вниз, а серый
 * фон растёт вместе с ней (высота шапки не фиксирована). `h-7` у слотов
 * иконок = line-height h5 (28px) → центры иконок совпадают с первой строкой.
 */
export interface AppHeaderProps {
  title: string;
  /** Подзаголовок под заголовком (напр. «Доступно: …»). */
  subtitle?: string;
  /** Действия справа (иконки-кнопки). */
  actions?: ReactNode;
  /** Показать кнопку «назад» слева (вместо аватара). */
  showBack?: boolean;
  /** Куда вести «назад». По умолчанию — history back. Задаётся, когда
   *  экран может быть открыт из разных мест, но «назад» всегда в одно. */
  backHref?: string;
  /** Аватар слева (по умолчанию — заглушка-силуэт). Игнор при showBack. */
  avatar?: ReactNode;
  /** Убрать нижнюю границу — когда ниже идёт таб-бар (тоже серый) и
   *  сепаратор нужен под ним, а не под шапкой. */
  flush?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  actions,
  showBack,
  backHref,
  avatar,
  flush,
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "relative shrink-0 bg-surface-muted px-4 pt-11",
        !flush && "border-b border-border",
      )}
    >
      <div className="flex items-start py-2.5">
        <div className="flex h-7 w-16 shrink-0 items-center">
          {showBack ? (
            <button
              type="button"
              aria-label="Назад"
              onClick={() => (backHref ? router.push(backHref) : router.back())}
              className="-ml-1 flex items-center text-foreground-muted"
            >
              <ArrowLeftIcon width={24} height={24} />
            </button>
          ) : (
            (avatar ?? (
              <Link
                href="/app/profile"
                aria-label="Профиль"
                className="flex items-center text-[var(--color-orange-300)]"
              >
                <AvatarPersonIcon width={28} height={28} />
              </Link>
            ))
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center text-center">
          <Text variant="h5">{title}</Text>
          {subtitle && (
            <Text variant="caption" tone="subtle">
              {subtitle}
            </Text>
          )}
        </div>

        <div className="flex h-7 w-16 shrink-0 items-center justify-end gap-4 text-foreground">
          {actions}
        </div>
      </div>
    </header>
  );
}
