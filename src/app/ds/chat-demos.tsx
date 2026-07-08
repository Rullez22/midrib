"use client";

/**
 * Демки Chat (композит «чат») для витрины /ds.
 * Воспроизводят фреймы Figma «UI фичи» / чат:
 *   buble 798:0 · buble my 797:74339 · header 797:74348 ·
 *   header(Профиль) 1330:155951 · Аватар 1333:151505 · line 797:74223 ·
 *   окно чата 1153:108684 / 1724:251032 · empty 1728:251847 · чат-лист 796:74478.
 */
import { useState } from "react";
import {
  ChatBubble,
  ChatTopBar,
  ChatSheetHeader,
  ChatThread,
  ChatWindow,
  ContactChip,
  ContactCard,
  MessageComposer,
  EmptyState,
  Tabs,
  Tab,
  Item,
  Badge,
  Text,
} from "@/components/ds";

/* Градиентный аватар-плейсхолдер (без внешних зависимостей). */
function avatar(from: string, to: string) {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="26" r="11" fill="#fff" opacity="0.92"/><path d="M13 60c0-12 9-19 19-19s19 7 19 19z" fill="#fff" opacity="0.92"/></svg>`,
    )
  );
}
const AVA_A = avatar("#3996fc", "#512da8");
const AVA_B = avatar("#e5424d", "#e86300");
const AVA_C = avatar("#35b23e", "#57a3ae");

/* Иллюстрация пустого чата (inline SVG, токены MIDHUB). */
function EmptyChatIcon() {
  return (
    <svg viewBox="0 0 96 64" fill="none" aria-hidden className="h-16 w-24">
      <path d="M30 30h44a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H30a4 4 0 0 1-4-4V34a4 4 0 0 1 4-4z"
        fill="var(--color-blue-midhub-200)" />
      <path d="M26 34l26 16 26-16" stroke="var(--color-white)" strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="14" r="6" fill="var(--color-dark-900)" />
      <path d="M20 20v8" stroke="var(--color-dark-900)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="78" cy="12" r="6" fill="var(--color-blue-midhub-500)" />
      <path d="M78 18v8" stroke="var(--color-blue-midhub-500)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* Лента сообщений (повторяется в окнах). */
function Thread() {
  return (
    <ChatThread>
      <ChatBubble me time="12:01">
        Commodo tristique sapien tellus pellentesque. Nunc amet bibendum convallis quisqu
      </ChatBubble>
      <ChatBubble me time="12:02">
        Commodo tristique sapien tellus
      </ChatBubble>
      <ChatBubble avatar={AVA_A} time="12:03">
        Commodo tristique sapien tellus pellentesque. Nunc amet bibendum convallis quisqu
      </ChatBubble>
    </ChatThread>
  );
}

const CHATS = [
  { id: "a", name: "Анна Грум", avatar: AVA_A, unread: 1 },
  { id: "b", name: "Иван Дорн", avatar: AVA_B },
  { id: "c", name: "Роберто Карлос", avatar: AVA_C },
];

export function ChatDemos() {
  const [tab, setTab] = useState("payers");
  const [active, setActive] = useState("a");

  return (
    <div className="flex flex-col gap-8 rounded-xl border border-border p-5">
      {/* Окна чата — frames 1153:108684 / 1724:251032 / 1728:251847 */}
      <div className="flex flex-wrap gap-6">
        <div className="flex w-[360px] flex-col gap-3">
          <Text variant="caption-up" tone="subtle">ChatWindow — аватар + имя</Text>
          <ChatWindow
            height="560px"
            topBar={<ChatTopBar title="Анна Грум" avatar={AVA_A} onBack={() => {}} />}
            footer={<MessageComposer placeholder="Сообщение" />}
          >
            <Thread />
          </ChatWindow>
        </div>

        <div className="flex w-[360px] flex-col gap-3">
          <Text variant="caption-up" tone="subtle">ChatWindow — заголовок + подзаголовок</Text>
          <ChatWindow
            height="560px"
            topBar={<ChatTopBar title="Title" subtitle="Subtitle" onBack={() => {}} />}
            footer={<MessageComposer placeholder="Сообщение" />}
          >
            <Thread />
          </ChatWindow>
        </div>

        <div className="flex w-[360px] flex-col gap-3">
          <Text variant="caption-up" tone="subtle">ChatWindow — пусто</Text>
          <ChatWindow
            height="560px"
            topBar={<ChatTopBar title="Чат" onBack={() => {}} />}
            footer={<MessageComposer placeholder="Сообщение" />}
          >
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={<EmptyChatIcon />}
                title="Нет сообщений. Необходимо выбрать чат."
              />
            </div>
          </ChatWindow>
        </div>
      </div>

      {/* Чат-лист (Tabs + Item + Badge) — frame 796:74478 */}
      <div className="flex flex-wrap gap-10">
        <div className="flex w-[247px] flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Чат-лист (Tabs + Item)</Text>
          <div className="rounded-[4px] border border-border">
            <Tabs value={tab} onValueChange={setTab} variant="basic" size="l">
              <Tab value="payers">Пайщик</Tab>
              <Tab value="directions">Направления</Tab>
            </Tabs>
            <div className="flex flex-col">
              {CHATS.map((c) => (
                <Item
                  key={c.id}
                  size="s"
                  bordered={false}
                  interactive
                  selected={active === c.id}
                  onClick={() => setActive(c.id)}
                  leading={
                    <span className="size-8 overflow-hidden rounded-full">
                      <img src={c.avatar} alt="" className="size-full object-cover" />
                    </span>
                  }
                  trailing={c.unread ? <Badge color="blue">{c.unread}</Badge> : undefined}
                >
                  {c.name}
                </Item>
              ))}
            </div>
          </div>
        </div>

        {/* Профиль собеседника — frames 1333:151505 + 1330:155951 */}
        <div className="flex w-[327px] flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Профиль (ChatSheetHeader + ContactCard)</Text>
          <div className="overflow-hidden rounded-[4px] border border-border">
            <ChatSheetHeader title="Профиль" onClose={() => {}} />
            <div className="px-6 py-8">
              <ContactCard
                avatar={AVA_A}
                name="Антонов Илья"
                role="Председатель правления кооператива"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Отдельные компоненты */}
      <div className="flex flex-wrap items-start gap-10">
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">ChatBubble</Text>
          <div className="flex w-[300px] flex-col gap-4">
            <ChatBubble avatar={AVA_A} time="12:01">
              Commodo tristique sapien tellus pellentesque. Nunc amet bibendum convallis quisqu
            </ChatBubble>
            <ChatBubble me time="12:01">
              Commodo tristique sapien tellus pellentesque. Nunc amet bibendum convallis quisqu
            </ChatBubble>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">ChatBubble — группа с отправителем</Text>
          <div className="flex w-[300px] flex-col gap-2">
            <ChatBubble avatar={AVA_B} sender="Холмов" time="12:01">
              Commodo tristique sapien tellus pellentesque.
            </ChatBubble>
            <ChatBubble reserveAvatar time="12:02">
              Nunc amet bibendum convallis quisqu
            </ChatBubble>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">ChatTopBar</Text>
          <div className="flex w-[327px] flex-col gap-4">
            <div className="rounded-[4px] border border-border">
              <ChatTopBar title="Title" subtitle="Subtitle" onBack={() => {}} />
            </div>
            <div className="rounded-[4px] border border-border">
              <ChatTopBar title="Анна Грум" avatar={AVA_A} onBack={() => {}} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">ContactChip</Text>
          <ContactChip avatar={AVA_C} name="ИП Анна Иванова" />
        </div>
      </div>
    </div>
  );
}
