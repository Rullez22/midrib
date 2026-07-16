"use client";

import { useRouter } from "next/navigation";
import { Button, ProfileInfoCard } from "@/components/ds";
import { AdminSidebar } from "./admin-sidebar";

/**
 * AdminCoopReadyScreen — «ready» автономного кооператива (Figma 6442:342984).
 * Открывается из Реферальной по «Подробнее» (Ожидают допуска). Read-only профиль
 * (Основатель / Направление / Устав) + «Продолжить работу» → назад в Реферальную.
 * Reuse DS: ProfileInfoCard · Button.
 */

const OKVED = (
  <span className="flex flex-col gap-2">
    <span>68.20 - Аренда и управление собственным или арендованным недвижимым имуществом;</span>
    <span>47.99 - Торговля розничная прочая вне магазинов, палаток, рынков;</span>
    <span>96.09 - Предоставление прочих персональных услуг, не включённых в другие группировки</span>
  </span>
);

function DocThumb() {
  return (
    <span className="flex h-16 w-[52px] flex-col gap-1 rounded-[3px] border border-border bg-surface p-1.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="h-[2px] rounded bg-[var(--color-grey-90)]" style={{ width: `${90 - i * 6}%` }} />
      ))}
    </span>
  );
}

export function AdminCoopReadyScreen() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar current="referral" />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col">
          {/* Шапка модуля */}
          <div className="flex flex-wrap items-start gap-6 border-b border-border px-6 py-6">
            <div className="flex w-[146px] shrink-0 flex-col overflow-hidden rounded-[4px] border border-border">
              <div className="flex h-[110px] items-center justify-center bg-surface-muted px-3 text-center">
                <span className="ds-caption text-foreground-subtle">Логотип загружает приглашенная компания</span>
              </div>
              <button type="button" className="flex items-center justify-center gap-1.5 border-t border-border py-2 text-primary">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M2 8h12M8 2c2 2.2 2 9.8 0 12M8 2c-2 2.2-2 9.8 0 12" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <span className="ds-caption-medium">Домен</span>
              </button>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="ds-p2-medium text-foreground">Имматра</span>
              <p className="ds-p3 text-foreground-muted">Описание <span className="text-foreground-subtle">[Заполняет приглашенная компания]</span></p>
            </div>
          </div>

          <ProfileInfoCard
            title="Подробная информация"
            groups={[
              {
                heading: "Основатель",
                rows: [
                  { label: "Адрес", value: "0xca30e63200a0fe3182dc61fc5605efc41456f32" },
                  { label: "Фамилия", value: "Антонов" },
                  { label: "Имя", value: "Илья" },
                  { label: "Отчество", value: "Васильевич" },
                  { label: "Номер паспорта", value: "45 67 345678" },
                  { label: "Кем выдан", value: "ТП № 19 Калининского района, г. Санкт-Петербург" },
                  { label: "Дата выдачи", value: "25.12.2005" },
                ],
              },
              { heading: "Направление", rows: [{ label: "Название", value: "Идеологическое направление" }] },
              {
                heading: "Устав",
                rows: [
                  { label: "Тип организации", value: "Потребительский кооператив" },
                  { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
                  { label: "ОКВЭД", value: OKVED },
                  { label: "Уставные документы", value: <DocThumb /> },
                ],
              },
            ]}
          />

          <div className="flex flex-wrap gap-4 px-6 py-8">
            {/* Продолжить — кооператив остаётся в «Ожидают допуска». */}
            <Button variant="secondary" onClick={() => router.push("/cabinet/admin?pending=coop")}>Продолжить работу</Button>
            {/* Отклонить — удаляет компанию (Реферальная без кооператива). */}
            <Button variant="negative-sec" onClick={() => router.push("/cabinet/admin")}>Отклонить компанию</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
