"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, RoleCard } from "@/components/ds";
import { PlanPanel, EduPanel } from "../../../flow/company-create/_components/activity-screen";
import { CkpBlock, StructureCascade, CascadeArrowDown } from "../../[company]/_components/cabinet-activity-screen";
import { ACCENT, CASCADE_SHARED } from "../../[company]/_config/cabinet-activity";
import { railColorOf, ckpIconColor } from "../../[company]/_config/cabinets";
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
function StructTab({ role, from }: { role: LkRole; from?: string }) {
  const router = useRouter();
  const me = lkIdentity(role);
  const self = isSelfRole(role);
  // Палитра страницы — цвет подразделения, из коллектива которого открыт человек
  // (люди кабинетов 2–7 живут сразу в нескольких, поэтому цвет берётся от того,
  // откуда пришли, а не от самого человека). Без `from` — Администрация (red).
  const accent = ACCENT[railColorOf(from)];
  // Возврат по квадратику — «Деятельность» подразделения с уже выделенной
  // карточкой этого человека (?member=слаг).
  const backToActivity = `${from && from !== "administration" ? `/cabinet/${from}/activity` : CABINET_ROUTES.activity}?member=${role}`;
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
        /* Обложка человека — та же, что в его профиле и на карточке сайдбара
           (иначе CkpAva подставит дефолтный градиент Администрации). */
        cover={`url("${me.cover}")`}
        desc="Пайщик кооператива «Immatra» с 2019 года, с марта 2023 года — председатель правления. Отвечает за операционную работу администрации: согласование договоров с партнёрами, подготовку вопросов на заседания правления и совета, сопровождение новых пайщиков. Ведёт приём по вторникам и четвергам, с 10:00 до 17:00."
        /* Карандаш — только на своей странице: у подчинённого я в гостях и
           редактировать его данные не могу. */
        editable={self}
        layout
        /* Квадратик — приглушённый тон подразделения (как во всех блоках ЦКП),
           а не яркий ACCENT, которым нарисованы каскад и стрелки. */
        layoutColor={ckpIconColor(from)}
        /* У пользователя квадратик ведёт на «Деятельность» его подразделения —
           с выделенной его карточкой, — а не в структуру кооператива, как
           одноимённая иконка на экране самого подразделения. */
        onLayout={() => router.push(backToActivity)}
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
                borderColor={accent.border}
                activeBg={accent.bg}
                onEdit={self ? () => {} : undefined}
              />
              {activeKey === o.key && <CascadeArrowDown accent={accent} />}
            </div>
          ))}
        </div>
      </div>

      {/* Каскад структуры — тот же компонент, что в подразделении (DOM-стрелки).
          -mt-2 сводит родительский gap-5 (20px) к 12px под стрелкой. */}
      <StructureCascade cascade={CASCADE_SHARED} accent={accent} className="-mt-2" />
    </div>
  );
}

export function LkActivityScreen({ role, from }: { role: LkRole; from?: string }) {
  const [tab, setTab] = useState("struct");
  return (
    <div className="flex min-h-screen bg-background">
      <LkSidebar role={role} current="activity" from={from} />
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
          {tab === "struct" ? <StructTab role={role} from={from} /> : tab === "plan" ? <PlanPanel /> : <EduPanel />}
        </div>
      </main>
    </div>
  );
}
