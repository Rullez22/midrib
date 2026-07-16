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

/** Описание основания по умолчанию (Figma 398795 / 398809). */
const DEFAULT_DESC = [
  "Кооператив запрашивает персональные данные, чтобы принять заявление о вступлении, проверить личность заявителя и вести реестр пайщиков.",
  "Основание для обработки — согласие, которое пайщик даёт при заполнении формы регистрации. Кооператив собирает фамилию, имя и отчество, данные документа, удостоверяющего личность, а также контактный телефон и адрес электронной почты. Эти сведения нужны, чтобы включить пайщика в реестр, оформить его паевой взнос и направлять уведомления о заседаниях и голосованиях. Данные хранятся, пока человек остаётся пайщиком, и ещё пять лет после выхода — этот срок установлен требованиями к хранению бухгалтерских документов. Доступ к реестру есть только у администрации кооператива и председателя правления.",
  "Пайщик вправе в любой момент запросить копию своих данных, потребовать их уточнения или отозвать согласие. Отзыв согласия оформляется заявлением в личном кабинете; после него кооператив прекращает обработку данных, кроме тех сведений, которые обязан хранить по закону. Третьим лицам данные не передаются без отдельного согласия — исключение составляют запросы государственных органов, оформленные по установленной форме.",
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
  const date = loc?.date ?? "22.04.2025";
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
