"use client";

import { useState, type ReactNode } from "react";
import {
  ProfileHeader,
  ProfileInfoCard,
  SectionCard,
  RequirementsCard,
  AchievementsCard,
  BarChart,
  DonutChart,
  GeoBars,
  Tabs,
  Tab,
  FeedBlock,
  FeedPost,
  type InfoGroup,
} from "@/components/ds";
import {
  SUBDIVISION,
  SUBDIVISION_COVER,
  INFO_GROUPS,
  CHARTER_ROWS,
  REQUIREMENTS,
  ACHIEVEMENTS,
  AGE_GROUPS,
  DEVICES,
  GEO_COUNTRIES,
  GEO_CITIES,
  FEED_POSTS,
} from "./subdivision-data";

/**
 * SubdivisionProfile — профиль подразделения (Figma 1981:713209 «Информация» /
 * 1981:716175 «Лента»). Полная сборка из готовых DS-композитов (как демо
 * OrgProfileDemos): ProfileHeader · ProfileInfoCard · RequirementsCard ·
 * AchievementsCard · BarChart/DonutChart/GeoBars · FeedComposerBar · FeedPost.
 */

const BLUE = "var(--color-blue-midhub-500)";
const PURPLE = "var(--color-purple-400)";

/** Аватар подразделения — светлый круг с названием кооператива. */
function OrgAvatar({ children, size = 120 }: { children: ReactNode; size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full bg-[var(--color-grey-10)] px-2 text-center"
      style={{ width: size, height: size }}
    >
      <span className={size >= 96 ? "ds-h5 text-foreground" : "ds-caption-medium text-foreground"}>{children}</span>
    </span>
  );
}

/** Прикреплённый документ — мини-превью «листа» (как в профиле кооператива). */
function DocThumb() {
  return (
    <span className="flex h-[86px] w-[86px] flex-col gap-1 rounded-[4px] border border-border bg-surface p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="h-[2px] rounded bg-[var(--color-grey-90)]" style={{ width: `${92 - i * 5}%` }} />
      ))}
    </span>
  );
}

/** Карточка-контейнер графика статистики. */
function StatBox({ title, extra, children }: { title: ReactNode; extra?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 rounded-[8px] border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="ds-p2-medium text-foreground">{title}</span>
        {extra}
      </div>
      {children}
    </div>
  );
}

function LegendDot({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="ds-caption inline-flex items-center gap-2 text-foreground-muted">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

/** Конвертация строк «Устава» (массивные значения → колонка строк). */
function charterGroup(): InfoGroup {
  return {
    heading: "Устав",
    rows: [
      ...CHARTER_ROWS.map((r) => ({
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
      { label: "Прикрепленные документы", value: <DocThumb /> },
    ],
  };
}

export function SubdivisionProfile() {
  const [tab, setTab] = useState<"info" | "feed">("info");
  const [geo, setGeo] = useState("countries");

  const groups: InfoGroup[] = [...INFO_GROUPS, charterGroup()];

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader
        cover={<img src={SUBDIVISION_COVER} alt="" className="size-full object-cover" />}
        avatar={<OrgAvatar>{SUBDIVISION.org}</OrgAvatar>}
        name={SUBDIVISION.name}
        role={SUBDIVISION.role}
        tab={tab}
        onTabChange={setTab}
      />

      {tab === "info" ? (
        <div className="flex flex-col gap-4">
          <ProfileInfoCard groups={groups} />
          <RequirementsCard items={REQUIREMENTS} />
          <AchievementsCard items={ACHIEVEMENTS} />

          {/* Статистика */}
          <SectionCard title="Статистика" defaultOpen>
            <div className="flex flex-col gap-4 p-6">
              <StatBox
                title="Пол / Возраст"
                extra={
                  <span className="flex items-center gap-4">
                    <LegendDot color={BLUE}>Мужчины</LegendDot>
                    <LegendDot color={PURPLE}>Женщины</LegendDot>
                  </span>
                }
              >
                <BarChart
                  series={[
                    { label: "Мужчины", color: BLUE },
                    { label: "Женщины", color: PURPLE },
                  ]}
                  groups={AGE_GROUPS}
                  yTicks={[0, 20, 40]}
                  unit="%"
                />
              </StatBox>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <StatBox title="Девайсы">
                  <DonutChart
                    segments={[
                      { label: DEVICES[0].label, value: DEVICES[0].value, color: BLUE },
                      { label: DEVICES[1].label, value: DEVICES[1].value, color: PURPLE },
                    ]}
                  />
                </StatBox>

                <StatBox
                  title="Гео"
                  extra={
                    <Tabs variant="solid-light" size="s" value={geo} onValueChange={setGeo} aria-label="Гео">
                      <Tab value="countries">Страны</Tab>
                      <Tab value="cities">Города</Tab>
                    </Tabs>
                  }
                >
                  <GeoBars rows={geo === "countries" ? GEO_COUNTRIES : GEO_CITIES} columns={2} />
                </StatBox>
              </div>
            </div>
          </SectionCard>
        </div>
      ) : (
        // FeedBlock = композер + лента: публикует пост наверх ленты.
        <FeedBlock avatar={<OrgAvatar size={48}>{SUBDIVISION.org}</OrgAvatar>} posts={FEED_POSTS} />
      )}
    </div>
  );
}
