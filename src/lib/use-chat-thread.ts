"use client";

import { useCallback, useState, type ReactNode } from "react";

/**
 * useChatThread — отправка сообщений в чате.
 *
 * Чаты платформы показывают историю из конфига/пропса, а MessageComposer до
 * этого звали без onSend — поэтому отправить сообщение было нельзя нигде.
 * Хук держит дописанное пользователем поверх исходной истории: она остаётся
 * источником сценария, локальный стейт — только то, что добавили сами.
 *
 * @example
 *   const { messages, send } = useChatThread(cabinet.chatMessages);
 *   <MessageComposer onSend={send} />
 *   {messages.map((m, i) => <ChatBubble key={i} me={m.me} time={m.time}>{m.text}</ChatBubble>)}
 */

export interface ChatThreadMsg {
  me?: boolean;
  text: ReactNode;
  time?: ReactNode;
}

/** Текущее время «12:05». */
function nowTime() {
  // Вызывается только из обработчика отправки, не из рендера: new Date() в
  // рендере даёт разное время на сервере и клиенте → hydration mismatch.
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function useChatThread<T extends ChatThreadMsg>(initial: readonly T[] = []) {
  const [sent, setSent] = useState<ChatThreadMsg[]>([]);

  const send = useCallback((text: string) => {
    const value = text.trim();
    if (!value) return;
    setSent((prev) => [...prev, { me: true, text: value, time: nowTime() }]);
  }, []);

  const messages: ChatThreadMsg[] = [...initial, ...sent];

  return {
    messages,
    send,
    /** Сколько сообщений дописано в этой сессии (для анимации появления). */
    sentCount: sent.length,
    /** Индекс, с которого начинаются свои сообщения. */
    firstSentIndex: initial.length,
  };
}
