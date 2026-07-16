"use client";

import { useState } from "react";
import {
  Input,
  ChatWindow,
  ChatTopBar,
  ChatThread,
  ChatBubble,
  MessageComposer,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { type LkChatItem } from "./lk-data";

/** Демо-лента открытого чата (Figma 1939:806833) — одинакова для всех чатов ЛК. */
const LK_THREAD: { me: boolean; time: string; text: string }[] = [
  { me: true, time: "10:12", text: "Добрый день! Отправил в подразделение смету на благоустройство территории — сумма вышла 118 600 ₽." },
  { me: true, time: "10:13", text: "Все счета приложил." },
  { me: false, time: "10:41", text: "Добрый день! Смету посмотрел. По статье «озеленение» валидатор попросит второй счёт — без него заявку не отвалидируют." },
  { me: true, time: "10:48", text: "Понял, запрошу у поставщика до конца недели." },
  { me: false, time: "11:02", text: "Тогда выношу вопрос на правление 22 апреля." },
  { me: true, time: "11:05", text: "Успеем, спасибо." },
];

/**
 * LkChatRoster — список чатов справа в ЛК (Figma 1857:649798 — пред. правления /
 * 1857:649802 — пайщик). Единственное различие между ролями: набор чатов.
 * Шапка: поиск + кнопка «написать». Строка: аватар/группа + имя + бейдж непрочит.
 *
 * Reuse DS: Input (поиск). Строки-ростер — локальные (композита-ростера в DS нет).
 */

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-4">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m14 14 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ComposeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-4">
      <path d="M4 13.5V16h2.5l7-7-2.5-2.5-7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m12.5 5 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GroupAvatar() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-blue-midhub-50,#eaf3fe)] text-primary">
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="size-5">
        <circle cx="7" cy="8" r="2.4" />
        <circle cx="13.5" cy="8.5" r="2" />
        <path d="M2.5 15c0-2.2 2-3.6 4.5-3.6s4.5 1.4 4.5 3.6z" />
        <path d="M12 11.6c2 0 4 1.1 4 3.1h-3.2c-.1-1.1-.5-2-1.2-2.8.1-.2.3-.3.4-.3Z" />
      </svg>
    </span>
  );
}

export function LkChatRoster({ items }: { items: LkChatItem[] }) {
  const [query, setQuery] = useState("");
  const [openChat, setOpenChat] = useState<LkChatItem | null>(null);
  const filtered = items.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  // Открытый чат — диалог (как в подразделении), но с кнопкой «Назад» к списку.
  if (openChat) {
    return (
      <ChatWindow
        height="100vh"
        className="rounded-none border-0 border-l border-border"
        topBar={
          <ChatTopBar
            title={openChat.name}
            subtitle={openChat.group ? "20 пайщиков" : undefined}
            onBack={() => setOpenChat(null)}
          />
        }
        footer={<MessageComposer placeholder="Сообщение" />}
      >
        <ChatThread>
          {LK_THREAD.map((m, i) => (
            <ChatBubble key={i} me={m.me} time={m.time} avatar={m.me ? undefined : openChat.avatar}>
              {m.text}
            </ChatBubble>
          ))}
        </ChatThread>
      </ChatWindow>
    );
  }

  return (
    <div className="flex h-full flex-col border-l border-border bg-[#fff]">
      {/* Шапка: поиск + написать */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-3">
        <div className="min-w-0 flex-1">
          <Input
            size="s"
            leftIcon={<SearchIcon />}
            placeholder="Поиск"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск по чатам"
          />
        </div>
        <button
          type="button"
          aria-label="Написать сообщение"
          className="flex size-9 shrink-0 items-center justify-center rounded-[6px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground"
        >
          <ComposeIcon />
        </button>
      </div>

      {/* Список чатов */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {filtered.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenChat(c)}
            className="flex items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-surface-sunken"
          >
            {c.group ? (
              <GroupAvatar />
            ) : (
              <span className="size-9 shrink-0 overflow-hidden rounded-full bg-surface-sunken">
                <img src={c.avatar} alt="" className="size-full object-cover" />
              </span>
            )}
            <span className="ds-p3 min-w-0 flex-1 truncate text-foreground">{c.name}</span>
            {c.unread ? (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-[#fff]">
                {c.unread}
              </span>
            ) : null}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="ds-p3 px-4 py-6 text-center text-foreground-subtle">Ничего не найдено</p>
        )}
      </div>
    </div>
  );
}
