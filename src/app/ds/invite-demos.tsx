"use client";

/**
 * Демки «Приглашение партнёра и пайщика» для витрины /ds.
 * Источник: Figma «UI фичи» — Управление пайщиками (111:205, 418:5, 414:1, …).
 * Переиспользованы DS: SectionHeader, WalletField, MemberCard, Button, Input.
 */
import { useState } from "react";
import {
  SectionHeader,
  WalletField,
  MemberCard,
  Button,
  type MemberRow,
} from "@/components/ds";

const PASSPORT: MemberRow[] = [
  { label: "Адрес", value: "0xca30e63200a0fe3182dc61fc5605efc41456f32" },
  { label: "Фамилия", value: "Антонов" },
  { label: "Имя", value: "Илья" },
  { label: "Отчество", value: "Андреевич" },
  { label: "Номер паспорта", value: "40 12 574903" },
  { label: "Кем выдан", value: "ТП № 19 Калининского района, г. Санкт-Петербург" },
  { label: "Дата выдачи", value: "14.03.2012" },
];

const TITLE = "Пайщик №1 (Вы-председатель правления)";

function RefreshClear() {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <span className="flex items-center gap-2 text-foreground-subtle">
      <button type="button" aria-label="Обновить" className="flex size-5 items-center justify-center text-primary">
        <svg viewBox="0 0 24 24" className="size-5"><path d="M20 11a8 8 0 1 0-1 5m1 4v-5h-5" {...s} /></svg>
      </button>
      <button type="button" aria-label="Очистить" className="flex size-5 items-center justify-center">
        <svg viewBox="0 0 24 24" className="size-5"><path d="M7 7l10 10M17 7 7 17" {...s} /></svg>
      </button>
    </span>
  );
}

export function InviteDemos() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex max-w-[1120px] flex-col gap-8">
      {/* SectionHeader */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">SectionHeader (заголовок + CTA)</span>
        <SectionHeader
          title="Управление пайщиками кооператива"
          subtitle="Новый пайщик отразится у вас в разделе согласования совета с нужным для вступления в кооператив набором документов"
          action={<Button variant="tertiary">Пригласить нового пайщика</Button>}
        />
      </div>

      {/* WalletField */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">WalletField (пусто / заполнено / с действиями)</span>
        <WalletField title="Пайщик №2" />
        <WalletField title="Пайщик №2" defaultValue="0xca30e63200a0fe3182dc61fc5605efc4" />
        <WalletField title="Пайщик №2" defaultValue="0xca30e63200a0fe3182dc61fc5605efc4" rightIcon={<RefreshClear />} />
      </div>

      {/* MemberCard */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">MemberCard (раскрытие / статусы)</span>
        <MemberCard title="Антонов Илья · 0xca30…41456f32" rows={PASSPORT} open={open} onOpenChange={setOpen} />
        <MemberCard title={TITLE} defaultOpen rows={PASSPORT} onCancel={() => {}} />
        <MemberCard title={TITLE} defaultOpen rows={PASSPORT} status="loading" statusText="Ожидаем предоставления персональных данных" onCancel={() => {}} />
        <MemberCard title={TITLE} defaultOpen rows={PASSPORT} status="success" statusText="Токен принят" onCancel={() => {}} />
      </div>
    </div>
  );
}
