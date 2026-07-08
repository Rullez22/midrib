"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  BannerRouteIcon,
  BannerHourglassIcon,
  BannerTapIcon,
  BannerWaitingIcon,
  BannerReturnIcon,
  BannerInformationIcon,
} from "./banner-icons";

/**
 * Banner — информационный баннер MIDHUB DS.
 * Источник: Figma «UI Контролы» / Banner (node 1220:58705). Стили 1:1.
 *
 * Структура: иконка (32) + текст (заголовок P2-Medium + описание P3) + кнопка действия.
 * Тон задаёт фон, рамку, цвет иконки и заливку кнопки:
 *   info    — синий  (по умолчанию route-иконка, кнопка primary)
 *   neutral — серый  (hourglass, кнопка-лоадер при `loading`)
 *   warning — оранж  (tap,    оранжевая кнопка)
 *   caution — жёлтый (waiting, жёлтая кнопка)
 *   danger  — красный(return,  красная кнопка)
 *   note    — белый  (information, кнопка-контур blue)
 *
 * Ширина баннера тянется на 100% контейнера (Large/Small из Figma = ширина обёртки).
 *
 * @example
 *   <Banner tone="info" title="Заголовок" actionLabel="Действие" onAction={fn}>
 *     Описание баннера.
 *   </Banner>
 *   <Banner tone="neutral" title="Поиск валидатора" loading>…</Banner>
 *   <Banner tone="note" icon={null} action={<Button size="s" variant="secondary">…</Button>} />
 */

export type BannerTone =
  | "info"
  | "neutral"
  | "warning"
  | "caution"
  | "danger"
  | "note";

const TONE_CLASS: Record<BannerTone, string> = {
  info: "ds-banner--info",
  neutral: "ds-banner--neutral",
  warning: "ds-banner--warning",
  caution: "ds-banner--caution",
  danger: "ds-banner--danger",
  note: "ds-banner--note",
};

/** Иконка по умолчанию для каждого тона (можно переопределить через `icon`). */
const TONE_ICON: Record<BannerTone, ReactNode> = {
  info: <BannerRouteIcon />,
  neutral: <BannerHourglassIcon />,
  warning: <BannerTapIcon />,
  caution: <BannerWaitingIcon />,
  danger: <BannerReturnIcon />,
  note: <BannerInformationIcon />,
};

export interface BannerProps {
  /** Тон (палитра + иконка по умолчанию + цвет кнопки). По умолчанию "info". */
  tone?: BannerTone;
  /** Иконка слева (32×32). `undefined` → иконка тона, `null` → без иконки. */
  icon?: ReactNode;
  /** Заголовок (P2-Medium, dark 900). */
  title?: ReactNode;
  /** Описание (P3-Regular, dark 800). */
  children?: ReactNode;
  /** Подпись кнопки — рендерит кнопку в цвете тона. */
  actionLabel?: ReactNode;
  /** Клик по кнопке действия. */
  onAction?: () => void;
  /** Состояние загрузки: кнопка-спиннер (заблокирована). Перекрывает actionLabel. */
  loading?: boolean;
  /** Произвольный слот действия справа (перекрывает actionLabel/loading). */
  action?: ReactNode;
  className?: string;
}

function Spinner() {
  return (
    <span className="ds-banner__spinner" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Banner({
  tone = "info",
  icon,
  title,
  children,
  actionLabel,
  onAction,
  loading = false,
  action,
  className,
}: BannerProps) {
  const resolvedIcon = icon === undefined ? TONE_ICON[tone] : icon;

  let actionNode: ReactNode = action;
  if (actionNode === undefined) {
    if (loading) {
      actionNode = (
        <button type="button" className="ds-banner__btn ds-banner__btn--loading" disabled aria-busy>
          <Spinner />
        </button>
      );
    } else if (actionLabel != null) {
      actionNode = (
        <button type="button" className="ds-banner__btn" onClick={onAction}>
          {actionLabel}
        </button>
      );
    }
  }

  return (
    <div className={cn("ds-banner", TONE_CLASS[tone], className)} role="status">
      <div className="ds-banner__main">
        {resolvedIcon != null && (
          <span className="ds-banner__icon" aria-hidden>
            {resolvedIcon}
          </span>
        )}
        <div className="ds-banner__text">
          {title != null && <p className="ds-banner__title">{title}</p>}
          {children != null && <div className="ds-banner__desc">{children}</div>}
        </div>
      </div>
      {actionNode != null && <div className="ds-banner__action">{actionNode}</div>}
    </div>
  );
}
