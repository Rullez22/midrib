"use client";

import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * LeftMenu — левое меню / сайдбар (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / menu:
 *   menu full validator 2115:233056 · menu 1 1118:96768 ·
 *   menu 2 1272:133860 · smallmenu 1116:98990 · 1586:245446 ·
 *   1676:234159 · профиль 1116:98961 · admin 1116:98967 ·
 *   профиль 2 1684:238673 · 1368:162112 · 1118:96985. Стили 1:1.
 *
 * Двухколоночный сайдбар:
 *   • <MenuRail>  — узкая рейка 60px: лого/КП-бейдж + цветные
 *                   номер-бейджи (рабочие пространства) + футер.
 *   • <MenuPanel> — раскрытая колонка ~160px: <MenuProfileCard>,
 *                   <MenuButton>, <MenuNavItem>, <MenuFooter>.
 *
 * <LeftMenu> просто ставит рейку и панель встык (web-first).
 * Под-компоненты экспортируются отдельно для гибкой компоновки.
 *
 * Палитра бейджей повторяет {@link SidemenuColor}.
 *
 * @example
 *   <LeftMenu>
 *     <MenuRail
 *       footer={<MenuFooter>Admin</MenuFooter>}
 *       brand={<MenuBadge brand>◎</MenuBadge>}
 *     >
 *       <MenuBadge color="red" active>1</MenuBadge>
 *       <MenuBadge color="orange">2</MenuBadge>
 *     </MenuRail>
 *     <MenuPanel footer={<MenuFooter avatar="/u.jpg">Пред. правления</MenuFooter>}>
 *       <MenuProfileCard name="Immatra" meta="150 пайщиков" />
 *       <MenuNavItem icon={<MenuIcon.Megaphone />} active>Реферальная</MenuNavItem>
 *     </MenuPanel>
 *   </LeftMenu>
 */

/* ── Палитра цветных бейджей рейки (токены MIDHUB) ──────────────── */
export type MenuBadgeColor =
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "blue-strong"
  | "purple"
  | "red"
  | "cyan";

/** Цвета бейджей рейки 1–8 — источник палитры подразделений: от них наследуют
 *  цвет элементы, привязанные к подразделению (напр. иконка структуры в ЦКП). */
export const BADGE_COLOR_VAR: Record<MenuBadgeColor, string> = {
  orange: "var(--color-orange-200)",
  yellow: "var(--color-yellow-300)",
  green: "var(--color-green-200)",
  blue: "var(--color-blue-midhub-200)",
  "blue-strong": "var(--color-blue-midhub-300)",
  purple: "var(--color-purple-200)",
  red: "var(--color-red-200)",
  cyan: "var(--color-cyan-200)",
};

/* ============================================================
   LeftMenu — корневой контейнер (рейка + панель встык)
   ============================================================ */
export interface LeftMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function LeftMenu({ className, children, ...rest }: LeftMenuProps) {
  return (
    <div className={cn("ds-lm", className)} {...rest}>
      {children}
    </div>
  );
}

/* ============================================================
   MenuRail — узкая колонка с бейджами (60px)
   ============================================================ */
export interface MenuRailProps extends HTMLAttributes<HTMLDivElement> {
  /** Бренд-марка или активный КП-бейдж в самом верху рейки. */
  brand?: ReactNode;
  /** Цветные номер-бейджи рабочих пространств. */
  children?: ReactNode;
  /** Футер-ячейка (например <MenuFooter>Admin</MenuFooter>). */
  footer?: ReactNode;
  /** Высота рейки (CSS). По умолчанию тянется по контейнеру. */
  height?: string;
}

export function MenuRail({
  brand,
  children,
  footer,
  height,
  className,
  style,
  ...rest
}: MenuRailProps) {
  return (
    <div
      className={cn("ds-lm-rail", className)}
      style={height ? { ...style, height } : style}
      {...rest}
    >
      <div className="ds-lm-rail__list" role="tablist" aria-orientation="vertical">
        {brand}
        {children}
      </div>
      {footer}
    </div>
  );
}

/* ============================================================
   MenuBadge — бейдж рабочего пространства (32, rounded-4)
   ============================================================ */
export interface MenuBadgeProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Цвет заливки из палитры. По умолчанию grey-100. */
  color?: MenuBadgeColor;
  /** Активный бейдж — синяя заливка + кольцо-обводка. */
  active?: boolean;
  /** Бренд-марка (прозрачный фон, без заливки). */
  brand?: boolean;
  children?: ReactNode;
}

export function MenuBadge({
  color,
  active = false,
  brand = false,
  className,
  style,
  children,
  type = "button",
  ...rest
}: MenuBadgeProps) {
  const fill =
    active && !color
      ? undefined
      : color
        ? BADGE_COLOR_VAR[color]
        : undefined;
  return (
    <button
      type={type}
      role="tab"
      aria-selected={active}
      className={cn(
        "ds-lm-badge",
        active && "ds-lm-badge--active",
        brand && "ds-lm-badge--brand",
        className,
      )}
      style={
        fill ? ({ ...style, "--badge-color": fill } as CSSProperties) : style
      }
      {...rest}
    >
      {children}
    </button>
  );
}

/* ============================================================
   MenuPanel — раскрытая колонка
   ============================================================ */
export interface MenuPanelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Футер-ячейка панели. */
  footer?: ReactNode;
  /** Ширина панели (CSS). По умолчанию 161px. */
  width?: string;
  /** Высота панели (CSS). По умолчанию тянется по контейнеру. */
  height?: string;
}

export function MenuPanel({
  children,
  footer,
  width,
  height,
  className,
  style,
  ...rest
}: MenuPanelProps) {
  const vars: CSSProperties = { ...style };
  if (width) (vars as Record<string, string>)["--lm-panel-w"] = width;
  if (height) vars.height = height;
  return (
    <div className={cn("ds-lm-panel", className)} style={vars} {...rest}>
      <div className="ds-lm-panel__body">{children}</div>
      {footer}
    </div>
  );
}

/* ============================================================
   MenuProfileCard — профиль-карточка (cover + аватар + имя)
   ============================================================ */
export interface MenuProfileCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Имя организации/пространства. */
  name: ReactNode;
  /** Подпись (например «150 пайщиков»). */
  meta?: ReactNode;
  /** URL обложки. По умолчанию — градиент-плейсхолдер. */
  cover?: string;
  /** URL аватара. Если не задан — текстовый фолбэк с именем. */
  avatar?: string;
}

export function MenuProfileCard({
  name,
  meta,
  cover,
  avatar,
  className,
  ...rest
}: MenuProfileCardProps) {
  return (
    <div className={cn("ds-lm-profile", className)} {...rest}>
      <div
        className="ds-lm-profile__cover"
        style={cover ? { backgroundImage: `url("${cover}")` } : undefined}
      >
        <div className="ds-lm-profile__avatar">
          {avatar ? (
            <img src={avatar} alt="" />
          ) : (
            <span className="ds-lm-profile__avatar-fallback">{name}</span>
          )}
        </div>
      </div>
      <div className="ds-lm-profile__content">
        <p className="ds-lm-profile__name">{name}</p>
        {meta != null && <p className="ds-lm-profile__meta">{meta}</p>}
      </div>
    </div>
  );
}

/* ============================================================
   MenuButton — кнопка панели (Деятельность / роль / иконная)
   ============================================================ */
export interface MenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Иконка слева (16×16). */
  icon?: ReactNode;
  /** Иконка справа (16×16) — например chevron у роли. */
  trailingIcon?: ReactNode;
  /** Вариант: solid (grey-20) · role (красный дропдаун) · icon (квадрат). */
  variant?: "solid" | "role" | "icon";
  children?: ReactNode;
}

export function MenuButton({
  icon,
  trailingIcon,
  variant = "solid",
  className,
  children,
  type = "button",
  "aria-label": ariaLabel,
  ...rest
}: MenuButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cn(
        "ds-lm-btn",
        variant === "role" && "ds-lm-btn--role",
        variant === "icon" && "ds-lm-btn--icon",
        className,
      )}
      {...rest}
    >
      {icon != null && <span className="ds-lm-btn__icon" aria-hidden>{icon}</span>}
      {children != null && <span>{children}</span>}
      {trailingIcon != null && (
        <span className="ds-lm-btn__icon" aria-hidden>{trailingIcon}</span>
      )}
    </button>
  );
}

/** Ряд квадратных иконных кнопок панели. */
export function MenuButtonRow({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("ds-lm-btn-row", className)} {...rest}>
      {children}
    </div>
  );
}

/* ============================================================
   MenuNavItem — навигационный пункт (иконка + подпись)
   ============================================================ */
export interface MenuNavItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Иконка слева (24×24). */
  icon?: ReactNode;
  /** Активный пункт — синяя подпись и иконка. */
  active?: boolean;
  children?: ReactNode;
}

export function MenuNavItem({
  icon,
  active = false,
  className,
  children,
  type = "button",
  ...rest
}: MenuNavItemProps) {
  return (
    <button
      type={type}
      aria-current={active ? "page" : undefined}
      className={cn("ds-lm-nav", active && "ds-lm-nav--active", className)}
      {...rest}
    >
      {icon != null && <span className="ds-lm-nav__icon" aria-hidden>{icon}</span>}
      <span className="ds-lm-nav__label">{children}</span>
    </button>
  );
}

/** Разделитель между группами пунктов навигации. */
export function MenuDivider({ className, ...rest }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("ds-lm-divider", className)} {...rest} />;
}

/* ============================================================
   MenuFooter — футер-ячейка (Admin / пользователь)
   ============================================================ */
export interface MenuFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** URL аватара слева (32×32). Без него — только подпись. */
  avatar?: string;
  /** Розовое кольцо вокруг аватара (как у «Пред. правления» в Figma). */
  avatarRing?: boolean;
  /** Активная ячейка — заливка grey-20 (текущий раздел = профиль пользователя). */
  active?: boolean;
  children?: ReactNode;
}

export function MenuFooter({
  avatar,
  avatarRing = false,
  active = false,
  className,
  children,
  ...rest
}: MenuFooterProps) {
  return (
    <div
      className={cn("ds-lm-foot", active && "ds-lm-foot--active", className)}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {avatar != null && (
        <span
          className={cn("ds-lm-foot__avatar", avatarRing && "ds-lm-foot__avatar--ring")}
          aria-hidden
        >
          <img src={avatar} alt="" />
        </span>
      )}
      {children != null && <span>{children}</span>}
    </div>
  );
}

/* ============================================================
   MenuIcon — набор иконок меню (inline SVG, тон — currentColor).
   Перерисованы из растровых экспортов Figma в чистый SVG, чтобы
   DS не зависел от временных asset-URL Figma (живут 7 дней).
   24px — для nav-пунктов, 16px — для кнопок панели.
   ============================================================ */
type IconProps = { className?: string };

const ChevronDown = (p: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Hierarchy = (p: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <rect x="6" y="1.5" width="4" height="3.2" rx="1" fill="currentColor" />
    <rect x="1.5" y="11.3" width="4" height="3.2" rx="1" fill="currentColor" />
    <rect x="10.5" y="11.3" width="4" height="3.2" rx="1" fill="currentColor" />
    <path d="M8 4.7v3M8 7.7H3.5v3.6M8 7.7h4.5v3.6" stroke="currentColor"
      strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Wallet = (p: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <rect x="1.6" y="3.6" width="12.8" height="9.4" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M11 8.3h2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="11" cy="8.3" r="0.9" fill="currentColor" />
    <path d="M1.6 6.2h9.5c.7 0 1.3.6 1.3 1.3" stroke="currentColor" strokeWidth="1.3"
      strokeLinecap="round" />
  </svg>
);

const ClipboardCheck = (p: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <rect x="3" y="2.6" width="10" height="11.4" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <rect x="5.5" y="1.4" width="5" height="2.6" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5.8 9l1.5 1.5L10.3 7.3" stroke="currentColor" strokeWidth="1.3"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Мегафон «Реферальная» — пути 1:1 из Figma (2478:355833 / megaphone),
// fill → currentColor (синий active / grey-300 default).
const Megaphone = (p: IconProps) => (
  <svg viewBox="0 0 22 22.9524" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    {/* вертикальный флип — как трансформ группы в Figma (-rotate-180 -scale-x-100) */}
    <g transform="translate(0 22.9524) scale(1 -1)">
    <path fill="currentColor" d="M15.5994 19.0675C15.33 19.1286 14.9859 19.1275 14.7824 19.0533C14.6951 19.0236 13.1931 18.1587 11.4499 17.133L8.27741 15.2721L7.10949 15.2612C5.76112 15.2481 5.3233 15.178 4.85204 14.9026C4.43329 14.6555 4.18939 14.4096 3.9277 13.9674C3.64825 13.4982 3.55738 13.1613 3.55873 12.6042C3.56791 11.6986 3.90977 11.0047 4.60581 10.4891C5.00564 10.1924 5.36864 10.0456 5.82072 9.99026C6.06862 9.96271 6.13713 9.94185 6.14532 9.8881C6.15004 9.85114 6.17114 8.66199 6.19037 7.24192C6.21753 5.45873 6.24554 4.58909 6.29491 4.4067C6.42933 3.89755 6.77394 3.4727 7.18528 3.30384C7.85618 3.0369 8.49888 3.1464 8.98011 3.61355C9.23076 3.85504 9.38376 4.11719 9.45118 4.44045C9.4785 4.54823 9.48345 5.69608 9.46392 6.9906C9.44438 8.28513 9.44873 9.35114 9.4745 9.35355C9.49689 9.35817 10.2842 8.93729 11.2202 8.41873C14.7726 6.46541 14.8648 6.41445 15.1352 6.37695C15.9643 6.26235 16.7878 6.83819 17.3536 7.92687C18.8859 10.8758 18.5395 16.2931 16.6858 18.3437C16.3911 18.668 15.9071 18.991 15.5994 19.0675ZM16.2082 17.6613C16.9766 16.6967 17.4981 14.7384 17.512 12.7512C17.5314 10.5958 17.1804 9.06124 16.4383 8.02074C16.0306 7.45206 15.6733 7.23231 15.2013 7.25729C14.9064 7.27221 14.7117 7.38081 14.4566 7.66948C13.3737 8.89888 12.8176 11.7021 13.1289 14.3752C13.2753 15.6573 13.608 16.7299 14.0886 17.4683C14.4227 17.9839 14.6479 18.1792 15.0061 18.2533C15.4651 18.3481 15.79 18.1877 16.2082 17.6613ZM12.7876 16.5487C11.9909 14.2334 12.0693 10.9317 12.9661 8.66871C13.047 8.46074 13.0917 8.30074 13.0625 8.31512C12.7961 8.43223 8.85986 10.633 8.85291 10.6666C8.84116 10.7517 8.79084 14.567 8.80175 14.613C8.81266 14.659 12.9609 17.136 12.9678 17.1024C12.9702 17.0913 12.8899 16.8441 12.7876 16.5487ZM8.0219 12.8235C8.03553 11.9246 8.04647 11.0952 8.05166 10.9854L8.05519 10.7848L7.06666 10.7672C6.52308 10.757 5.97266 10.7658 5.84924 10.784C5.11433 10.8948 4.55716 11.4303 4.40213 12.1804C4.17894 13.246 4.79585 14.2285 5.80911 14.4088C5.96361 14.4378 7.99211 14.4923 7.99673 14.47C7.99789 14.4644 8.00827 13.7224 8.0219 12.8235ZM8.66738 7.27243C8.68748 5.89048 8.69516 4.69564 8.67884 4.61931C8.60098 4.17717 8.08176 3.86558 7.62699 3.99044C7.40467 4.04954 7.17128 4.26101 7.08582 4.4768C6.99458 4.72057 6.90922 9.97596 7.00118 9.96871C7.0337 9.96668 7.35089 9.97096 7.70166 9.98218C8.29339 9.99944 8.35061 9.99084 8.48463 9.89306L8.62878 9.78862L8.66738 7.27243Z" />
    <path fill="currentColor" d="M15.1375 14.7534C14.8454 14.8536 14.3642 14.9087 14.239 14.8508C14.1798 14.8269 14.0962 14.7512 14.0496 14.6803C13.9852 14.5824 13.9777 14.5195 14.0099 14.392C14.0663 14.176 14.1867 14.1017 14.5377 14.0692C14.7968 14.0439 14.8418 14.0241 15.139 13.8287C15.4159 13.6466 15.4813 13.5843 15.5765 13.4201C15.8995 12.8741 15.801 12.1505 15.3441 11.735C15.0711 11.4889 14.9235 11.4263 14.4095 11.3434C14.1475 11.298 14.0175 11.1223 14.0684 10.8761C14.1309 10.5738 14.3645 10.5025 14.9063 10.6203C16.1655 10.8951 16.9085 12.3123 16.4211 13.513C16.2036 14.0429 15.6554 14.5774 15.1375 14.7534Z" />
    </g>
  </svg>
);

// Пайщики — две фигуры (Figma «add-contact», fill → currentColor).
const Users = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M8.47461 5.9502C10.108 5.9502 11.4365 7.27873 11.4365 8.91211C11.4365 10.5455 10.108 11.874 8.47461 11.874C6.84127 11.874 5.5127 10.5455 5.5127 8.91211C5.51274 7.27875 6.8413 5.95024 8.47461 5.9502ZM8.47461 6.74902C7.28192 6.74907 6.31157 7.71942 6.31152 8.91211C6.31152 10.1048 7.28189 11.0752 8.47461 11.0752C9.66736 11.0752 10.6377 10.1049 10.6377 8.91211C10.6377 7.71939 9.66734 6.74902 8.47461 6.74902Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
    <path d="M16.1621 5.9502C17.7955 5.9502 19.124 7.27873 19.124 8.91211C19.124 10.5455 17.7955 11.874 16.1621 11.874C14.5288 11.874 13.2002 10.5455 13.2002 8.91211C13.2002 7.27875 14.5288 5.95024 16.1621 5.9502ZM16.1621 6.74902C14.9694 6.74907 13.9991 7.71942 13.999 8.91211C13.999 10.1048 14.9694 11.0752 16.1621 11.0752C17.3549 11.0752 18.3252 10.1049 18.3252 8.91211C18.3252 7.71939 17.3548 6.74902 16.1621 6.74902Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
    <path d="M8.47461 13.1257C11.521 13.1257 13.9998 15.6037 14 18.6501C14 18.8707 13.8211 19.0494 13.6006 19.0495C13.38 19.0495 13.2012 18.8707 13.2012 18.6501C13.201 16.0443 11.0804 13.9245 8.47461 13.9245C5.86896 13.9247 3.74919 16.0444 3.74902 18.6501C3.74902 18.8707 3.57015 19.0494 3.34961 19.0495C3.129 19.0495 2.9502 18.8707 2.9502 18.6501C2.95036 15.6038 5.42834 13.1258 8.47461 13.1257Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
    <path d="M15.6973 12.7413C18.7436 12.7414 21.2215 15.2194 21.2217 18.2657C21.2217 18.4864 21.0429 18.6652 20.8223 18.6652C20.6018 18.665 20.4229 18.4863 20.4229 18.2657C20.4227 15.66 18.303 13.5402 15.6973 13.5402C14.4177 13.5402 13.2552 14.0511 12.4033 14.88C12.3948 14.8883 12.3843 14.8947 12.376 14.9025C12.4029 15.0022 12.4189 15.1253 12.4189 15.2755C12.4189 15.3094 12.4084 15.3396 12.3877 15.3634C12.3675 15.3866 12.3411 15.3992 12.3154 15.4054C12.2657 15.4173 12.2078 15.4087 12.1621 15.3956C12.1385 15.3889 12.1157 15.3806 12.0967 15.3712C12.0791 15.3625 12.06 15.3506 12.0469 15.3361C12.0406 15.3291 12.03 15.315 12.0283 15.296C12.0263 15.2726 12.0383 15.2541 12.0527 15.2433C12.0603 15.2377 12.0695 15.2359 12.0771 15.2335C12.0769 15.1853 12.0753 15.1443 12.0742 15.1095C12.0723 15.1122 12.0689 15.117 12.0635 15.1212C12.058 15.1254 12.0466 15.1321 12.0312 15.132C12.0178 15.1317 12.0074 15.1262 12 15.1202C11.9682 15.12 11.9383 15.1128 11.9121 15.0968C11.8585 15.064 11.8318 15.0046 11.8193 14.9474C11.8067 14.8891 11.8065 14.8235 11.8135 14.7638C11.8181 14.7246 11.8276 14.6863 11.8379 14.6525C11.8072 14.6596 11.7768 14.6693 11.7471 14.6798C11.6858 14.7014 11.6312 14.7267 11.5908 14.7462C11.5713 14.7556 11.553 14.7652 11.54 14.7706C11.5341 14.7731 11.5257 14.7757 11.5176 14.7775C11.5141 14.7782 11.5042 14.7807 11.4932 14.7784C11.487 14.7771 11.478 14.7738 11.4697 14.7667C11.4607 14.759 11.4554 14.7486 11.4531 14.7384C11.4494 14.7214 11.4555 14.7077 11.457 14.7042C11.4594 14.6989 11.4627 14.6946 11.4648 14.6915C11.4694 14.685 11.475 14.6772 11.4814 14.67C11.4946 14.6554 11.5152 14.6353 11.542 14.6085C11.5955 14.5552 11.6819 14.4706 11.8057 14.3478C12.8049 13.3555 14.181 12.7413 15.6973 12.7413ZM12.0547 14.6818C12.0633 14.7306 12.0685 14.7942 12.0723 14.8751C12.0745 14.874 12.0765 14.8721 12.0791 14.8712C12.0927 14.8664 12.1089 14.8671 12.123 14.8741C12.1352 14.8802 12.1425 14.8895 12.1465 14.8956C12.1542 14.9075 12.1585 14.9219 12.1611 14.9337C12.1622 14.9383 12.1612 14.9438 12.1621 14.9493C12.192 14.9287 12.2242 14.9022 12.2607 14.8702C12.2239 14.7702 12.1739 14.7115 12.1201 14.6788C12.0966 14.6646 12.0711 14.6541 12.0449 14.6476C12.0474 14.6584 12.0525 14.6695 12.0547 14.6818Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
  </svg>
);

// Партнёры — три фигуры (Figma «statistic / user-2», fill → currentColor).
const Partners = (p: IconProps) => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M9.00085 3.1311C7.49044 3.1311 6.26172 4.35979 6.26172 5.87024C6.26172 7.3807 7.4904 8.60939 9.00085 8.60939C10.5113 8.60939 11.74 7.38067 11.74 5.87024C11.74 4.35982 10.5113 3.1311 9.00085 3.1311ZM9.00085 7.82675C7.92243 7.82675 7.04435 6.94867 7.04435 5.87024C7.04435 4.79182 7.92243 3.91374 9.00085 3.91374C10.0793 3.91374 10.9574 4.79182 10.9574 5.87024C10.9574 6.94867 10.0793 7.82675 9.00085 7.82675Z" fill="currentColor" />
    <path d="M14.4799 6.26013C13.4015 6.26013 12.5234 7.13822 12.5234 8.21663C12.5234 9.29505 13.4015 10.1731 14.4799 10.1731C15.5584 10.1731 16.4365 9.29505 16.4365 8.21663C16.4365 7.13822 15.5584 6.26013 14.4799 6.26013ZM14.4799 9.39054C13.8327 9.39054 13.306 8.86386 13.306 8.21663C13.306 7.56941 13.8327 7.04273 14.4799 7.04273C15.1272 7.04273 15.6539 7.56941 15.6539 8.21663C15.6539 8.86386 15.1271 9.39054 14.4799 9.39054Z" fill="currentColor" />
    <path d="M3.5776 6.26019C2.49837 6.26019 1.62109 7.13828 1.62109 8.2167C1.62109 9.29511 2.49918 10.1732 3.5776 10.1732C4.65602 10.1732 5.53411 9.29511 5.53411 8.2167C5.53411 7.13828 4.65679 6.26019 3.5776 6.26019ZM3.5776 9.3906C2.93037 9.3906 2.40369 8.86392 2.40369 8.2167C2.40369 7.56947 2.93037 7.04279 3.5776 7.04279C4.22483 7.04279 4.75151 7.56947 4.75151 8.2167C4.75151 8.86392 4.22479 9.3906 3.5776 9.3906Z" fill="currentColor" />
    <path d="M9.00103 9.3913C6.19615 9.3913 3.91406 11.6734 3.91406 14.4783C3.91406 14.6943 4.08938 14.8696 4.30538 14.8696C4.52138 14.8696 4.6967 14.6943 4.6967 14.4783C4.6967 12.1046 6.62738 10.1739 9.00103 10.1739C11.3747 10.1739 13.3054 12.1046 13.3054 14.4783C13.3054 14.6943 13.4807 14.8696 13.6967 14.8696C13.9127 14.8696 14.088 14.6943 14.088 14.4783C14.088 11.6734 11.8059 9.3913 9.00103 9.3913Z" fill="currentColor" />
    <path d="M14.4772 10.9558C13.8331 10.9558 13.2023 11.1319 12.6529 11.4645C12.469 11.5772 12.4095 11.8175 12.5214 12.0022C12.6349 12.1869 12.8744 12.2456 13.0591 12.1336C13.4856 11.8746 13.9755 11.7384 14.4772 11.7384C15.9876 11.7384 17.2163 12.9671 17.2163 14.4775C17.2163 14.6935 17.3916 14.8689 17.6076 14.8689C17.8236 14.8689 17.9989 14.6935 17.9989 14.4775C17.9989 12.5359 16.4188 10.9558 14.4772 10.9558Z" fill="currentColor" />
    <path d="M5.34523 11.4637C4.79661 11.1319 4.16585 10.9558 3.52174 10.9558C1.58009 10.9558 0 12.5359 0 14.4775C0 14.6935 0.175316 14.8689 0.391316 14.8689C0.607316 14.8689 0.782633 14.6935 0.782633 14.4775C0.782596 12.9671 2.01132 11.7384 3.52174 11.7384C4.0234 11.7384 4.51329 11.8746 4.93905 12.1328C5.12295 12.2448 5.36401 12.1861 5.4767 12.0014C5.5894 11.8167 5.5299 11.5764 5.34523 11.4637Z" fill="currentColor" />
  </svg>
);

const DocText = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M6 3h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M13 3v5h5M8 13h8M8 16.5h5" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocStack = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M8 6h6l4 4v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 6v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M5 4h6l1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" />
    <path d="M9.5 14.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocGrid = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M6 3h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M13 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="7" y="11.5" width="3.5" height="3.5" rx="0.6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M12.5 12.5h3M12.5 15h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

// Фирменный логотип MIDHUB (кольца #252C39 + 3 красные точки #EC1C3D),
// официальный SVG из public/brand (1:1 из Figma 2478:355833 / logo).
const Brand = (p: IconProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/brand/midhub-logo.svg" alt="" className={cn("size-full", p.className)} />
);

export const MenuIcon = {
  ChevronDown,
  Hierarchy,
  Wallet,
  ClipboardCheck,
  Megaphone,
  Users,
  Partners,
  DocText,
  DocStack,
  DocGrid,
  Brand,
};
