"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Tabs, Tab, EditPencilIcon } from "@/components/ds";
import { PlanPanel, EduPanel } from "../../../flow/company-create/_components/activity-screen";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";
import { ACCENT, type CabinetActivityData, type CollectiveMember, type CascadeData } from "../_config/cabinet-activity";

/**
 * CabinetActivityScreen — «Деятельность» кабинета (Структура / План развития /
 * Обучение). Источник Figma: 1857-649511/649539/649544 (Валидатор) и аналоги.
 * Структура — операционный вид: ЦКП + коллектив подразделения (роли/статусы) +
 * каскад структуры; данные и акцент-цвет берутся из CabinetActivityData (per-
 * cabinet). «План развития» и «Обучение» совпадают с кабинетом №1 → PlanPanel/EduPanel.
 */

type Accent = { border: string; bg: string };

function WarnTriangle() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-8">
      <path d="M16 4.5 30 28H2L16 4.5Z" fill="var(--color-grey-200)" />
      <path d="M16 13v6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="23.5" r="1.4" fill="#fff" />
    </svg>
  );
}

/** Карточка участника коллектива (фото · статус-бейдж · имя · роль).
 *  Кликабельна (как в кабинете №1): выбранная подсвечивается заливкой акцента. */
function CollectiveCard({ m, accent, selected, onClick }: { m: CollectiveMember; accent: Accent; selected?: boolean; onClick?: () => void }) {
  const active = m.status === "active";
  const badge = active
    ? { text: "Активный", bg: "var(--color-green-300)" }
    : { text: "Неактивный", bg: "var(--color-red-300)" };
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={cn("relative flex w-[157px] flex-col items-center gap-1 overflow-hidden rounded-[4px] border pb-2", onClick && "cursor-pointer")}
      style={{ borderColor: accent.border, backgroundColor: selected ? accent.bg : "#fff" }}
    >
      <div className="relative h-[128px] w-full" style={{ borderBottom: `1px solid ${accent.border}` }}>
        {m.photo ? (
          <img src={m.photo} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5">
            <WarnTriangle />
            <span className="ds-caption-medium text-[var(--color-grey-300)]">Нет пайщика</span>
          </div>
        )}
        {/* Карандаш редактирования — правый верхний угол фото (как на всех карточках коллектива) */}
        <button
          type="button"
          aria-label="Редактировать участника"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-[4px] bg-[#fff] text-[var(--color-dark-800)] shadow-sm transition-colors hover:bg-surface-sunken"
        >
          <EditPencilIcon className="size-2.5" />
        </button>
      </div>
      <span
        className="ds-caption-medium absolute left-1/2 top-[116px] -translate-x-1/2 whitespace-nowrap rounded-[4px] px-1 py-0.5 text-[#fff]"
        style={{ backgroundColor: badge.bg }}
      >
        {badge.text}
      </span>
      <div className="flex w-[144px] flex-col items-center gap-2 px-2 pb-1 pt-4 text-center">
        <span className="ds-caption-medium text-foreground">{m.name}</span>
        <span className="ds-caption flex min-h-[40px] items-start justify-center text-center text-[var(--color-grey-300)]">{m.role}</span>
      </div>
    </div>
  );
}

/** Узел каскада: active → accent рамка + заливка. Кликабелен (как в кабинете №1). */
function StructCard({ children, sub, active, accent, onClick }: { children: ReactNode; sub?: ReactNode; active?: boolean; accent: Accent; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn("flex flex-col gap-0.5 rounded-[4px] border px-4 py-3", !active && "border-border bg-white", onClick && "cursor-pointer")}
      style={active ? { borderColor: accent.border, backgroundColor: accent.bg } : undefined}
    >
      <span className="ds-p3 text-foreground">{children}</span>
      {sub != null && <span className="ds-caption text-foreground-subtle">{sub}</span>}
    </div>
  );
}

/** Стрелка-связка вниз — от выбранной карточки коллектива к каскаду. */
export function CascadeArrowDown({ accent }: { accent: Accent }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4" style={{ color: accent.border }}>
      <path d="M12 4v15M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CascadeArrowH({ accent, top }: { accent: Accent; top: number }) {
  return (
    <div className="flex shrink-0 items-start self-start" style={{ color: accent.border, marginTop: top }}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function QuestionRow({ q, accent }: { q: { title: string; body?: string; open?: boolean }; accent: Accent }) {
  const [open, setOpen] = useState(!!q.open);
  return (
    <div className={cn("overflow-hidden rounded-[4px] border", !open && "border-border")} style={open ? { borderColor: accent.border } : undefined}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        style={open ? { backgroundColor: accent.bg } : undefined}
      >
        <span className="ds-p3 text-foreground">{q.title}</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-4 shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
          <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && q.body != null && (
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${accent.border}` }}>
          <span className="ds-p3 text-foreground-muted">{q.body}</span>
        </div>
      )}
    </div>
  );
}

/** Обложка-градиент + круглый аватар (фото подразделения или «Immatra»-заглушка
 *  для кооператива). `cover` переопределяет градиент обложки. */
function CkpAva({ avatar, cover }: { avatar?: string; cover?: string }) {
  return (
    <div className="relative h-[88px] w-full overflow-hidden rounded-t-[3px]">
      <div className="h-[57px] w-full" style={{ backgroundImage: cover ?? "linear-gradient(120deg,#f9c5d1,#a18cd1,#84fab0)" }} />
      <div className="absolute bottom-0 left-1/2 size-[72px] -translate-x-1/2 overflow-hidden rounded-full border-2 border-[#fff] bg-[#e8edf2]">
        {avatar ? (
          <img src={avatar} alt="" className="size-full object-cover" />
        ) : (
          <span className="ds-caption-medium flex size-full items-center justify-center text-[color:var(--color-grey-400)]">Immatra</span>
        )}
      </div>
    </div>
  );
}

/** Блок ЦКП «Ценный конечный продукт»: свёрнут (аватар слева + описание + ссылка
 *  «Смотреть всю информацию») → раскрыт (описание во всю ширину + «Свернуть»).
 *  Поведение 1:1 с кабинетом №1 (activity-screen → CkpBlock). Переиспользуется на
 *  экране «О компании» (кооператив без фото → аватар-заглушка «Immatra»). */
export function CkpBlock({ name, membersLabel, desc, avatar, cover, borderColor, title = "Ценный конечный продукт", editable = false, layout = false, onLayout, layoutColor }: { name: string; membersLabel?: string; desc: string; avatar?: string; cover?: string; borderColor?: string; title?: ReactNode; editable?: boolean; layout?: boolean; onLayout?: () => void; layoutColor?: string }) {
  const [open, setOpen] = useState(false);

  // Иконки редактирования (карандаш + вид) — правый верхний угол (Figma «Общие
  // сведения»: pen-3 + menu-2). Показываются, если задан editable / layout.
  const icons =
    editable || layout ? (
      <div className="absolute right-4 top-3.5 z-10 flex items-center gap-4">
        {editable && (
          <button type="button" aria-label="Редактировать">
            <EditPencilIcon className="size-4 text-foreground-subtle" />
          </button>
        )}
        {layout && (
          <button type="button" aria-label="Структура компании" onClick={onLayout} className="text-[var(--color-red-200)] transition-opacity hover:opacity-70" style={layoutColor ? { color: layoutColor } : undefined}>
            {/* QR-иконка 24×24 (Figma 7574:17191), цвет через currentColor. */}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
              <path d="M8.72161 0H1.83113C0.82354 0 0.00390625 0.819634 0.00390625 1.82723V8.71771C0.00390625 9.7253 0.82354 10.5449 1.83113 10.5449H8.72161C9.72921 10.5449 10.5488 9.7253 10.5488 8.71771V1.82723C10.5487 0.819634 9.72921 0 8.72161 0Z" fill="currentColor" />
              <path d="M22.1787 0H15.2882C14.2806 0 13.4609 0.819634 13.4609 1.82723V8.71771C13.4609 9.7253 14.2806 10.5449 15.2882 10.5449H22.1787C23.1863 10.5449 24.0059 9.7253 24.0059 8.71771V1.82723C24.0059 0.819634 23.1863 0 22.1787 0Z" fill="currentColor" />
              <path d="M8.72161 13.4531H1.83113C0.82354 13.4531 0.00390625 14.2727 0.00390625 15.2803V22.1707C0.00390625 23.1783 0.82354 23.998 1.83113 23.998H8.72161C9.72921 23.998 10.5488 23.1783 10.5488 22.1707V15.2803C10.5487 14.2727 9.72921 13.4531 8.72161 13.4531Z" fill="currentColor" />
              <line x1="14" y1="14.5" x2="23.5" y2="14.5" stroke="currentColor" strokeLinecap="round" />
              <line x1="14" y1="17.5" x2="23.5" y2="17.5" stroke="currentColor" strokeLinecap="round" />
              <line x1="14" y1="20.5" x2="23.5" y2="20.5" stroke="currentColor" strokeLinecap="round" />
              <line x1="14" y1="23.5" x2="23.5" y2="23.5" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    ) : null;

  if (open) {
    return (
      <div className="relative flex w-full flex-col gap-4 rounded-[4px] border border-border bg-white p-4" style={borderColor ? { borderColor } : undefined}>
        {icons}
        {/* Аватар + заголовок с подписями */}
        <div className="flex items-start gap-4 pr-9">
          <div className="w-[142px] shrink-0 overflow-clip rounded-[4px] border border-border pb-1">
            <CkpAva avatar={avatar} cover={cover} />
          </div>
          <div className="flex flex-col gap-0.5 pt-2">
            <span className="ds-p2-medium text-foreground">{title}</span>
            <span className="ds-caption-medium text-foreground-muted">{name}</span>
            {membersLabel != null && <span className="ds-caption text-[var(--color-grey-300)]">{membersLabel}</span>}
          </div>
        </div>
        {/* Описание во всю ширину + линия + «Свернуть» */}
        <div className="flex flex-col items-center gap-4">
          <p className="ds-p3 w-full text-foreground-muted">{desc}</p>
          <div className="h-px w-full bg-border" />
          <button type="button" onClick={() => setOpen(false)} className="ds-caption-medium text-[var(--color-blue-midhub-500)]">
            Свернуть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full gap-4 rounded-[4px] border border-border bg-white p-[7px]" style={borderColor ? { borderColor } : undefined}>
      {icons}
      <div className="flex w-[142px] shrink-0 flex-col items-center gap-1 overflow-clip rounded-[4px] border border-border pb-1">
        <CkpAva avatar={avatar} cover={cover} />
        <span className="ds-caption-medium text-foreground">{name}</span>
        {membersLabel != null && <span className="ds-caption text-[var(--color-grey-300)]">{membersLabel}</span>}
      </div>
      <div className="flex min-h-[130px] flex-1 flex-col gap-2 pr-9 pt-2">
        <span className="ds-p2-medium text-foreground">{title}</span>
        <p className="ds-p3 line-clamp-3 text-foreground-muted">{desc}</p>
        <div className="mt-auto h-px w-full bg-border" />
        <button type="button" onClick={() => setOpen(true)} className="ds-caption-medium self-center text-[var(--color-blue-midhub-500)]">
          Смотреть всю информацию
        </button>
      </div>
    </div>
  );
}

/** Каскад структуры (Отдел → Секция → Функция → Вопросы) — общий для подразделений
 *  и «О компании». Кликабельные узлы + цветные стрелки-связки (меряются по DOM).
 *  Поведение 1:1. `className` — для внешних отступов (напр. `-mt-5`). */
export function StructureCascade({ cascade: c, accent, className }: { cascade: CascadeData; accent: Accent; className?: string }) {
  const [selDept, setSelDept] = useState(Math.max(0, c.depts.findIndex((d) => d.active)));
  const [selSection, setSelSection] = useState(Math.max(0, c.sections.findIndex((s) => s.active)));
  const [selFunc, setSelFunc] = useState(c.funcs.activeIdx);

  // Стрелки-связки между колонками меряются по DOM (карточки разной высоты).
  const rowRef = useRef<HTMLDivElement>(null);
  const deptRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const funcRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [arrowTops, setArrowTops] = useState<number[]>([20, 20, 20]);
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const rowTop = row.getBoundingClientRect().top;
    const centerOf = (el: HTMLDivElement | null) => {
      if (!el) return 20;
      const r = el.getBoundingClientRect();
      return r.top - rowTop + r.height / 2 - 8; // 8 — половина высоты стрелки
    };
    const next = [
      centerOf(deptRefs.current[selDept]),
      centerOf(sectionRefs.current[selSection]),
      centerOf(funcRefs.current[selFunc]),
    ];
    setArrowTops((prev) => (prev.every((v, i) => Math.abs(v - next[i]) < 0.5) ? prev : next));
  }, [selDept, selSection, selFunc]);

  return (
    <div className={cn("overflow-x-auto rounded-[10px] border-2 border-dashed p-5", className)} style={{ borderColor: accent.border }}>
      <div ref={rowRef} className="flex items-start gap-3">
        <div className="flex w-[200px] shrink-0 flex-col gap-3">
          {c.depts.map((d, i) => (
            <div key={d.title} ref={(el) => { deptRefs.current[i] = el; }}>
              <StructCard active={i === selDept} accent={accent} onClick={() => setSelDept(i)}>{d.title}</StructCard>
            </div>
          ))}
        </div>
        <CascadeArrowH accent={accent} top={arrowTops[0]} />
        <div className="flex w-[230px] shrink-0 flex-col gap-3">
          {c.sections.map((s, i) => (
            <div key={s.title} ref={(el) => { sectionRefs.current[i] = el; }}>
              <StructCard active={i === selSection} accent={accent} onClick={() => setSelSection(i)}>{s.title}</StructCard>
            </div>
          ))}
        </div>
        <CascadeArrowH accent={accent} top={arrowTops[1]} />
        <div className="flex w-[260px] shrink-0 flex-col gap-3">
          {c.funcs.items.map((f, i) => (
            <div key={i} ref={(el) => { funcRefs.current[i] = el; }}>
              <StructCard active={i === selFunc} sub={f.role} accent={accent} onClick={() => setSelFunc(i)}>{f.text}</StructCard>
            </div>
          ))}
        </div>
        <CascadeArrowH accent={accent} top={arrowTops[2]} />
        <div className="flex w-[260px] shrink-0 flex-col gap-3">
          {c.questions.map((q, i) => (
            <QuestionRow key={i} q={q} accent={accent} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StructureTab({ cabinet, data, accent }: { cabinet: CabinetConfig; data: CabinetActivityData; accent: Accent }) {
  const router = useRouter();
  // Выбранный участник коллектива (как в кабинете №1): по умолчанию — первый
  // активный. От выбора зависит подсветка карточки и стрелка-связка к каскаду.
  const firstActive = Math.max(0, data.collective.findIndex((m) => m.status === "active"));
  const [sel, setSel] = useState(firstActive);

  return (
    <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
      {/* Грид-иконка ЦКП → «Структура» кооператива с выделенным этим подразделением. */}
      <CkpBlock
        name={cabinet.name}
        avatar={cabinet.avatar}
        membersLabel={data.membersLabel}
        desc={data.ckpDesc}
        layout
        layoutColor={accent.border}
        onLayout={() => router.push(`/cabinet/about?view=structure&focus=${cabinet.slug}`)}
      />

      {/* Коллектив подразделения — карточки кликабельны (выбор → подсветка + стрелка) */}
      <div className="flex flex-col gap-4">
        <span className="ds-p2-medium text-foreground">Коллектив подразделения</span>
        <div className="flex flex-wrap items-start gap-1.5">
          {data.collective.map((m, i) => {
            const selectable = m.status === "active";
            const isSel = i === sel;
            return (
              <div key={i} className="flex flex-col items-center gap-3">
                <CollectiveCard m={m} accent={accent} selected={isSel} onClick={selectable ? () => setSel(i) : undefined} />
                {isSel && <CascadeArrowDown accent={accent} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Каскад структуры. -mt-5 сводит gap-8 секции к 12px под стрелкой-связкой. */}
      <StructureCascade cascade={data.cascade} accent={accent} className="-mt-5" />
    </div>
  );
}

export function CabinetActivityScreen({ cabinet, data }: { cabinet: CabinetConfig; data: CabinetActivityData }) {
  const [tab, setTab] = useState("struct");
  const accent = ACCENT[cabinet.railColor];
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current="activity" />
      <main className="min-w-0 flex-1">
        <Tabs value={tab} onValueChange={setTab} variant="solid-light" size="l" equal aria-label="Раздел" className="w-full rounded-none border-x-0 border-t-0">
          <Tab value="struct">Структура</Tab>
          <Tab value="plan">План развития</Tab>
          <Tab value="edu">Обучение</Tab>
        </Tabs>
        {tab === "struct" && <StructureTab cabinet={cabinet} data={data} accent={accent} />}
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
      </main>
    </div>
  );
}
