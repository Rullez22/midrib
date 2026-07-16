"use client";

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
import { type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { SidebarShell } from "@/components/ds/composite/sidebar-shell";
import { useRegFlow } from "./reg-flow";
import { railHref } from "../../../cabinet/[company]/_config/cabinet-rail";
import { CabinetMenuIcon } from "../../../cabinet/[company]/_components/cabinet-menu-icons";

/**
 * CoopSidebar — левое меню кооператива (рейка с воркспейсами + панель
 * «Пайщики/Партнёры»). Источник: Figma 2422:348051 / 2671:555196.
 * Каркас собран из DS LeftMenu-примитивов. Общий для экранов флоу
 * «Создание компании» (PaishikiScreen, AgreementIntroScreen) — вынесен сюда,
 * чтобы не дублировать разметку.
 *
 * Скрыт на <lg (моб./планшет) — оборачивающий контейнер задаёт `hidden lg:flex`.
 */

const AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#e8edf2"/><circle cx="32" cy="25" r="11" fill="#b1becb"/><path d="M13 60c0-12 9-19 19-19s19 7 19 19z" fill="#b1becb"/></svg>`,
  );

/** Фото текущего пользователя — председателя правления (Антонов Илья Андреевич).
 *  То же фото, что и в карточке коллектива «Деятельности» (activity-screen MEMBERS). */
const USER_PHOTO = "/members/ilya.png";

/** Личный кабинет пользователя — открывается кликом по профилю-футеру из любого
 *  экрана кабинета (как логотип → /cabinet/about). */
const LK_HREF = "/cabinet/lk/chair";

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

/** Иконка «Вопросы голосования» — планшет + галочка-в-кружке (Figma «verify 2»). */
export function VotingCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8.26209 1.33327H7.47991C7.24525 0.566639 6.49151 0 5.59556 0C4.6996 0 3.94586 0.566639 3.71121 1.33327H2.92902C2.63748 1.33327 2.39571 1.55992 2.39571 1.83324V2.83319C2.39571 3.47316 2.95747 3.9998 3.6401 3.9998H7.55102C8.23365 3.9998 8.7954 3.47316 8.7954 2.83319V1.83324C8.7954 1.55992 8.55363 1.33327 8.26209 1.33327Z" />
      <path d="M9.38777 2.39988H9.22307V3.23317C9.22307 4.24646 8.41276 5.06642 7.4114 5.06642H3.78805C2.78669 5.06642 1.97637 4.24646 1.97637 3.23317V2.39988H1.81167C0.810313 2.39988 0 3.21984 0 4.23312V12.566C0 13.5793 0.810313 14.3993 1.81167 14.3993H6.15311C5.82371 13.686 5.62607 12.8994 5.60631 12.0661H2.47047C2.20036 12.0661 1.97637 11.8394 1.97637 11.5661C1.97637 11.2928 2.20036 11.0661 2.47047 11.0661H5.65901C5.7183 10.6595 5.81712 10.2728 5.94888 9.89951H2.47047C2.20036 9.89951 1.97637 9.67285 1.97637 9.39953C1.97637 9.12621 2.20036 8.89956 2.47047 8.89956H6.42321C6.68014 8.47291 6.98318 8.0796 7.33893 7.73295H2.47047C2.20036 7.73295 1.97637 7.50629 1.97637 7.23298C1.97637 6.95966 2.20036 6.733 2.47047 6.733H8.68945C9.44706 6.33302 10.2969 6.09303 11.1994 6.07303V4.23312C11.1994 3.21984 10.3891 2.39988 9.38777 2.39988Z" />
      <path d="M11.5994 7.19964C9.17335 7.19964 7.19964 9.17335 7.19964 11.5994C7.19964 14.0255 9.17335 15.9992 11.5994 15.9992C14.0255 15.9992 15.9992 14.0255 15.9992 11.5994C15.9992 9.17335 14.0255 7.19964 11.5994 7.19964ZM13.7191 10.7253L11.4378 13.3326C11.3191 13.4682 11.1497 13.549 10.9691 13.5549C10.9619 13.5549 10.9548 13.5549 10.9476 13.5549C10.7749 13.5549 10.6093 13.4864 10.4868 13.3639L9.18313 12.0603C8.92827 11.8054 8.92827 11.3935 9.18313 11.1386C9.43799 10.8837 9.84994 10.8837 10.1048 11.1386L10.9157 11.9495L12.7382 9.86624C12.9754 9.59638 13.3867 9.5677 13.6579 9.80497C13.929 10.0422 13.9564 10.4542 13.7191 10.7253Z" />
    </svg>
  );
}

/** Иконка «Счета» — заполненный кошелёк (Figma «wallet-filled-money-tool»). */
export function WalletFilledIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <g>
        <path d="M3.73941 2.92359L10.1177 1.18258L9.77993 0.499836C9.55893 0.0560497 9.01992 -0.127214 8.57614 0.0937805L2.86621 2.92359H3.73941Z" />
        <path d="M12.095 1.23438C12.016 1.23438 11.9369 1.24516 11.8579 1.26672L10.3594 1.67636L5.7832 2.92507H10.9775H13.2413L12.961 1.89736C12.8532 1.49669 12.4903 1.23438 12.095 1.23438Z" />
        <path d="M14.1796 3.55469H13.9748H13.6963H13.4178H11.2923H3.48201H2.45789H1.59547H1.43557H0.900149C0.616269 3.55469 0.362934 3.68585 0.197637 3.89247C0.122176 3.98769 0.0646814 4.09729 0.0323407 4.21767C0.0125769 4.29313 0 4.37219 0 4.45304V4.56084V5.58496V14.4625C0 14.9584 0.402462 15.3608 0.898352 15.3608H14.1778C14.6737 15.3608 15.0761 14.9584 15.0761 14.4625V11.9561H9.74532C8.90267 11.9561 8.21812 11.2715 8.21812 10.4289V9.60599V9.3275V9.04901V8.43094C8.21812 8.0177 8.3834 7.64221 8.65113 7.36731C8.8883 7.12294 9.20631 6.95764 9.56206 6.91632C9.62135 6.90915 9.68244 6.90554 9.74353 6.90554H14.3287H14.6072H14.8857H15.0761V4.45304C15.0779 3.95715 14.6755 3.55469 14.1796 3.55469Z" />
        <path d="M15.7055 7.75879C15.6157 7.67614 15.5097 7.61325 15.3911 7.57193C15.2994 7.5414 15.2024 7.52344 15.1 7.52344H15.0766H15.0587H14.7802H13.7758H9.74405C9.24815 7.52344 8.8457 7.92588 8.8457 8.42179V8.86915V9.14764V9.42613V10.4215C8.8457 10.9174 9.24815 11.3199 9.74405 11.3199H15.0766H15.1C15.2024 11.3199 15.2994 11.3019 15.3911 11.2713C15.5097 11.2318 15.6157 11.1671 15.7055 11.0845C15.8852 10.921 15.9984 10.6838 15.9984 10.4215V8.42179C15.9984 8.15945 15.8852 7.92227 15.7055 7.75879ZM11.6198 9.60041C11.6198 9.84835 11.4186 10.0496 11.1706 10.0496H10.8724C10.6244 10.0496 10.4232 9.84835 10.4232 9.60041V9.30216C10.4232 9.15842 10.4897 9.03084 10.5957 8.94998C10.6729 8.89069 10.7682 8.85298 10.8724 8.85298H10.9478H11.1706C11.4186 8.85298 11.6198 9.05419 11.6198 9.30216V9.60041Z" />
      </g>
    </svg>
  );
}

/* Профиль-карточка департамента.
   `active=false` — приглушённый плейсхолдер (1:1 из Figma, структура ещё не
   создана): серый cover + аватар наполовину + серый текст.
   `active=true` — операционный вид (кооператив работает): цветная обложка +
   аватар + тёмный текст. Источник: Figma 1857:649628 (ЛК). */
function DeptCard({ active = false, current = false, onClick }: { active?: boolean; current?: boolean; onClick?: () => void }) {
  const interactive = active && !!onClick;
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } } : undefined}
      className={cn(
        "flex w-full flex-col gap-2 overflow-hidden rounded-[4px] border bg-surface pb-2 transition-colors",
        current ? "border-[#e8a0a8] bg-[#fdf3f4]" : "border-border",
        interactive && "cursor-pointer hover:border-[#e8a0a8]",
      )}
    >
      <div className="relative h-[88px]">
        <div
          className={cn(
            "h-[57px] rounded-t-[3px]",
            active
              ? "bg-[linear-gradient(120deg,#f9c5d1_0%,#a18cd1_45%,#84fab0_100%)]"
              : "bg-surface-sunken",
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-1/2 size-[72px] -translate-x-1/2 overflow-hidden rounded-full border-2 bg-surface-muted",
            active ? "border-[#fff]" : "border-border",
          )}
        >
          {active && <img src={AVATAR} alt="" className="size-full object-cover" />}
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5 px-2 text-center">
        <span className={cn("ds-caption-medium", active ? "text-foreground" : "text-foreground-subtle")}>
          Администрация
        </span>
        <span className={cn("ds-caption", active ? "text-foreground-subtle" : "text-[var(--color-grey-90)]")}>
          Департамент
        </span>
      </div>
    </div>
  );
}

/** Маршруты пунктов меню. По умолчанию — флоу «Создание компании» (онбординг).
 *  Операционный кабинет (/cabinet) передаёт свои маршруты через проп `routes`,
 *  чтобы навигация оставалась внутри засиженного провайдера, а не прыгала в
 *  онбординг (см. /cabinet/layout). */
export interface CoopRoutes {
  paishiki: string;
  activity: string;
  voting: string;
  profile: string;
  accounts: string;
  partners?: string;
  /** Детальный профиль подразделения (клик по DeptCard). Только операционный кабинет. */
  subdivision?: string;
  /** Личный кабинет пользователя (клик по профилю-футеру). Только операционный кабинет. */
  lk?: string;
}
const ROUTES: CoopRoutes = {
  paishiki: "/flow/company-create/5",
  activity: "/flow/company-create/18",
  voting: "/flow/company-create/19",
  profile: "/flow/company-create/17",
  accounts: "/flow/company-create/21",
};

/**
 * CoopRail — урезанное меню (только рейка воркспейсов, без панели). Используется
 * на экранах профиля кооператива и создания совета (1:1 Figma). Логотип → профиль.
 */
export function CoopRail() {
  const router = useRouter();
  const R = ROUTES;
  return (
    <SidebarShell desktopClassName="sticky top-0 hidden h-screen shrink-0 lg:block">
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
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push("/cabinet/admin"); } }}
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
              active={w.label === "1"}
              onClick={href ? () => router.push(href) : undefined}
            >
              {w.label}
            </MenuBadge>
          );
        })}
      </MenuRail>
    </SidebarShell>
  );
}

/**
 * CoopSidebar читает ОБЩЕЕ состояние платформы из RegFlow (приглашены ли пайщики,
 * запущено ли голосование) и сам решает доступность/подсветку пунктов — одинаково
 * на всех экранах. Экран передаёт только `current` (какая страница активна).
 */
export function CoopSidebar({
  current = "paishiki",
  routes,
}: {
  current?: "paishiki" | "activity" | "voting" | "accounts" | "partners" | "subdivision";
  /** Переопределение маршрутов пунктов (операционный /cabinet). */
  routes?: Partial<CoopRoutes>;
}) {
  const router = useRouter();
  const R: CoopRoutes = { ...ROUTES, ...routes };
  const flow = useRegFlow();
  const accountsUnlocked = flow.accountsUnlocked; // счета разблокированы баннером
  const accountsCurrent = current === "accounts";
  const invited = flow.invitedMembers.length > 0; // пайщики приглашены → «Деятельность» доступна
  // Совет настроен: голосование идёт ИЛИ хотя бы один этап пройден. Остаётся true
  // и после завершения всех этапов (votingStarted сбрасывается в advanceCouncilStage),
  // чтобы «Деятельность» не подсвечивалась как незавершённая и вопросы голосования
  // (с результатами) были доступны всегда.
  const councilActive = flow.votingStarted || flow.councilStage > 0;
  // Активный вопрос-платёж/подключение/отчёт (submitPaymentVote, ещё не завершён)
  // тоже делает «Вопросы голосования» доступными и подсвеченными (оранжевый).
  const paymentVoteActive = flow.paymentVotes.some((v) => !v.done);

  const activityCurrent = current === "activity";
  const votingCurrent = current === "voting";
  const paishikiCurrent = current === "paishiki";
  // Профиль департамента активен, когда кооператив операционный (совет сформирован).
  // На ранних шагах онбординга (councilStage 0) — приглушённый плейсхолдер.
  const companyActive = flow.councilStage > 0;

  // «Деятельность»: текущая → синяя; совет настроен → обычная dark-800; иначе
  // доступна после приглашения → оранжевая; иначе locked.
  const activityColor = activityCurrent
    ? "text-primary"
    : councilActive
      ? "text-[#5A646E]"
      : invited
        ? "text-[var(--color-orange-300)]"
        : "text-[var(--color-grey-90)]";
  const activityIconColor = activityCurrent
    ? "text-primary"
    : councilActive
      ? "text-[var(--color-grey-300)]"
      : invited
        ? "text-[var(--color-orange-300)]"
        : "text-[var(--color-grey-90)]";
  const activityEnabled = activityCurrent || invited;
  const votingEnabled = votingCurrent || councilActive || paymentVoteActive;

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
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push("/cabinet/admin"); } }}
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
              active={w.label === "1"}
              onClick={href ? () => router.push(href) : undefined}
            >
              {w.label}
            </MenuBadge>
          );
        })}
      </MenuRail>
      <MenuPanel
        height="100vh"
        footer={
          companyActive ? (
            <MenuFooter
              avatar={USER_PHOTO}
              role="button"
              tabIndex={0}
              onClick={() => router.push(LK_HREF)}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(LK_HREF); }
              }}
              className="cursor-pointer"
            >
              Пред. правления
            </MenuFooter>
          ) : (
            <MenuFooter avatar={AVATAR}>Представитель</MenuFooter>
          )
        }
      >
        <DeptCard
          active={companyActive}
          current={current === "subdivision"}
          onClick={R.subdivision ? () => router.push(R.subdivision as string) : undefined}
        />
        {/* Деятельность: доступна после приглашения пайщиков */}
        <button
          type="button"
          disabled={!activityEnabled}
          onClick={activityEnabled ? () => router.push(R.activity) : undefined}
          className="flex w-full items-center justify-center gap-1 rounded-[4px] bg-surface-sunken px-4 py-1.5"
        >
          <CabinetMenuIcon.Activity className={cn("h-[13px] w-4", activityIconColor)} />
          <span className={cn("ds-caption-medium", activityColor)}>Деятельность</span>
        </button>
        <div className="flex w-full gap-[7px]">
          {accountsUnlocked ? (
            <button
              type="button"
              aria-label="Счета"
              onClick={() => router.push(R.accounts)}
              className={cn(
                "flex flex-1 items-center justify-center rounded-[4px] bg-surface-sunken p-2",
                // Синяя только на странице счетов; на других экранах — дефолтная.
                accountsCurrent ? "text-primary" : "text-[var(--color-grey-300)]",
              )}
            >
              <WalletFilledIcon className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled
              aria-label="Финансы"
              className="flex flex-1 items-center justify-center rounded-[4px] bg-surface-sunken p-2 text-[var(--color-grey-100)]"
            >
              <MenuIcon.Wallet className="size-4" />
            </button>
          )}
          {/* Вопросы голосования: доступны после запуска голосования (оранжевая),
              синяя на самой странице вопросов. */}
          {votingEnabled ? (
            <button
              type="button"
              aria-label="Вопросы голосования"
              onClick={() => router.push(R.voting)}
              className={cn(
                "flex flex-1 items-center justify-center rounded-[4px] bg-surface-sunken p-2",
                // Оранжевый — только когда голосование РЕАЛЬНО запущено: идёт
                // голосование совета (votingStarted) ИЛИ распределения %
                // (accountsVoteStarted). Иначе кнопка доступна, но нейтральная —
                // не путаем «совет ещё формируется» с «есть активный вопрос».
                votingCurrent
                  ? "text-primary"
                  : flow.votingStarted || flow.accountsVoteStarted || flow.podschetVoteStarted || flow.validationStage === "voting" || paymentVoteActive
                    ? "text-[var(--color-orange-500)]"
                    : "text-[var(--color-grey-300)]",
              )}
            >
              <VotingCheckIcon className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled
              aria-label="Проверка"
              className="flex flex-1 items-center justify-center rounded-[4px] bg-surface-sunken p-2 text-[var(--color-grey-100)]"
            >
              <MenuIcon.ClipboardCheck className="size-4" />
            </button>
          )}
        </div>
        <MenuDivider />
        <MenuNavItem
          icon={<MenuIcon.Users />}
          active={paishikiCurrent}
          onClick={() => router.push(R.paishiki)}
        >
          Пайщики
        </MenuNavItem>
        <MenuNavItem
          icon={<MenuIcon.Partners />}
          active={current === "partners"}
          onClick={R.partners ? () => router.push(R.partners as string) : undefined}
        >
          Партнеры
        </MenuNavItem>
      </MenuPanel>
    </SidebarShell>
  );
}
