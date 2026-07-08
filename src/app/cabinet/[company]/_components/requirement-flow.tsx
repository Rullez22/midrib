"use client";

import { useState, type ReactNode } from "react";
import {
  Input,
  Textarea,
  Combobox,
  Radio,
  Badge,
  Button,
  Checkbox,
  CheckMatrix,
  SectionHeader,
  DeleteButton,
  EditPencilIcon,
  HeaderArrowLeftIcon,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { VotingBlock } from "../../voting/_components/voting-block";

/**
 * RequirementFlow — флоу «Создание требования» (кабинет №4 Домены, вкладка
 * «Требования»). Источник Figma: 6752-446149/446224 (форма) · 446159/446169
 * (выбор документа) · 446179 (форма с документами / редактирование) · 446194
 * (предпросмотр) · 446239/446241 (голосование) · 446214 (деталь).
 *
 * Фазы одного мастер-экрана:
 *   form    — форма требования (название/раздел/описание/тип + матрица уровней
 *             + выбор документов) → «Создать требование».
 *   summary — предпросмотр read-only → «Отправить на голосование» / «Редактировать».
 *   voting  — предпросмотр + универсальный блок голосования (reuse VotingBlock).
 *   detail  — деталь готового требования → «Редактировать» / «Удалить».
 *
 * Reuse-first (ничего не верстаем заново):
 *   • каркас FlowShell (CompanySidebar + back + SectionHeader) — как в PdRequestFlow;
 *   • форма: Input · Combobox · Textarea · Radio + Badge · CheckMatrix (уровень
 *     верификации) · Checkbox (дерево документов) · Button · DeleteButton/EditPencilIcon;
 *   • голосование: VotingBlock (карточка «Голосование» + ProgressRing + За/Против
 *     + «История транзакций»), вопрос создаётся через RegFlow.submitPaymentVote.
 */

export interface Requirement {
  id: string;
  segment: RequirementSegment;
  name: string;
  section: string;
  domain: string;
  description: string;
  level: "green" | "yellow";
  matrix: boolean[][];
  documents: string[];
  /** Статус: на голосовании (в табе плашка «На голосовании») или активно
   *  (голосование завершено). */
  status: RequirementStatus;
  /** Id вопроса голосования в RegFlow — чтобы вернуться к голосованию. */
  voteId?: string;
}

export type RequirementStatus = "voting" | "active";

export type RequirementSegment = "docs" | "plots" | "roles";

const SECTION_OPTIONS = [
  { value: "Для документов", label: "Для документов" },
  { value: "Для участков", label: "Для участков" },
  { value: "Для ролей", label: "Для ролей" },
];

const SECTION_BY_SEGMENT: Record<RequirementSegment, string> = {
  docs: "Для документов",
  plots: "Для участков",
  roles: "Для ролей",
};

/** Дерево шаблонов домена «Россия» для выбора подтверждающих документов
 *  (1:1 со структурой DocumentSettings: гео-вложенность → документы-листы). */
interface TreeNode {
  name: string;
  children?: TreeNode[];
}
const DOC_TREE: TreeNode[] = [
  {
    name: "РОССИЯ",
    children: [
      { name: "Все документы", children: ["Паспорт", "Заграничный паспорт", "СНИЛС", "ИНН"].map((name) => ({ name })) },
      {
        name: "Удостоверяющие личность",
        children: [
          {
            name: "Красноярский край",
            children: [
              {
                name: "Минусинский район",
                children: [
                  {
                    name: "Большеничкинский сельсовет",
                    children: [
                      {
                        name: "Село Большая Ничка",
                        children: [{ name: "Паспорт" }, { name: "Удостоверение нотариуса РФ" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { name: "Образование", children: ["Диплом", "Аттестат"].map((name) => ({ name })) },
    ],
  },
];

let reqSeq = 0;
function genId() {
  reqSeq += 1;
  return `req-${reqSeq}-${reqSeq * 7919}`;
}

// ── Каркас экрана флоу (sidebar + back + центрированный заголовок) ─────────────
function FlowShell({
  cabinet,
  current,
  title,
  onBack,
  children,
}: {
  cabinet: CabinetConfig;
  current: string;
  title: ReactNode;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          <div className="relative flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              size="m"
              icon={<HeaderArrowLeftIcon />}
              aria-label="Назад"
              className="absolute left-0 top-0"
              onClick={onBack}
            />
            <SectionHeader title={title} />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="ds-p3 text-foreground">{children}</span>;
}

/** Read-only плашка значения (предпросмотр/деталь). */
function ReadField({ label, children }: { label?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="ds-p3 min-h-[48px] rounded-[4px] border border-border bg-[#f9fafc] px-4 py-3 text-foreground-muted">
        {children}
      </div>
    </div>
  );
}

function LevelBadge({ level }: { level: "green" | "yellow" }) {
  return level === "green" ? (
    <Badge variant="solid" color="green">Зелёный</Badge>
  ) : (
    <Badge variant="solid" color="orange">Жёлтый</Badge>
  );
}

// ── Дерево выбора документов (Чекбоксы + поиск + фильтры) — f03/f04 ────────────
function DocTreePicker({ onPick, onCancel }: { onPick: (docs: string[]) => void; onCancel: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set(["РОССИЯ", "Удостоверяющие личность", "Красноярский край", "Минусинский район", "Большеничкинский сельсовет", "Село Большая Ничка"]));
  const [sel, setSel] = useState<Set<string>>(() => new Set());
  const q = query.trim().toLowerCase();

  const matches = (n: TreeNode): boolean =>
    n.children ? n.children.some(matches) : n.name.toLowerCase().includes(q);
  const toggleGroup = (name: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  const toggleLeaf = (key: string) =>
    setSel((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const renderTree = (nodes: TreeNode[], depth: number, path: string): ReactNode[] =>
    nodes
      .filter((n) => q === "" || matches(n))
      .map((n) => {
        const pad = 16 + depth * 20;
        const key = `${path}/${n.name}`;
        if (n.children) {
          const gopen = q !== "" || open.has(n.name);
          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => toggleGroup(n.name)}
                className="flex w-full items-center gap-2 border-b border-border py-2.5 text-left"
                style={{ paddingLeft: pad }}
              >
                <Chevron open={gopen} />
                <span className={cn("ds-p3", gopen ? "text-foreground" : "text-foreground-muted")}>{n.name}</span>
              </button>
              {gopen && renderTree(n.children, depth + 1, key)}
            </div>
          );
        }
        return (
          <div key={key} className="border-b border-border" style={{ paddingLeft: pad }}>
            <div className="py-2.5">
              <Checkbox
                size="xs"
                checked={sel.has(n.name)}
                onChange={() => toggleLeaf(n.name)}
                label={<span className="text-foreground">{n.name}</span>}
              />
            </div>
          </div>
        );
      });

  return (
    <div className="flex flex-col gap-4">
      {/* Фильтры категорий (косметические, как в Figma — отмечены) */}
      <div className="flex flex-wrap gap-6">
        {["Сертификаты", "Документы для физических лиц", "Документы для юридических лиц"].map((f) => (
          <Checkbox key={f} size="xs" defaultChecked label={<span className="text-foreground-muted">{f}</span>} />
        ))}
      </div>

      <div className="overflow-hidden rounded-[4px] border border-border bg-white">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <SearchIcon />
          <input
            className="ds-p2 w-full bg-transparent text-foreground outline-none placeholder:text-foreground-subtle"
            placeholder="Поиск шаблонов в домене Россия"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>{renderTree(DOC_TREE, 0, "")}</div>
        <div className="flex gap-3 border-t border-border bg-surface-sunken/40 px-4 py-3">
          <Button size="s" disabled={sel.size === 0} onClick={() => onPick([...sel])}>Выбрать</Button>
          <Button size="s" variant="negative-sec" onClick={onCancel}>Отменить</Button>
        </div>
      </div>
    </div>
  );
}

// ── Иконки ────────────────────────────────────────────────────────────────────
function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cn("size-4 shrink-0 text-foreground-muted transition-transform", open && "rotate-180")}>
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Предпросмотр требования (read-only summary) — f06/f07/f09/f11 ──────────────
const SCOPE_LABELS = ["Международный", "Локальный"] as const;

function SummaryView({ req }: { req: Requirement }) {
  // Строки уровня верификации берём из матрицы (что отметили в форме): по строке
  // на scope, в которой отмечены колонки Жёлтый(0)/Зелёный(1). Если ничего не
  // отмечено — fallback на выбранный «Тип верификации».
  const scopeLines = SCOPE_LABELS.map((label, ri) => {
    const colors: ("yellow" | "green")[] = [];
    if (req.matrix[ri]?.[0]) colors.push("yellow");
    if (req.matrix[ri]?.[1]) colors.push("green");
    return colors.length ? { label, colors } : null;
  }).filter(Boolean) as { label: string; colors: ("yellow" | "green")[] }[];
  const verifLines = scopeLines.length ? scopeLines : [{ label: "Международный", colors: [req.level] }];

  return (
    <div className="flex w-full max-w-[814px] flex-col gap-6">
      <ReadField label="Раздел для добавления">{req.section}</ReadField>
      <ReadField label="Описание">
        <div className="flex flex-col gap-3 whitespace-pre-line">{req.description || "—"}</div>
      </ReadField>
      <ReadField label="Тип верификации">
        <LevelBadge level={req.level} />
      </ReadField>

      <div className="flex flex-col gap-3">
        <FieldLabel>Верификации к валидаторам</FieldLabel>
        <div className="flex flex-col gap-4 rounded-[4px] border border-border p-6">
          <span className="ds-p3 text-foreground-muted">Тип верификаций для документов, подтверждающих соответствие верификации</span>
          <div className="flex flex-col gap-3 border-b border-border pb-4">
            {verifLines.map(({ label, colors }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="ds-p3 text-foreground-subtle">{label}:</span>
                {colors.map((c) => <LevelBadge key={c} level={c} />)}
              </div>
            ))}
          </div>
          <span className="ds-p3 text-foreground-muted">Документы, подтверждающие соответствие верификациям</span>
          <div className="flex flex-col gap-2">
            {req.documents.map((d) => (
              <div key={d} className="ds-p3 rounded-[4px] border border-border bg-[#f9fafc] px-4 py-3 text-foreground-muted">{d}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type Phase = "form" | "summary" | "voting" | "detail";

export function RequirementFlow({
  cabinet,
  current,
  segment,
  initial,
  onClose,
  onCommit,
  onUpdate,
  onDelete,
}: {
  cabinet: CabinetConfig;
  current: string;
  segment: RequirementSegment;
  /** Существующее требование → режим детали/редактирования. */
  initial?: Requirement;
  onClose: () => void;
  /** Требование отправлено на голосование (впервые появляется в табе). */
  onCommit: (req: Requirement) => void;
  onUpdate: (req: Requirement) => void;
  onDelete: (id: string) => void;
}) {
  const flow = useRegFlow();
  const existing = initial != null;

  // Существующее требование «на голосовании» открывается сразу в фазе голосования
  // (возврат к незавершённому голосованию), «активное» — в детали.
  const [phase, setPhase] = useState<Phase>(
    !existing ? "form" : initial!.status === "voting" ? "voting" : "detail",
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [section, setSection] = useState(initial?.section ?? SECTION_BY_SEGMENT[segment]);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [level, setLevel] = useState<"green" | "yellow">(initial?.level ?? "green");
  const [matrix, setMatrix] = useState<boolean[][]>(initial?.matrix ?? [[false, false], [false, false]]);
  const [documents, setDocuments] = useState<string[]>(initial?.documents ?? []);
  const [picking, setPicking] = useState(false);
  const [voteId, setVoteId] = useState<string | null>(initial?.voteId ?? null);

  const toggleMatrix = (r: number, c: number) =>
    setMatrix((m) => m.map((row, ri) => (ri === r ? row.map((v, ci) => (ci === c ? !v : v)) : row)));

  const canSubmit = name.trim().length > 0 && documents.length > 0;

  const build = (status: RequirementStatus = "active", vId: string | null = voteId): Requirement => ({
    id: initial?.id ?? genId(),
    segment,
    name: name.trim(),
    section,
    domain: "Удостоверяющие личность Красноярска",
    description,
    level,
    matrix,
    documents,
    status,
    voteId: vId ?? undefined,
  });

  const addDocuments = (docs: string[]) => {
    setDocuments((prev) => Array.from(new Set([...prev, ...docs])));
    setPicking(false);
  };

  // ── Фаза: форма (создание/редактирование) ──────────────────────────────────
  if (phase === "form") {
    return (
      <FlowShell cabinet={cabinet} current={current} title="Создание требования" onBack={onClose}>
        <div className="flex w-full max-w-[814px] flex-col gap-5">
          <Input size="l" placeholder="Название требования" value={name} onChange={(e) => setName(e.target.value)} />

          <div className="flex flex-col gap-2">
            <FieldLabel>Раздел для добавления</FieldLabel>
            <Combobox size="l" options={SECTION_OPTIONS} value={section} onValueChange={setSection} placeholder="Сохранить в раздел" />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Описание</FieldLabel>
            <Textarea size="l" rows={5} placeholder="Текст описания" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="flex flex-col gap-3">
            <FieldLabel>Тип верификации</FieldLabel>
            <Radio name="vlevel" size="xs" checked={level === "green"} onChange={() => setLevel("green")} label={<Badge variant="solid" color="green">Зелёный</Badge>} />
            <Radio name="vlevel" size="xs" checked={level === "yellow"} onChange={() => setLevel("yellow")} label={<Badge variant="solid" color="orange">Жёлтый</Badge>} />
          </div>

          <div className="flex flex-col gap-3">
            <FieldLabel>Верификации к валидаторам</FieldLabel>
            <span className="ds-caption text-foreground-muted">1. Выберите уровень верификаций которому должен соответствовать запрашиваемый документ</span>
            <CheckMatrix
              rowHeader="Тип требований"
              columns={[<Badge key="y" variant="solid" color="orange">Жёлтый</Badge>, <Badge key="g" variant="solid" color="green">Зелёный</Badge>]}
              rows={[{ label: "Международный" }, { label: "Локальный" }]}
              checked={matrix}
              onToggle={toggleMatrix}
            />
            <span className="ds-caption text-foreground-muted">2. Выберите документы, подтверждающие соответствие требованиям</span>

            {/* Выбранные документы (read-only плашка + редактировать/удалить) */}
            {documents.length > 0 && (
              <div className="flex flex-col gap-3">
                {documents.map((d) => (
                  <div key={d} className="flex items-center gap-5">
                    <div className="ds-p3 flex-1 rounded-[4px] border border-border bg-[#f9fafc] px-4 py-3 text-foreground-muted">{d}</div>
                    <button type="button" aria-label="Редактировать" onClick={() => setPicking(true)} className="text-[var(--color-blue-midhub-500)]">
                      <EditPencilIcon className="size-5" />
                    </button>
                    <DeleteButton size="md" aria-label="Удалить" onClick={() => setDocuments((prev) => prev.filter((x) => x !== d))} />
                  </div>
                ))}
              </div>
            )}

            {picking ? (
              <DocTreePicker onPick={addDocuments} onCancel={() => setPicking(false)} />
            ) : (
              <Button variant="secondary" size="m" className="self-start" onClick={() => setPicking(true)}>Добавить документ</Button>
            )}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <Button
              disabled={!canSubmit}
              onClick={() => {
                if (existing) { onUpdate(build()); setPhase("detail"); }
                else setPhase("summary");
              }}
            >
              {existing ? "Сохранить" : "Создать требование"}
            </Button>
            <Button variant="negative-sec" onClick={existing ? () => setPhase("detail") : onClose}>Отменить</Button>
          </div>
        </div>
      </FlowShell>
    );
  }

  // ── Фаза: предпросмотр ──────────────────────────────────────────────────────
  if (phase === "summary") {
    const req = build();
    return (
      <FlowShell cabinet={cabinet} current={current} title={req.name} onBack={() => setPhase("form")}>
        <SummaryView req={req} />
        <div className="mt-2 flex w-full max-w-[814px] items-center gap-4">
          <Button
            onClick={() => {
              const id = flow.submitPaymentVote({ title: req.name, docName: req.documents[0] ?? "", amount: "", recipients: [] });
              setVoteId(id);
              onCommit(build("voting", id));
              setPhase("voting");
            }}
          >
            Отправить на голосование
          </Button>
          <Button variant="secondary" onClick={() => setPhase("form")}>Редактировать</Button>
        </div>
      </FlowShell>
    );
  }

  // ── Фаза: голосование (reuse VotingBlock) ───────────────────────────────────
  if (phase === "voting") {
    const req = build();
    const vote = flow.paymentVotes.find((v) => v.id === voteId);
    return (
      <FlowShell cabinet={cabinet} current={current} title={req.name} onBack={onClose}>
        <SummaryView req={req} />
        {vote && <VotingBlock vote={vote} onFinish={() => { onUpdate(build("active")); onClose(); }} />}
      </FlowShell>
    );
  }

  // ── Фаза: деталь готового требования ────────────────────────────────────────
  const req = build();
  return (
    <FlowShell cabinet={cabinet} current={current} title={req.name} onBack={onClose}>
      <SummaryView req={req} />
      <div className="mt-2 flex w-full max-w-[814px] items-center gap-4">
        <Button onClick={() => setPhase("form")}>Редактировать</Button>
        <Button variant="negative-sec" onClick={() => onDelete(req.id)}>Удалить</Button>
      </div>
    </FlowShell>
  );
}
