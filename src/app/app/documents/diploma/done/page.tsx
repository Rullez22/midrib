"use client";

import { useRouter } from "next/navigation";
import { Button, Text } from "@/components/ds";

/**
 * «Поздравляем! Диплом получен» (Figma 7009:575360).
 * «Продолжить работу» → раздел «Мои документы».
 */
export default function DiplomaDonePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface pt-11">
      <div className="flex min-h-0 flex-1 flex-col items-center px-6 pt-16 text-center">
        <GraduationCap />
        <Text variant="h5" as="h1" className="mt-6 mb-1">
          Поздравляем!
        </Text>
        <Text variant="p2" tone="muted" as="p">
          Диплом получен и размещен в разделе “Мои документы”
        </Text>
      </div>

      <div className="px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
          onClick={() => router.push("/app/documents")}
        >
          Продолжить работу
        </Button>
      </div>
    </div>
  );
}

function GraduationCap() {
  return (
    <svg width={96} height={72} viewBox="0 0 96 72" fill="none">
      <path d="M48 6 6 24l42 18 42-18L48 6Z" fill="var(--color-green-500)" />
      <path
        d="M26 34v14c0 5 10 9 22 9s22-4 22-9V34l-22 9-22-9Z"
        fill="var(--color-green-500)"
      />
      <path
        d="M88 24v20"
        stroke="var(--color-green-500)"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}
