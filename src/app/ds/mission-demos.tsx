"use client";

/**
 * Демки «Миссия / Структура кооператива» для витрины /ds.
 * Источник: Figma «UI фичи» / миссия (29 нод: task, новость, департамент,
 * профиль, структура кооператива + состояния редактирования/добавления).
 * Reuse: Tabs, QuestionCard (департамент открт), Button, Link + новые композиты
 * InfoCard / ProfileCard / CKPCard / OrgColumns.
 */
import {
  InfoCard,
  ProfileCard,
  CKPCard,
  OrgColumns,
  QuestionCard,
  Tabs,
  Tab,
  Button,
  Link,
} from "@/components/ds";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et curabitur dolor egestas id vulputate et sagittis urna. Sociis.";

const DEPARTMENTS = [
  { color: "red" as const, title: "Администрация", items: ["Отдел источника", "Отдел председателя", "Отдел генерального директора"], active: true },
  { color: "orange" as const, title: "HR", items: ["Отдел направления и персонала", "Отдел коммуникаций", "Отдел контроля и повышения эффективности персонала"] },
  { color: "grey" as const, title: "Производство", items: ["Отдел маркетинга", "Отдел информационных материалов", "Отдел продвижения"] },
  { color: "blue" as const, title: "Коммуникации", items: ["Отдел дохода", "Отдел расходов", "Офис имущества и документации"] },
  { color: "cyan" as const, title: "Развитие", items: ["Отдел планирования", "Отдел подготовки внедрения", "Отдел внедрения КСУ"] },
  { color: "purple" as const, title: "Квалификации", items: ["Отдел контроля качества", "Отдел подготовки технического персонала", "Отдел совершенствования"] },
  { color: "green" as const, title: "Распределение", items: ["Отдел консультаций по продукту", "Отдел продаж проектов КСУ", "Отдел сопровождения и доп. услуг"] },
];

const ORG_COLUMNS = [
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
      { label: "Vestibulum justo sollicitudin vitae sum dolor sit amet", sub: "Петров А. А. - Член совета", active: true },
      { label: "Vestibulum justo sollicitudin vitae sum dolor sit amet", sub: "Не назначено", subTone: "danger" as const },
    ],
  },
  {
    addLabel: "Добавить технологию",
    items: [
      { label: "Lorem ipsum dolor sit amet, consectetur" },
      { label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit", active: true },
    ],
  },
];

export function MissionDemos() {
  return (
    <div className="flex flex-col gap-12">
      {/* Мелкие карточки ленты */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Карточки: задание · новость · департамент (QuestionCard)</span>
        <div className="flex flex-wrap items-start gap-4">
          <InfoCard
            meta="Выполнено: 55%"
            progress={55}
            title="Задание №1"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et curabitur dolor egestas id vulputate et sagittis urna. Sociis."
            action={<Link href="#" size="p3">Продолжить</Link>}
          />
          <InfoCard
            meta="1 час назад"
            title="Новость 1"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et curabitur dolor egestas id vulputate et"
            action={<Link href="#" size="p3">Подробнее</Link>}
          />
          <div className="w-[300px]">
            <QuestionCard
              size="s"
              defaultOpen
              title="Заголовок"
              footer={<Button variant="secondary" size="s">Подробнее</Button>}
            >
              <div className="flex flex-col gap-2">
                <span className="ds-caption text-foreground-subtle">Петров А. А. - Член совета</span>
                <span className="ds-p3 text-foreground-muted">ЦКП: Все деньги, собранные своевременно, правильно учтённые и отражённые в документации</span>
              </div>
            </QuestionCard>
          </div>
          <ProfileCard
            color="orange"
            title="HR"
            person="Петров А. А."
            items={["Отдел направления и персонала", "Отдел коммуникаций", "Отдел контроля и повышения эффективности персонала"]}
            editable
          />
        </div>
      </div>

      {/* Структура кооператива */}
      <div className="flex flex-col gap-4">
        <span className="ds-caption-up text-foreground-subtle">Структура кооператива</span>

        <Tabs defaultValue="struct" variant="basic" size="m" aria-label="Структура">
          <Tab value="struct">Структура</Tab>
          <Tab value="plan">План развития</Tab>
          <Tab value="edu">Обучение</Tab>
        </Tabs>

        <CKPCard
          subtitle="Администрация"
          meta="150 пайщиков"
          avatarLabel="Immatra"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque tempus, consequat eLorem dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque tempus, consequat euismod. Vel sed non gravida pharetra semper."
          editable
        />

        <div className="flex flex-wrap gap-3">
          {DEPARTMENTS.map((d) => (
            <ProfileCard key={d.title} {...d} editable />
          ))}
        </div>
      </div>

      {/* Каскадный редактор Отдел → Секция → Функция → Технология */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Отдел → Секция → Функция → Технология (OrgColumns)</span>
        <div className="overflow-x-auto rounded-[10px] border border-border bg-white p-5">
          <OrgColumns columns={ORG_COLUMNS} />
        </div>
      </div>
    </div>
  );
}
