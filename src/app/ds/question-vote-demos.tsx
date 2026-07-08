"use client";

/**
 * Демки «Вопрос (голосование)» для витрины /ds.
 * Источник: Figma «UI фичи» — вопрос: просмотр (527:0, 513:1, 575:61505, 579:61604)
 * и редактирование (577:61505, 574:61417, 518:59374).
 * Переиспользованы DS: MemberCard (просмотр), QuestionForm, Text.
 */
import { MemberCard, QuestionForm, type MemberRow } from "@/components/ds";

function Info() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="inline-block align-text-bottom text-foreground-subtle" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11.5v4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

const QUESTION_ROWS: MemberRow[] = [
  { label: "Описание вопроса", value: "Тут описание вопроса, выносимый на голосование, варианты ответов, возможные значения для кастомизации вопроса, срок вступления решения в силу." },
  { label: <>MIN продолжительность <Info /></>, value: "24 часа" },
  { label: <>MAX продолжительность <Info /></>, value: "24 часа" },
  { label: <>Кворум <Info /></>, value: "100 %" },
  { label: <>Первоначальный кворум <Info /></>, value: "—" },
  { label: <>Консенсус <Info /></>, value: "50 %" },
  { label: <>Тип роли <Info /></>, value: "Члены совета" },
  { label: <>Доступен с первого <Info /></>, value: "Нет" },
];

export function QuestionVoteDemos() {
  return (
    <div className="flex max-w-[966px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Просмотр (MemberCard + параметры вопроса)</span>
        <MemberCard title="Прием в члены кооператива" defaultOpen rows={QUESTION_ROWS} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Редактирование (QuestionForm)</span>
        <QuestionForm transferable="no" />
      </div>
    </div>
  );
}
