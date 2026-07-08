"use client";

import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  Tabs,
  Tab,
  TableHeader,
  Button,
  Checkbox,
  EmptyState,
  Dropdown,
  Toolbar,
  Modal,
  Input,
  Radio,
  type SortDir,
} from "@/components/ds";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";
import { MoveToFolderModal } from "../../../flow/company-create/_components/move-to-folder-modal";
import { Shell } from "../../document/_components/document-shared";

/**
 * CabinetRegistrationsScreen — «Регистрации» кабинета №3 (Веб-ресурс). Реестр
 * регистраций (физлиц и компаний) в трёх вкладках: «Входящие регистрации» /
 * «Не подписанные» / «Запросы на удаление».
 * Источник Figma: 6739-405345/405566/405575 (списки) · 6739-405591 (warning) ·
 * 6739-405173/405293/405326/405255 (детали/удаление) · 6739-405360…405363 (фильтры).
 *
 * Reuse DS / другие флоу — ничего не верстаем заново:
 *  • списки: SearchBar · Dropdown (папки) · Toolbar · TableHeader · Checkbox ·
 *    EmptyState · MoveToFolderModal (как у пайщиков) · избранное;
 *  • деталь: Shell (полноэкранный каркас документа — DocHeader) · Checkbox ·
 *    Button (negative/negative-sec) · Modal (подтверждения);
 *  • фильтры: всплывающая карта с Dropdown · Input · Radio · Button.
 *
 * Логика: клик по строке → warning «Обратите внимание» → деталь. В детали можно
 * удалить выбранные поля (попап подтверждения) либо удалить пользователя (попап) —
 * при удалении пользователя регистрация переезжает в таб «Запросы на удаление».
 */

type TabKey = "incoming" | "unsigned" | "deletion";

const TABS: { value: TabKey; label: string }[] = [
  { value: "incoming", label: "Входящие регистрации" },
  { value: "unsigned", label: "Не подписанные" },
  { value: "deletion", label: "Запросы на удаление" },
];

// ── Данные детали (мок, Figma 6739-405173): поля по основаниям ───────────────
interface FieldRow {
  id: string;
  label: string;
  value: string;
}
interface FieldSection {
  id: string;
  /** Слово-ссылка после «На основании …». */
  basis: string;
  docTitle: string;
  fields: FieldRow[];
}

interface RegRow {
  id: string;
  address: string;
  date: string;
  /** Содержимое детали (у каждой регистрации своё наполнение). */
  sections: FieldSection[];
}

interface CompanyMock {
  kind: "company";
  name: string;
  ogrn: string;
  regdate: string;
  organ: string;
  organcode: string;
  inn: string;
  kpp: string;
  signer: string;
}
interface PersonMock {
  kind: "person";
  last: string;
  first: string;
  middle: string;
  birth: string;
  passport: string;
  issued: string;
  issuedate: string;
}
type Subject = CompanyMock | PersonMock;

function buildSections(s: Subject): FieldSection[] {
  if (s.kind === "company") {
    return [
      {
        id: "consent",
        basis: "согласия",
        docTitle: "Свидетельство о постановке на учет в налоговом органе",
        fields: [
          { id: "name", label: "Полное наименование компании", value: s.name },
          { id: "ogrn", label: "ОГРН", value: s.ogrn },
          { id: "regdate", label: "Дата постановки на учет", value: s.regdate },
          { id: "organ", label: "Налоговый орган", value: s.organ },
          { id: "organcode", label: "Код налогового органа", value: s.organcode },
        ],
      },
      {
        id: "contract",
        basis: "договора",
        docTitle: "Свидетельство о постановке на учет в налоговом органе",
        fields: [
          { id: "inn", label: "ИНН компании", value: s.inn },
          { id: "kpp", label: "КПП компании", value: s.kpp },
          { id: "signer", label: "Кем подписан документ", value: s.signer },
        ],
      },
    ];
  }
  return [
    {
      id: "consent",
      basis: "согласия",
      docTitle: "Паспорт гражданина РФ",
      fields: [
        { id: "last", label: "Фамилия", value: s.last },
        { id: "first", label: "Имя", value: s.first },
        { id: "middle", label: "Отчество", value: s.middle },
        { id: "birth", label: "Дата рождения", value: s.birth },
      ],
    },
    {
      id: "contract",
      basis: "договора",
      docTitle: "Паспорт гражданина РФ",
      fields: [
        { id: "passport", label: "Серия и номер", value: s.passport },
        { id: "issued", label: "Кем выдан", value: s.issued },
        { id: "issuedate", label: "Дата выдачи", value: s.issuedate },
      ],
    },
  ];
}

/** Пул регистраций (придуманные данные) — у каждой свой адрес, дата и деталь. */
const SUBJECTS: { address: string; date: string; subject: Subject }[] = [
  {
    address: "0xca30e63200a0fe3182dc61fc5605efc41456f32",
    date: "12.07.2020",
    subject: { kind: "company", name: 'Общество с ограниченной ответственностью "Сапфир"', ogrn: "1167700074915", regdate: "03.08.2018", organ: "Инспекция Федеральной налоговой службы №3 по г. Москве", organcode: "7703", inn: "9715286548", kpp: "770301001", signer: "И.В.Мансурова" },
  },
  {
    address: "0x7f1de29e6b19a0fe3182dc61fc5605efc4a93b71",
    date: "03.02.2021",
    subject: { kind: "person", last: "Иванов", first: "Иван", middle: "Иванович", birth: "12.05.1990", passport: "45 09 123456", issued: "ОУФМС России по г. Москве", issuedate: "20.06.2010" },
  },
  {
    address: "0x3b9aca0017d4c8e2f6a1b0c9d8e7f60554FA3D81",
    date: "28.11.2020",
    subject: { kind: "company", name: 'Акционерное общество "Вектор"', ogrn: "1127747098321", regdate: "22.11.2019", organ: "МИ ФНС России №46 по г. Москве", organcode: "7746", inn: "7727654398", kpp: "772701001", signer: "Д.А.Котов" },
  },
  {
    address: "0x9f8e7d6c5b4a39281706f5e4d3c2b1a09876EE2B",
    date: "15.09.2021",
    subject: { kind: "person", last: "Петрова", first: "Анна", middle: "Сергеевна", birth: "07.03.1985", passport: "40 11 998877", issued: "ТП №19 Калининского района, г. Санкт-Петербург", issuedate: "14.04.2007" },
  },
  {
    address: "0x1a2b3c4d5e6f70819203a4b5c6d7e8f90123CD6E",
    date: "01.06.2020",
    subject: { kind: "company", name: 'Общество с ограниченной ответственностью "Гранит"', ogrn: "1057746121093", regdate: "14.02.2017", organ: "Инспекция Федеральной налоговой службы №7 по г. Санкт-Петербургу", organcode: "7801", inn: "7801456712", kpp: "780101001", signer: "П.С.Орлова" },
  },
  {
    address: "0xfedcba98765432100fedcba9876543210AC7F412",
    date: "22.12.2021",
    subject: { kind: "person", last: "Смирнов", first: "Олег", middle: "Викторович", birth: "30.10.1978", passport: "92 05 445566", issued: "ОВД Ленинского района, г. Екатеринбург", issuedate: "11.11.2003" },
  },
  {
    address: "0x0123456789abcdef0123456789abcdef01234567",
    date: "08.04.2020",
    subject: { kind: "company", name: 'Общество с ограниченной ответственностью "Меридиан"', ogrn: "1169658043215", regdate: "09.06.2016", organ: "Инспекция Федеральной налоговой службы №14 по г. Екатеринбургу", organcode: "6658", inn: "6658123987", kpp: "665801001", signer: "Е.В.Сафина" },
  },
  {
    address: "0xabcdef0123456789abcdef0123456789abcdef01",
    date: "19.10.2021",
    subject: { kind: "company", name: 'Акционерное общество "Атлант"', ogrn: "1147700009876", regdate: "30.01.2015", organ: "Инспекция Федеральной налоговой службы №2 по г. Москве", organcode: "7702", inn: "7702334455", kpp: "770201001", signer: "Р.К.Зуев" },
  },
  {
    address: "0x2718281828459045235360287471352662497757",
    date: "05.05.2020",
    subject: { kind: "person", last: "Кузнецова", first: "Мария", middle: "Андреевна", birth: "18.02.1993", passport: "46 14 102030", issued: "ГУ МВД России по Московской области", issuedate: "25.03.2013" },
  },
  {
    address: "0x3141592653589793238462643383279502884197",
    date: "27.07.2021",
    subject: { kind: "company", name: 'Общество с ограниченной ответственностью "Орион"', ogrn: "1183668051234", regdate: "16.07.2018", organ: "Инспекция Федеральной налоговой службы по Ленинскому району г. Воронежа", organcode: "3664", inn: "3664221100", kpp: "366401001", signer: "Н.Г.Белова" },
  },
  {
    address: "0x1618033988749894848204586834365638117720",
    date: "11.01.2021",
    subject: { kind: "person", last: "Соколов", first: "Дмитрий", middle: "Павлович", birth: "03.09.1988", passport: "03 12 778899", issued: "ОУФМС России по Краснодарскому краю", issuedate: "09.10.2008" },
  },
  {
    address: "0x1414213562373095048801688724209698078569",
    date: "30.03.2020",
    subject: { kind: "company", name: 'Общество с ограниченной ответственностью "Заря"', ogrn: "1157847256789", regdate: "21.05.2015", organ: "МИ ФНС России №15 по г. Санкт-Петербургу", organcode: "7847", inn: "7847123456", kpp: "784701001", signer: "А.М.Лебедев" },
  },
  {
    address: "0x5772156649015328606065120900824024310422",
    date: "14.08.2021",
    subject: { kind: "person", last: "Морозова", first: "Елена", middle: "Игоревна", birth: "26.06.1995", passport: "60 16 334455", issued: "ОВД по г. Ростову-на-Дону", issuedate: "07.07.2015" },
  },
  {
    address: "0x6931471805599453094172321214581765680755",
    date: "02.02.2020",
    subject: { kind: "company", name: 'Акционерное общество "Полюс"', ogrn: "1107746098765", regdate: "12.03.2014", organ: "Инспекция Федеральной налоговой службы №9 по г. Москве", organcode: "7709", inn: "7709887766", kpp: "770901001", signer: "С.В.Гусев" },
  },
];

const ALL_ROWS: RegRow[] = SUBJECTS.map((s, i) => ({
  id: `r-${i}`,
  address: s.address,
  date: s.date,
  sections: buildSections(s.subject),
}));

const SEED_BY_TAB: Record<TabKey, RegRow[]> = {
  incoming: ALL_ROWS.slice(0, 7),
  unsigned: ALL_ROWS.slice(7, 11),
  deletion: ALL_ROWS.slice(11, 14),
};

// ── Иконки ───────────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FiltersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5">
      <path d="M4 7h10M17 7h3M4 12h3M10 12h10M4 17h10M17 17h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="15.5" cy="7" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="12" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15.5" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Звезда «в избранное» — бинарная: активная жёлтая, иначе grey-200 (как у пайщиков). */
function StarIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" style={{ color: active ? "#f5b50a" : "var(--color-grey-200)" }}>
      <path
        d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.77l-5.2 2.74.99-5.79-4.21-4.1 5.82-.85L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  );
}

/** Папка (filled) — иконка bulk-кнопки «Переместить в папку». */
function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M22 10.3V17c0 3-1.5 4-4.5 4h-11C3.5 21 2 20 2 17V7c0-3 1.5-4 4.5-4h1.88c1.06 0 1.36.27 1.76.81l1.13 1.5c.27.36.46.49 1.13.49h2.6c3 0 4.5 1 4.5 4z" />
    </svg>
  );
}

/** Шеврон дропдауна. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={cn("flex-none text-foreground-subtle transition-transform", open && "rotate-180")}>
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Красный крест — закрыть деталь. */
function CloseXIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ── Строка реестра ────────────────────────────────────────────────────────────
function RegItem({
  row,
  checked,
  starred,
  onCheck,
  onToggleStar,
  onOpen,
}: {
  row: RegRow;
  checked: boolean;
  starred: boolean;
  onCheck: (checked: boolean) => void;
  onToggleStar: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="flex min-h-[66px] w-full items-center gap-2 rounded-[4px] border border-border bg-white px-6">
      <Checkbox size="xs" checked={checked} onChange={(e) => onCheck(e.target.checked)} aria-label="Отметить регистрацию" />
      <button
        type="button"
        onClick={onToggleStar}
        aria-pressed={starred}
        aria-label={starred ? "Убрать из избранного" : "В избранное"}
        className="flex w-6 flex-none justify-center transition-transform hover:scale-110"
      >
        <StarIcon active={starred} />
      </button>
      <button
        type="button"
        onClick={onOpen}
        className="ds-p3 min-w-0 flex-1 truncate text-left text-[var(--color-blue-midhub-500)] hover:underline"
      >
        {row.address}
      </button>
      <span className="ds-p3 shrink-0 text-foreground">{row.date}</span>
    </div>
  );
}

// ── Карта фильтров (всплывает по кнопке «Фильтры») ───────────────────────────
const SAVED_FILTERS = [
  { value: "a", label: "Фильтр А" },
  { value: "b", label: "Фильтр Б" },
  { value: "c", label: "Фильтр В" },
  { value: "d", label: "Фильтр Г" },
];
const AGES = [
  { value: "18-25", label: "18–25" },
  { value: "26-35", label: "26–35" },
  { value: "36-45", label: "36–45" },
  { value: "46+", label: "46+" },
];

/**
 * Триггер-«инпут» дропдауна фильтров. Размеры 1:1 с Input size="l" (высота 48,
 * текст 16/24, паддинг 16) — чтобы дропдауны/инпуты выглядели одинаково. Когда
 * значение выбрано — плавающая мини-подпись сверху (как в Figma), пусто —
 * плейсхолдер тем же 16px, что и у инпутов.
 */
function FilterSelectTrigger({ label, value, open }: { label: string; value?: string; open: boolean }) {
  return (
    <span className="flex h-12 w-full items-center justify-between gap-2 rounded-[4px] border border-border bg-white px-4">
      {value ? (
        <span className="flex min-w-0 flex-col text-left">
          <span className="ds-caption leading-none text-foreground-subtle">{label}</span>
          <span className="truncate text-[16px] leading-[20px] text-foreground">{value}</span>
        </span>
      ) : (
        <span className="truncate text-[16px] leading-[24px] text-foreground-subtle">{label}</span>
      )}
      <Chevron open={open} />
    </span>
  );
}

function FilterPanel({ onSearch }: { onSearch: () => void }) {
  const [saved, setSaved] = useState<string>();
  const [ident, setIdent] = useState("");
  const [word, setWord] = useState("");
  const [age, setAge] = useState<string>();
  const [sex, setSex] = useState("m");

  return (
    <div className="flex w-full flex-col gap-5 rounded-[4px] border border-border bg-[#fff] p-6 shadow-[0_8px_24px_rgba(90,100,111,0.12)]">
      <div className="w-full max-w-[316px]">
        <Dropdown
          value={saved}
          onSelect={setSaved}
          items={SAVED_FILTERS}
          trigger={({ open }) => (
            <FilterSelectTrigger label="Сохраненные фильтры" value={SAVED_FILTERS.find((f) => f.value === saved)?.label} open={open} />
          )}
        />
      </div>
      <Input size="l" placeholder="Идентификатор" value={ident} onChange={(e) => setIdent(e.target.value)} />
      <Input size="l" placeholder="Содержит слово" value={word} onChange={(e) => setWord(e.target.value)} />
      <div className="w-full max-w-[316px]">
        <Dropdown
          value={age}
          onSelect={setAge}
          items={AGES}
          trigger={({ open }) => (
            <FilterSelectTrigger label="Возраст" value={AGES.find((a) => a.value === age)?.label} open={open} />
          )}
        />
      </div>
      <div className="flex flex-col gap-3">
        <span className="ds-p3-medium text-foreground">Пол</span>
        <div className="flex items-center gap-8">
          <Radio size="xs" name="reg-sex" checked={sex === "m"} onChange={() => setSex("m")} label="Мужской" />
          <Radio size="xs" name="reg-sex" checked={sex === "w"} onChange={() => setSex("w")} label="Женский" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-6">
        <button type="button" className="ds-p3-medium text-primary">Создать фильтр</button>
        <Button size="l" onClick={onSearch}>Поиск</Button>
      </div>
    </div>
  );
}

const PRESET_FOLDERS = [{ id: "vazhnoe", label: "Важное" }];

/**
 * RegistrationsPanel — таб реестра с папочной структурой, избранным и фильтрами.
 * Состояние выбора/избранного/папок/фильтров локально → вкладки независимы.
 * Данные строк приходят сверху (`rows`), удаление пользователя поднимается в
 * родитель через `onDeleteUser` (перенос в таб «Запросы на удаление»).
 */
function RegistrationsPanel({
  rows,
  onOpenRow,
}: {
  rows: RegRow[];
  onOpenRow: (row: RegRow) => void;
}) {
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Выбор строк (чекбоксы), избранное (звезда), фильтр-папка дропдауна.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [folder, setFolder] = useState("all");

  // Папки: предустановленная «Важное» + созданные через попап.
  const [folders, setFolders] = useState(PRESET_FOLDERS);
  const [rowFolder, setRowFolder] = useState<Record<string, string>>({});
  const [moveOpen, setMoveOpen] = useState(false);
  const folderSeqRef = useRef(0);

  const createFolder = (label: string) => {
    folderSeqRef.current += 1;
    const id = `folder-${folderSeqRef.current}`;
    setFolders((prev) => [...prev, { id, label }]);
    return id;
  };
  const moveSelectedToFolder = (folderId: string) => {
    setRowFolder((prev) => {
      const next = { ...prev };
      selected.forEach((id) => {
        next[id] = folderId;
      });
      return next;
    });
    setSelected(new Set());
  };

  const toggleFav = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Поиск по адресу → фильтр по выбранной папке («Все папки» / «Избранные» / папка).
  const searched = useMemo(
    () => rows.filter((r) => r.address.toLowerCase().includes(query.trim().toLowerCase())),
    [rows, query],
  );
  const filtered =
    folder === "all"
      ? searched
      : folder === "fav"
        ? searched.filter((r) => favorites.has(r.id))
        : searched.filter((r) => rowFolder[r.id] === folder);

  const allChecked = filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const someChecked = filtered.some((r) => selected.has(r.id)) && !allChecked;
  const toggleAll = (value: boolean) =>
    setSelected(value ? new Set(filtered.map((r) => r.id)) : new Set());

  const folderItems = [
    { value: "all", label: "Все папки" },
    { value: "fav", label: "Избранные" },
    ...folders.map((f) => ({ value: f.id, label: f.label })),
  ];
  const folderLabel = folderItems.find((i) => i.value === folder)?.label ?? "Все папки";

  return (
    <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
      {/* Строка поиска. Карта фильтров — абсолютный дропдаун: открывается ровно
          по ширине инпута, поверх контента, с отступом 8px (как в Figma). */}
      <div className="ds-searchbar relative z-30">
        <div className="ds-searchbar__input relative">
          <Input
            size="l"
            leftIcon={<SearchIcon />}
            placeholder="Поиск"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {filtersOpen && (
            <div className="absolute inset-x-0 top-full z-30 mt-2">
              <FilterPanel onSearch={() => setFiltersOpen(false)} />
            </div>
          )}
        </div>
        <div className="ds-searchbar__actions">
          <Dropdown
            value={folder}
            onSelect={setFolder}
            items={folderItems}
            trigger={({ open }) => (
              <span className="ds-p3 flex h-12 w-[200px] items-center justify-between gap-2 rounded-[4px] border border-border bg-white px-4 text-foreground">
                <span className="truncate">{folderLabel}</span>
                <Chevron open={open} />
              </span>
            )}
          />
          <Button
            variant="ghost"
            size="l"
            iconLeft={<FiltersIcon />}
            aria-pressed={filtersOpen}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            Фильтры
          </Button>
        </div>
      </div>

      {/* Тулбар: bulk «Переместить в папку» (при выборе) + счётчик «Отмечено: N» */}
      <Toolbar
        left={
          selected.size > 0 ? (
            <Button variant="tertiary" size="xs" iconLeft={<FolderIcon />} onClick={() => setMoveOpen(true)}>
              Переместить в папку
            </Button>
          ) : undefined
        }
        center={`Отмечено: ${selected.size}`}
      />

      <div className="overflow-x-auto">
        <div className="flex min-w-[640px] flex-col gap-3">
          <TableHeader
            size="s"
            tone="muted"
            selectable
            checked={allChecked}
            indeterminate={someChecked}
            onCheckedChange={toggleAll}
            sortKey="date"
            sortDir={sortDir}
            onSort={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            columns={[
              { key: "star", label: "", width: "24px" },
              { key: "address", label: "Адрес" },
              { key: "date", label: "Дата заявки", align: "right", sortable: true },
            ]}
          />
          {filtered.length > 0 ? (
            filtered.map((row) => (
              <RegItem
                key={row.id}
                row={row}
                checked={selected.has(row.id)}
                starred={favorites.has(row.id)}
                onCheck={() => toggle(row.id)}
                onToggleStar={() => toggleFav(row.id)}
                onOpen={() => onOpenRow(row)}
              />
            ))
          ) : (
            <EmptyState title="Отсутствуют заявки" className="py-10" />
          )}
        </div>
      </div>

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

// ── Деталь регистрации (полноэкранный Shell) ─────────────────────────────────
function RegDetail({
  row,
  onClose,
  onDeleteUser,
}: {
  row: RegRow;
  onClose: () => void;
  onDeleteUser: () => void;
}) {
  const [sections, setSections] = useState<FieldSection[]>(row.sections);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmFields, setConfirmFields] = useState(false);
  const [confirmUser, setConfirmUser] = useState(false);

  const toggleField = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleSection = (sec: FieldSection, value: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      sec.fields.forEach((f) => (value ? next.add(f.id) : next.delete(f.id)));
      return next;
    });

  // Удаление выбранных полей — убираем их из секций (пустые секции исчезают).
  const deleteFields = () => {
    setSections((prev) =>
      prev
        .map((s) => ({ ...s, fields: s.fields.filter((f) => !selected.has(f.id)) }))
        .filter((s) => s.fields.length > 0),
    );
    setSelected(new Set());
    setConfirmFields(false);
  };

  const hasSelection = selected.size > 0;

  return (
    <Shell onExit={onClose}>
      {/* Заголовок-адрес по центру + красный крест справа */}
      <div className="relative flex min-h-[40px] items-center justify-center">
        <h1 className="ds-h5 text-center text-foreground">{row.address}</h1>
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute right-0 flex size-9 items-center justify-center rounded-[4px] border border-[var(--color-negative-300,#e5424d)] text-[var(--color-negative-300,#e5424d)] transition-colors hover:bg-[rgba(229,66,77,0.08)]"
        >
          <CloseXIcon />
        </button>
      </div>

      {sections.map((sec) => {
        const all = sec.fields.every((f) => selected.has(f.id));
        const some = sec.fields.some((f) => selected.has(f.id)) && !all;
        return (
          <div key={sec.id} className="flex flex-col gap-3">
            <span className="ds-p1-medium text-foreground">
              На основании <span className="text-[var(--color-blue-midhub-500)]">{sec.basis}</span>
            </span>
            <div className="overflow-hidden rounded-[4px] border border-border bg-white">
              <label className="flex cursor-pointer items-center gap-4 border-b border-border bg-surface-sunken px-6 py-4">
                <Checkbox
                  size="xs"
                  checked={all}
                  indeterminate={some}
                  onChange={(e) => toggleSection(sec, e.target.checked)}
                  aria-label={`Выбрать все поля: ${sec.docTitle}`}
                />
                <span className="ds-p3-medium text-foreground">{sec.docTitle}</span>
              </label>
              {sec.fields.map((f) => (
                <label key={f.id} className="flex cursor-pointer items-center gap-4 border-b border-border px-6 py-3 last:border-b-0">
                  <Checkbox
                    size="xs"
                    checked={selected.has(f.id)}
                    onChange={() => toggleField(f.id)}
                    aria-label={`Выбрать поле ${f.label}`}
                  />
                  <span className="ds-p3 w-[260px] shrink-0 text-foreground-subtle">{f.label}</span>
                  <span className="ds-p3 min-w-0 flex-1 text-foreground">{f.value}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="negative-sec" size="l" disabled={!hasSelection} onClick={() => setConfirmFields(true)}>
          Удалить выбранные поля
        </Button>
        <Button variant="negative" size="l" disabled={hasSelection} onClick={() => setConfirmUser(true)}>
          Удалить пользователя
        </Button>
      </div>

      {/* Подтверждение удаления полей (Figma 6739-405326) */}
      <Modal
        open={confirmFields}
        onClose={() => setConfirmFields(false)}
        size="s"
        title="Удаление полей"
        footer={
          <>
            <Button variant="secondary" size="l" className="min-w-[120px]" onClick={() => setConfirmFields(false)}>Нет</Button>
            <Button variant="negative" size="l" className="min-w-[120px]" onClick={deleteFields}>Да</Button>
          </>
        }
      >
        <p className="ds-p3 text-center text-foreground-muted">
          Вы уверены, что хотите удалить выбранные поля?
          <br />
          Это действие необратимо.
        </p>
      </Modal>

      {/* Подтверждение удаления пользователя (Figma 6739-405255) */}
      <Modal
        open={confirmUser}
        onClose={() => setConfirmUser(false)}
        size="s"
        title="Удаление пользователя"
        footer={
          <>
            <Button variant="secondary" size="l" className="min-w-[120px]" onClick={() => setConfirmUser(false)}>Нет</Button>
            <Button variant="negative" size="l" className="min-w-[120px]" onClick={() => { setConfirmUser(false); onDeleteUser(); }}>Да</Button>
          </>
        }
      >
        <p className="ds-p3 text-center text-foreground-muted">
          Вы уверены, что хотите удалить данного пользователя?
        </p>
      </Modal>
    </Shell>
  );
}

export function CabinetRegistrationsScreen({ cabinet, current }: { cabinet: CabinetConfig; current: string }) {
  const [tab, setTab] = useState<TabKey>("incoming");
  const [rowsByTab, setRowsByTab] = useState<Record<TabKey, RegRow[]>>(SEED_BY_TAB);

  // Клик по строке → warning «Обратите внимание» → деталь.
  const [pending, setPending] = useState<{ tab: TabKey; row: RegRow } | null>(null);
  const [skipWarn, setSkipWarn] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [detail, setDetail] = useState<{ tab: TabKey; row: RegRow } | null>(null);

  const openRow = (t: TabKey, row: RegRow) => {
    if (skipWarn) setDetail({ tab: t, row });
    else { setDontShow(false); setPending({ tab: t, row }); }
  };
  const confirmWarn = () => {
    if (dontShow) setSkipWarn(true);
    if (pending) setDetail(pending);
    setPending(null);
  };

  // Удаление пользователя → регистрация переезжает в «Запросы на удаление».
  const deleteUser = () => {
    if (!detail) return;
    const { tab: from, row } = detail;
    setRowsByTab((prev) => {
      const next = { ...prev, [from]: prev[from].filter((r) => r.id !== row.id) };
      if (from !== "deletion") next.deletion = [row, ...next.deletion];
      return next;
    });
    setDetail(null);
  };

  if (detail) {
    return <RegDetail row={detail.row} onClose={() => setDetail(null)} onDeleteUser={deleteUser} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabKey)}
          variant="solid-light"
          size="l"
          equal
          aria-label="Регистрации"
          className="w-full rounded-none border-x-0 border-t-0"
        >
          {TABS.map((t) => (
            <Tab key={t.value} value={t.value}>
              {t.label}
            </Tab>
          ))}
        </Tabs>

        {/* Все вкладки смонтированы — состояние (выбор/избранное/папки/фильтры)
            сохраняется при переключении; неактивные просто скрыты. */}
        {TABS.map((t) => (
          <div key={t.value} hidden={tab !== t.value}>
            <RegistrationsPanel rows={rowsByTab[t.value]} onOpenRow={(row) => openRow(t.value, row)} />
          </div>
        ))}
      </main>

      {/* Предупреждение перед просмотром ПД (Figma 6739-405591) */}
      <Modal
        open={pending != null}
        onClose={() => setPending(null)}
        size="s"
        title="Обратите внимание"
        footer={
          <>
            <Button variant="negative-sec" size="l" className="min-w-[140px]" onClick={() => setPending(null)}>Отмена</Button>
            <Button size="l" className="min-w-[140px]" onClick={confirmWarn}>Продолжить</Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-5">
          <p className="ds-p3 text-center text-foreground-muted">
            Для предотвращения утечки персональных данных доступ к ним отслеживается. Номер вашей
            лицензии, дата и набор данных, которые вы просмотрите будут зафиксированы.
          </p>
          <Checkbox
            size="xs"
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
            label={<span className="text-foreground-muted">Больше не показывать это сообщение</span>}
          />
        </div>
      </Modal>
    </div>
  );
}
