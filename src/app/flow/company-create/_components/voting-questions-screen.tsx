"use client";

import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Banner } from "@/components/ds";
import { CoopSidebar } from "./coop-sidebar";
import { useEnsureInvited, useRegFlow } from "./reg-flow";

/**
 * VotingQuestionsScreen — «Вопросы голосования по ролям». Открывается из сайдбара
 * (оранжевая кнопка «Вопросы голосования») после запуска голосования на экране
 * «Деятельность». Источник: Figma 2384:247324.
 *
 * Reuse DS: CoopSidebar (читает общее состояние платформы) · Tabs (роли +
 * под-табы). Список вопросов и правая рейка ролей — локальная вёрстка (1:1 Figma
 * «questions» / «sidemenu»). Навигация в меню — внутри CoopSidebar.
 */

type QIcon = "lock" | "share" | "person";

interface Question {
  title: string;
  icon: QIcon;
  /** Подсветка + «На голосовании» (вопрос на текущем голосовании). */
  active?: boolean;
}

/**
 * Вопросы голосования по этапам формирования совета. Видны до текущего этапа
 * включительно: выбрали совет → появляется «Выбрать председателя совета», затем
 * «Выбрать председателя правления». Текущий этап — «На голосовании»; завершённые
 * остаются доступными (открываются в режиме «только результаты»).
 */
const COUNCIL_QUESTIONS = [
  "Создание совета кооператива",
  "Выбрать председателя совета",
  "Выбрать председателя правления",
];

const QUESTIONS: Question[] = [
  { title: "Утверждение устава кооператива, внесение изменений в него", icon: "lock" },
  { title: "Определение основных направлений деятельности кооператива", icon: "share" },
  { title: "Прием в члены кооператива и исключение из членов кооператива", icon: "share" },
  { title: "Установление размера паевого взноса", icon: "person" },
  { title: "Образование наблюдательного совета и прекращение полномочий его членов", icon: "lock" },
  { title: "Избрание ревизионной комиссии", icon: "share" },
  { title: "Распределение прибыли и убытков кооператива", icon: "person" },
  { title: "Выбор членов совета", icon: "lock" },
  { title: "Образование наблюдательного совета и прекращение полномочий его членов", icon: "lock" },
  { title: "Избрание ревизионной комиссии", icon: "share" },
  { title: "Распределение прибыли и убытков кооператива", icon: "person" },
  { title: "Выбор членов совета", icon: "lock" },
];

/** Рейка ролей справа (S-32 пилюли, цвета — pale из палитры). */
const RAIL = [
  { n: "1", bg: "#fff", border: "#e89297", fg: "#e89297" },
  { n: "2", bg: "#fdd8a6", fg: "#fff" },
  { n: "3", bg: "#f6ecb7", fg: "#fff" },
  { n: "4", bg: "#c4e7c5", fg: "#fff" },
  { n: "5", bg: "#bedffe", fg: "#fff" },
  { n: "6", bg: "#e4f2ff", fg: "#fff" },
  { n: "7", bg: "#d1c4e9", fg: "#fff" },
];

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 shrink-0 text-[var(--color-grey-300)]">
      <rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 shrink-0 text-[var(--color-blue-midhub-500)]">
      <path d="M14 4h6v6M20 4l-8.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-6 shrink-0 text-[var(--color-blue-midhub-500)]">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 19.5c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5Z" />
    </svg>
  );
}
function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 shrink-0 text-[var(--color-grey-300)]">
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICON: Record<QIcon, () => React.ReactNode> = {
  lock: LockIcon,
  share: ShareIcon,
  person: PersonIcon,
};

function QuestionRow({ q, onClick }: { q: Question; onClick?: () => void }) {
  const Icon = ICON[q.icon];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "ds-row flex h-[66px] w-full items-center gap-4 rounded-[4px] border bg-white px-6 text-left transition-colors",
        q.active ? "border-[var(--color-orange-500)]" : "border-border",
      )}
    >
      <span className="ds-p3 flex-1 text-foreground">{q.title}</span>
      {q.active && <span className="ds-p3 whitespace-nowrap text-foreground-subtle">На голосовании</span>}
      <Icon />
      <div className="h-6 w-px bg-border" />
      <Chevron />
    </button>
  );
}

export function VotingQuestionsScreen() {
  // На этапе голосования пайщики уже приглашены + ПП создано (для «Пайщики» в сайдбаре).
  useEnsureInvited();
  const flow = useRegFlow();
  const router = useRouter();
  const councilStage = flow.councilStage;
  // Баннер «Завершить настройку» — когда совет полностью сформирован (все роли
  // назначены) и счета ещё не разблокированы. После разблокировки исчезает.
  const showBanner = councilStage >= 3 && !flow.accountsUnlocked;
  // Клик по баннеру/кнопке → разблокировать «Счета» в меню и перейти на страницу.
  const openAccounts = () => {
    flow.unlockAccounts();
    router.push("/flow/company-create/21");
  };
  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar current="voting" />

      <main className="min-w-0 flex-1">
        {/* Равные отступы 50px: сайдбар→контент (px), контент→рейка (gap),
            рейка→правый край (px). */}
        <div className="flex gap-[50px] px-5 py-8 md:px-[50px]">
          <div className="min-w-0 flex-1">
          {/* Заголовок (по центру) */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="ds-h4 text-foreground">Вопросы голосования по ролям</h1>
            <p className="ds-p2 max-w-[680px] text-foreground-muted">
              Делегируете вопросы голосования от одной роли к другой, создавайте вспомогательные роли для председателей.
            </p>
          </div>

          {/* Баннер «Завершить настройку» (DS Banner, tone=info). Появляется, когда
              совет полностью сформирован. Отступы 24px сверху/снизу (Figma 2399:321358). */}
          {showBanner && (
            <div onClick={openAccounts} className="mt-6 cursor-pointer">
              <Banner
                tone="info"
                title="Завершить настройку?"
                actionLabel="Завершить настройку"
                onAction={openAccounts}
              >
                Чтобы перейти к настройке счетов, необходимо завершить настройку вопросов.
              </Banner>
            </div>
          )}

          {/* Роли (верхние табы) */}
          <Tabs defaultValue="paishik" variant="solid" size="m" equal aria-label="Роль" className={cn(showBanner ? "mt-6" : "mt-8", "w-full")}>
            <Tab value="paishik">Пайщик</Tab>
            <Tab value="sovet">Совет</Tab>
            <Tab value="pravl">Пред. правления</Tab>
            <Tab value="sov">Пред. совета</Tab>
            <Tab value="tokens">Токены</Tab>
          </Tabs>

          {/* Фильтр (под-табы) */}
          <Tabs defaultValue="all" variant="basic" size="m" equal aria-label="Фильтр" className="mt-6 w-full">
            <Tab value="all">Все</Tab>
            <Tab value="fixed">Фиксированные</Tab>
            <Tab value="transferable">Доступные к передаче</Tab>
            <Tab value="transferred">Переданные</Tab>
          </Tabs>

          {/* Список вопросов. Все источники (распределение %, совет по этапам,
              повестка) собираются в один список, и активные («На голосовании»)
              всегда идут первыми. */}
          <div className="mt-4 flex flex-col gap-2">
            {(() => {
              interface QItem {
                key: string;
                title: string;
                icon: QIcon;
                active: boolean;
                onClick: () => void;
              }
              const items: QItem[] = [];

              // Вопрос распределения % (после «Запустить голосование» на счетах).
              // Активен, пока голосование не завершено. Источник: Figma 2489:285849.
              if (flow.accountsVoteStarted || flow.accountsVoteDone) {
                items.push({
                  key: "accounts",
                  title: "Распределение % по подсчетам целевого счета",
                  icon: "lock",
                  active: flow.accountsVoteStarted,
                  onClick: () => router.push("/flow/company-create/23"),
                });
              }

              // Вопрос создания подсчёта. Источник: Figma 2494:362085.
              if (flow.podschetVoteStarted || flow.podschetVoteDone) {
                items.push({
                  key: "podschet",
                  title: "Создание нового подсчета",
                  icon: "lock",
                  active: flow.podschetVoteStarted,
                  onClick: () => router.push("/flow/company-create/26"),
                });
              }

              // Вопрос отправки устава на валидацию. Источник: Figma 2512:299222.
              if (flow.validationStage !== "idle") {
                items.push({
                  key: "validation",
                  title: "Отправка уставных документов на валидацию",
                  icon: "lock",
                  active: flow.validationStage === "voting",
                  onClick: () => router.push("/flow/company-create/27"),
                });
              }

              // Вопросы совета: завершённые этапы (i < councilStage) — результаты;
              // текущий — только если голосование по нему реально запущено.
              COUNCIL_QUESTIONS.slice(0, Math.min(councilStage, 3)).forEach((title, i) =>
                items.push({
                  key: `council-${i}`,
                  title,
                  icon: "lock",
                  active: false,
                  onClick: () => {
                    flow.setCouncilViewStage(i);
                    router.push("/flow/company-create/20");
                  },
                }),
              );
              if (flow.votingStarted && councilStage <= 2) {
                items.push({
                  key: `council-${councilStage}`,
                  title: COUNCIL_QUESTIONS[councilStage],
                  icon: "lock",
                  active: true,
                  onClick: () => {
                    flow.setCouncilViewStage(councilStage);
                    router.push("/flow/company-create/20");
                  },
                });
              }

              // Прочие вопросы повестки.
              QUESTIONS.forEach((q, i) =>
                items.push({
                  key: `agenda-${i}`,
                  title: q.title,
                  icon: q.icon,
                  active: false,
                  onClick: () => {
                    flow.setCouncilViewStage(null);
                    router.push("/flow/company-create/20");
                  },
                }),
              );

              // Активные — всегда первыми.
              return [...items.filter((it) => it.active), ...items.filter((it) => !it.active)].map((it) => (
                <QuestionRow
                  key={it.key}
                  q={{ title: it.title, icon: it.icon, active: it.active }}
                  onClick={it.onClick}
                />
              ));
            })()}
          </div>
          </div>

          {/* Правая рейка ролей (выровнена с первым вопросом) */}
          <div className="hidden shrink-0 flex-col gap-2 pt-[240px] xl:flex">
            {RAIL.map((r) => (
              <div
                key={r.n}
                className="ds-caption flex h-8 w-12 items-center justify-center rounded-[4px]"
                style={{ backgroundColor: r.bg, color: r.fg, border: r.border ? `1px solid ${r.border}` : undefined }}
              >
                {r.n}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
