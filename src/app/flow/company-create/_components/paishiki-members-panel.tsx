"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  Tabs,
  Tab,
  SearchBar,
  Dropdown,
  Button,
  Toolbar,
  Pagination,
  TableHeader,
  Item,
  ItemDivider,
  Checkbox,
  Link,
  EmptyState,
  type TableColumn,
  type SortDir,
} from "@/components/ds";
import { useRegFlow } from "./reg-flow";
import { MoveToFolderModal } from "./move-to-folder-modal";
import { PaishikShuttle, LEGAL, ADDR } from "../../../cabinet/payment/_components/payment-shared";

/**
 * PaishikiMembersPanel — панель управления пайщиками после приглашения: 4 таба
 * (Действующие / Ограничили доступ / Согласование совета / Блокировка) + поиск +
 * Toolbar + подтабы + таблица. Источник: Figma 2460:475309/476343 (и демо
 * MembersDemos). ПОЛНОСТЬЮ из DS: Tabs · SearchBar · Dropdown · Button ·
 * Toolbar · Pagination · TableHeader · Item · Checkbox · Link · EmptyState.
 *
 * Приглашённые пайщики — в табе «Действующие пайщики»; остальные табы пусты.
 */

const sw = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
/** Звезда «в избранное» — бинарная: активная заливается жёлтым (Figma 475309). */
const StarIcon = ({ active = false }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" style={{ color: active ? "#f5b50a" : "var(--color-grey-200)" }}>
    <path d="m12 4 2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 16.9l-4.7 2.47.9-5.23-3.8-3.7 5.25-.76L12 4Z" {...sw} fill={active ? "currentColor" : "none"} />
  </svg>
);
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" style={{ color: "var(--color-blue-midhub-500)" }} fill="currentColor">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20a8 8 0 0 1 16 0H4Z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" style={{ color: "var(--color-blue-midhub-500)" }} fill="currentColor">
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Zm2.2.5 6.8 5 6.8-5H5.2Z" />
  </svg>
);
const ListIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...sw}>
    <path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...sw}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
  </svg>
);
const FolderIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
    <path d="M22 10.3V17c0 3-1.5 4-4.5 4h-11C3.5 21 2 20 2 17V7c0-3 1.5-4 4.5-4h1.88c1.06 0 1.36.27 1.76.81l1.13 1.5c.27.36.46.49 1.13.49h2.6c3 0 4.5 1 4.5 4z" />
  </svg>
);
const KebabIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ color: "var(--color-grey-300)" }}>
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="19" r="1.6" />
  </svg>
);

const COLUMNS: TableColumn[] = [
  { key: "star", label: "", width: "32px" },
  { key: "name", label: "Имя", flex: 2 },
  { key: "addr", label: "Адрес", flex: 2 },
  { key: "country", label: "Страна", flex: 1, sortable: true },
  { key: "date", label: "Дата заявки", flex: 1, sortable: true },
  { key: "actions", label: "", width: "92px" },
];

export function PaishikiMembersPanel({ members, className, focusCouncilSignal = 0 }: { members: string[]; className?: string; focusCouncilSignal?: number }) {
  const [tab, setTab] = useState("active");
  // Приглашение нового пайщика через форму → переключаемся на таб «Совет»,
  // где он появляется кандидатом согласования (сигнал растёт при каждом инвайте).
  useEffect(() => {
    if (focusCouncilSignal > 0) setTab("council");
  }, [focusCouncilSignal]);
  const [sub, setSub] = useState("private");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [folder, setFolder] = useState("all");
  const [sort, setSort] = useState<{ key: string; dir: SortDir }>({ key: "date", dir: "desc" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // Избранное — бинарный набор имён. Звезда не убирает пайщика из общего списка;
  // папка «Избранные» в дропдауне фильтрует таблицу до отмеченных.
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const toggleFav = (name: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  // Папки: предустановленная «Важное» + созданные через попап. memberFolder —
  // в какой папке лежит пайщик (одна папка). Дропдаун фильтрует список по папке.
  const [folders, setFolders] = useState<{ id: string; label: string }[]>([{ id: "vazhnoe", label: "Важное" }]);
  const [memberFolder, setMemberFolder] = useState<Record<string, string>>({});
  const [moveOpen, setMoveOpen] = useState(false);
  const folderSeqRef = useRef(0);
  const createFolder = (label: string) => {
    folderSeqRef.current += 1;
    const id = `folder-${folderSeqRef.current}`;
    setFolders((prev) => [...prev, { id, label }]);
    return id;
  };
  const moveSelectedToFolder = (folderId: string) => {
    setMemberFolder((prev) => {
      const next = { ...prev };
      selected.forEach((name) => {
        next[name] = folderId;
      });
      return next;
    });
    setSelected(new Set());
  };

  const onSort = (key: string) =>
    setSort((p) => (p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  const toggle = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const flow = useRegFlow();

  // Согласование совета: shuttle-выбор пайщиков (Частные/Юрид.) → «Отправить на
  // совет». Отдельные множества выбора на под-таб (индексы PRIVATE/LEGAL).
  const [cTab, setCTab] = useState<"private" | "legal">("private");
  const [cSelP, setCSelP] = useState<Set<number>>(() => new Set());
  const [cSelL, setCSelL] = useState<Set<number>>(() => new Set());
  const [cPage, setCPage] = useState(1);
  const cPriv = flow.councilCandidates;
  const cList = cTab === "private" ? cPriv : LEGAL;
  const cSel = cTab === "private" ? cSelP : cSelL;
  const setCSel = cTab === "private" ? setCSelP : setCSelL;
  const toggleCSel = (i: number) =>
    setCSel((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  const toggleCSelAll = () =>
    setCSel((prev) => (prev.size === cList.length ? new Set() : new Set(cList.map((_, i) => i))));
  const cCount = cSelP.size + cSelL.size;

  // Пайщики, отправленные на согласование (вопрос «member» ещё не завершён).
  const pending = flow.paymentVotes
    .filter((v) => v.kind === "member" && !v.done)
    .flatMap((v) => v.recipients);
  const pendingRows = pending.filter((r) => (sub === "legal" ? r.legal : !r.legal));

  // «Отправить на совет»: создаём вопрос «Добавление пайщиков» (→ таб «Совет»
  // экрана голосования) и переводим выбранных в «На согласовании».
  const sendToCouncil = () => {
    const privNames = [...cSelP].map((i) => cPriv[i]).filter(Boolean);
    const recipients = [
      ...privNames.map((name) => ({ name, mid: ADDR, legal: false })),
      ...[...cSelL].map((i) => ({ name: LEGAL[i].name, mid: ADDR, legal: true })),
    ];
    if (recipients.length === 0) return;
    flow.submitPaymentVote({ title: "Добавление пайщиков", amount: "", docName: "Пользовательское соглашение", recipients, kind: "member" });
    flow.removeCouncilCandidates(privNames); // отправленные уходят из shuttle в «На согласовании»
    setCSelP(new Set());
    setCSelL(new Set());
  };

  // Только «Действующие пайщики» содержит приглашённых; остальные табы пусты.
  // Дропдаун-папки фильтруют список: «Избранные» — по звезде, любая папка — по
  // memberFolder; «Все папки» — без фильтра.
  const baseRows = tab === "active" ? members : [];
  const rows =
    folder === "all"
      ? baseRows
      : folder === "fav"
        ? baseRows.filter((r) => favorites.has(r))
        : baseRows.filter((r) => memberFolder[r] === folder);
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r));

  // Пункты дропдауна: Все папки · Избранные · предустановленные/созданные папки.
  const folderItems = [
    { value: "all", label: "Все папки" },
    { value: "fav", label: "Избранные" },
    ...folders.map((f) => ({ value: f.id, label: f.label })),
  ];
  const folderLabel = folderItems.find((i) => i.value === folder)?.label ?? "Все папки";

  // Поиск + папки + переключатели вида — общий для таблиц (высота 32px).
  const searchRow = (
    <div className="flex items-center gap-3">
      <SearchBar size="s" className="flex-1" placeholder="Placeholder" value={q} onChange={(e) => setQ(e.target.value)} />
      <Dropdown
        value={folder}
        onSelect={(v) => setFolder(v)}
        items={folderItems}
        trigger={({ open }) => (
          <span className="ds-p3 flex h-8 w-[180px] items-center justify-between gap-2 rounded-[4px] border border-border bg-white px-3 text-foreground">
            <span className="truncate">{folderLabel}</span>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={cn("flex-none text-foreground-subtle transition-transform", open && "rotate-180")}>
              <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      />
      <Button variant="ghost" size="s" iconLeft={<ListIcon />}>Список</Button>
      <Button variant="ghost" size="s" iconLeft={<GlobeIcon />}>Страны</Button>
    </div>
  );

  // Подвкладки «Частные / Юридическое лицо» — общий для таблиц.
  const subTabs = (
    <Tabs value={sub} onValueChange={setSub} variant="basic" size="m" aria-label="Тип пайщика">
      <Tab value="private">Частные пайщики</Tab>
      <Tab value="legal">Юридическое лицо</Tab>
    </Tabs>
  );

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {/* Основные вкладки — solid (синяя заливка), M-40, по центру контента */}
      <Tabs value={tab} onValueChange={setTab} variant="solid" size="m" className="self-center" aria-label="Пайщики">
        <Tab value="active">Действующие пайщики</Tab>
        <Tab value="limited">Ограничили доступ</Tab>
        <Tab value="council">Согласование совета</Tab>
        <Tab value="blocked">Блокировка и удаление</Tab>
      </Tabs>

      {/* Таб «Согласование совета»: shuttle-выбор → отправка на совет; после
          отправки — таблица «На согласовании» (Figma 6537:355370/355768). */}
      {tab === "council" ? (
        pending.length === 0 ? (
          <>
            {/* Shuttle: внутренний gap 16px (как в каноне payment-once) */}
            <div className="flex flex-col gap-4">
              <PaishikShuttle
                tab={cTab}
                onTabChange={setCTab}
                sel={cSel}
                onToggleSel={toggleCSel}
                onToggleSelAll={toggleCSelAll}
                count={cCount}
                page={cPage}
                onPageChange={setCPage}
                privateNames={cPriv}
              />
            </div>
            <div className="flex justify-end">
              <Button size="l" disabled={cCount === 0} onClick={sendToCouncil}>Отправить на совет</Button>
            </div>
          </>
        ) : (
          <>
            {searchRow}
            <Toolbar
              center={<span className="ds-p3 text-foreground-subtle">На согласовании: {pending.length}</span>}
              right={
                <>
                  <span className="inline-flex items-center rounded-[4px] bg-[rgba(229,66,77,0.3)] px-3 py-0.5 text-[12px] leading-[20px] text-[#e5424d]">На согласовании</span>
                  <Dropdown
                    aria-label="Ещё"
                    items={[{ value: "export", label: "Экспорт" }, { value: "settings", label: "Настройки" }]}
                    trigger={<span className="flex size-6 items-center justify-center"><KebabIcon /></span>}
                  />
                </>
              }
            />
            <div className="flex flex-col gap-2">
              {subTabs}
              {pendingRows.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 rounded-[4px] bg-[#f9fafc] px-6 py-2">
                    <span className="ds-caption-medium flex-[2] text-foreground-subtle">Адрес</span>
                    <span className="ds-caption-medium flex-1 text-foreground-subtle">Страна</span>
                    <span className="ds-caption-medium flex-1 text-right text-foreground-subtle">Дата заявки</span>
                  </div>
                  {pendingRows.map((r, i) => (
                    <div key={`${r.name}-${i}`} className="flex items-center gap-2 rounded-[4px] border border-border bg-surface px-6 py-4">
                      <span className="flex flex-[2]"><Link href="#" size="p3">{r.mid}</Link></span>
                      <span className="flex-1 text-foreground">ENG</span>
                      <span className="flex-1 text-right text-foreground">12.07.2020</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Нет пользователей" />
              )}
            </div>
          </>
        )
      ) : (
        <>
          {searchRow}

          {/* Тулбар: bulk-действие (при выборе) + счётчик + пагинация + kebab */}
          <Toolbar
            left={
              selected.size > 0 ? (
                <Button variant="tertiary" size="xs" iconLeft={<FolderIcon />} onClick={() => setMoveOpen(true)}>
                  Переместить в папку
                </Button>
              ) : undefined
            }
            center={<span className="ds-p3 text-foreground-subtle">Отмечено: {selected.size}</span>}
            right={
              <>
                <Pagination size="xs" view="full" page={page} total={200} onChange={setPage} />
                <Dropdown
                  aria-label="Ещё"
                  items={[{ value: "export", label: "Экспорт" }, { value: "settings", label: "Настройки" }]}
                  trigger={<span className="flex size-6 items-center justify-center"><KebabIcon /></span>}
                />
              </>
            }
          />

          {/* Подвкладки + таблица: gap 8px между подтабами и таблицей */}
          <div className="flex flex-col gap-2">
            {subTabs}

            {/* Таблица: шапка + ряды (пусто → EmptyState) */}
            {rows.length > 0 ? (
              <div className="flex flex-col gap-3">
                <TableHeader
                  tone="muted"
                  selectable
                  checked={allChecked}
                  onCheckedChange={(checked) => setSelected(checked ? new Set(rows) : new Set())}
                  columns={COLUMNS}
                  sortKey={sort.key}
                  sortDir={sort.dir}
                  onSort={onSort}
                />
                {rows.map((name, i) => (
                  <Item
                    key={`${name}-${i}`}
                    size="l"
                    leading={<Checkbox size="xs" checked={selected.has(name)} onChange={() => toggle(name)} aria-label={`Выбрать ${name}`} />}
                    trailing={
                      <>
                        <button type="button" aria-label="Профиль" className="transition-opacity hover:opacity-80"><PersonIcon /></button>
                        <ItemDivider />
                        <button type="button" aria-label="Написать" className="transition-opacity hover:opacity-80"><MailIcon /></button>
                      </>
                    }
                  >
                    <div className="flex w-full items-center gap-2">
                      <span className="flex w-8 flex-none justify-center">
                        <button
                          type="button"
                          onClick={() => toggleFav(name)}
                          aria-pressed={favorites.has(name)}
                          aria-label={favorites.has(name) ? `Убрать ${name} из избранного` : `Добавить ${name} в избранное`}
                          className="transition-transform hover:scale-110"
                        >
                          <StarIcon active={favorites.has(name)} />
                        </button>
                      </span>
                      <span className="flex-[2] text-foreground">{name}</span>
                      <span className="flex flex-[2] justify-center"><Link href="#" size="p3">5c243af... 07db8</Link></span>
                      <span className="flex-1 text-foreground">ENG</span>
                      <span className="flex-1 text-foreground">12.07.2020</span>
                    </div>
                  </Item>
                ))}
              </div>
            ) : (
              <EmptyState title="Нет пользователей" />
            )}
          </div>
        </>
      )}

      {/* Попап «Переместить в папку» — выбор/создание папки для отмеченных. */}
      <MoveToFolderModal
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        folders={folders}
        onCreateFolder={createFolder}
        onMove={moveSelectedToFolder}
      />
    </div>
  );
}
