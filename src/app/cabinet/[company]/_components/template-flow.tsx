"use client";

import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Input,
  Combobox,
  TagInput,
  Dropdown,
  Textarea,
  Panel,
  MemberCard,
  Badge,
  Toggle,
  Checkbox,
  EditPencilIcon,
  DeleteButton,
  MidhubLogo,
  HeaderExitIcon,
  type MemberRow,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { VotingBlock } from "../../voting/_components/voting-block";

/**
 * TemplateFlow — флоу «Создание шаблона» (Шаблоны → лист → «Создать шаблон»).
 * Источник Figma: 6752-445946/444884 (форма) · 444898/444912 (добавление поля) ·
 * 444954/444926 (поля) · 447000 (после «Согласовать») · 446976/446984
 * (голосование) · 447029 (готов) · 444940/446992 (деталь).
 *
 * Полноэкранный визард с верхними вкладками (Шаблон / Голосование / Валидаторы /
 * Домены), без сайдбара кабинета (как в макете). Reuse-first — конструктор шаблона
 * целиком собран из существующих DS-композитов, ничего не верстаем заново:
 *   • PropertyForm — «Свойства документа» (редактирование) и «Добавить новое поле»;
 *   • MemberCard — «Свойства документа» (read-only после согласования);
 *   • Panel + QuestionCard — «Поля документа» и блоки «Требования…»;
 *   • Textarea — «Описание к шаблону»;
 *   • VotingBlock — вкладка «Голосование» (тот же блок, что и везде на сайте);
 *   • Tabs (basic) — переключение вкладок; MidhubLogo/HeaderExitIcon — шапка флоу.
 */

type Level = "green" | "yellow";
/** Требование валидатора (верификация) — с стоимостью выдачи/использования. */
interface VerifReq {
  id: string;
  name: string;
  level: Level;
  /** Уровень проверки (Международный / Локальный). */
  scope: string;
  docs: string[];
  issue: string;
  use: string;
}

export interface TemplateDoc {
  id: string;
  /** Лист (категория – страна), к которому относится шаблон. */
  leafTitle: string;
  name: string;
  status: "voting" | "active";
  voteId?: string;
  // ── Состояние верификаций (сохраняется, чтобы не терялось после голосования) ──
  roles?: string[];
  rolesApproved?: boolean;
  validatorReqs?: VerifReq[];
  verifDone?: boolean;
}

type TemplateTab = "template" | "voting" | "validators" | "domains";

// ── Справочные данные (1:1 из Figma / DS-демок) ───────────────────────────────
const CATEGORY_OPTS = ["Удостоверяющие личность", "Образование", "Медицина", "Сертификаты валидаторов", "Общегражданские"].map((v) => ({ value: v, label: v }));
const STATUS_OPTS = ["Верифицируемый", "Не верифицируемый", "Архивный"].map((v) => ({ value: v, label: v }));
const TYPE_OPTS = ["Уникальный", "Множественный", "Системный"].map((v) => ({ value: v, label: v }));

/** Числовое поле со степпером ▲▼ (стрелки прибавляют/отнимают значение), как в
 *  Figma. Используется для «Время актуальности», «Номер страницы», «Кол-во символов». */
function NumberStepper({
  placeholder,
  className,
  value,
  onValueChange,
}: {
  placeholder: string;
  className?: string;
  value?: number;
  onValueChange?: (v: number) => void;
}) {
  const [internal, setInternal] = useState(0);
  const v = value !== undefined ? value : internal;
  const set = (n: number) => {
    const next = Math.max(0, n);
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return (
    <div
      className={cn(
        "flex h-12 items-center rounded-[4px] border border-border bg-white pl-4 pr-3 transition-colors focus-within:border-[color:var(--color-blue-midhub-500)]",
        className,
      )}
    >
      <input
        type="text"
        inputMode="numeric"
        value={v ? String(v) : ""}
        placeholder={placeholder}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
          set(Number.isNaN(n) ? 0 : n);
        }}
        className="ds-p3 min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-foreground-subtle"
      />
      <div className="flex shrink-0 flex-col text-foreground-subtle">
        <button type="button" aria-label="Увеличить" onClick={() => set(v + 1)} className="flex items-center transition-colors hover:text-foreground">
          <svg viewBox="0 0 16 16" width="16" height="9" fill="none"><path d="m4 10 4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" aria-label="Уменьшить" onClick={() => set(v - 1)} className="flex items-center transition-colors hover:text-foreground">
          <svg viewBox="0 0 16 16" width="16" height="9" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" aria-hidden className={cn("shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ADD_TYPE_OPTS = ["Текст", "Число", "Дата", "Файл", "Список"].map((v) => ({ value: v, label: v }));
const ADD_CAT_OPTS = ["Фамилия", "Имя", "Отчество", "Прочее"].map((v) => ({ value: v, label: v }));
const ADD_VALID_OPTS = ["Только латиница", "Только кириллица", "Цифры", "Без ограничений"].map((v) => ({ value: v, label: v }));
const ADD_MASK_OPTS = ["Фамилия", "Имя", "Дата", "Без маски"].map((v) => ({ value: v, label: v }));

/** Описание добавленного поля документа (значения из формы «Добавить новое поле»). */
interface FieldDef {
  name: string;
  type: string;
  page: string;
  category: string;
  validation: string;
  mask: string;
  count: string;
  description: string;
}

/** «Добавить новое поле» — подшапка (вплотную к шапке панели) со стрелкой,
 *  раскрывающей/скрывающей форму поля (Figma 6752-444898/444912). Значения
 *  собираются и передаются в `onAdd`, чтобы строка поля показывала введённое. */
function AddFieldBlock({ onAdd, onCancel }: { onAdd: (field: FieldDef) => void; onCancel: () => void }) {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const [validation, setValidation] = useState("");
  const [mask, setMask] = useState("");
  const [count, setCount] = useState(0);
  const [description, setDescription] = useState("");
  const narrow = "max-w-[360px]";
  const submit = () =>
    onAdd({
      name: name.trim(),
      type,
      page: page ? String(page) : "",
      category,
      validation,
      mask,
      count: count ? String(count) : "",
      description: description.trim(),
    });
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[66px] w-full items-center justify-between border-b border-border bg-surface-sunken px-6 text-left"
      >
        <span className="ds-p3 text-foreground">Добавить новое поле</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="flex flex-col gap-3 p-6">
          <Input size="l" placeholder="Наименование поля" value={name} onChange={(e) => setName(e.target.value)} />
          <Combobox size="l" className={narrow} options={ADD_TYPE_OPTS} value={type} onValueChange={setType} placeholder="Тип" />
          <NumberStepper className={narrow} placeholder="Номер страницы" value={page} onValueChange={setPage} />
          <Combobox size="l" className={narrow} options={ADD_CAT_OPTS} value={category} onValueChange={setCategory} placeholder="Категория" />
          <Combobox size="l" className={narrow} options={ADD_VALID_OPTS} value={validation} onValueChange={setValidation} placeholder="Валидация" />
          <Combobox size="l" className={narrow} options={ADD_MASK_OPTS} value={mask} onValueChange={setMask} placeholder="Маска" />
          <NumberStepper className={narrow} placeholder="Кол-во символов" value={count} onValueChange={setCount} />
          <Textarea size="l" placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex items-center gap-3">
            <Button disabled={!name.trim()} onClick={submit}>Добавить</Button>
            <Button variant="negative-sec" onClick={onCancel}>Отменить</Button>
          </div>
        </div>
      )}
    </div>
  );
}

const FIELD_LABELS: [keyof FieldDef, string][] = [
  ["name", "Наименование поля"],
  ["type", "Тип"],
  ["page", "Номер страницы"],
  ["category", "Категория"],
  ["validation", "Валидация"],
  ["mask", "Маска"],
  ["count", "Точное кол-во символов"],
  ["description", "Описание"],
];

/** Строка добавленного поля: на всю ширину, с карандашом/урной (если не
 *  read-only) и раскрытием в значения поля (Figma 6752-444954). */
function FieldRow({ field, onEdit, onDelete, readOnly }: { field: FieldDef; onEdit?: () => void; onDelete?: () => void; readOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-b-0">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((o) => !o); }}
        className="flex min-h-[66px] cursor-pointer items-center gap-4 px-6 py-2 outline-none transition-colors hover:bg-[var(--color-grey-10)]"
      >
        <span className="ds-p3 flex-1 text-foreground">{field.name || "Без названия"}</span>
        {!readOnly && open && (
          <span className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Редактировать" onClick={onEdit} className="text-[var(--color-blue-midhub-500)]">
              <EditPencilIcon className="size-5" />
            </button>
            <DeleteButton size="sm" aria-label="Удалить" onClick={onDelete} />
          </span>
        )}
        <Chevron open={open} />
      </div>
      {open && (
        <div className="flex flex-col border-t border-border">
          {FIELD_LABELS.map(([key, label], i) => (
            <div key={key} className={cn("flex items-center gap-4 px-6 py-3", i > 0 && "border-t border-border")}>
              <span className="ds-p3 w-[230px] shrink-0 text-foreground-subtle">{label}</span>
              <span className="ds-p3 text-foreground">{field[key] || "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** «Свойства документа» (редактирование): Input + реальные Combobox-дропдауны.
 *  PropertyForm не подходит — его select это read-only-инпуты (выглядят
 *  «залоченными»), а нужны настоящие дропдауны. */
function DocPropsForm() {
  const narrow = "max-w-[360px]";
  return (
    <div className="overflow-hidden rounded-[4px] border border-border bg-surface">
      <div className="flex h-[66px] items-center border-b border-border bg-surface-sunken px-6">
        <span className="ds-p3 text-foreground">Свойства документа</span>
      </div>
      <div className="flex flex-col gap-3 p-6">
        <Input size="l" placeholder="Наименование документа" />
        <Combobox size="l" className={narrow} options={CATEGORY_OPTS} placeholder="Категория" />
        <Combobox size="l" className={narrow} options={STATUS_OPTS} placeholder="Статус" />
        <Combobox size="l" className={narrow} options={TYPE_OPTS} placeholder="Тип" />
        <Input size="l" className={narrow} placeholder="Код" />
        <NumberStepper className={narrow} placeholder="Время актуальности документа" />
        <Input size="l" className={narrow} placeholder="MIN. кол-во компаний валидаторов" />
        <Input size="l" className={narrow} placeholder="MIN. кол-во компаний эмитентов" />
        <Input size="l" className={narrow} placeholder="MIN. кол-во сотрудников в компании" />
      </div>
    </div>
  );
}
const PROPS_ROWS: MemberRow[] = [
  { label: "Наименование документа", value: "Военный билет" },
  { label: "Категория", value: "Удостоверяющие личность" },
  { label: "Статус", value: "Верифицируемый" },
  { label: "Тип", value: "Уникальный" },
  { label: "Код", value: "222" },
  { label: "Время актуальности документа", value: "10 лет" },
  { label: "MIN. кол-во компаний валидаторов", value: "6" },
  { label: "MIN. кол-во компаний эмитентов", value: "6" },
  { label: "MIN. кол-во сотрудников в компании", value: "5" },
];
const MOCK_FIELD_DEFS: FieldDef[] = ["Фамилия", "Имя", "Отчество", "Пол", "Дата рождения", "Место рождения", "Серия и номер", "Кем выдан", "Дата выдачи"].map((name) => ({
  name,
  type: "Текст",
  page: "1",
  category: name,
  validation: "Только латиница",
  mask: name,
  count: "7",
  description: "Крутое поле",
}));
const NEW_TEMPLATE_NAME = "Военный билет";

let tplSeq = 0;
function genTemplateId() {
  tplSeq += 1;
  return `tpl-${tplSeq}-${tplSeq * 6131}`;
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden className="text-foreground-subtle">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85a1.9 1.9 0 0 1 .7-2.59l1.73-.99c.78-.46 1.78-.18 2.24.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.46-.78 1.46-1.06 2.24-.6l1.73.99c.91.52 1.22 1.68.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.78.46-1.78.18-2.24-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.46.78-1.46 1.06-2.24.6l-1.73-.99a1.9 1.9 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function BackChevron() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden>
      <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function QIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" aria-hidden className="shrink-0 text-foreground-subtle">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.6.2-1.2.7-1.2 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" aria-hidden className="text-[var(--color-blue-midhub-500)]">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

// ── Требования валидатора (верификации) ───────────────────────────────────────
const REQ_DESC =
  'Данные требования распространяются на документы категории "удостоверяющие личность" в РФ. Проверка таких документов может проводится только нотариусами РФ имеющими гражданство РФ.';

/** Пул требований для выбора (Figma 6752-444757) — у каждого своя верификация. */
const REQ_POOL: Omit<VerifReq, "issue" | "use">[] = [
  { id: "edu-y", name: "Для документов об образовании", level: "yellow", scope: "Международный", docs: ["Заграничный паспорт", "Удостоверение нотариуса РФ"] },
  { id: "att-g", name: "Для документов об аттестации", level: "green", scope: "Локальный", docs: ["Аттестат", "Справка из деканата"] },
  { id: "edu-g", name: "Для документов об образовании", level: "green", scope: "Международный", docs: ["Диплом", "Военный билет"] },
];

function LevelBadge({ level }: { level: Level }) {
  return level === "green" ? <Badge variant="solid" color="green">Зелёный</Badge> : <Badge variant="solid" color="orange">Жёлтый</Badge>;
}

/** Тело требования (Описания / Тип верификаций / Документы [+ стоимость]). */
function ReqDetailBody({ req, cost = false }: { req: Pick<VerifReq, "level" | "scope" | "docs"> & Partial<Pick<VerifReq, "issue" | "use">>; cost?: boolean }) {
  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div className="flex flex-col gap-2">
        <span className="ds-p3-medium text-foreground">Описания</span>
        <p className="ds-p3 text-foreground-subtle">{REQ_DESC}</p>
        <p className="ds-p3 text-foreground-subtle">Тип проверки - дистанционно.</p>
      </div>
      <div className="border-t border-border" />
      <div className="flex flex-col gap-2">
        <span className="ds-p3-medium text-foreground">Тип верификаций для документов, подтверждающих соответствие требованиям</span>
        <div className="flex items-center gap-3"><span className="ds-p3 text-foreground-subtle">{req.scope}:</span><LevelBadge level={req.level} /></div>
      </div>
      <div className="border-t border-border" />
      <div className="flex flex-col gap-2">
        <span className="ds-p3-medium text-foreground">Документы, подтверждающие соответствие верификациям</span>
        <div className="flex flex-col gap-2">
          {req.docs.map((d) => (
            <div key={d} className="ds-p3 rounded-[4px] border border-border bg-[#f9fafc] px-4 py-3 text-foreground-muted">{d}</div>
          ))}
        </div>
      </div>
      {cost && (
        <>
          <div className="border-t border-border" />
          <div className="flex gap-12">
            <div className="flex flex-col gap-0.5"><span className="ds-caption text-foreground-subtle">Выдача</span><span className="ds-p3 text-foreground">{req.issue || "-"}</span></div>
            <div className="flex flex-col gap-0.5"><span className="ds-caption text-foreground-subtle">Использование</span><span className="ds-p3 text-foreground">{req.use || "-"}</span></div>
          </div>
        </>
      )}
    </div>
  );
}

/** Требование в блоке «Требования для валидатора» — плоская строка (как поля
 *  документа): имя + бейдж + стрелка, раскрытие в детали (Figma 6752-445021). */
function ReqCollapsible({ req }: { req: VerifReq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-b-0">
      <div
        role="button"
        tabIndex={0}
        aria-label={open ? "Свернуть" : "Развернуть"}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((o) => !o); }}
        className="flex min-h-[56px] cursor-pointer items-center gap-4 px-6 outline-none"
      >
        <span className="ds-p3 flex-1 text-foreground">{req.name}</span>
        <LevelBadge level={req.level} />
        <Chevron open={open} />
      </div>
      {open && <div className="border-t border-border"><ReqDetailBody req={req} cost /></div>}
    </div>
  );
}

// ── Шапка под-экранов (логотип + выход + назад + заголовок + футер) ────────────
function SubShell({ title, onBack, onClose, children, footer }: { title: string; onBack: () => void; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-[#fff] px-5">
        <MidhubLogo className="size-8" />
        <button type="button" aria-label="Выход" onClick={onClose} className="text-foreground-subtle transition-colors hover:text-foreground"><HeaderExitIcon /></button>
      </header>
      <main className="min-w-0 flex-1 px-5 py-8 md:px-[50px]">
        <div className="relative flex flex-col items-center">
          <button type="button" aria-label="Назад" onClick={onBack} className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-[4px] border border-border bg-surface-sunken text-foreground-subtle"><BackChevron /></button>
          <h1 className="ds-h5 text-foreground">{title}</h1>
        </div>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 flex justify-end gap-4">{footer}</div>}
      </main>
    </div>
  );
}

/** Экран выбора требований для валидатора (Figma 6752-444757/444747). */
function RequirementPicker({ onCancel, onPick, onClose }: { onCancel: () => void; onPick: (reqs: Omit<VerifReq, "issue" | "use">[]) => void; onClose: () => void }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ "edu-y": true });
  const [checked, setChecked] = useState<Set<string>>(() => new Set());
  const toggleCheck = (id: string) => setChecked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <SubShell
      title="Выберите локальные требования для валидатора"
      onBack={onCancel}
      onClose={onClose}
      footer={
        <>
          <Button variant="negative-sec" size="l" onClick={onCancel}>Отменить</Button>
          <Button size="l" disabled={checked.size === 0} onClick={() => onPick(REQ_POOL.filter((r) => checked.has(r.id)))}>Выбрать</Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        {/* шапка таблицы */}
        <div className="flex items-center gap-4 rounded-[4px] bg-surface-sunken px-6 py-3">
          <Checkbox size="xs" aria-label="Выбрать все" checked={checked.size === REQ_POOL.length} onChange={() => setChecked(checked.size === REQ_POOL.length ? new Set() : new Set(REQ_POOL.map((r) => r.id)))} />
          <span className="ds-caption flex-1 text-foreground-subtle">Название</span>
          <span className="ds-caption w-[120px] text-right text-foreground-subtle">Тип</span>
        </div>
        {REQ_POOL.map((r) => {
          const o = open[r.id] ?? false;
          return (
            <div key={r.id} className="overflow-hidden rounded-[4px] border border-border bg-surface">
              {/* Вся строка кликабельна для раскрытия; чекбокс — отдельно */}
              <div
                role="button"
                tabIndex={0}
                aria-label={o ? "Свернуть" : "Развернуть"}
                onClick={() => setOpen((p) => ({ ...p, [r.id]: !o }))}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((p) => ({ ...p, [r.id]: !o })); }}
                className="flex min-h-[56px] cursor-pointer items-center gap-4 px-6 outline-none"
              >
                <span onClick={(e) => e.stopPropagation()}>
                  <Checkbox size="xs" checked={checked.has(r.id)} onChange={() => toggleCheck(r.id)} aria-label={r.name} />
                </span>
                <span className="ds-p3 flex-1 text-foreground">{r.name}</span>
                <LevelBadge level={r.level} />
                <Chevron open={o} />
              </div>
              {o && <div className="border-t border-border"><ReqDetailBody req={r} /></div>}
            </div>
          );
        })}
      </div>
    </SubShell>
  );
}

/** Экран «Стоимость требований» (Figma 6752-444767). */
function RequirementCost({ reqs, onCancel, onAdd, onClose }: { reqs: Omit<VerifReq, "issue" | "use">[]; onCancel: () => void; onAdd: (reqs: VerifReq[]) => void; onClose: () => void }) {
  const [costs, setCosts] = useState<Record<string, { issue: string; use: string }>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const setCost = (id: string, k: "issue" | "use", v: string) =>
    setCosts((p) => ({ ...p, [id]: { ...(p[id] ?? { issue: "", use: "" }), [k]: v } }));
  const canAdd = reqs.every((r) => (costs[r.id]?.use ?? "") !== "");
  return (
    <SubShell
      title="Стоимость требований"
      onBack={onCancel}
      onClose={onClose}
      footer={
        <>
          <Button variant="negative-sec" size="l" onClick={onCancel}>Отменить</Button>
          <Button size="l" disabled={!canAdd} onClick={() => onAdd(reqs.map((r) => ({ ...r, issue: costs[r.id]?.issue ?? "", use: costs[r.id]?.use ?? "" })))}>Добавить</Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {reqs.map((r, i) => (
          <div key={r.id} className="flex flex-col gap-3">
            <h2 className="ds-p2-medium text-foreground">Требование-{i + 1}</h2>
            <div className="overflow-hidden rounded-[4px] border border-border bg-surface">
              <div
                role="button"
                tabIndex={0}
                aria-label={open[r.id] ? "Свернуть" : "Развернуть"}
                onClick={() => setOpen((p) => ({ ...p, [r.id]: !p[r.id] }))}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((p) => ({ ...p, [r.id]: !p[r.id] })); }}
                className="flex min-h-[56px] cursor-pointer items-center gap-4 px-6 outline-none"
              >
                <span className="ds-p3 flex-1 text-foreground">{r.name}</span>
                <LevelBadge level={r.level} />
                <Chevron open={open[r.id] ?? false} />
              </div>
              {open[r.id] && <div className="border-t border-border"><ReqDetailBody req={r} /></div>}
            </div>
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex flex-col gap-3">
                <Input size="l" className="w-[280px]" placeholder="Стоимость выдачи" rightIcon={<QIcon />} value={costs[r.id]?.issue ?? ""} onChange={(e) => setCost(r.id, "issue", e.target.value)} />
                <Input size="l" className="w-[280px]" placeholder="Стоимость использования" rightIcon={<QIcon />} value={costs[r.id]?.use ?? ""} onChange={(e) => setCost(r.id, "use", e.target.value)} />
              </div>
              <label className="mt-3 flex cursor-pointer items-center gap-3">
                <Checkbox size="xs" />
                <span className="ds-p3 text-foreground-muted">Валидатор сам указывает стоимость выдачи</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </SubShell>
  );
}

/** Блок «Верификации» (правая колонка). Стадии (Figma 6752-447051 → 445025 → 446306):
 *  1) роли заполнены, не согласованы → тоггл OFF + «Согласовать»;
 *  2) роли согласованы → тоггл ON «Активирован»; добавлены требования валидатора →
 *     чекбоксы + «Согласовать верификации»;
 *  3) верификации согласованы → «Согласовано» у требований + «Отправить на валидатора». */
function VerifBlock({
  rolesApproved,
  reqs,
  verifDone,
  locked,
  onApproveRoles,
  onApproveVerif,
}: {
  rolesApproved: boolean;
  reqs: VerifReq[];
  verifDone: boolean;
  /** Идёт голосование → кнопки согласования залочены. */
  locked: boolean;
  onApproveRoles: () => void;
  onApproveVerif: () => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set());
  // Тоггл активации требований пользователя (кликабельный; после согласования —
  // всегда включён «Активирован»).
  const [userReqOn, setUserReqOn] = useState(false);
  // Отправка на валидаторов: idle → sending (10с можно отменить) → done (кнопки нет).
  const [sendState, setSendState] = useState<"idle" | "sending" | "done">("idle");
  useEffect(() => {
    if (sendState !== "sending") return;
    const t = setTimeout(() => setSendState("done"), 10000);
    return () => clearTimeout(t);
  }, [sendState]);
  const sqColor: Record<Level, string> = { yellow: "var(--color-orange-300)", green: "var(--color-green-300)" };
  return (
    <div className="overflow-hidden rounded-[4px] border border-border bg-surface">
      <div className="flex h-[66px] items-center border-b border-border bg-surface-sunken px-6">
        <span className="ds-p3 text-foreground">Верификации</span>
      </div>
      <div className="flex flex-col gap-4 p-6">
        {/* Требования для пользователя */}
        <div className="overflow-hidden rounded-[4px] border border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <EyeIcon />
            <span className="ds-p3 flex-1 text-foreground">Требования для пользователя</span>
            <Toggle size="s" checked={rolesApproved || userReqOn} onChange={(e) => setUserReqOn(e.target.checked)} />
          </div>
          {rolesApproved && (
            <div className="ds-caption flex items-center justify-between border-t border-border px-4 py-2">
              <span className="text-foreground-subtle">Статус: <span className="text-foreground">Активирован</span></span>
              <span className="text-foreground-subtle">Дата: <span className="text-foreground">24.02.2020</span></span>
            </div>
          )}
        </div>
        {/* Требования валидатора — чекбоксы / после голосования статусы */}
        {reqs.length > 0 && (
          <div className="flex flex-col gap-3">
            {reqs.map((r) => (
              <div key={r.id} className="overflow-hidden rounded-[4px] border border-border">
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="size-5 shrink-0 rounded-[4px]" style={{ background: sqColor[r.level] }} />
                  <span className="ds-p3 flex-1 text-foreground">{r.name}</span>
                  {verifDone ? <CheckMark /> : <Checkbox size="xs" checked={checked.has(r.id)} onChange={() => setChecked((p) => { const n = new Set(p); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })} aria-label={r.name} />}
                </div>
                {verifDone && (
                  <div className="ds-caption flex flex-col gap-2 border-t border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-subtle">Статус: <span className="text-foreground">Согласован</span></span>
                      <span className="text-foreground-subtle">Дата: <span className="text-foreground">24.02.2020</span></span>
                    </div>
                    <span className="text-foreground-subtle">Количество компаний валидаторов: <span className="text-foreground">0/6</span></span>
                    <span className="text-foreground-subtle">Общее число сотрудников: <span className="text-foreground">0/5</span></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Кнопка текущей стадии (залочена, пока идёт голосование) */}
        {!rolesApproved ? (
          <Button fullWidth disabled={locked} onClick={onApproveRoles}>Согласовать</Button>
        ) : verifDone ? (
          // Отправка → 10с можно отменить → кнопка исчезает.
          sendState === "done" ? null : sendState === "sending" ? (
            <Button variant="negative-sec" fullWidth onClick={() => setSendState("idle")}>Отменить отправку на валидаторов</Button>
          ) : (
            <Button fullWidth onClick={() => setSendState("sending")}>Отправить на валидаторов</Button>
          )
        ) : reqs.length > 0 ? (
          <Button fullWidth disabled={locked || checked.size === 0} onClick={onApproveVerif}>Согласовать верификации</Button>
        ) : null}
      </div>
    </div>
  );
}

function CheckMark() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-[4px] bg-[var(--color-blue-midhub-500)] text-[#fff]">
      <svg viewBox="0 0 24 24" width={14} height={14} fill="none"><path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

const ROLE_OPTIONS = [
  "Пайщик MIDHUB Global",
  "Пайщик национального кооператива РФ",
  "Валидатор",
  "Эмитент",
  "Председатель правления",
];

/** «Необходимая роль» — выбор ролей чипами (DS TagInput, режим пула): «+»
 *  добавляет роль из списка, чип с «×» удаляет (Figma 6752-447052). */
function AddRoleField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <TagInput
      size="l"
      label="Пользователь должен иметь роль"
      placeholder="Необходимая роль"
      addLabel="Необходимая роль"
      options={ROLE_OPTIONS}
      value={value}
      onValueChange={onChange}
    />
  );
}

/** «+ Добавить …» — по центру тела панели (единый вид для пустых блоков). */
function AddReqButton({ label = "Добавить требование", onAdd }: { label?: string; onAdd?: () => void }) {
  return (
    <div className="flex justify-center">
      <Button variant="tertiary" iconLeft={<PlusIcon />} onClick={onAdd}>{label}</Button>
    </div>
  );
}

/** Карточка «Детали шаблона» (шапка с шестерёнкой) — кнопка «Согласовать» или статус.
 *  status: draft (кнопка) · voting (идёт голосование — «На голосовании») ·
 *  done (голосование завершено — «Согласован» + дата). */
function DetailsCard({ status, canApprove, onApprove }: { status: "draft" | "voting" | "done"; canApprove: boolean; onApprove: () => void }) {
  return (
    <div className="rounded-[4px] border border-border bg-surface">
      <div className="flex h-[66px] items-center justify-between rounded-t-[4px] border-b border-border bg-surface-sunken px-6">
        <span className="ds-p3 text-foreground">Детали шаблона</span>
        <Dropdown
          align="end"
          items={[
            { value: "version", label: "Создать новую версию" },
            { value: "archive", label: "Архивировать" },
          ]}
          trigger={() => (
            <span className="cursor-pointer text-foreground-subtle transition-colors hover:text-foreground">
              <GearIcon />
            </span>
          )}
        />
      </div>
      <div className="p-6">
        {status === "draft" ? (
          <Button fullWidth disabled={!canApprove} onClick={onApprove}>Согласовать шаблон</Button>
        ) : status === "voting" ? (
          <div className="ds-p3 text-foreground-subtle">Статус: <span className="text-[#f18000]">На голосовании</span></div>
        ) : (
          <div className="ds-p3 flex items-center justify-between gap-3">
            <span className="text-foreground-subtle">Статус: <span className="text-[var(--color-green-500)]">Согласован</span></span>
            <span className="text-foreground-subtle">Дата: 24.02.2020</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TemplateFlow({
  leafTitle,
  initial,
  onClose,
  onCommit,
  onUpdate,
}: {
  /** Лист, в котором создаётся шаблон. */
  leafTitle: string;
  /** Существующий шаблон → режим просмотра (после голосования). */
  initial?: TemplateDoc;
  onClose: () => void;
  /** Шаблон согласован → появляется в листе как «на голосовании». */
  onCommit: (tpl: TemplateDoc) => void;
  onUpdate: (tpl: TemplateDoc) => void;
}) {
  const flow = useRegFlow();
  const existing = initial != null;

  const [tab, setTab] = useState<TemplateTab>("template");
  const [approved, setApproved] = useState(existing);
  const [fields, setFields] = useState<FieldDef[]>(existing ? MOCK_FIELD_DEFS : []);
  const [adding, setAdding] = useState(false);
  const [mockDumped, setMockDumped] = useState(existing);
  const [voteId, setVoteId] = useState<string | null>(initial?.voteId ?? null);
  const [tplId] = useState(() => initial?.id ?? genTemplateId());
  // Верификации: роли пользователя + требования валидатора + стадии согласования.
  // Инициализируются из initial и сохраняются (onUpdate), чтобы не терялись.
  const [roles, setRoles] = useState<string[]>(initial?.roles ?? []);
  const [rolesApproved, setRolesApproved] = useState(initial?.rolesApproved ?? false);
  const [validatorReqs, setValidatorReqs] = useState<VerifReq[]>(initial?.validatorReqs ?? []);
  const [verifDone, setVerifDone] = useState(initial?.verifDone ?? false);
  const [sub, setSub] = useState<null | "pick" | "cost">(null);
  const [picked, setPicked] = useState<Omit<VerifReq, "issue" | "use">[]>([]);
  const [verifVoteId, setVerifVoteId] = useState<string | null>(null);
  const [verifStage, setVerifStage] = useState<"roles" | "validator">("roles");
  const [committed, setCommitted] = useState(existing);

  const name = existing ? initial!.name : NEW_TEMPLATE_NAME;
  const title = approved ? name : "Создание шаблона";
  const vote = flow.paymentVotes.find((v) => v.id === voteId);
  // Текущее голосование вкладки «Голосование»: сначала шаблон, затем — активное
  // голосование верификаций (роли → валидатор). Каждая «Согласовать» его меняет.
  const currentVoteId = verifVoteId ?? voteId;
  const currentVote = flow.paymentVotes.find((v) => v.id === currentVoteId);

  // Статус «Детали шаблона» — по голосованию шаблона (Согласован / На голосовании).
  const finished = (vote?.done ?? false) || initial?.status === "active";
  const detailStatus: "draft" | "voting" | "done" = !approved ? "draft" : finished ? "done" : "voting";
  // Идёт голосование (текущее не завершено) → кнопки действий залочены.
  const votingActive = !!currentVote && !currentVote.done;
  const highlightVoting = approved && votingActive;

  const build = (status: "voting" | "active"): TemplateDoc => ({
    id: tplId,
    leafTitle: initial?.leafTitle ?? leafTitle,
    name,
    status,
    voteId: voteId ?? undefined,
    roles,
    rolesApproved,
    validatorReqs,
    verifDone,
  });

  // Сохраняем состояние верификаций в родителя (после согласования шаблона),
  // чтобы при повторном открытии блоки не сбрасывались в дефолт.
  useEffect(() => {
    if (!committed) return;
    onUpdate(build(finished ? "active" : "voting"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, rolesApproved, validatorReqs, verifDone, committed]);

  // «Добавить поле»: 1-й клик — форма; после первого поля повторный клик —
  // подгружает моковые поля (по описанию флоу).
  const handleAddField = () => {
    if (approved) return;
    if (fields.length === 0 && !mockDumped) { setAdding(true); return; }
    setFields(MOCK_FIELD_DEFS);
    setMockDumped(true);
    setAdding(false);
  };

  const approve = () => {
    const id = flow.submitPaymentVote({ title: name, docName: "", amount: "", recipients: [] });
    setVoteId(id);
    setApproved(true);
    setCommitted(true);
    onCommit({ id: tplId, leafTitle: initial?.leafTitle ?? leafTitle, name, status: "voting", voteId: id });
  };

  // «Согласовать …» → создаёт голосование и подсвечивает вкладку «Голосование»
  // (окно голосования открывается по клику на вкладку, а не сразу в «Шаблон»).
  const startVerifVote = (stage: "roles" | "validator") => {
    const id = flow.submitPaymentVote({
      title: stage === "roles" ? "Согласование требований пользователя" : "Согласование верификаций",
      docName: "", amount: "", recipients: [],
    });
    setVerifStage(stage);
    setVerifVoteId(id);
  };

  // Завершение текущего голосования: шаблон → active; роли → rolesApproved;
  // валидатор → verifDone.
  const onVoteFinish = () => {
    if (currentVoteId === voteId) onUpdate(build("active"));
    else if (verifStage === "roles") setRolesApproved(true);
    else setVerifDone(true);
  };

  // ── Под-экраны (выбор требований / стоимость / голосование верификаций) ──
  if (sub === "pick") {
    return (
      <RequirementPicker
        onClose={onClose}
        onCancel={() => setSub(null)}
        onPick={(reqs) => { setPicked(reqs); setSub("cost"); }}
      />
    );
  }
  if (sub === "cost") {
    return (
      <RequirementCost
        reqs={picked}
        onClose={onClose}
        onCancel={() => setSub("pick")}
        onAdd={(reqs) => { setValidatorReqs((p) => [...p, ...reqs]); setSub(null); }}
      />
    );
  }
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Шапка флоу: лого + выход */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-[#fff] px-5">
        <MidhubLogo className="size-8" />
        <button type="button" aria-label="Выход" onClick={onClose} className="text-foreground-subtle transition-colors hover:text-foreground">
          <HeaderExitIcon />
        </button>
      </header>

      <main className="min-w-0 flex-1 px-5 py-8 md:px-[50px]">
        {/* Назад + вкладки справа */}
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            aria-label="Назад"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-[4px] border border-border bg-surface-sunken text-foreground-subtle"
          >
            <BackChevron />
          </button>
          <Tabs value={tab} onValueChange={(v) => setTab(v as TemplateTab)} variant="basic" size="m" aria-label="Разделы шаблона">
            <Tab value="template">Шаблон</Tab>
            <Tab value="voting" disabled={!approved} className={highlightVoting && tab !== "voting" ? "!text-[#f18000]" : undefined}>Голосование</Tab>
            <Tab value="validators" disabled={!approved}>Валидаторы</Tab>
            <Tab value="domains" disabled={!approved}>Домены</Tab>
          </Tabs>
        </div>

        <h1 className="ds-h5 mt-4 text-foreground">{title}</h1>

        {tab === "template" && (
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* ── Левая колонка: свойства + поля + требования (≈2/3) ── */}
            <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-[2]">
              {approved ? (
                <MemberCard title="Свойства документа" defaultOpen rows={PROPS_ROWS} />
              ) : (
                <DocPropsForm />
              )}

              <Panel
                title="Поля документа"
                bodyClassName={(adding && !approved) || fields.length > 0 ? "p-0" : undefined}
              >
                {(adding && !approved) || fields.length > 0 ? (
                  <>
                    {/* Подшапка «Добавить новое поле» — вплотную к шапке панели, со
                        стрелкой (раскрыть/скрыть форму) */}
                    {adding && !approved && (
                      <AddFieldBlock
                        onAdd={(field) => { setFields((prev) => [...prev, field]); setAdding(false); }}
                        onCancel={() => setAdding(false)}
                      />
                    )}
                    {fields.length > 0 && (
                      <div className="flex flex-col">
                        {fields.map((f, i) => (
                          <FieldRow
                            key={i}
                            field={f}
                            readOnly={approved}
                            onEdit={() => setAdding(true)}
                            onDelete={() => setFields((prev) => prev.filter((_, idx) => idx !== i))}
                          />
                        ))}
                      </div>
                    )}
                    {!approved && (
                      <div className="flex justify-center border-t border-border py-4">
                        <Button variant="tertiary" iconLeft={<PlusIcon />} onClick={handleAddField}>Добавить поле</Button>
                      </div>
                    )}
                  </>
                ) : (
                  <AddReqButton label="Добавить поле" onAdd={handleAddField} />
                )}
              </Panel>

              {/* Требования для пользователя: редактирование (TagInput, дропдаун не
                  обрезается) → после согласования read-only «Необходимая роль: …». */}
              <Panel
                title="Требования для пользователя"
                className={rolesApproved ? undefined : "overflow-visible"}
                bodyClassName={rolesApproved ? "p-0" : undefined}
              >
                {rolesApproved ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-6 px-6 py-4">
                      <span className="ds-p3 w-[160px] shrink-0 text-foreground-subtle">Необходимая роль</span>
                      <span className="ds-p3 text-foreground">{roles.join(", ")}</span>
                    </div>
                    <div className="flex justify-center border-t border-border py-4">
                      <Button variant="tertiary" iconLeft={<PlusIcon />} onClick={() => setSub("pick")}>Добавить требование</Button>
                    </div>
                  </div>
                ) : (
                  <AddRoleField value={roles} onChange={setRoles} />
                )}
              </Panel>
              <Panel
                title="Требования для валидатора к локальной проверке"
                bodyClassName={validatorReqs.length ? "p-0" : undefined}
              >
                {validatorReqs.length > 0 ? (
                  <>
                    <div className="flex flex-col">
                      {validatorReqs.map((r) => (
                        <ReqCollapsible key={r.id} req={r} />
                      ))}
                    </div>
                    <div className="flex justify-center border-t border-border py-4">
                      <Button variant="tertiary" iconLeft={<PlusIcon />} onClick={() => setSub("pick")}>Добавить требование</Button>
                    </div>
                  </>
                ) : (
                  <AddReqButton onAdd={() => setSub("pick")} />
                )}
              </Panel>
              <Panel title="Требования для валидатора к международной проверке">
                <p className="ds-p3 text-center text-foreground-subtle">Тут отображаются международные требования от глобального домена</p>
              </Panel>
              <Panel title="Требования для эмитента">
                <AddReqButton />
              </Panel>
            </div>

            {/* ── Правая колонка: описание + детали (≈1/3) ── */}
            <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-[1]">
              <Panel title="Описание к шаблону">
                <Textarea size="l" placeholder="Описание" readOnly={approved} defaultValue={approved ? "Очень крутой шаблон для вас" : undefined} />
              </Panel>
              <DetailsCard status={detailStatus} canApprove={mockDumped} onApprove={approve} />
              {/* Блок «Верификации» появляется, когда указаны роли пользователя */}
              {approved && roles.length > 0 && (
                <VerifBlock
                  rolesApproved={rolesApproved}
                  reqs={validatorReqs}
                  verifDone={verifDone}
                  locked={votingActive}
                  onApproveRoles={() => startVerifVote("roles")}
                  onApproveVerif={() => startVerifVote("validator")}
                />
              )}
            </div>
          </div>
        )}

        {tab === "voting" && (
          <div className="mt-6 flex w-full flex-col gap-6">
            {currentVote ? (
              <VotingBlock key={currentVoteId ?? ""} vote={currentVote} onFinish={onVoteFinish} />
            ) : (
              <p className="ds-p3 text-foreground-subtle">Согласуйте шаблон, чтобы начать голосование.</p>
            )}
          </div>
        )}

        {(tab === "validators" || tab === "domains") && (
          <p className="ds-p3 mt-6 text-foreground-subtle">Раздел в разработке.</p>
        )}
      </main>
    </div>
  );
}
