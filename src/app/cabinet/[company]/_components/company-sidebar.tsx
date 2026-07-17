"use client";

import { type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import {
  MenuRail,
  MenuBadge,
  MenuPanel,
  MenuNavItem,
  MenuDivider,
  MenuFooter,
  MenuIcon,
  type MenuBadgeColor,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { SidebarShell } from "@/components/ds/composite/sidebar-shell";
import { WalletFilledIcon } from "../../../flow/company-create/_components/coop-sidebar";
import { CabinetMenuIcon } from "./cabinet-menu-icons";
import { CARD_TINT, type CabinetConfig } from "../_config/cabinets";
import { railHref } from "../_config/cabinet-rail";
import { useCabinetUnlock } from "./cabinet-unlock";

/**
 * CompanySidebar — боковое меню кабинета (рейка воркспейсов + панель).
 * Конфиг-управляемый аналог админского CoopSidebar: собран из тех же DS
 * LeftMenu-примитивов, но пункты/цвет/имя/активный номер берёт из CabinetConfig.
 * Каждый кабинет — отдельная компания: своя карточка департамента и свой набор
 * пунктов (Деятельность + Счета + кабинет-специфичные).
 *
 * `current`: "subdivision" (главный профиль) · "activity" · "accounts" · ключ
 * пункта из cabinet.menu.
 */

const USER_PHOTO = "/members/ilya.png";

const RAIL: { label: string; color: MenuBadgeColor }[] = [
  { label: "1", color: "red" },
  { label: "2", color: "orange" },
  { label: "3", color: "yellow" },
  { label: "4", color: "green" },
  { label: "5", color: "blue" },
  { label: "6", color: "blue-strong" },
  { label: "7", color: "purple" },
  { label: "8", color: "cyan" },
];

export { CARD_TINT };

function DeptCard({ cabinet, current, onClick }: { cabinet: CabinetConfig; current: boolean; onClick: () => void }) {
  const tint = CARD_TINT[cabinet.railColor];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className="flex w-full cursor-pointer flex-col gap-2 overflow-hidden rounded-[4px] border border-border bg-surface pb-2 transition-colors hover:border-[color:var(--dept-hover)]"
      style={
        current
          ? { borderColor: tint.border, backgroundColor: tint.bg, ["--dept-hover" as string]: tint.border }
          : ({ ["--dept-hover" as string]: tint.border } as React.CSSProperties)
      }
    >
      <div className="relative h-[88px]">
        <div className="h-[57px] rounded-t-[3px]" style={{ backgroundImage: tint.cover }} />
        <div
          className="absolute bottom-0 left-1/2 size-[72px] -translate-x-1/2 overflow-hidden rounded-full border-2 border-[#fff] bg-surface-muted"
        >
          <img src={cabinet.avatar} alt="" className="size-full object-cover" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5 px-2 text-center">
        <span className="ds-caption-medium text-foreground">{cabinet.name}</span>
        <span className="ds-caption text-foreground-subtle">Департамент</span>
      </div>
    </div>
  );
}

function Pill({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1 rounded-[4px] bg-surface-sunken px-4 py-1.5 transition-colors duration-[250ms] hover:bg-[color:var(--color-surface-hover)]"
    >
      <span className={cn("flex size-4 items-center justify-center", active ? "text-primary" : "text-[var(--color-grey-300)]")}>{icon}</span>
      <span className={cn("ds-caption-medium", active ? "text-primary" : "text-[#5A646E]")}>{label}</span>
    </button>
  );
}

/**
 * CompanyRail — тонкая рейка воркспейсов (7 бейджей + бренд + футер), общая для
 * `CompanySidebar` и экрана «О компании». Бренд-бейдж («логотип») ведёт на
 * `/cabinet/about` — клик по логотипу с любой страницы кабинета открывает
 * «О компании» (кооператив-уровень, единый экран). `activeRail` подсвечивает
 * текущий кабинет (null — ничего, для самого экрана «О компании»).
 */
export function CompanyRail({ activeRail }: { activeRail?: number | null }) {
  const router = useRouter();
  return (
    <MenuRail
      height="100vh"
      brand={
        <MenuBadge brand aria-label="О компании" onClick={() => router.push("/cabinet/about")}>
          <MenuIcon.Brand />
        </MenuBadge>
      }
      footer={
        <MenuFooter
          role="button"
          tabIndex={0}
          className="cursor-pointer"
          onClick={() => router.push("/cabinet/admin")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push("/cabinet/admin"); } }}
        >
          Admin
        </MenuFooter>
      }
    >
      {RAIL.map((w) => {
        const href = railHref(w.label);
        return (
          <MenuBadge
            key={w.label}
            color={w.color}
            active={activeRail != null && w.label === String(activeRail)}
            onClick={href ? () => router.push(href) : undefined}
          >
            {w.label}
          </MenuBadge>
        );
      })}
    </MenuRail>
  );
}

export function CompanySidebar({ cabinet, current }: { cabinet: CabinetConfig; current: string }) {
  const router = useRouter();
  const { unlocked } = useCabinetUnlock();
  const base = `/cabinet/${cabinet.slug}`;
  const go = (sub: string) => router.push(sub ? `${base}/${sub}` : base);
  // Пункты с lockedUntil показываем только после прохождения их флоу (ВУЗы).
  const menu = cabinet.menu.filter((m) => !m.lockedUntil || unlocked[m.lockedUntil]);

  return (
    <SidebarShell>
      <CompanyRail activeRail={cabinet.rail} />

      <MenuPanel
        height="100vh"
        footer={
          <MenuFooter
            avatar={USER_PHOTO}
            role="button"
            tabIndex={0}
            onClick={() => router.push("/cabinet/lk/chair")}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push("/cabinet/lk/chair"); }
            }}
            className="cursor-pointer"
          >
            Пред. правления
          </MenuFooter>
        }
      >
        <DeptCard cabinet={cabinet} current={current === "subdivision"} onClick={() => router.push(base)} />

        <Pill icon={<CabinetMenuIcon.Activity className="h-[13px] w-4" />} label="Деятельность" active={current === "activity"} onClick={() => go("activity")} />
        <Pill icon={<WalletFilledIcon className="size-4" />} label="Счета" active={current === "accounts"} onClick={() => go("accounts")} />

        <MenuDivider />

        {menu.map((m) => (
          <MenuNavItem key={m.key} icon={m.icon} active={current === m.key} onClick={() => go(m.path)}>
            {m.label}
          </MenuNavItem>
        ))}
      </MenuPanel>
    </SidebarShell>
  );
}
