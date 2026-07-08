"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  SectionHeader,
  DocumentSettings,
  Button,
  HeaderArrowLeftIcon,
  type DocSettingsCountry,
  type DocSettingsCategory,
  type DocSettingsBasis,
  type DocumentSettingsState,
  type BadgeColor,
} from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { useRegFlow, COUNTRIES } from "./reg-flow";

/**
 * DocumentsScreen — «Выберите тип настроек» (выбор запрашиваемых данных и
 * документов). Открывается из RegistrationFormScreen по «Добавить документы».
 * Источник: Figma «UI фичи» 288:643 / ПП 2671:398509…398500.
 *
 * Каркас — общий CoopSidebar; контент — DS-композит DocumentSettings.
 * «Сохранить» активна, когда выбрана идентификация и ≥1 документ в каждой стране.
 *
 * @param backHref Назад / Отменить — к форме регистрации.
 */

const IDENTITY = [
  "Имя",
  "Фамилия",
  "Отчество",
  "Пол",
  "E-mail",
  "Телефон",
  "Дата рождения",
  "Место рождения",
  "Что-то еще",
];

const PRICE = { intl: 0.5, local: 0.3 };
const CATEGORIES: DocSettingsCategory[] = [
  {
    name: "Все документы",
    docs: ["Паспорт", "Заграничный паспорт", "СНИЛС", "ИНН"].map((name) => ({ name, ...PRICE })),
  },
  {
    name: "Удостоверяющие личность",
    docs: ["Паспорт", "Водительское удостоверение"].map((name) => ({ name, ...PRICE })),
  },
  {
    name: "Образование",
    docs: ["Диплом", "Аттестат"].map((name) => ({ name, ...PRICE })),
  },
];

const FALLBACK = [
  { code: "ru", label: "Россия" },
  { code: "bg", label: "Болгария" },
];

export function DocumentsScreen({
  backHref,
  routes,
  sidebar,
}: {
  backHref?: string;
  routes?: Partial<CoopRoutes>;
  /** Своя обвязка (напр. CompanySidebar ВУЗа). По умолчанию — CoopSidebar. */
  sidebar?: ReactNode;
}) {
  const router = useRouter();
  const flow = useRegFlow();
  const [state, setState] = useState<DocumentSettingsState>();
  const complete = state?.complete ?? false;

  const goBack = () => (backHref != null ? router.push(backHref) : router.back());

  // Сохранить: кладём полный выбор (идентификация + ключи документов по странам)
  // в RegFlow — для отображения в форме и восстановления при повторном открытии.
  const save = () => {
    if (!state) return;
    flow.setDocSelection({
      type: state.type,
      identity: state.identity,
      docs: state.documents,
      altDocs: state.altDocs,
    });
    goBack();
  };

  const selected = COUNTRIES.filter((_, i) => flow.checks[i]?.some(Boolean));
  const base = selected.length > 0 ? selected : FALLBACK;
  const countries: DocSettingsCountry[] = base.map((c) => ({
    code: c.code,
    label: c.label,
    categories: CATEGORIES,
  }));

  // Основания (плашки персонального режима) = созданные на форме, разными
  // цветами DS. Берём набор первой страны (он общий для формы).
  const PALETTE: BadgeColor[] = ["purple", "green", "orange", "cyan", "yellow", "red"];
  const firstCode = base[0]?.code;
  const bases: DocSettingsBasis[] = Object.keys(flow.bases[firstCode ?? ""] ?? {}).map((title, i) => ({
    title,
    color: PALETTE[i % PALETTE.length],
  }));

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar ?? <CoopSidebar routes={routes} />}

      {/* Контент */}
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: кнопка «назад» слева, заголовок по центру */}
          <div className="relative flex min-h-[40px] items-center">
            <Button
              variant="ghost"
              size="m"
              icon={<HeaderArrowLeftIcon />}
              aria-label="Назад"
              onClick={goBack}
            />
            <SectionHeader
              className="absolute left-1/2 -translate-x-1/2"
              title="Выберите тип настроек"
            />
          </div>

          <DocumentSettings
            identityFields={IDENTITY}
            countries={countries}
            bases={bases}
            initialType={flow.docSelection?.type}
            initialIdentity={flow.docSelection?.identity}
            initialDocs={flow.docSelection?.docs}
            initialAltDocs={flow.docSelection?.altDocs}
            onChange={setState}
          />

          {/* Футер: Отменить / Сохранить */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="negative-sec" size="l" onClick={goBack}>
              Отменить
            </Button>
            <Button size="l" disabled={!complete} onClick={save}>
              Сохранить
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
