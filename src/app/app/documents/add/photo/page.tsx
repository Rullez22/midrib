"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { AppProgress } from "@/components/app/app-progress";

/**
 * Шаг 5 — «Добавьте фото» (/app/documents/add/photo?v=…).
 * Источник: Figma 7009:569238 / 569260. Загрузка фото документа +
 * примечание. «Далее» активна после добавления фото. DS: Text, Button.
 * (С веба реальную камеру не открываем — «+» добавляет плейсхолдер.)
 */
const NOTES = [
  "Сфотографируйте ваш паспорт гражданина РФ;",
  "Фотография должна быть цветной;",
  "Текст документа должен быть хорошо виден;",
  "Края документа не должны быть обрезаны.",
];

function PhotoInner() {
  const router = useRouter();
  const params = useSearchParams();
  const v = params.get("v") ?? "";
  const [photos, setPhotos] = useState<number[]>([]);

  const add = () => setPhotos((p) => [...p, p.length]);
  const remove = (i: number) =>
    setPhotos((p) => p.filter((_, idx) => idx !== i));

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Добавьте фото" showBack flush />
      <AppProgress current={5} total={5} />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <Text variant="p1-medium" as="div">
          Фото паспорта
        </Text>

        <div className="mt-4 flex flex-wrap gap-3">
          {photos.map((_, i) => (
            <div
              key={i}
              className="relative h-24 w-[72px] overflow-hidden rounded-lg bg-surface-muted"
            >
              <div className="flex h-full w-full items-center justify-center text-foreground-subtle">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-6Z M13 3v6h6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <button
                type="button"
                aria-label="Удалить фото"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(0,0,0,0.45)] text-[#fff]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}

          <button
            type="button"
            aria-label="Добавить фото"
            onClick={add}
            className="flex h-24 w-[72px] items-center justify-center rounded-lg bg-surface-muted text-foreground-subtle"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <Text variant="p3" tone="muted" as="div" className="mt-6">
          Примечание:
        </Text>
        <ul className="mt-1 space-y-1">
          {NOTES.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="text-foreground-subtle">•</span>
              <Text variant="p3" tone="subtle">
                {n}
              </Text>
            </li>
          ))}
        </ul>
      </main>

      <div className="px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          disabled={photos.length === 0}
          className="uppercase tracking-[0.5px]"
          onClick={() => router.push(`/app/documents/add/confirm?v=${v}`)}
        >
          Далее
        </Button>
      </div>
    </div>
  );
}

export default function PhotoPage() {
  return (
    <Suspense>
      <PhotoInner />
    </Suspense>
  );
}
