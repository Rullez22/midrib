"use client";

import {
  ChatWindow,
  ChatTopBar,
  ChatThread,
  ChatBubble,
  MessageComposer,
} from "@/components/ds";
import { useChatThread } from "@/lib/use-chat-thread";
import { CompanySidebar } from "./company-sidebar";
import { DeptProfile } from "./dept-profile";
import { SideChatLayout } from "../../_components/side-chat-layout";
import { type CabinetConfig, cabinetDeptData, PEER_AVATAR } from "../_config/cabinets";

/**
 * CompanyMainScreen — главный экран кабинета (профиль подразделения + чат).
 * Паттерн SubdivisionDetailScreen: CompanySidebar (конфиг кабинета) + DeptProfile +
 * правый чат. Контент — из CabinetConfig.
 */

function CompanyChat({ cabinet }: { cabinet: CabinetConfig }) {
  const { messages, send, firstSentIndex } = useChatThread(cabinet.chatMessages);
  return (
    <ChatWindow
      height="100vh"
      className="rounded-none border-0 border-l border-border"
      topBar={<ChatTopBar title={cabinet.name} subtitle={cabinet.chatSubtitle} />}
      footer={<MessageComposer placeholder="Сообщение" onSend={send} />}
    >
      <ChatThread>
        {messages.map((m, i) => (
          <ChatBubble
            key={i}
            me={m.me}
            time={m.time}
            avatar={m.me ? undefined : PEER_AVATAR}
            className={i >= firstSentIndex ? "ds-content" : undefined}
          >
            {m.text}
          </ChatBubble>
        ))}
      </ChatThread>
    </ChatWindow>
  );
}

export function CompanyMainScreen({ cabinet }: { cabinet: CabinetConfig }) {
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current="subdivision" />

      <main className="flex min-w-0 flex-1">
        <SideChatLayout content={<DeptProfile data={cabinetDeptData(cabinet)} />} chat={<CompanyChat cabinet={cabinet} />} />
      </main>
    </div>
  );
}
