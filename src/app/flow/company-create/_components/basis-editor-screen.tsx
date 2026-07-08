"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  SectionHeader,
  BasisEditor,
  Button,
  Flag,
  Text,
  HeaderArrowLeftIcon,
  type ComboboxOption,
} from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { useRegFlow, COUNTRIES, COUNTRY_LANG } from "./reg-flow";

/**
 * BasisEditorScreen — «Опишите основание…».
 * Открывается из RegistrationFormScreen по кнопке «Создать»/карандашу основания.
 * Источник: Figma 2671:398664 (ввод) и 2671:398621 (сохранённый вид).
 *
 * Два режима:
 *  - edit  : DS BasisEditor (ввод). «Сохранить описание» → сохраняет в RegFlow
 *            и переключает в saved.
 *  - saved : карточка сохранённого описания (флаг + язык + дата + текст) с
 *            кнопками Удалить / Редактировать / Продолжить.
 *
 * @param backHref Назад / Отменить / Продолжить — к форме регистрации.
 */

const FALLBACK = [
  { code: "ru", label: "Россия" },
  { code: "bg", label: "Болгария" },
];

function formatDate(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function BasisEditorScreen({
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

  const countryCode = flow.activeCountry ?? "ru";
  const basisTitle = flow.activeBasis ?? "Согласие";
  const locs = flow.bases[countryCode]?.[basisTitle] ?? [];
  // activeLoc=index → редактируем существующую локализацию; undefined → новая.
  const existing = flow.activeLoc != null ? locs[flow.activeLoc] : undefined;

  // Языки = выбранные на шаге 7 страны (флаг + язык). Пусто → дефолт из Figma.
  const selected = COUNTRIES.filter((_, i) => flow.checks[i]?.some(Boolean));
  const langCountries = selected.length > 0 ? selected : FALLBACK;
  const languages: ComboboxOption[] = langCountries.map((c) => ({
    value: c.code,
    label: <Flag code={c.code} label={COUNTRY_LANG[c.code] ?? String(c.label)} width={24} />,
  }));

  // Существующая локализация → saved-вид (текст + 3 кнопки); новая → ввод.
  const [editIndex, setEditIndex] = useState<number | undefined>(flow.activeLoc);
  const [mode, setMode] = useState<"edit" | "saved">(existing ? "saved" : "edit");
  // По умолчанию — язык страны, для которой создаётся основание.
  const [language, setLanguage] = useState(
    existing?.language ?? countryCode ?? langCountries[0]?.code,
  );
  const [description, setDescription] = useState(existing?.description ?? "");
  // Первая локализация — по умолчанию; последующие — нет.
  const [isDefault, setIsDefault] = useState(existing?.isDefault ?? locs.length === 0);
  const [savedDate, setSavedDate] = useState(existing?.date ?? "");

  const goBack = () => (backHref != null ? router.push(backHref) : router.back());

  const save = () => {
    const date = formatDate(new Date());
    const loc = { language: language ?? langCountries[0]?.code, description, isDefault, date };
    if (editIndex != null) {
      flow.updateLocalization(countryCode, basisTitle, editIndex, loc);
    } else {
      flow.addLocalization(countryCode, basisTitle, loc);
      setEditIndex(locs.length); // новая локализация — в конце списка
    }
    setSavedDate(date);
    setMode("saved");
  };

  const remove = () => {
    if (editIndex != null) flow.removeLocalization(countryCode, basisTitle, editIndex);
    goBack();
  };

  const langLabel = COUNTRY_LANG[language ?? ""] ?? language ?? "";

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
              title={
                mode === "saved"
                  ? "Основание для сбора данных пользователей"
                  : "Опишите основание для сбора данных пользователей"
              }
            />
          </div>

          {mode === "edit" ? (
            <BasisEditor
              languages={languages}
              languageValue={language}
              onLanguageChange={setLanguage}
              description={description}
              onDescriptionChange={setDescription}
              isDefault={isDefault}
              onDefaultChange={setIsDefault}
              saveDisabled={description.trim().length === 0}
              onCancel={goBack}
              onSave={save}
            />
          ) : (
            <div className="flex w-full flex-col gap-6">
              {/* Заголовок сохранённого описания: флаг в серой плашке + язык + дата */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-[var(--color-grey-20)]">
                  <Flag code={language} width={24} />
                </div>
                <div className="flex flex-col">
                  <Text variant="p2-medium">
                    {langLabel}
                    {isDefault ? " - по умолчанию" : ""}
                  </Text>
                  <Text variant="caption" tone="subtle">{savedDate}</Text>
                </div>
              </div>

              {/* Текст описания */}
              <Text variant="p3" tone="muted" className="whitespace-pre-wrap">
                {description}
              </Text>

              {/* Действия */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="negative-sec" size="l" onClick={remove}>
                  Удалить
                </Button>
                <Button variant="secondary" size="l" onClick={() => setMode("edit")}>
                  Редактировать
                </Button>
                <Button size="l" onClick={goBack}>
                  Продолжить
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
