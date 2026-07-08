"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Text } from "@/components/ds";
import {
  ArrowLeftIcon,
  ChatIcon,
  GlobeIcon,
  PinIcon,
  StarIcon,
  LockIcon,
} from "@/components/app/app-icons";
import {
  VERIFS,
  VERIF_BG,
  VERIF_FEATURES,
  type FeatureIcon,
} from "@/components/app/add-doc-data";

/**
 * Экран «Подробнее» верификации — /app/documents/add/detail?id=…
 * Источник: Figma «Желтая международная верификация» 7009:572098,
 * адаптирован под все 4 типа (жёлтая/зелёная × международная/локальная).
 * Цветной баннер + преимущества + «Выбрать». Без нижней навигации.
 */
const FEATURE_ICON: Record<FeatureIcon, React.ReactNode> = {
  chat: <ChatIcon />,
  globe: <GlobeIcon />,
  star: <StarIcon />,
  lock: <LockIcon />,
};

function DetailInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "intl-yellow";
  const item = VERIFS.find((v) => v.id === id) ?? VERIFS[0];
  const bg = VERIF_BG[item.color];
  const Watermark = item.region === "international" ? GlobeIcon : PinIcon;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      {/* Цветной баннер */}
      <div
        className="relative overflow-hidden px-4 pb-6 pt-11 text-[#fff]"
        style={{ backgroundColor: bg }}
      >
        <Watermark className="pointer-events-none absolute -right-8 top-6 h-44 w-44 opacity-20" />

        <button
          type="button"
          aria-label="Назад"
          onClick={() => router.back()}
          className="relative -ml-1 mb-3 flex h-10 w-10 items-center justify-center text-[#fff]"
        >
          <ArrowLeftIcon width={24} height={24} />
        </button>

        <Text variant="h4" as="h1" className="relative text-[#fff]">
          {item.bannerTitle}
        </Text>
        <Text variant="p1-medium" as="p" className="relative mt-5 text-[#fff]">
          {item.bannerSubtitle}
        </Text>
        <Text variant="p2" as="p" className="relative mt-2 text-[#ffffff]/90">
          {item.bannerDesc}
        </Text>
      </div>

      {/* Ключ */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
        <Text variant="p1-medium">Ваш универсальный ключ</Text>
        <Text variant="p1-medium" className="shrink-0">
          {item.price}
        </Text>
      </div>

      {/* Преимущества */}
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
        {VERIF_FEATURES.map((f, i) => (
          <div key={i} className="flex items-start gap-4 py-3">
            <span className="mt-0.5 shrink-0 text-foreground">
              {FEATURE_ICON[f.icon]}
            </span>
            <Text variant="p2" tone="muted">
              {f.text}
            </Text>
          </div>
        ))}
      </main>

      {/* Выбрать */}
      <div className="px-4 pt-6 pb-6">
        <button
          type="button"
          onClick={() => router.push(`/app/documents/add/country?v=${item.id}`)}
          className="w-full rounded-lg py-3.5 text-center text-[14px] font-[500] uppercase tracking-[0.5px] text-[#fff]"
          style={{ backgroundColor: bg }}
        >
          Выбрать
        </button>
      </div>
    </div>
  );
}

export default function AddDocDetailPage() {
  return (
    <Suspense>
      <DetailInner />
    </Suspense>
  );
}
