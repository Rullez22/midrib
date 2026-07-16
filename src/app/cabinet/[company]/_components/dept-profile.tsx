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
  Button,
  FeedPost,
  JoinBanner,
  type InfoGroup,
} from "@/components/ds";

import { type DeptProfileData } from "../_config/cabinets";

/**
 * DeptProfile — профиль подразделения (Информация / Лента), обобщённый по данным
 * кабинета. Полная сборка из готовых DS-композитов — 1:1 как SubdivisionProfile
 * (Администрация), но контент берётся из CabinetConfig.
 */

const BLUE = "var(--color-blue-midhub-500)";
const PURPLE = "var(--color-purple-400)";

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DocThumb() {
  return (
    <span className="flex h-[86px] w-[86px] flex-col gap-1 rounded-[4px] border border-border bg-surface p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="h-[2px] rounded bg-[var(--color-grey-90)]" style={{ width: `${92 - i * 5}%` }} />
      ))}
    </span>
  );
}

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

function charterGroup(rows: DeptProfileData["charterRows"]): InfoGroup {
  return {
    heading: "Устав",
    rows: [
      ...rows.map((r) => ({
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

export function DeptProfile({
  data,
  actions,
  avatar,
  cover,
  showJoinBanner = true,
}: {
  data: DeptProfileData;
  /** Действие под именем. По умолчанию «Подписаться». */
  actions?: ReactNode;
  /** Переопределение аватара (например градиент-кружок кооператива). */
  avatar?: ReactNode;
  /** Переопределение обложки (например градиент вместо фото). */
  cover?: ReactNode;
  /** Голубой баннер вступления. Только в подразделениях 2–7, не в кооперативе. */
  showJoinBanner?: boolean;
}) {
  const [tab, setTab] = useState<"info" | "feed">("info");
  const [geo, setGeo] = useState("countries");

  const groups: InfoGroup[] = [...data.infoGroups, charterGroup(data.charterRows)];

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader
        editable={false}
        cover={cover ?? <img src={data.cover} alt="" className="size-full object-cover" />}
        avatar={avatar ?? data.avatar}
        name={data.name}
        role={data.role}
        tab={tab}
        onTabChange={setTab}
        actions={
          actions ?? (
            <Button size="xs" iconLeft={<PlusIcon />} className="self-start">
              Подписаться
            </Button>
          )
        }
      />

      {tab === "info" ? (
        <div className="flex flex-col gap-4">
          {showJoinBanner && <JoinBanner />}
          <ProfileInfoCard groups={groups} />
          <RequirementsCard items={data.requirements} />
          <AchievementsCard items={data.achievements} />

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
                  groups={data.ageGroups}
                  yTicks={[0, 20, 40]}
                  unit="%"
                />
              </StatBox>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <StatBox title="Девайсы">
                  <DonutChart
                    segments={[
                      { label: data.devices[0].label, value: data.devices[0].value, color: BLUE },
                      { label: data.devices[1].label, value: data.devices[1].value, color: PURPLE },
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
                  <GeoBars rows={geo === "countries" ? data.geoCountries : data.geoCities} columns={2} />
                </StatBox>
              </div>
            </div>
          </SectionCard>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.feedPosts.map((p, i) => (
            <FeedPost key={i} title={p.title} date={p.date} text={p.text} media={p.media} />
          ))}
        </div>
      )}
    </div>
  );
}
