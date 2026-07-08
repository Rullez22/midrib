"use client";

/**
 * Демки «Профиль кооператива (организации)» для витрины /ds.
 * Источник: Figma «UI фичи» / профиль председателя-главная-mini (1795:298288 /
 * 298776 / 299416). Reuse: ProfileHeader (обложка-градиент + текст-аватар),
 * SectionCard / ProfileInfoCard / RequirementsCard / AchievementsCard,
 * BarChart / DonutChart / GeoBars (новые графики), FeedComposerBar / FeedPost.
 */
import { useState } from "react";
import {
  ProfileHeader,
  SectionCard,
  ProfileInfoCard,
  RequirementsCard,
  AchievementsCard,
  BarChart,
  DonutChart,
  GeoBars,
  Tabs,
  Tab,
  FeedComposerBar,
  FeedPost,
} from "@/components/ds";

const A1 = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80";
const A2 = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80";
const A3 = "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=120&q=80";
const POST_IMG = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80";

const BLUE = "var(--color-blue-midhub-500)";
const PURPLE = "var(--color-purple-400)";

const ORG_GROUPS = [
  {
    heading: "Описание",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea nunc diam augue viverra facilisis nullam amet, tristique. Augue laoreet diam et, proin. Viverra nec.",
  },
  {
    heading: "Контактная информация",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      { label: "Контактный телефон", value: "+7 (992) 223-22-22" },
      { label: "E-mail", value: "immatra@immatra.ru" },
    ],
  },
  {
    heading: "Устав",
    rows: [
      { label: "Регистрационный номер", value: "464649592200" },
      { label: "Организация", value: "Потребительский кооператив Immatra" },
      { label: "Полное юридическое наименование", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      {
        label: "ОКВЭД",
        value: (
          <span className="flex flex-col gap-1">
            <span>81.22 — Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая</span>
            <span>81.29.1 — Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования</span>
            <span>84.30 — Деятельность в области обязательного социального обеспечения</span>
          </span>
        ),
      },
      { label: "ИНН", value: "45267545611" },
      { label: "Кем выдан", value: "Управление министерства юстиции РФ по Санкт-Петербургу" },
      { label: "Дата решения", value: "15.12.2005" },
      { label: "Дата внесения в ЕГРПО", value: "25.12.2005" },
    ],
  },
];

const REQUIREMENTS = [
  { name: "Требование 1", type: "Домен", badge: { label: "Локальный", color: "orange" as const } },
  { name: "Требование 2", type: "Домен", badge: { label: "Зеленый", color: "green" as const } },
];

const ACHIEVEMENTS = [
  { logo: A1, title: "Самый лучший пайщик", org: "Ким Дмитрий Кимович", date: "август 2019" },
  { logo: A2, title: "Самый лучший пайщик", org: "Энрике Чучела Каримович", date: "август 2018" },
  { logo: A3, title: "Самый лучший пайщик", org: "Валитин Дмитрий Кузякин", date: "август 2016" },
];

const AGE_GROUPS = [
  { label: "< 18", values: [0, 0] },
  { label: "18-21", values: [18, 0] },
  { label: "21-24", values: [18, 0] },
  { label: "24-27", values: [30, 20] },
  { label: "27-30", values: [22, 22] },
  { label: "30-36", values: [3, 2] },
  { label: "36-40", values: [0, 8] },
  { label: ">40", values: [7, 0] },
];

const GEO_COUNTRIES = [
  { label: "Россия", value: 94 },
  { label: "Китай", value: 0.26 },
  { label: "Украина", value: 0.2 },
  { label: "США", value: 0.2 },
  { label: "Монголия", value: 0.13 },
  { label: "Другие", value: 1.37 },
];

const GEO_CITIES = [
  { label: "Санкт-Петербург", value: 78 },
  { label: "Москва", value: 12 },
  { label: "Казань", value: 4 },
  { label: "Новосибирск", value: 3 },
  { label: "Сочи", value: 2 },
  { label: "Другие", value: 1 },
];

const POST_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A, sed pulvinar scelerisque maecenas volutpat. Ornare in massa, blandit est, venenatis posuere felis, dolor.";

/** Текст-аватар организации (серый круг с названием). */
function OrgAvatar({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-[120px] items-center justify-center rounded-full bg-[var(--color-grey-20)] px-3 text-center">
      <span className="ds-h5 text-foreground">{children}</span>
    </span>
  );
}

function StatBox({ title, extra, children }: { title: React.ReactNode; extra?: React.ReactNode; children: React.ReactNode }) {
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

function LegendDot({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="ds-caption inline-flex items-center gap-2 text-foreground-muted">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

export function OrgProfileDemos() {
  const [tab, setTab] = useState<"info" | "feed">("info");
  const [geo, setGeo] = useState("countries");

  return (
    <div className="flex max-w-[815px] flex-col gap-8">
      <ProfileHeader
        cover={<div className="size-full bg-gradient-to-r from-[#9796f0] to-[#fbc7d4]" />}
        avatar={<OrgAvatar>Immatra</OrgAvatar>}
        name="Кооператив Immatra"
        role="Потребительский кооператив"
        tab={tab}
        onTabChange={setTab}
      />

      {tab === "info" ? (
        <div className="flex flex-col gap-4">
          <ProfileInfoCard groups={ORG_GROUPS} />
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
                      { label: "Десктоп", value: 86, color: BLUE },
                      { label: "Смартфоны", value: 14, color: PURPLE },
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
        <div className="flex flex-col gap-4">
          <FeedComposerBar avatar={<OrgAvatar>Immatra</OrgAvatar>} />
          <FeedPost title="Departure to the site of installation" date="Август 23, 2019" text={POST_TEXT} media={{ type: "image", src: POST_IMG }} />
          <FeedPost title="Departure to the site of installation" date="Август 23, 2019" media={{ type: "documents", files: ["Лунная соната", "Дневник №1"] }} />
        </div>
      )}
    </div>
  );
}
