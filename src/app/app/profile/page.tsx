"use client";

import Link from "next/link";
import { Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import {
  ShareIcon,
  QuestionIcon,
  BankIcon,
  ChevronRightIcon,
} from "@/components/app/app-icons";

/**
 * Экран «Профиль» — /app/profile (по тапу на аватар в шапке).
 * Источник: Figma 7009:570837. Меню: Поделиться адресом · Вопросы о Midhub ·
 * Юридическая информация. DS: Text. Без нижней навигации (pushed-экран).
 */
interface Row {
  href: string;
  label: string;
  icon: React.ReactNode;
  accent?: boolean;
}

const ROWS: Row[] = [
  {
    href: "/app/profile/share",
    label: "Поделиться адресом",
    icon: <ShareIcon />,
    accent: true,
  },
  { href: "#", label: "Вопросы о Midhub", icon: <QuestionIcon /> },
  { href: "#", label: "Юридическая информация", icon: <BankIcon /> },
];

export default function ProfilePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Профиль" showBack />

      <main className="min-h-0 flex-1 overflow-y-auto">
        {ROWS.map((row) => (
          <Link
            key={row.label}
            href={row.href}
            className="flex min-h-[64px] items-center gap-3 border-b border-border px-4"
          >
            <span className={row.accent ? "text-primary" : "text-foreground-muted"}>
              {row.icon}
            </span>
            <Text
              variant="p2"
              as="span"
              className={`flex-1 ${row.accent ? "text-primary" : ""}`}
            >
              {row.label}
            </Text>
            <span className="text-foreground-subtle">
              <ChevronRightIcon width={20} height={20} />
            </span>
          </Link>
        ))}
      </main>
    </div>
  );
}
