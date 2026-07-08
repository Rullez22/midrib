"use client";

import { Button, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { BankIcon } from "@/components/app/app-icons";
import {
  DIPLOMA_ROWS,
  DIPLOMA_APPENDIX_ROWS,
} from "@/components/app/diploma-data";

/**
 * Карточка подтверждённого диплома в «Мои документы» (Figma 7009:576812).
 * Скроллящийся список: таблица диплома + таблица приложения. «Обновить».
 */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 border-t border-border px-3 py-2.5">
      <Text variant="caption" tone="subtle" className="w-[120px] shrink-0">
        {label}
      </Text>
      <Text variant="caption-medium" className="flex-1">
        {value}
      </Text>
    </div>
  );
}

/** Заглушка изображения документа. */
function DocImage() {
  return (
    <div className="flex gap-3 border-t border-border px-3 py-2.5">
      <Text variant="caption" tone="subtle" className="w-[120px] shrink-0">
        Документ
      </Text>
      <div className="h-16 w-[88px] rounded-[2px] bg-surface-muted" />
    </div>
  );
}

export default function DiplomaCardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader
        title="Диплом"
        showBack
        actions={
          <span className="text-foreground-subtle" aria-hidden>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M12 11v5M12 8h.01"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto p-4">
        {/* Диплом */}
        <div className="overflow-hidden rounded-[2px] border border-border">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Text variant="caption" tone="subtle" className="w-[120px] shrink-0">
              Тип верификации
            </Text>
            <Text variant="caption-medium" className="flex-1">
              Выдан ВУЗом
            </Text>
            <span className="text-[var(--color-green-500)]">
              <BankIcon width={20} height={20} />
            </span>
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 border-t border-border px-3 py-3 text-primary"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
            <Text variant="caption-medium" className="text-primary">
              Получить доп. верификацию
            </Text>
          </button>
          {DIPLOMA_ROWS.map(([label, value]) => (
            <Row key={label} label={label} value={value} />
          ))}
          <DocImage />
        </div>

        {/* Приложение к диплому */}
        <div className="mt-4 overflow-hidden rounded-[2px] border border-border">
          {DIPLOMA_APPENDIX_ROWS.map(([label, value], i) => (
            <div
              key={label}
              className={`flex gap-3 px-3 py-2.5 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <Text variant="caption" tone="subtle" className="w-[120px] shrink-0">
                {label}
              </Text>
              <Text variant="caption-medium" className="flex-1">
                {value}
              </Text>
            </div>
          ))}
          <DocImage />
        </div>
      </main>

      <div className="px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
        >
          Обновить
        </Button>
      </div>
    </div>
  );
}
