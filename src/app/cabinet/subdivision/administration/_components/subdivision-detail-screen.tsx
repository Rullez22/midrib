"use client";

import {
  ChatWindow,
  ChatTopBar,
  ChatThread,
  ChatBubble,
  MessageComposer,
} from "@/components/ds";
import { CoopSidebar } from "../../../../flow/company-create/_components/coop-sidebar";
import { SideChatLayout } from "../../../_components/side-chat-layout";
import { CABINET_ROUTES } from "../../../_components/cabinet-seed";
import { SubdivisionProfile } from "./subdivision-profile";
import { SUBDIVISION, PEER_AVATAR, CHAT_MESSAGES } from "./subdivision-data";

/**
 * SubdivisionDetailScreen — детальный экран подразделения «Администрация»
 * (Figma 1857:649499 / 1981:713209 / 1981:716175). Лэйаут как у детального
 * экрана партнёра: операционный сайдбар (CoopSidebar) + профиль подразделения +
 * чат справа.
 *
 * Reuse DS: CoopSidebar · ProfileHeader/ProfileInfoCard/… (через SubdivisionProfile) ·
 * ChatWindow / ChatTopBar / ChatThread / ChatBubble / MessageComposer.
 */

function SubdivisionChat() {
  return (
    <ChatWindow
      height="100vh"
      className="rounded-none border-0 border-l border-border"
      topBar={<ChatTopBar title={SUBDIVISION.name} subtitle={SUBDIVISION.membersLabel} />}
      footer={<MessageComposer placeholder="Сообщение" />}
    >
      <ChatThread>
        {CHAT_MESSAGES.map((m, i) => (
          <ChatBubble key={i} me={m.me} time={m.time} avatar={m.me ? undefined : PEER_AVATAR}>
            {m.text}
          </ChatBubble>
        ))}
      </ChatThread>
    </ChatWindow>
  );
}

export function SubdivisionDetailScreen() {
  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar current="subdivision" routes={CABINET_ROUTES} />

      <main className="flex min-w-0 flex-1">
        <SideChatLayout content={<SubdivisionProfile />} chat={<SubdivisionChat />} />
      </main>
    </div>
  );
}
