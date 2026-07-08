"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SectionHeader } from "./section-header";
import { Tabs, Tab } from "../tabs";
import { Item } from "../item";
import { Input } from "../input";
import { Button } from "../button";
import { Checkbox } from "../checkbox";

/**
 * InviteForm — форма приглашения пайщика/партнёра (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / приглашение «big» (node 2044:222440). Стили 1:1.
 *
 * Сборка из DS: SectionHeader (заголовок) + Tabs (физ/юр лица) + Item (форма
 * регистрации) + Input + Button (QR-код/Скрипт/+/Пригласить) + Checkbox (правила).
 *
 * @example
 *   <InviteForm />
 */

export interface InviteFormProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

function IdIcon() {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="12" rx="2" {...s} />
      <circle cx="8.5" cy="11" r="1.8" {...s} />
      <path d="M5.8 15.2c.4-1.3 4-1.3 4.4 0M14 10h4M14 13.5h4" {...s} />
    </svg>
  );
}
function Plus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function InviteForm({
  title = "Управление пайщиками кооператива",
  subtitle = "Новый пайщик отразится у вас в разделе согласования совета с нужным для вступления в кооператив набором документов",
  className,
}: InviteFormProps) {
  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      <SectionHeader title={title} subtitle={subtitle} />

      <Tabs variant="solid-light" size="s" defaultValue="phys" aria-label="Тип лица">
        <Tab value="phys">Физические лица</Tab>
        <Tab value="jur">Юридические лица</Tab>
      </Tabs>

      <div className="flex w-full flex-col gap-5">
        {/* Форма регистрации */}
        <Item size="xs" tone="muted" leading={<IdIcon />}>
          <span className="ds-p3-medium text-foreground-muted">
            Форма регистрации для граждан России, Болгарии
          </span>
        </Item>
        <Button variant="secondary" size="s" icon={<Plus />} aria-label="Добавить форму" />

        {/* Поиск пайщика + действия */}
        <div className="flex items-start gap-4">
          <Input size="l" className="flex-1" placeholder="Название или адрес пайщика" />
          <Button variant="ghost" size="l">QR-код</Button>
          <Button variant="ghost" size="l">Скрипт</Button>
        </div>
        <Button variant="secondary" size="s" icon={<Plus />} aria-label="Добавить пайщика" />

        {/* Правила + Пригласить */}
        <div className="flex items-center justify-between gap-4">
          <Checkbox
            size="xxs"
            label={<span className="text-primary">Правила авторизации пользователя</span>}
          />
          <Button disabled>Пригласить</Button>
        </div>
      </div>

      <Button variant="tertiary" size="s">Свернуть</Button>
    </div>
  );
}
