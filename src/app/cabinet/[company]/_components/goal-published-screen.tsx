"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, TableHeader, type TableColumn, Input, Textarea, Button, Modal, Dropdown, Badge } from "@/components/ds";
import { cn } from "@/lib/cn";
import { CompanySidebar } from "./company-sidebar";
import { GoalProgressBar } from "./goal-progress";
import { type Goal } from "./goals-data";
import { type CabinetConfig } from "../_config/cabinets";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { KINDS } from "../../partners/_components/doc-kinds";
import { DOC_STATUS_COLOR } from "../../partners/_components/partners-data";

/**
 * GoalPublishedScreen — экран опубликованной цели (Figma 7021:587278 —
 * раскрытое описание, 7021:587201 — скрытое, 7021:587330 — таб «Документы»,
 * 7021:587401 — таб «Публикация»). Сайдбар — наш (CompanySidebar). Reuse DS:
 * Tabs · Tab · TableHeader · Input · Textarea · Button.
 */

/* ── Иконки ──────────────────────────────────────────────────────────────── */
function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-foreground-subtle">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-primary">
      <path d="M8 14s5-4.2 5-8A5 5 0 0 0 3 6c0 3.8 5 8 5 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="8" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function KebabIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5 text-foreground-subtle">
      <circle cx="10" cy="4" r="1.4" fill="currentColor" />
      <circle cx="10" cy="10" r="1.4" fill="currentColor" />
      <circle cx="10" cy="16" r="1.4" fill="currentColor" />
    </svg>
  );
}
function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d={dir === "left" ? "m10 3-5 5 5 5" : "m6 3 5 5-5 5"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function VelestaLogo() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5">
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-4 text-foreground">
        <path d="M3 4h14l-7 12z" fill="currentColor" />
        <path d="M7 4h6l-3 5z" fill="#fff" />
      </svg>
      <span className="text-[10px] font-semibold tracking-[0.08em] text-foreground">VELESTA</span>
    </span>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5 shrink-0 text-foreground-subtle">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 7.2v3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="5.4" r="0.7" fill="currentColor" />
    </svg>
  );
}

/** Строка блокчейн-подписи в попапах истории / подтверждения. */
function ChainRow({ label, hash, date }: { label: string; hash: string; date: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[6px] bg-[var(--color-grey-95,#f4f6f9)] px-4 py-3">
      <span className="ds-p3 min-w-[130px] text-foreground">{label}</span>
      <VelestaLogo />
      <span className="flex flex-1 items-center justify-center gap-1.5">
        <span className="ds-p3 text-primary">{hash}</span>
        <InfoIcon />
      </span>
      <span className="ds-p3 shrink-0 text-foreground">{date}</span>
    </div>
  );
}

/* ── Иллюстрация пустого процесса (упрощённая, в фирменном синем) ─────────── */
function EmptyProcessArt() {
  return (
    <svg viewBox="0 0 200 150" fill="none" aria-hidden className="w-[200px]">
      <rect x="34" y="44" width="70" height="52" rx="4" fill="#dbe6ff" />
      <rect x="44" y="34" width="46" height="34" rx="3" fill="#fff" stroke="#c3d4ff" strokeWidth="1.5" />
      <path d="M50 42h34M50 48h34M50 54h24" stroke="#9db8ff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 60h58a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H34a4 4 0 0 1-4-4V60Z" fill="#1b5bff" />
      <path d="M30 60l6-10h20l4 6h28a4 4 0 0 1 4 4H30Z" fill="#3d76ff" />
      <circle cx="98" cy="66" r="10" fill="#1b5bff" />
      <path d="M98 61v10M93 66h10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="140" cy="70" r="12" fill="#e7edff" />
      <rect x="130" y="86" width="20" height="40" rx="6" fill="#1b5bff" />
      <rect x="132" y="60" width="16" height="16" rx="8" fill="#f5b48a" />
    </svg>
  );
}

const colStyle = (c: TableColumn): CSSProperties =>
  c.width ? { flex: `0 0 ${c.width}`, width: c.width } : { flex: c.flex ?? 1 };

const DOC_COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип документа", flex: 2.4, sortable: true },
  { key: "amount", label: "Сумма", flex: 1.2, align: "center", sortable: true },
  { key: "status", label: "Статус", flex: 1.4, align: "center", sortable: true },
  { key: "date", label: "Дата", flex: 1, align: "right", sortable: true },
];

export function GoalPublishedScreen({ cabinet, goal }: { cabinet: CabinetConfig; goal: Goal }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [tab, setTab] = useState("docs");
  const [slide, setSlide] = useState(0);
  const [histOpen, setHistOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [needSumOpen, setNeedSumOpen] = useState(false);

  // Договоры цели — переиспользуем движок RegFlow (orgId = id цели).
  const { createdContracts } = useRegFlow();
  const contracts = createdContracts.filter((c) => c.orgId === goal.id && c.parentId === null);

  // Договор можно создать, только когда собрана вся сумма цели.
  const money = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;
  const fullyCollected = money(goal.collected) >= money(goal.total);
  const base = `/cabinet/${cabinet.slug}/goals/${goal.id}`;

  const onCreateContract = () => {
    if (fullyCollected) router.push(`${base}/contract-new`);
    else setNeedSumOpen(true);
  };

  const onMenu = (v: string) => {
    if (v === "history") setHistOpen(true);
    else if (v === "edit") router.push(`/cabinet/${cabinet.slug}/goals/${goal.id}/edit`);
    else if (v === "close") setCloseOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current="goals" />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-10 px-5 py-8 md:px-[50px]">
          {/* ── Карточка цели ────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 rounded-[8px] border border-border bg-[#fff] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-2">
                <h1 className="ds-h4 text-foreground">{goal.title}</h1>
                <span className="flex items-center gap-2">
                  <PinIcon />
                  <span className="ds-caption text-foreground-subtle">{goal.detailLocation}</span>
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-[6px] bg-[var(--color-grey-95,#f4f6f9)] px-3 py-1.5">
                  <ClockIcon />
                  <span className="ds-caption text-foreground-subtle">{goal.dates}</span>
                </span>
                <Dropdown
                  align="end"
                  aria-label="Меню цели"
                  items={[
                    { value: "history", label: "История редактирований" },
                    { value: "edit", label: "Редактировать" },
                    { value: "close", label: "Закрыть цель" },
                  ]}
                  onSelect={onMenu}
                  trigger={
                    <button type="button" aria-label="Меню цели" className="text-foreground-subtle hover:text-foreground">
                      <KebabIcon />
                    </button>
                  }
                />
              </div>
            </div>

            {expanded && (
              <>
                {/* Карусель обложек */}
                <div className="relative h-[300px] overflow-hidden rounded-[8px] bg-[var(--color-grey-90)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={goal.covers[slide]} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setSlide((s) => (s - 1 + goal.covers.length) % goal.covers.length)}
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[6px] bg-[rgba(16,42,67,0.35)] text-[#fff] backdrop-blur-sm transition-colors hover:bg-[rgba(16,42,67,0.5)]"
                    aria-label="Назад"
                  >
                    <ArrowIcon dir="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlide((s) => (s + 1) % goal.covers.length)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[6px] bg-[rgba(16,42,67,0.35)] text-[#fff] backdrop-blur-sm transition-colors hover:bg-[rgba(16,42,67,0.5)]"
                    aria-label="Вперёд"
                  >
                    <ArrowIcon dir="right" />
                  </button>
                  <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {goal.covers.map((_, i) => (
                      <span key={i} className={cn("size-1.5 rounded-full", i === slide ? "bg-[#fff]" : "bg-[rgba(255,255,255,0.5)]")} />
                    ))}
                  </span>
                </div>

                {/* Прогресс — тот же компонент, что и в карточке списка */}
                {goal.progress && <GoalProgressBar p={goal.progress} />}

                <p className="ds-p2 text-foreground-muted">{goal.description}</p>
              </>
            )}

            <div className="h-px w-full bg-border" />
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="ds-p2-medium self-center py-1 text-foreground hover:text-primary"
            >
              {expanded ? "Скрыть описание" : "Раскрыть описание"}
            </button>
          </div>

          {/* ── Табы ─────────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-[8px] border border-border bg-[#fff]">
            <div className="relative px-6 pt-4">
              <Tabs variant="basic" value={tab} onValueChange={setTab} className="w-full">
                <Tab value="docs">Документы</Tab>
                <Tab value="pub">Публикация</Tab>
                <Tab value="tasks">Задачи</Tab>
              </Tabs>
              {tab === "docs" && (
                <div className="absolute right-6 top-3">
                  <Button size="s" iconLeft={<PlusIcon />} onClick={onCreateContract}>
                    Создать договор
                  </Button>
                </div>
              )}
            </div>

            {/* Документы */}
            {tab === "docs" && (
              <div className="flex flex-col gap-2 p-6">
                <TableHeader columns={DOC_COLUMNS} size="s" tone="muted" />
                {/* Созданные договоры (RegFlow): оранжевая обводка пока не согласован */}
                {contracts.map((c) => {
                  const status = c.finalized ? "Согласован" : "Ожидает участия";
                  const open = () => router.push(`${base}/doc/${c.id}`);
                  return (
                    <div
                      key={c.id}
                      role="button"
                      tabIndex={0}
                      onClick={open}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
                      className={cn(
                        "ds-row flex cursor-pointer items-center gap-2 rounded-[4px] border bg-surface px-6 py-3",
                        c.finalized ? "border-border" : "border-[color:var(--color-orange-400)]",
                      )}
                    >
                      <div className="flex min-w-0 flex-col gap-0.5" style={colStyle(DOC_COLUMNS[0])}>
                        <span className="ds-caption text-foreground-subtle">{KINDS[c.kind].doc}</span>
                        <span className="ds-p3 truncate text-foreground">{c.name}</span>
                      </div>
                      <div className="ds-p3 text-center text-foreground" style={colStyle(DOC_COLUMNS[1])}>{c.amount}</div>
                      <div className="flex justify-center" style={colStyle(DOC_COLUMNS[2])}>
                        <Badge variant="soft" color={DOC_STATUS_COLOR[status]} className="min-w-[150px] justify-center">{status}</Badge>
                      </div>
                      <div className="ds-p3 text-right text-foreground" style={colStyle(DOC_COLUMNS[3])}>22.04.2025</div>
                    </div>
                  );
                })}
                {goal.documents.map((d, i) => {
                  const open = () => router.push(`${base}/doc/gdoc-${i}`);
                  return (
                    <div
                      key={d.name}
                      role="button"
                      tabIndex={0}
                      onClick={open}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
                      className={cn(
                        "ds-row flex cursor-pointer items-center gap-2 rounded-[4px] border bg-surface px-6 py-3",
                        d.pending ? "border-[color:var(--color-orange-400)]" : "border-border",
                      )}
                    >
                      <div className="flex min-w-0 flex-col gap-0.5" style={colStyle(DOC_COLUMNS[0])}>
                        <span className="ds-caption text-foreground-subtle">Основание</span>
                        <span className="ds-p3 truncate text-foreground">{d.name}</span>
                      </div>
                      <div style={colStyle(DOC_COLUMNS[1])} />
                      <div className="flex justify-center" style={colStyle(DOC_COLUMNS[2])}>
                        {d.pending && (
                          <Badge variant="soft" color="orange" className="min-w-[150px] justify-center">Ожидает участия</Badge>
                        )}
                      </div>
                      <div className="ds-p3 text-right text-foreground" style={colStyle(DOC_COLUMNS[3])}>{d.date}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Публикация */}
            {tab === "pub" && (
              <>
                <div className="flex flex-col gap-4 p-6">
                  <Input placeholder="Заголовок*" />
                  <Textarea rows={3} placeholder="Описание*" />
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="s">Фото</Button>
                    <Button variant="ghost" size="s">Ссылка</Button>
                  </div>
                </div>
                <div className="flex justify-end border-t border-border bg-surface-sunken px-6 py-4">
                  <Button size="m">Опубликовать пост</Button>
                </div>
              </>
            )}

            {/* Задачи — список с точками */}
            {tab === "tasks" && (
              <ul className="flex flex-col gap-3 p-6">
                {goal.tasks.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground-subtle" />
                    <span className="ds-p2 text-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Процесс исполнения цели ──────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <h2 className="ds-h4 text-foreground">Процесс исполнения цели</h2>
            <div className="h-px w-full bg-border" />
            <div className="flex flex-col items-center gap-4 py-12">
              <EmptyProcessArt />
              <p className="ds-p2 max-w-[360px] text-center text-foreground-subtle">
                Ваш процесс исполнения будет увеличиваться путем добавления новых постов
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Попап «История редактирований» */}
      <Modal
        open={histOpen}
        onClose={() => setHistOpen(false)}
        size="m"
        title="История редактирований"
        footer={<Button size="l" onClick={() => setHistOpen(false)}>Продолжить работу</Button>}
      >
        <div className="flex flex-col gap-5">
          <p className="ds-p2 text-center text-foreground-muted">
            При редактировании цели ваши действия сохраняться в блокчейн, и вы сможете увидеть историю изменений
          </p>
          <div className="flex flex-col gap-2">
            <ChainRow label="Редактирование цели" hash="5c243af... 07db8" date="19.05.2025 - 16:00" />
            <ChainRow label="Редактирование цели" hash="5c243af... 07db8" date="11.04.2025 - 11:00" />
          </div>
        </div>
      </Modal>

      {/* Попап «Необходимо собрать общую сумму» — при попытке создать договор */}
      <Modal
        open={needSumOpen}
        onClose={() => setNeedSumOpen(false)}
        size="m"
        title="Необходимо собрать общую сумму"
        footer={<Button size="l" onClick={() => setNeedSumOpen(false)}>Продолжить работу</Button>}
      >
        <p className="ds-p2 text-center text-foreground-muted">
          Для того чтобы добавлять договора небходимо собрать всю требуемую сумму на цель.
        </p>
      </Modal>

      {/* Попап «Подтвердить действия в блокчейн» (закрытие цели) */}
      <Modal
        open={closeOpen}
        onClose={() => setCloseOpen(false)}
        size="m"
        title="Подтвердить ваши действия в блокчейн ?"
        footer={
          <Button size="l" onClick={() => router.push(`/cabinet/${cabinet.slug}/goals`)}>
            Подтвердить действие
          </Button>
        }
      >
        <div className="flex flex-col gap-5">
          <p className="ds-p2 text-center text-foreground-muted">
            При подписании документа ваши действия сохраняться в блокчейн
          </p>
          <ChainRow label="Закрытие цели" hash="xxxxxxx... xxxxx" date="03.06.2025 - 15:00" />
        </div>
      </Modal>
    </div>
  );
}
