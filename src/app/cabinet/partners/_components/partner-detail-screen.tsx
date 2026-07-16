"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChatWindow,
  ChatTopBar,
  ChatThread,
  ChatBubble,
  MessageComposer,
} from "@/components/ds";
import { useChatThread } from "@/lib/use-chat-thread";
import { PartnerSidebar } from "./partner-sidebar";
import { PartnerProfile } from "./partner-profile";
import { PartnerAccount } from "./partner-account";
import { SideChatLayout } from "../../_components/side-chat-layout";
import {
  CHAT_MESSAGES,
  CHAT_PEER_AVATAR,
  type Partner,
} from "./partners-data";

/**
 * PartnerDetailScreen — детальный экран партнёра (Figma 1857:649858 … 1857:649862).
 * Контекстный сайдбар + контент: режим «Профиль» (ProfileHeader + Общие сведения /
 * Лента) с чатом справа, либо режим «Счёт» (Взаиморасчеты/Документооборот/Артефакты).
 *
 * Reuse DS: ChatWindow / ChatTopBar / ChatThread / ChatBubble / MessageComposer.
 */

/** Чат с партнёром (правая колонка, p2–p4). */
function PartnerChat({ partner }: { partner: Partner }) {
  const { messages, send, firstSentIndex } = useChatThread(CHAT_MESSAGES);
  return (
    <ChatWindow
      height="100vh"
      className="rounded-none border-0 border-l border-border"
      topBar={<ChatTopBar title={partner.title} avatar={CHAT_PEER_AVATAR} />}
      footer={<MessageComposer placeholder="Сообщение" onSend={send} />}
    >
      <ChatThread>
        {messages.map((m, i) => (
          <ChatBubble
            key={i}
            me={m.me}
            time={m.time}
            avatar={m.me ? undefined : CHAT_PEER_AVATAR}
            className={i >= firstSentIndex ? "ds-content" : undefined}
          >
            {m.text}
          </ChatBubble>
        ))}
      </ChatThread>
    </ChatWindow>
  );
}

export function PartnerDetailScreen({ partner }: { partner: Partner }) {
  const router = useRouter();
  const [view, setView] = useState<"profile" | "account">("profile");

  return (
    <div className="flex min-h-screen bg-background">
      <PartnerSidebar
        partner={partner}
        view={view}
        onView={setView}
        onBack={() => router.push("/cabinet/partners")}
      />

      <main className="flex min-w-0 flex-1">
        {view === "profile" ? (
          <SideChatLayout content={<PartnerProfile partner={partner} />} chat={<PartnerChat partner={partner} />} />
        ) : (
          <div className="min-w-0 flex-1 px-5 pb-8 pt-2 md:px-[50px]">
            <PartnerAccount />
          </div>
        )}
      </main>
    </div>
  );
}
