"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Radio } from "../radio";
import { Checkbox } from "../checkbox";
import { Accordion } from "../accordion";
import { Flag } from "../flag";
import { Button } from "../button";
import { DeleteButton } from "../delete";
import { Badge, type BadgeColor } from "../badge";

/**
 * DocumentSettings — выбор типа настроек и запрашиваемых данных/документов
 * (композит MIDHUB DS). Источник: Figma «UI фичи» / Типы настроек (288:643)
 * и ПП (2671:398509…398581).
 *
 * Два режима (radio):
 *  - «ОБЩАЯ НАСТРОЙКА»: чекбоксы идентификации + по странам категории →
 *    документы с ценами (Межд./Лок.).
 *  - «ПЕРСОНАЛЬНАЯ НАСТРОЙКА»: плашки оснований (из таблицы) + по странам
 *    раскрываемые документы → поля данных (фиолетовые) + «Другой документ»
 *    (поиск по категориям + Выбрать/Отменить).
 *
 * Reuse DS: Radio · Checkbox · Accordion · Flag · Input · Button · Badge.
 */

export interface DocSettingsDoc {
  name: string;
  intl: number;
  local: number;
  /** Поля данных, которые предоставляет документ (персональный режим). */
  fields?: string[];
}
export interface DocSettingsCategory {
  name: string;
  docs: DocSettingsDoc[];
}
export interface DocSettingsCountry {
  code: string;
  label: ReactNode;
  categories: DocSettingsCategory[];
}
/** Основание из таблицы — цветная плашка в персональном режиме. */
export interface DocSettingsBasis {
  title: string;
  color: BadgeColor;
}

export interface DocumentSettingsState {
  type: "general" | "personal";
  identity: string[];
  documents: Record<string, string[]>;
  /** Добавленные «другие документы»: по коду страны → ключу документа. */
  altDocs: Record<string, Record<string, string[]>>;
  complete: boolean;
}

export interface DocumentSettingsProps {
  identityFields: string[];
  countries: DocSettingsCountry[];
  /** Основания (для персонального режима) — цветные плашки. */
  bases?: DocSettingsBasis[];
  /** Дерево «Другой документ» (категории → гео → документы). */
  otherTree?: DocTreeNode[];
  /** Начальный режим (для восстановления сохранённого выбора). */
  initialType?: "general" | "personal";
  initialIdentity?: string[];
  initialDocs?: Record<string, string[]>;
  /** Начальные «другие документы» (персональный режим) — по стране/документу. */
  initialAltDocs?: Record<string, Record<string, string[]>>;
  onChange?: (state: DocumentSettingsState) => void;
  className?: string;
}

const money = (n: number) => `${n.toFixed(2)}$`;

/** Поля данных по умолчанию (если у документа не заданы свои). */
const DEFAULT_FIELDS = [
  "Фамилия",
  "Имя",
  "Отчество",
  "Пол",
  "Дата рождения",
  "Место рождения",
  "Серия и номер паспорта",
  "Кем выдан",
  "Дата выдачи",
  "Фото паспорта",
];

/** Узел дерева «Другой документ» (категория/гео-уровень или документ-лист). */
export interface DocTreeNode {
  name: string;
  children?: DocTreeNode[];
}

/** Дерево по умолчанию: категории + гео-вложенность → документы. */
const DEFAULT_TREE: DocTreeNode[] = [
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
                    children: [{ name: "Водительское удостоверение" }, { name: "Удостоверение нотариуса РФ" }],
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
];

/** Группы, раскрытые по умолчанию: вложенные гео-уровни (depth>0) и категории,
 *  у которых есть под-группы (как «Удостоверяющие личность»). */
function computeDefaultOpen(nodes: DocTreeNode[], depth = 0, acc = new Set<string>()): Set<string> {
  for (const n of nodes) {
    if (n.children) {
      if (depth > 0 || n.children.some((c) => c.children)) acc.add(n.name);
      computeDefaultOpen(n.children, depth + 1, acc);
    }
  }
  return acc;
}

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cn("size-4 transition-transform", open && "rotate-180", className)}>
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Шеврон-бокс страны (Ghost S-32). */
function ChevronBox({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Свернуть" : "Развернуть"}
      className="flex size-8 shrink-0 items-center justify-center rounded-[4px] border border-border bg-surface-sunken text-foreground-muted transition-colors hover:text-foreground"
    >
      <Chevron open={open} />
    </button>
  );
}

/** Check-circle (кружок с галочкой) — иконка плашки основания. */
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0">
      <circle cx="8" cy="8" r="6.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="m5.4 8 1.8 1.8L10.6 6.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-foreground-subtle">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}


export function DocumentSettings({
  identityFields,
  countries,
  bases = [],
  otherTree = DEFAULT_TREE,
  initialType,
  initialIdentity,
  initialDocs,
  initialAltDocs,
  onChange,
  className,
}: DocumentSettingsProps) {
  const [type, setType] = useState<"general" | "personal">(initialType ?? "general");
  const [identity, setIdentity] = useState<Set<string>>(() => new Set(initialIdentity ?? []));
  const [docs, setDocs] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(Object.entries(initialDocs ?? {}).map(([k, v]) => [k, new Set(v)])),
  );
  const [openCountries, setOpenCountries] = useState<Set<string>>(
    () => new Set(Object.keys(initialDocs ?? {}).filter((c) => (initialDocs?.[c]?.length ?? 0) > 0)),
  );
  // Персональный режим: раскрытый документ, раскрытые альтернативы и панель
  // «Другой документ» — по стране/категории.
  const [expandedDoc, setExpandedDoc] = useState<Record<string, string>>({});
  const [openAlt, setOpenAlt] = useState<Set<string>>(new Set());
  const [otherOpen, setOtherOpen] = useState<Record<string, boolean>>({});
  const [otherSearch, setOtherSearch] = useState("");
  const [otherSel, setOtherSel] = useState<Record<string, Set<string>>>({});
  const [treeOpen, setTreeOpen] = useState<Record<string, Set<string>>>({});
  // Добавленные «другие документы» — по стране и ключу документа.
  const [altDocs, setAltDocs] = useState<Record<string, Record<string, string[]>>>(
    () => initialAltDocs ?? {},
  );
  const defaultTreeOpen = computeDefaultOpen(otherTree);

  // Основание по умолчанию (плашка не должна пропадать в персональном режиме).
  const resolvedBases: DocSettingsBasis[] =
    bases.length > 0 ? bases : [{ title: "Согласие", color: "purple" }];
  // Цвет чекбоксов в персональном режиме = цвет основания (плашки).
  const basisColor = resolvedBases[0].color;
  const checkStyle = { "--check-checked-bg": `var(--color-${basisColor}-300)` } as CSSProperties;

  const countryKey = countries.map((c) => c.code).join(",");

  const toggleIdentity = (f: string) =>
    setIdentity((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  const toggleDoc = (code: string, key: string) =>
    setDocs((prev) => {
      const set = new Set(prev[code] ?? []);
      const adding = !set.has(key);
      adding ? set.add(key) : set.delete(key);
      // В персональном режиме при выборе документа сразу раскрываем его.
      if (adding) setExpandedDoc((e) => ({ ...e, [code]: key }));
      return { ...prev, [code]: set };
    });
  const toggleCountry = (code: string) =>
    setOpenCountries((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  // Авто-раскрытие стран по мере выбора.
  useEffect(() => {
    setOpenCountries((prev) => {
      const next = new Set(prev);
      const trigger = type === "general" ? identity.size > 0 : true;
      if (trigger && countries[0]) next.add(countries[0].code);
      countries.forEach((c, i) => {
        if ((docs[c.code]?.size ?? 0) > 0 && countries[i + 1]) next.add(countries[i + 1].code);
      });
      return next.size === prev.size ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity, docs, countryKey, type]);

  const priceOf = (country: DocSettingsCountry, key: string) => {
    for (const cat of country.categories) {
      const d = cat.docs.find((x) => `${cat.name}/${x.name}` === key);
      if (d) return d;
    }
    return undefined;
  };
  const countryRange = (country: DocSettingsCountry) => {
    const keys = [...(docs[country.code] ?? [])];
    if (keys.length === 0) return "0$";
    let lo = 0, hi = 0;
    keys.forEach((k) => {
      const d = priceOf(country, k);
      if (d) { lo += d.local; hi += d.intl; }
    });
    return `${money(lo)} - ${money(hi)}`;
  };

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    const complete =
      (type === "personal" || identity.size > 0) &&
      countries.every((c) => (docs[c.code]?.size ?? 0) > 0);
    onChangeRef.current?.({
      type,
      identity: [...identity],
      documents: Object.fromEntries(Object.entries(docs).map(([k, v]) => [k, [...v]])),
      altDocs,
      complete,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, identity, docs, altDocs, countryKey]);

  // Поля данных документа (цвет основания, по умолчанию выбраны). Источник Figma.
  const renderFields = (fields: string[]) => (
    <div className="flex flex-col gap-3 pb-4 pl-8">
      {fields.map((f) => (
        <Checkbox key={f} size="xs" defaultChecked label={<span className="text-foreground-muted">{f}</span>} />
      ))}
    </div>
  );

  // Разделитель «или» между документом и альтернативами.
  const OrSep = () => (
    <>
      <div className="border-t border-border" />
      <span className="ds-caption text-foreground-subtle">или</span>
    </>
  );

  // ── Документ в персональном режиме (раскрывается в поля данных) ──
  const personalDocRow = (country: DocSettingsCountry, cat: DocSettingsCategory, d: DocSettingsDoc) => {
    const key = `${cat.name}/${d.name}`;
    const checked = docs[country.code]?.has(key) ?? false;
    const open = expandedDoc[country.code] === key;
    const fields = d.fields ?? DEFAULT_FIELDS;
    return (
      <div key={d.name} className="border-t border-border first:border-t-0">
        <div className="flex items-center justify-between gap-4 py-3">
          <Checkbox
            size="xs"
            checked={checked}
            onChange={() => toggleDoc(country.code, key)}
            label={<span className="text-foreground">{d.name}</span>}
          />
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex flex-col items-end text-right">
              <span className="ds-caption text-foreground-subtle">Межд.: ${d.intl}</span>
              <span className="ds-caption text-foreground-subtle">Лок.: ${d.local}</span>
            </div>
            <button
              type="button"
              aria-label={open ? "Свернуть" : "Развернуть"}
              onClick={() => setExpandedDoc((e) => ({ ...e, [country.code]: open ? "" : key }))}
              className="text-foreground-muted transition-colors hover:text-foreground"
            >
              <Chevron open={open} />
            </button>
          </div>
        </div>
        {open && renderFields(fields)}
      </div>
    );
  };

  // ── Альтернативный документ (добавлен через «Другой документ») ──
  //    Корзина удаляет, шеврон раскрывает поля данных. Источник Figma.
  const altDocRow = (country: DocSettingsCountry, docKey: string, alt: string) => {
    const code = country.code;
    const okey = `${code}/${docKey}/${alt}`;
    const open = openAlt.has(okey);
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <span className="ds-p3 inline-flex items-center gap-2 text-foreground">
            {alt}
            <DeleteButton
              size="sm"
              onClick={() =>
                setAltDocs((prev) => {
                  const cur = { ...(prev[code] ?? {}) };
                  cur[docKey] = (cur[docKey] ?? []).filter((x) => x !== alt);
                  return { ...prev, [code]: cur };
                })
              }
            />
          </span>
          <button
            type="button"
            aria-label={open ? "Свернуть" : "Развернуть"}
            onClick={() =>
              setOpenAlt((prev) => {
                const next = new Set(prev);
                next.has(okey) ? next.delete(okey) : next.add(okey);
                return next;
              })
            }
            className="text-foreground-muted transition-colors hover:text-foreground"
          >
            <Chevron open={open} />
          </button>
        </div>
        {open && renderFields(DEFAULT_FIELDS)}
      </div>
    );
  };

  // ── «Другой документ» (кнопка → панель поиска по дереву категорий) ──
  const otherDocPanel = (country: DocSettingsCountry, docKey: string) => {
    const code = country.code;
    const catKey = `${code}/${docKey}`;
    const panelOpen = otherOpen[catKey] ?? false;
    const q = otherSearch.trim().toLowerCase();
    const nodeMatches = (n: DocTreeNode): boolean =>
      n.children ? n.children.some(nodeMatches) : n.name.toLowerCase().includes(q);
    const openSet = treeOpen[catKey] ?? defaultTreeOpen;
    const toggleGroup = (name: string) =>
      setTreeOpen((s) => {
        const set = new Set(s[catKey] ?? defaultTreeOpen);
        set.has(name) ? set.delete(name) : set.add(name);
        return { ...s, [catKey]: set };
      });
    const toggleLeaf = (name: string) =>
      setOtherSel((s) => {
        const set = new Set(s[catKey] ?? []);
        set.has(name) ? set.delete(name) : set.add(name);
        return { ...s, [catKey]: set };
      });
    const renderTree = (nodes: DocTreeNode[], depth: number): ReactNode[] =>
      nodes
        .filter((n) => q === "" || nodeMatches(n))
        .map((n) => {
          const pad = 16 + depth * 20;
          if (n.children) {
            const gopen = q !== "" || openSet.has(n.name);
            return (
              <div key={n.name}>
                <button
                  type="button"
                  onClick={() => toggleGroup(n.name)}
                  className="flex w-full items-center gap-2 border-b border-border py-2.5 text-left"
                  style={{ paddingLeft: pad }}
                >
                  <Chevron open={gopen} />
                  <span className={cn("ds-p3", gopen ? "text-foreground" : "text-foreground-muted")}>{n.name}</span>
                </button>
                {gopen && renderTree(n.children, depth + 1)}
              </div>
            );
          }
          return (
            <div key={n.name} className="border-b border-border" style={{ paddingLeft: pad }}>
              <div className="py-2.5">
                <Checkbox
                  size="xs"
                  checked={otherSel[catKey]?.has(n.name) ?? false}
                  onChange={() => toggleLeaf(n.name)}
                  label={<span className="text-foreground">{n.name}</span>}
                />
              </div>
            </div>
          );
        });

    if (!panelOpen) {
      return (
        <button
          type="button"
          className="ds-caption-medium self-start text-primary"
          onClick={() => setOtherOpen((o) => ({ ...o, [catKey]: true }))}
        >
          Другой документ
        </button>
      );
    }
    return (
      <div className="overflow-hidden rounded-[4px] border border-border bg-white">
        {/* Поиск — слитный хедер блока */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <SearchIcon />
          <input
            className="ds-p2 w-full bg-transparent text-foreground outline-none placeholder:text-foreground-subtle"
            placeholder="Поиск"
            value={otherSearch}
            onChange={(e) => setOtherSearch(e.target.value)}
          />
        </div>
        {/* Дерево категории → гео → документы */}
        <div>{renderTree(otherTree, 0)}</div>
        {/* Футер с кнопками — отделён границей */}
        <div className="flex gap-3 border-t border-border bg-surface-sunken/40 px-4 py-3">
          <Button
            size="s"
            disabled={(otherSel[catKey]?.size ?? 0) === 0}
            onClick={() => {
              // Выбранные «другие документы» → альтернативы под документом.
              setAltDocs((prev) => {
                const cur = { ...(prev[code] ?? {}) };
                const list = new Set(cur[docKey] ?? []);
                otherSel[catKey]?.forEach((n) => list.add(n));
                cur[docKey] = [...list];
                return { ...prev, [code]: cur };
              });
              setOtherSel((s) => ({ ...s, [catKey]: new Set<string>() }));
              setOtherOpen((o) => ({ ...o, [catKey]: false }));
            }}
          >
            Выбрать
          </Button>
          <Button
            size="s"
            variant="negative-sec"
            onClick={() => setOtherOpen((o) => ({ ...o, [catKey]: false }))}
          >
            Отменить
          </Button>
        </div>
      </div>
    );
  };

  // ── Тело категории в персональном режиме (документы в исходном порядке).
  //    После каждого ВЫБРАННОГО документа — его альтернативы (или) +
  //    «Другой документ». Источник Figma (2671:398524…398581).
  const personalCategoryBody = (country: DocSettingsCountry, cat: DocSettingsCategory) => {
    const code = country.code;
    return (
      <div className="flex flex-col">
        {cat.docs.flatMap((d) => {
          const key = `${cat.name}/${d.name}`;
          const checked = docs[code]?.has(key) ?? false;
          const nodes: ReactNode[] = [personalDocRow(country, cat, d)];
          if (checked) {
            const alts = altDocs[code]?.[key] ?? [];
            nodes.push(
              <div key={`alt-${d.name}`} className="flex flex-col gap-3 py-3">
                {alts.map((alt) => (
                  <div key={alt} className="flex flex-col gap-3">
                    <OrSep />
                    {altDocRow(country, key, alt)}
                  </div>
                ))}
                <OrSep />
                {otherDocPanel(country, key)}
              </div>,
            );
          }
          return nodes;
        })}
      </div>
    );
  };

  // ── Страна (общий список категорий → документы) ──────────────
  const countrySection = (country: DocSettingsCountry) => {
    const open = openCountries.has(country.code);
    return (
      <div key={country.code} className="overflow-hidden rounded-[4px] border border-border bg-surface">
        <div className="relative flex items-center px-6 py-4">
          <span className="ds-p3 inline-flex items-center gap-3 text-foreground">
            <Flag code={country.code} width={24} />
            {country.label}
          </span>
          <span className="absolute left-1/2 -translate-x-1/2">
            <ChevronBox open={open} onClick={() => toggleCountry(country.code)} />
          </span>
          <span className="ds-p3 ml-auto text-foreground tabular-nums">{countryRange(country)}</span>
        </div>

        {open && (
          <div className="border-t border-border bg-surface-sunken/40 px-6 py-2">
            {country.categories.map((cat, ci) => (
              <Accordion
                key={cat.name}
                title={cat.name}
                size="s"
                defaultOpen={ci === 0 || cat.docs.some((d) => docs[country.code]?.has(`${cat.name}/${d.name}`))}
              >
                {type === "personal" ? (
                  personalCategoryBody(country, cat)
                ) : (
                  <div className="flex flex-col">
                    {cat.docs.map((d) => {
                      const key = `${cat.name}/${d.name}`;
                      return (
                        <div key={d.name} className="flex items-center justify-between gap-4 border-t border-border py-3 first:border-t-0">
                          <Checkbox
                            size="xs"
                            checked={docs[country.code]?.has(key) ?? false}
                            onChange={() => toggleDoc(country.code, key)}
                            label={<span className="text-foreground">{d.name}</span>}
                          />
                          <div className="flex shrink-0 flex-col items-end text-right">
                            <span className="ds-caption text-foreground-subtle">Межд.: ${d.intl}</span>
                            <span className="ds-caption text-foreground-subtle">Лок.: ${d.local}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Accordion>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {/* ── ОБЩАЯ НАСТРОЙКА ───────────────────────────────────── */}
      <section
        className={cn(
          "overflow-hidden rounded-[4px] border",
          type === "general" ? "border-primary bg-primary-soft" : "border-border bg-surface",
        )}
      >
        <SettingHeader title="ОБЩАЯ НАСТРОЙКА" selected={type === "general"} onSelect={() => setType("general")} />
      </section>

      {type === "general" && (
        <>
          <div className="overflow-hidden rounded-[4px] border border-border bg-surface">
            <div className="border-b border-border px-6 py-4">
              <span className="ds-p3-medium text-foreground">Данные идентифицирующие пользователя</span>
            </div>
            <div className="flex flex-col gap-4 p-6">
              {identityFields.map((f) => (
                <Checkbox key={f} size="xs" checked={identity.has(f)} onChange={() => toggleIdentity(f)} label={<span className="text-foreground-muted">{f}</span>} />
              ))}
            </div>
          </div>
          {countries.map(countrySection)}
        </>
      )}

      {/* ── ПЕРСОНАЛЬНАЯ НАСТРОЙКА ─────────────────────────────── */}
      <section
        className={cn(
          "overflow-hidden rounded-[4px] border",
          type === "personal" ? "border-primary bg-primary-soft" : "border-border bg-surface",
        )}
      >
        <SettingHeader title="ПЕРСОНАЛЬНАЯ НАСТРОЙКА" selected={type === "personal"} onSelect={() => setType("personal")} />
      </section>

      {type === "personal" && (
        <div className="flex flex-col gap-3" style={checkStyle}>
          <p className="ds-p3 text-foreground-subtle">
            Стоимость выбранного вами набора данных в каждой стране в зависимости от выбранного вами
            диапазона верификации предоставленных данных.
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="ds-p2-medium text-foreground">Вы будете собирать данные на основании:</span>
            <div className="flex flex-wrap justify-end gap-2">
              {resolvedBases.map((b) => (
                <Badge
                  key={b.title}
                  variant="solid"
                  color={b.color}
                  className="gap-1.5"
                  style={{ "--b-solid-bg": `var(--color-${b.color}-300)` } as CSSProperties}
                >
                  <CheckCircleIcon />
                  {b.title}
                </Badge>
              ))}
            </div>
          </div>
          {countries.map(countrySection)}
        </div>
      )}
    </div>
  );
}

/** Шапка radio-секции: radio (xs) + заголовок (P2-Medium) + шеврон-вниз. */
function SettingHeader({ title, selected, onSelect }: { title: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className="flex w-full items-center gap-2 px-6 py-5 text-left">
      <Radio size="xs" checked={selected} onChange={onSelect} className="pointer-events-none" tabIndex={-1} />
      <span className="ds-p2-medium flex-1 text-foreground">{title}</span>
      <Chevron open={selected} className="size-6 text-foreground-muted" />
    </button>
  );
}
