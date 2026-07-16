"use client";

/**
 * Демки «Голосование» для витрины /ds.
 * Источник: Figma «UI фичи» / Голосование (136:26218, 196:310 — карточки;
 * 136:26257, 197:41370, 535:59465 — история транзакций).
 * Переиспользованы DS: QuestionCard, ProgressRing, Button, Badge, TableHeader, Item.
 */
import {
  QuestionCard,
  ProgressRing,
  Button,
  Badge,
  TableHeader,
  Item,
  type TableColumn,
} from "@/components/ds";

const dark = "var(--color-dark-900)";
const blue = "var(--color-blue-midhub-500)";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="ds-caption text-foreground-subtle">{label}</span>
      <span className="ds-p3 text-foreground">{value}</span>
    </div>
  );
}

function VotePanel({ value, children }: { value: number; children: React.ReactNode }) {
  return (
    <div className="flex w-[260px] flex-none flex-col items-center gap-4 rounded-[4px] border border-border p-5">
      <div className="text-center">
        <div className="ds-p3-medium text-foreground">Завершённость голосования</div>
        <div className="ds-caption text-foreground-subtle">Общее процентное отношение</div>
      </div>
      <ProgressRing value={value} />
      {children}
    </div>
  );
}

const TX_COLS: TableColumn[] = [
  { key: "user", label: "Участники" },
  { key: "res", label: "Результат", align: "center" },
  { key: "tx", label: "Номер транзакции", align: "center" },
  { key: "date", label: "Дата", align: "right", sortable: true },
];

function BlueCheck() {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full" style={{ background: blue }}>
      <svg width="14" height="14" viewBox="0 0 24 24" style={{ color: "#fff" }}><path d="m6 12 4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

function TxLine() {
  return (
    <Item tone="muted" bordered={false} size="s" trailing={<span style={{ color: dark }}>22.04.2025 - 13:00</span>}>
      <div className="grid grid-cols-3 items-center">
        <span className="truncate" style={{ color: dark }}>0xca30e63200a0fe3182dc61fc5605efc41456f32</span>
        <span className="flex justify-center"><BlueCheck /></span>
        <span className="text-center" style={{ color: blue }}>5c243af... 07db8</span>
      </div>
    </Item>
  );
}

export function VotingDemos() {
  return (
    <div className="flex max-w-[1120px] flex-col gap-6">
      {/* Голосование — в процессе (Против / За) */}
      <QuestionCard title="Голосование" defaultOpen>
        <div className="flex gap-6">
          <div className="flex flex-1 flex-col gap-4">
            <Row label="Ваш ID" value="0xca30e63200a0fe3182dc61fc5605efc41456f32" />
            <Row label="Кол-во голосов для принятия решения" value="4" />
            <Row label="Проголосовало" value="3" />
            <Row label="Ваш статус ответа" value={<Badge color="orange">Ожидает участия</Badge>} />
          </div>
          <VotePanel value={75}>
            <div className="flex w-full gap-3">
              <Button variant="secondary" className="flex-1">Против</Button>
              <Button className="flex-1">За</Button>
            </div>
          </VotePanel>
        </div>
      </QuestionCard>

      {/* Голосование — завершено (100%) */}
      <QuestionCard title="Голосование" defaultOpen>
        <div className="flex gap-6">
          <div className="flex flex-1 flex-col gap-4">
            <Row label="Ваш ID" value="0xca30e63200a0fe3182dc61fc5605efc41456f32" />
            <Row label="Кол-во голосов для принятия решения" value="5" />
            <Row label="Проголосовало" value="5" />
            <Row label="Ваш статус ответа" value={<Badge color="green">За</Badge>} />
          </div>
          <VotePanel value={100}>
            <span className="ds-caption flex items-center gap-2 text-foreground-muted"><BlueCheck /> Вы успешно проголосовали</span>
            <Button variant="negative-sec" fullWidth>Закончить голосование</Button>
          </VotePanel>
        </div>
      </QuestionCard>

      {/* История транзакций — TableHeader + vote-line Items */}
      <div className="overflow-hidden rounded-[4px] border border-border">
        <div className="border-b border-border px-2 pt-2">
          <TableHeader columns={TX_COLS} sortKey="date" sortDir="desc" />
        </div>
        <div className="flex flex-col">
          {Array.from({ length: 4 }).map((_, i) => <TxLine key={i} />)}
        </div>
      </div>
    </div>
  );
}
