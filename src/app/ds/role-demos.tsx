"use client";

/**
 * Демки «Создание роли» / «Готовая роль» для витрины /ds.
 * Источник: Figma «UI фичи» / создание роли (690:0 · 690:37 · 690:100),
 * готовая роль (692:0 · 693:4).
 * Reuse: RoleForm (новый композит) + QuestionCard + Badge + Item. Карточка
 * требования — паттерн requirement-template, без дублей.
 */
import { useState } from "react";
import {
  RoleForm,
  RoleCard,
  CKPCard,
  OrgColumns,
  Tabs,
  Tab,
  QuestionCard,
  Badge,
  Item,
} from "@/components/ds";

const ROLE_NAME = "Помощник председателя правления";
const ROLE_DUTIES =
  "Ведение переписки от имени организации, прием и перераспределение входящих телефонных звонков, ведение делопроизводства председателя.";

/** Заголовок карточки требования: текст слева + бейдж цвета справа. */
function ReqTitle({ text, label }: { text: string; label: string }) {
  return (
    <span className="flex w-full items-center justify-between gap-2">
      <span style={{ color: "var(--color-blue-midhub-500)" }}>{text}</span>
      <Badge variant="solid" color="orange">{label}</Badge>
    </span>
  );
}

/** Тело карточки требования к помощнику председателя (1:1 с Figma 690:100 / 692:0). */
function ReqBody() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="ds-p3 text-foreground">Описания</span>
        <span className="ds-caption text-foreground-muted">
          Данные требования распространяются на документы категории «удостоверяющие личность» в
          РФ. Проверка таких документов может проводится только нотариусами РФ имеющими
          гражданство РФ.
        </span>
        <span className="ds-caption text-foreground-muted">Тип проверки — дистанционно.</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="ds-p3 text-foreground">
          Тип верификаций для документов, подтверждающих соответствие требованиям
        </span>
        <div className="flex items-center gap-3">
          <span className="ds-caption text-foreground-muted">Международный:</span>
          <Badge variant="solid" color="orange">Желтый</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="ds-p3 text-foreground">
          Документы, подтверждающие соответствие верификациям
        </span>
        <Item tone="muted" bordered={false} size="s">Паспорт</Item>
        <Item tone="muted" bordered={false} size="s">Партийный билет</Item>
      </div>
    </div>
  );
}

/** Свёрнутая карточка требования. */
function RequirementCollapsed() {
  return (
    <QuestionCard
      size="s"
      title={<ReqTitle text="Для требований к помощнику председателя" label="Желтый" />}
    />
  );
}

/** Раскрытая карточка требования. */
function RequirementOpen() {
  return (
    <QuestionCard
      size="s"
      defaultOpen
      title={<ReqTitle text="Для требований к помощнику председателя" label="Желтый" />}
    >
      <ReqBody />
    </QuestionCard>
  );
}

export function RoleDemos() {
  const [name, setName] = useState("");
  const [duties, setDuties] = useState("");

  return (
    <div className="flex flex-col gap-10">
      {/* 1. Создание роли — пустая форма (690:0), управляемая */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Создание роли — пустая форма (введи название/описание)
        </span>
        <RoleForm
          name={name}
          onNameChange={setName}
          duties={duties}
          onDutiesChange={setDuties}
        />
      </div>

      {/* 2. Создание роли — добавлено требование, свёрнуто (690:37) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Создание роли — добавлено требование (свёрнуто)
        </span>
        <RoleForm name={ROLE_NAME} duties={ROLE_DUTIES}>
          <RequirementCollapsed />
        </RoleForm>
      </div>

      {/* 3. Создание роли — требование развёрнуто (690:100) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Создание роли — требование развёрнуто
        </span>
        <RoleForm name={ROLE_NAME} duties={ROLE_DUTIES}>
          <RequirementOpen />
        </RoleForm>
      </div>

      {/* 4. Готовая роль — read-only, требование развёрнуто (692:0) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Готовая роль (read-only) — требование развёрнуто
        </span>
        <RoleForm mode="view" duties={ROLE_DUTIES}>
          <RequirementOpen />
        </RoleForm>
      </div>

      {/* 5. Готовая роль — read-only, требование свёрнуто (693:4) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Готовая роль (read-only) — требование свёрнуто
        </span>
        <RoleForm mode="view" duties={ROLE_DUTIES}>
          <RequirementCollapsed />
        </RoleForm>
      </div>

      {/* 6. Структура роли / «Ваши обязательства» (1872:298230 · 1699:236473).
          Reuse: Tabs + CKPCard + OrgColumns. Новое — только RoleCard. */}
      <RoleStructure />
    </div>
  );
}

/** Карточки-обязательства отдельно (1699:237737). */
export function RoleCardDemos() {
  const [sel, setSel] = useState("chair");
  return (
    <div className="flex flex-wrap gap-4 rounded-xl border border-border p-5">
      <RoleCard
        name="Пайщик"
        status="inactive"
        selected={sel === "payer"}
        onClick={() => setSel("payer")}
        onEdit={() => {}}
      />
      <RoleCard
        name="Председатель правления"
        status="active"
        selected={sel === "chair"}
        onClick={() => setSel("chair")}
        onEdit={() => {}}
      />
    </div>
  );
}

const ROLE_ORG_COLUMNS = [
  {
    addLabel: "Добавить отдел",
    items: [
      { label: "Отдел источника", active: true },
      { label: "Отдел председателя" },
      { label: "Отдел офф. вопросов" },
    ],
  },
  {
    addLabel: "Добавить секцию",
    items: [
      { label: "Секция счетов и сборов", active: true },
      { label: "Секция сбора дебиторской задолженности" },
      { label: "Секция ведения взаиморасчётов и первичных документов с клиентами" },
    ],
  },
  {
    addLabel: "Добавить функцию",
    items: [
      { label: "Контроль сроков подписания договоров с партнёрами", sub: "Соколов М. А. - Член совета", active: true },
      { label: "Сверка реквизитов организаций перед сделкой", sub: "Кузнецова О. И. - Член совета" },
      { label: "Подготовка справок по запросам пайщиков", sub: "Не назначено", subTone: "danger" as const },
    ],
  },
  {
    addLabel: "Добавить технологию",
    items: [
      { label: "Регламент проверки контрагента" },
      { label: "Шаблон договора поставки", active: true },
      { label: "Чек-лист приёмки выполненных работ" },
    ],
  },
];

/** Экран «Структура роли»: вкладки + общие сведения + обязательства + каскад. */
function RoleStructure() {
  const [role, setRole] = useState("chair");
  return (
    <div className="flex flex-col gap-5">
      <span className="ds-caption-up text-foreground-subtle">
        Структура роли — «Ваши обязательства» (Tabs + CKPCard + RoleCard + OrgColumns)
      </span>

      <Tabs defaultValue="struct" variant="solid-light" size="l" aria-label="Роль">
        <Tab value="struct">Структура</Tab>
        <Tab value="plan">План развития</Tab>
        <Tab value="edu">Обучение</Tab>
      </Tabs>

      <CKPCard
        title="Общие сведения"
        subtitle="Илья А. А."
        avatarLabel="Илья"
        description="ЦКП роли: входящие обращения и звонки обработаны в день поступления, документы председателя подготовлены к подписанию в срок. В зону ответственности входят переписка от имени организации, контроль сроков по договорам и делопроизводство правления."
        editable
      />

      {/* Ваши обязательства */}
      <div className="flex flex-col gap-3">
        <span className="ds-p2-medium text-foreground">Ваши обязательства</span>
        <div className="flex flex-wrap gap-4">
          <RoleCard
            name="Пайщик"
            status="inactive"
            selected={role === "payer"}
            onClick={() => setRole("payer")}
            onEdit={() => {}}
          />
          <RoleCard
            name="Председатель правления"
            status="active"
            selected={role === "chair"}
            onClick={() => setRole("chair")}
            onEdit={() => {}}
          />
        </div>
      </div>

      {/* Стрелка-связка + каскад структуры (красная пунктирная область) */}
      <div className="flex justify-center text-[var(--color-red-400)]" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" className="size-5">
          <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="overflow-x-auto rounded-[10px] border border-dashed border-[var(--color-red-300)] bg-white p-5">
        <OrgColumns columns={ROLE_ORG_COLUMNS} activeColor="red" />
      </div>
    </div>
  );
}
