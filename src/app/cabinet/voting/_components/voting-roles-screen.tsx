"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Tabs, Tab, Button, Dropdown } from "@/components/ds";
import { SettingsIcon } from "@/components/ds/composite/header-icons";
import { CoopSidebar } from "../../../flow/company-create/_components/coop-sidebar";
import { useRegFlow, type CoopToken } from "../../../flow/company-create/_components/reg-flow";
import { CABINET_ROUTES } from "../../_components/cabinet-seed";
import { PaymentVoteDetail } from "./payment-vote-detail";
import { ReportVoteDetail } from "./report-vote-detail";
import { TokenVoteDetail } from "./token-vote-detail";
import { MemberVoteDetail } from "./member-vote-detail";

/**
 * VotingRolesScreen — «Вопросы голосования по ролям» (операционный кабинет,
 * /cabinet/voting). Источник: Figma 1857:650019, 6523:328xxx (21 фрейм).
 *
 * Вложенные табы: роль (Пайщик/Совет/Пред. правления/Пред. совета/Токены) →
 * для председателей переключатель «Вопросы голосования / Помощники» → фильтр
 * (Все/Фиксированные/Доступные к передаче/Переданные) либо «Роли/Токены».
 * Роль «Токены» — список Ваши/Входящие токены с детально-экранами.
 *
 * Иконка строки = состояние делегирования: person=Переданные · lock=Фиксированные
 * · share=Доступные к передаче.
 *
 * Reuse DS: CoopSidebar (current="voting", routes=/cabinet) · Tabs · Button ·
 * EmptyState. Аккордеон-строки/детали — локальная вёрстка (специфичный паттерн).
 */

type Role = "pajshik" | "sovet" | "predpravl" | "predsovet" | "tokeny";
type IconType = "person" | "lock" | "share";

const ROLES: { key: Role; label: string }[] = [
  { key: "pajshik", label: "Пайщик" },
  { key: "sovet", label: "Совет" },
  { key: "predpravl", label: "Пред. правления" },
  { key: "predsovet", label: "Пред. совета" },
  { key: "tokeny", label: "Токены" },
];

const QUESTIONS = [
  "Изменить управляющего",
  "Утверждение устава кооператива, внесение изменений в него",
  "Определение основных направлений деятельности кооператива",
  "Прием в члены кооператива и исключение из членов кооператива",
  "Установление размера паевого взноса",
  "Образование наблюдательного совета и прекращение полномочий его членов",
  "Избрание ревизионной комиссии",
  "Распределение прибыли и убытков кооператива",
  "Выбор членов совета",
];

/** Состояние делегирования вопроса по ролям (Figma per-role). */
const ICONS_BY_ROLE: Record<Exclude<Role, "tokeny">, IconType[]> = {
  pajshik: ["person", "lock", "share", "share", "person", "lock", "share", "person", "lock"],
  sovet: ["person", "lock", "share", "share", "person", "lock", "share", "person", "lock"],
  predpravl: ["share", "lock", "share", "share", "share", "lock", "share", "share", "lock"],
  predsovet: ["share", "lock", "share", "share", "share", "lock", "share", "share", "lock"],
};

const DESC_1 =
  "Тут описание вопроса, выносимый на голосование, варианты ответов, возможные значения для кастомизации вопроса, срок вступления решения в силу.";
const DESC_2 =
  "Пример: Назначить нового управляющего в кооперативе. Вопрос вступает в силу не ранее 7 дней после окончания голосования.";

/** Правая рейка ролей 1–7 (S-32 пилюли, pale-палитра) — 1:1 из исходного
 *  экрана голосования (voting-questions-screen). */
const RAIL = [
  { n: "1", bg: "#fff", border: "#e89297", fg: "#e89297" },
  { n: "2", bg: "#fdd8a6", fg: "#fff" },
  { n: "3", bg: "#f6ecb7", fg: "#fff" },
  { n: "4", bg: "#c4e7c5", fg: "#fff" },
  { n: "5", bg: "#bedffe", fg: "#fff" },
  { n: "6", bg: "#e4f2ff", fg: "#fff" },
  { n: "7", bg: "#d1c4e9", fg: "#fff" },
];

/* ── Иконки ─────────────────────────────────────────────────────────────── */
function StateIcon({ type }: { type: IconType }) {
  // person — голубой (Переданные, Figma 6523:328399); lock/share — серый
  // (Фиксированные 6523:328402 / Доступные к передаче 6523:328405). Иконки 1:1.
  if (type === "person")
    return (
      <svg viewBox="0 0 26 24" fill="none" aria-hidden className="size-6 shrink-0 text-primary">
        <path d="M14.7817 14.6664V13.3331C15.0984 13.1844 16.0044 12.163 16.0994 11.365C16.3486 11.347 16.74 11.1303 16.8555 10.2749C16.9174 9.81558 16.671 9.55757 16.5218 9.47623C16.5218 9.47623 16.8935 8.80753 16.8935 8.00017C16.8935 6.38143 16.2226 5.00004 14.7817 5.00004C14.7817 5.00004 14.2812 4 12.6699 4C9.68377 4 8.44626 5.81408 8.44626 8.00017C8.44626 8.7362 8.81794 9.47623 8.81794 9.47623C8.6687 9.55757 8.42233 9.81624 8.48427 10.2749C8.59972 11.1303 8.9911 11.347 9.2403 11.365C9.33533 12.163 10.2413 13.1844 10.5581 13.3331V14.6664C9.85413 16.6665 4.22266 15.3331 4.22266 20H21.1171C21.1171 15.3331 15.4856 16.6665 14.7817 14.6664Z" fill="currentColor" />
      </svg>
    );
  if (type === "lock")
    return (
      <svg viewBox="0 0 26 24" fill="none" aria-hidden className="size-6 shrink-0 text-foreground-subtle">
        <path d="M18.3468 9.75H17.7749V7.5C17.7749 5.01819 15.7228 3 13.1993 3C10.6758 3 8.62372 5.01819 8.62372 7.5V9.75H8.05178C7.10617 9.75 6.33594 10.5067 6.33594 11.4375V19.3125C6.33594 20.2433 7.10617 21 8.05178 21H18.3468C19.2924 21 20.0626 20.2433 20.0626 19.3125V11.4375C20.0626 10.5067 19.2924 9.75 18.3468 9.75ZM10.149 7.5C10.149 5.84546 11.517 4.50005 13.1993 4.50005C14.8816 4.50005 16.2496 5.84546 16.2496 7.5V9.75H10.149V7.5Z" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 26 24" fill="none" aria-hidden className="size-6 shrink-0 text-foreground-subtle">
      <path d="M3.55198 19.9918C3.32756 19.9452 3.16797 19.7521 3.16797 19.5311C3.16797 11.8802 12.3943 10.2519 14.5346 9.97692V6.46733C14.5346 6.29467 14.6319 6.13511 14.789 6.05492C14.9452 5.97309 15.1323 5.98455 15.2777 6.07701L25.1341 12.6101C25.2638 12.6961 25.3419 12.8401 25.3419 13.0005C25.3419 13.1551 25.2638 13.2991 25.1341 13.3875L15.281 19.9198C15.1348 20.0139 14.9469 20.0237 14.7906 19.9435C14.6344 19.8617 14.5388 19.7005 14.5388 19.5295V15.7515C12.9869 15.763 11.7052 15.8317 10.6355 15.9577C5.51029 16.5542 4.1413 19.5843 4.08312 19.7136C4.00582 19.8879 3.8321 20 3.64591 20C3.61515 19.9992 3.58108 19.9975 3.55198 19.9918Z" fill="currentColor" />
    </svg>
  );
}
function Chevron({ open }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-6 shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Kebab() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5 text-foreground-subtle">
      <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

/* ── Строка-аккордеон вопроса ───────────────────────────────────────────── */
function QuestionRow({ label, icon, open, onToggle, hideIcon }: { label: string; icon: IconType; open: boolean; onToggle: () => void; hideIcon?: boolean }) {
  const actionable = icon !== "lock";
  return (
    <div className="overflow-hidden rounded-[4px] border border-border bg-surface">
      {/* Раскрыто: шапка темнее (grey-10), выпадающая часть — белая (Figma 6523:328406). */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex h-[66px] w-full items-center gap-4 px-6 text-left transition-colors",
          open ? "bg-[var(--color-grey-10)]" : "hover:bg-[var(--color-grey-10)]",
        )}
      >
        <span className="ds-p3 flex-1 text-foreground">{label}</span>
        {!hideIcon && <StateIcon type={icon} />}
        {!hideIcon && <div className="h-6 w-px bg-border" />}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="flex flex-col gap-4 border-t border-border bg-white px-6 py-4">
          <div className="flex flex-col gap-0.5">
            <p className="ds-p3 text-foreground-muted">{DESC_1}</p>
            <p className="ds-p3 text-foreground-muted">{DESC_2}</p>
          </div>
          {actionable && (
            <Button size="s" className="self-start">
              Запустить голосование
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/** Простая строка-карточка (помощники/токены). */
function ListRow({ label, sub, trailing, onClick }: { label: ReactNode; sub?: ReactNode; trailing?: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-[4px] border border-border bg-surface px-6 py-4 text-left"
    >
      <span className="ds-p3 text-foreground">{label}</span>
      {sub != null && <span className="ds-p3 flex-1 text-center text-foreground-subtle">{sub}</span>}
      <span className={cn("flex items-center", sub == null && "ml-auto")}>{trailing}</span>
    </button>
  );
}

/** Шапка детального экрана: назад · заголовок/подзаголовок · действия. */
function DetailHeader({ title, sub, onBack, actions, backVariant = "secondary" }: { title: string; sub?: string; onBack: () => void; actions?: ReactNode; backVariant?: "secondary" | "ghost" }) {
  return (
    <div className="flex items-center gap-4">
      <Button size="s" variant={backVariant} icon={<BackIcon />} aria-label="Назад" onClick={onBack} />
      <div className="flex flex-1 flex-col items-center text-center">
        <span className="ds-p1-medium text-foreground">{title}</span>
        {sub && <span className="ds-caption text-foreground-subtle">{sub}</span>}
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </div>
  );
}


export function VotingRolesScreen({ sidebar, compact = false }: { sidebar?: ReactNode; compact?: boolean } = {}) {
  const router = useRouter();
  const flow = useRegFlow();
  const [drillVote, setDrillVote] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("pajshik");
  const [mode, setMode] = useState<"questions" | "assistants">("questions");
  const [filter, setFilter] = useState<"all" | "fixed" | "transfer" | "passed">("all");
  const [openQ, setOpenQ] = useState<Set<number>>(() => new Set());
  const [openPay, setOpenPay] = useState<Set<string>>(() => new Set());
  const togglePay = (id: string) => {
    const n = new Set(openPay);
    n.has(id) ? n.delete(id) : n.add(id);
    setOpenPay(n);
  };
  const [assistTab, setAssistTab] = useState<"roles" | "tokens">("roles");
  const [drillRole, setDrillRole] = useState<string | null>(null);
  const [tokTab, setTokTab] = useState<"yours" | "incoming">("yours");
  const [drillToken, setDrillToken] = useState<CoopToken | null>(null);

  const isChair = role === "predpravl" || role === "predsovet";
  const toggleQ = (i: number) => {
    const n = new Set(openQ);
    if (n.has(i)) n.delete(i);
    else n.add(i);
    setOpenQ(n);
  };

  /* ── Вопросы голосования (список с фильтрами) ─────────────────────────── */
  const questionsView = () => {
    const icons = ICONS_BY_ROLE[(role === "tokeny" ? "pajshik" : role) as Exclude<Role, "tokeny">];
    const match = (ic: IconType) =>
      filter === "all" || (filter === "fixed" && ic === "lock") || (filter === "transfer" && ic === "share") || (filter === "passed" && ic === "person");
    return (
      <div className="flex flex-col gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} variant="basic" size="m" equal aria-label="Фильтр вопросов" className="w-full">
          <Tab value="all">Все</Tab>
          <Tab value="fixed">Фиксированные</Tab>
          <Tab value="transfer">Доступные к передаче</Tab>
          <Tab value="passed">Переданные</Tab>
        </Tabs>
        <div className="flex flex-col gap-2">
          {/* Вопросы, отправленные «на совет» (платежи/подключения/отчёт/токен) —
              видны только в табе «Совет» (адресат голосования). Сверху списка.
              Аккордеон: раскрытие → описание + «Подробнее» (→ детальная страница). */}
          {role === "sovet" && flow.paymentVotes.map((v) => {
            const isOpen = openPay.has(v.id);
            return (
              <div key={v.id} className={cn("overflow-hidden rounded-[4px] border bg-surface", !v.done ? "border-[var(--color-orange-500)]" : "border-border")}>
                <button
                  type="button"
                  onClick={() => togglePay(v.id)}
                  className={cn("flex h-[66px] w-full items-center gap-4 px-6 text-left transition-colors", isOpen ? "bg-[var(--color-grey-10)]" : "hover:bg-[var(--color-grey-10)]")}
                >
                  <span className="ds-p3 flex-1 text-foreground">{v.title}</span>
                  <span className="ds-p3 whitespace-nowrap text-foreground-subtle">{v.done ? "Завершено" : "На голосовании"}</span>
                  <StateIcon type={v.kind === "token" || v.kind === "member" ? "share" : "lock"} />
                  <div className="h-6 w-px bg-border" />
                  <Chevron open={isOpen} />
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-4 border-t border-border bg-white px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="ds-p3 text-foreground-muted">{DESC_1}</p>
                      <p className="ds-p3 text-foreground-muted">{DESC_2}</p>
                    </div>
                    <Button size="s" className="self-start" onClick={() => setDrillVote(v.id)}>Подробнее</Button>
                  </div>
                )}
              </div>
            );
          })}
          {QUESTIONS.map((q, i) => (match(icons[i]) ? <QuestionRow key={i} label={q} icon={icons[i]} open={openQ.has(i)} onToggle={() => toggleQ(i)} /> : null))}
        </div>
      </div>
    );
  };

  /* ── Помощники (Роли / Токены) ────────────────────────────────────────── */
  const assistantsView = () => {
    if (drillRole) {
      return (
        <div className="flex flex-col gap-6">
          <DetailHeader
            title={drillRole}
            sub="Помощник председателя правления"
            backVariant="ghost"
            onBack={() => setDrillRole(null)}
            actions={
              <Dropdown
                align="end"
                aria-label="Действия с ролью"
                trigger={
                  <SettingsIcon className="size-5 cursor-pointer text-foreground-subtle hover:text-foreground" />
                }
                items={[{ value: "revoke", label: "Отозвать вопросы" }]}
              />
            }
          />
          <div className="flex flex-col gap-3">
            <QuestionRow label="Изменить управляющего" icon="person" hideIcon open={openQ.has(0)} onToggle={() => toggleQ(0)} />
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 border-b border-[var(--color-grey-90)]">
          <Tabs value={assistTab} onValueChange={(v) => setAssistTab(v as "roles" | "tokens")} variant="basic" size="m" aria-label="Помощники" className="flex-1 border-b-0">
            <Tab value="roles">Роли</Tab>
            <Tab value="tokens">Токены</Tab>
          </Tabs>
          <Button size="s" className="self-end mb-2">Создать роль</Button>
        </div>
        {assistTab === "roles" ? (
          <div className="flex flex-col gap-3">
            <ListRow
              label="Помощник председателя правления"
              sub={<span className="text-foreground">Алексей Воронов</span>}
              trailing={<Kebab />}
              onClick={() => setDrillRole("Алексей Воронов")}
            />
            <ListRow label="Помощник председателя правления" sub={<span className="text-foreground-subtle">Не назначено</span>} trailing={<Kebab />} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <ListRow label="Изменить управляющего" trailing={<StateIcon type="person" />} />
          </div>
        )}
      </div>
    );
  };

  /* ── Роль «Токены» (Ваши / Входящие) ──────────────────────────────────── */
  const tokensView = () => {
    if (drillToken) {
      return (
        <div className="flex flex-col gap-6">
          <DetailHeader
            title={drillToken.name}
            backVariant="ghost"
            onBack={() => setDrillToken(null)}
            actions={
              <>
                {drillToken.icon === "person" && <StateIcon type="person" />}
                <SettingsIcon className="size-5 text-foreground-subtle" />
              </>
            }
          />
          <div className="flex flex-col gap-3">
            {drillToken.questions.map((q) => (
              <div key={q} className="flex items-center gap-4 rounded-[4px] border border-border bg-surface px-6 py-4">
                <span className="ds-p3 flex-1 text-foreground">{q}</span>
                <Chevron />
              </div>
            ))}
          </div>
        </div>
      );
    }
    const yours = flow.tokens;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 border-b border-[var(--color-grey-90)]">
          <Tabs value={tokTab} onValueChange={(v) => setTokTab(v as "yours" | "incoming")} variant="basic" size="m" aria-label="Токены" className="flex-1 border-b-0">
            <Tab value="yours">Ваши токены</Tab>
            <Tab value="incoming">Входящие токены</Tab>
          </Tabs>
          {tokTab === "yours" && <Button size="s" className="self-end mb-2" onClick={() => router.push("/cabinet/voting/token/create")}>Создать токены</Button>}
        </div>
        <div className="flex flex-col gap-3">
          {tokTab === "yours"
            ? yours.map((t) => <ListRow key={t.name} label={t.name} trailing={<StateIcon type={t.icon} />} onClick={() => setDrillToken(t)} />)
            : ["Токен 1", "Токен 2"].map((t) => <ListRow key={t} label={t} trailing={<StateIcon type="person" />} />)}
        </div>
      </div>
    );
  };

  const openVote = drillVote != null ? flow.paymentVotes.find((v) => v.id === drillVote) ?? null : null;

  // Вопрос открывается как отдельный экран (только рейка CoopRail), как у совета.
  // Финансовый отчёт — свой детальный экран (тело отчёта + голосование).
  if (openVote) {
    if (openVote.kind === "report") return <ReportVoteDetail vote={openVote} onBack={() => setDrillVote(null)} />;
    if (openVote.kind === "token") return <TokenVoteDetail vote={openVote} onBack={() => setDrillVote(null)} />;
    if (openVote.kind === "member") return <MemberVoteDetail vote={openVote} onBack={() => setDrillVote(null)} />;
    return <PaymentVoteDetail vote={openVote} onBack={() => setDrillVote(null)} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar ?? <CoopSidebar current="voting" routes={CABINET_ROUTES} />}

      <main className="min-w-0 flex-1">
        {/* ЛК (compact): только фильтр-табы + список вопросов (Figma 1857:649902) —
            без шапки, ролевых/режимных табов и правой рейки. */}
        {compact ? (
          <div className="flex flex-col gap-6 px-5 py-8 md:px-[50px]">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="ds-h4 text-foreground">Вопросы голосования</h1>
              <p className="ds-p2 whitespace-nowrap text-foreground-muted">
                Делегируете вопросы голосования от одной роли к другой, создавайте вспомогательные роли для председателей.
              </p>
            </div>
            {questionsView()}
          </div>
        ) : (
        /* Равные отступы 50px: сайдбар→контент (px), контент→рейка (gap),
           рейка→правый край (px). Размеры 1:1 из исходного экрана голосования. */
        <div className="flex gap-[50px] px-5 py-8 md:px-[50px]">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            {/* Заголовок */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="ds-h4 text-foreground">Вопросы голосования по ролям</h1>
              <p className="ds-p2 max-w-[680px] text-foreground-muted">
                Делегируете вопросы голосования от одной роли к другой, создавайте вспомогательные роли для председателей.
              </p>
            </div>

            {/* Роли */}
            <Tabs value={role} onValueChange={(v) => { setRole(v as Role); setDrillRole(null); setDrillToken(null); }} variant="solid" size="m" equal aria-label="Роль" className="w-full">
              {ROLES.map((r) => (
                <Tab key={r.key} value={r.key}>{r.label}</Tab>
              ))}
            </Tabs>

            {/* Переключатель для председателей */}
            {isChair && (
              <div className="mx-auto w-full max-w-[420px]">
                <Tabs value={mode} onValueChange={(v) => setMode(v as "questions" | "assistants")} variant="solid" size="s" equal aria-label="Режим" className="w-full">
                  <Tab value="questions">Вопросы голосования</Tab>
                  <Tab value="assistants">Помощники</Tab>
                </Tabs>
              </div>
            )}

            {/* Контент — mt-2 добавляет 8px к gap-6=24px → итого 32px от ролевых табов */}
            <div className="mt-2">
              {role === "tokeny" ? tokensView() : isChair && mode === "assistants" ? assistantsView() : questionsView()}
            </div>
          </div>

          {/* Правая рейка ролей 1–7 (выровнена с первым вопросом) */}
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
        )}
      </main>
    </div>
  );
}
