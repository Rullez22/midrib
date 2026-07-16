"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, HeaderArrowLeftIcon, ChatBubble, MessageComposer } from "@/components/ds";
import { useChatThread } from "@/lib/use-chat-thread";
import { CoopRail } from "./coop-sidebar";
import { CooperativeInfo } from "./cooperative-info";
import { useEnsureAccountsReady, useRegFlow } from "./reg-flow";

/**
 * ValidatorChatScreen — «Уставные документы»: документ кооператива + чат с
 * валидатором. Открывается из жёлтого баннера «Перейти к документам» или клика по
 * документу. Источник: Figma 2537:325679 (чат) / 2542:437478 (чат свёрнут).
 *
 * Reuse DS: CoopRail · CooperativeInfo (инфо/пайщики/документы) · ChatBubble ·
 * Button. Чат сворачивается кликом по шапке; крестик → финальный экран счетов.
 *
 * @param backHref Назад (←) — на счета.
 * @param finalHref Крестик — финальный экран счетов («Отвалидирован» + юрисдикция).
 */

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}


export function ValidatorChatScreen({ backHref, finalHref }: { backHref?: string; finalHref?: string }) {
  const router = useRouter();
  const flow = useRegFlow();
  useEnsureAccountsReady();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());
  // Крестик → документ отвалидирован, переход на финальный экран счетов.
  const close = () => {
    flow.completeValidation();
    router.push(finalHref ?? backHref ?? "/");
  };
  // Чат: 0 — только ты («1 Участник», пусто) · 1 — присоединился валидатор
  // («2 Участника» + переписка) · 2 — чат свёрнут. Клик по шапке чата продвигает.
  // Когда документ уже отвалидирован (validated, баннер «на юрисдикцию») — чат не
  // нужен: открываем сразу свёрнутым (только документ + крестик).
  const [chatPhase, setChatPhase] = useState(() => (flow.validationStage === "validated" ? 2 : 0));
  const chatOpen = chatPhase < 2;
  const advanceChat = () => setChatPhase((p) => Math.min(p + 1, 2));
  // Сценарная переписка тут захардкожена в разметке, поэтому хук держит только
  // дописанное пользователем — оно рендерится следом за ней.
  const { messages: myMessages, send } = useChatThread();

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Сверху: чат открыт → стрелка назад слева; чат свёрнут → крестик
              справа (как на экранах вопросов/настройки) → финальный экран. */}
          {chatOpen ? (
            <Button variant="ghost" size="m" icon={<HeaderArrowLeftIcon />} aria-label="Назад" onClick={goBack} className="self-start" />
          ) : (
            <Button variant="negative-sec" size="m" icon={<CloseIcon />} aria-label="Закрыть" onClick={close} className="self-end" />
          )}

          {/* Документ (слева: шапка-карта + инфо) + чат справа — в один уровень. */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              {/* Блок-карта «Уставные документы» (Figma 2541:432813). Кнопка
                  «Отменить валидацию» — только когда чат открыт. */}
              <div className="flex min-h-[66px] items-center justify-between gap-4 rounded-[4px] border border-border bg-[var(--color-grey-20)] px-6 py-3">
                <span className="ds-p3-medium text-foreground">Уставные документы</span>
                {chatOpen && <Button variant="negative-sec" size="m">Отменить валидацию</Button>}
              </div>

              <CooperativeInfo />
            </div>

            {chatOpen && (
              <div className="flex w-full flex-none flex-col overflow-hidden rounded-[4px] border border-border bg-surface lg:min-h-[640px] lg:w-[360px] lg:self-stretch">
                {/* Шапка чата — клик продвигает (солист → переписка → свернуть) */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-1 border-b border-border px-4 py-3 text-foreground"
                  onClick={advanceChat}
                >
                  <span className="ds-p3-medium">{chatPhase === 0 ? "1 Участник" : "2 Участника"}</span>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>

                {/* Лента сообщений (появляется, когда подключился валидатор) */}
                <div className="flex flex-1 flex-col justify-end gap-3 overflow-y-auto p-4">
                  {chatPhase >= 1 && (
                    <>
                      <ChatBubble me time="12:01">Привет, я отправил тебе устав</ChatBubble>
                      <ChatBubble me time="12:01">Проверишь?</ChatBubble>
                      <ChatBubble time="12:03" reserveAvatar>Привет</ChatBubble>
                      <ChatBubble time="12:03" reserveAvatar>Хорошо я проверю</ChatBubble>
                      <ChatBubble time="12:03" reserveAvatar>Спасибо</ChatBubble>
                    </>
                  )}
                  {/* Дописанное пользователем — после сценарного диалога. */}
                  {myMessages.map((m, i) => (
                    <ChatBubble key={i} me time={m.time} className="ds-content">{m.text}</ChatBubble>
                  ))}
                </div>

                {/* Ввод — DS-композит (было самодельное input+кнопка без отправки). */}
                <div className="border-t border-border p-3">
                  <MessageComposer placeholder="Сообщение" onSend={send} className="border-0 p-0" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
