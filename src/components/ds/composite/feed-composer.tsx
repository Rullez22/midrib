"use client";

import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "../button";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Tabs, Tab } from "../tabs";
import { UploadV2 } from "../upload-v2";
import {
  FeedPhotoIcon,
  FeedVideoIcon,
  FeedFileIcon,
  FeedArticleIcon,
} from "./feed-icons";

/**
 * FeedComposer / FeedComposerBar — создание поста ленты (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Add feed — create (1853:390905), create topic
 * (1745:256836), publication (1748:341703), document (1748:342107). Стили 1:1.
 *
 * Собран из готовых DS: Tabs / Input / Textarea / UploadV2 / Button (ghost s —
 * медиа-кнопки, primary m — «Опубликовать»). Новой вёрстки атомов нет.
 *
 * - `FeedComposerBar` — свёрнутая строка: аватар + поле-триггер + 4 кнопки
 *   (Фото · Видео · Документ · Написать статью). Клик раскрывает редактор.
 * - `FeedComposer` — раскрытый редактор с табами Статья / Публикация / Документ:
 *   заголовок + текст (или drop-зона документа) + медиа-кнопки + футер.
 *
 * @example
 *   <FeedComposerBar avatar={url} onAction={(k) => open(k)} />
 *   <FeedComposer defaultTab="article" onPublish={publish} />
 */

export type FeedComposerTab = "article" | "publication" | "document";
export type FeedComposerAction = "photo" | "video" | "document" | "article";

/* ── Свёрнутая строка ───────────────────────────────────────── */

export interface FeedComposerBarProps {
  /** Аватар: URL картинки или готовый узел. */
  avatar?: ReactNode;
  /** Плейсхолдер поля-триггера. */
  placeholder?: string;
  /** Клик по полю (открыть редактор). */
  onOpen?: () => void;
  /** Клик по кнопке (Фото / Видео / Документ / Написать статью). */
  onAction?: (kind: FeedComposerAction) => void;
  className?: string;
}

function Avatar({ avatar }: { avatar?: ReactNode }) {
  if (typeof avatar === "string") {
    return (
      <img
        src={avatar}
        alt=""
        className="size-12 shrink-0 rounded-full border-2 border-[#fff] object-cover"
      />
    );
  }
  if (avatar != null) return <span className="size-12 shrink-0">{avatar}</span>;
  return <span className="size-12 shrink-0 rounded-full bg-[var(--color-grey-90)]" />;
}

const BAR_ACTIONS: { kind: FeedComposerAction; label: string; icon: ReactNode }[] = [
  { kind: "photo", label: "Фото", icon: <FeedPhotoIcon /> },
  { kind: "video", label: "Видео", icon: <FeedVideoIcon /> },
  { kind: "document", label: "Документ", icon: <FeedFileIcon /> },
  { kind: "article", label: "Написать статью", icon: <FeedArticleIcon /> },
];

export function FeedComposerBar({
  avatar,
  placeholder = "Можете поделиться чем-то интересным ?",
  onOpen,
  onAction,
  className,
}: FeedComposerBarProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 rounded-[4px] border border-border bg-surface py-6",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-6">
        <Avatar avatar={avatar} />
        <Input
          className="min-w-0 flex-1"
          placeholder={placeholder}
          readOnly
          onClick={onOpen}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 px-6">
        {BAR_ACTIONS.map(({ kind, label, icon }) => (
          <Button
            key={kind}
            variant="ghost"
            size="s"
            iconLeft={icon}
            onClick={() => onAction?.(kind)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

/* ── Раскрытый редактор ─────────────────────────────────────── */

const TAB_CONFIG: Record<
  FeedComposerTab,
  { label: string; titlePlaceholder: string; textPlaceholder?: string }
> = {
  article: {
    label: "Статья",
    titlePlaceholder: "Название заголовока",
    textPlaceholder: "Текст статьи",
  },
  publication: {
    label: "Публикация",
    titlePlaceholder: "Название заголовока",
    textPlaceholder: "Поделитесь информацией",
  },
  document: {
    label: "Документ",
    titlePlaceholder: "Название публикации",
  },
};

const COMPOSER_MEDIA: { kind: FeedComposerAction; label: string; icon: ReactNode }[] = [
  { kind: "photo", label: "Фото", icon: <FeedPhotoIcon /> },
  { kind: "video", label: "Видео", icon: <FeedVideoIcon /> },
  { kind: "document", label: "Файл", icon: <FeedFileIcon /> },
];

/** Что набрал пользователь к моменту публикации. */
export interface FeedDraft {
  tab: FeedComposerTab;
  title: string;
  text: string;
  /** Приложенные файлы (фото/видео/документы). */
  files: File[];
}

/** Какие типы открывать в системном диалоге для каждой кнопки. */
const ACCEPT: Record<FeedComposerAction, string> = {
  photo: "image/*",
  video: "video/*",
  document: ".pdf,.doc,.docx,.xls,.xlsx,.txt",
  article: "",
};

export interface FeedComposerProps {
  /** Активный таб (неуправляемый режим). По умолчанию "article". */
  defaultTab?: FeedComposerTab;
  /** Активный таб (управляемый режим). */
  tab?: FeedComposerTab;
  /** Колбэк смены таба. */
  onTabChange?: (tab: FeedComposerTab) => void;
  /** Клик по медиа-кнопке (Фото / Видео / Файл) — уведомление; сам выбор файла
   *  композер берёт на себя. */
  onAction?: (kind: FeedComposerAction) => void;
  /** Выбор документа в drop-зоне (таб «Документ»). */
  onSelectFile?: () => void;
  /** Публикация. Получает набранное; после вызова поля очищаются. */
  onPublish?: (draft: FeedDraft) => void;
  /** Клик «Отмена». Если не задан — кнопки нет. */
  onCancel?: () => void;
  /** Текст основной кнопки футера. По умолчанию «Опубликовать». */
  publishLabel?: ReactNode;
  className?: string;
}

export function FeedComposer({
  defaultTab = "article",
  tab,
  onTabChange,
  onAction,
  onSelectFile,
  onPublish,
  onCancel,
  publishLabel = "Опубликовать",
  className,
}: FeedComposerProps) {
  const [internal, setInternal] = useState<FeedComposerTab>(defaultTab);
  // Поля были presentational (Input/Textarea без value) — набранное никуда не
  // шло, и «Опубликовать» ничего не публиковал. Держим черновик внутри.
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const active = tab ?? internal;
  const cfg = TAB_CONFIG[active];
  const isDocument = active === "document";
  // Пустой пост публиковать нечего.
  const canPublish = title.trim().length > 0 || text.trim().length > 0 || files.length > 0;

  const setTab = (v: string) => {
    const next = v as FeedComposerTab;
    if (tab === undefined) setInternal(next);
    onTabChange?.(next);
  };

  /** Кнопка медиа открывает системный диалог выбора файла. */
  const pick = (kind: FeedComposerAction) => {
    onAction?.(kind);
    const input = fileRef.current;
    if (!input) return;
    input.accept = ACCEPT[kind];
    input.value = ""; // иначе повторный выбор того же файла не даст change
    input.click();
  };

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length) setFiles((prev) => [...prev, ...picked]);
  };

  const publish = () => {
    if (!canPublish) return;
    onPublish?.({ tab: active, title: title.trim(), text: text.trim(), files });
    setTitle("");
    setText("");
    setFiles([]);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 overflow-hidden rounded-[4px] border border-border bg-surface pt-6",
        className,
      )}
    >
      <input ref={fileRef} type="file" multiple hidden onChange={onFiles} />

      <div className="flex flex-col gap-6 px-6">
        <Tabs variant="basic" size="m" value={active} onValueChange={setTab} aria-label="Тип поста">
          <Tab value="article">{TAB_CONFIG.article.label}</Tab>
          <Tab value="publication">{TAB_CONFIG.publication.label}</Tab>
          <Tab value="document">{TAB_CONFIG.document.label}</Tab>
        </Tabs>

        <Input
          size="m"
          placeholder={cfg.titlePlaceholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {isDocument ? (
          <UploadV2 onSelect={() => { onSelectFile?.(); pick("document"); }} />
        ) : (
          <>
            <Textarea
              size="l"
              placeholder={cfg.textPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="h-px w-full bg-border" />
          </>
        )}

        {/* Приложенное видно до публикации, каждый файл можно снять. */}
        {files.length > 0 && (
          <div className="ds-content flex flex-wrap gap-2">
            {files.map((f, i) => (
              <span
                key={`${f.name}-${i}`}
                className="ds-caption inline-flex max-w-full items-center gap-2 rounded-[4px] border border-border bg-surface-muted px-3 py-1.5 text-foreground-muted"
              >
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  aria-label={`Убрать ${f.name}`}
                  onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                  className="text-foreground-subtle transition-colors hover:text-foreground"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {!isDocument && (
        <div className="flex flex-wrap items-center gap-4 px-6">
          {COMPOSER_MEDIA.map(({ kind, label, icon }) => (
            <Button
              key={kind}
              variant="ghost"
              size="s"
              iconLeft={icon}
              onClick={() => pick(kind)}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-border bg-surface-muted px-6 py-4">
        {onCancel && (
          <Button variant="secondary" size="m" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button size="m" onClick={publish} disabled={!canPublish}>
          {publishLabel}
        </Button>
      </div>
    </div>
  );
}
