"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrMock } from "@/components/app/qr-mock";
import { ArrowLeftIcon } from "@/components/app/app-icons";

/**
 * Экран сканирования штрихкода сервиса (Figma 7009:573601→573628 /
 * 7009:573748→573668). Тап по квадрату «сканирует» (показывает QR),
 * тап по QR ведёт на экран запроса доступа (`grantHref`).
 */
export function ServiceScanScreen({ grantHref }: { grantHref: string }) {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[#9b9b9b] pt-11">
      <div className="px-3 py-2">
        <button
          type="button"
          aria-label="Назад"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center text-[#fff]"
        >
          <ArrowLeftIcon width={24} height={24} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-10 pb-16">
        {scanned ? (
          <button
            type="button"
            aria-label="Штрихкод сервиса"
            onClick={() => router.push(grantHref)}
            className="rounded-[6px] bg-[#fff] p-3"
          >
            <QrMock size={200} />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Сканировать штрихкод"
            onClick={() => setScanned(true)}
            className="size-[220px] rounded-[2px] bg-[#fff]"
          />
        )}

        <p className="px-8 text-center text-[18px] text-[#fff]">
          Просканируйте штрихкод сервиса
        </p>
      </div>
    </div>
  );
}
