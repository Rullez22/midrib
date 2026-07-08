"use client";

/**
 * Демки Item · данные (документы / транзакции / ОКВЭД) для витрины /ds.
 * Источник: Figma «UI фичи» — Документы и подсчета (702:66537),
 * Транзакция (672:26), ОКВЭД (1506:179093), документы еще (629:1).
 * Переиспользованы DS: Item, ItemDivider, Badge, Button, DeleteButton.
 */
import { Item, ItemDivider, Badge, Button, DeleteButton, EditPencilIcon } from "@/components/ds";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function ShareIcon() {
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24">
      <path d="M14 7l5 5-5 5" {...s} />
      <path d="M19 12H9a5 5 0 0 0-5 5v1" {...s} />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" {...s} />
      <path d="M14 3v5h5" {...s} />
    </svg>
  );
}
function PencilIcon() {
  return <EditPencilIcon className="size-6" />;
}
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ color: "var(--color-blue-midhub-500)" }}>
      <circle cx="12" cy="12" r="9" {...s} />
      <path d="M12 11.5v4.5" {...s} />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Двустрочная ячейка: серый overline-лейбл + значение. */
function Overline({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <span className="flex flex-col gap-1">
      <span style={{ color: "var(--color-grey-300)" }}>{label}</span>
      <span style={{ color: "var(--color-dark-900)" }}>{value}</span>
    </span>
  );
}

/** Двустрочная ячейка: значение + подпись снизу. */
function Stacked({ top, sub, topColor }: { top: React.ReactNode; sub: React.ReactNode; topColor?: string }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span style={{ color: topColor ?? "var(--color-blue-midhub-500)" }}>{top}</span>
      <span className="ds-caption" style={{ color: "var(--color-grey-300)" }}>{sub}</span>
    </span>
  );
}

function BlueCheck() {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full" style={{ backgroundColor: "var(--color-blue-midhub-500)" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" style={{ color: "#fff" }}>
        <path d="m6 12 4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const blue = "var(--color-blue-midhub-500)";
const dark = "var(--color-dark-900)";

/** Строка-голосование (line transaction vote) — Item без рамки, muted. */
function VoteLine({ className }: { className?: string }) {
  return (
    <Item
      tone="muted"
      bordered={false}
      size="s"
      className={className}
      trailing={<span style={{ color: dark }}>11.01.2020 - 13:00</span>}
    >
      <div className="grid grid-cols-3 items-center">
        <span style={{ color: dark }} className="truncate">0xca30e63200a0fe3182dc61fc5605efc41456f32</span>
        <span className="flex justify-center"><BlueCheck /></span>
        <span className="flex items-center justify-end gap-1" style={{ color: blue }}>
          5c243af... 07db8 <InfoIcon />
        </span>
      </div>
    </Item>
  );
}

export function ItemDataDemos() {
  return (
    <div className="flex max-w-[1120px] flex-col gap-5">
      {/* Документы */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">документы и подсчёт</span>

        {/* Основание: overline | бейдж | дата */}
        <Item>
          <div className="grid grid-cols-3 items-center">
            <Overline label="Договор" value="Договор №1" />
            <span className="flex justify-center"><Badge color="green">Согласован</Badge></span>
            <span className="text-right" style={{ color: dark }}>09.01.2020</span>
          </div>
        </Item>

        {/* Артефакт: overline | дата · разделитель · share */}
        <Item trailing={<><span style={{ color: dark }}>09.01.2020</span><ItemDivider /><ShareIcon /></>}>
          <Overline label="Документ" value="Документ в свободной форме" />
        </Item>

        {/* Свидетельство: значение | статус | бейдж | дата */}
        <Item>
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-6">
            <span style={{ color: dark }}>Свидетельство о государственной регистрации программы ЭВМ</span>
            <span style={{ color: "var(--color-dark-800)" }}>Отвалидирован</span>
            <Badge color="orange">Локальный</Badge>
            <span style={{ color: dark }}>09.01.2020</span>
          </div>
        </Item>

        {/* Подсчёт: 20% + счёт | сумма | Подробнее */}
        <Item trailing={<Button variant="secondary" size="s">Подробнее</Button>}>
          <div className="grid grid-cols-3 items-center">
            <span className="flex items-center gap-3">
              <span className="ds-h4" style={{ color: blue }}>20 %</span>
              <span style={{ color: dark }}>Маршрутный счет</span>
            </span>
            <span className="text-center" style={{ color: dark }}>100 000 PAEV</span>
            <span />
          </div>
        </Item>
      </div>

      {/* Транзакции */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">транзакции (бейдж кода + колонки)</span>
        <Item leading={<Badge variant="solid" color="cyan">214</Badge>}>
          <div className="grid grid-cols-5 items-center gap-4">
            <Stacked top={<span className="inline-flex items-center gap-1">5c243af... 07db8 <InfoIcon /></span>} sub="29 секунд назад" />
            <Stacked top="ООО “Ромашка”" sub={<span style={{ color: blue }}>ООО “Петрушка”</span>} />
            <Stacked top={<span className="inline-flex items-center gap-1">Счет на оплату <InfoIcon /></span>} sub={<span style={{ color: dark }}>Закупка площадок</span>} />
            <span className="text-center" style={{ color: dark }}>0.229937</span>
            <span className="text-right" style={{ color: dark }}>0.0022</span>
          </div>
        </Item>
      </div>

      {/* документы еще: muted + файл + редактирование/удаление */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">документ + редактировать / удалить</span>
        <div className="flex items-center gap-4">
          <Item tone="muted" leading={<FileIcon />}>Паспорт</Item>
          <Button variant="tertiary" size="m" icon={<PencilIcon />} aria-label="Редактировать" />
          <DeleteButton aria-label="Удалить" />
        </div>
      </div>

      {/* ОКВЭД: текст + красное удаление */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">ОКВЭД</span>
        <div className="flex items-center gap-2">
          <span style={{ color: dark }} className="ds-p3">
            81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая
          </span>
          <DeleteButton size="sm" aria-label="Удалить" />
        </div>
      </div>

      {/* line transaction vote: Item без рамки (muted), 2 ширины */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">line transaction vote (small / long)</span>
        <VoteLine className="max-w-[966px]" />
        <VoteLine />
      </div>
    </div>
  );
}
