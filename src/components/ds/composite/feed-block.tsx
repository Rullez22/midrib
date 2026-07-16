"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FeedComposerBar, FeedComposer, type FeedDraft } from "./feed-composer";
import { FeedPost, type FeedMedia } from "./feed-post";

/**
 * FeedBlock — «поделиться чем-то интересным» целиком: свёрнутая строка →
 * редактор → опубликованный пост в ленте.
 *
 * Зачем: FeedComposerBar и FeedComposer — презентационные, и все экраны звали
 * их как <FeedComposerBar avatar={…} /> без onOpen/onAction/onPublish. Блок не
 * раскрывался, поля никуда не сохранялись, пост не появлялся. Этот композит
 * связывает их и держит ленту, чтобы каждый экран не повторял одно и то же.
 *
 * Медиа: фото становятся картинкой/галереей поста, видео и документы —
 * списком файлов (FeedPost умеет оба вида).
 *
 * @example
 *   <FeedBlock avatar={me.avatar} posts={initial} />
 */

export interface FeedBlockPost {
  title: ReactNode;
  date?: ReactNode;
  text?: ReactNode;
  media?: FeedMedia;
}

export interface FeedBlockProps {
  avatar?: ReactNode;
  placeholder?: string;
  /** Уже опубликованные посты (сценарий экрана) — показываются под композером. */
  posts?: FeedBlockPost[];
  /** Автор поста в шапке, если заголовок не задан. */
  authorName?: string;
  className?: string;
}

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/** «20 мая 2025» — формат сценарных постов. */
function today() {
  // Вызывается только из обработчика публикации, не из рендера: new Date() в
  // рендере разошёлся бы между сервером и клиентом (hydration mismatch).
  // Собираем вручную, а не toLocaleDateString: тот добавляет «г.» в ru-RU
  // («16 июля 2026 г.»), и свой пост выбивался из ленты.
  const d = new Date();
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Файлы черновика → медиа поста. */
function toMedia(files: File[]): FeedMedia | undefined {
  if (!files.length) return undefined;
  const images = files.filter((f) => f.type.startsWith("image/"));
  const rest = files.filter((f) => !f.type.startsWith("image/"));

  if (images.length === 1 && !rest.length) {
    return { type: "image", src: URL.createObjectURL(images[0]), alt: images[0].name };
  }
  if (images.length > 1 && !rest.length) {
    return {
      type: "gallery",
      items: images.map((f) => ({ src: URL.createObjectURL(f), alt: f.name })),
      total: images.length,
    };
  }
  // Видео и документы показываем списком имён: FeedPost ждёт для видео постер-
  // картинку, а её из файла без декодирования не получить.
  return { type: "documents", files: files.map((f) => f.name) };
}

export function FeedBlock({ avatar, placeholder, posts = [], authorName, className }: FeedBlockProps) {
  const [open, setOpen] = useState(false);
  const [mine, setMine] = useState<FeedBlockPost[]>([]);
  // objectURL живут до выгрузки страницы — освобождаем на размонтировании.
  const urls = useRef<string[]>([]);

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const publish = (draft: FeedDraft) => {
    const media = toMedia(draft.files);
    if (media?.type === "image") urls.current.push(media.src);
    if (media?.type === "gallery") urls.current.push(...media.items.map((i) => i.src));

    setMine((prev) => [
      {
        title: draft.title || authorName || "Публикация",
        date: today(),
        text: draft.text,
        media,
      },
      ...prev,
    ]);
    setOpen(false);
  };

  const all = [...mine, ...posts];

  return (
    <div className={cn("flex w-full flex-col gap-5", className)}>
      {open ? (
        <FeedComposer
          className="ds-content"
          onPublish={publish}
          onCancel={() => setOpen(false)}
        />
      ) : (
        <FeedComposerBar
          avatar={avatar}
          placeholder={placeholder}
          onOpen={() => setOpen(true)}
          // Кнопки Фото/Видео/Документ раскрывают редактор — выбор файла живёт
          // в нём, чтобы приложенное было видно до публикации.
          onAction={() => setOpen(true)}
        />
      )}

      {all.map((p, i) => (
        <FeedPost
          key={i}
          title={p.title}
          date={p.date}
          text={p.text}
          media={p.media}
          // Свои посты появляются плавно; сценарные — сразу.
          className={i < mine.length ? "ds-content" : undefined}
        />
      ))}
    </div>
  );
}
