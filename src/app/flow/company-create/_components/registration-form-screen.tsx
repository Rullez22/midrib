"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  SectionHeader,
  RegistrationForm,
  BasisCard,
  Button,
  Flag,
  EmptyState,
  HeaderArrowLeftIcon,
  EditPencilIcon,
} from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { useRegFlow, COUNTRIES, COUNTRY_LANG, PRIORITY_TO_COL, BASES } from "./reg-flow";

/**
 * RegistrationFormScreen — «Форма регистрации для граждан …».
 * Открывается из RegistrationSetupScreen по «Сохранить».
 * Источник: Figma 2671:398111.
 *
 * Каркас — общий CoopSidebar. Контент — DS-композит RegistrationForm
 * (Страны · Характеристики · Основания · Документы). Страны и характеристики
 * (приоритет/возраст) подхватываются из RegFlow-контекста (шаг 7): показываются
 * только отмеченные страны и только выбранные уровни верификации в заданном
 * порядке приоритета. При прямом заходе (контекст пуст) — дефолт из Figma.
 *
 * @param backHref Назад — к настройке формы регистрации.
 */

/** Родительный падеж для названий стран на -ия (Россия → России). */
const genitive = (label: string) => label.replace(/ия$/, "ии");

export function RegistrationFormScreen({
  backHref,
  editorHref,
  docsHref,
  publishHref,
  routes,
  sidebar,
  singleBasis = false,
}: {
  backHref?: string;
  editorHref?: string;
  docsHref?: string;
  publishHref?: string;
  routes?: Partial<CoopRoutes>;
  /** Своя обвязка (напр. CompanySidebar ВУЗа). По умолчанию — CoopSidebar. */
  sidebar?: ReactNode;
  /** Показать только одно основание в колонке «Основания» (флоу «Внести дополнения»). */
  singleBasis?: boolean;
}) {
  const router = useRouter();
  const flow = useRegFlow();
  // Выбранная страна сохраняется в контексте — чтобы после редактора форма
  // оставалась на той же стране (а не сбрасывалась на первую).
  const [activeCode, setActiveCode] = useState<string | undefined>(flow.activeCountry);
  const selectCountry = (code: string) => {
    setActiveCode(code);
    flow.setActiveCountry(code);
  };

  // Подхват с шага 7: отмеченные страны + выбранные колонки (уровни).
  const selectedCountries = COUNTRIES.filter((_, i) => flow.checks[i]?.some(Boolean));
  const hasData = selectedCountries.length > 0;

  const checkedCols = new Set<number>();
  flow.checks.forEach((row) =>
    row.forEach((v, c) => {
      if (v) checkedCols.add(c);
    }),
  );

  // Дефолт из Figma при прямом заходе (контекст пуст).
  const countries = hasData
    ? selectedCountries
    : [
        { code: "ru", label: "Россия" },
        { code: "bg", label: "Болгария" },
      ];

  // Основания задаются для ПЕРВОЙ страны; остальные наследуют. Пока у первой
  // страны нет ни одного основания — у прочих стран колонка пуста.
  const firstCode = countries[0]?.code;
  const currentCode = activeCode ?? firstCode;
  const isFirstCountry = currentCode === firstCode;

  const orderItems = hasData
    ? flow.priority.filter((label) => checkedCols.has(PRIORITY_TO_COL[label]))
    : ["Желтая международная", "Зеленая международная", "Желтая локальная", "Зеленая локальная"];

  const characteristics = [
    { heading: "Запрос данных по очередности:", items: orderItems },
    { heading: "Возрастные ограничения:", items: [flow.age || "Без ограничений"] },
  ];

  const title = `Форма регистрации для граждан ${countries
    .map((c) => genitive(String(c.label)))
    .join(", ")}`;

  // Основания хранятся ПО СТРАНАМ. Набор основ задаёт ПЕРВАЯ страна; остальные
  // наследуют этот набор, но заполняют свои локализации.
  const firstBases = flow.bases[firstCode] ?? {};
  const firstBasisTitles = Object.keys(firstBases);
  const firstHasAny = firstBasisTitles.length > 0;
  const hasCreated = firstHasAny;

  // Открыть редактор для основания текущей страны.
  const openEditor = (basisTitle: string, loc?: number) => {
    flow.setActiveCountry(currentCode);
    flow.setActiveBasis(basisTitle);
    flow.setActiveLoc(loc);
    if (editorHref != null) router.push(editorHref);
  };

  // Заполненная карточка основания (список локализаций конкретной страны).
  const filledCard = (basisTitle: string, locs: typeof firstBases[string]) => (
    <BasisCard
      key={basisTitle}
      title={basisTitle}
      state="filled"
      active
      tooltip={BASES.find((x) => x.title === basisTitle)?.tip}
    >
      <div className="flex flex-col gap-3">
        {locs.map((loc, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openEditor(basisTitle, i)}
            className="ds-row flex items-center justify-between gap-2 rounded-[4px] border border-border bg-white px-3 py-2 text-left transition-colors"
          >
            <span className="ds-p3 inline-flex items-center gap-2 text-foreground">
              <Flag code={loc.language} width={18} />
              {COUNTRY_LANG[loc.language] ?? loc.language}
              {loc.isDefault ? " (по умолчанию)" : ""}
            </span>
            <span className="shrink-0 text-[var(--color-blue-midhub-500)]">
              <EditIcon />
            </span>
          </button>
        ))}
        <Button variant="secondary" size="m" fullWidth onClick={() => openEditor(basisTitle)}>
          Добавить локализацию
        </Button>
      </div>
    </BasisCard>
  );

  const currentBases = flow.bases[currentCode] ?? {};

  // Флоу «Внести дополнения» — в колонке доступно только одно основание.
  const basisOptions = singleBasis ? BASES.slice(0, 1) : BASES;

  let columnBases: React.ReactNode[] | undefined;
  if (isFirstCountry) {
    // Первая страна — все основания: созданное = заполнено, прочие «Создать»
    // (заблокированы, если основание уже выбрано).
    columnBases = basisOptions.map((b) => {
      const locs = currentBases[b.title];
      if (locs && locs.length > 0) return filledCard(b.title, locs);
      return (
        <BasisCard
          key={b.title}
          title={b.title}
          tooltip={b.tip}
          createDisabled={firstHasAny}
          onCreate={() => openEditor(b.title)}
        />
      );
    });
  } else if (firstHasAny) {
    // Прочие страны — наследуют набор первой; своя локализация или «Создать».
    columnBases = firstBasisTitles.map((t) => {
      const locs = currentBases[t];
      if (locs && locs.length > 0) return filledCard(t, locs);
      const b = BASES.find((x) => x.title === t);
      return (
        <BasisCard key={t} title={t} tooltip={b?.tip} active onCreate={() => openEditor(t)} />
      );
    });
  }
  const hasBasesColumn = columnBases != null && columnBases.length > 0;

  // Документы текущей страны (выбранные на экране «Выберите тип настроек»):
  // имя документа — часть ключа после «/», без дублей.
  const currentDocNames = [
    ...new Set((flow.docSelection?.docs[currentCode] ?? []).map((k) => k.split("/").pop() as string)),
  ];
  const currentDocuments =
    currentDocNames.length > 0
      ? currentDocNames.map((name) => ({ title: `${name}:`, sub: "Фамилия, Имя" }))
      : undefined;
  const goDocs = docsHref != null ? () => router.push(docsHref) : undefined;

  // Форма готова: в каждой стране есть ≥1 основание и выбраны документы.
  const formComplete =
    countries.length > 0 &&
    countries.every((c) => Object.keys(flow.bases[c.code] ?? {}).length > 0) &&
    countries.every((c) => (flow.docSelection?.docs[c.code]?.length ?? 0) > 0);

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar ?? <CoopSidebar routes={routes} />}

      {/* Контент */}
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: кнопка «назад» слева, заголовок по центру */}
          <div className="relative flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              size="m"
              icon={<HeaderArrowLeftIcon />}
              aria-label="Назад"
              className="absolute left-0 top-0"
              onClick={() => (backHref != null ? router.push(backHref) : router.back())}
            />
            <SectionHeader
              title={title}
              subtitle={
                formComplete
                  ? "Локализация добавлена. Можно сохранить и опубликовать форму"
                  : hasCreated
                    ? "Необходимо выбрать запрашиваемые данные и документы пользователя"
                    : "Выберите основания для сбора данных пользователей"
              }
            />
          </div>

          <RegistrationForm
            countries={countries}
            selectedCountry={currentCode}
            onSelectCountry={selectCountry}
            characteristics={characteristics}
            activeColumn={hasBasesColumn ? 2 : -1}
            bases={columnBases}
            documents={currentDocuments}
            onAddDocument={goDocs}
            onEditDocument={goDocs}
            documentsPrompt={
              hasCreated ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <EmptyState title="Для выбора данных пользователя и его документов, вам необходимо нажать кнопку:" />
                  <Button size="s" iconLeft={<PlusIcon />} onClick={goDocs}>
                    Добавить документы
                  </Button>
                </div>
              ) : undefined
            }
          />

          {/* Готовая форма (основания + документы во всех странах) → публикация */}
          {formComplete && (
            <div className="flex justify-end pt-2">
              <Button size="l" onClick={publishHref != null ? () => router.push(publishHref) : undefined}>
                Сохранить форму регистрации
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/** Иконка редактирования локализации — Figma «Icons / Edit-16» (залитый карандаш, blue). */
function EditIcon() {
  return <EditPencilIcon className="size-4" />;
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
