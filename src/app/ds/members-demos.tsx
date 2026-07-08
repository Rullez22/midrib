"use client";

/**
 * Демка экрана «Управление пайщиками кооператива» для витрины /ds.
 * Источник: Figma «UI фичи» / пайщики (1351:154855 · 1352:158198).
 *
 * ПОЛНОСТЬЮ композиция существующих компонентов — новых не создаётся:
 *   SectionHeader · Tabs/Tab · SearchBar · Dropdown · Button · Toolbar ·
 *   Pagination · TableHeader · Item · Checkbox · Link · Badge.
 */
import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  SectionHeader,
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
  type TableColumn,
  type SortDir,
} from "@/components/ds";

/* ── Иконки (inline SVG, тон через currentColor) ───────────────── */
const sw = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" style={{ color: "var(--color-grey-200)" }}>
      <path d="m12 4 2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 16.9l-4.7 2.47.9-5.23-3.8-3.7 5.25-.76L12 4Z" {...sw} />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" style={{ color: "var(--color-blue-midhub-500)" }} fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0H4Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" style={{ color: "var(--color-blue-midhub-500)" }} fill="currentColor">
      <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Zm2.2.5 6.8 5 6.8-5H5.2Z" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...sw}>
      <path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...sw}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  );
}
function KebabIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ color: "var(--color-grey-300)" }}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

const MEMBERS = [
  "Илья Антонов",
  "Александр Пушкин",
  "Степан Разин",
  "Валерий Антонов",
  "Влад Шульц",
  "Илья Попов",
  "Мария Магдалена",
];

/* Колонки шапки (1:1 с рядами ниже): звезда-спейсер · Имя · Адрес · Страна · Дата · действия-спейсер. */
const COLUMNS: TableColumn[] = [
  { key: "star", label: "", width: "32px" },
  { key: "name", label: "Имя", flex: 2 },
  { key: "addr", label: "Адрес", flex: 2 },
  { key: "country", label: "Страна", flex: 1, sortable: true },
  { key: "date", label: "Дата заявки", flex: 1, sortable: true },
  { key: "actions", label: "", width: "92px" },
];

export function MembersDemos() {
  const [tab, setTab] = useState("active");
  const [sub, setSub] = useState("private");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [folder, setFolder] = useState("all");
  const [sort, setSort] = useState<{ key: string; dir: SortDir }>({ key: "date", dir: "desc" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);

  const onSort = (key: string) =>
    setSort((p) => (p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const toggle = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border p-5">
      <SectionHeader
        title="Управление пайщиками кооператива"
        subtitle="Новый пайщик отразится у вас в разделе согласования совета с нужным для вступления в кооператив набором документов"
        action={<Link href="#" size="p3">Пригласить нового пайщика</Link>}
        className="items-center text-center"
      />

      {/* Основные вкладки */}
      <Tabs value={tab} onValueChange={setTab} variant="solid-light" size="l" aria-label="Пайщики">
        <Tab value="active">Действующие пайщики</Tab>
        <Tab value="limited">Ограничили доступ</Tab>
        <Tab value="council">Согласование совета</Tab>
        <Tab value="blocked">Блокировка и удаление</Tab>
      </Tabs>

      {/* Строка поиска + папки + переключатели вида */}
      <div className="flex items-center gap-3">
        <SearchBar className="flex-1" placeholder="Placeholder" value={q} onChange={(e) => setQ(e.target.value)} />
        <Dropdown
          value={folder}
          onSelect={(v) => setFolder(v)}
          items={[
            { value: "all", label: "Все папки" },
            { value: "fav", label: "Избранные" },
          ]}
          trigger={({ open }) => (
            <span className="flex h-10 w-[180px] items-center justify-between gap-2 rounded-[4px] border border-border bg-white px-3 ds-p3 text-foreground">
              <span className="whitespace-nowrap">Все папки</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className={cn("flex-none text-foreground-subtle transition-transform", open && "rotate-180")}>
                <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        />
        <Button variant="secondary" size="m" iconLeft={<ListIcon />}>Список</Button>
        <Button variant="secondary" size="m" iconLeft={<GlobeIcon />}>Страны</Button>
      </div>

      {/* Тулбар: счётчик + пагинация + kebab */}
      <Toolbar
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

      {/* Подвкладки: тип пайщика */}
      <Tabs value={sub} onValueChange={setSub} variant="basic" size="m" aria-label="Тип пайщика">
        <Tab value="private">Частные пайщики</Tab>
        <Tab value="legal">Юридическое лицо</Tab>
      </Tabs>

      {/* Таблица: шапка + ряды */}
      <div className="flex flex-col gap-3">
        <TableHeader
          tone="muted"
          selectable
          checked={allChecked}
          onCheckedChange={setAllChecked}
          columns={COLUMNS}
          sortKey={sort.key}
          sortDir={sort.dir}
          onSort={onSort}
        />

        {MEMBERS.map((name) => (
          <Item
            key={name}
            size="l"
            leading={<Checkbox checked={selected.has(name)} onChange={() => toggle(name)} aria-label={`Выбрать ${name}`} />}
            trailing={
              <>
                <button type="button" aria-label="Профиль" className="transition-opacity hover:opacity-80"><PersonIcon /></button>
                <ItemDivider />
                <button type="button" aria-label="Написать" className="transition-opacity hover:opacity-80"><MailIcon /></button>
              </>
            }
          >
            <div className="flex w-full items-center gap-2">
              <span className="flex w-8 flex-none justify-center"><StarIcon /></span>
              <span className="flex-[2] text-foreground">{name}</span>
              <span className="flex-[2]"><Link href="#" size="p3">5c243af... 07db8</Link></span>
              <span className="flex-1 text-foreground">ENG</span>
              <span className="flex-1 text-foreground">12.07.2020</span>
            </div>
          </Item>
        ))}
      </div>
    </div>
  );
}
