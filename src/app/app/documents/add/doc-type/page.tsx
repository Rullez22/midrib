"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { AppProgress } from "@/components/app/app-progress";
import { SearchIcon } from "@/components/app/app-icons";
import { DOC_TYPE_GROUPS, type DocType } from "@/components/app/add-flow-data";

/**
 * Шаг 3 — «Выберите документ» (/app/documents/add/doc-type?v=…).
 * Источник: Figma 7009:572046. Группы документов + цена (Free=зелёная,
 * платно=жёлтая плитка). Тап по документу → шаг 4 (форма). DS: Text.
 */
const PRICE_BG = { free: "#7cb342", paid: "#f0b429" } as const;

function DocTypeInner() {
  const params = useSearchParams();
  const v = params.get("v") ?? "";
  const next = `/app/documents/add/form?v=${v}`;

  const Row = ({ d, first }: { d: DocType; first?: boolean }) => (
    <Link
      href={next}
      className={`flex items-stretch border-b border-border ${
        first ? "border-t" : ""
      }`}
    >
      <div className="flex min-h-[64px] flex-1 items-center px-4 py-3">
        <Text variant="p2">{d.name}</Text>
      </div>
      <div
        className="flex w-[80px] shrink-0 items-center justify-center text-[13px] font-[500] text-[#fff]"
        style={{ backgroundColor: PRICE_BG[d.tone] }}
      >
        {d.price}
      </div>
    </Link>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader
        title="Выберите документ"
        showBack
        flush
        actions={
          <button type="button" aria-label="Поиск" className="p-0.5">
            <SearchIcon />
          </button>
        }
      />
      <AppProgress current={3} total={5} />

      <main className="min-h-0 flex-1 overflow-y-auto">
        {DOC_TYPE_GROUPS.map((group, gi) => (
          <section key={group.title}>
            {gi > 0 && (
              <>
                {/* белый зазор сверху → серая полоса (8px) → белый зазор
                    снизу даёт pt-5 у заголовка (1:1 с макетом) */}
                <div className="h-6" />
                <div className="h-2 bg-surface-sunken" />
              </>
            )}
            <Text
              variant="caption-up"
              tone="subtle"
              as="div"
              className={`px-4 pb-2 ${gi > 0 ? "pt-5" : "pt-4"}`}
            >
              {group.title}
            </Text>
            {group.items.map((d, i) => (
              <Row key={d.name} d={d} first={i === 0} />
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}

export default function DocTypePage() {
  return (
    <Suspense>
      <DocTypeInner />
    </Suspense>
  );
}
