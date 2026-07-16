"use client";

import { type ReactNode, useState } from "react";
import {
  Tabs,
  Tab,
  Badge,
  Button,
  Item,
  Toggle,
  SearchBar,
  QuestionCard,
  MidhubLogo,
} from "@/components/ds";
import { ChatPanel, BackIcon, DefTable, VerificationBadge, VERIFY_ORANGE, type DefRow } from "../../document/_components/document-shared";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * ValidatorTemplatesScreen — раздел «Шаблоны» кабинета валидатора (№2).
 * Figma: Доступные 6729-376791 · Недоступные 6729-376901.
 *
 * Reuse: DS ToggleButton (тулбар каналов) · SearchBar (поиск + фильтр) ·
 * Tabs (Доступные/Недоступные) · Item + Badge (категории/шаблоны) · EmptyState
 * (недоступные). Карточки организаций — лёгкий локальный OrgCard (нет точного
 * композита под «название + счётчик + ООО», селект по рамке).
 */

type Avail = "available" | "unavailable";

const ORGS = [
  { id: "midhub", name: "MIDHUB", org: 'ООО "Мирхаб"', count: "99+" },
  { id: "ruswan", name: "RUSWAN", org: 'ООО "Ruswan"', count: "20" },
  { id: "mrmark", name: "MR.MARK", org: 'ООО "Mr.Mark"', count: "14" },
  { id: "waves", name: "WAVES", org: 'ООО "Waves"', count: "" },
  { id: "wwf", name: "WWF", org: 'ООО "WWF"', count: "6" },
];

const CATEGORIES: Record<Avail, { id: string; label: string; count: number }[]> = {
  available: [
    { id: "id", label: "Удостоверяющие личность", count: 6 },
    { id: "edu", label: "Образование", count: 4 },
    { id: "cert", label: "Сертификаты валидаторов", count: 2 },
    { id: "civil", label: "Общегражданские", count: 1 },
    { id: "med", label: "Медицина", count: 1 },
  ],
  unavailable: [
    { id: "id", label: "Удостоверяющие личность", count: 6 },
    { id: "edu", label: "Образование", count: 4 },
    { id: "cert", label: "Сертификаты валидаторов", count: 2 },
  ],
};

// Документы зависят от выбранной категории слева (левая и правая части связаны).
const CATEGORY_DOCS: Record<string, string[]> = {
  id: ["Военный билет", "Дипломатический паспорт", "Служебный паспорт", "Свидетельство о рождении"],
  edu: ["Диплом о высшем образовании", "Аттестат", "Сертификат курса", "Студенческий билет"],
  cert: ["Сертификат валидатора", "Лицензия"],
  civil: ["Паспорт РФ"],
  med: ["Медицинская книжка"],
};

// Канал «портфель» — активированные шаблоны (без таб Доступные/Недоступные).
const PORTFOLIO_CATEGORIES = [
  { id: "med", label: "Медицина", count: 1 },
  { id: "edu", label: "Образование", count: 4 },
  { id: "cert", label: "Сертификаты валидаторов", count: 2 },
];

// Канал «глобус» — страны (с флагами) + документы выбранной страны.
type FlagId = "ru" | "be" | "at" | "bg";
const COUNTRIES: { id: string; label: string; flag: FlagId; count: number }[] = [
  { id: "ru", label: "Россия", flag: "ru", count: 7 },
  { id: "be", label: "Бельгия", flag: "be", count: 16 },
  { id: "at", label: "Австрия", flag: "at", count: 26 },
  { id: "bg", label: "Болгария", flag: "bg", count: 9 },
];
const GLOBE_DOCS: Record<Avail, string[]> = {
  available: ["Рабочие документы", "Образование", "Медицина", "Сертификаты валидаторов"],
  unavailable: ["Рабочие документы", "Образование"],
};
// Глобус «Недоступные»: клик по категории → подсписок документов (списком с подсписком).
const GLOBE_SUBDOCS: Record<string, string[]> = {
  "Рабочие документы": ["Трудовой договор", "Зарплатный проект", "Международный перевод", "Сертификат"],
  "Образование": ["Диплом", "Аттестат", "Сертификат курса"],
};

/** Прямоугольный мини-флаг страны (горизонт/вертикальные полосы). */
function Flag({ id }: { id: FlagId }) {
  const stripes: Record<FlagId, { dir: "h" | "v"; colors: string[] }> = {
    ru: { dir: "h", colors: ["#fff", "#0039a6", "#d52b1e"] },
    be: { dir: "v", colors: ["#000", "#fae042", "#ed2939"] },
    at: { dir: "h", colors: ["#ed2939", "#fff", "#ed2939"] },
    bg: { dir: "h", colors: ["#fff", "#00966e", "#d62612"] },
  };
  const f = stripes[id];
  return (
    <span className={`inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] border border-[#e6e9ee] ${f.dir === "h" ? "flex-col" : ""}`} aria-hidden>
      {f.colors.map((c, i) => <span key={i} className="flex-1" style={{ backgroundColor: c }} />)}
    </span>
  );
}

// ── Иконки ───────────────────────────────────────────────────────────────────
/** Белая залитая мини-папка (внутри серого кружка категории). */
const FolderMini = () => (
  <svg viewBox="0 0 20 18" width="16" height="16" fill="#fff" aria-hidden>
    <path d="M2 4a2 2 0 0 1 2-2h3.2a2 2 0 0 1 1.4.6L10 4h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
    <path d="M20.0013 8.66797C19.2653 8.66797 18.668 8.07064 18.668 7.33464V5.33464H13.3346V7.33464C13.3346 8.07064 12.7373 8.66797 12.0013 8.66797C11.2653 8.66797 10.668 8.07064 10.668 7.33464V5.33464C10.668 3.86397 11.864 2.66797 13.3346 2.66797H18.668C20.1386 2.66797 21.3346 3.86397 21.3346 5.33464V7.33464C21.3346 8.07064 20.7373 8.66797 20.0013 8.66797Z" />
    <path d="M16.9467 20.5055C16.7067 20.5989 16.36 20.6655 16 20.6655C15.64 20.6655 15.2933 20.5989 14.9733 20.4789L0 15.4922V25.6655C0 27.6922 1.64 29.3322 3.66667 29.3322H28.3333C30.36 29.3322 32 27.6922 32 25.6655V15.4922L16.9467 20.5055Z" />
    <path d="M32 10.3346V13.388L16.32 18.6146C16.2133 18.6546 16.1067 18.668 16 18.668C15.8933 18.668 15.7867 18.6546 15.68 18.6146L0 13.388V10.3346C0 8.30797 1.64 6.66797 3.66667 6.66797H28.3333C30.36 6.66797 32 8.30797 32 10.3346Z" />
  </svg>
);
const DocsIcon = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
    <path d="M5.33203 9C5.33203 5.508 8.17336 2.66667 11.6654 2.66667H23.8427C23.404 1.132 22.0054 0 20.332 0H4.9987C2.97603 0 1.33203 1.644 1.33203 3.66667V24.3333C1.33203 26.356 2.97603 28 4.9987 28H5.33203V9Z" />
    <path d="M27 5.33203H11.6667C9.644 5.33203 8 6.97603 8 8.9987V28.332C8 30.3547 9.644 31.9987 11.6667 31.9987H27C29.0227 31.9987 30.6667 30.3547 30.6667 28.332V8.9987C30.6667 6.97603 29.0227 5.33203 27 5.33203ZM24.3333 27.9987H14.3333C13.7813 27.9987 13.3333 27.5507 13.3333 26.9987C13.3333 26.4467 13.7813 25.9987 14.3333 25.9987H24.3333C24.8853 25.9987 25.3333 26.4467 25.3333 26.9987C25.3333 27.5507 24.8853 27.9987 24.3333 27.9987ZM24.3333 22.6654H14.3333C13.7813 22.6654 13.3333 22.2174 13.3333 21.6654C13.3333 21.1134 13.7813 20.6654 14.3333 20.6654H24.3333C24.8853 20.6654 25.3333 21.1134 25.3333 21.6654C25.3333 22.2174 24.8853 22.6654 24.3333 22.6654ZM24.3333 17.9987H14.3333C13.7813 17.9987 13.3333 17.5507 13.3333 16.9987C13.3333 16.4467 13.7813 15.9987 14.3333 15.9987H24.3333C24.8853 15.9987 25.3333 16.4467 25.3333 16.9987C25.3333 17.5507 24.8853 17.9987 24.3333 17.9987ZM24.3333 12.6654H14.3333C13.7813 12.6654 13.3333 12.2174 13.3333 11.6654C13.3333 11.1134 13.7813 10.6654 14.3333 10.6654H24.3333C24.8853 10.6654 25.3333 11.1134 25.3333 11.6654C25.3333 12.2174 24.8853 12.6654 24.3333 12.6654Z" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
    <path d="M22.7314 8.83984C20.9068 9.22082 18.9519 9.44635 16.9375 9.49998V15.0636H23.5316C23.4709 12.8722 23.1974 10.7654 22.7314 8.83984Z" />
    <path d="M6.59232 15.0664C6.65414 12.7275 6.9468 10.4703 7.44836 8.39852C5.80586 7.93746 4.30306 7.3414 2.99978 6.625C1.21476 9.08816 0.175958 11.9956 0 15.0664H6.59232Z" />
    <path d="M6.59232 16.9375H0C0.175958 20.0083 1.21476 22.9158 2.99972 25.3789C4.303 24.6625 5.80586 24.0664 7.44836 23.6054C6.9468 21.5336 6.65408 19.2764 6.59232 16.9375Z" />
    <path d="M18.6962 1.08477C18.1229 0.599776 17.5342 0.273051 16.9375 0.105469V7.62459C18.7787 7.57333 20.5598 7.37143 22.2203 7.03389C21.9156 6.10254 21.5614 5.22775 21.1595 4.42409C20.4376 2.9803 19.6088 1.85673 18.6962 1.08477Z" />
    <path d="M7.94908 25.4141C6.57649 25.7995 5.31509 26.2856 4.20703 26.863C4.3558 27.0242 4.50732 27.1835 4.66333 27.3396C6.46585 29.1421 8.6221 30.4622 10.9755 31.2355C10.3163 30.4563 9.70659 29.5153 9.15991 28.4219C8.69729 27.4966 8.29268 26.4881 7.94908 25.4141Z" />
    <path d="M10.8381 4.42409C10.4363 5.22775 10.0821 6.10254 9.77734 7.03389C11.4378 7.37143 13.2189 7.57333 15.0601 7.62459V0.105469C14.4633 0.273113 13.8747 0.599776 13.3014 1.08477C12.3888 1.85673 11.56 2.9803 10.8381 4.42409Z" />
    <path d="M25.4068 16.9375C25.345 19.2764 25.0523 21.5336 24.5508 23.6054C26.1933 24.0664 27.6961 24.6625 28.9994 25.3789C30.7844 22.9158 31.8231 20.0084 31.9991 16.9375H25.4068Z" />
    <path d="M24.05 6.5948C25.4226 6.20931 26.684 5.72326 27.792 5.14588C27.6432 4.98467 27.4917 4.82534 27.3357 4.66932C25.5332 2.86687 23.3769 1.54678 21.0234 0.773438C21.6827 1.55265 22.2924 2.4937 22.8391 3.58701C23.3017 4.51224 23.7064 5.52086 24.05 6.5948Z" />
    <path d="M21.1596 27.5755C21.5614 26.7719 21.9156 25.897 22.2203 24.9657C20.5598 24.6282 18.7787 24.4263 16.9375 24.375V31.8941C17.5343 31.7265 18.1229 31.3998 18.6962 30.9148C19.6088 30.1428 20.4376 29.0194 21.1596 27.5755Z" />
    <path d="M24.5508 8.39455C25.0523 10.4663 25.345 12.7235 25.4068 15.0624H31.9991C31.8232 11.9916 30.7844 9.08419 28.9994 6.62109C27.6961 7.33743 26.1933 7.93349 24.5508 8.39455Z" />
    <path d="M16.9375 16.9375V22.5011C18.9519 22.5547 20.9067 22.7802 22.7314 23.1612C23.1974 21.2356 23.4709 19.1289 23.5316 16.9375H16.9375Z" />
    <path d="M15.0628 15.0636V9.49998C13.0484 9.44635 11.0936 9.22082 9.2689 8.83984C8.80291 10.7654 8.52951 12.8722 8.46875 15.0636H15.0628Z" />
    <path d="M7.94908 6.5948C8.29262 5.5208 8.69729 4.51224 9.15991 3.58701C9.70659 2.4937 10.3163 1.55259 10.9755 0.773438C8.62216 1.54678 6.46585 2.86687 4.66333 4.66939C4.50732 4.8254 4.3558 4.98473 4.20703 5.14594C5.31509 5.72326 6.57649 6.20931 7.94908 6.5948Z" />
    <path d="M24.046 25.4141C23.7025 26.4881 23.2978 27.4966 22.8352 28.4219C22.2885 29.5152 21.6788 30.4563 21.0195 31.2355C23.3729 30.4622 25.5292 29.1421 27.3318 27.3396C27.4878 27.1836 27.6393 27.0243 27.7881 26.863C26.68 26.2856 25.4186 25.7995 24.046 25.4141Z" />
    <path d="M15.0628 16.9375H8.46875C8.52951 19.1289 8.80291 21.2357 9.2689 23.1612C11.0936 22.7802 13.0484 22.5547 15.0628 22.5011V16.9375Z" />
    <path d="M13.3014 30.9226C13.8747 31.4076 14.4634 31.7342 15.0601 31.9019V24.3828C13.2189 24.4341 11.4378 24.636 9.77734 24.9735C10.0821 25.9049 10.4362 26.7797 10.8381 27.5834C11.56 29.0271 12.3888 30.1506 13.3014 30.9226Z" />
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
    <path d="M6 8h12M9 12h6M11 16h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ── Карточка организации (название + счётчик + ООО, селект по рамке) ──────────
function OrgCard({ name, org, count, selected, onClick }: { name: string; org: string; count: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-[180px] flex-col gap-1 rounded-[8px] border px-4 py-3 text-left transition-colors ${selected ? "border-[var(--color-blue-midhub-500)] bg-[var(--color-blue-midhub-50)]" : "border-border bg-[#fff] hover:border-[var(--color-grey-200)]"}`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="ds-p2-medium text-foreground">{name}</span>
        {count && <Badge variant="soft" color="blue">{count}</Badge>}
      </span>
      <span className="ds-caption text-foreground-subtle">{org}</span>
    </button>
  );
}

// ── Тулбар каналов: одна бордерная полоса, 3 иконки (портфель · docs · globe) ─
type Channel = "portfolio" | "docs" | "globe";
function ChannelToolbar({ value, onChange }: { value: Channel; onChange: (c: Channel) => void }) {
  const items: { id: Channel; icon: ReactNode; badge?: string }[] = [
    { id: "portfolio", icon: <BriefcaseIcon /> },
    { id: "docs", icon: <DocsIcon />, badge: "20" },
    { id: "globe", icon: <GlobeIcon />, badge: "7" },
  ];
  return (
    <div className="flex items-center rounded-[8px] border border-border bg-[var(--color-grey-10)]">
      {items.map((it) => {
        const active = value === it.id;
        return (
          <button
            key={it.id}
            type="button"
            aria-label={it.id}
            aria-pressed={active}
            onClick={() => onChange(it.id)}
            className={`flex flex-1 items-center justify-center py-3 transition-colors ${active ? "text-[var(--color-blue-midhub-500)]" : "text-foreground-subtle hover:text-foreground"}`}
          >
            <span className="relative inline-flex">
              {it.icon}
              {it.badge && active && (
                <span className="absolute -bottom-2 -right-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e8843b] px-1 text-[12px] font-medium leading-none text-[#fff]">
                  {it.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Пустое состояние правой панели: серый круг + белая папка ──────────────────
function EmptyFolder() {
  return (
    <div className="flex size-[140px] items-center justify-center rounded-full bg-[#9aa8b9]">
      <svg width="70" height="58" viewBox="0 0 70 58" fill="#fff" aria-hidden>
        {/* документ, торчащий из правого-верхнего угла (за папкой) */}
        <rect x="40" y="2" width="20" height="27" rx="2" transform="rotate(20 50 15)" />
        {/* тело папки */}
        <path d="M6 16a4 4 0 0 1 4-4h11.5a4 4 0 0 1 2.83 1.17L28 17h26a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V16z" />
        {/* нижняя планка (передняя кромка) */}
        <rect x="6" y="49" width="52" height="6" rx="3" />
      </svg>
    </div>
  );
}

// ── Документ требования: × + «Получить» → зелёная галочка ────────────────────
function DocReqRow({ name, obtained: init = false, onObtain }: { name: string; obtained?: boolean; onObtain?: () => void }) {
  const [obtained, setObtained] = useState(init);
  return (
    <div className="flex items-center gap-4">
      <div className="ds-p3 flex flex-1 items-center justify-between gap-2 rounded-[4px] border border-border px-4 py-3 text-foreground">
        <span className="min-w-0 truncate">{name}</span>
        {obtained ? (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-green-300)] text-[#fff]" aria-label="Получен">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        ) : (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#cf6b6b] text-[#fff]" aria-label="Не получен">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
          </span>
        )}
      </div>
      {!obtained && (
        <button type="button" onClick={() => { setObtained(true); onObtain?.(); }} className="ds-p3 shrink-0 text-[var(--color-blue-midhub-500)]">Получить</button>
      )}
    </div>
  );
}

// ── Окно «Информация»: требования к локальной проверке (тогл-строка) ─────────
function ReqRow({ label, badge, badgeColor, onToggle, docName, onObtain }: { label: string; badge: string; badgeColor: "orange" | "green"; onToggle?: (on: boolean) => void; docName?: string; onObtain?: () => void }) {
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border">
      <div className={`flex items-center gap-3 px-6 py-3 ${open ? "bg-[var(--color-grey-10)]" : ""}`}>
        <Toggle size="xs" checked={on} onChange={(e) => { setOn(e.target.checked); onToggle?.(e.target.checked); }} aria-label={label} />
        <span className="ds-p3 min-w-0 flex-1 text-[var(--color-blue-midhub-500)]">{label}</span>
        <Badge variant="solid" color={badgeColor}>{badge}</Badge>
        <button type="button" aria-label="Подробнее" onClick={() => setOpen((v) => !v)} className="shrink-0 text-foreground-subtle">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={open ? "rotate-180" : ""}>
            <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-5 px-6 pb-3 text-left">
          <div className="flex flex-col gap-2">
            <span className="ds-p3-medium text-foreground">Описания</span>
            <p className="ds-p3 text-foreground-subtle">Данные требования распространяются на документы категории «удостоверяющие личность» в РФ. Проверка таких документов может проводиться только нотариусами РФ имеющими гражданство РФ.</p>
            <p className="ds-p3 text-foreground-subtle">Тип проверки — дистанционно.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="ds-p3-medium text-foreground">Тип верификации для документов, подтверждающих соответствие требованиям</span>
            <VerificationBadge label="Международный" color={VERIFY_ORANGE} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="ds-p3-medium text-foreground">Документы, подтверждающие соответствие верификациям</span>
            <DocReqRow name="Паспорт" obtained />
            {/* Красный × + «Получить» только у «Трудового договора» (глобус); иначе — получен. */}
            <DocReqRow name="Удостоверение нотариуса РФ" obtained={docName !== "Трудовой договор"} onObtain={onObtain} />
          </div>
          <div className="-mx-6 border-t border-border">
            <div className="flex gap-12 px-6 pt-3">
              <div className="flex flex-col gap-0.5"><span className="ds-caption text-foreground-subtle">Выдача</span><span className="ds-p3 text-foreground">0$</span></div>
              <div className="flex flex-col gap-0.5"><span className="ds-caption text-foreground-subtle">Использование</span><span className="ds-p3 text-foreground">3$</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Таб «Характеристики домена»: карточка организации + поля. */
function DomainCard() {
  const rows: DefRow[] = [
    {
      label: "Страна",
      value: (
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex h-3.5 w-5 flex-col overflow-hidden rounded-[2px] border border-[#e6e9ee]" aria-hidden>
            <span className="w-full flex-1 bg-[#fff]" />
            <span className="w-full flex-1 bg-[#0039a6]" />
            <span className="w-full flex-1 bg-[#d52b1e]" />
          </span>
          Россия
        </span>
      ),
    },
    { label: "Тип организации", value: "Кооператив" },
    { label: "ID компании", value: "0xca30e63200a0fe3182dc61fc5605efc4" },
    { label: "Число сотрудников", value: "7" },
    { label: "Описание", value: "Домен объединяет шаблоны документов, по которым валидаторы кооператива проверяют заявки и документы пайщиков. Каждый шаблон задаёт состав полей, требования к локальной проверке и тип верификации. По результатам сверки реквизитов документ получает статус «отвалидирован»." },
  ];
  return (
    <div className="overflow-hidden rounded-[8px] border border-border bg-[#fff]">
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <MidhubLogo className="size-9" />
        <span className="ds-p2-medium text-foreground">Midhub Rus</span>
      </div>
      <DefTable rows={rows} flush />
    </div>
  );
}

/** Окно «Информация» (характеристики домена/шаблона) — в правой колонке вместо чата. */
function TemplateInfoPanel({ onBack, onToggle, docName, onObtain }: { onBack: () => void; onToggle?: (on: boolean) => void; docName?: string; onObtain?: () => void }) {
  const [tab, setTab] = useState("template");
  return (
    <div className="flex min-h-[420px] w-full flex-col overflow-hidden rounded-[8px] border border-border bg-[var(--color-grey-10)] lg:min-w-0 lg:flex-1">
      <div className="relative flex h-[54px] items-center justify-center border-b border-border bg-[#fff] px-4">
        <button type="button" aria-label="Назад" onClick={onBack} className="absolute left-3 flex size-7 items-center justify-center text-foreground-subtle hover:text-foreground"><BackIcon /></button>
        <span className="ds-p2-medium text-foreground">Информация</span>
      </div>
      {/* Табы отгорожены от контента: своя секция с нижним бордером, отступ 8px. */}
      <div className="border-b border-border bg-[#fff] px-4 py-2">
        <Tabs value={tab} onValueChange={setTab} variant="solid-light" size="m" equal aria-label="Характеристики" className="w-full [grid-auto-columns:minmax(0,1fr)]">
          <Tab value="domain">Характеристики домена</Tab>
          <Tab value="template">Характеристики шаблона</Tab>
        </Tabs>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto p-4">
        {tab === "domain" ? (
          <DomainCard />
        ) : (
          <>
            <QuestionCard title="Требования к локальной проверке" defaultOpen>
              <div className="-mx-[23px] -mb-5 -mt-4 flex flex-col [&>div:first-child]:border-t-0">
                <ReqRow label="Для документов об образовании" badge="Желтый" badgeColor="orange" onToggle={onToggle} docName={docName} onObtain={onObtain} />
                <ReqRow label="Для документов об аттестации" badge="Зеленый" badgeColor="green" onToggle={onToggle} docName={docName} onObtain={onObtain} />
              </div>
            </QuestionCard>
            <QuestionCard title="Описание к шаблону" />
            <QuestionCard title="Свойства документа" />
            <QuestionCard title="Поля" />
          </>
        )}
      </div>
    </div>
  );
}

export function ValidatorTemplatesScreen({ cabinet, current }: { cabinet: CabinetConfig; current: string }) {
  const [org, setOrg] = useState("midhub");
  const [channel, setChannel] = useState<Channel>("docs");
  const [avail, setAvail] = useState<Avail>("available");
  const [cat, setCat] = useState("id");
  const [country, setCountry] = useState("ru");
  // Глобус «Недоступные»: выбранная категория → подсписок документов.
  const [globeCat, setGlobeCat] = useState<string | null>(null);
  // Тогл в «Информации» активирует документ → он появляется в канале «портфель».
  const [activatedDocs, setActivatedDocs] = useState<string[]>([]);
  // «Получить» в требованиях → документ глобуса переходит из «Недоступных» в «Доступные».
  const [obtainedGlobeDocs, setObtainedGlobeDocs] = useState<string[]>([]);
  // Открытый шаблон-документ → справа вместо списка открывается чат.
  const [openedTpl, setOpenedTpl] = useState<string | null>(null);
  // Клик по заголовку чата → окно «Информация» (характеристики).
  const [showInfo, setShowInfo] = useState(false);

  // Левый список зависит от канала: docs — категории, portfolio — активированные,
  // globe — страны (с флагами).
  const folderLead = <span className="flex size-8 items-center justify-center rounded-full bg-[#9aa8b9]"><FolderMini /></span>;
  const leftItems =
    channel === "portfolio"
      ? [
          // Активированные тоглами документы → категория «Удостоверяющие личность».
          ...(activatedDocs.length ? [{ id: "id", label: "Удостоверяющие личность", count: activatedDocs.length }] : []),
          ...PORTFOLIO_CATEGORIES,
        ].map((c) => ({ ...c, lead: folderLead, key: c.id }))
      : channel === "globe"
        ? COUNTRIES.map((c) => ({ id: c.id, label: c.label, count: c.count, lead: <Flag id={c.flag} />, key: c.id }))
        : CATEGORIES[avail].map((c) => ({ ...c, lead: <span className="flex size-8 items-center justify-center rounded-full bg-[#9aa8b9]"><FolderMini /></span>, key: c.id }));
  const selectedLeft = channel === "globe" ? country : cat;
  const setSelectedLeft = channel === "globe" ? setCountry : setCat;
  // Табы Доступные/Недоступные есть у docs и globe (не у portfolio).
  const showAvailTabs = channel !== "portfolio";
  const panelTitle =
    channel === "portfolio"
      ? "Активированные шаблоны"
      : channel === "globe"
        ? COUNTRIES.find((c) => c.id === country)?.label ?? "Страна"
        : avail === "available"
          ? "Локальные шаблоны (доступные)"
          : "Локальные шаблоны (недоступные)";

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
          {/* Организации (вселенные) — gap до кнопки 16px */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-6">
              {ORGS.map((o) => (
                <OrgCard key={o.id} name={o.name} org={o.org} count={o.count} selected={org === o.id} onClick={() => setOrg(o.id)} />
              ))}
            </div>
            <Button variant="tertiary" size="s" iconLeft={<PlusIcon />} className="self-start">
              Добавить вселенную
            </Button>
          </div>

          {/* Две колонки равной ширины: слева управление + категории, справа панель */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex w-full flex-col gap-4 lg:min-w-0 lg:flex-1">
              <ChannelToolbar value={channel} onChange={(c) => { setChannel(c); setOpenedTpl(null); setShowInfo(false); setGlobeCat(null); }} />
              <SearchBar
                className="-mt-2"
                placeholder="Поиск по шаблонам"
                actions={
                  <button type="button" aria-label="Фильтры" className="flex size-10 shrink-0 items-center justify-center rounded-[4px] border border-border bg-surface text-foreground-subtle">
                    <FilterIcon />
                  </button>
                }
              />
              {showAvailTabs && (
                <Tabs value={avail} onValueChange={(v) => { setAvail(v as Avail); setOpenedTpl(null); setShowInfo(false); setGlobeCat(null); }} variant="solid-light" size="m" equal aria-label="Доступность">
                  <Tab value="available">Доступные</Tab>
                  <Tab value="unavailable">Недоступные</Tab>
                </Tabs>
              )}

              <div className="flex flex-col gap-2">
                {leftItems.map((c) => {
                  // В «Недоступных» ничего не выделено.
                  const isSelected = avail === "available" && selectedLeft === c.id;
                  return (
                    <Item
                      key={c.key}
                      size="l"
                      interactive
                      selected={isSelected}
                      className={`[--item-h:56px] ${isSelected ? "bg-[var(--color-blue-midhub-50)]" : ""}`}
                      onClick={() => {
                        // Выбор слева синхронизирует правую часть: сброс чата/инфо/подсписка.
                        setSelectedLeft(c.id);
                        setOpenedTpl(null);
                        setShowInfo(false);
                        setGlobeCat(null);
                      }}
                      leading={c.lead}
                      trailing={<Badge variant="soft" color="grey">{c.count}</Badge>}
                    >
                      {c.label}
                    </Item>
                  );
                })}
              </div>
            </div>

            {/* Правая часть: список «Локальные шаблоны» ИЛИ чат открытого
                документа (DS ChatPanel в режиме fill — на всю колонку). */}
            {openedTpl && showInfo ? (
              <TemplateInfoPanel
                docName={openedTpl ?? undefined}
                onObtain={() => { if (openedTpl) setObtainedGlobeDocs((p) => Array.from(new Set([...p, openedTpl]))); }}
                onBack={() => setShowInfo(false)}
                onToggle={(on) => {
                  if (!openedTpl) return;
                  setActivatedDocs((prev) => (on ? Array.from(new Set([...prev, openedTpl])) : prev.filter((d) => d !== openedTpl)));
                  // Авто-переключение на канал «портфель» (Информация остаётся открытой).
                  if (on) {
                    setChannel("portfolio");
                    setCat("id");
                  }
                }}
              />
            ) : openedTpl ? (
              <ChatPanel
                fill
                title={openedTpl}
                onBack={() => setOpenedTpl(null)}
                onTitleClick={() => setShowInfo(true)}
                messages={[
                  { text: "Добрый день! Шаблон доступен вашей вселенной — по нему валидатор сверяет реквизиты пайщика и ставит статус «отвалидирован». Перед активацией посмотрите требования к локальной проверке: для документов об образовании нужен жёлтый уровень верификации, для аттестации хватит зелёного. Выдача бесплатная, использование — 3$ за проверку.", time: "09:52" },
                  {
                    time: "09:53",
                    text: (
                      <span className="flex flex-col items-center gap-3 px-8 py-1 text-center">
                        <span className="ds-p3-medium text-foreground">{openedTpl}</span>
                        <button type="button" onClick={() => setShowInfo(true)} className="ds-p3 text-[var(--color-blue-midhub-500)]">Подробнее</button>
                      </span>
                    ),
                  },
                  // После активации тоглом в «Информации» — ответные сообщения.
                  ...(activatedDocs.includes(openedTpl)
                    ? [
                        { me: true, text: "Спасибо, шаблон активировал — он уже в портфеле.", time: "10:04" },
                        { me: true, text: "Удостоверение нотариуса приложу к первой же проверке.", time: "10:06" },
                      ]
                    : []),
                ]}
              />
            ) : channel === "globe" && globeCat ? (
              // Глобус «Недоступные» → подсписок документов категории (с «← назад»).
              <div className="flex min-h-[420px] w-full flex-col overflow-hidden rounded-[8px] border border-border bg-[var(--color-grey-10)] lg:min-w-0 lg:flex-1">
                <div className="relative flex h-[54px] items-center justify-center border-b border-border bg-[#fff] px-4">
                  <button type="button" aria-label="Назад" onClick={() => setGlobeCat(null)} className="absolute left-3 flex size-7 items-center justify-center text-foreground-subtle hover:text-foreground"><BackIcon /></button>
                  <span className="ds-p2-medium text-foreground">{globeCat}</span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  {(GLOBE_SUBDOCS[globeCat] ?? [])
                    .filter((d) => (avail === "available" ? obtainedGlobeDocs.includes(d) : !obtainedGlobeDocs.includes(d)))
                    .map((d) => (
                      <Item key={d} size="s" className="[--item-h:44px]" interactive onClick={() => setOpenedTpl(d)}>{d}</Item>
                    ))}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[420px] w-full flex-col overflow-hidden rounded-[8px] border border-border bg-[var(--color-grey-10)] lg:min-w-0 lg:flex-1">
                <div className="flex h-[54px] items-center justify-center border-b border-border bg-[#fff] px-6 text-center">
                  <span className="ds-p2-medium text-foreground">{panelTitle}</span>
                </div>
                {channel === "portfolio" ? (
                  activatedDocs.length > 0 ? (
                    <div className="flex flex-col gap-2 p-4">
                      {activatedDocs.map((d) => (
                        <Item key={d} size="s" className="[--item-h:44px]" interactive onClick={() => setOpenedTpl(d)}>{d}</Item>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center justify-center p-6">
                      <EmptyFolder />
                    </div>
                  )
                ) : channel === "globe" ? (
                  <div className="flex flex-col gap-2 p-4">
                    <Tabs value={avail} onValueChange={(v) => setAvail(v as Avail)} variant="solid-light" size="m" equal aria-label="Доступность" className="w-full [grid-auto-columns:minmax(0,1fr)]">
                      <Tab value="available">Доступные</Tab>
                      <Tab value="unavailable">Недоступные</Tab>
                    </Tabs>
                    {GLOBE_DOCS[avail].map((t) => (
                      <Item key={t} size="s" className="[--item-h:44px]" interactive onClick={() => setGlobeCat(t)}>{t}</Item>
                    ))}
                  </div>
                ) : avail === "available" ? (
                  <div className="flex flex-col gap-2 p-4">
                    {(CATEGORY_DOCS[cat] ?? []).filter((t) => !activatedDocs.includes(t)).map((t) => (
                      <Item key={t} size="s" className="[--item-h:44px]" interactive onClick={() => setOpenedTpl(t)}>{t}</Item>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center p-6">
                    <EmptyFolder />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
