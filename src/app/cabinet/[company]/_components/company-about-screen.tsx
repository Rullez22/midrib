"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HeaderIconButton,
  HeaderGridIcon,
  HeaderExitIcon,
  ChatWindow,
  ChatTopBar,
  ChatThread,
  ChatBubble,
  MessageComposer,
  Tabs,
  Tab,
  ProfileCard,
  SearchBar,
  Link,
  Button,
  type MenuBadgeColor,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { CompanyRail, CARD_TINT } from "./company-sidebar";
import { DeptProfile } from "./dept-profile";
import { SideChatLayout } from "../../_components/side-chat-layout";
import { CkpBlock, CascadeArrowDown, StructureCascade } from "./cabinet-activity-screen";
import { LEGAL } from "../../payment/_components/payment-shared";
import { PlanPanel, EduPanel } from "../../../flow/company-create/_components/activity-screen";
import { CABINET_LIST, PEER_AVATAR, getCabinet } from "../_config/cabinets";
import { CHAT_MESSAGES } from "../../subdivision/administration/_components/subdivision-data";
import { getCabinetActivity, ACCENT } from "../_config/cabinet-activity";
import {
  COOP_PROFILE,
  COOP_NAME,
  COOP_MEMBERS,
  LANDING_HERO,
  LANDING_SECTIONS,
  COOP_PEERS,
  STRUCTURE_DEPARTMENTS,
} from "../_config/about-company";

/**
 * CompanyAboutScreen — экран «О компании» (Figma 1857-650151 и связанные).
 * Кооператив-уровень: единый экран `/cabinet/about`, открывается кликом на
 * логотип рейки с любой страницы. Рейка остаётся, сверху — шапка (DS `Header`).
 * Три вида, переключаемые шапкой:
 *   • profile   — профиль кооператива (`DeptProfile`, Информация/Лента) + чат;
 *   • landing   — лендинг IMMATRA (клик по «О компании»);
 *   • structure — Структура/План/Обучение (кнопка-квадратики).
 * Всё собрано из существующих DS/композитов — ничего не верстаем заново.
 */

type View = "profile" | "landing" | "structure";

/** Аватар кооператива: градиент-кружок с надписью «Immatra». */
function CoopAvatar() {
  return (
    <span
      className="flex size-full items-center justify-center rounded-full text-[color:var(--color-grey-400)]"
      style={{ background: "linear-gradient(135deg,#e9ecf2,#f4eefc)" }}
    >
      <span className="ds-p3-medium">Immatra</span>
    </span>
  );
}

/** Таблица «Пайщики кооператива» (компактная, из DS). */
function PeersTable() {
  const [tab, setTab] = useState("private");
  const [q, setQ] = useState("");
  return (
    <div className="flex w-full flex-col gap-4">
      <span className="ds-p2-medium text-center text-foreground">Пайщики кооператива</span>
      <div className="flex items-center gap-3">
        <SearchBar size="s" className="flex-1" placeholder="Поиск" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="ghost" size="s">Список</Button>
        <Button variant="ghost" size="s">Страны</Button>
      </div>
      <Tabs value={tab} onValueChange={setTab} variant="basic" size="m" aria-label="Тип пайщика">
        <Tab value="private">Частные пайщики</Tab>
        <Tab value="legal">Юридическое лицо</Tab>
      </Tabs>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-[4px] bg-[#f9fafc] px-6 py-2">
          <span className="ds-caption-medium flex-[2] text-foreground-subtle">Имя</span>
          <span className="ds-caption-medium flex-[2] text-foreground-subtle">Адрес</span>
          <span className="ds-caption-medium flex-1 text-foreground-subtle">Страна</span>
          <span className="ds-caption-medium flex-1 text-foreground-subtle">Дата заявки</span>
        </div>
        {/* Под-таб переключает НАБОР: COOP_PEERS — частные, LEGAL — юрлица.
            Раньше `tab` в фильтре не участвовал → оба под-таба показывали
            одинаковый список. */}
        {(tab === "legal" ? LEGAL.map((l) => l.name) : COOP_PEERS)
          .filter((n) => n.toLowerCase().includes(q.trim().toLowerCase()))
          .map((name, i) => (
          <div key={`${name}-${i}`} className="ds-row flex items-center gap-2 rounded-[4px] border border-border bg-surface px-6 py-4">
            <span className="ds-p3 flex-[2] text-foreground">{name}</span>
            <span className="flex flex-[2]"><Link href="#" size="p3">5c243af... 07db8</Link></span>
            <span className="ds-p3 flex-1 text-foreground">ENG</span>
            <span className="ds-p3 flex-1 text-foreground">12.07.2020</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StructureView({ initialFocus = "administration" }: { initialFocus?: string }) {
  const [tab, setTab] = useState("struct");
  // Фокус структуры: по умолчанию — Администрация; при переходе с экрана
  // подразделения (грид-иконка ЦКП) фокус приходит из URL (?focus=slug).
  // Клик по карточке дальше меняет фокус локально.
  const [focus, setFocus] = useState(
    STRUCTURE_DEPARTMENTS.some((s) => s.slug === initialFocus) ? initialFocus : "administration",
  );
  const activity = getCabinetActivity(focus) ?? getCabinetActivity(CABINET_LIST[0].slug)!;
  const focusDept = STRUCTURE_DEPARTMENTS.find((s) => s.slug === focus) ?? STRUCTURE_DEPARTMENTS[0];
  // Акцент каскада/стрелок/бордеров — та же палитра ACCENT, что в подразделениях
  // (одинаковые заливки/бордеры). Ключ — railColor подразделения.
  const focusRail: MenuBadgeColor = focus === "administration" ? "red" : (getCabinet(focus)?.railColor ?? "red");
  const accent = ACCENT[focusRail];

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <Tabs value={tab} onValueChange={setTab} variant="solid-light" size="l" equal aria-label="Раздел" className="w-full rounded-none border-x-0 border-t-0">
        <Tab value="struct">Структура</Tab>
        <Tab value="plan">План развития</Tab>
        <Tab value="edu">Обучение</Tab>
      </Tabs>

      {tab === "struct" && (
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Верхний ЦКП кооператива (тот же блок, что в подразделениях) — розовая обложка */}
          <CkpBlock name={COOP_NAME} membersLabel={COOP_MEMBERS} desc={activity.ckpDesc} cover="linear-gradient(90deg,#8b7df0,#b89ae8,#f3a9cf)" />

          {/* Карточки подразделений (у каждого свои отделы) — тянутся на всю ширину;
              под выделенным — стрелка вниз к ЦКП (как в подразделениях). */}
          <div className="flex items-stretch gap-3 overflow-x-auto pb-2">
            {STRUCTURE_DEPARTMENTS.map((s) => {
              const isSel = s.slug === focus;
              // Цвета карточки — из палитры ACCENT (реальный hex; токенов
              // --color-blue-* в проекте нет). railColor подразделения.
              const cardRail: MenuBadgeColor = s.slug === "administration" ? "red" : (getCabinet(s.slug)?.railColor ?? "red");
              const ca = ACCENT[cardRail];
              return (
                <div key={s.slug} className="flex min-w-[172px] flex-1 flex-col">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setFocus(s.slug)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFocus(s.slug); } }}
                    className="flex-1 cursor-pointer"
                  >
                    {/* !h-full — карточки одинаковой длины (как коллектив в подразделениях) */}
                    <ProfileCard
                      color={s.color}
                      title={s.name}
                      person={s.head}
                      items={s.items}
                      active={isSel}
                      activeBg={ca.bg}
                      borderColor={ca.border}
                      editable
                      onEdit={() => setFocus(s.slug)}
                      /* ds-row — карточка кликабельна (обёртка role="button"), но
                         сама не реагировала. Лифт вешаем на карточку, а не на
                         обёртку: у обёртки нет скругления — тень легла бы
                         прямоугольником вокруг круглых углов. */
                      className="ds-row !h-full !w-full"
                    />
                  </div>
                  {/* Слот под стрелку h-10 (40px) — резервируется во всех колонках
                      (равная высота карточек). Стрелка (16px) по центру → ровно
                      12px сверху от карточки и 12px снизу до ЦКП. */}
                  <div className="flex h-10 items-center justify-center">
                    {isSel && <CascadeArrowDown accent={accent} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Сфокусированное подразделение: ЦКП (бордер цвета выделенного) + каскад
              (тот же компонент, что в подразделениях — цветные стрелки, без кнопок).
              -mt-8 гасит родительский gap-8, чтобы ЦКП примыкал к слоту стрелки
              (зазор задаёт сам слот: 12px). */}
          <div className="-mt-8">
            <CkpBlock
              name={focusDept.name}
              avatar={getCabinet(focus)?.avatar}
              membersLabel={activity.membersLabel}
              desc={activity.ckpDesc}
              borderColor={accent.border}
              // Обложка аватара — тот же cover-градиент, что в карточке
              // подразделения в сайдбаре (CARD_TINT по цвету рейки), меняется с focus.
              cover={CARD_TINT[focusRail].cover}
            />
          </div>
          {/* -mt-4 сводит gap-8 к 16px между ЦКП и каскадом. */}
          <StructureCascade cascade={activity.cascade} accent={accent} className="-mt-4" />

          <PeersTable />
        </div>
      )}

      {tab === "plan" && (
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          <PlanPanel />
        </div>
      )}
      {tab === "edu" && (
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          <EduPanel />
        </div>
      )}
    </div>
  );
}

function LandingView() {
  return (
    <div className="flex min-h-[calc(100vh-60px)] w-full flex-col gap-10 px-5 py-10 md:px-[50px]">
      {/* Герой */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col">
          <span className="ds-h2 text-foreground">{LANDING_HERO.brand}</span>
          <span className="ds-h3 text-foreground-subtle">{LANDING_HERO.tagline}</span>
        </div>
        <p className="ds-p2 text-foreground-muted">{LANDING_HERO.lead}</p>
      </div>

      {/* Аккордеон-пункты */}
      <div className="flex flex-col">
        {LANDING_SECTIONS.map((s) => (
          <div key={s.title} className="flex items-center gap-5 border-t border-border py-6 last:border-b">
            <span className="size-14 shrink-0 rounded-full" style={{ backgroundImage: s.tint }} />
            <span className="ds-h5 flex-1 text-foreground">{s.title}</span>
            <span className="ds-caption text-foreground-subtle">{s.meta}</span>
            <svg viewBox="0 0 24 24" width={24} height={24} fill="none" aria-hidden className="text-foreground-subtle">
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
        <span className="ds-caption text-foreground-subtle">info@midhub.io</span>
        <span className="ds-caption text-foreground-subtle">© 2021 Midhub. Все права защищены.</span>
      </div>
    </div>
  );
}

function ProfileView() {
  return (
    <main className="flex min-w-0 flex-1">
      <SideChatLayout
        stickyTop="60px"
        chatHeight="calc(100vh - 60px)"
        content={
          <DeptProfile
            data={COOP_PROFILE}
            avatar={<CoopAvatar />}
            cover={<div className="size-full bg-[linear-gradient(90deg,#8b7df0_0%,#b89ae8_45%,#f3a9cf_100%)]" />}
            showJoinBanner={false}
            actions={<Button variant="secondary" size="xs" className="self-start">Поделиться профилем</Button>}
          />
        }
        chat={
          <ChatWindow
            height="calc(100vh - 60px)"
            className="rounded-none border-0 border-l border-border"
            topBar={<ChatTopBar title={COOP_NAME} subtitle={COOP_MEMBERS} />}
            footer={<MessageComposer placeholder="Сообщение" />}
          >
            <ChatThread>
              {CHAT_MESSAGES.map((m, i) => (
                <ChatBubble key={i} me={m.me} time={m.time} avatar={m.me ? undefined : PEER_AVATAR}>
                  {m.text}
                </ChatBubble>
              ))}
            </ChatThread>
          </ChatWindow>
        }
      />
    </main>
  );
}

/**
 * Шапка экрана «О компании» — БЕЗ логотипа (в созданном кооперативе логотип
 * живёт в рейке). Копия DS `Header` без лого/разделителя: слева кнопка-
 * квадратики (padding от края через `px`), по центру «О компании», справа —
 * выход (padding справа). Figma 1857-650151.
 */
function AboutHeader({
  structureActive,
  landingActive,
  onStructure,
  onLanding,
  onExit,
}: {
  structureActive: boolean;
  landingActive: boolean;
  onStructure: () => void;
  onLanding: () => void;
  onExit: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-[60px] w-full items-center justify-between border-b border-border bg-surface px-5 md:px-[50px]">
      {/* Слева — кнопка-квадратики (структура). Логотипа нет. */}
      <HeaderIconButton
        icon={<HeaderGridIcon className="size-4" />}
        aria-label="Структура компании"
        aria-pressed={structureActive}
        onClick={onStructure}
        className={cn(structureActive && "border-[color:var(--color-blue-midhub-500)] bg-[color:var(--color-blue-midhub-100)] text-[color:var(--color-blue-midhub-500)]")}
      />

      {/* Центр — «О компании» */}
      <nav className="-translate-x-1/2 absolute left-1/2">
        <button
          type="button"
          onClick={onLanding}
          aria-current={landingActive ? "page" : undefined}
          className={cn(
            "ds-p3-medium whitespace-nowrap text-foreground transition-colors hover:text-primary",
            landingActive && "text-primary",
          )}
        >
          О компании
        </button>
      </nav>

      {/* Справа — выход (padding справа через px шапки) */}
      <button
        type="button"
        aria-label="Выход"
        onClick={onExit}
        className="flex size-8 items-center justify-center rounded-[4px] bg-surface-muted text-foreground-subtle transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <HeaderExitIcon className="size-4" />
      </button>
    </header>
  );
}

export function CompanyAboutScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Переход с экрана подразделения (грид-иконка ЦКП): ?view=structure&focus=slug —
  // сразу открываем «Структуру» с выделенным подразделением.
  const initialView: View = searchParams.get("view") === "structure" ? "structure" : "profile";
  const initialFocus = searchParams.get("focus") ?? "administration";
  const [view, setView] = useState<View>(initialView);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:flex">
        <CompanyRail activeRail={null} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AboutHeader
          structureActive={view === "structure"}
          landingActive={view === "landing"}
          onStructure={() => setView((v) => (v === "structure" ? "profile" : "structure"))}
          onLanding={() => setView((v) => (v === "landing" ? "profile" : "landing"))}
          onExit={() => router.push("/cabinet/spaces")}
        />

        {view === "structure" ? <StructureView initialFocus={initialFocus} /> : view === "landing" ? <LandingView /> : <ProfileView />}
      </div>
    </div>
  );
}
