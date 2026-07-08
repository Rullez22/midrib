import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * SettingRow — строка настройки с иконкой/цветом, контролом и мета (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / right sidebar — Верификации (nodes 611:61819, 469:0 …).
 * Стили 1:1.
 *
 * Бордерная карточка: бокс 32 (сплошной `color` ИЛИ `icon` на grey-20) + заголовок +
 * правый `control` (Toggle/Checkbox) + опц. мета-строки (label: value) под разделителем.
 *
 * @example
 *   <SettingRow title="Требования для пользователей" icon={<Eye/>} control={<Toggle defaultChecked/>}
 *     meta={[{ label: "Статус", value: "Согласован" }, { label: "Дата", value: "24.02.2020" }]} />
 *   <SettingRow title="Для документов об образовании" color="var(--color-orange-200)" control={<Toggle/>} />
 */

export interface SettingMeta {
  label: ReactNode;
  value: ReactNode;
}

export interface SettingRowProps {
  title: ReactNode;
  /** Сплошной цвет бокса 32 (CSS-значение). */
  color?: string;
  /** Иконка в боксе 32 (на фоне grey-20). Игнорируется, если задан `color`. */
  icon?: ReactNode;
  /** Правый контрол (Toggle/Checkbox). */
  control?: ReactNode;
  /** Мета-строки под разделителем (2 колонки). */
  meta?: SettingMeta[];
  className?: string;
}

export function SettingRow({ title, color, icon, control, meta, className }: SettingRowProps) {
  return (
    <div className={cn("overflow-hidden rounded-[4px] border border-border bg-surface", className)}>
      <div className="flex items-center gap-2 p-4">
        <span
          className="flex size-8 flex-none items-center justify-center rounded-[4px] text-foreground-muted"
          style={color ? { backgroundColor: color } : { backgroundColor: "var(--color-grey-20)" }}
        >
          {!color && icon}
        </span>
        <span className="ds-p3 flex-1 text-foreground">{title}</span>
        {control != null && <span className="flex-none">{control}</span>}
      </div>
      {meta != null && meta.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t border-border px-4 py-3">
          {meta.map((m, i) => (
            <span key={i} className="ds-caption">
              <span className="text-foreground-subtle">{m.label}: </span>
              <span className="text-foreground">{m.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
