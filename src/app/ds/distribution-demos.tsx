"use client";

/**
 * Демки «distribution» (распределение ролей %) для витрины /ds.
 * Источник: Figma «UI фичи» (581:61610 редактор, 582:64731 строка роли, 593:130 добавить,
 * 582:64781 буферная область).
 * 100% reuse: IncrimentField, DeleteButton, Button, ProgressRing. Новых компонентов нет.
 */
import { IncrimentField, DeleteButton, Button, ProgressRing, Text } from "@/components/ds";

const Plus = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;

function RoleRow({ role, name }: { role: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <IncrimentField
        className="flex-1"
        size="m"
        defaultValue={0}
        suffix="%"
        label={<span className="flex flex-col"><span className="ds-p3-medium text-foreground">{role}</span><span className="ds-caption text-foreground-subtle">{name}</span></span>}
      />
      <DeleteButton aria-label="Удалить роль" />
    </div>
  );
}

export function DistributionDemos() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex w-[600px] max-w-full flex-col gap-3">
        <Text variant="caption-up" tone="subtle">Выберите роли и укажите необходимый %</Text>
        <RoleRow role="Помощник пред. правления" name="Мирон З." />
        <RoleRow role="Помощник пред. правления" name="Максим Ц." />
        <Button variant="tertiary" iconLeft={<Plus />} className="self-start">Добавить роль</Button>
      </div>

      <div className="flex w-[320px] flex-none flex-col items-center gap-4 rounded-[4px] border border-border p-6">
        <div className="text-center">
          <Text variant="p3-medium">Маркетинговое подразделение</Text>
          <Text variant="caption" tone="subtle">Необходимо % перевести на роли</Text>
        </div>
        <ProgressRing value={100} />
      </div>
    </div>
  );
}
