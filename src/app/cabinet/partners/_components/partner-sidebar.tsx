"use client";

import { useRouter } from "next/navigation";
import {
  MenuRail,
  MenuBadge,
  MenuPanel,
  MenuFooter,
  MenuIcon,
  Button,
  type MenuBadgeColor,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { SidebarShell } from "@/components/ds/composite/sidebar-shell";
import { RAIL_WORKSPACES } from "../../[company]/_config/cabinet-rail";
import { type Partner } from "./partners-data";

/**
 * PartnerSidebar — контекстный сайдбар экрана партнёра (Figma 1857:649858 …).
 * Рейка воркспейсов (как CoopRail) + панель: кнопка «назад» к списку, мини-карточка
 * партнёра (обои + аватар как в списке, подсвечена в режиме профиля) и кнопка
 * «Счёт» (ghost) для режима счёта.
 *
 * Reuse DS: MenuRail · MenuBadge · MenuPanel · MenuFooter · MenuIcon · Button (ghost).
 * Скрыт на <lg (моб./планшет).
 */

/** Аватар представителя в футере — как в основном сайдбаре (CoopSidebar). */
const FOOTER_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#e8edf2"/><circle cx="32" cy="25" r="11" fill="#b1becb"/><path d="M13 60c0-12 9-19 19-19s19 7 19 19z" fill="#b1becb"/></svg>`,
  );

function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <g>
        <path d="M3.7399 2.92359L10.1182 1.18258L9.78042 0.499836C9.55942 0.0560497 9.02041 -0.127214 8.57662 0.0937805L2.8667 2.92359H3.7399Z" fill="currentColor" />
        <path d="M12.095 1.2334C12.016 1.2334 11.9369 1.24418 11.8579 1.26574L10.3594 1.67539L5.7832 2.92409H10.9775H13.2413L12.961 1.89638C12.8532 1.49572 12.4903 1.2334 12.095 1.2334Z" fill="currentColor" />
        <path d="M14.1796 3.55273H13.9748H13.6963H13.4178H11.2923H3.48201H2.45789H1.59547H1.43557H0.900149C0.616269 3.55273 0.362934 3.68389 0.197637 3.89051C0.122176 3.98574 0.0646814 4.09534 0.0323407 4.21572C0.0125769 4.29118 0 4.37023 0 4.45109V4.55889V5.58301V14.4605C0 14.9564 0.402462 15.3589 0.898352 15.3589H14.1778C14.6737 15.3589 15.0761 14.9564 15.0761 14.4605V11.9541H9.74532C8.90267 11.9541 8.21812 11.2696 8.21812 10.4269V9.60403V9.32554V9.04705V8.42899C8.21812 8.01575 8.3834 7.64025 8.65113 7.36536C8.8883 7.12099 9.20631 6.95569 9.56206 6.91437C9.62135 6.9072 9.68244 6.90359 9.74353 6.90359H14.3287H14.6072H14.8857H15.0761V4.45109C15.0779 3.9552 14.6755 3.55273 14.1796 3.55273Z" fill="currentColor" />
        <path d="M15.7055 7.76172C15.6157 7.67907 15.5097 7.61618 15.3911 7.57486C15.2994 7.54433 15.2024 7.52637 15.1 7.52637H15.0766H15.0587H14.7802H13.7758H9.74405C9.24815 7.52637 8.8457 7.92881 8.8457 8.42472V8.87208V9.15057V9.42906V10.4244C8.8457 10.9203 9.24815 11.3228 9.74405 11.3228H15.0766H15.1C15.2024 11.3228 15.2994 11.3048 15.3911 11.2743C15.5097 11.2347 15.6157 11.1701 15.7055 11.0874C15.8852 10.9239 15.9984 10.6868 15.9984 10.4245V8.42472C15.9984 8.16238 15.8852 7.9252 15.7055 7.76172ZM11.6198 9.60334C11.6198 9.85128 11.4186 10.0525 11.1706 10.0525H10.8724C10.6244 10.0525 10.4232 9.85128 10.4232 9.60334V9.30509C10.4232 9.16135 10.4897 9.03377 10.5957 8.95291C10.6729 8.89362 10.7682 8.85591 10.8724 8.85591H10.9478H11.1706C11.4186 8.85591 11.6198 9.05712 11.6198 9.30509V9.60334Z" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Мини-карточка партнёра в панели (как DeptCard, режим «выбран»). */
function PartnerMiniCard({ partner, active, onClick }: { partner: Partner; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-2 overflow-hidden rounded-[4px] border bg-surface pb-2 text-left transition-colors",
        active ? "border-[#e8a0a8] bg-[#fdf3f4]" : "border-border",
      )}
    >
      <div className="relative h-[80px]">
        <div className="h-[57px] overflow-hidden rounded-t-[3px]">
          <img src={partner.cover} alt="" className="size-full object-cover" />
        </div>
        <div className="absolute bottom-0 left-1/2 size-[72px] -translate-x-1/2 overflow-hidden rounded-full border-2 border-[#fff] bg-surface-muted">
          <img src={partner.avatar} alt="" className="size-full object-cover" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5 px-2 text-center">
        <span className="ds-caption-medium line-clamp-1 text-foreground">{partner.title}</span>
        <span className="ds-caption text-foreground-subtle">Партнер</span>
        <span className="ds-caption text-primary">Подписаться</span>
      </div>
    </button>
  );
}

export function PartnerSidebar({
  partner,
  view,
  onView,
  onBack,
}: {
  partner: Partner;
  view: "profile" | "account";
  onView: (v: "profile" | "account") => void;
  onBack: () => void;
}) {
  const router = useRouter();
  return (
    <SidebarShell>
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
        {RAIL_WORKSPACES.map((w) => (
          <MenuBadge key={w.label} color={w.color} active={w.label === "1"}>
            {w.label}
          </MenuBadge>
        ))}
      </MenuRail>

      <MenuPanel
        height="100vh"
        footer={<MenuFooter avatar={FOOTER_AVATAR}>Представитель</MenuFooter>}
      >
        {/* Назад к списку партнёров */}
        <button
          type="button"
          aria-label="Назад к партнёрам"
          onClick={onBack}
          className="flex size-7 items-center justify-center self-start rounded-[4px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground"
        >
          <BackIcon />
        </button>

        <PartnerMiniCard partner={partner} active={view === "profile"} onClick={() => onView("profile")} />

        <Button
          variant="ghost"
          size="m"
          fullWidth
          iconLeft={<WalletIcon />}
          aria-pressed={view === "account"}
          onClick={() => onView("account")}
          className={cn(
            view === "account" &&
              "!border-[var(--color-blue-midhub-200)] !bg-[var(--color-blue-midhub-50)] !text-primary",
          )}
        >
          Счет
        </Button>
      </MenuPanel>
    </SidebarShell>
  );
}
