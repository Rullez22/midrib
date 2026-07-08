"use client";

/**
 * Демки «Свойства документа» для витрины /ds.
 * Источник: Figma «UI фичи» — свойства документа: просмотр (426:57963) и
 * редактирование (420:49); обзор 426:58118.
 * Переиспользованы DS: MemberCard (просмотр), PropertyForm (редактирование).
 */
import { MemberCard, PropertyForm, type MemberRow, type PropertyField } from "@/components/ds";

const ROWS: MemberRow[] = [
  { label: "Наименование документа", value: "Военный билет" },
  { label: "Категория", value: "Удостоверяющие личность" },
  { label: "Статус", value: "Верифицируемый" },
  { label: "Тип", value: "Уникальный" },
  { label: "Код", value: "222" },
  { label: "Время актуальности документа", value: "10 лет" },
  { label: "MIN. кол-во компаний валидаторов", value: "6" },
  { label: "MIN. кол-во компаний эмитентов", value: "6" },
  { label: "MIN. кол-во сотрудников в компании", value: "5" },
];

const FIELDS: PropertyField[] = [
  { label: "Наименование документа", wide: true },
  { label: "Категория", kind: "select" },
  { label: "Статус", kind: "select" },
  { label: "Тип", kind: "select" },
  { label: "Код" },
  { label: "Время актуальности документа", kind: "number" },
  { label: "MIN. кол-во компаний валидаторов" },
  { label: "MIN. кол-во компаний эмитентов" },
  { label: "MIN. кол-во сотрудников в компании" },
];

export function DocumentPropsDemos() {
  return (
    <div className="flex max-w-[864px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Просмотр (MemberCard)</span>
        <MemberCard title="Свойства документа" defaultOpen rows={ROWS} />
      </div>
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Редактирование (PropertyForm)</span>
        <PropertyForm title="Свойства документа" fields={FIELDS} />
      </div>
    </div>
  );
}
