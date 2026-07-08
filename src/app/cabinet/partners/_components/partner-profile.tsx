"use client";

import { useState, type ReactNode } from "react";
import {
  ProfileHeader,
  ProfileInfoCard,
  FeedPost,
  Button,
  Tabs,
  Tab,
  type InfoGroup,
  type FeedMedia,
} from "@/components/ds";
import {
  FEED_IMG,
  FEED_ITEMS,
  type Partner,
  type PartnerInfoSection,
} from "./partners-data";

/**
 * PartnerProfile — профиль партнёра (Figma 1857:649858 / 1987:737273 / 1984:719937).
 * Таб «Информация» → ProfileHeader + ProfileInfoCard («Общие сведения»).
 * Таб «Лента» → фильтры действий + FeedPost.
 *
 * Reuse DS: ProfileHeader (actions = «Подписаться» + «Посетить сайт», editable=false) ·
 * ProfileInfoCard · FeedPost · Tabs · Button.
 */

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M6 4h6v6M12 4 5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Конвертация секций данных в формат InfoGroup композита ProfileInfoCard. */
function toGroups(sections: PartnerInfoSection[]): InfoGroup[] {
  return sections.map((s) => {
    const onlyText = s.rows.length === 1 && s.rows[0].label === "";
    if (onlyText) return { heading: s.title, text: s.rows[0].value as string };
    return {
      heading: s.title,
      rows: s.rows.map((r) => ({
        label: r.label,
        value: Array.isArray(r.value) ? (
          <span className="flex flex-col gap-1">
            {r.value.map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </span>
        ) : (
          r.value
        ),
      })),
    };
  });
}

const FEED_FILTERS = [
  { value: "all", label: "Все действия" },
  { value: "articles", label: "Статьи" },
  { value: "publications", label: "Публикации" },
  { value: "documents", label: "Документы" },
];

export function PartnerProfile({ partner }: { partner: Partner }) {
  const [tab, setTab] = useState<"info" | "feed">("info");
  const [feedFilter, setFeedFilter] = useState("all");

  const subscribeActions: ReactNode = (
    <div className="flex items-center gap-4">
      <Button size="xs" iconLeft={<PlusIcon />}>Подписаться</Button>
      <Button variant="secondary" size="xs" iconRight={<ExternalIcon />}>Посетить сайт</Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader
        cover={<img src={partner.cover} alt="" className="size-full object-cover" />}
        avatar={partner.avatar}
        name={partner.title}
        role={partner.role}
        editable={false}
        actions={subscribeActions}
        tab={tab}
        onTabChange={setTab}
      />

      {tab === "info" ? (
        <ProfileInfoCard groups={toGroups(partner.info)} />
      ) : (
        <div className="flex flex-col gap-4">
          <Tabs variant="basic" size="m" equal value={feedFilter} onValueChange={setFeedFilter} aria-label="Фильтр ленты" className="w-full">
            {FEED_FILTERS.map((f) => (
              <Tab key={f.value} value={f.value}>{f.label}</Tab>
            ))}
          </Tabs>
          {FEED_ITEMS.map((item, i) => {
            const media: FeedMedia | undefined = item.image
              ? { type: "image", src: FEED_IMG }
              : item.files
                ? { type: "documents", files: item.files }
                : undefined;
            return <FeedPost key={i} title={item.title} date={item.date} text={item.text} media={media} />;
          })}
        </div>
      )}
    </div>
  );
}
