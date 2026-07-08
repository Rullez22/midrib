"use client";

/**
 * Демки «Профиль пользователя» + «Развитие / Обучение» для витрины /ds.
 * Источник: Figma «UI фичи» / профиль (1731:252149 · 1735:252539 · 1731:251470 ·
 * 1735:255297 · 1735:255711 · 2130:230084 · 1735:255796 · 1950:197286 ·
 * 2130:229794 · 2008:258960 · 1741:286492) и роль (1556:185051 Обучение,
 * 1637:234383 План развития).
 * Reuse: ProfileHeader / ProfileInfoCard / AchievementsCard / RoleHistoryCard /
 * RequirementsCard (новые) + FeedComposerBar / FeedPost / InfoCard / Tabs / Link.
 */
import { useState } from "react";
import {
  ProfileHeader,
  ProfileInfoCard,
  AchievementsCard,
  RoleHistoryCard,
  RequirementsCard,
  FeedComposerBar,
  FeedPost,
  InfoCard,
  Tabs,
  Tab,
  Link,
} from "@/components/ds";

const COVER = "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=900&q=80";
const AVATAR = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&q=80";
const A2 = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80";
const A3 = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80";
const POST_IMG = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80";

const INFO_GROUPS = [
  {
    heading: "Описание",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea nunc diam augue viverra facilisis nullam amet, tristique. Augue laoreet diam et, proin. Viverra nec.",
  },
  {
    heading: "Контакты",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      { label: "Контактный телефон", value: "+7 (992) 223-22-22" },
      { label: "E-mail", value: "immatra@immatra.ru" },
    ],
  },
  {
    heading: "Личные данные",
    rows: [
      { label: "Адрес", value: "0xca30e63200a0fe3182dc61fc5605efc41456f32" },
      { label: "Фамилия", value: "Антонов" },
      { label: "Имя", value: "Илья" },
      { label: "Отчество", value: "Андреевич" },
      { label: "Номер паспорта", value: "45 67 345678" },
      { label: "Кем выдан", value: "ТП № 19 Калининского района, г. Санкт-Петербург" },
      { label: "Дата выдачи", value: "25.12.2005" },
    ],
  },
];

const ACHIEVEMENTS = [
  { logo: A2, title: "Google cooperation hackfest - the 1st place", org: "Google corp.", date: "август 2019" },
  { logo: A3, title: "Apple cooperation hackfest - the 1st place", org: "Apple corp.", date: "август 2018" },
  { logo: AVATAR, title: "Angelhack cooperation hackfest - the 1st place", org: "AngelList", date: "август 2016" },
];

const HISTORY = [
  { avatar: AVATAR, name: "Антонов Илья Андреевич", period: "август 2019 — настоящее время · 2 года 3 месяца" },
  { avatar: A2, name: "Ан Дмитрий Шпакович", period: "август 2017 — август 2019 · 2 года" },
  { avatar: A3, name: "Варламов Илья Варламович", period: "август 2014 — август 2017 · 3 года" },
];

const REQUIREMENTS = [
  { name: "Требование 1", type: "Домен", badge: { label: "Локальный", color: "orange" as const } },
  { name: "Требование 2", type: "Домен", badge: { label: "Зеленый", color: "green" as const } },
];

const POST_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A, sed pulvinar scelerisque maecenas volutpat. Ornare in massa, blandit est, venenatis posuere felis, dolor.";

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const STAGE_TASKS = [
  { n: 1, progress: 55, action: "Продолжить" },
  { n: 2, progress: 0, action: "Начать" },
  { n: 3, progress: 0, action: "Начать" },
  { n: 4, progress: 0, action: "Начать" },
  { n: 5, progress: 0, action: "Начать" },
  { n: 6, progress: 0, action: "Начать" },
];

export function ProfileDemos() {
  const [tab, setTab] = useState<"info" | "feed">("info");
  const [devTab, setDevTab] = useState("plan");
  const [stage, setStage] = useState("s1");

  return (
    <div className="flex max-w-[795px] flex-col gap-8">
      {/* Шапка профиля + переключение Информация / Лента */}
      <ProfileHeader
        cover={COVER}
        avatar={AVATAR}
        name="Антонов Илья Андреевич"
        role="Председатель правления кооператива Immatra"
        tab={tab}
        onTabChange={setTab}
      />

      {tab === "info" ? (
        <div className="flex flex-col gap-4">
          <ProfileInfoCard groups={INFO_GROUPS} />
          <RequirementsCard items={REQUIREMENTS} />
          <AchievementsCard items={ACHIEVEMENTS} />
          <RoleHistoryCard items={HISTORY} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <FeedComposerBar avatar={AVATAR} />
          <FeedPost title="Departure to the site of installation" date="Август 23, 2019" text={POST_TEXT} media={{ type: "image", src: POST_IMG }} />
          <FeedPost title="Departure to the site of installation" date="Август 23, 2019" media={{ type: "documents", files: ["Лунная соната", "Дневник №1"] }} />
        </div>
      )}

      {/* Состояния секций: пусто / режим настройки */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Секции — пустые состояния и режим настройки
        </span>
        <RequirementsCard items={[]} defaultOpen />
        <RequirementsCard editable items={[]} defaultOpen />
        <AchievementsCard items={[]} defaultOpen />
      </div>

      {/* Развитие / Обучение (Tabs + InfoCard) */}
      <div className="flex flex-col gap-4">
        <span className="ds-caption-up text-foreground-subtle">
          Развитие роли — План развития / Обучение (Tabs + InfoCard)
        </span>
        <Tabs variant="solid-light" size="l" value={devTab} onValueChange={setDevTab} aria-label="Развитие">
          <Tab value="plan">План развития</Tab>
          <Tab value="study">Обучение</Tab>
        </Tabs>

        {devTab === "plan" ? (
          <div className="flex flex-col gap-5">
            {[1, 2].map((n) => (
              <div key={n} className="flex flex-col gap-2">
                <span className="ds-p2-medium text-foreground">План №{n}</span>
                <InfoCard
                  className="max-w-none"
                  meta="Выполнено: 55%"
                  metaIcon={<ClockIcon />}
                  progress={55}
                  title="Описание"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et curabitur dolor egestas id. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  action={<Link href="#" size="p3">Подробнее</Link>}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <Tabs variant="solid" size="s" value={stage} onValueChange={setStage} aria-label="Этап">
              <Tab value="s1">1-этап</Tab>
              <Tab value="s2">2-этап</Tab>
              <Tab value="s3">3-этап</Tab>
              <Tab value="s4">4-этап</Tab>
            </Tabs>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {STAGE_TASKS.map((t) => (
                <InfoCard
                  key={t.n}
                  className="max-w-none"
                  meta={`Выполнено: ${t.progress}%`}
                  metaIcon={<ClockIcon />}
                  progress={t.progress}
                  title={`Задание №${t.n}`}
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et curabitur dolor egestas id"
                  action={<Link href="#" size="p3">{t.action}</Link>}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
