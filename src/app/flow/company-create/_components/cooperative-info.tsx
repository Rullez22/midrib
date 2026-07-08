"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge, QuestionCard } from "@/components/ds";
import { useRegFlow } from "./reg-flow";

/**
 * CooperativeInfo — карточки документа на валидацию: «Информация о кооперативе» +
 * «Пайщики» + «Документы». Источник: Figma 2512:302007 / 2512:304780 / 2537:325679.
 * Переиспользуется на экране голосования по уставу и в чате с валидатором.
 *
 * Пайщики — реальные избранные (flow.chairs / councilSlots), остальное — данные
 * кооператива (как в профиле компании).
 */

const OKVED = [
  "81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая",
  "81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования",
  "64.19 - Денежное посредничество прочее",
];

const INFO_ROWS: { label: string; value: ReactNode }[] = [
  { label: "Тип верификации", value: <Badge variant="solid" color="orange">Локальный</Badge> },
  { label: "Тип документа", value: "Устав" },
  { label: "Регистрационный номер", value: "106700000040" },
  { label: "Организация", value: "Immatra" },
  { label: "Местоположение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
  { label: "Полный адрес", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
  { label: "Контактный телефон", value: "+7 (992) 223-22-22" },
  { label: "E-mail", value: "immatra@immatra.ru" },
  { label: "ОКВЭД", value: <span className="flex flex-col gap-2">{OKVED.map((c) => <span key={c}>{c}</span>)}</span> },
  { label: "ИНН", value: "1234567890" },
  { label: "Орган выдавший документ", value: "Управление министерства юстиции РФ по Санкт-Петербургу" },
  { label: "Дата решения", value: "03.08.2020" },
  { label: "Дата внесения в ЕГРЮЛ", value: "04.08.2020" },
];

/** ФИО пайщиков по индексу (как в council-voting ROSTER / activity MEMBERS). */
const NAMES = [
  "Дмитров Александр Романович",
  "Александров Дмитрий Александрович",
  "Курт Розалина Артуровна",
  "Валенов Джо Валенович",
  "Антонов Илья Андреевич",
];

const DOCS = [
  { type: "Сертификат", name: "Сертификат соответствия", date: "09.01.2020" },
  { type: "Свидетельство", name: "Свидетельство о государственной регистрации программы ЭВМ", date: "09.01.2020" },
  { type: "Лицензия", name: "Лицензия на использование ЭВМ", date: "09.01.2020" },
];

/** Строка label/value (260px + значение). */
function InfoRow({ label, value, i }: { label: ReactNode; value: ReactNode; i: number }) {
  return (
    <div className={cn("grid grid-cols-[260px_1fr] items-start gap-6 py-4", i > 0 && "border-t border-border")}>
      <span className="ds-p3 text-foreground-subtle">{label}</span>
      <span className="ds-p3 text-foreground">{value}</span>
    </div>
  );
}

export function CooperativeInfo({ afterPaishiki }: { afterPaishiki?: ReactNode }) {
  const flow = useRegFlow();
  const name = (i?: number | null) => (i != null ? NAMES[i] ?? "—" : "—");
  const councilNames = flow.councilSlots.filter((x): x is number => x != null).map((i) => NAMES[i]);
  const paishikiRows: { label: string; value: ReactNode }[] = [
    { label: "Председатель правления", value: name(flow.chairs[1]) },
    { label: "Председатель совета", value: name(flow.chairs[0]) },
    { label: "Совет", value: <span className="flex flex-col gap-2">{councilNames.map((n) => <span key={n}>{n}</span>)}</span> },
  ];

  return (
    <div className="flex flex-col gap-8">
      <QuestionCard title="Информация о кооперативе" defaultOpen>
        <div className="flex flex-col">
          {INFO_ROWS.map((r, i) => <InfoRow key={String(r.label)} label={r.label} value={r.value} i={i} />)}
        </div>
      </QuestionCard>

      <QuestionCard title="Пайщики" defaultOpen>
        <div className="flex flex-col">
          {paishikiRows.map((r, i) => <InfoRow key={String(r.label)} label={r.label} value={r.value} i={i} />)}
        </div>
      </QuestionCard>

      {afterPaishiki}

      <QuestionCard title="Документы" defaultOpen>
        <div className="flex flex-col gap-2">
          {DOCS.map((d, i) => (
            <div key={i} className="flex items-center gap-4 rounded-[4px] border border-border px-4 py-3">
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="ds-caption text-foreground-subtle">{d.type}</span>
                <span className="ds-p3 text-foreground">{d.name}</span>
              </div>
              <span className="ds-p3 shrink-0 text-foreground">{d.date}</span>
            </div>
          ))}
        </div>
      </QuestionCard>
    </div>
  );
}
