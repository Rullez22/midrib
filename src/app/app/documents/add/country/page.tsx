"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { AppProgress } from "@/components/app/app-progress";
import { SearchIcon } from "@/components/app/app-icons";
import {
  POPULAR_COUNTRIES,
  ALL_COUNTRIES,
  type Country,
} from "@/components/app/add-flow-data";

/**
 * Шаг 2 — «Выберите страну» (/app/documents/add/country?v=…).
 * Источник: Figma 7009:568983. Популярные + Все страны (много), поиск.
 * Тап по стране → шаг 3 (выбор документа). DS: Text.
 */
function CountryInner() {
  const params = useSearchParams();
  const v = params.get("v") ?? "";
  const next = `/app/documents/add/doc-type?v=${v}`;

  const Row = ({ c }: { c: Country }) => (
    <Link
      href={next}
      className="flex items-center gap-3 border-b border-border px-4 py-3"
    >
      <span className="text-2xl leading-none">{c.flag}</span>
      <Text variant="p2">{c.name}</Text>
    </Link>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader
        title="Выберите страну"
        showBack
        flush
        actions={
          <button type="button" aria-label="Поиск" className="p-0.5">
            <SearchIcon />
          </button>
        }
      />
      <AppProgress current={2} total={5} />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <Text
          variant="caption-up"
          tone="subtle"
          as="div"
          className="px-4 pb-1 pt-4"
        >
          Популярные страны
        </Text>
        {POPULAR_COUNTRIES.map((c) => (
          <Row key={c.name} c={c} />
        ))}

        <div className="h-2 bg-surface-sunken" />

        <Text
          variant="caption-up"
          tone="subtle"
          as="div"
          className="px-4 pb-1 pt-4"
        >
          Все страны
        </Text>
        {ALL_COUNTRIES.map((c) => (
          <Row key={c.name} c={c} />
        ))}
      </main>
    </div>
  );
}

export default function CountryPage() {
  return (
    <Suspense>
      <CountryInner />
    </Suspense>
  );
}
