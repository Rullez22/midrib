import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SectionHeader } from "./section-header";

/**
 * LauncherCard — карточка-лаунчер (авторизация / выбор организации) (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / launcher (nodes 2086:272686, 2086:272858). Стили 1:1.
 *
 * Бордерная карточка по центру: заголовок + подзаголовок (SectionHeader, center) +
 * тело (`children`: QR, дивайдеры, строки, поля) + опц. футер (кнопка во всю ширину).
 *
 * @example
 *   <LauncherCard title="Авторизация" subtitle="Считайте QR-код…"
 *     footer={<Button fullWidth disabled>Авторизоваться</Button>}>
 *     <QR /> <LabeledDivider>Или</LabeledDivider> <Input … />
 *   </LauncherCard>
 */

export interface LauncherCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function LauncherCard({ title, subtitle, footer, children, className }: LauncherCardProps) {
  return (
    <div className={cn("flex flex-col gap-6 rounded-[4px] border border-border bg-surface p-8", className)}>
      <SectionHeader title={title} subtitle={subtitle} />
      {children}
      {footer}
    </div>
  );
}
