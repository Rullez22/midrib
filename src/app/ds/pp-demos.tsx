"use client";

/**
 * Демки «ПП» (производственная программа / согласие / документы) для /ds.
 * Источник: Figma «UI фичи» / ПП (246:54, 251:43009 пустые состояния; 249:42965 согласие;
 * 1915:* верификация-таблицы; 352:439/385:* вложенные секции).
 * Новый: EmptyState. Остальное — reuse Panel, Flag, Button, Badge, MemberCard, TableHeader, Item.
 */
import { EmptyState, Panel, Flag, Button, Badge, MemberCard, EditPencilIcon, type MemberRow } from "@/components/ds";

const PencilBtn = () => (
  <button type="button" aria-label="Редактировать" className="text-primary">
    <EditPencilIcon className="size-5" />
  </button>
);

const PP_ROWS: MemberRow[] = [
  { label: "Тип верификации", value: <Badge color="orange">Международная</Badge> },
  { label: "Наименование", value: "ПП №1 — Производственная программа" },
  { label: "Статус", value: <Badge color="green">Согласован</Badge> },
];

export function PPDemos() {
  return (
    <div className="flex flex-col gap-8">
      {/* Пустые состояния */}
      <div className="flex flex-wrap gap-6">
        <div className="w-[360px] rounded-[4px] border border-border">
          <EmptyState title="Отсутствуют документы" />
        </div>
        <div className="w-[360px] rounded-[4px] border border-border">
          <EmptyState
            title="Для выбора данных пользователя и его документов вам необходимо нажать кнопку «Продолжить»"
            action={<Button>Продолжить</Button>}
          />
        </div>
      </div>

      {/* Согласие — локализации (Panel + Flag + Button) */}
      <div className="flex flex-wrap gap-6">
        <Panel title="Согласие" className="w-[360px]" bodyClassName="p-4">
          <Button variant="secondary" fullWidth>Создать</Button>
        </Panel>
        <Panel title="Согласие" className="w-[360px]" bodyClassName="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-3 rounded-[4px] border border-border px-4 py-2">
            <Flag code="ru" label="Русский (по умолчанию)" />
            <PencilBtn />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[4px] border border-border px-4 py-2">
            <Flag code="bg" label="Болгарский" />
            <PencilBtn />
          </div>
          <Button variant="secondary" fullWidth>Добавить локализацию</Button>
        </Panel>
      </div>

      {/* Просмотр ПП (MemberCard + Badge) */}
      <MemberCard title="ПП №1" defaultOpen rows={PP_ROWS} className="max-w-[600px]" />
    </div>
  );
}
