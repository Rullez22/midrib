"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { HeaderIconButton, HeaderGridIcon, HeaderExitIcon, QuestionCard, Link, Tooltip, ChatBubble } from "@/components/ds";

/**
 * Общие строительные блоки экранов документов кабинета (детальный экран +
 * флоу создания по шаблону). Документы — без рейки `CoopRail`, но с верхней
 * шапкой (лого слева + выход справа, DS `Header`) и боковыми отступами
 * `px-5 md:px-[50px]`.
 */

export const TX_FULL = "0x5c243af9b2e1c0d4a6f8e3b1c5d7a9e2f4b6c8d0a1b2c3d4e5f6a7b807db8";

export interface DefRow {
  label: ReactNode;
  value: ReactNode;
}
export interface TxRow {
  action: string;
  party: string;
  date: string;
}

/* ── Иконки ─────────────────────────────────────────────────────────────── */
export function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7v3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" />
    </svg>
  );
}

/* ── Верхняя шапка документа: «Пространства» слева + выход справа.
      Та же шапка, что в флоу кооператива (company-profile-screen): две кнопки
      HeaderIconButton по краям контента (px-50), без рейки. ── */
export function DocHeader({ onExit }: { onExit?: () => void }) {
  const router = useRouter();
  return (
    <header className="flex h-[60px] items-center justify-between border-b border-border bg-surface px-5 md:px-[50px]">
      <HeaderIconButton icon={<HeaderGridIcon />} aria-label="Пространства" />
      <HeaderIconButton icon={<HeaderExitIcon />} aria-label="Выход" onClick={onExit ?? (() => router.push("/cabinet"))} />
    </header>
  );
}

/* ── Превью прикреплённого документа ─────────────────────────────────────── */
export function DocThumb() {
  return (
    <div className="flex h-[68px] w-[54px] shrink-0 flex-col gap-[5px] rounded-[3px] border border-border bg-white px-2 py-2.5">
      <span className="h-1 w-2/3 rounded-full bg-border" />
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="h-px w-full bg-border" />
      ))}
    </div>
  );
}

/* ── Таблица «label — value» (бордерная, без шапки) ──────────────────────── */
export function DefTable({ rows, flush }: { rows: DefRow[]; flush?: boolean }) {
  return (
    <div className={cn(!flush && "overflow-hidden rounded-[4px] border border-border")}>
      {rows.map((r, i) => (
        <div key={i} className={cn("flex flex-col gap-1 px-6 py-4 sm:flex-row sm:gap-8", i > 0 && "border-t border-border")}>
          <span className="ds-caption shrink-0 text-foreground-subtle sm:w-[260px] sm:pt-0.5">{r.label}</span>
          <div className="ds-p3 min-w-0 flex-1 text-foreground">{r.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Бейдж «Тип верификации» (Международный/Локальный + цветной свотч) ─────── */
export function VerificationBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="ds-p3 text-foreground">{label}:</span>
      <span className="inline-block h-6 w-12 rounded-[4px]" style={{ backgroundColor: color }} aria-hidden />
    </span>
  );
}

/* ── Внутренний хедер контента: кнопка назад + центр-заголовок + actions ──── */
export function BackHeader({ title, onBack, actions }: { title?: ReactNode; onBack: () => void; actions?: ReactNode }) {
  return (
    <div className="relative flex min-h-[40px] items-center">
      <button type="button" aria-label="Назад" onClick={onBack} className="flex size-10 items-center justify-center rounded-[4px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground">
        <BackIcon />
      </button>
      {title && <h1 className="ds-h5 absolute left-1/2 -translate-x-1/2 text-center text-foreground">{title}</h1>}
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
}

/* ── Транзакции в блокчейне (Действие · Участники · Номер транзакции · Дата) ─ */
export function BlockchainCard({ rows, className }: { rows: TxRow[]; className?: string }) {
  return (
    <QuestionCard title="Транзакции в блокчейне" defaultOpen className={className}>
      <div className="-mx-[23px] flex flex-col">
        <div className="flex items-center gap-3 px-6 py-2">
          <span className="ds-caption-medium flex-[2] text-foreground-subtle">Действие</span>
          <span className="ds-caption-medium flex-1 text-center text-foreground-subtle">Участники</span>
          <span className="ds-caption-medium flex-1 text-center text-foreground-subtle">Номер транзакции</span>
          <span className="ds-caption-medium flex-1 text-right text-foreground-subtle">Дата</span>
        </div>
        {rows.map((t, i) => (
          <div key={i} className={cn("flex items-center gap-3 px-6 py-2", i % 2 === 0 && "bg-[var(--color-grey-10)]")}>
            <span className="ds-p3 flex-[2] text-foreground">{t.action}</span>
            <span className="flex flex-1 justify-center"><Link href="#" size="p3">{t.party}</Link></span>
            <span className="flex flex-1 items-center justify-center gap-1.5">
              <Link href="#" size="p3">5c243af… 07db8</Link>
              <Tooltip content={<span className="break-all">{TX_FULL}</span>} side="top"><span className="inline-flex cursor-help"><InfoIcon /></span></Tooltip>
            </span>
            <span className="ds-p3 flex-1 text-right text-foreground">{t.date}</span>
          </div>
        ))}
      </div>
    </QuestionCard>
  );
}

/* ── Верификация: характеристики (DefTable) + транзакции в блокчейне ───────── */
export function VerificationView({ rows, txRows }: { rows: DefRow[]; txRows: TxRow[] }) {
  return (
    <>
      <DefTable rows={rows} />
      <BlockchainCard rows={txRows} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Общие строительные блоки ФЛОУ создания документа (шаблоны компании + сторонние
   шаблоны). Вынесены сюда, чтобы оба флоу переиспользовали один код.
   ════════════════════════════════════════════════════════════════════════════ */

/** Цвет свотча верификации: жёлтый/зелёный тип. */
export const VERIFY_ORANGE = "var(--color-secondary-orange-200, #FAC06C)";
export const VERIFY_GREEN = "var(--color-green-300, #6FCF97)";

/* ── Иконки флоу ──────────────────────────────────────────────────────────── */
export function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-[18px]">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}
export function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
export function SortCaret() {
  return (
    <svg viewBox="0 0 8 8" fill="none" aria-hidden className="size-2 text-foreground-subtle">
      <path d="M4 1.5 6 4H2l2-2.5Z" fill="currentColor" />
      <path d="M4 6.5 2 4h4L4 6.5Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}
function ChatEmptyIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-8 text-primary">
      <path d="M5 7h22v15H13l-6 5v-5H5V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Каркас экрана флоу: шапка (DocHeader) + контент с боковыми отступами ───── */
export function Shell({ children, onExit }: { children: ReactNode; onExit: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DocHeader onExit={onExit} />
      <main className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">{children}</main>
    </div>
  );
}

/* ── Спиннер (как в DS Button loading) ────────────────────────────────────── */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-4 shrink-0 animate-spin text-primary", className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Карточка выбора верификации (Жёлтый/Зелёный тип) ──────────────────────── */
export function VerifyCard({ title, onYellow, onGreen }: { title: string; onYellow: () => void; onGreen: () => void }) {
  return (
    <div className="flex flex-col gap-7 rounded-[4px] border border-border p-6">
      <h3 className="ds-p1-medium text-center text-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Жёлтый тип", btn: "Выбрать жёлтый тип", color: "#F6A530", on: onYellow, desc: "Подтверждает один валидатор — быстрее и дешевле." },
          { label: "Зелёный тип", btn: "Выбрать зелёный тип", color: "#71C676", on: onGreen, desc: "Несколько валидаторов — выше уровень доверия." },
        ].map((c) => (
          <div key={c.label} className="flex flex-col items-center text-center">
            <span className="ds-p2-medium text-foreground">{c.label}</span>
            <p className="ds-p3 mt-3 text-foreground-subtle">{c.desc}</p>
            <button type="button" onClick={c.on} className="ds-p3-medium mt-10 rounded-[4px] px-4 py-[9px]" style={{ backgroundColor: c.color, color: "#fff" }}>{c.btn}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Чат-панель с валидатором (как в ValidatorChatScreen) ──────────────────── */
/** Сообщение чат-панели: `me` — исходящее (синее справа), иначе входящее (серое). */
export interface ChatPanelMsg {
  me?: boolean;
  text: ReactNode;
  time?: ReactNode;
}

export function ChatPanel({
  onAdvance,
  onBack,
  onTitleClick,
  title = "2 Участника",
  messages,
  fill = false,
}: {
  onAdvance?: () => void;
  /** Если задан — слева в шапке стрелка «назад». */
  onBack?: () => void;
  /** Клик по заголовку (без шеврона) — напр. открыть окно «Информация». */
  onTitleClick?: () => void;
  title?: ReactNode;
  messages?: ChatPanelMsg[];
  /** Занимать всю ширину колонки (lg:flex-1) вместо фикс. 300px. */
  fill?: boolean;
}) {
  const hasMessages = messages != null && messages.length > 0;
  return (
    <div className={cn(
      // ds-row — лифт тени при наведении на блок целиком, как у карточек
      // документа слева. Без него панель чата была единственным блоком экрана,
      // который никак не отзывался на мышь.
      "ds-row flex w-full flex-col overflow-hidden rounded-[8px] border border-border bg-surface lg:min-h-[420px] lg:self-stretch",
      fill ? "lg:flex-1" : "flex-none lg:w-[300px]",
    )}>
      <div className="relative flex h-[54px] items-center justify-center border-b border-border px-4">
        {onBack && (
          <button type="button" aria-label="Назад" onClick={onBack} className="absolute left-3 flex size-7 items-center justify-center text-foreground-subtle hover:text-foreground">
            <BackIcon />
          </button>
        )}
        {onAdvance ? (
          <button type="button" onClick={onAdvance} className="flex items-center gap-1 text-foreground">
            <span className="ds-p2-medium">{title}</span>
            <ChevronDown />
          </button>
        ) : onTitleClick ? (
          <button type="button" onClick={onTitleClick} className="ds-p2-medium text-foreground transition-opacity hover:opacity-70">{title}</button>
        ) : (
          <span className="ds-p2-medium text-foreground">{title}</span>
        )}
      </div>
      {hasMessages ? (
        <div className="flex flex-1 flex-col justify-end gap-3 overflow-y-auto p-4">
          {messages!.map((m, i) => (
            <ChatBubble key={i} me={m.me} time={m.time}>{m.text}</ChatBubble>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <ChatEmptyIcon />
          <span className="ds-caption text-foreground-subtle">Тут будет отображена история<br />переписки по договору</span>
        </div>
      )}
      {/* Поле и кнопка отклика не имели вовсе: цвет кнопки задавался inline-стилем,
          а его CSS-классом не перебить — поэтому hover был невозможен в принципе.
          Перевели на токены primary/primary-hover (те же blue-500/600). */}
      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          type="text"
          placeholder="Сообщение"
          className="ds-p3 min-w-0 flex-1 rounded-[4px] border border-border bg-surface px-3 py-2 text-foreground outline-none transition-colors placeholder:text-foreground-subtle hover:border-border-strong focus:border-[var(--color-blue-midhub-500)]"
        />
        <button
          type="button"
          aria-label="Отправить"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[#fff] transition-colors hover:bg-primary-hover active:scale-95"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
