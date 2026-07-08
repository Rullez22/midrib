"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * SideChatLayout — контент кабинета + правый боковой чат с кнопкой-раздвижением
 * (Figma 2087-745353). Рендерит фрагмент «контент + <aside> с чатом», поэтому
 * экран сохраняет свой <main className="flex …">.
 *
 * Кнопка на левой границе чата разворачивает его во всю ширину области контента:
 * контент скрывается (xl), чат растягивается (flex-1), и его левая граница
 * сливается с правой линией бокового меню. Используется на всех экранах с чатом.
 */

function ChatExpandIcon({ expanded, className }: { expanded: boolean; className?: string }) {
  // Свёрнут → шевроны наружу «‹ ›» (развернуть); развёрнут → внутрь «› ‹» (свернуть).
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      {expanded ? (
        <>
          <path d="M5 8l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 8l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path d="M9 8 5 12l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 8l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

export interface SideChatLayoutProps {
  /** Основной контент экрана (профиль подразделения и т.п.). */
  content: ReactNode;
  /** Чат справа (<ChatWindow …>). */
  chat: ReactNode;
  /** Классы контейнера контента. По умолчанию — стандартные отступы кабинета. */
  contentClassName?: string;
  /** sticky-смещение и высота чата (под фикс-шапку). По умолчанию — во всю высоту. */
  stickyTop?: string;
  chatHeight?: string;
  /** Управляемое состояние раскрытия чата (напр. чтобы скрыть панель сайдбара). */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function SideChatLayout({
  content,
  chat,
  contentClassName = "px-5 pb-8 pt-2 md:px-[50px]",
  stickyTop = "0px",
  chatHeight = "100vh",
  expanded: expandedProp,
  onExpandedChange,
}: SideChatLayoutProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = expandedProp ?? internalExpanded;
  const setExpanded = (next: boolean) => {
    if (onExpandedChange) onExpandedChange(next);
    else setInternalExpanded(next);
  };

  return (
    <>
      {!expanded && <div className={cn("min-w-0 flex-1", contentClassName)}>{content}</div>}
      <aside
        className={cn(
          // z-40 — выше сайдбара (z-30), иначе кнопка-раздвижение (торчит влево на
          // левой границе чата) прячется под рейкой, когда чат дошёл до неё.
          "sticky z-40 hidden w-[327px] shrink-0 xl:block",
          // Развёрнут: чат тянется на всю ширину, а его левая граница наезжает
          // на правую линию бокового меню (-ml-px) — получается одна линия.
          expanded && "xl:-ml-px xl:w-auto xl:flex-1",
        )}
        style={{ top: stickyTop, height: chatHeight }}
      >
        <div className="relative h-full">
          <button
            type="button"
            aria-label={expanded ? "Свернуть чат" : "Развернуть чат"}
            aria-pressed={expanded}
            onClick={() => setExpanded(!expanded)}
            className="absolute left-0 top-[72px] z-20 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-[#fff] text-foreground-subtle shadow-sm transition-colors hover:text-foreground"
          >
            <ChatExpandIcon expanded={expanded} className="size-4" />
          </button>
          {chat}
        </div>
      </aside>
    </>
  );
}
