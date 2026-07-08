"use client";

/**
 * Демки «Приглашение — фаза 2» для витрины /ds.
 * Источник: Figma «UI фичи» — VerificationCard (1942:303390/305217), Toolbar
 * (558:85340), FilterBar (558:85148), InviteForm (2044:222440).
 * Переиспользованы DS: VerificationCard, Toolbar, Pagination, Button, SearchBar,
 * Dropdown, ToggleButton, InviteForm.
 */
import { useState } from "react";
import {
  VerificationCard,
  Toolbar,
  Pagination,
  Button,
  SearchBar,
  Dropdown,
  ToggleButton,
  InviteForm,
  type VerificationRow,
} from "@/components/ds";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const FolderIcon = () => <svg viewBox="0 0 24 24" className="size-4"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s} /></svg>;
const KebabIcon = () => <svg viewBox="0 0 24 24" className="size-6"><circle cx="12" cy="5" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="19" r="1.6" fill="currentColor" /></svg>;
const ListIcon = () => <svg viewBox="0 0 24 24" className="size-4"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" {...s} /></svg>;
const GridIcon = () => <svg viewBox="0 0 24 24" className="size-4"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" {...s} /></svg>;
const ChevronDown = () => <svg viewBox="0 0 24 24" className="size-4"><path d="m6 9 6 6 6-6" {...s} /></svg>;

const COMPANY: VerificationRow[] = [
  { label: "Полное наименование компании", value: "Общество с ограниченной ответственностью “Сапфир”" },
  { label: "ОГРН", value: "1167700074915" },
  { label: "Дата постановки на учет", value: "03.08.2018" },
  { label: "Налоговый орган", value: "Инспекция Федеральной налоговой службы №3 по г. Москве" },
  { label: "Код налогового органа", value: "7703" },
];
const TAX: VerificationRow[] = [
  { label: "ИНН компании", value: "9715286545" },
  { label: "КПП компании", value: "770301001" },
  { label: "Кем подписан документ", value: "И.В.Мансурова" },
];

export function InvitePhase2Demos() {
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "grid">("list");
  return (
    <div className="flex max-w-[1144px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">VerificationCard (чек-лист реквизитов)</span>
        <VerificationCard title="Свидетельство о постановке на учет в налоговом органе" rows={COMPANY} />
        <VerificationCard title="Свидетельство о постановке на учет в налоговом органе" rows={TAX} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Toolbar (bulk + пагинация)</span>
        <Toolbar
          left={<Button variant="tertiary" size="xs" iconLeft={<FolderIcon />}>Переместить в папку</Button>}
          center="Отмечено: 1"
          right={
            <>
              <Pagination size="xs" view="full" page={page} total={200} onChange={setPage} />
              <button type="button" aria-label="Ещё" className="text-foreground-subtle"><KebabIcon /></button>
            </>
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">FilterBar (поиск + папки + список/сетка)</span>
        <SearchBar
          placeholder="Поиск"
          actions={
            <>
              <Dropdown
                trigger={
                  <Button variant="ghost" size="m" iconRight={<ChevronDown />}>Все папки</Button>
                }
                items={[
                  { value: "all", label: "Все папки" },
                  { value: "mine", label: "Мои папки" },
                ]}
              />
              <ToggleButton variant="mode" size="m" pressed={view === "list"} onPressedChange={() => setView("list")}>
                <span className="flex items-center gap-2"><ListIcon /> Список</span>
              </ToggleButton>
              <ToggleButton variant="mode" size="m" pressed={view === "grid"} onPressedChange={() => setView("grid")}>
                <span className="flex items-center gap-2"><GridIcon /> Страны</span>
              </ToggleButton>
            </>
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">InviteForm (форма приглашения)</span>
        <InviteForm />
      </div>
    </div>
  );
}
