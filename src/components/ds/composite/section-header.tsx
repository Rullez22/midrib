import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Text } from "../text";

/**
 * SectionHeader — заголовок раздела с подзаголовком и CTA (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Управление пайщиками (nodes 111:205, 766:75462,
 * 2044:222440 — шапка). Стили 1:1.
 *
 * Заголовок (H5) + подзаголовок (P2, dark-800) + опциональное действие (обычно
 * `<Button variant="tertiary">`). По центру (по умолчанию) или слева.
 *
 * @example
 *   <SectionHeader
 *     title="Управление пайщиками кооператива"
 *     subtitle="Новый пайщик отразится у вас в разделе согласования совета…"
 *     action={<Button variant="tertiary">Пригласить нового пайщика</Button>}
 *   />
 */

export interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Действие под текстом (кнопка/ссылка). */
  action?: ReactNode;
  /** Выравнивание. По умолчанию "center". */
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <Text variant="h5">{title}</Text>
        {subtitle != null && (
          <Text variant="p2" tone="muted">
            {subtitle}
          </Text>
        )}
      </div>
      {action}
    </div>
  );
}
