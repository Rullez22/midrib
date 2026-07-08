"use client";

import {
  ChatWindow,
  ChatTopBar,
  ChatThread,
  ChatBubble,
  MessageComposer,
} from "@/components/ds";
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
  return (
    <ChatWindow
      height="100vh"
      className="rounded-none border-0 border-l border-border"
      topBar={<ChatTopBar title={cabinet.name} subtitle={cabinet.chatSubtitle} />}
      footer={<MessageComposer placeholder="Сообщение" />}
    >
      <ChatThread>
        {cabinet.chatMessages.map((m, i) => (
          <ChatBubble key={i} me={m.me} time={m.time} avatar={m.me ? undefined : PEER_AVATAR}>
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
