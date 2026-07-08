"use client";

import { useState } from "react";
import { Pagination, type PaginationSize, type PaginationView } from "@/components/ds";

/**
 * Витрина Pagination — матрица view × size, 1:1 с Figma «UI Контролы»
 * / Pagination (node 928:29174). Каждый ряд хранит свою страницу (интерактив).
 */

const SIZES: { size: PaginationSize; label: string }[] = [
  { size: "l", label: "L-48" },
  { size: "m", label: "M-40" },
  { size: "s", label: "S-32" },
  { size: "xs", label: "XS-24" },
];

const VIEWS: { view: PaginationView; label: string }[] = [
  { view: "full", label: "full" },
  { view: "medium", label: "medium" },
  { view: "basic", label: "basic" },
  { view: "compact", label: "compact (без поля)" },
];

function ViewBlock({ view, label }: { view: PaginationView; label: string }) {
  const [pages, setPages] = useState<Record<string, number>>({ l: 1, m: 1, s: 1, xs: 1 });
  return (
    <div className="flex flex-col gap-4">
      <span className="ds-caption-up text-foreground-subtle">{label}</span>
      <div className="flex flex-col gap-5 rounded-xl border border-border p-5">
        {SIZES.map(({ size, label: sizeLabel }) => (
          <div key={size} className="flex flex-wrap items-center gap-3">
            <span className="ds-caption-medium w-12 shrink-0 text-foreground-subtle">{sizeLabel}</span>
            <Pagination
              view={view}
              size={size}
              page={pages[size]}
              total={200}
              onChange={(p) => setPages((s) => ({ ...s, [size]: p }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaginationDemos() {
  return (
    <div className="flex flex-col gap-8">
      {VIEWS.map((v) => (
        <ViewBlock key={v.view} {...v} />
      ))}
    </div>
  );
}
