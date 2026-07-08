"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, Text } from "@/components/ds";
import {
  DIPLOMA_ROWS,
  DIPLOMA_APPENDIX_ROWS,
  DIPLOMA_APPENDIX2_ROWS,
} from "@/components/app/diploma-data";
import { useDiploma } from "@/components/app/diploma-store";

/**
 * Подтверждение корректности данных диплома (Figma 7009:575194 — выдача, кейс 2;
 * 7009:575272 — внесение дополнений, кейс 3).
 * «Отклонить» → диплом исчезает. «Подтвердить» → экран «Поздравляем».
 */

/** Таблица «поле — значение» в рамке. */
function DataTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mx-4 my-3 overflow-hidden rounded-[2px] border border-border">
      {rows.map(([label, value], i) => (
        <div
          key={label}
          className={`flex gap-3 px-3 py-2.5 ${i > 0 ? "border-t border-border" : ""}`}
        >
          <Text variant="caption" tone="subtle" className="w-[120px] shrink-0">
            {label}
          </Text>
          <Text variant="caption-medium" className="flex-1">
            {value}
          </Text>
        </div>
      ))}
    </div>
  );
}

/** Белый раскрывающийся блок (заголовок + стрелка). */
function WhiteAccordion({
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
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <Text variant="p2">{title}</Text>
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          className={`text-foreground-subtle transition-transform ${open ? "rotate-180" : ""}`}
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

export default function DiplomaConfirmPage() {
  const router = useRouter();
  const { confirm, reject, variant } = useDiploma();
  const isAppendix = variant === "appendix";

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <div className="shrink-0 bg-surface px-4 pt-11 pb-3 text-center">
        {isAppendix ? (
          <Text variant="p2-medium" as="p">
            Подтвердите корректность
            <br />
            внесенных дополнений
          </Text>
        ) : (
          <Text variant="p2-medium" as="p">
            Вам выдан диплом
            <br />
            подтвердите корректность данных
          </Text>
        )}
      </div>

      <div className="shrink-0 bg-[var(--color-green-500)] py-2.5 text-center">
        <Text variant="p2-medium" className="text-[#fff]">
          Диплом
        </Text>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto">
        {isAppendix ? (
          <>
            {/* Кейс 3: старые блоки свёрнуты, новое дополнение раскрыто. */}
            <WhiteAccordion title="Выдача диплома 12.02.2017">
              <DataTable rows={DIPLOMA_ROWS} />
            </WhiteAccordion>
            <WhiteAccordion title="Приложение к диплому 12.02.2017">
              <DataTable rows={DIPLOMA_APPENDIX_ROWS} />
            </WhiteAccordion>
            <WhiteAccordion title="Приложение к диплому 17.06.2020" defaultOpen>
              <DataTable rows={DIPLOMA_APPENDIX2_ROWS} />
            </WhiteAccordion>
          </>
        ) : (
          <>
            <WhiteAccordion title="Выдача диплома 12.02.2017" defaultOpen>
              <DataTable rows={DIPLOMA_ROWS} />
            </WhiteAccordion>
            <WhiteAccordion title="Приложение к диплому 12.02.2017">
              <DataTable rows={DIPLOMA_APPENDIX_ROWS} />
            </WhiteAccordion>
          </>
        )}
      </main>

      <div className="flex shrink-0 gap-3 px-4 pt-6 pb-6">
        <Button
          variant="secondary"
          size="m"
          fullWidth
          className="uppercase"
          onClick={() => {
            reject();
            router.push("/app/documents");
          }}
        >
          Отклонить
        </Button>
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase"
          onClick={() => {
            confirm();
            router.push("/app/documents/diploma/done");
          }}
        >
          Подтвердить
        </Button>
      </div>
    </div>
  );
}
