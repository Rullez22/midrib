"use client";

import { useState, type ReactNode } from "react";
import { Text } from "@/components/ds";

/**
 * AccordionBlock — раскрывающийся блок с зелёной шапкой (Figma 7009:574668).
 * Заголовок по центру, стрелка справа; клик сворачивает/разворачивает.
 */
export function AccordionBlock({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex w-full items-center justify-center border-b border-[#fff] bg-[var(--color-green-500)] px-10 py-2.5"
        aria-expanded={open}
      >
        <Text variant="p2-medium" className="text-[#fff]">
          {title}
        </Text>
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          className={`absolute right-4 text-[#fff] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
