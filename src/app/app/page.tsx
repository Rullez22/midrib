"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { AppTabsBar } from "@/components/app/app-tabs-bar";
import {
  SearchIcon,
  QrIcon,
  ChatIcon,
  DocIcon,
  NewsIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@/components/app/app-icons";
import { useRegistrations } from "@/components/app/registrations-store";

/**
 * Экран «Регистрации» — домашний экран (таб «Главная») мобильной апки MIDHUB.
 * Источник: Figma «Mobile | Main 2» (Веб 7009:570900, Друзья 7009:572285,
 * Работа 7009:567178).
 *
 * DS-компоненты: Tabs/Tab (табы), Text (типографика), AppHeader (шапка),
 * app-icons (иконки). Стиль/шрифт — MIDHUB (Articulat, токены). Активный
 * таб — зелёный (токен --color-green-500), 1:1 с макетом.
 */

type RegTab = "web" | "friends" | "work";

/** Строка списка регистраций: заголовок + иконки-действия справа. */
function RegRow({
  title,
  trailing,
  href,
  onClick,
}: {
  title: string;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const cls =
    "flex min-h-[72px] items-center gap-4 border-b border-border px-4";
  const inner = (
    <>
      <Text variant="p2" className="min-w-0 flex-1 truncate">
        {title}
      </Text>
      {trailing && (
        <div className="flex flex-none items-center gap-4">{trailing}</div>
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={cls} {...(onClick ? { role: "button", tabIndex: 0, onClick } : {})}>
      {inner}
    </div>
  );
}

/** Строка «персона/партнёр»: имя + подзаголовок (2 строки) + иконка. */
function PersonRow({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-border px-4 py-3.5"
    >
      <div className="min-w-0 flex-1">
        <Text variant="p2-medium" as="div">
          {title}
        </Text>
        <Text variant="p2" tone="muted" as="div" className="leading-snug">
          {subtitle}
        </Text>
      </div>
      <NewsIcon className="shrink-0 text-foreground-muted" />
    </Link>
  );
}

function WebTab() {
  const { registrations, remove } = useRegistrations();
  const router = useRouter();

  return (
    <div>
      {registrations.map((reg) => {
        // Сервис с отозванным доступом: красная урна + подпись, клик по строке
        // ведёт на экран удаления, клик по урне — сразу удаляет. Figma 7009:571769.
        if (reg.status === "revoked") {
          return (
            <div
              key={reg.id}
              className="flex min-h-[72px] items-center gap-4 border-b border-border px-4"
            >
              <button
                type="button"
                onClick={() => router.push(`/app/service/${reg.id}/revoked`)}
                className="min-w-0 flex-1 text-left"
              >
                <Text variant="p2" as="div" className="truncate">
                  {reg.title}
                </Text>
                <Text
                  variant="caption"
                  as="div"
                  className="truncate text-[var(--color-red-500)]"
                >
                  Сервис полностью удалил ваши данные
                </Text>
              </button>
              <button
                type="button"
                aria-label="Удалить сервис"
                onClick={() => remove(reg.id)}
                className="flex-none text-[var(--color-red-500)]"
              >
                <TrashIcon />
              </button>
            </div>
          );
        }

        const trailing = (
          <>
            {reg.chat && <ChatIcon className="text-primary" />}
            <DocIcon className="text-primary" />
          </>
        );
        return (
          <RegRow
            key={reg.id}
            title={reg.title}
            trailing={trailing}
            {...(reg.detailed
              ? { onClick: () => router.push(`/app/service/${reg.id}`) }
              : {})}
          />
        );
      })}
    </div>
  );
}

function FriendsTab() {
  return (
    <div>
      <RegRow
        title="О разделе «Друзья»"
        href="/app/friends-about"
        trailing={<ChevronRightIcon className="text-foreground-subtle" />}
      />
      <PersonRow
        href="/app/access?id=kovalev"
        title="Ковалев Андрей Викторович"
        subtitle={
          <>
            предоставил вам данные{" "}
            <span className="text-[var(--color-green-600)]">←</span>
          </>
        }
      />
      <PersonRow
        href="/app/access?id=ivanov"
        title="Иванов Александр Тимурович"
        subtitle={
          <>
            вы предоставили данные{" "}
            <span className="text-[var(--color-red-500)]">→</span>
          </>
        }
      />
    </div>
  );
}

const WORK_PARTNERS = [
  {
    id: "miller",
    title: "Miller",
    role: "вы основатель:",
    org: "«Нотариальная компания Миллера»",
  },
  {
    id: "vasilek",
    title: "Сервис «Василек»",
    role: "для регистрации:",
    org: "«Сервис Ромашка»",
  },
  {
    id: "midhub",
    title: "Midhub",
    role: "вы основатель:",
    org: "«First Notary LTD»",
  },
];

function WorkTab() {
  return (
    <div>
      {WORK_PARTNERS.map((p) => (
        <PersonRow
          key={p.id}
          href={`/app/access?id=${p.id}`}
          title={p.title}
          subtitle={
            <>
              {p.role}
              <br />
              {p.org}
            </>
          }
        />
      ))}
    </div>
  );
}

function RegistrationsInner() {
  const router = useRouter();
  const params = useSearchParams();
  // Активный таб храним в URL (?tab=), чтобы возврат (back) с детальных
  // экранов восстанавливал таб, с которого зашли, а не сбрасывал на первый.
  const tab = (params.get("tab") as RegTab) || "web";
  const setTab = (v: RegTab) =>
    router.replace(v === "web" ? "/app" : `/app?tab=${v}`, { scroll: false });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        title="Регистрации"
        flush
        actions={
          <>
            <button type="button" aria-label="Поиск" className="p-0.5">
              <SearchIcon />
            </button>
            <Link href="/app/qr" aria-label="QR-код" className="p-0.5">
              <QrIcon />
            </Link>
          </>
        }
      />

      <AppTabsBar
        value={tab}
        onChange={(v) => setTab(v as RegTab)}
        items={[
          { value: "web", label: "Веб" },
          { value: "friends", label: "Друзья" },
          { value: "work", label: "Работа" },
        ]}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {tab === "web" && <WebTab />}
        {tab === "friends" && <FriendsTab />}
        {tab === "work" && <WorkTab />}
      </main>
    </div>
  );
}

export default function RegistrationsPage() {
  return (
    <Suspense>
      <RegistrationsInner />
    </Suspense>
  );
}
