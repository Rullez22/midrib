"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab } from "@/components/ds";
import { AdminSidebar } from "./admin-sidebar";
import { SHOP_DIRECTIONS } from "./admin-modules-data";

const MODULE_DESC =
  "Расчётный банк кооператива: маршрутные счета подразделений, приём паевых, вступительных и целевых взносов, платёжные поручения и выписки по каждому договору. Операции привязаны к решениям правления — платёж уходит только после согласованного документа и голосования. Пайщикам доступны лицевой счёт, история взаиморасчётов и выгрузка справок. Комиссия за операцию — 0.01 ETH.";

/** Установленный модуль в «Ваши приложения» — красная шапка направления + карточка. */
function InstalledDirection() {
  return (
    <div className="overflow-hidden rounded-[8px] border border-border">
      <div className="bg-[var(--color-red-300)] px-4 py-2.5">
        <span className="ds-p3-medium text-[#fff]">Идеологическое направление</span>
      </div>
      <div className="flex flex-wrap items-start gap-4 p-4">
        <div className="flex w-[146px] shrink-0 flex-col overflow-hidden rounded-[4px] border border-border">
          <div className="flex h-[88px] items-center justify-center bg-surface-muted">
            <span className="ds-p2-medium text-foreground-subtle">TATRA</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 border-t border-border py-2 text-primary">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 8h12M8 2c2 2.2 2 9.8 0 12M8 2c-2 2.2-2 9.8 0 12" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <span className="ds-caption-medium">bank.tatra.ru</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="ds-p2-medium text-foreground">Bank Tatra</span>
          <p className="ds-p3 text-foreground-muted">{MODULE_DESC}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * AdminModulesScreen — раздел «Модули» админки (Figma 6442:342721 — «Ваши
 * приложения» пусто · 6442:342687 — «Магазин»: карточки направлений). Табы
 * Ваши приложения / Магазин. Reuse DS: Tabs · Tab.
 */

/** Описание направления в «Магазине» — своё для каждого slug из SHOP_DIRECTIONS. */
const DIRECTION_DESC: Record<string, string> = {
  ideo: "Формирование концепции кооператива и инструменты, через которые она реализуется: работа с целями и ценностями, уставные документы, банковские и консультационные сервисы для подразделений. Сюда же подключаются социальные проекты и целевые сборы.",
  infra: "Инженерная и IT-инфраструктура кооператива: учёт объектов и оборудования, заявки на обслуживание, подрядчики и графики работ, доступы сотрудников и мониторинг сервисов.",
  marketing: "Продвижение кооператива и привлечение новых пайщиков: посадочные страницы и формы регистрации, рассылки, аналитика каналов, партнёрские программы и совместные акции с фондами.",
  housing: "Жилищные программы кооператива: учёт паёв и очередей, договоры на строительство и приобретение жилья, расчёт взносов, графики платежей и передача объектов пайщикам.",
  economy: "Хозяйственная деятельность: совместные закупки и склад, логистика, сметы и акты выполненных работ, расчёты с поставщиками и подрядчиками, инвентаризация имущества.",
  strategy: "Стратегическое планирование: план развития направлений, показатели подразделений, бюджетирование и сценарии, отчётность для правления и совета кооператива.",
  space: "Исследовательские и экспериментальные проекты: гранты и целевые сборы, партнёрства с научными центрами, ведение программ и отчётность о расходовании средств.",
};

function FolderIcon() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className="size-20 opacity-80">
      <path d="M12 30a4 4 0 0 1 4-4h20l6 8h30a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="var(--color-blue-midhub-200)" />
      <rect x="20" y="40" width="24" height="18" rx="3" fill="var(--color-white)" stroke="var(--color-blue-midhub-300)" strokeWidth="1.5" />
      <circle cx="60" cy="46" r="9" fill="var(--color-white)" stroke="var(--color-blue-midhub-300)" strokeWidth="1.5" />
      <path d="m67 53 6 6" stroke="var(--color-blue-midhub-300)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AdminModulesScreen({ initialTab = "apps" }: { initialTab?: "apps" | "shop" }) {
  const router = useRouter();
  const [tab, setTab] = useState(initialTab);
  // Установленные модули (после «Включить в подразделение»).
  const [installed, setInstalled] = useState<string[]>([]);
  useEffect(() => {
    try {
      setInstalled(JSON.parse(localStorage.getItem("admin.installedModules") ?? "[]"));
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar current="modules" />
      <main className="min-w-0 flex-1">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "apps" | "shop")}
          variant="solid-light"
          size="l"
          equal
          aria-label="Модули"
          className="w-full rounded-none border-x-0 border-t-0"
        >
          <Tab value="apps">Ваши приложения</Tab>
          <Tab value="shop">Магазин</Tab>
        </Tabs>

        <div className="flex w-full flex-col gap-4 px-5 py-8 md:px-[50px]">
          {tab === "apps" ? (
            installed.length > 0 ? (
              <InstalledDirection />
            ) : (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <FolderIcon />
                <p className="ds-p1 text-[var(--color-grey-300)]">Список ваших модулей пуст</p>
              </div>
            )
          ) : (
            SHOP_DIRECTIONS.map((m) => (
              <button
                key={m.slug}
                type="button"
                onClick={() => router.push(`/cabinet/admin/modules/${m.slug}`)}
                className="ds-row flex gap-4 rounded-[8px] border border-border bg-[#fff] p-4 text-left"
              >
                <div className="size-[110px] shrink-0 rounded-[6px]" style={{ backgroundColor: m.color }} />
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="ds-p2-medium text-foreground">{m.title}</span>
                  <p className="ds-p3 text-foreground-muted">{DIRECTION_DESC[m.slug]}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
