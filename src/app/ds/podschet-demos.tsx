"use client";

/**
 * Демки «Создание подсчёта» для витрины /ds.
 * Источник: Figma «UI фичи» / создание подсчёта (1506:179108 форма, 1507:184133 просмотр).
 * 100% reuse DS: Input, Radio, Textarea, IncrimentField, ProgressRing, Checkbox, MemberCard, Badge.
 */
import {
  Input,
  Radio,
  Textarea,
  IncrimentField,
  ProgressRing,
  Checkbox,
  MemberCard,
  Badge,
  Text,
  type MemberRow,
} from "@/components/ds";

const OPTS = [
  "Установить процент, ниже которого при будущих корректировках опускаться будет невозможно.",
  "Зафиксировать % поступлений без возможности изменений в будущем",
];
const ChevronDown = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function PanelRight({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex w-[300px] flex-none flex-col gap-4 rounded-[4px] border border-primary p-6">
      <div className="text-center">
        <div className="ds-p3-medium text-foreground">{title}</div>
        <div className="ds-caption text-foreground-subtle">Процент перенаправлений со счетов</div>
      </div>
      <ProgressRing value={value} className="mx-auto" />
      <div className="flex flex-col">
        {OPTS.map((o, i) => (
          <div key={i} className="flex items-start justify-between gap-3 border-t border-border py-3">
            <span className="ds-caption text-foreground-subtle">{o}</span>
            <Checkbox size="xs" aria-label="Отметить" />
          </div>
        ))}
      </div>
    </div>
  );
}

const OKVED = (
  <>
    <div>81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая;</div>
    <div>81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования;</div>
    <div>81.30 - Предоставление услуг по благоустройству ландшафта;</div>
  </>
);
const READ: MemberRow[] = [
  { label: "Наименование счета", value: "Маркетинговый счет" },
  { label: "Тип счета", value: <Badge color="blue">Счет-пул</Badge> },
  { label: "Коды и ОКВЭД", value: OKVED },
  { label: "Назначение счета", value: "На организацию акций и маркетинговых мероприятий." },
  { label: "Источник поступлений", value: "Целевой счет" },
];

function ReadDistrib({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[4px] border border-border px-4 py-3">
      <span className="ds-p3-medium text-foreground">{label}</span>
      <span className="ds-p3 rounded-[4px] border border-border px-4 py-1.5 text-foreground">{value}</span>
    </div>
  );
}

export function PodschetDemos() {
  return (
    <div className="flex flex-col gap-10">
      {/* Создание (форма) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Создание подсчёта (форма)</span>
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex w-[600px] max-w-full flex-col gap-5">
            <Input size="l" placeholder="Название подсчета" />
            <div className="flex flex-col gap-3">
              <Text variant="p3">Выберите тип подсчета</Text>
              <div className="flex items-center gap-8">
                <Radio name="ptype" value="pool" size="xs" defaultChecked label="Счет-пул" />
                <Radio name="ptype" value="matryoshka" size="xs" label="Счет-матрешка" />
              </div>
            </div>
            <Input size="l" placeholder="Напишите ОКВЭД или выберите из списка" rightIcon={<ChevronDown />} readOnly />
            <Textarea size="l" placeholder="Назначение счета" />
            <div className="flex flex-col gap-1">
              <Text variant="caption" tone="subtle">Источник поступлений</Text>
              <Text variant="p3">Целевой счет</Text>
            </div>

            <Text variant="caption-up" tone="subtle">Распределение целевого счета</Text>
            <IncrimentField label="Целевой счет" defaultValue={40} suffix="%" />
            <Text variant="caption-up" tone="subtle">Распределение подсчетов целевого счета</Text>
            <IncrimentField label="Счет инвестиционных токенов" defaultValue={20} suffix="%" />
            <IncrimentField label="Счет управляющих токенов" defaultValue={20} suffix="%" />
            <IncrimentField label="Маршрутный счет" defaultValue={20} suffix="%" />
          </div>
          <PanelRight title="Название подсчета" value={0} />
        </div>
      </div>

      {/* Просмотр */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Просмотр подсчёта (MemberCard + распределение)</span>
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex w-[600px] max-w-full flex-col gap-5">
            <MemberCard title="Подсчёт" defaultOpen rows={READ} />
            <Text variant="caption-up" tone="subtle">Распределение целевого счета</Text>
            <ReadDistrib label="Целевой счет" value="30 %" />
            <Text variant="caption-up" tone="subtle">Распределение подсчетов целевого счета</Text>
            <ReadDistrib label="Счет инвестиционных токенов" value="20 %" />
            <ReadDistrib label="Счет управляющих токенов" value="20 %" />
            <ReadDistrib label="Маршрутный счет" value="20 %" />
          </div>
          <PanelRight title="Маркетинговый счет" value={10} />
        </div>
      </div>
    </div>
  );
}
