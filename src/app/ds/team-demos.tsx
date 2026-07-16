"use client";

/**
 * Демки «Коллектив подразделения» + «Профиль подразделения» для витрины /ds.
 * Источник: Figma «UI фичи» / структура (2023:223036 · 2017:282684 · 1766:269126),
 * профиль подразделения (1781:285025/285026/286156), профиль пользователя
 * с подпиской (1762:264757 · 1763:264839).
 * Reuse: CKPCard · TeamMemberCard (новый) · ProfileHeader (cover-нода + actions) ·
 * Banner · ProfileInfoCard · RequirementsCard · AchievementsCard · Button.
 */
import { useState } from "react";
import {
  CKPCard,
  TeamMemberCard,
  ProfileHeader,
  Banner,
  ProfileInfoCard,
  RequirementsCard,
  AchievementsCard,
  Button,
} from "@/components/ds";

const DEPT = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80";
const M1 = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80";
const M2 = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80";
const M3 = "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&q=80";
const GROUP = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80";

const INFO_GROUPS = [
  {
    heading: "Описание",
    text: "Подразделение отвечает за подбор и адаптацию пайщиков, распределение ролей внутри кооператива и повышение квалификации сотрудников. Ведёт направление и персонал, коммуникации и контроль эффективности.",
  },
  {
    heading: "Контакты",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      { label: "Контактный телефон", value: "+7 (812) 401-32-18" },
      { label: "E-mail", value: "hr@immatra.ru" },
    ],
  },
];

const REQUIREMENTS = [
  { name: "Подтверждение личности пайщика", type: "Документ", badge: { label: "Локальный", color: "orange" as const } },
  { name: "Согласие на обработку персональных данных", type: "Документ", badge: { label: "Зеленый", color: "green" as const } },
];

const ACHIEVEMENTS = [
  { logo: M1, title: "Лучшее подразделение по адаптации пайщиков", org: "Правление ПК «Immatra»", date: "ноябрь 2024" },
  { logo: M2, title: "Благодарность за программу наставничества", org: "Ассоциация кооперативов Северо-Запада", date: "февраль 2025" },
];

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GroupAvatar({ src }: { src: string }) {
  return <img src={src} alt="" className="size-[120px] rounded-full border-2 border-[#fff] object-cover" />;
}

export function TeamDemos() {
  const [picked, setPicked] = useState("ilya");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="flex max-w-[1120px] flex-col gap-10">
      {/* Коллектив подразделения */}
      <div className="flex flex-col gap-5">
        <CKPCard
          avatarSrc={DEPT}
          subtitle="Администрация"
          meta="20 пайщиков"
          description="ЦКП: каждый пайщик подразделения знает свою роль и обязанности, а новые участники выходят на работу в течение недели после приёма. Отдел ведёт реестр ролей, обучение и контроль эффективности персонала."
          editable
          onEdit={() => {}}
        />

        <div className="flex flex-col gap-4">
          <span className="ds-p2-medium text-foreground">Коллектив подразделения</span>
          <div className="flex flex-wrap gap-4">
            <TeamMemberCard role="Председатель правления" status="inactive" onEdit={() => {}} />
            <TeamMemberCard role="Председатель совета" status="inactive" onEdit={() => {}} />
            <TeamMemberCard photo={M1} name="Илья А. А." role="Член совета" status="active" selected={picked === "ilya"} onClick={() => setPicked("ilya")} onEdit={() => {}} />
            <TeamMemberCard photo={M2} name="Дмитрий А. А." role="Член совета" status="pending" selected={picked === "dmitry"} onClick={() => setPicked("dmitry")} onEdit={() => {}} />
            <TeamMemberCard photo={M3} name="Александр Д. Р." role="Член совета" status="active" selected={picked === "joe"} onClick={() => setPicked("joe")} onEdit={() => {}} />
          </div>
        </div>
      </div>

      {/* Профиль подразделения (подписка + баннер) */}
      <div className="flex max-w-[815px] flex-col gap-4">
        <span className="ds-caption-up text-foreground-subtle">
          Профиль подразделения — обложка-градиент + «Подписаться» + баннер вступления
        </span>

        <ProfileHeader
          cover={<div className="size-full bg-gradient-to-r from-[#7c3aed] via-[#9333ea] to-[#c026d3]" />}
          avatar={<GroupAvatar src={GROUP} />}
          name="HR"
          role="Подразделение кооператива Immatra"
          actions={
            <Button
              variant={subscribed ? "secondary" : "primary"}
              size="xs"
              iconLeft={subscribed ? undefined : <PlusIcon />}
              onClick={() => setSubscribed((v) => !v)}
            >
              {subscribed ? "Вы подписаны" : "Подписаться"}
            </Button>
          }
        />

        <Banner
          tone="info"
          title="Хотите стать пайщиком подразделения ?"
          actionLabel="Оставить заявку"
          onAction={() => {}}
        >
          Чтобы стать пайщиком, необходимо оставить заявку на вступление
        </Banner>

        <ProfileInfoCard groups={INFO_GROUPS} />
        <RequirementsCard items={REQUIREMENTS} />
        <AchievementsCard items={ACHIEVEMENTS} />
      </div>
    </div>
  );
}
