"use client";

import { useState } from "react";
import {
  ProfileHeader,
  ProfileInfoCard,
  RequirementsCard,
  AchievementsCard,
  RoleHistoryCard,
  FeedBlock,
  type ProfileTab,
} from "@/components/ds";
import { SideChatLayout } from "../../_components/side-chat-layout";
import { LkSidebar } from "./lk-sidebar";
import { LkChatRoster } from "./lk-chat-roster";
import {
  LK_ROLES,
  LK_USER,
  lkIdentity,
  LK_INFO_GROUPS,
  LK_REQUIREMENTS,
  LK_ACHIEVEMENTS,
  LK_HISTORY,
  LK_FEED_POSTS,
  LK_CHATS,
  type LkRole,
} from "./lk-data";

/**
 * LkScreen — личный кабинет пользователя (Figma 1857:649798 — пред. правления /
 * 1857:649802 — пайщик). Профиль ИДЕНТИЧЕН для обеих ролей; различаются только
 * URL (роль) и список чатов справа. Лэйаут как у экрана подразделения:
 * персональный сайдбар + контент-профиль + чат-ростер справа.
 *
 * Reuse DS: ProfileHeader · ProfileInfoCard · RequirementsCard · AchievementsCard ·
 * RoleHistoryCard · FeedBlock. Каркас: LkSidebar · SideChatLayout.
 */

function LkProfile({ role }: { role: LkRole }) {
  const [tab, setTab] = useState<ProfileTab>("info");
  const me = lkIdentity(role);
  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader
        cover={LK_USER.cover}
        avatar={me.avatar}
        name={me.name}
        role={LK_ROLES[role].full}
        tab={tab}
        onTabChange={setTab}
      />

      {tab === "info" ? (
        <div className="flex flex-col gap-4">
          <ProfileInfoCard groups={LK_INFO_GROUPS} />
          <RequirementsCard items={LK_REQUIREMENTS} />
          <AchievementsCard items={LK_ACHIEVEMENTS} />
          <RoleHistoryCard items={LK_HISTORY} />
        </div>
      ) : (
        // FeedBlock = композер + лента: раскрывается, принимает текст и файлы,
        // публикует пост наверх ленты. Раньше был мёртвый FeedComposerBar.
        <FeedBlock avatar={me.avatar} authorName={me.name} posts={LK_FEED_POSTS} />
      )}
    </div>
  );
}

export function LkScreen({ role }: { role: LkRole }) {
  // Раскрытие чата скрывает панель сайдбара → чат доходит до рейки.
  const [chatExpanded, setChatExpanded] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      <LkSidebar role={role} panelHidden={chatExpanded} />
      <main className="flex min-w-0 flex-1">
        <SideChatLayout
          expanded={chatExpanded}
          onExpandedChange={setChatExpanded}
          content={<LkProfile role={role} />}
          chat={<LkChatRoster items={LK_CHATS[role]} />}
        />
      </main>
    </div>
  );
}
