"use client";

/**
 * Демки «Шаблон документа» для витрины /ds.
 * Источник: Figma «UI фичи» / шаблон (427:46, 434:0, 601:61787, 1405:166565,
 * 1407:169024, 455:79179 …). Конструктор шаблона собран из DS:
 * Panel + QuestionCard + Badge + Textarea + PropertyForm + Button.
 */
import {
  Panel,
  QuestionCard,
  Badge,
  Textarea,
  PropertyForm,
  type PropertyField,
} from "@/components/ds";

const FIELDS = [
  "Тип документа", "Регистрационный номер", "Организация", "Местонахождение",
  "Почтовый адрес", "Контактный телефон", "E-mail", "ОКВЭД", "ИНН",
  "Орган выдавший документ", "Дата решения", "Дата внесения в ЮГРЮЛ",
  "Прикрепленные документы",
];

const ADD_FIELD: PropertyField[] = [
  { label: "Наименование поля", wide: true },
  { label: "Тип", kind: "select" },
  { label: "Тип элемента в списке", kind: "select" },
];

function ReqBody() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="ds-p3 text-foreground-subtle">Описание</span>
        <span className="ds-p3 text-foreground">
          Данные требования распространяются на документы категории «удостоверяющие личность» в РФ.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="ds-p3 text-foreground-subtle">Тип верификации:</span>
        <Badge color="orange">Международный</Badge>
        <Badge color="orange">Жёлтый</Badge>
      </div>
    </div>
  );
}

export function TemplateDemos() {
  return (
    <div className="flex max-w-[864px] flex-col gap-6">
      {/* Поля документа — список collapsible-полей + добавить */}
      <Panel title="Поля документа" bodyClassName="flex flex-col gap-2 p-4" addLabel="Добавить поле" onAdd={() => {}}>
        {FIELDS.map((f) => (
          <QuestionCard key={f} size="s" title={f} />
        ))}
      </Panel>

      {/* Добавить новое поле — форма */}
      <PropertyForm title="Добавить новое поле" fields={ADD_FIELD} />

      {/* Описание к шаблону */}
      <Panel title="Описание к шаблону">
        <Textarea size="l" placeholder="Описание" />
      </Panel>

      {/* Требования валидатора — карточки с бейджами + добавить */}
      <Panel title="Требования для валидатора к локальной проверке" bodyClassName="flex flex-col gap-3 p-4" addLabel="Добавить требование" onAdd={() => {}}>
        <QuestionCard
          size="s"
          defaultOpen
          title={
            <span className="flex w-full items-center justify-between gap-2">
              <span>Для документов об образовании</span>
              <Badge color="orange">Жёлтый</Badge>
            </span>
          }
        >
          <ReqBody />
        </QuestionCard>
        <QuestionCard
          size="s"
          title={
            <span className="flex w-full items-center justify-between gap-2">
              <span>Для документов об аттестации</span>
              <Badge color="green">Зелёный</Badge>
            </span>
          }
        />
      </Panel>

      {/* Требования для пользователя — добавить роль */}
      <Panel title="Требования для пользователя" addLabel="Необходимая роль" onAdd={() => {}} />
    </div>
  );
}
