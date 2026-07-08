"use client";

/**
 * Демки «Создание договора» для витрины /ds.
 * Источник: Figma «UI фичи» / создание договора (164:26630 read, 164:26472 edit,
 * 182:48 участники+чат, 182:19/228:0/183:27 транзакции в блокчейне).
 * Переиспользованы DS: MemberCard, Badge, PropertyForm, QuestionCard, MessageComposer,
 * TableHeader, Item, Button.
 */
import {
  MemberCard,
  Badge,
  PropertyForm,
  QuestionCard,
  MessageComposer,
  TableHeader,
  Item,
  type MemberRow,
  type PropertyField,
  type TableColumn,
} from "@/components/ds";

const dark = "var(--color-dark-900)";
const blue = "var(--color-blue-midhub-500)";

const READ_ROWS: MemberRow[] = [
  { label: "Статус соглашения", value: <Badge color="green">Согласован</Badge> },
  { label: "Тип верификации", value: <Badge color="orange">Международный</Badge> },
  { label: "Документ", value: "Договор" },
  { label: "Заголовок", value: "Контракт MIDHUB" },
  { label: "Исполнитель", value: "ИП «Сложная»" },
  { label: "Номер", value: "3201" },
  { label: "Код", value: "202" },
  { label: "Сумма", value: "20 000 ₽" },
  { label: "Комментарий", value: "Крутой договор" },
];

const FORM_FIELDS: PropertyField[] = [
  { label: "Заголовок", value: "Контракт MIDHUB", wide: true },
  { label: "Исполнитель", kind: "select" },
  { label: "Название договора" },
  { label: "Номер договора" },
  { label: "Код" },
  { label: "Сумма" },
  { label: "Комментарий", kind: "textarea" },
];

const TX_COLS: TableColumn[] = [
  { key: "doc", label: "Документ" },
  { key: "user", label: "Участник", align: "center" },
  { key: "tx", label: "Номер транзакции", align: "center" },
  { key: "date", label: "Дата", align: "right", sortable: true },
];

const TX = [
  "Добавление договора", "Подписи", "Конвертация MIDHUB", "Добавление договора",
];

function TxLine({ doc }: { doc: string }) {
  return (
    <Item tone="muted" bordered={false} size="s" trailing={<span style={{ color: dark }}>11.01.2020 - 13:00</span>}>
      <div className="grid grid-cols-3 items-center">
        <span style={{ color: dark }}>{doc}</span>
        <span className="text-center" style={{ color: blue }}>Конвертация MIDHUB</span>
        <span className="text-center" style={{ color: blue }}>5c243af... 07db8</span>
      </div>
    </Item>
  );
}

export function ContractDemos() {
  return (
    <div className="flex max-w-[1019px] flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Просмотр договора (MemberCard + Badge)</span>
        <MemberCard title="Договор №12" defaultOpen rows={READ_ROWS} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Редактирование (PropertyForm)</span>
        <PropertyForm title="Договор" fields={FORM_FIELDS} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Участники + чат (QuestionCard + MessageComposer)</span>
        <QuestionCard title="2 Участника" defaultOpen>
          <MessageComposer placeholder="Сообщение" />
        </QuestionCard>
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Транзакции в блокчейне (TableHeader + Item)</span>
        <div className="overflow-hidden rounded-[4px] border border-border">
          <div className="border-b border-border px-2 pt-2">
            <TableHeader columns={TX_COLS} sortKey="date" sortDir="desc" />
          </div>
          {TX.map((d, i) => <TxLine key={i} doc={d} />)}
        </div>
      </div>
    </div>
  );
}
