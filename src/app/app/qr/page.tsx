"use client";

import Link from "next/link";
import { Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { ChevronRightIcon } from "@/components/app/app-icons";

/**
 * Экран «Выберите кейс:» — открывается по QR-кнопке в шапке табов
 * «Главная» (Регистрации) и «Документы».
 * Источник: Figma «QR code» (7009:573572).
 *
 * Список кейсов (сценариев доступа к данным) — кликабельные строки,
 * каждая ведёт в свой флоу (`/app/qr/<n>`). Сами флоу добавляются по мере
 * поступления от пользователя; сейчас `[case]` — заглушка.
 *
 * DS: AppHeader (шапка + back), Text (типографика), ChevronRightIcon.
 * Стиль — MIDHUB (light-first); серый low-fi макет адаптирован под
 * реальную дизайн-систему (паттерн строки-списка из access/page.tsx).
 */

/** Кейсы доступа к данным — список следующих флоу. */
const CASES: { n: number; title: string }[] = [
  { n: 1, title: "Сервис запрашивает доступ к вашим данным" },
  {
    n: 2,
    title: "ВУЗ запрашивает доступ к вашим данным для выдачи диплома",
  },
  {
    n: 3,
    title:
      "ВУЗ запрашивает доступ к вашим данным для внесения дополнений в диплом",
  },
];

export default function QrCasesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Выберите кейс:" showBack />

      <main className="min-h-0 flex-1 overflow-y-auto">
        {CASES.map((c) => (
          <Link
            key={c.n}
            href={`/app/qr/${c.n}`}
            className="flex w-full items-center gap-3 border-b border-border px-4 py-4 text-left"
          >
            <Text variant="p2" className="flex-1">
              {c.n}. {c.title}
            </Text>
            <span className="shrink-0 text-foreground-muted">
              <ChevronRightIcon />
            </span>
          </Link>
        ))}
      </main>
    </div>
  );
}
