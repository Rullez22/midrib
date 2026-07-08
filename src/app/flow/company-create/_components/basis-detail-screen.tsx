"use client";

import { useRouter } from "next/navigation";
import { SectionHeader, Button, Flag, HeaderArrowLeftIcon } from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { useRegFlow, COUNTRY_LANG } from "./reg-flow";

/**
 * BasisDetailScreen — «Основание для сбора данных пользователей». Открывается из
 * PublishedFormScreen по клику на локализацию в колонке «Основания».
 * Источник: Figma 2671:398795 / 398809.
 *
 * Каркас — общий CoopSidebar. Контент: SectionHeader (заголовок по центру) +
 * строка «флаг + язык (+ по умолчанию) + дата» + текст основания (абзацы).
 * Данные — выбранная локализация из RegFlow (activeCountry/activeBasis/activeLoc);
 * при прямом заходе — дефолт из Figma.
 *
 * @param backHref Назад — к опубликованной форме.
 */

/** Лорем-описание по умолчанию (Figma 398795 / 398809). */
const DEFAULT_DESC = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas amet ultrices faucibus non.",
  "Sit aliquet vestibulum, cras massa quam consequat, augue. Cursus orci donec bibendum nisl a, cursus. Imperdiet rhoncus lacus amet, non viverra nam velit velit. Volutpat non volutpat integer nulla egestas. Non egestas adipiscing quis fringilla tincidunt. Porttitor varius interdum ac id sollicitudin sed eleifend in arcu. Semper enim donec mi nunc a nunc id pulvinar. Elementum malesuada etiam pretium aliquet mi ac. Elit, massa blandit est maecenasnunc blandit tincidunt. Aenean porta bibendum ultrices consequat. Nisl cursus blandit lectus vel consequat odio tempor faucibus massa.",
  "Nibh volutpat, suscipit ac ut orci, magna magna viverra eros. Aliquam vitae vel nulla id adipiscing nibh. Augue varius id viverra tempus viverra. At odio et sit accumsan adipiscing nunc eu. Massa sed tempus, sit cras nullam tincidunt aenean tortor, phasellus. Mi urna, nibh blandit tortor commodo nunc, morbi.",
];

export function BasisDetailScreen({ backHref, routes }: { backHref?: string; routes?: Partial<CoopRoutes> }) {
  const router = useRouter();
  const flow = useRegFlow();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());

  const country = flow.activeCountry ?? "ru";
  const basis = flow.activeBasis;
  const loc =
    basis != null && flow.activeLoc != null ? flow.bases[country]?.[basis]?.[flow.activeLoc] : undefined;

  const language = loc?.language ?? country;
  const name = `${COUNTRY_LANG[language] ?? language}${loc?.isDefault ?? true ? " - по умолчанию" : ""}`;
  const date = loc?.date ?? "01.06.2020";
  const paragraphs = loc?.description ? loc.description.split("\n").filter(Boolean) : DEFAULT_DESC;

  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar routes={routes} />

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
            <SectionHeader className="absolute left-1/2 -translate-x-1/2" title="Основание для сбора данных пользователей" />
          </div>

          {/* Заголовок локализации: флаг в серой плашке + язык + дата */}
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-[var(--color-grey-20)]">
              <Flag code={language} width={24} />
            </div>
            <div className="flex flex-col">
              <span className="ds-p2-medium text-foreground">{name}</span>
              <span className="ds-caption text-foreground-subtle">{date}</span>
            </div>
          </div>

          {/* Текст основания */}
          <div className="flex flex-col gap-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="ds-p3 text-foreground-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
