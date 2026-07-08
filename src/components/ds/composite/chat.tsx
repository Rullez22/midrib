"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Chat — компоненты чата (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / чат:
 *   buble 798:0 · buble my 797:74339 · header 797:74348 ·
 *   header(Профиль) 1330:155951 · Аватар 1333:151505 · line 797:74223 ·
 *   окно чата 1153:108684 / 1724:251032 · empty 1728:251847. Стили 1:1.
 *
 * Экспортирует:
 *   • <ChatBubble>      — пузырь сообщения (me / them, аватар, время, отправитель).
 *   • <ChatTopBar>      — верхняя панель (назад + заголовок/подзаголовок или аватар+имя).
 *   • <ChatSheetHeader> — шапка модалки профиля (заголовок + ✕).
 *   • <ChatThread>      — лента сообщений (скролл, прижата вниз).
 *   • <ChatWindow>      — окно: topbar + thread + поле ввода (slot `footer`).
 *   • <ContactChip>     — аватар + имя (компактно).
 *   • <ContactCard>     — крупный аватар + имя + роль.
 *
 * Поле ввода — <MessageComposer>, пустое состояние — <EmptyState>
 * (см. демо chat-demos.tsx). Чат-лист — <Tabs> + <Item> + <Badge>.
 */

/* ── Иконки (inline SVG, тон через currentColor) ───────────────── */
function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 7 9.5 12l5 5" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
      <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================================
   ChatBubble — пузырь сообщения
   ============================================================ */
export interface ChatBubbleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Текст сообщения. */
  children: ReactNode;
  /** Исходящее сообщение (моё) — синий пузырь справа. */
  me?: boolean;
  /** Время отправки (например «12:01»). */
  time?: ReactNode;
  /** URL аватара (для входящих). */
  avatar?: string;
  /** Имя отправителя над пузырём (для входящих групп). */
  sender?: ReactNode;
  /** Зарезервировать место под аватар без картинки (выравнивание группы). */
  reserveAvatar?: boolean;
  /** Максимальная ширина пузыря (CSS). По умолчанию 320px. */
  maxWidth?: string;
}

export function ChatBubble({
  children,
  me = false,
  time,
  avatar,
  sender,
  reserveAvatar = false,
  maxWidth,
  className,
  style,
  ...rest
}: ChatBubbleProps) {
  const vars = maxWidth
    ? ({ ...style, "--chat-bubble-max": maxWidth } as CSSProperties)
    : style;
  return (
    <div
      className={cn(
        "ds-chat-bubble",
        me ? "ds-chat-bubble--me" : "ds-chat-bubble--them",
        className,
      )}
      style={vars}
      {...rest}
    >
      {!me && (avatar || reserveAvatar) && (
        <span
          className={cn(
            "ds-chat-bubble__avatar",
            !avatar && "ds-chat-bubble__avatar--ghost",
          )}
          aria-hidden
        >
          {avatar && <img src={avatar} alt="" />}
        </span>
      )}
      <div className="ds-chat-bubble__col">
        {!me && sender != null && (
          <span className="ds-chat-bubble__sender">{sender}</span>
        )}
        <div className="ds-chat-bubble__msg">{children}</div>
        {time != null && <span className="ds-chat-bubble__time">{time}</span>}
      </div>
    </div>
  );
}

/* ============================================================
   ChatTopBar — верхняя панель чата
   ============================================================ */
export interface ChatTopBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Заголовок (имя собеседника / название чата). */
  title: ReactNode;
  /** Подзаголовок под заголовком (например статус). Игнорируется при `avatar`. */
  subtitle?: ReactNode;
  /** URL аватара — рендерит «аватар + имя» по центру вместо стопки. */
  avatar?: string;
  /** Клик по стрелке «назад». Без него стрелка не рендерится. */
  onBack?: () => void;
  /** Подпись кнопки назад для a11y. */
  backLabel?: string;
}

export function ChatTopBar({
  title,
  subtitle,
  avatar,
  onBack,
  backLabel = "Назад",
  className,
  ...rest
}: ChatTopBarProps) {
  return (
    <div className={cn("ds-chat-topbar", className)} {...rest}>
      {onBack && (
        <button
          type="button"
          className="ds-chat-topbar__back"
          aria-label={backLabel}
          onClick={onBack}
        >
          <ArrowLeftIcon />
        </button>
      )}
      <div className="ds-chat-topbar__center">
        {avatar && (
          <span className="ds-chat-topbar__avatar" aria-hidden>
            <img src={avatar} alt="" />
          </span>
        )}
        <span className="ds-chat-topbar__titles">
          <span className="ds-chat-topbar__title">{title}</span>
          {!avatar && subtitle != null && (
            <span className="ds-chat-topbar__subtitle">{subtitle}</span>
          )}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   ChatSheetHeader — шапка модалки профиля (заголовок + ✕)
   ============================================================ */
export interface ChatSheetHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  /** Клик по ✕. */
  onClose?: () => void;
  closeLabel?: string;
}

export function ChatSheetHeader({
  title,
  onClose,
  closeLabel = "Закрыть",
  className,
  ...rest
}: ChatSheetHeaderProps) {
  return (
    <div className={cn("ds-chat-sheethead", className)} {...rest}>
      <span className="ds-chat-sheethead__title">{title}</span>
      {onClose && (
        <button
          type="button"
          className="ds-chat-sheethead__close"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

/* ============================================================
   ChatThread — лента сообщений (скролл, прижата вниз)
   ============================================================ */
export interface ChatThreadProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function ChatThread({ children, className, ...rest }: ChatThreadProps) {
  return (
    <div className={cn("ds-chat-thread", className)} {...rest}>
      <div className="ds-chat-thread__inner">{children}</div>
    </div>
  );
}

/* ============================================================
   ChatWindow — окно чата (topbar + thread + поле ввода)
   ============================================================ */
export interface ChatWindowProps extends HTMLAttributes<HTMLDivElement> {
  /** Верхняя панель (<ChatTopBar>). */
  topBar?: ReactNode;
  /** Лента сообщений (<ChatThread> c пузырями) или пустое состояние. */
  children?: ReactNode;
  /** Поле ввода (<MessageComposer>). */
  footer?: ReactNode;
  /** Высота окна (CSS). По умолчанию 640px. */
  height?: string;
}

export function ChatWindow({
  topBar,
  children,
  footer,
  height,
  className,
  style,
  ...rest
}: ChatWindowProps) {
  const vars = height
    ? ({ ...style, "--chat-window-h": height } as CSSProperties)
    : style;
  return (
    <div className={cn("ds-chat-window", className)} style={vars} {...rest}>
      {topBar}
      {children}
      {footer != null && <div className="ds-chat-window__foot">{footer}</div>}
    </div>
  );
}

/* ============================================================
   ContactChip — аватар + имя (компактно)
   ============================================================ */
export interface ContactChipProps extends HTMLAttributes<HTMLDivElement> {
  name: ReactNode;
  avatar?: string;
}

export function ContactChip({
  name,
  avatar,
  className,
  ...rest
}: ContactChipProps) {
  return (
    <div className={cn("ds-contact-chip", className)} {...rest}>
      <span className="ds-contact-chip__avatar" aria-hidden>
        {avatar && <img src={avatar} alt="" />}
      </span>
      <span className="ds-contact-chip__name">{name}</span>
    </div>
  );
}

/* ============================================================
   ContactCard — крупный аватар + имя + роль (профиль)
   ============================================================ */
export interface ContactCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "role"> {
  name: ReactNode;
  /** Роль / должность под именем. */
  role?: ReactNode;
  avatar?: string;
}

export function ContactCard({
  name,
  role,
  avatar,
  className,
  ...rest
}: ContactCardProps) {
  return (
    <div className={cn("ds-contact-card", className)} {...rest}>
      <span className="ds-contact-card__avatar" aria-hidden>
        {avatar && <img src={avatar} alt="" />}
      </span>
      <span className="ds-contact-card__text">
        <span className="ds-contact-card__name">{name}</span>
        {role != null && <span className="ds-contact-card__role">{role}</span>}
      </span>
    </div>
  );
}
