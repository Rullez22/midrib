"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FeedMoreIcon, FeedPlayIcon, FeedDocumentIcon } from "./feed-icons";

/**
 * FeedPost — карточка поста ленты (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Posts — post 1…6 (1751:257501 фото, 257546 видео,
 * 257599 галерея, 257632 видео+фото, 257665 без медиа, 257975 документы). 1:1.
 *
 * Бордерная карточка (white, grey-90, r4, p24): шапка с нижним разделителем
 * (заголовок · дата · kebab) → текст → медиа. Медиа задаётся через `media`:
 *   image     — одно фото на всю ширину (h259)
 *   video     — одно видео на всю ширину + круг-play
 *   gallery    — ряд превью 200×200 (каждое может быть видео) + «+N»
 *   documents — список строк-файлов (иконка + название)
 * Текст и медиа опциональны (вариант «без медиа» — только заголовок + текст).
 *
 * @example
 *   <FeedPost title="Заголовок" date="Август 23, 2019" text="…"
 *     media={{ type: "image", src: url }} onMenu={openMenu} />
 *   <FeedPost title="…" media={{ type: "gallery", items: [{src}, {src, video: true}], total: 8 }} />
 *   <FeedPost title="…" media={{ type: "documents", files: ["Лунная соната", "Дневник №1"] }} />
 */

export interface FeedGalleryItem {
  src: string;
  /** Показать оверлей play (элемент — видео). */
  video?: boolean;
  alt?: string;
}

export type FeedMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; poster: string; alt?: string }
  | { type: "gallery"; items: FeedGalleryItem[]; total?: number }
  | { type: "documents"; files: ReactNode[] };

export interface FeedPostProps {
  title: ReactNode;
  /** Дата/время публикации (справа в шапке). */
  date?: ReactNode;
  /** Текст поста. */
  text?: ReactNode;
  /** Медиа-вложение. */
  media?: FeedMedia;
  /** Клик по kebab-меню (три точки). */
  onMenu?: () => void;
  className?: string;
}

/** Круглая кнопка-play поверх видео-превью. */
function PlayBadge() {
  return (
    <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white pl-0.5 text-foreground shadow-[0_2px_8px_rgba(36,43,50,0.25)]">
      <FeedPlayIcon />
    </span>
  );
}

function FeedMediaView({ media }: { media: FeedMedia }) {
  if (media.type === "image") {
    return (
      <div className="h-[259px] w-full overflow-hidden rounded-[4px]">
        <img src={media.src} alt={media.alt ?? ""} className="size-full object-cover" />
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className="relative h-[259px] w-full overflow-hidden rounded-[4px]">
        <img src={media.poster} alt={media.alt ?? ""} className="size-full object-cover" />
        <PlayBadge />
      </div>
    );
  }

  if (media.type === "gallery") {
    const shown = media.items.slice(0, 3);
    const extra = media.total != null ? media.total - shown.length : 0;
    return (
      <div className="flex w-full items-center gap-4">
        {shown.map((it, i) => (
          <div key={i} className="relative size-[200px] shrink-0 overflow-hidden rounded-[4px]">
            <img src={it.src} alt={it.alt ?? ""} className="size-full object-cover" />
            {it.video && <PlayBadge />}
          </div>
        ))}
        {extra > 0 && (
          <span className="ds-p2 shrink-0 text-primary">+ {extra}</span>
        )}
      </div>
    );
  }

  // documents
  return (
    <div className="flex w-full flex-col gap-2">
      {media.files.map((file, i) => (
        <div
          key={i}
          className="flex h-10 items-center gap-2 rounded-[4px] border border-border bg-[var(--color-grey-10)] px-4"
        >
          <span className="shrink-0 text-foreground-muted">
            <FeedDocumentIcon />
          </span>
          <span className="ds-caption truncate text-foreground">{file}</span>
        </div>
      ))}
    </div>
  );
}

export function FeedPost({ title, date, text, media, onMenu, className }: FeedPostProps) {
  return (
    <div
      className={cn(
        // ds-row — тот же отклик, что у строк документов (лифт мягкой тени).
        "ds-row flex w-full flex-col gap-4 rounded-[4px] border border-border bg-surface p-6 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {/* Шапка: заголовок · дата · kebab, с нижним разделителем */}
      <div className="flex w-full items-start justify-between gap-4 border-b border-border pb-2">
        <span className="ds-p2 text-foreground">{title}</span>
        <span className="flex shrink-0 items-center gap-4">
          {date != null && <span className="ds-caption text-foreground-subtle">{date}</span>}
          <button
            type="button"
            aria-label="Меню поста"
            className="-mr-1 flex size-6 items-center justify-center text-foreground-subtle transition-colors hover:text-foreground-muted"
            onClick={onMenu}
          >
            <FeedMoreIcon />
          </button>
        </span>
      </div>

      {text != null && <p className="ds-p3 text-foreground-muted">{text}</p>}

      {media != null && <FeedMediaView media={media} />}
    </div>
  );
}
