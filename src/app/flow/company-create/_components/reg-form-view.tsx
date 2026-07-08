"use client";

import { useState } from "react";
import { RegistrationForm, BasisCard, Flag, type RegDocument } from "@/components/ds";
import { useRegFlow, COUNTRIES, COUNTRY_LANG, PRIORITY_TO_COL, BASES } from "./reg-flow";

/**
 * RegFormView — read-only 4-колоночная форма регистрации (Страны · Характеристики
 * · Основания · Документы) поверх `RegistrationForm mode="view"`. Общая для
 * опубликованной формы (PublishedFormScreen) и детали ПС (PpDetailScreen).
 *
 * Данные — из RegFlow (шаги 7/9/10), при прямом заходе — дефолт из Figma.
 * Страна переключается локально; клик по локализации основания → `onBasisClick`.
 */

/** Лорем-описание основания по умолчанию (если в RegFlow нет своего). */
const DEFAULT_DESC = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas amet ultrices faucibus non.";

/** Документы стран по умолчанию (Figma 398342 / 398404). */
const DEFAULT_DOCS: Record<string, string[]> = {
  ru: ["Паспорт", "Заграничный паспорт"],
  bg: ["СНИЛС", "ИНН"],
};

/** Родительный падеж для названий стран на -ия (Россия → России). */
const genitive = (label: string) => label.replace(/ия$/, "ии");

/** Шестерёнка настроек — залитая (Figma «Icons / Setting-24»). */
export function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85a1.9 1.9 0 0 1 .7-2.59l1.73-.99c.78-.46 1.78-.18 2.24.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.46-.78 1.46-1.06 2.24-.6l1.73.99c.91.52 1.22 1.68.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.78.46-1.78.18-2.24-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.46.78-1.46 1.06-2.24.6l-1.73-.99a1.9 1.9 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      />
    </svg>
  );
}

/** Страны формы из RegFlow (иначе дефолт Россия/Болгария). */
export function useRegFormCountries() {
  const flow = useRegFlow();
  const selected = COUNTRIES.filter((_, i) => flow.checks[i]?.some(Boolean));
  return selected.length > 0 ? selected : [{ code: "ru", label: "Россия" }, { code: "bg", label: "Болгария" }];
}

/** Заголовок формы: «Форма регистрации для граждан <страны в род. падеже>». */
export function useRegFormTitle() {
  const countries = useRegFormCountries();
  return `Форма регистрации для граждан ${countries.map((c) => genitive(String(c.label))).join(", ")}`;
}

export function RegFormView({ onBasisClick }: { onBasisClick?: (basis: string, loc: number) => void }) {
  const flow = useRegFlow();
  const countries = useRegFormCountries();
  const [activeCode, setActiveCode] = useState<string | undefined>(countries[0]?.code);
  const currentCode = activeCode ?? countries[0]?.code;

  const checkedCols = new Set<number>();
  flow.checks.forEach((row) => row.forEach((v, c) => v && checkedCols.add(c)));
  const hasData = COUNTRIES.some((_, i) => flow.checks[i]?.some(Boolean));
  const orderItems = hasData
    ? flow.priority.filter((label) => checkedCols.has(PRIORITY_TO_COL[label]))
    : ["Желтая международная", "Зеленая международная", "Желтая локальная", "Зеленая локальная"];
  const characteristics = [
    { heading: "Запрос данных по очередности:", items: orderItems },
    { heading: "Возрастные ограничения:", items: [flow.age || "Без ограничений"] },
  ];

  // Основания: набор задаёт первая страна (иначе «Согласие»); локализации — у
  // текущей страны (иначе дефолт: язык страны, по умолчанию, лорем).
  const firstCode = countries[0]?.code;
  const firstTitles = Object.keys(flow.bases[firstCode ?? ""] ?? {});
  const basisTitles = firstTitles.length > 0 ? firstTitles : ["Согласие"];
  const defaultLoc = { language: currentCode ?? "ru", description: DEFAULT_DESC, isDefault: true, date: "01.06.2020" };

  const columnBases = basisTitles.map((basisTitle) => {
    const locs = flow.bases[currentCode ?? ""]?.[basisTitle] ?? [defaultLoc];
    return (
      <BasisCard
        key={basisTitle}
        title={basisTitle}
        state="filled"
        tooltip={BASES.find((x) => x.title === basisTitle)?.tip}
      >
        <div className="flex flex-col gap-3">
          {locs.map((loc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                flow.setActiveCountry(currentCode);
                flow.setActiveBasis(basisTitle);
                flow.setActiveLoc(i);
                onBasisClick?.(basisTitle, i);
              }}
              className="flex items-center justify-between gap-2 rounded-[4px] border border-border bg-white px-3 py-2 text-left transition-colors hover:bg-[var(--color-grey-10)]"
            >
              <span className="ds-p3 inline-flex items-center gap-2 text-foreground">
                <Flag code={loc.language} width={18} />
                {COUNTRY_LANG[loc.language] ?? loc.language}
                {loc.isDefault ? " (по умолчанию)" : ""}
              </span>
            </button>
          ))}
        </div>
      </BasisCard>
    );
  });

  // Документы текущей страны: из выбора (шаг 10), иначе дефолт из Figma.
  const flowDocNames = [
    ...new Set((flow.docSelection?.docs[currentCode ?? ""] ?? []).map((k) => k.split("/").pop() as string)),
  ];
  const docNames = flowDocNames.length > 0 ? flowDocNames : DEFAULT_DOCS[currentCode ?? ""] ?? [];
  const documents: RegDocument[] = docNames.map((name) => ({ title: `${name}:`, sub: "Фамилия, Имя" }));

  return (
    <RegistrationForm
      mode="view"
      countries={countries}
      selectedCountry={currentCode}
      onSelectCountry={setActiveCode}
      characteristics={characteristics}
      activeColumn={-1}
      bases={columnBases}
      documents={documents}
    />
  );
}
