"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Tabs, Tab, Checkbox, Button, Modal, Input, EditPencilIcon } from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { useRegFlow, useEnsureInvited } from "./reg-flow";

/**
 * ActivityScreen — «Деятельность» кооператива (таб «Структура»). Открывается из
 * экрана пайщиков (completed) по кнопке «Деятельность». Источник: Figma
 * 2468:280470 / 280473 / 2470:282437.
 *
 * Reuse DS: CoopSidebar · Tabs · CKPCard (пустой ЦКП) · TeamMemberCard
 * (коллектив подразделения) · Checkbox · Button. Каскад структуры (Отдел →
 * Секция → Вопрос → подвопросы) — локальная вёрстка карточек/стрелок.
 *
 * @param paishikiHref Назад в управление пайщиками (рейка/«Пайщики»).
 * @param profileHref  Профиль кооператива (логотип).
 */

const RED = "#e5424d"; // red-400 (рамки/акцент)
const RED_BG = "#fde9ed"; // red-50 (заливка)

/** Пайщики кооператива для попапа «Роли» (Figma 2384:246264). */
interface Member {
  full: string;
  photo: string;
}
const MEMBERS: Member[] = [
  { full: "Александр Дмитров Романович", photo: "/members/aleksandr.png" },
  { full: "Дмитрий Александров Александрович", photo: "/members/dmitriy.png" },
  { full: "Розалина Курт Артуровна", photo: "/members/rozalina.png" },
  { full: "Джо Валенов Валенович", photo: "/members/joe.png" },
  { full: "Антонов Илья Андреевич", photo: "/members/ilya.png" },
];

/** «Фамилия Имя Отчество» → «Фамилия И. О.» для карточки коллектива. */
function abbreviate(full: string): string {
  const [first, ...rest] = full.split(/\s+/).filter(Boolean);
  const initials = rest.map((w) => `${w[0]}.`).join(" ");
  return initials ? `${first} ${initials}` : first;
}

/** Стрелка-связка между колонками каскада — горизонтальный близнец CascadeArrow
 *  (тот же размер/толщина/пропорции, что у стрелки снаружи блока). `top` —
 *  вертикальный сдвиг к центру выбранной карточки слева (двигается по выбору). */
function Arrow({ top = 16 }: { top?: number }) {
  return (
    <div className="flex shrink-0 items-center self-start transition-[margin] duration-200" style={{ color: RED, marginTop: top }}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Стрелка-связка вниз — от выбранной карточки коллектива к каскаду структуры. */
function CascadeArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4" style={{ color: RED }}>
      <path d="M12 4v15M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Карточка узла каскада: active → красная рамка + розовая заливка. */
function StructCard({
  children,
  sub,
  active = false,
  onClick,
}: {
  children: ReactNode;
  sub?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col gap-0.5 rounded-[4px] border px-4 py-3",
        !active && "border-border bg-white",
        onClick && "ds-row cursor-pointer",
      )}
      style={active ? { borderColor: RED, backgroundColor: RED_BG } : undefined}
    >
      <span className="ds-p3 text-foreground">{children}</span>
      {sub != null && <span className="ds-caption text-foreground-subtle">{sub}</span>}
    </div>
  );
}

/** Раскрываемая карточка-вопрос (шеврон справа). */
function QuestionRow({ title, children, defaultOpen = false }: { title: ReactNode; children?: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("overflow-hidden rounded-[4px] border", !open && "border-border")} style={open ? { borderColor: RED } : undefined}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors duration-[250ms] hover:bg-[color:var(--color-surface-hover)]"
        style={open ? { backgroundColor: RED_BG } : undefined}
      >
        <span className="ds-p3 text-foreground">{title}</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-4 shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
          <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && children != null && (
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${RED}` }}>
          <span className="ds-p3 text-foreground-muted">{children}</span>
        </div>
      )}
    </div>
  );
}

/** Заливной треугольник-предупреждение (grey-200, белый «!»). */
function WarnTriangle() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-8">
      <path d="M16 4.5 30 28H2L16 4.5Z" fill="var(--color-grey-200)" />
      <path d="M16 13v6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="23.5" r="1.4" fill="#fff" />
    </svg>
  );
}

/** Карандаш редактирования 8×8 (DS, dark-800 #5A646E). */
function PencilIcon() {
  return <EditPencilIcon className="size-2 text-[#5A646E]" />;
}

/** Статус приглашения члена совета (определяет бейдж карточки). */
type SlotStatus = "inactive" | "pending" | "accepted" | "voting" | "active";
const STATUS_BADGE: Record<SlotStatus, { text: string; bg: string }> = {
  inactive: { text: "Неактивный", bg: "var(--color-red-300)" },
  pending: { text: "Принятие приглашения", bg: "var(--color-yellow-300)" },
  accepted: { text: "Приглашение принято", bg: "var(--color-cyan-300)" },
  voting: { text: "На голосовании", bg: "var(--color-orange-300)" },
  active: { text: "Активный", bg: "var(--color-green-300)" },
};

/**
 * Карточка «Коллектив подразделения» (1:1 Figma 1766:269136 / 2473:367687).
 * Пустая — треугольник «Нет пайщика»; заполненная (`member`) — фото пайщика,
 * аббревиатура ФИО и роль. Бейдж статуса: Неактивный (red) → Принятие приглашения
 * (yellow) → Приглашение принято (cyan). Карандаш открывает попап выбора пайщика.
 */
function CouncilCard({
  member,
  role = "Член совета",
  status = "inactive",
  onEdit,
  selected = false,
  onSelect,
  cabinetView = false,
}: {
  member?: Member;
  role?: ReactNode;
  status?: SlotStatus;
  onEdit?: () => void;
  selected?: boolean;
  onSelect?: () => void;
  /** Кабинетный вид «Деятельность»: карандаш виден всегда (в т.ч. «Активный»),
   *  16×16 белый — как в других подразделениях (Figma 1994-722099). */
  cabinetView?: boolean;
}) {
  const badge = STATUS_BADGE[status];
  const active = status === "active"; // назначен → рамка red-200 (#e89297)
  // Рамка: пустые/в процессе — red-400; назначенные — red-200. Низ заливается
  // red-50 (#fde9ed) у выбранной карточки (активное состояние) и у пустых слотов.
  const borderColor = active ? "#e89297" : RED;
  const bg = selected ? RED_BG : active ? "#fff" : RED_BG;
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative flex w-[157px] flex-col items-center gap-1 overflow-hidden rounded-[4px] border pb-2",
        onSelect && "ds-row cursor-pointer",
      )}
      style={{ borderColor, backgroundColor: bg }}
    >
      {/* Фото-область (белая/фото, нижняя рамка) */}
      <div className="relative h-[128px] w-full" style={{ backgroundColor: "#fff", borderBottom: "1px solid #e89297" }}>
        {member ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photo} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5">
            <WarnTriangle />
            <span className="ds-caption-medium text-[var(--color-grey-300)]">Нет пайщика</span>
          </div>
        )}
        {/* Флоу-создание: карандаш скрыт во время голосования и у назначенных
            (grey-20 24px). Кабинетный вид: карандаш всегда (16×16 белый). */}
        {cabinetView
          ? status !== "voting" && (
              <button
                type="button"
                aria-label="Редактировать участника"
                onClick={onEdit}
                className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-[4px] bg-[#fff] text-[var(--color-dark-800)] shadow-sm transition-colors hover:bg-surface-sunken"
              >
                <EditPencilIcon className="size-2.5" />
              </button>
            )
          : status !== "voting" && status !== "active" && (
              <button
                type="button"
                aria-label="Редактировать"
                onClick={onEdit}
                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-[6px] bg-[var(--color-grey-20)] transition-colors duration-[250ms] hover:bg-[color:var(--color-surface-hover)]"
              >
                <PencilIcon />
              </button>
            )}
      </div>
      {/* Статус-бейдж, наезжающий на низ фото (по центру) */}
      <span className="ds-caption-medium absolute left-1/2 top-[116px] -translate-x-1/2 whitespace-nowrap rounded-[4px] px-1 py-0.5" style={{ backgroundColor: badge.bg, color: "#fff" }}>
        {badge.text}
      </span>
      <div className="flex w-[144px] flex-col items-center gap-2 px-2 pb-1 pt-4 text-center">
        <span className="ds-caption-medium text-foreground">{member ? abbreviate(member.full) : "-"}</span>
        {/* Роль резервирует 2 строки — карточки одинаковой высоты при длинных ролях. */}
        <span className="ds-caption flex min-h-[40px] items-start justify-center text-center text-[var(--color-grey-300)]">{role}</span>
      </div>
    </div>
  );
}

/** Попап выбора пайщика на роль (Figma 2384:246264). */
function RolesModal({
  open,
  onClose,
  members,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  members: Member[];
  onPick: (m: Member) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = members.filter((m) => m.full.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <Modal open={open} onClose={onClose} title="Роли" size="m">
      <div className="flex flex-col gap-0">
        <Input
          size="l"
          placeholder="Поиск"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-2"
        />
        {filtered.map((m) => (
          <button
            key={m.full}
            type="button"
            onClick={() => onPick(m)}
            className="flex items-center gap-4 border-b border-border py-2.5 text-left transition-colors hover:bg-surface-sunken"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.photo} alt="" className="size-8 shrink-0 rounded-full object-cover" />
            <span className="ds-p3 text-foreground">{m.full}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <span className="ds-p3 py-4 text-center text-foreground-subtle">Ничего не найдено</span>
        )}
      </div>
    </Modal>
  );
}

/** Карточка «Добавить члена совета» — серая рамка, без статуса. */
function AddCouncilCard() {
  return (
    <button type="button" className="ds-row relative flex w-[157px] flex-col items-center gap-1 overflow-hidden rounded-[4px] border border-border bg-white pb-2 text-left">
      <div className="relative h-[128px] w-full border-b border-border bg-white">
        <div className="flex h-full flex-col items-center justify-center gap-1.5">
          <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-8">
            <circle cx="16" cy="16" r="15" fill="var(--color-grey-20)" />
            <path d="M16 9v14M9 16h14" stroke="var(--color-grey-300)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="ds-caption-medium text-[var(--color-grey-300)]">Добавить члена совета</span>
        </div>
      </div>
      <span className="ds-caption-medium absolute left-1/2 top-[116px] -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-surface-sunken px-1 py-0.5 text-[var(--color-grey-300)]">
        Нет статуса
      </span>
      <div className="flex w-[144px] flex-col items-center gap-2 px-2 pb-1 pt-4 text-center">
        <span className="ds-caption-medium text-foreground">-</span>
        {/* min-h-[40px] — как у CouncilCard: резерв под 2 строки роли, чтобы все
            карточки коллектива были одной высоты. */}
        <span className="ds-caption flex min-h-[40px] items-start justify-center text-center text-[var(--color-grey-300)]">Роль</span>
      </div>
    </button>
  );
}

/** Описание ЦКП (одно — клампится в свёрнутом виде, раскрывается полностью). */
const CKP_DESC =
  "Администрация обеспечивает работу органов управления кооператива. Департамент готовит заседания совета и правления, ведёт протоколы и следит за тем, чтобы принятые решения были исполнены в срок. Здесь принимают заявления от пайщиков, проверяют приложенные документы и передают их в профильные подразделения. Администрация ведёт реестр пайщиков, хранит уставные документы и оформляет доверенности, а также готовит проекты внутренних регламентов и выносит их на голосование. Отдельная задача департамента — назначение председателей и наделение их полномочиями: подготовка приглашений, сбор согласий и запуск голосований по каждой роли. Ценный конечный продукт — решения органов управления, оформленные документально, принятые в срок и доведённые до исполнителей.";

/** Обложка-градиент + круглый аватар-силуэт подразделения (как профиль-карточка
 *  в сайдбаре, DeptCard active — Figma 1857:649628). */
function CkpAva() {
  return (
    <div className="relative h-[88px] w-full overflow-hidden rounded-t-[3px]">
      <div className="h-[57px] w-full bg-[linear-gradient(120deg,#f9c5d1_0%,#a18cd1_45%,#84fab0_100%)]" />
      <div className="absolute bottom-0 left-1/2 size-[72px] -translate-x-1/2 overflow-hidden rounded-full border-2 border-[#fff] bg-[#e8edf2]">
        <svg viewBox="0 0 64 64" aria-hidden className="size-full">
          <circle cx="32" cy="25" r="11" fill="#b1becb" />
          <path d="M13 60c0-12 9-19 19-19s19 7 19 19z" fill="#b1becb" />
        </svg>
      </div>
    </div>
  );
}

/** Красная иконка-меню (2×2 сетка + список) в правом верхнем углу ЦКП (Figma «menu-2»). */
function CkpMenuIcon({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <button type="button" aria-label="Структура компании" onClick={onClick} className={cn("text-[#e1838b] transition-opacity hover:opacity-70", className)}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" fill="currentColor" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" fill="currentColor" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" fill="currentColor" />
        <path d="M14 15.4h7M14 17.9h7M14 20.4h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/**
 * ЦКП «Ценный конечный продукт» (1:1 Figma 1977:798752 свёрнутый / 2163:755194
 * раскрытый). Свёрнуто: карточка-аватар слева + заголовок, описание (3 строки) и
 * центрированная ссылка «Смотреть всю информацию». Раскрыто: аватар + заголовок
 * с подписями сбоку, описание во всю ширину и ссылка «Свернуть».
 */
function CkpBlock() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  // Клик по грид-иконке → «Структура» кооператива с выделенной «Администрацией»
  // (этот ЦКП — департамент «Администрация»).
  const goStructure = () => router.push("/cabinet/about?view=structure&focus=administration");

  if (open) {
    return (
      <div className="relative flex w-full flex-col gap-4 rounded-[4px] border border-border bg-white p-4">
        <CkpMenuIcon className="absolute right-4 top-4" onClick={goStructure} />
        {/* Аватар + заголовок с подписями */}
        <div className="flex items-start gap-4 pr-9">
          <div className="w-[142px] shrink-0 overflow-clip rounded-[4px] border border-border pb-1">
            <CkpAva />
          </div>
          <div className="flex flex-col gap-0.5 pt-2">
            <span className="ds-p2-medium text-foreground">Ценный конечный продукт</span>
            <span className="ds-caption-medium text-foreground-muted">Администрация</span>
            <span className="ds-caption text-[var(--color-grey-300)]">Департамент</span>
          </div>
        </div>
        {/* Описание во всю ширину + линия + «Свернуть» */}
        <div className="flex flex-col items-center gap-4">
          <p className="ds-p3 w-full text-foreground-muted">{CKP_DESC}</p>
          <div className="h-px w-full bg-border" />
          <button type="button" onClick={() => setOpen(false)} className="ds-caption-medium text-[var(--color-blue-midhub-500)] transition-colors hover:text-[color:var(--color-blue-midhub-600)]">
            Свернуть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full gap-4 rounded-[4px] border border-border bg-white p-[7px]">
      <CkpMenuIcon className="absolute right-4 top-4" onClick={goStructure} />
      {/* Аватар-карточка */}
      <div className="flex w-[142px] shrink-0 flex-col items-center gap-1 overflow-clip rounded-[4px] border border-border pb-1">
        <CkpAva />
        <span className="ds-caption-medium text-foreground">Администрация</span>
        <span className="ds-caption text-[var(--color-grey-300)]">Департамент</span>
      </div>
      {/* Контент: заголовок + описание (3 строки) + линия + центрированная ссылка */}
      <div className="flex min-h-[130px] flex-1 flex-col gap-2 pr-9 pt-2">
        <span className="ds-p2-medium text-foreground">Ценный конечный продукт</span>
        <p className="ds-p3 line-clamp-3 text-foreground-muted">{CKP_DESC}</p>
        <div className="h-px w-full bg-border" />
        <button type="button" onClick={() => setOpen(true)} className="ds-caption-medium self-center text-[var(--color-blue-midhub-500)] transition-colors hover:text-[color:var(--color-blue-midhub-600)]">
          Смотреть всю информацию
        </button>
      </div>
    </div>
  );
}

/** Ответ на раскрытый подвопрос каскада («В какой срок рассматривают заявление»). */
const QUESTION_ANSWER =
  "Заявление рассматривают на ближайшем заседании совета, но не позднее 30 дней с даты подачи. Решение оформляют протоколом, копию направляют заявителю в личный кабинет. Если к заявлению не приложены документы из списка, срок считают с даты, когда пайщик донесёт недостающее.";

/** Этапы формирования совета (роль / правила / CTA / число слотов / отдел). */
const STAGES = [
  { role: "Член совета", rule: "Правила создания совета", cta: "Отправить приглашения", count: 3, dept: "Отдел совета" },
  { role: "Председатель совета", rule: "Правила назначения председателя совета", cta: "Отправить приглашение", count: 1, dept: "Отдел пред. совета" },
  { role: "Председатель правления", rule: "Правила назначения председателя правления", cta: "Отправить приглашение", count: 1, dept: "Отдел пред. правления" },
];

/**
 * Отделы каскада — общий список; видимая часть растёт по этапам совета (Figma:
 * на этапе совета виден только «Отдел совета», далее добавляются нижние).
 * Активный — отдел роли выбранной карточки (см. ROLE_DEPT).
 */
const DEPTS = ["Отдел совета", "Отдел пред. совета", "Отдел пред. правления"];
const ROLE_DEPT: Record<string, string> = {
  "Член совета": "Отдел совета",
  "Председатель совета": "Отдел пред. совета",
  "Председатель правления": "Отдел пред. правления",
};

/** Узел каскада структуры (секция/функция). */
interface CascadeNode {
  title: string;
  active?: boolean;
}
interface CascadeConfig {
  sections: CascadeNode[];
  funcs: CascadeNode[];
  /** Подпись-роль под функциями. */
  funcRole: string;
}

const FUNC_TITLES = [
  "Создание и удаление ПП",
  "Прием и удаление пайщиков",
  "Назначения председателей и наделение их полномочиями",
];
const mkFuncs = (activeIdx: number): CascadeNode[] =>
  FUNC_TITLES.map((title, i) => ({ title, active: i === activeIdx }));

/**
 * Каскад структуры зависит от роли выбранной карточки коллектива (Figma
 * 2473:371867 / 2473:376436). «Председатель правления» — данные из дизайна;
 * «Член совета» — каскад совета; «Председатель совета» — промежуточный вариант.
 */
const ROLE_CASCADE: Record<string, CascadeConfig> = {
  "Член совета": {
    sections: [
      { title: "Секция вопросов голосования", active: true },
      { title: "Секция администрирования членов кооператива" },
      { title: "Секция фин. деятельности кооператива" },
    ],
    funcs: mkFuncs(1),
    funcRole: "Председатель совета",
  },
  "Председатель совета": {
    sections: [
      { title: "Секция принятия решений", active: true },
      { title: "Секция администрирования членов кооператива" },
      { title: "Секция фин. деятельности кооператива" },
    ],
    funcs: mkFuncs(1),
    funcRole: "Председатель совета",
  },
  "Председатель правления": {
    sections: [{ title: "Секция принятия решений", active: true }],
    funcs: mkFuncs(1),
    funcRole: "Председатель правления",
  },
};

/** Песочные часы 8px (grey-300) для строки «Выполнено: X%». */
function HourglassIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-2 shrink-0 text-[var(--color-grey-300)]">
      <path
        d="M3.5 1.5h9M3.5 14.5h9M5 1.5v2c0 1.7 3 2.8 3 4.5 0-1.7 3-2.8 3-4.5v-2M5 14.5v-2c0-1.7 3-2.8 3-4.5 0 1.7 3 2.8 3 4.5v2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Прогресс-бар: серая дорожка + зелёная заливка с точкой-указателем (Figma «line complete» / «point»). */
function ProgressBar({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative h-1 w-full rounded-full bg-[var(--color-grey-90)]">
      {p > 0 && (
        <>
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-green-300)]"
            style={{ width: `${p}%` }}
          />
          <div
            className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--color-green-300)] bg-white"
            style={{ left: `${p}%` }}
          />
        </>
      )}
    </div>
  );
}

/**
 * Карточка-прогресс (1:1 Figma 1637:234385 / 1556:185060) — общая для «План
 * развития» и «Обучение». Сверху «Выполнено: X%» с песочными часами и прогресс-
 * бар, ниже заголовок + описание, внизу синяя ссылка-действие.
 */
function ProgressCard({
  percent,
  title,
  description,
  action,
  className,
}: {
  percent: number;
  title: string;
  description: string;
  action: string;
  className?: string;
}) {
  return (
    <div className={cn("ds-row flex flex-col gap-3 rounded-[4px] border border-border bg-white p-4", className)}>
      <div className="flex items-center gap-1.5">
        <HourglassIcon />
        <span className="ds-caption text-foreground-subtle">Выполнено: {percent}%</span>
      </div>
      <ProgressBar percent={percent} />
      <div className="flex flex-1 flex-col gap-1 pt-3">
        <span className="ds-p3-medium text-foreground">{title}</span>
        <span className="ds-caption text-foreground-muted">{description}</span>
      </div>
      <button type="button" className="ds-caption-medium self-start text-[var(--color-blue-midhub-500)] transition-colors hover:text-[color:var(--color-blue-midhub-600)]">
        {action}
      </button>
    </div>
  );
}

const PLANS = [
  {
    title: "План развития на 2025 год",
    percent: 62,
    desc: "Собрать совет и правление, утвердить внутренние регламенты и вывести кооператив на рабочий режим. К концу года — не менее 50 активных пайщиков, настроенный целевой счёт с подсчётами и отвалидированный устав. Ответственный — председатель правления, отчёт по этапам раз в квартал на заседании совета.",
  },
  {
    title: "План запуска совместных закупок",
    percent: 28,
    desc: "Наладить оптовую закупку инвентаря и расходных материалов для пайщиков через маршрутный счёт. Нужно подобрать двух-трёх поставщиков, согласовать условия и цены, подготовить типовой договор поставки и провести первую пробную закупку. Экономия для пайщика по расчёту — от 15% против розницы.",
  },
];

/** Таб «План развития» — список планов с прогресс-карточками (Figma 1857:649525). */
export function PlanPanel() {
  return (
    <div className="flex flex-col gap-6">
      {PLANS.map((p) => (
        <div key={p.title} className="flex flex-col gap-4">
          <span className="ds-p2-medium text-foreground">{p.title}</span>
          <ProgressCard percent={p.percent} title="Описание" description={p.desc} action="Подробнее" className="w-full" />
        </div>
      ))}
    </div>
  );
}

const EDU_STAGES = ["1-этап", "2-этап", "3-этап", "4-этап"];
const EDU_TASKS = [
  {
    title: "Устав и структура кооператива",
    percent: 80,
    action: "Продолжить",
    desc: "Разобрать устав по разделам и понять, кто за что отвечает: совет, правление, департаменты.",
  },
  {
    title: "Права и обязанности пайщика",
    percent: 45,
    action: "Продолжить",
    desc: "Что пайщик может требовать от кооператива и что кооператив вправе требовать от него.",
  },
  {
    title: "Как проходят голосования",
    percent: 0,
    action: "Начать",
    desc: "Кворум, консенсус, сроки и токен роли. Разбираем на примере голосования по составу совета.",
  },
  {
    title: "Паевые и целевые взносы",
    percent: 0,
    action: "Начать",
    desc: "Чем паевой взнос отличается от целевого, когда его вносят и на что кооператив вправе его тратить.",
  },
  {
    title: "Работа с документами кооператива",
    percent: 0,
    action: "Начать",
    desc: "Как подать заявление, приложить документы и отследить статус согласования в личном кабинете.",
  },
  {
    title: "Подразделения и их задачи",
    percent: 0,
    action: "Начать",
    desc: "Кто такой валидатор, зачем нужен регулятор и в какое подразделение идти со своим вопросом.",
  },
];

/** Таб «Обучение» — подэтапы, общий прогресс этапа и сетка карточек-заданий (Figma 1857:649528). */
export function EduPanel() {
  const [stage, setStage] = useState("1-этап");
  const stageNo = EDU_STAGES.indexOf(stage) + 1;
  return (
    <div className="flex flex-col gap-8">
      {/* Подэтапы 1–4 (по центру) */}
      <div className="flex justify-center">
        <Tabs value={stage} onValueChange={setStage} variant="solid" size="m" aria-label="Этап обучения">
          {EDU_STAGES.map((s) => (
            <Tab key={s} value={s}>{s}</Tab>
          ))}
        </Tabs>
      </div>

      {/* Общий прогресс этапа */}
      <div className="flex flex-col gap-4">
        <span className="ds-p2-medium text-foreground">Общий прогресс {stageNo}-го этапа</span>
        <ProgressBar percent={21} />
      </div>

      {/* Задания */}
      <div className="flex flex-col gap-4">
        <span className="ds-p2-medium text-foreground">Задания</span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {EDU_TASKS.map((t) => (
            <ProgressCard key={t.title} percent={t.percent} title={t.title} description={t.desc} action={t.action} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActivityScreen({ seedStage, routes, sidebar, cabinetView = false }: { seedStage?: number; routes?: Partial<CoopRoutes>; sidebar?: ReactNode; cabinetView?: boolean } = {}) {
  const flow = useRegFlow();
  // Пайщики уже приглашены + ПП создано к моменту совета (для консистентности
  // страницы «Пайщики» при переходе из сайдбара).
  useEnsureInvited();
  // Прямой заход на нужный этап совета по ссылке (?stage=N) — посев один раз.
  useEffect(() => {
    if (seedStage != null) flow.seedCouncilStage(seedStage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const stage = Math.min(flow.councilStage, 3); // 0 совет · 1 пред. совета · 2 пред. правления · 3 готово
  const stageDone = stage >= 3;
  const cfg = STAGES[Math.min(stage, 2)];

  const [tab, setTab] = useState("struct");
  const [agreed, setAgreed] = useState(false);
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  // Выбранная карточка коллектива (ключ) — от неё зависят стрелка и каскад.
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  // Выбранные узлы каскада по клику (null — берётся активный из конфига).
  const [selDept, setSelDept] = useState<number | null>(null);
  const [selSection, setSelSection] = useState<number | null>(null);
  const [selFunc, setSelFunc] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "sending" | "done">("idle");
  const [accepted, setAccepted] = useState<boolean[]>([]);

  // Слоты текущего этапа: совет → 3 слота; председатели → 1 слот.
  const currentSlots = useMemo<(number | null)[]>(() => {
    if (stage === 0) return flow.councilSlots;
    if (stage === 1) return [flow.chairs[0]];
    if (stage === 2) return [flow.chairs[1]];
    return [];
  }, [stage, flow.councilSlots, flow.chairs]);

  const setCurrentSlots = (next: (number | null)[]) => {
    if (stage === 0) flow.setCouncilSlots(next);
    else if (stage === 1) flow.setChairs([next[0] ?? null, flow.chairs[1]]);
    else if (stage === 2) flow.setChairs([flow.chairs[0], next[0] ?? null]);
  };

  // Сброс фазы/принятий при смене этапа.
  useEffect(() => {
    setPhase("idle");
    setAgreed(false);
    setAccepted(Array.from({ length: cfg.count }, () => false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Уже назначенные (на всех этапах) — исключаем из попапа.
  const assigned = [...flow.councilSlots, ...flow.chairs].filter((x): x is number => x != null);
  const available = MEMBERS.filter((_, i) => !assigned.includes(i));

  const pick = (m: Member) => {
    const memberIdx = MEMBERS.indexOf(m);
    setCurrentSlots(currentSlots.map((v, i) => (i === pickerFor ? memberIdx : v)));
    setPickerFor(null);
  };

  const allFilled = currentSlots.length > 0 && currentSlots.every((s) => s != null);
  // «На голосовании» применяется к слотам этапа ТОЛЬКО когда они заполнены: пустой
  // слот (пайщик ещё не выбран) не должен помечаться голосованием — иначе теряется
  // карандаш выбора. votingStarted может быть true из-за захода на «Вопросы голосования».
  const voting = flow.votingStarted && allFilled;
  const canSend = agreed && allFilled;
  const send = () => {
    setAccepted(Array.from({ length: cfg.count }, () => false));
    setPhase("sending");
  };

  // Поочерёдное принятие приглашения текущего этапа.
  useEffect(() => {
    if (phase !== "sending") return;
    const next = currentSlots.findIndex((m, i) => m != null && !accepted[i]);
    if (next === -1) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => {
      setAccepted((prev) => prev.map((v, i) => (i === next ? true : v)));
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, accepted]);

  const slotStatus = (i: number): SlotStatus =>
    voting ? "voting" : phase === "idle" ? "inactive" : accepted[i] ? "accepted" : "pending";

  // Назначенные на завершённых этапах — зелёные «Активный». Порядок как в Figma:
  // сначала председатели (по старшинству), затем члены совета.
  const completed: { member: Member; role: string }[] = [];
  if (stage >= 3 && flow.chairs[1] != null) completed.push({ member: MEMBERS[flow.chairs[1]], role: "Председатель правления" });
  if (stage >= 2 && flow.chairs[0] != null) completed.push({ member: MEMBERS[flow.chairs[0]], role: "Председатель совета" });
  if (stage >= 1) flow.councilSlots.forEach((idx) => idx != null && completed.push({ member: MEMBERS[idx], role: "Член совета" }));
  // Кабинет-вид: доп. карточка «Помощник пред. правления» в конце (после Розалины).
  if (cabinetView && stage >= 3)
    completed.push({ member: { full: "Анна Грум Ивановна", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&q=80" }, role: "Помощник пред. правления" });

  const editable = !voting && phase === "idle";

  // Единый список карточек коллектива: текущие слоты этапа + назначенные. От
  // выбранной карточки зависят позиция стрелки-связки и каскад структуры.
  const cards: { key: string; member?: Member; role: string; status: SlotStatus; onEdit?: () => void }[] = [];
  if (!stageDone) {
    currentSlots.forEach((memberIdx, i) =>
      cards.push({
        key: `cur-${i}`,
        member: memberIdx != null ? MEMBERS[memberIdx] : undefined,
        role: cfg.role,
        status: slotStatus(i),
        onEdit: editable ? () => setPickerFor(i) : undefined,
      }),
    );
  }
  completed.forEach((c, i) => cards.push({ key: `done-${i}`, member: c.member, role: c.role, status: "active", onEdit: cabinetView ? () => {} : undefined }));

  // Активная карточка: выбранная пользователем либо первая с пайщиком.
  const activeKey = selectedKey ?? cards.find((c) => c.member)?.key ?? null;
  const selectedRole = cards.find((c) => c.key === activeKey)?.role ?? (stageDone ? "Председатель правления" : cfg.role);
  const cascade = ROLE_CASCADE[selectedRole] ?? ROLE_CASCADE["Член совета"];
  // Видимые отделы растут по этапам; активный — отдел выбранной роли.
  const visibleDepts = DEPTS.slice(0, stageDone ? DEPTS.length : stage + 1);
  const activeDept = ROLE_DEPT[selectedRole];

  // Смена роли (выбор карточки) сбрасывает ручной выбор узлов каскада на дефолт.
  useEffect(() => {
    setSelDept(null);
    setSelSection(null);
    setSelFunc(null);
  }, [selectedRole]);

  // Активные узлы каскада: ручной выбор по клику либо дефолт из конфига/роли.
  const activeDeptIdx = selDept ?? Math.max(0, visibleDepts.indexOf(activeDept));
  const activeSectionIdx = selSection ?? Math.max(0, cascade.sections.findIndex((s) => s.active));
  const activeFuncIdx = selFunc ?? Math.max(0, cascade.funcs.findIndex((f) => f.active));

  // Стрелки-связки между колонками каскада двигаются к центру ВЫБРАННОЙ карточки
  // слева (источник связки). Высоты карточек переменные (1–2 строки), поэтому
  // позицию меряем по DOM относительно верха строки каскада.
  const cascadeRowRef = useRef<HTMLDivElement>(null);
  const deptRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const funcRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [arrowTops, setArrowTops] = useState<number[]>([16, 16, 16]);
  // Зависимости — только примитивы (массивы cascade/visibleDepts пересоздаются
  // каждый рендер). Обновляем состояние лишь при реальном изменении значений,
  // иначе useLayoutEffect зациклит setState→render.
  useLayoutEffect(() => {
    const row = cascadeRowRef.current;
    if (!row) return;
    const rowTop = row.getBoundingClientRect().top;
    const centerOf = (el: HTMLDivElement | null) => {
      if (!el) return 16;
      const r = el.getBoundingClientRect();
      return r.top - rowTop + r.height / 2 - 8; // 8 — половина высоты стрелки (16px)
    };
    const next = [
      centerOf(deptRefs.current[activeDeptIdx]),
      centerOf(sectionRefs.current[activeSectionIdx]),
      centerOf(funcRefs.current[activeFuncIdx]),
    ];
    setArrowTops((prev) => (prev.every((v, i) => Math.abs(v - next[i]) < 0.5) ? prev : next));
  }, [activeDeptIdx, activeSectionIdx, activeFuncIdx, selectedRole, visibleDepts.length, tab]);

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar ?? <CoopSidebar current="activity" routes={routes} />}

      {/* Контент */}
      <main className="min-w-0 flex-1">
        {/* Верхние табы — на всю ширину, прилеплены к верху (без боковых отступов
            и скругления; нижняя рамка — разделитель). */}
        <Tabs
          value={tab}
          onValueChange={setTab}
          variant="solid-light"
          size="l"
          equal
          aria-label="Раздел"
          className="w-full rounded-none border-x-0 border-t-0"
        >
          <Tab value="struct">Структура</Tab>
          <Tab value="plan">План развития</Tab>
          <Tab value="edu">Обучение</Tab>
        </Tabs>

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

        {tab === "struct" && (
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* ЦКП «Ценный конечный продукт» (свёрнут/раскрыт) */}
          <CkpBlock />

          {/* Коллектив подразделения */}
          <div className="flex flex-col gap-4">
            <span className="ds-p2-medium text-foreground">Коллектив подразделения</span>
            <div className="flex flex-wrap items-start gap-1.5">
              {cards.map((c) => {
                const isActive = c.member != null && c.key === activeKey;
                return (
                  <div key={c.key} className="flex flex-col items-center gap-3">
                    <CouncilCard
                      member={c.member}
                      role={c.role}
                      status={c.status}
                      onEdit={c.onEdit}
                      selected={isActive}
                      onSelect={c.member ? () => setSelectedKey(c.key) : undefined}
                      cabinetView={cabinetView}
                    />
                    {/* Стрелка-связка от выбранной карточки к каскаду структуры */}
                    {isActive && <CascadeArrow />}
                  </div>
                );
              })}
              <AddCouncilCard />
            </div>
          </div>

          {/* Каскад структуры (красная пунктирная рамка) — зависит от роли
              выбранной карточки коллектива (cascade). -mt-5 сводит общий gap-8
              секции к 12px под стрелкой-связкой. */}
          <div className="-mt-5 overflow-x-auto rounded-[10px] border-2 border-dashed border-[var(--color-red-300)] p-5">
            <div ref={cascadeRowRef} className="flex items-start gap-3">
              {/* Отделы (видимая часть растёт по этапам; активный — по клику) */}
              <div className="flex w-[200px] shrink-0 flex-col gap-3">
                {visibleDepts.map((d, i) => (
                  <div key={d} ref={(el) => { deptRefs.current[i] = el; }}>
                    <StructCard active={i === activeDeptIdx} onClick={() => setSelDept(i)}>{d}</StructCard>
                  </div>
                ))}
              </div>
              <Arrow top={arrowTops[0]} />
              {/* Секции (активная — по клику) */}
              <div className="flex w-[230px] shrink-0 flex-col gap-3">
                {cascade.sections.map((s, i) => (
                  <div key={s.title} ref={(el) => { sectionRefs.current[i] = el; }}>
                    <StructCard active={i === activeSectionIdx} onClick={() => setSelSection(i)}>{s.title}</StructCard>
                  </div>
                ))}
              </div>
              <Arrow top={arrowTops[1]} />
              {/* Функции (активная — по клику) */}
              <div className="flex w-[260px] shrink-0 flex-col gap-3">
                {cascade.funcs.map((f, i) => (
                  <div key={f.title} ref={(el) => { funcRefs.current[i] = el; }}>
                    <StructCard active={i === activeFuncIdx} sub={cascade.funcRole} onClick={() => setSelFunc(i)}>{f.title}</StructCard>
                  </div>
                ))}
              </div>
              <Arrow top={arrowTops[2]} />
              {/* Подвопросы (раскрываемые) */}
              <div className="flex w-[260px] shrink-0 flex-col gap-3">
                <QuestionRow title="Кто рассматривает заявление о приёме в пайщики?" />
                <QuestionRow title="В какой срок принимают решение по заявлению?" defaultOpen>{QUESTION_ANSWER}</QuestionRow>
                <QuestionRow title="На каком основании пайщика исключают из кооператива?" />
              </div>
            </div>
          </div>

          {/* Футер: правила + CTA этапа (gap 40px). idle → «Отправить
              приглашени(е/я)»; sending → крутилка; приняли → «Запустить
              голосование». Скрыт, когда совет полностью сформирован. */}
          {!stageDone && (
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Checkbox
                size="xxs"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={!editable}
                label={<span className="text-primary">{cfg.rule}</span>}
              />
              {voting ? (
                <Button size="l" className="sm:w-auto" fullWidth loading>
                  Запустить голосование
                </Button>
              ) : phase === "done" ? (
                <Button size="l" className="sm:w-auto" fullWidth onClick={flow.startVoting}>
                  Запустить голосование
                </Button>
              ) : phase === "sending" ? (
                <Button size="l" className="sm:w-auto" fullWidth loading>
                  {cfg.cta}
                </Button>
              ) : (
                <Button size="l" disabled={!canSend} className="sm:w-auto" fullWidth onClick={send}>
                  {cfg.cta}
                </Button>
              )}
            </div>
          )}
        </div>
        )}
      </main>

      <RolesModal
        open={pickerFor != null}
        onClose={() => setPickerFor(null)}
        members={available}
        onPick={pick}
      />
    </div>
  );
}
