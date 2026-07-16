"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "../button";
import { Tabs, Tab } from "../tabs";
import { Item } from "../item";
import { Badge, type BadgeColor } from "../badge";
import { EmptyState } from "../empty-state";
import { EditPencilIcon } from "../edit-pencil-icon";
import { FeedPhotoIcon } from "./feed-icons";

/**
 * Профиль пользователя — композиты MIDHUB DS.
 * Источник: Figma «UI фичи» / профиль (1731:252149 обложка, 1735:252539 шапка,
 * 1731:251470 / 1735:255297 экран, 1735:255711 общие сведения, 2130:230084
 * достижения, 1735:255796 история роли, 1950:197286, 2130:229794 / 2008:258960 /
 * 1741:286492 требования). Стили 1:1.
 *
 * Сборка из готовых DS: Tabs · Button · Item · Badge · EmptyState (+ иконка
 * камеры из feed-icons). Новый только collapsible-шелл `SectionCard` (полностью
 * full-bleed тело, чего нет у QuestionCard) и раскладки секций.
 *
 * Экспорт:
 *   ProfileHeader      — обложка + аватар + имя/роль + «Поделиться» + табы.
 *   SectionCard        — раскрывающаяся секция (серая шапка + full-bleed тело).
 *   ProfileInfoCard    — «Общие сведения» (под-секции: текст / label-value).
 *   AchievementsCard   — «Достижения» (строки лого+текст / пусто).
 *   RoleHistoryCard    — «История роли» (таймлайн аватар+период).
 *   RequirementsCard   — «Требования» (строки+бейдж / пусто / режим настройки).
 */

/* ── Иконки ─────────────────────────────────────────────────── */

function ShareIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7H6.5A3.5 3.5 0 0 0 3 10.5V12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PencilIcon() {
  return <EditPencilIcon className="size-[18px]" />;
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-[18px]">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.5 5.5l1.5 1.5m10 10 1.5 1.5m0-13-1.5 1.5m-10 10L5.5 18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SectionChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-6 transition-transform", open && "rotate-180")}
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Круглый аватар: URL → <img>, иначе нода, иначе серый плейсхолдер. */
function Avatar({ src, size, ring }: { src?: ReactNode; size: number; ring?: boolean }) {
  const cls = cn("shrink-0 rounded-full object-cover", ring && "border-2 border-[var(--color-white)]");
  if (typeof src === "string")
    return <img src={src} alt="" className={cls} style={{ width: size, height: size }} />;
  if (src != null)
    return <span className="shrink-0" style={{ width: size, height: size }}>{src}</span>;
  return <span className={cn(cls, "block bg-[var(--color-grey-20)]")} style={{ width: size, height: size }} />;
}

/* ── ProfileHeader ──────────────────────────────────────────── */

export type ProfileTab = "info" | "feed";

export interface ProfileHeaderProps {
  /** Обложка: URL изображения (строка) или произвольная нода (например градиент). */
  cover?: ReactNode;
  /** Аватар (URL или нода). */
  avatar?: ReactNode;
  name: ReactNode;
  /** Подзаголовок (роль/должность). */
  role?: ReactNode;
  /** Активный таб. */
  tab?: ProfileTab;
  onTabChange?: (tab: ProfileTab) => void;
  defaultTab?: ProfileTab;
  onEditCover?: () => void;
  onEditProfile?: () => void;
  onShare?: () => void;
  /** Показывать кнопки редактирования (обложка/карандаш). По умолчанию true. */
  editable?: boolean;
  /** Заблокировать кнопку «Поделиться профилем». */
  shareDisabled?: boolean;
  /** Заблокировать таб «Лента». */
  feedDisabled?: boolean;
  /** Действие под именем. По умолчанию «Поделиться профилем» (secondary).
   *  Передайте свою ноду — напр. кнопку «Подписаться» — чтобы заменить. */
  actions?: ReactNode;
  className?: string;
}

export function ProfileHeader({
  cover,
  avatar,
  name,
  role,
  tab,
  onTabChange,
  defaultTab = "info",
  onEditCover,
  onEditProfile,
  onShare,
  editable = true,
  shareDisabled = false,
  feedDisabled = false,
  actions,
  className,
}: ProfileHeaderProps) {
  const [internal, setInternal] = useState<ProfileTab>(defaultTab);
  const active = tab ?? internal;
  const setTab = (v: string) => {
    const next = v as ProfileTab;
    if (tab === undefined) setInternal(next);
    onTabChange?.(next);
  };

  return (
    <div className={cn("w-full overflow-hidden rounded-[4px] border border-border bg-surface", className)}>
      {/* Обложка + аватар */}
      <div className="relative">
        <div className="h-[130px] w-full overflow-hidden rounded-t-[4px] bg-[var(--color-grey-90)]">
          {typeof cover === "string" ? (
            <img src={cover} alt="" className="size-full object-cover" />
          ) : (
            cover
          )}
        </div>
        {editable && (
          <Button
            variant="ghost"
            size="xs"
            icon={<FeedPhotoIcon />}
            aria-label="Изменить обложку"
            className="absolute right-6 top-4"
            onClick={onEditCover}
          />
        )}
        <div className="absolute left-6 top-[42px] size-[120px]">
          <Avatar src={avatar} size={120} ring />
        </div>
      </div>

      {/* Имя · роль · поделиться */}
      <div className="relative flex flex-col gap-3 px-6 pb-4 pt-[42px]">
        {editable && (
          <button
            type="button"
            aria-label="Редактировать профиль"
            className="absolute right-6 top-2 text-foreground-subtle transition-colors hover:text-foreground-muted"
            onClick={onEditProfile}
          >
            <PencilIcon />
          </button>
        )}
        <div className="flex flex-col gap-1">
          <span className="ds-p2-medium text-foreground">{name}</span>
          {role != null && <span className="ds-caption text-foreground-subtle">{role}</span>}
        </div>
        {actions ?? (
          <Button
            variant="secondary"
            size="xs"
            iconRight={<ShareIcon />}
            disabled={shareDisabled}
            onClick={onShare}
            className="self-start"
          >
            Поделиться профилем
          </Button>
        )}
      </div>

      {/* Табы */}
      <div className="border-t border-border px-6">
        <Tabs variant="basic" size="m" value={active} onValueChange={setTab} aria-label="Разделы профиля">
          <Tab value="info">Информация</Tab>
          <Tab value="feed" disabled={feedDisabled}>Лента</Tab>
        </Tabs>
      </div>
    </div>
  );
}

/* ── SectionCard (раскрывающаяся секция) ────────────────────── */

export interface SectionCardProps {
  title: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  defaultOpen = false,
  open,
  onOpenChange,
  children,
  className,
}: SectionCardProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const current = open ?? internal;
  const toggle = () => {
    if (open === undefined) setInternal((v) => !v);
    onOpenChange?.(!current);
  };

  return (
    <div className={cn("w-full rounded-[4px] border border-border bg-surface", className)}>
      <button
        type="button"
        aria-expanded={current}
        onClick={toggle}
        className={cn(
          // Канон заголовков-аккордеонов: синий тинт при наведении.
          "flex h-[66px] w-full items-center justify-between bg-[var(--color-grey-10)] px-6 text-left transition-colors hover:bg-[color:var(--color-blue-midhub-50)]",
          current ? "rounded-t-[4px]" : "rounded-[4px]",
        )}
      >
        <span className="ds-p3 text-foreground">{title}</span>
        <span className="text-foreground-subtle">
          <SectionChevron open={current} />
        </span>
      </button>
      {current && <div className="border-t border-border">{children}</div>}
    </div>
  );
}

/* ── ProfileInfoCard (Общие сведения) ───────────────────────── */

export interface InfoRow {
  label: ReactNode;
  value: ReactNode;
}

export interface InfoGroup {
  /** Серая под-шапка секции (Описание / Контакты / Личные данные). */
  heading?: ReactNode;
  /** Абзац текста. */
  text?: ReactNode;
  /** Строки «подпись — значение». */
  rows?: InfoRow[];
}

export interface ProfileInfoCardProps {
  title?: ReactNode;
  groups: InfoGroup[];
  defaultOpen?: boolean;
  className?: string;
}

export function ProfileInfoCard({
  title = "Общие сведения",
  groups,
  defaultOpen = true,
  className,
}: ProfileInfoCardProps) {
  return (
    <SectionCard title={title} defaultOpen={defaultOpen} className={className}>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.heading != null && (
            <div className="border-b border-border bg-surface-muted px-6 py-2">
              <span className="ds-caption-medium text-foreground-muted">{g.heading}</span>
            </div>
          )}
          {g.text != null && <p className="ds-caption px-6 py-3 text-foreground">{g.text}</p>}
          {g.rows?.map((r, ri) => (
            <div
              key={ri}
              className={cn("flex flex-wrap gap-x-6 gap-y-1 px-6 py-3.5", ri > 0 && "border-t border-border")}
            >
              <span className="ds-caption w-[260px] shrink-0 text-foreground-subtle">{r.label}</span>
              <span className="ds-caption flex-1 text-foreground">{r.value}</span>
            </div>
          ))}
        </div>
      ))}
    </SectionCard>
  );
}

/* ── AchievementsCard (Достижения) ──────────────────────────── */

export interface AchievementItem {
  /** Логотип: URL или нода. */
  logo?: ReactNode;
  title: ReactNode;
  /** Организация. */
  org?: ReactNode;
  /** Дата выдачи. */
  date?: ReactNode;
}

export interface AchievementsCardProps {
  title?: ReactNode;
  items?: AchievementItem[];
  emptyText?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AchievementsCard({
  title = "Достижения",
  items = [],
  emptyText = "Нет достижений",
  defaultOpen = true,
  className,
}: AchievementsCardProps) {
  return (
    <SectionCard title={title} defaultOpen={defaultOpen} className={className}>
      {items.length === 0 ? (
        <EmptyState title={emptyText} />
      ) : (
        items.map((it, i) => (
          <div
            key={i}
            className={cn("flex items-center gap-4 px-6 py-4", i > 0 && "border-t border-border")}
          >
            <Avatar src={it.logo} size={40} />
            <div className="flex flex-col gap-0.5">
              <span className="ds-p3-medium text-foreground">{it.title}</span>
              {it.org != null && <span className="ds-caption text-foreground-muted">{it.org}</span>}
              {it.date != null && (
                <span className="ds-caption text-foreground-subtle">Дата выдачи: {it.date}</span>
              )}
            </div>
          </div>
        ))
      )}
    </SectionCard>
  );
}

/* ── RoleHistoryCard (История роли) ─────────────────────────── */

export interface RoleHistoryItem {
  avatar?: ReactNode;
  name: ReactNode;
  /** Период (например «август 2019 — настоящее время · 2 года»). */
  period: ReactNode;
}

export interface RoleHistoryCardProps {
  title?: ReactNode;
  items: RoleHistoryItem[];
  defaultOpen?: boolean;
  className?: string;
}

export function RoleHistoryCard({
  title = "История роли",
  items,
  defaultOpen = true,
  className,
}: RoleHistoryCardProps) {
  return (
    <SectionCard title={title} defaultOpen={defaultOpen} className={className}>
      <div className="flex flex-col px-6 py-4">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <div key={i} className={cn("relative flex gap-3", !last && "pb-5")}>
              {!last && (
                <span
                  className="absolute left-4 top-9 bottom-1 -translate-x-1/2 border-l border-dashed border-border"
                  aria-hidden
                />
              )}
              <Avatar src={it.avatar} size={32} />
              <div className="flex flex-col gap-0.5 pt-0.5">
                <span className="ds-p3-medium text-foreground">{it.name}</span>
                <span className="ds-caption text-foreground-subtle">{it.period}</span>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* ── RequirementsCard (Требования) ──────────────────────────── */

export interface RequirementItem {
  name: ReactNode;
  /** Тип (например «Домен»). */
  type?: ReactNode;
  /** Статус-бейдж. */
  badge?: { label: ReactNode; color?: BadgeColor };
}

export interface RequirementsCardProps {
  title?: ReactNode;
  items?: RequirementItem[];
  emptyText?: ReactNode;
  /** Режим настройки: «Настройка требований» + dashed «Добавить требование». */
  editable?: boolean;
  settingsLabel?: ReactNode;
  addLabel?: ReactNode;
  onSettings?: () => void;
  onAdd?: () => void;
  defaultOpen?: boolean;
  className?: string;
}

export function RequirementsCard({
  title = "Требования",
  items = [],
  emptyText = "Нет требований",
  editable = false,
  settingsLabel = "Настройка требований",
  addLabel = "Добавить требование",
  onSettings,
  onAdd,
  defaultOpen = true,
  className,
}: RequirementsCardProps) {
  return (
    <SectionCard title={title} defaultOpen={defaultOpen} className={className}>
      {editable ? (
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="ds-p3 text-foreground">{settingsLabel}</span>
            <button
              type="button"
              aria-label="Настройки"
              className="text-foreground-subtle transition-colors hover:text-foreground-muted"
              onClick={onSettings}
            >
              <GearIcon />
            </button>
          </div>
          {items.map((it, i) => (
            <RequirementRow key={i} item={it} />
          ))}
          <button
            type="button"
            onClick={onAdd}
            className="w-full rounded-[4px] border border-dashed border-[var(--color-blue-midhub-300)] bg-[var(--color-blue-midhub-50)] py-3 text-center transition-colors hover:bg-[var(--color-blue-midhub-100)]"
          >
            <span className="ds-p3 text-primary">{addLabel}</span>
          </button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState title={emptyText} />
      ) : (
        <div className="flex flex-col gap-4 p-6">
          {items.map((it, i) => (
            <RequirementRow key={i} item={it} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function RequirementRow({ item }: { item: RequirementItem }) {
  return (
    <Item>
      <span className="grid w-full grid-cols-3 items-center">
        <span className="ds-p3 text-foreground">{item.name}</span>
        <span className="ds-p3 text-center text-foreground-muted">{item.type}</span>
        <span className="flex justify-end">
          {item.badge != null && (
            <Badge variant="solid" color={item.badge.color ?? "grey"}>
              {item.badge.label}
            </Badge>
          )}
        </span>
      </span>
    </Item>
  );
}
