"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * AdminModuleDirectionScreen — детальная страница направления в Магазине модулей
 * (Figma 6442:342320 «Идеологическое направление»). Кнопка «назад» + заголовок +
 * сетка карточек под-модулей (иконка · название · описание · комиссия · «Подробнее»).
 * Полноширинная (без сайдбара, как в макете). Иконки — inline SVG (не asset-URL Figma).
 */

const DESC = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa mi non posuere";

function HeartIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className="size-12">
      <path d="M24 40s-13-8.4-13-18a7.5 7.5 0 0 1 13-5.1A7.5 7.5 0 0 1 37 22c0 9.6-13 18-13 18Z" fill="#F26D6D" />
    </svg>
  );
}
function BankIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className="size-12">
      <path d="M24 8 8 17h32L24 8Z" fill="#90C4F6" />
      <rect x="11" y="19" width="4" height="15" fill="#6CB3F8" />
      <rect x="22" y="19" width="4" height="15" fill="#6CB3F8" />
      <rect x="33" y="19" width="4" height="15" fill="#6CB3F8" />
      <rect x="8" y="36" width="32" height="4" rx="1" fill="#90C4F6" />
    </svg>
  );
}
function ConsultIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className="size-12">
      <rect x="6" y="12" width="24" height="17" rx="4" fill="#FAC06C" />
      <path d="M12 29v6l7-6z" fill="#FAC06C" />
      <rect x="22" y="20" width="20" height="15" rx="4" fill="#90C4F6" />
      <path d="M36 35v5l-6-5z" fill="#90C4F6" />
    </svg>
  );
}
function ExecutorIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className="size-12">
      <circle cx="24" cy="15" r="7" fill="#A58CD2" />
      <path d="M10 40c0-7.7 6.3-13 14-13s14 5.3 14 13z" fill="#6CB3F8" />
      <path d="M24 27l-3 6 3 3 3-3-3-6z" fill="#F3F6F9" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface SubModule {
  slug: string;
  title: string;
  icon: ReactNode;
  fee: string;
  free?: boolean;
}

const SUBMODULES: SubModule[] = [
  { slug: "social", title: "Социальные проекты", icon: <HeartIcon />, fee: "0.05 ETH" },
  { slug: "bank", title: "Банк", icon: <BankIcon />, fee: "0.01 ETH" },
  { slug: "consultant", title: "Консультант", icon: <ConsultIcon />, fee: "Бесплатно", free: true },
  { slug: "executor", title: "Исполнитель", icon: <ExecutorIcon />, fee: "0.02 ETH" },
];

export function AdminModuleDirectionScreen({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fff]">
      {/* Шапка: назад + заголовок по центру + линия снизу */}
      <div className="relative flex items-center border-b border-border px-5 py-4 md:px-12">
        <button
          type="button"
          aria-label="Назад"
          onClick={() => router.push("/cabinet/admin/modules?tab=shop")}
          className="flex size-10 items-center justify-center rounded-[4px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
            <path d="m10 3-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="ds-h4 mx-auto text-foreground">{title}</h1>
      </div>

      {/* Карточки под-модулей — в ряд, растянуты на всю ширину контента */}
      <div className="grid grid-cols-1 gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4 md:px-12">
        {SUBMODULES.map((m) => (
          <div key={m.title} className="flex min-h-[244px] w-full flex-col rounded-[4px] border border-border bg-[#fff] p-4">
            <div className="mb-2">{m.icon}</div>
            <span className="ds-p1-medium text-foreground">{m.title}</span>
            <p className="ds-caption mt-3 text-foreground-muted">{DESC}</p>
            <div className="mt-auto flex items-end justify-between">
              <span className="flex flex-col">
                <span className="ds-caption text-[var(--color-grey-300)]">Комиссия:</span>
                <span className={m.free ? "ds-p3-medium text-[var(--color-green-400)]" : "ds-p3-medium text-foreground"}>{m.fee}</span>
              </span>
              <button
                type="button"
                onClick={() => router.push(`/cabinet/admin/modules/${slug}/${m.slug}`)}
                className="inline-flex items-center gap-1 px-4 py-1.5 text-primary hover:underline"
              >
                <span className="ds-p3-medium">Подробнее</span>
                <ArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
