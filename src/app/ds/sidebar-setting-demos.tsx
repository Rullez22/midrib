"use client";

/**
 * Демки «Right sidebar setting» (Верификации) для витрины /ds.
 * Источник: Figma «UI фичи» / right sidebar (444:80216, 469:0, 611:61819 …).
 * Переиспользованы DS: SidebarPanel, SettingRow, Toggle, Checkbox, Button.
 */
import {
  SidebarPanel,
  SettingRow,
  Toggle,
  Checkbox,
  Button,
} from "@/components/ds";

function EyeIcon() {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" {...s} />
      <circle cx="12" cy="12" r="2.6" {...s} />
    </svg>
  );
}

const ORANGE = "var(--color-orange-200)";
const GREEN = "var(--color-green-200)";

export function SidebarSettingDemos() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {/* С тогглами + мета + футер */}
      <SidebarPanel
        title="Верификации"
        onClose={() => {}}
        className="w-[432px]"
        footer={<Button fullWidth>Согласовать верификацию</Button>}
      >
        <SettingRow
          title="Требования для пользователей"
          icon={<EyeIcon />}
          control={<Toggle size="s" defaultChecked />}
          meta={[
            { label: "Статус", value: "Согласован" },
            { label: "Дата", value: "24.02.2020" },
          ]}
        />
        <SettingRow
          title="Для документов об образовании"
          color={ORANGE}
          control={<Toggle size="s" />}
          meta={[
            { label: "Статус", value: "Согласован" },
            { label: "Дата", value: "24.02.2020" },
            { label: "Количество компаний валидаторов", value: "12/6" },
            { label: "Общее число сотрудников", value: "7/5" },
          ]}
        />
        <SettingRow
          title="Для документов об аттестации"
          color={GREEN}
          control={<Toggle size="s" />}
          meta={[
            { label: "Статус", value: "Согласован" },
            { label: "Дата", value: "24.02.2020" },
            { label: "Количество компаний валидаторов", value: "10/6" },
            { label: "Общее число сотрудников", value: "6/5" },
          ]}
        />
        <SettingRow title="Для документов об образовании" color={ORANGE} />
      </SidebarPanel>

      {/* С чекбоксами + disabled-футер */}
      <SidebarPanel
        title="Верификации"
        onClose={() => {}}
        className="w-[432px]"
        footer={<Button fullWidth disabled>Согласовать верификации</Button>}
      >
        <SettingRow
          title="Требования для пользователей"
          icon={<EyeIcon />}
          control={<Toggle size="s" defaultChecked />}
          meta={[
            { label: "Статус", value: "Согласован" },
            { label: "Дата", value: "24.02.2020" },
          ]}
        />
        <SettingRow title="Для документов об образовании" color={ORANGE} control={<Checkbox size="xs" />} />
        <SettingRow title="Для документов об аттестации" color={GREEN} control={<Checkbox size="xs" />} />
      </SidebarPanel>
    </div>
  );
}
