"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "../button";

/**
 * PartnerCard — горизонтальная промо-карточка партнёра-пайщика (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / «партнер-пайщик» (2205:230934). Стили 1:1.
 *
 * Плитка-аватар слева (обложка + круглый аватар 72, подпись-тег «Партнер-пайщик»)
 * + тело справа: заголовок (P3 Medium, dark-900), описание (P3 Regular, dark-800,
 * до 2 строк) и две кнопки — основное действие (primary S-32) и «Подробнее»
 * (tertiary link). Отличается от вертикальной промо-карточки SelectPart
 * горизонтальным layout и аватар-плиткой.
 *
 * @example
 *   <PartnerCard
 *     title="Кооператив Слонёнок"
 *     description="Совместные закупки и логистика для пайщиков…"
 *     onSelect={fn} onDetails={fn}
 *   />
 */

export interface PartnerCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** Тег под аватаром. По умолчанию «Партнер-пайщик». */
  tagLabel?: ReactNode;
  /** Аватар (img / инициалы). По умолчанию — серый круг. */
  avatar?: ReactNode;
  /** Обложка плитки. По умолчанию — градиент. */
  cover?: ReactNode;
  /** Подпись основной кнопки. По умолчанию «Выбрать пайщика». */
  selectLabel?: ReactNode;
  /**
   * Вид основной кнопки: "primary" (выбрать) или "danger" (красный контур —
   * «Отменить выбор» на карточке уже выбранного пайщика). По умолчанию primary.
   */
  selectVariant?: "primary" | "danger";
  /** Подпись ссылки. По умолчанию «Подробнее». */
  detailsLabel?: ReactNode;
  onSelect?: () => void;
  onDetails?: () => void;
  /** Скрыть только кнопку выбора, оставив ссылку «Подробнее» (read-only карточка). */
  hideSelect?: boolean;
  /** Скрыть кнопки действий (режим карточки-ссылки в списке организаций). */
  hideActions?: boolean;
  /** Клик по всей карточке (открыть профиль). Делает карточку кликабельной. */
  onOpen?: () => void;
  /** Обрезать описание до 2 строк. По умолчанию true. */
  clampDescription?: boolean;
  className?: string;
}

export function PartnerCard({
  title,
  description,
  tagLabel = "Партнер-пайщик",
  avatar,
  cover,
  selectLabel = "Выбрать пайщика",
  selectVariant = "primary",
  detailsLabel = "Подробнее",
  onSelect,
  onDetails,
  hideActions = false,
  hideSelect = false,
  onOpen,
  clampDescription = true,
  className,
}: PartnerCardProps) {
  return (
    <div
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={onOpen ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } } : undefined}
      className={cn(
        "flex w-full items-stretch gap-4 rounded-[4px] border border-border bg-white p-[7px]",
        onOpen && "ds-row cursor-pointer text-left",
        className,
      )}
    >
      {/* Плитка-профиль (Figma «профиль 2»): обои + аватар 56 + подпись/домен */}
      <div className="flex w-[142px] shrink-0 flex-col items-center overflow-hidden rounded-[4px] border border-border pb-1">
        <div className="relative h-[74px] w-full">
          {/* Обои — верхняя часть плитки */}
          <div className="h-[48px] w-full overflow-hidden bg-[var(--color-grey-20)]">
            {cover ?? (
              <div className="size-full bg-gradient-to-br from-[var(--color-blue-midhub-300)] via-[var(--color-purple-300)] to-[var(--color-cyan-400)]" />
            )}
          </div>
          {/* Аватар 56, по центру, на границе обоев */}
          <div className="absolute bottom-[8px] left-1/2 size-[56px] -translate-x-1/2 overflow-hidden rounded-full border-2 border-[#fff] bg-[var(--color-grey-20)]">
            {avatar ?? (
              <div className="flex size-full items-center justify-center text-foreground-subtle">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-8">
                  <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M5 19c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
        </div>
        <span className="ds-caption-medium flex min-h-[20px] w-full items-center justify-center px-2 text-center text-foreground">
          {tagLabel}
        </span>
      </div>

      {/* Тело */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-2 pr-4">
        <span className="ds-p3-medium text-foreground">{title}</span>
        {description != null && (
          <span className={cn("ds-p3 text-foreground-muted", clampDescription && "line-clamp-2")}>{description}</span>
        )}
        {!hideActions && (
          <div className="mt-2 flex items-center gap-6">
            {!hideSelect &&
              (selectVariant === "danger" ? (
                // Красная secondary: hover перебиваем на красный тинт — иначе от
                // .ds-btn--secondary прилетел бы синий фон под красной рамкой.
                <Button
                  size="s"
                  variant="secondary"
                  className="border-[color:var(--color-red-300)] text-[color:var(--color-red-300)] hover:border-[color:var(--color-red-400)] hover:bg-[color:var(--color-red-50)]"
                  onClick={onSelect}
                >
                  {selectLabel}
                </Button>
              ) : (
                <Button size="s" onClick={onSelect}>{selectLabel}</Button>
              ))}
            <Button size="s" variant="tertiary" link onClick={onDetails}>{detailsLabel}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
