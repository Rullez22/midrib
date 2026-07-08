"use client";

/**
 * Демка NavHub (навигационный хаб / карта переходов) для витрины /ds.
 * Источник: Figma «Midhub ERP» / Navigation (3501:453400), menu 1 (2570:334921),
 * Компания создана (1857:650053).
 */
import Link from "next/link";
import {
  NavHubCard,
  NavHubLinkList,
  NavHubChoiceCard,
  Text,
} from "@/components/ds";

export function NavHubDemos() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-6">
      {/* Живые экраны */}
      <div className="flex flex-wrap gap-3">
        {[
          { href: "/", label: "Navigation (/)" },
          { href: "/company-not-created", label: "Компания не создана" },
          { href: "/company-created", label: "Компания создана" },
        ].map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="ds-p3-medium rounded-[8px] border border-border bg-surface-muted px-4 py-2 text-foreground transition-colors hover:bg-surface-sunken"
          >
            {s.label} →
          </Link>
        ))}
      </div>

      {/* Карточка выбора (кликабельная, с иллюстрацией) */}
      <div className="grid gap-6 md:grid-cols-2">
        <NavHubChoiceCard
          title="Компания не создана"
          description="Для того чтобы представитель мог создать свою компанию на платформе, его должен пригласить менеджер другой компании."
          href="/company-not-created"
          illustrationSrc="/illustrations/warning-triangle.svg"
        />
        <NavHubChoiceCard
          title="Компания создана"
          description="Представитель компании уже создал компанию на платформе и компания работает."
          href="/company-created"
          illustrationSrc="/illustrations/check-circle.svg"
        />
      </div>

      {/* Sunken-панель со списком ссылок */}
      <NavHubCard title="Представитель компании">
        <NavHubLinkList
          items={[
            { label: "Создание компании", href: "#" },
            { label: "Создание условий соглашения", href: "#" },
            { label: "Приглашение пайщиков", href: "#" },
            { label: "Выбор Совета", href: "#" },
          ]}
        />
      </NavHubCard>

      <Text variant="caption" tone="subtle">
        NavHubPage (каркас с back-кнопкой и центрированным H1) показан целиком на
        живых экранах выше.
      </Text>
    </div>
  );
}
