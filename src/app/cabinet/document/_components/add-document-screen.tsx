"use client";

import { useRouter } from "next/navigation";
import { Button, HeaderArrowLeftIcon } from "@/components/ds";
import { DocHeader } from "./document-shared";

/**
 * AddDocumentScreen — «Добавление нового документа». Открывается из тулбара таба
 * «Документооборот» (кнопка «Добавить документ»). Источник: Figma 6419:313771.
 *
 * Без рейки, с верхней шапкой (`DocHeader`) и боковыми отступами. Три способа
 * добавления документа — карточки выбора. «Шаблоны компании» → флоу создания
 * документа по шаблону (/cabinet/document/create).
 *
 * Reuse: DocHeader (document-shared) · DS Button.
 */

const OPTIONS: { icon: string; title: string; desc: string; href?: string }[] = [
  {
    icon: "/illustrations/doc-templates-company.svg",
    title: "Шаблоны компании",
    desc: "Добавление нового документа на основе созданных шаблонов вашим доменом.",
    href: "/cabinet/document/create",
  },
  {
    icon: "/illustrations/doc-templates-external.svg",
    title: "Сторонние шаблоны",
    desc: "Добавление нового документа на основе созданных шаблонов другими доменами.",
    href: "/cabinet/document/external",
  },
  {
    icon: "/illustrations/doc-templates-external.svg",
    title: "Создать шаблон нового документа",
    desc: "Если вы раннее не создавали необходимый шаблон документа.",
  },
];

export function AddDocumentScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DocHeader />
      <main className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
        <Button variant="ghost" size="m" icon={<HeaderArrowLeftIcon />} aria-label="Назад" onClick={() => router.back()} className="self-start" />

        <h1 className="ds-h5 text-center text-foreground">Добавление нового документа</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {OPTIONS.map((o, i) => (
            <div key={i} className="flex min-h-[300px] flex-col items-center rounded-[4px] border border-border bg-surface p-6 text-center">
              <img src={o.icon} alt="" aria-hidden className="size-[88px]" />
              <h2 className="ds-p1-medium mt-5 text-foreground">{o.title}</h2>
              <p className="ds-p3 mt-3 text-foreground-subtle">{o.desc}</p>
              <Button size="l" className="mt-auto w-full" onClick={o.href ? () => router.push(o.href!) : undefined}>Выбрать</Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
