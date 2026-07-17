"use client";

import { useRouter } from "next/navigation";
import {
  MenuRail,
  MenuBadge,
  MenuPanel,
  MenuButton,
  MenuButtonRow,
  MenuFooter,
  MenuIcon,
  MenuDivider,
  Dropdown,
  Button,
  type MenuBadgeColor,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { SidebarShell } from "@/components/ds/composite/sidebar-shell";
import { railHref } from "../../[company]/_config/cabinet-rail";
import { railColorOf } from "../../[company]/_config/cabinets";
import { CARD_TINT } from "../../[company]/_components/company-sidebar";
import { CabinetMenuIcon } from "../../[company]/_components/cabinet-menu-icons";
import { WalletFilledIcon, VotingCheckIcon } from "../../../flow/company-create/_components/coop-sidebar";
import { CABINET_ROUTES } from "../../_components/cabinet-seed";
import { LK_ROLES, LK_USER, lkIdentity, lkShortName, isSelfRole, type LkRole } from "./lk-data";
import "./lk-sidebar.css";

/**
 * LkSidebar — персональный сайдбар личного кабинета (Figma «menu full» 1919:723651).
 * Общая только рейка воркспейсов 1-7; панель — персональная: карточка пользователя
 * (разделённая как DeptCard), красный дропдаун роли (Пред. правления ↔ Пайщик,
 * переключает URL), «Деятельность» + кошелёк/голосование. Пункты меню ведут на
 * СВОИ экраны ЛК (не на подразделение). Футер (профиль снизу) → первое подразделение.
 */

/** Палитра карточки по цвету рейки подразделения (та же, что у DeptCard). */
type CardTint = (typeof CARD_TINT)[MenuBadgeColor];

const WORKSPACES: { label: string; color: MenuBadgeColor }[] = [
  { label: "1", color: "red" },
  { label: "2", color: "orange" },
  { label: "3", color: "yellow" },
  { label: "4", color: "green" },
  { label: "5", color: "blue" },
  { label: "6", color: "blue-strong" },
  { label: "7", color: "purple" },
  { label: "8", color: "cyan" },
];

/** Карточка пользователя — 1:1 структура DeptCard (полоса-обложка + аватар на
 *  границе + имя на белом). Текущая → рамка цвета подразделения. */
function UserCard({ role, active, tint }: { role: LkRole; active: boolean; tint: CardTint }) {
  const me = lkIdentity(role);
  return (
    <div
      className="flex w-full flex-col gap-2 overflow-hidden rounded-[4px] border border-border bg-surface pb-2 transition-colors hover:border-[color:var(--lk-hover)]"
      style={{
        ...(active ? { borderColor: tint.border, backgroundColor: tint.bg } : null),
        ["--lk-hover" as string]: tint.border,
      } as React.CSSProperties}
    >
      <div className="relative h-[88px]">
        <div
          className="h-[57px] rounded-t-[3px] bg-cover bg-center"
          style={{ backgroundImage: `url("${me.cover}")` }}
        />
        <div className="absolute bottom-0 left-1/2 size-[72px] -translate-x-1/2 overflow-hidden rounded-full border-2 border-[#fff] bg-surface-muted">
          <img src={me.avatar} alt="" className="size-full object-cover" />
        </div>
      </div>
      <div className="flex flex-col items-center px-2 text-center">
        <span className="ds-caption-medium text-foreground">{lkShortName(role)}</span>
      </div>
    </div>
  );
}

/** Карточка человека из коллектива — как UserCard, но с должностью и «Подписаться»
 *  (это не я, а подчинённый: на него можно подписаться, но не редактировать). */
function PersonCard({ role, active, tint, onOpen }: { role: LkRole; active: boolean; tint: CardTint; onOpen: () => void }) {
  const me = lkIdentity(role);
  return (
    <div
      className="flex w-full flex-col gap-2 overflow-hidden rounded-[4px] border border-border bg-surface pb-3 transition-colors hover:border-[color:var(--lk-hover)]"
      style={{
        ...(active ? { borderColor: tint.border, backgroundColor: tint.bg } : null),
        ["--lk-hover" as string]: tint.border,
      } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="Профиль"
        className="cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        <div className="relative h-[88px]">
          <div
            className="h-[57px] rounded-t-[3px] bg-cover bg-center"
            style={{ backgroundImage: `url("${me.cover}")` }}
          />
          <div className="absolute bottom-0 left-1/2 size-[72px] -translate-x-1/2 overflow-hidden rounded-full border-2 border-[#fff] bg-surface-muted">
            <img src={me.avatar} alt="" className="size-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-2 pt-1 text-center">
          <span className="ds-caption-medium text-foreground">{lkShortName(role)}</span>
          <span className="ds-caption text-foreground-subtle">{LK_ROLES[role].short}</span>
        </div>
      </button>
      <div className="px-2 text-center">
        <span className="ds-caption-medium text-primary">Подписаться</span>
      </div>
    </div>
  );
}

export function LkSidebar({ role, current = "profile", panelHidden = false, from }: { role: LkRole; current?: "profile" | "activity" | "voting" | "accounts"; panelHidden?: boolean; from?: string }) {
  const router = useRouter();
  const cfg = LK_ROLES[role];
  // `from` — подразделение, из коллектива которого открыли человека: задаёт
  // палитру страницы и сохраняется в ссылках ЛК, чтобы цвет не терялся.
  const tint = CARD_TINT[railColorOf(from)];
  const qs = from ? `?from=${from}` : "";
  const lkBase = `/cabinet/lk/${role}`;
  const back = () => router.push(CABINET_ROUTES.subdivision);
  // Нижний футер = залогиненный пользователь. Чужой кабинет открывает
  // председатель, поэтому в футере он остаётся собой (пред. правления).
  const self = isSelfRole(role);
  const footerRole: LkRole = self ? role : "chair";

  return (
    <SidebarShell desktopClassName="sticky top-0 z-30 hidden h-screen shrink-0 lg:flex">
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
        {WORKSPACES.map((w) => {
          const href = railHref(w.label);
          return (
            <MenuBadge
              key={w.label}
              color={w.color}
              onClick={href ? () => router.push(href) : undefined}
            >
              {w.label}
            </MenuBadge>
          );
        })}
      </MenuRail>

      {/* Панель скрывается при раскрытии чата → чат доходит до рейки. */}
      {!panelHidden && (
      <MenuPanel
        className="lk-panel"
        height="100vh"
        footer={
          <MenuFooter
            avatar={lkIdentity(footerRole).avatar}
            active
            role="button"
            tabIndex={0}
            onClick={back}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); back(); } }}
            className="cursor-pointer"
          >
            {LK_ROLES[footerRole].short}
          </MenuFooter>
        }
      >
        {!self ? (
          <>
            {/* Чужая страница — упрощённая панель: назад в свой кабинет,
                карточка с «Подписаться», только Деятельность + Счета. */}
            <Button
              variant="ghost"
              size="s"
              aria-label="Назад"
              onClick={() => router.push("/cabinet/lk/chair")}
              icon={
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />

            <PersonCard role={role} active={current === "profile"} tint={tint} onOpen={() => router.push(`${lkBase}${qs}`)} />

            <MenuButton
              icon={<CabinetMenuIcon.Activity className={cn("h-[13px] w-4", current === "activity" ? "text-primary" : "text-[var(--color-grey-300)]")} />}
              className={cn(current === "activity" && "text-primary")}
              onClick={() => router.push(`${lkBase}/activity${qs}`)}
            >
              Деятельность
            </MenuButton>
            <MenuButton
              icon={<WalletFilledIcon className={cn("size-4", current === "accounts" ? "text-primary" : "text-[var(--color-grey-300)]")} />}
              className={cn(current === "accounts" && "text-primary")}
              onClick={() => router.push(`${lkBase}/account${qs}`)}
            >
              Счета
            </MenuButton>

            <MenuDivider />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => router.push(`${lkBase}${qs}`)}
              className="w-full cursor-pointer border-0 bg-transparent p-0"
              aria-label="Профиль"
            >
              <UserCard role={role} active={current === "profile"} tint={tint} />
            </button>

            {/* Красный дропдаун роли — переключает обязательства (Пред. ↔ Пайщик). */}
            <Dropdown
              aria-label="Роль"
              value={role}
              items={[
                { value: "chair", label: LK_ROLES.chair.full },
                { value: "payer", label: LK_ROLES.payer.full },
              ]}
              onSelect={(v) => { if (v !== role) router.push(`/cabinet/lk/${v}${current === "activity" ? "/activity" : ""}`); }}
              trigger={
                <MenuButton variant="role" trailingIcon={<MenuIcon.ChevronDown />}>
                  {cfg.short}
                </MenuButton>
              }
            />

            <MenuButton
              icon={<CabinetMenuIcon.Activity className={cn("h-[13px] w-4", current === "activity" ? "text-primary" : "text-[var(--color-grey-300)]")} />}
              className={cn(current === "activity" && "text-primary")}
              onClick={() => router.push(`${lkBase}/activity${qs}`)}
            >
              Деятельность
            </MenuButton>

            <MenuButtonRow>
              <MenuButton
                variant="icon"
                className={cn(current === "accounts" ? "text-primary" : "text-[var(--color-grey-300)]")}
                icon={<WalletFilledIcon className="size-4" />}
                aria-label="Счета"
                onClick={() => router.push(`${lkBase}/account${qs}`)}
              />
              <MenuButton
                variant="icon"
                className={cn(current === "voting" ? "text-primary" : "text-[var(--color-grey-300)]")}
                icon={<VotingCheckIcon className="size-4" />}
                aria-label="Вопросы голосования"
                onClick={() => router.push(`${lkBase}/voting`)}
              />
            </MenuButtonRow>

            <MenuDivider />
          </>
        )}
      </MenuPanel>
      )}
    </SidebarShell>
  );
}
