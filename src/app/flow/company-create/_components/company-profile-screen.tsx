"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ProfileHeader,
  ProfileInfoCard,
  SectionCard,
  Input,
  Textarea,
  Combobox,
  Button,
  Text,
  MenuRail,
  MenuBadge,
  MenuFooter,
  MenuIcon,
  HeaderIconButton,
  HeaderGridIcon,
  HeaderExitIcon,
  type MenuBadgeColor,
} from "@/components/ds";
import { useRegFlow } from "./reg-flow";

const WORKSPACES: { label: string; color: MenuBadgeColor }[] = [
  { label: "1", color: "red" },
  { label: "2", color: "orange" },
  { label: "3", color: "yellow" },
  { label: "4", color: "green" },
  { label: "5", color: "blue" },
  { label: "6", color: "blue-strong" },
  { label: "7", color: "purple" },
];

/**
 * CompanyProfileScreen — профиль созданной компании (редактирование).
 * Источник: Figma 2295:207316. Собран из DS: AppShell, ProfileHeader,
 * SectionCard, Input, Textarea, Combobox, Button.
 */

const OKVED = [
  "81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая",
  "81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования",
  "64.19 - Денежное посредничество прочее",
];

function GroupHeading({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-t border-border bg-surface-muted px-6 py-2">
      <span className="ds-caption-medium text-foreground-muted">{children}</span>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DocThumb() {
  return (
    <span className="flex h-[86px] w-[86px] flex-col gap-1 rounded-[4px] border border-border bg-surface p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="h-[2px] rounded bg-[var(--color-grey-90)]" style={{ width: `${92 - i * 5}%` }} />
      ))}
    </span>
  );
}

/** Заполненный профиль (read-only) — Figma 2301:214315. */
const VIEW_GROUPS = [
  {
    heading: "Описание",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea nunc diam augue viverra facilisis nullam amet, tristique. Augue laoreet dnunc diam augue viverra facilisis nullam amet, tristique. Augue laoreet diam et, proin. Viverra nec.",
  },
  {
    heading: "Контактная информация",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      { label: "Контактный телефон", value: "+7 (992) 223-22-22" },
      { label: "Домен", value: "Immatra.ru" },
      { label: "E-mail", value: "immatra@immatra.ru" },
    ],
  },
  {
    heading: "Устав",
    rows: [
      { label: "Тип организации", value: "Потребительский кооператив" },
      { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      {
        label: "ОКВЭД",
        value: (
          <span className="flex flex-col gap-1">
            {OKVED.map((o) => (
              <span key={o}>{o}</span>
            ))}
          </span>
        ),
      },
      { label: "Уставные документы", value: <DocThumb /> },
    ],
  },
  {
    heading: "Направление",
    rows: [{ label: "Название", value: "Идеологическое направление" }],
  },
];

export function CompanyProfileScreen({
  paishikiHref = "#",
  view = false,
}: {
  paishikiHref?: string;
  /** Режим просмотра: заполненный read-only профиль (клик по логотипу). */
  view?: boolean;
}) {
  const router = useRouter();
  const flow = useRegFlow();
  const [domains, setDomains] = useState<string[]>([""]);
  const [emails, setEmails] = useState<string[]>([""]);
  const [phones, setPhones] = useState<string[]>([""]);
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);

  // «Сохранить информацию» активна, когда все поля контактов заполнены.
  const allFilled = (a: string[]) => a.every((v) => v.trim() !== "");
  const ready = allFilled(domains) && allFilled(emails) && allFilled(phones);

  const onSave = () => {
    setSaved(true);
    setSectionOpen(false);
  };

  const setAt = (
    set: React.Dispatch<React.SetStateAction<string[]>>,
    i: number,
    v: string,
  ) => set((prev) => prev.map((x, j) => (j === i ? v : x)));
  const addOne = (set: React.Dispatch<React.SetStateAction<string[]>>) =>
    set((prev) => [...prev, ""]);

  const fields = (
    values: string[],
    set: React.Dispatch<React.SetStateAction<string[]>>,
    placeholder: string,
  ) =>
    values.map((v, i) => (
      <div key={`${placeholder}-${i}`} className="max-w-[406px]">
        <Input
          size="l"
          label={v ? placeholder : undefined}
          placeholder={placeholder}
          value={v}
          onChange={(e) => setAt(set, i, e.target.value)}
        />
      </div>
    ));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Урезанное меню — только рейка (без панели) */}
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <MenuRail
          height="100vh"
          brand={
            <MenuBadge brand aria-label="Главная">
              <MenuIcon.Brand />
            </MenuBadge>
          }
          footer={<MenuFooter>Admin</MenuFooter>}
        >
          {WORKSPACES.map((w) => (
            <MenuBadge
              key={w.label}
              color={w.color}
              onClick={w.label === "1" ? () => router.push(paishikiHref) : undefined}
            >
              {w.label}
            </MenuBadge>
          ))}
        </MenuRail>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Верхний хедер (DS-кнопки). Лого + разделитель на этом экране скрыты,
            кнопки выровнены по краям нижнего контента (px-50). */}
        <header className="flex h-[60px] items-center justify-between border-b border-border bg-surface px-5 md:px-[50px]">
          <HeaderIconButton icon={<HeaderGridIcon />} aria-label="Пространства" />
          <HeaderIconButton icon={<HeaderExitIcon />} aria-label="Выход" />
        </header>
        <main className="min-w-0 flex-1">
          <div className="flex w-full flex-col px-5 pt-2 pb-10 md:px-[50px]">
        <ProfileHeader
          name="Immatra"
          role="Потребительский кооператив"
          editable={view}
          shareDisabled={!view}
          feedDisabled
          cover={<div className="size-full bg-[linear-gradient(90deg,#8b7df0_0%,#b89ae8_45%,#f3a9cf_100%)]" />}
        />

        {view ? (
          <>
            <ProfileInfoCard groups={VIEW_GROUPS} className="mt-6" />
            {/* Нижняя кнопка только если ПС ещё не создано */}
            {!flow.published && (
              <div className="mt-10 flex flex-col items-center gap-2 py-10 text-center">
                <Text variant="p2-medium" className="text-foreground">
                  Необходимо создать пользовательское соглашение
                </Text>
                <Text variant="p2" tone="muted">
                  Чтобы пригласить пайщиков необходимо наличие пользовательского соглашения
                </Text>
                <Link href={paishikiHref} className="ds-btn ds-btn--l ds-btn--secondary mt-2">
                  <span className="ds-btn__label">Перейти в раздел Пайщики</span>
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
        <SectionCard title="Общие сведения" open={sectionOpen} onOpenChange={setSectionOpen} className="mt-6">
          {/* Контакты (слева) + Описание (справа) — textarea заканчивается на последнем инпуте */}
          <div className="grid gap-6 px-6 pt-6 lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col gap-6">
              {fields(domains, setDomains, "Домен")}
              <Button variant="tertiary" size="s" icon={<PlusIcon />} className="self-start" onClick={() => addOne(setDomains)}>
                Добавить домен
              </Button>

              {fields(emails, setEmails, "E-mail")}
              <Button variant="tertiary" size="s" icon={<PlusIcon />} className="self-start" onClick={() => addOne(setEmails)}>
                Добавить E-mail
              </Button>

              {fields(phones, setPhones, "Телефон")}
            </div>

            <Textarea
              label={description ? "Описание" : undefined}
              placeholder="Описание"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="lg:h-full lg:[&>label]:h-full lg:[&_.ds-field__main]:h-full lg:[&_textarea]:h-full"
            />
          </div>

          {/* «Добавить телефон» — ниже сетки, под левой колонкой */}
          <div className="px-6 pt-6 pb-6">
            <Button variant="tertiary" size="s" icon={<PlusIcon />} className="self-start" onClick={() => addOne(setPhones)}>
              Добавить телефон
            </Button>
          </div>

          {/* Устав */}
          <GroupHeading>Устав</GroupHeading>
          <div className="flex flex-wrap gap-x-6 gap-y-1 px-6 py-3.5">
            <span className="ds-caption w-[260px] shrink-0 text-foreground-subtle">Уставные документы</span>
            <DocThumb />
          </div>

          {/* Информация из устава (заполнено) */}
          <GroupHeading>Информация из устава</GroupHeading>
          <div className="flex flex-col gap-6 px-6 py-4">
            <div className="max-w-[406px]">
              <Combobox
                className="ds-field--locked"
                disabled
                placeholder="Выберите страну"
                value="ru"
                onValueChange={() => {}}
                options={[{ value: "ru", label: "🇷🇺 Россия" }]}
                aria-label="Страна"
              />
            </div>
            <div className="max-w-[406px]">
              <Combobox
                className="ds-field--locked"
                disabled
                placeholder="Выберите тип организации"
                value="coop"
                onValueChange={() => {}}
                options={[{ value: "coop", label: "Потребительский кооператив" }]}
                aria-label="Тип организации"
              />
            </div>
            <div className="max-w-[406px]">
              <Input size="l" defaultValue="Санкт-Петербург, Дегтярный переулок, 11 лит А" readOnly />
            </div>
            <div className="max-w-[747px]">
              <Combobox
                className="ds-field--locked"
                disabled
                placeholder="Напишите ОКВЭД или выберите из списка"
                onValueChange={() => {}}
                options={OKVED.map((o) => ({ value: o, label: o }))}
                aria-label="ОКВЭД"
              />
            </div>
            <div className="flex flex-col gap-2">
              {OKVED.map((o) => (
                <span key={o} className="ds-p3 text-foreground">{o}</span>
              ))}
            </div>
          </div>

          {/* Направление */}
          <GroupHeading>Направление</GroupHeading>
          <div className="px-6 py-4">
            <div className="max-w-[406px]">
              <Combobox
                className="ds-field--locked"
                disabled
                placeholder="Выбранное направление"
                value="ideo"
                onValueChange={() => {}}
                options={[{ value: "ideo", label: "Идеологическое" }]}
                aria-label="Направление"
              />
            </div>
          </div>
        </SectionCard>

          {saved ? (
            /* После сохранения — блок «Пользовательское соглашение» */
            <div className="mt-10 flex flex-col items-center gap-2 py-10 text-center">
              <Text variant="p2-medium" className="text-foreground">
                Необходимо создать пользовательское соглашение
              </Text>
              <Text variant="p2" tone="muted">
                Чтобы пригласить пайщиков необходимо наличие пользовательского соглашения
              </Text>
              <Link href={paishikiHref} className="ds-btn ds-btn--l ds-btn--secondary mt-2">
                <span className="ds-btn__label">Перейти в раздел Пайщики</span>
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex flex-wrap gap-4">
              <Button disabled={!ready} onClick={onSave}>
                Сохранить информацию
              </Button>
              <Button variant="negative-sec">Удалить компанию</Button>
            </div>
          )}
          </>
        )}
          </div>
        </main>
      </div>
    </div>
  );
}
