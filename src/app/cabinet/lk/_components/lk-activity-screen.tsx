"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, RoleCard } from "@/components/ds";
import { PlanPanel, EduPanel } from "../../../flow/company-create/_components/activity-screen";
import { CkpBlock, StructureCascade, CascadeArrowDown } from "../../[company]/_components/cabinet-activity-screen";
import { ACCENT, CASCADE_SHARED } from "../../[company]/_config/cabinet-activity";
import { LkSidebar } from "./lk-sidebar";
import { lkIdentity, lkShortName, lkTitle, isSelfRole, type LkRole } from "./lk-data";
import { CABINET_ROUTES } from "../../_components/cabinet-seed";

/**
 * LkActivityScreen — «Деятельность» личного кабинета (Figma 1904:728427 —
 * Структура · 1857:649762 — План развития · 1857:649758 — Обучение). Тот же экран,
 * что «Деятельность» подразделения: верхние табы Структура/План развития/Обучение.
 * План/Обучение переиспользуют PlanPanel/EduPanel подразделения 1:1. «Структура» —
 * ЛК-версия: «Ваши обязательства» (роли) + каскад структуры, скопированный из
 * подразделения (StructureCascade + CASCADE_SHARED, красный акцент): те же карточки,
 * клики и стрелки-связки, что меряются по DOM.
 */

/** Мои обязательства — переключают URL, как дропдаун роли в боковом меню. */
const OBLIGATIONS: { key: LkRole; name: string }[] = [
  { key: "payer", name: "Пайщик" },
  { key: "chair", name: "Председатель правления" },
];

/** Таб «Структура» — ЛК-версия (Общие сведения + Ваши обязательства + каскад). */
function StructTab({ role }: { role: LkRole }) {
  const router = useRouter();
  const me = lkIdentity(role);
  const self = isSelfRole(role);
  // Чужая страница: человек из коллектива — сам по себе и пайщик, и, например,
  // член совета: это ОДИН человек. Поэтому переключение обязательств у него
  // локальное — меняется только активная карточка (в чужой кабинет пайщика не
  // уходим). У себя (Антонов) — навигация по URL.
  const obligations = self
    ? OBLIGATIONS
    : [{ key: "payer", name: "Пайщик" }, { key: role, name: lkTitle(role) }];
  const [selKey, setSelKey] = useState<LkRole>(role);
  const activeKey = self ? role : selKey;
  return (
    <div className="flex flex-col gap-5">
      {/* Блок подразделения «Ценный конечный продукт» (CkpBlock), но с заголовком
          «Общие сведения», фото пользователя и карандашом (Figma 1904:728427). */}
      <CkpBlock
        title="Общие сведения"
        name={lkShortName(role)}
        avatar={me.avatar}
        desc="Пайщик кооператива «Immatra» с 2019 года, с марта 2023 года — председатель правления. Отвечает за операционную работу администрации: согласование договоров с партнёрами, подготовку вопросов на заседания правления и совета, сопровождение новых пайщиков. Ведёт приём по вторникам и четвергам, с 10:00 до 17:00."
        /* Карандаш — только на своей странице: у подчинённого я в гостях и
           редактировать его данные не могу. */
        editable={self}
        layout
        /* У пользователя квадратик ведёт на «Деятельность» его подразделения
           (Администрация), а не в структуру кооператива, как одноимённая иконка
           на экране самого подразделения. */
        onLayout={() => router.push(CABINET_ROUTES.activity)}
      />

      <div className="flex flex-col gap-3">
        <span className="ds-p2-medium text-foreground">Ваши обязательства</span>
        {/* Карточки переключают роль (навигация как у дропдауна в боковом меню);
            стрелка-связка рендерится под активной ролью и «едет» за ней. */}
        <div className="flex flex-wrap items-start gap-4">
          {obligations.map((o) => (
            <div key={o.key} className="flex flex-col items-center gap-3">
              <RoleCard
                name={o.name}
                status={activeKey === o.key ? "active" : "inactive"}
                selected={activeKey === o.key}
                onClick={() => {
                  if (!self) setSelKey(o.key);
                  else if (o.key !== role) router.push(`/cabinet/lk/${o.key}/activity`);
                }}
                onEdit={self ? () => {} : undefined}
              />
              {activeKey === o.key && <CascadeArrowDown accent={ACCENT.red} />}
            </div>
          ))}
        </div>
      </div>

      {/* Каскад структуры — тот же компонент, что в подразделении (DOM-стрелки).
          -mt-2 сводит родительский gap-5 (20px) к 12px под стрелкой. */}
      <StructureCascade cascade={CASCADE_SHARED} accent={ACCENT.red} className="-mt-2" />
    </div>
  );
}

export function LkActivityScreen({ role }: { role: LkRole }) {
  const [tab, setTab] = useState("struct");
  return (
    <div className="flex min-h-screen bg-background">
      <LkSidebar role={role} current="activity" />
      <main className="min-w-0 flex-1">
        {/* Верхние табы — на всю ширину, прилеплены к верху (как в подразделении). */}
        <Tabs
          value={tab}
          onValueChange={setTab}
          variant="solid-light"
          size="l"
          equal
          aria-label="Раздел"
          className="w-full rounded-none border-x-0 border-t-0"
        >
          <Tab value="struct">Структура</Tab>
          <Tab value="plan">План развития</Tab>
          <Tab value="edu">Обучение</Tab>
        </Tabs>

        {/* key={tab} — панель монтируется заново, .ds-content играет при смене таба. */}
        <div key={tab} className="ds-content flex w-full flex-col gap-5 px-5 py-8 md:px-[50px]">
          {tab === "struct" ? <StructTab role={role} /> : tab === "plan" ? <PlanPanel /> : <EduPanel />}
        </div>
      </main>
    </div>
  );
}
