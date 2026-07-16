"use client";

/**
 * /ds — витрина DS Foundations MIDHUB.
 * Типографика реализована 1:1 из Figma «Стиль» / Типографика_web.
 * Интерактивная витрина (демки со state/handlers) → Client Component.
 */
import {
  Text,
  Button,
  Link,
  Checkbox,
  Radio,
  DeleteButton,
  Input,
  Textarea,
  Flag,
  Tabs,
  Tab,
  Toggle,
  ToggleButton,
  Incriment,
  Toast,
  Combobox,
  Accordion,
  TextBlock,
  TextList,
} from "@/components/ds";
import { ButtonDropdownDemos, IconDropdownDemos } from "./dropdown-demos";
import { TagSizesDemo, TagListDemo, TagInputDemos } from "./tag-demos";
import { BannerDemos } from "./banner-demos";
import { PaginationDemos } from "./pagination-demos";
import { DatepickerDemos } from "./datepicker-demos";
import { UploadDemos } from "./upload-demos";
import { SidemenuDemos } from "./sidemenu-demos";
import { LeftMenuDemos } from "./left-menu-demos";
import { ChatDemos } from "./chat-demos";
import { QuestionCardDemos } from "./question-card-demos";
import { ItemDemos } from "./item-demos";
import { ItemRolesDemos } from "./item-roles-demos";
import { SearchBarDemos } from "./search-bar-demos";
import { TableHeaderDemos } from "./table-header-demos";
import { ItemDataDemos } from "./item-data-demos";
import { BadgeDemos } from "./badge-demos";
import { FooterDemos } from "./footer-demos";
import { AccountCardDemos } from "./account-card-demos";
import { AchievementCardDemos } from "./achievement-card-demos";
import { IncrimentFieldDemos } from "./incriment-field-demos";
import { DomainCardDemos } from "./domain-card-demos";
import { DomainNotificationsDemos } from "./domain-notifications-demos";
import { HeaderDemos } from "./header-demos";
import { NavHubDemos } from "./nav-hub-demos";
import { WebResourceFilterDemos } from "./web-resource-filter-demos";
import { InviteDemos } from "./invite-demos";
import { InvitePhase2Demos } from "./invite-phase2-demos";
import { MembersDemos } from "./members-demos";
import { QuestionVoteDemos } from "./question-vote-demos";
import { DocumentPropsDemos } from "./document-props-demos";
import { TemplateDemos } from "./template-demos";
import { SidebarSettingDemos } from "./sidebar-setting-demos";
import { RequirementDemos } from "./requirement-demos";
import { VerificationTableDemos } from "./verification-table-demos";
import { DocumentSettingsDemos } from "./document-settings-demos";
import { LauncherDemos } from "./launcher-demos";
import { VotingDemos } from "./voting-demos";
import { ContractDemos } from "./contract-demos";
import { ValidationDemos } from "./validation-demos";
import { AccountEditDemos } from "./account-edit-demos";
import { PodschetDemos } from "./podschet-demos";
import { SelectPartDemos } from "./select-part-demos";
import { ConnectionDemos } from "./connection-demos";
import { ModalDemos } from "./modal-demos";
import { PPDemos } from "./pp-demos";
import { RequirementTemplateDemos } from "./requirement-template-demos";
import { RoleDemos } from "./role-demos";
import { StatisticsDemos } from "./statistics-demos";
import { PPSystemDemos } from "./pp-system-demos";
import { MissionDemos } from "./mission-demos";
import { DistributionDemos } from "./distribution-demos";
import { FeedDemos } from "./feed-demos";
import { WallpapersDemos } from "./wallpapers-demos";
import { ProfileDemos } from "./profile-demos";
import { OrgProfileDemos } from "./org-profile-demos";
import { LkDemos } from "./lk-demos";
import { TeamDemos } from "./team-demos";
import { PartnerDemos } from "./partner-demos";
import { ProcessedVerificationsDemos } from "./processed-verifications-demos";
import {
  Note,
  Quote,
  Overline,
  type TextVariant,
  type ButtonSize,
  type ButtonVariant,
  type LinkSize,
  type CheckboxSize,
  type RadioSize,
} from "@/components/ds";

type Row = {
  variant: TextVariant;
  name: string;
  sample: string;
  weight: number;
  size: number;
  lh: number;
  para: number;
};

const HEADINGS: Row[] = [
  { variant: "h1", name: "WEB / Heading / H1", sample: "Заголовок", weight: 500, size: 48, lh: 56, para: 28 },
  { variant: "h2", name: "WEB / Heading / H2", sample: "Заголовок", weight: 500, size: 40, lh: 48, para: 24 },
  { variant: "h3", name: "WEB / Heading / H3", sample: "Заголовок", weight: 500, size: 32, lh: 40, para: 20 },
  { variant: "h4", name: "WEB / Heading / H4", sample: "Заголовок", weight: 500, size: 24, lh: 32, para: 16 },
  { variant: "h5", name: "WEB / Heading / H5", sample: "Заголовок", weight: 500, size: 20, lh: 28, para: 14 },
];

const BODY: Row[] = [
  { variant: "p1", name: "WEB / Body / P1 — Regular", sample: "Текст идёт здесь, и это вторая строка", weight: 400, size: 18, lh: 26, para: 12 },
  { variant: "p1-medium", name: "WEB / Body / P1 — Medium", sample: "Текст идёт здесь, и это вторая строка", weight: 500, size: 18, lh: 26, para: 12 },
  { variant: "p2", name: "WEB / Body / P2 — Regular", sample: "Текст идёт сюда, и это вторая строка", weight: 400, size: 16, lh: 24, para: 12 },
  { variant: "p2-medium", name: "WEB / Body / P2 — Medium", sample: "Текст идёт сюда, и это вторая строка", weight: 500, size: 16, lh: 24, para: 12 },
  { variant: "p3", name: "WEB / Body / P3 — Regular", sample: "Текст идёт сюда, и это вторая строка", weight: 400, size: 14, lh: 22, para: 10 },
  { variant: "p3-medium", name: "WEB / Body / P3 — Medium", sample: "Текст идёт сюда, и это вторая строка", weight: 500, size: 14, lh: 22, para: 10 },
  { variant: "caption", name: "WEB / Body / Caption Regular", sample: "Текст идёт сюда, и это вторая строка", weight: 400, size: 12, lh: 20, para: 8 },
  { variant: "caption-medium", name: "WEB / Body / Caption Medium", sample: "Текст идёт сюда, и это вторая строка", weight: 500, size: 12, lh: 20, para: 8 },
  { variant: "caption-up", name: "WEB / Body / Caption Medium Up", sample: "Текст идёт сюда", weight: 500, size: 12, lh: 20, para: 8 },
];

const FULL = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const PALETTE: { name: string; key: string; steps: number[] }[] = [
  { name: "Blue-midhub (primary)", key: "blue-midhub", steps: FULL },
  { name: "Blue-ruswan", key: "blue-ruswan", steps: FULL },
  { name: "Grey", key: "grey", steps: [10, 20, 90, 100, 200, 300] },
  { name: "Red", key: "red", steps: FULL },
  { name: "Green", key: "green", steps: FULL },
  { name: "Orange", key: "orange", steps: FULL },
  { name: "Yellow", key: "yellow", steps: FULL },
  { name: "Cyan", key: "cyan", steps: [50, 100, 200, 300, 400, 600, 700, 800, 900] },
  { name: "Purple", key: "purple", steps: FULL },
];

const GRADIENTS = [
  ["Blue", "bg-gradient-blue"],
  ["Green", "bg-gradient-green"],
  ["Orange", "bg-gradient-orange"],
  ["Grey (fade)", "bg-gradient-grey"],
  ["Dark", "bg-gradient-dark"],
] as const;

const TEXT_COLORS = [
  ["Dark 900", "#242B32", "text-foreground"],
  ["Dark 800", "#5A646E", "text-foreground-muted"],
  ["Grey 300", "#93A3B4", "text-foreground-subtle"],
  ["Blue-midhub 500", "#3996FC", "text-primary"],
] as const;

/* ── Demo icons (только для витрины) ─────────────────────────── */
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const BTN_SIZES: { size: ButtonSize; label: string }[] = [
  { size: "l", label: "L-48" },
  { size: "m", label: "M-40" },
  { size: "s", label: "S-32" },
  { size: "xs", label: "XS-24" },
];

const BTN_VARIANTS: { variant: ButtonVariant; label: string }[] = [
  { variant: "primary", label: "Primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "ghost", label: "Ghost" },
  { variant: "tertiary", label: "Tertiary" },
  { variant: "negative", label: "Negative" },
  { variant: "negative-sec", label: "Negative sec" },
];

const LINK_SIZES: {
  size: LinkSize;
  label: string;
  external: string;
  internal: string;
}[] = [
  { size: "p1", label: "P1", external: "Внешняя ссылка", internal: "Внутренняя ссылка" },
  { size: "p2", label: "P2", external: "Внешняя ссылка", internal: "Внутренняя ссылка" },
  { size: "p3", label: "P3", external: "Внешняя ссылка", internal: "Внутренняя ссылка" },
  { size: "caption", label: "Caption", external: "Внешняя ссылка", internal: "Внутренняя ссылка" },
  { size: "caption-button", label: "Caption(button)", external: "Посетить сайт", internal: "Внутренняя ссылка" },
];

const CHECK_SIZES: { size: CheckboxSize; label: string }[] = [
  { size: "s", label: "S-32" },
  { size: "xs", label: "XS-24" },
  { size: "xxs", label: "XXS-16" },
];

const RADIO_SIZES: { size: RadioSize; label: string }[] = [
  { size: "s", label: "S-32" },
  { size: "xs", label: "XS-24" },
];

function ButtonRow({ variant, label }: { variant: ButtonVariant; label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Text variant="caption-up" tone="subtle">{label}</Text>
      <div className="flex flex-col gap-4 rounded-xl border border-border p-5">
        {BTN_SIZES.map(({ size, label: sizeLabel }) => (
          <div key={size} className="flex flex-wrap items-center gap-3">
            <span className="ds-caption-medium w-12 shrink-0 text-foreground-subtle">{sizeLabel}</span>
            <Button size={size} variant={variant}>Button</Button>
            <Button size={size} variant={variant} iconLeft={<IconPlus />}>Button</Button>
            <Button size={size} variant={variant} icon={<IconChevronLeft />} aria-label="Назад" />
            <Button size={size} variant={variant} iconRight={<IconChevronRight />}>Button</Button>
            <Button size={size} variant={variant} link>Link</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="flex flex-col gap-3">
      <Text variant="caption-up" tone="subtle">{title}</Text>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-muted">
              {["Name", "Example", "Weight", "Size", "Line", "Para"].map((h) => (
                <th key={h} className="ds-caption-medium px-4 py-2 text-left text-foreground-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.variant} className="border-t border-border align-middle">
                <td className="px-4 py-3"><Text variant="caption" tone="subtle">{r.name}</Text></td>
                <td className="px-4 py-3"><Text variant={r.variant}>{r.sample}</Text></td>
                <td className="px-4 py-3"><Text variant="caption" tone="muted">{r.weight}</Text></td>
                <td className="px-4 py-3"><Text variant="caption" tone="muted">{r.size}</Text></td>
                <td className="px-4 py-3"><Text variant="caption" tone="muted">{r.lh}</Text></td>
                <td className="px-4 py-3"><Text variant="caption" tone="muted">{r.para}</Text></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DsPage() {
  return (
    <main className="mx-auto flex max-w-[var(--container-max)] flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-2">
        <Text variant="caption-up" tone="subtle">MIDHUB · Design System</Text>
        <Text variant="h2">Типографика</Text>
        <Text variant="p2" tone="muted">
          Articulat CF · Regular 400 / Medium 500. Реализовано 1:1 из Figma.
        </Text>
      </header>

      {/* Кнопки */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Кнопки</Text>
          <Text variant="p3" tone="muted">
            Size (L-48 · M-40 · S-32 · XS-24) × Type × View. Состояния hover / active —
            наведи курсор; disabled и loader — ниже.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {BTN_VARIANTS.map(({ variant, label }) => (
            <ButtonRow key={variant} variant={variant} label={label} />
          ))}
        </div>

        {/* Состояния */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Состояния (M-40)</Text>
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border p-5">
            <div className="flex flex-col items-center gap-2">
              <Button size="m">Default</Button>
              <Text variant="caption" tone="subtle">default</Text>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button size="m" disabled>Disabled</Button>
              <Text variant="caption" tone="subtle">disabled</Text>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button size="m" loading>Loading</Button>
              <Text variant="caption" tone="subtle">loader</Text>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button size="m" variant="negative" loading>Loading</Button>
              <Text variant="caption" tone="subtle">loader · negative</Text>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button size="m" icon={<IconClose />} aria-label="Закрыть" />
              <Text variant="caption" tone="subtle">icon-only</Text>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button size="m" iconLeft={<IconPlus />} fullWidth>Full width</Button>
              <Text variant="caption" tone="subtle">fullWidth</Text>
            </div>
          </div>
        </div>
      </section>

      {/* Web-ссылки */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Web-ссылки</Text>
          <Text variant="p3" tone="muted">
            Size (P1 · P2 · P3 · Caption · Caption-button) × тип (External — иконка
            и новая вкладка · Internal). Наведи курсор — hover / active.
          </Text>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="w-32 px-5 py-3 text-left">
                  <Text variant="caption-up" tone="subtle">Size</Text>
                </th>
                <th className="px-5 py-3 text-left">
                  <Text variant="caption-up" tone="subtle">External</Text>
                </th>
                <th className="px-5 py-3 text-left">
                  <Text variant="caption-up" tone="subtle">Internal</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {LINK_SIZES.map(({ size, label, external, internal }) => (
                <tr key={size} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 align-middle">
                    <Text variant="p3" tone="muted">{label}</Text>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <Link href="https://midhub.app" size={size} external>{external}</Link>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <Link href="/ds" size={size}>{internal}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Чекбоксы */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Чекбоксы</Text>
          <Text variant="p3" tone="muted">
            Size (S-32 · XS-24 · XXS-16) × значение (unchecked / checked / indeterminate) ×
            состояние (hover / active / focus — интерактивно; disabled и error — ниже).
          </Text>
        </div>

        {/* Размеры × значения */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Размеры и значения</Text>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-muted">
                  {["Size", "Unchecked", "Checked", "Indeterminate", "С текстом"].map((h) => (
                    <th key={h} className="ds-caption-medium px-4 py-2 text-left text-foreground-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHECK_SIZES.map(({ size, label }) => (
                  <tr key={size} className="border-t border-border align-middle">
                    <td className="px-4 py-3"><Text variant="caption" tone="subtle">{label}</Text></td>
                    <td className="px-4 py-3"><Checkbox size={size} defaultChecked={false} /></td>
                    <td className="px-4 py-3"><Checkbox size={size} defaultChecked /></td>
                    <td className="px-4 py-3"><Checkbox size={size} indeterminate /></td>
                    <td className="px-4 py-3"><Checkbox size={size} defaultChecked label="Text" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Состояния (S-32) */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Состояния (S-32)</Text>
          <div className="flex flex-wrap items-start gap-x-8 gap-y-4 rounded-xl border border-border p-5">
            <Checkbox label="Default" />
            <Checkbox defaultChecked label="Checked" />
            <Checkbox indeterminate label="Indeterminate" />
            <Checkbox error label="Error" />
            <Checkbox disabled label="Disabled" />
            <Checkbox disabled defaultChecked label="Checked disabled" />
            <Checkbox disabled indeterminate label="Indeterminate disabled" />
          </div>
        </div>
      </section>

      {/* Радиокнопки */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Радиокнопки</Text>
          <Text variant="p3" tone="muted">
            Size (S-32 · XS-24) × значение (unchecked / selected) × состояние
            (hover / focus — интерактивно; disabled и error — ниже). Группировка по `name`.
          </Text>
        </div>

        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Размеры и значения</Text>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-muted">
                  {["Size", "Unchecked", "Selected", "С текстом"].map((h) => (
                    <th key={h} className="ds-caption-medium px-4 py-2 text-left text-foreground-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RADIO_SIZES.map(({ size, label }) => (
                  <tr key={size} className="border-t border-border align-middle">
                    <td className="px-4 py-3"><Text variant="caption" tone="subtle">{label}</Text></td>
                    <td className="px-4 py-3"><Radio size={size} name={`demo-${size}`} /></td>
                    <td className="px-4 py-3"><Radio size={size} name={`demo-${size}`} defaultChecked /></td>
                    <td className="px-4 py-3"><Radio size={size} name={`demo-txt-${size}`} defaultChecked label="Text" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Состояния (S-32)</Text>
          <div className="flex flex-wrap items-start gap-x-8 gap-y-4 rounded-xl border border-border p-5">
            <Radio name="st" label="Default" />
            <Radio name="st" defaultChecked label="Selected" />
            <Radio error label="Error" />
            <Radio disabled label="Disabled" />
            <Radio disabled defaultChecked label="Selected disabled" />
          </div>
        </div>
      </section>

      {/* Delete */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Delete</Text>
          <Text variant="p3" tone="muted">
            Контрол удаления: красная иконка-корзина с опциональной подписью. Размеры md (14) / sm (12).
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-5 rounded-xl border border-border p-5">
          <div className="flex flex-col items-start gap-2">
            <DeleteButton label="Удалить документ" />
            <Text variant="caption" tone="subtle">md · с текстом</Text>
          </div>
          <div className="flex flex-col items-start gap-2">
            <DeleteButton aria-label="Удалить" />
            <Text variant="caption" tone="subtle">md · иконка</Text>
          </div>
          <div className="flex flex-col items-start gap-2">
            <DeleteButton size="sm" label="Удалить" />
            <Text variant="caption" tone="subtle">sm · с текстом</Text>
          </div>
          <div className="flex flex-col items-start gap-2">
            <DeleteButton size="sm" aria-label="Удалить" />
            <Text variant="caption" tone="subtle">sm · иконка</Text>
          </div>
          <div className="flex flex-col items-start gap-2">
            <DeleteButton label="Удалить" disabled />
            <Text variant="caption" tone="subtle">disabled</Text>
          </div>
        </div>
      </section>

      {/* Инпуты */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Инпуты</Text>
          <Text variant="p3" tone="muted">
            Текстовое поле: Size (L-48 · M-40 · S-32 · XS-24) × состояние (hover / focus —
            интерактивно) × value (empty / filled / error). Плавающая подпись, иконки, caption.
          </Text>
        </div>

        {/* Размеры */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {([["l","L-48"],["m","M-40"],["s","S-32"],["xs","XS-24"]] as const).map(([sz, lbl]) => (
            <div key={sz} className="flex flex-col gap-3">
              <Text variant="caption-up" tone="subtle">{lbl}</Text>
              <Input size={sz} placeholder="Placeholder" />
              <Input size={sz} defaultValue="Значение" />
            </div>
          ))}
        </div>

        {/* Состояния и анатомия (L-48) */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Состояния и анатомия (L-48)</Text>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-xl border border-border p-5 md:grid-cols-2 lg:grid-cols-3">
            <Input label="E-mail" placeholder="you@mail.ru" caption="Не публикуется" />
            <Input leftIcon={<IconSearch />} placeholder="Поиск" />
            <Input rightIcon={<IconClose />} defaultValue="С иконкой справа" />
            <Input error defaultValue="Неверное значение" caption="Обязательное поле" />
            <Input readOnly defaultValue="Только чтение (locked)" />
            <Input disabled placeholder="Недоступно (disabled)" />
          </div>
        </div>

        {/* Textarea */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Textarea (многострочный, resize)</Text>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <Textarea label="Описание" placeholder="Введите текст…" caption="До 500 символов" />
            <Textarea size="m" defaultValue={"Многострочное значение,\nкоторое занимает\nнесколько строк."} />
            <Textarea error placeholder="С ошибкой" caption="Обязательное поле" />
            <Textarea readOnly defaultValue="Только чтение (locked)" />
          </div>
        </div>

        {/* Flag */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Flag (страна)</Text>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl border border-border p-5">
            <Flag code="ru" label="Россия" />
            <Flag code="us" label="США" />
            <Flag code="kz" label="Казахстан" />
            <Flag code="de" label="Германия" />
            <Flag code="fr" />
          </div>
        </div>
      </section>

      {/* Табы */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Табы</Text>
          <Text variant="p3" tone="muted">
            Вариант (Basic · Solid · Solid Light) × Size (S-32 · M-40 · L-48 · XL-56) ×
            состояние (active / hover). Кликни вкладку — состояние переключается.
          </Text>
        </div>

        {([
          ["basic", "Basic — подчёркивание"],
          ["solid", "Solid — заливка"],
          ["solid-light", "Solid Light — контур"],
        ] as const).map(([variant, title]) => (
          <div key={variant} className="flex flex-col gap-3">
            <Text variant="caption-up" tone="subtle">{title}</Text>
            <div className="flex flex-col items-start gap-5 rounded-xl border border-border p-5">
              {([["s","S-32"],["m","M-40"],["l","L-48"],["xl","XL-56"]] as const).map(([size, sl]) => (
                <div key={size} className="flex items-center gap-4">
                  <span className="ds-caption-medium w-12 shrink-0 text-foreground-subtle">{sl}</span>
                  <Tabs variant={variant} size={size} defaultValue="one" aria-label={`${title} ${sl}`}>
                    <Tab value="one">Item one</Tab>
                    <Tab value="two">Item two</Tab>
                    <Tab value="three">Item three</Tab>
                  </Tabs>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Sidemenu (композит) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Sidemenu</Text>
          <Text variant="p3" tone="muted">
            Композит: вертикальный список выбираемых чипов (Tabs midhub S-32).
            Variant — color (цветные номер-бейджи) · label (текстовые). Кликни
            пункт — активное состояние переключается.
          </Text>
        </div>
        <SidemenuDemos />
      </section>

      {/* LeftMenu (композит — левое меню / сайдбар) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">LeftMenu</Text>
          <Text variant="p3" tone="muted">
            Композит: двухколоночный сайдбар. Рейка 60px (лого/КП + цветные
            номер-бейджи рабочих пространств) + раскрытая панель ~160px
            (профиль-карточка, кнопки, навигация, футер). Кликни бейдж/пункт —
            активное состояние переключается.
          </Text>
        </div>
        <LeftMenuDemos />
      </section>

      {/* Chat (композит — чат) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Chat</Text>
          <Text variant="p3" tone="muted">
            Композит: окно чата (ChatWindow) — верхняя панель, лента пузырей
            (ChatBubble: входящие/исходящие, аватар, время, отправитель), поле
            ввода (MessageComposer) и пустое состояние. Плюс ChatTopBar,
            ChatSheetHeader, ContactCard, ContactChip. Чат-лист — Tabs + Item.
          </Text>
        </div>
        <ChatDemos />
      </section>

      {/* QuestionCard (композит) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">QuestionCard</Text>
          <Text variant="p3" tone="muted">
            Композит: бордерная карточка-аккордеон вопроса. Size — L (шапка 66) ·
            S (компакт 44). Статус-иконка — lock / share. Кликни шапку — карточка
            раскрывается.
          </Text>
        </div>
        <QuestionCardDemos />
      </section>

      {/* Item (строка списка) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Item</Text>
          <Text variant="p3" tone="muted">
            Строка списка: слоты leading · content · trailing. Size — L (66) · M
            (56) · S (48) · XS (компакт). Tone — default / muted (фон). Колонки,
            ссылки, дата, статус, чекбокс, удаление, роль — композиция внутри.
          </Text>
        </div>
        <ItemDemos />

        <Text variant="caption-up" tone="subtle">Item · роли (Role / статус / кнопка)</Text>
        <ItemRolesDemos />

        <Text variant="caption-up" tone="subtle">Item · данные (документы / транзакции / ОКВЭД)</Text>
        <ItemDataDemos />
      </section>

      {/* Badge (статус-бейдж) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Badge</Text>
          <Text variant="p3" tone="muted">
            Статус-бейдж / пилюля. Variant — soft (фон color-50, текст color-400) ·
            solid (фон color-200, текст white). Цвета — green / orange / red / blue /
            cyan / yellow / purple / grey.
          </Text>
        </div>
        <BadgeDemos />
      </section>

      {/* Footer (панель действий) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Footer</Text>
          <Text variant="p3" tone="muted">
            Композит: панель действий (фон grey-20, рамка grey-90). Кнопки L-48 /
            M-40 / S-32 справа; attached — футер карточки со ссылкой слева.
          </Text>
        </div>
        <FooterDemos />
      </section>

      {/* AccountCard (карточка счёта) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">AccountCard</Text>
          <Text variant="p3" tone="muted">
            Композит: карточка счёта — баланс с двумя кнопками, панель характеристик
            (заголовок + крестик, строки label/value, парная строка с разделителем) и
            футер «Редактировать…».
          </Text>
        </div>
        <AccountCardDemos />
      </section>

      {/* AchievementCard (карточка достижения) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">AchievementCard</Text>
          <Text variant="p3" tone="muted">
            Композит: карточка достижения — аватар 82 + заголовок (Medium 14/22) и
            описание (Regular 12/20).
          </Text>
        </div>
        <AchievementCardDemos />
      </section>

      {/* IncrimentField (подпись + степпер) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">IncrimentField</Text>
          <Text variant="p3" tone="muted">
            Композит: бордерная строка — подпись (Medium) + DS Incriment. Size — L
            (16/24 · 48) · M (14/22 · 40) · S (12/20 · 32).
          </Text>
        </div>
        <IncrimentFieldDemos />
      </section>

      {/* DomainCard (карточка домена) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">DomainCard</Text>
          <Text variant="p3" tone="muted">
            Композит: карточка домена — иконка (папка в сером круге 32) + заголовок
            (Medium 14/22) и статистика (Regular 14/22). Вид «мой» (mine) — синяя
            палитра с шестерёнкой настроек. Hover меняет фон и рамку.
          </Text>
        </div>
        <DomainCardDemos />
      </section>

      {/* DomainNotifications (панель уведомлений домена) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">DomainNotifications</Text>
          <Text variant="p3" tone="muted">
            Композит: панель уведомлений (grey-10) с прилипающей шапкой (white,
            нижняя рамка + тень) и центрированным заголовком (Medium 14/22). Тело
            прокручивается, принимает строки через children; пусто → empty state.
          </Text>
        </div>
        <DomainNotificationsDemos />
      </section>

      {/* Header (шапка приложения) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Header</Text>
          <Text variant="p3" tone="muted">
            Композит: верхняя шапка (white, h60, нижняя рамка). Три зоны — слева
            лого + вордмарк / кнопка «назад» / инструменты (HeaderIconButton),
            по центру навигация, справа чат и выход. Три варианта: «пространства»,
            «бренд», «минимальный». Иконки и лого — 1:1 из Figma.
          </Text>
        </div>
        <HeaderDemos />
      </section>

      {/* NavHub (навигационный хаб / карта переходов) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">NavHub</Text>
          <Text variant="p3" tone="muted">
            Композит-каркас навигационных хаб-экранов: NavHubPage (back-кнопка +
            центрированный H1 + адаптивный контейнер 1200px), NavHubCard
            (sunken-панель grey-10, rounded-16), NavHubLinkList (маркированный
            список подчёркнутых ссылок), NavHubChoiceCard (кликабельная карточка
            выбора + «Продолжить» + декор). Собран из DS — Text, Button, Link,
            HeaderArrowLeftIcon. Экраны: Navigation, Компания не создана,
            Компания создана.
          </Text>
        </div>
        <NavHubDemos />
      </section>

      {/* WebResourceFilter (фильтр веб-ресурса) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">WebResourceFilter</Text>
          <Text variant="p3" tone="muted">
            Композит: карточка фильтра (white, рамка, тень). Собран из DS —
            Combobox (сохранённые фильтры, возраст), Input (идентификатор, слово),
            Radio (пол), Button (Создать фильтр — tertiary link · Поиск — primary).
            Кнопки футера активны при заданном критерии. Варианты: пусто,
            заполнено, ручной фильтр (выбор сохранённого отключён).
          </Text>
        </div>
        <WebResourceFilterDemos />
      </section>

      {/* Приглашение партнёра и пайщика */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Приглашение партнёра и пайщика</Text>
          <Text variant="p3" tone="muted">
            Композиты фичи: SectionHeader (заголовок+CTA), WalletField (поле пайщика),
            MemberCard (раскрывающаяся карточка пайщика с паспортными данными и
            статусом). Собраны из Text / Input / Button.
          </Text>
        </div>
        <InviteDemos />

        <Text variant="caption-up" tone="subtle">Фаза 2 — VerificationCard · Toolbar · FilterBar · InviteForm</Text>
        <InvitePhase2Demos />
      </section>

      {/* Управление пайщиками — экран-композиция (без новых компонентов) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Управление пайщиками</Text>
          <Text variant="p3" tone="muted">
            Экран целиком из существующих компонентов (новых не создавалось):
            SectionHeader · Tabs · SearchBar · Dropdown · Button · Toolbar ·
            Pagination · TableHeader · Item · Checkbox · Link.
          </Text>
        </div>
        <MembersDemos />
      </section>

      {/* Вопрос (голосование) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Вопрос (голосование)</Text>
          <Text variant="p3" tone="muted">
            Просмотр параметров вопроса — через MemberCard (раскрывающаяся карточка
            label/value). Редактирование — QuestionForm (Input · Textarea · числовые
            поля со степпером · Тип роли · Да/Нет).
          </Text>
        </div>
        <QuestionVoteDemos />
      </section>

      {/* Свойства документа */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Свойства документа</Text>
          <Text variant="p3" tone="muted">
            Просмотр — MemberCard (label/value). Редактирование — PropertyForm
            (универсальная форма свойств: поля text / number / select / textarea).
          </Text>
        </div>
        <DocumentPropsDemos />
      </section>

      {/* Шаблон документа (конструктор) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Шаблон документа</Text>
          <Text variant="p3" tone="muted">
            Конструктор шаблона собран из DS: Panel (секция с шапкой и «+ Добавить»),
            QuestionCard (поля/требования), Badge (статусы), Textarea, PropertyForm.
          </Text>
        </div>
        <TemplateDemos />
      </section>

      {/* Right sidebar setting (Верификации) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Right sidebar setting</Text>
          <Text variant="p3" tone="muted">
            Панель настроек сайдбара: SidebarPanel (заголовок + крестик + футер) +
            SettingRow (бокс-иконка/цвет + заголовок + Toggle/Checkbox + мета). На примере
            «Верификации».
          </Text>
        </div>
        <SidebarSettingDemos />
      </section>

      {/* Требования */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Требования</Text>
          <Text variant="p3" tone="muted">
            Просмотр — MemberCard + Badge. Редактирование — RequirementForm (Input ·
            select · Textarea · Radio+Badge · CheckMatrix (матрица чекбоксов) · документы ·
            кнопки). CheckMatrix — новый переиспользуемый компонент.
          </Text>
        </div>
        <RequirementDemos />
      </section>

      {/* Таблица верификации */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Таблица верификации</Text>
          <Text variant="p3" tone="muted">
            VerificationTable — страна × уровень верификации: двухуровневая шапка
            (группы Локальная/Международная над бейджами Жёлтая/Зелёная), строки со
            странами (Flag) и чекбоксами, итоговая строка «Всего». На узких экранах
            скроллится по горизонтали. Reuse: Checkbox · Flag · Badge.
          </Text>
        </div>
        <VerificationTableDemos />
      </section>

      {/* Типы настроек / документы */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Типы настроек (документы)</Text>
          <Text variant="p3" tone="muted">
            DocumentSettings — выбор «Общая/Персональная настройка»: чекбоксы
            идентификации + по странам аккордеоны (категории → документы с ценами
            Межд./Лок.). Прогрессивное авто-раскрытие и подсчёт цены. Reuse: Radio ·
            Checkbox · Accordion · Flag.
          </Text>
        </div>
        <DocumentSettingsDemos />
      </section>

      {/* Launcher (авторизация / выбор организации) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Launcher</Text>
          <Text variant="p3" tone="muted">
            Карточки-лаунчеры: LauncherCard (центр. заголовок+подзаголовок + футер) +
            LabeledDivider («Или» / «Кооперативы»). Реюз Input · Button · Item (строки
            организаций). Авторизация (QR) и выбор организации.
          </Text>
        </div>
        <LauncherDemos />
      </section>

      {/* Голосование */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Голосование</Text>
          <Text variant="p3" tone="muted">
            Карточка голосования (QuestionCard + ProgressRing-донат + За/Против) и история
            транзакций (TableHeader + строки-голоса Item). ProgressRing — новый компонент.
          </Text>
        </div>
        <VotingDemos />
      </section>

      {/* Создание договора */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Создание договора</Text>
          <Text variant="p3" tone="muted">
            Просмотр (MemberCard+Badge), редактирование (PropertyForm), участники + чат
            (QuestionCard + MessageComposer), транзакции в блокчейне (TableHeader + Item).
            MessageComposer — новый компонент.
          </Text>
        </div>
        <ContractDemos />
      </section>

      {/* Документ на валидацию */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Документ на валидацию</Text>
          <Text variant="p3" tone="muted">
            Полностью из готовых DS-компонентов: секции — MemberCard (label/value),
            вопросы/документы — QuestionCard + Item, статусы — Badge. Новых компонентов нет.
          </Text>
        </div>
        <ValidationDemos />
      </section>

      {/* Редактирование счёта */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Редактирование счёта</Text>
          <Text variant="p3" tone="muted">
            Распределение средств: IncrimentField (Целевой счёт) + DistributionRow (счета
            токенов: Incriment % + чекбоксы) + ProgressRing (Буферная область).
            DistributionRow — новый компонент.
          </Text>
        </div>
        <AccountEditDemos />
      </section>

      {/* Создание подсчёта */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Создание подсчёта</Text>
          <Text variant="p3" tone="muted">
            Целиком из готовых DS: форма (Input · Radio · select · Textarea · IncrimentField)
            + правая панель (ProgressRing + Checkbox); просмотр — MemberCard. Новых компонентов нет.
          </Text>
        </div>
        <PodschetDemos />
      </section>

      {/* Select part (выбор верификации / подключения) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Select part — выбор</Text>
          <Text variant="p3" tone="muted">
            Промо-карточка (иконка + заголовок + кнопка) и карточки выбора верификации:
            SelectOption (заголовок + описание + цветная «Выбрать»). SelectOption — новый компонент.
          </Text>
        </div>
        <SelectPartDemos />
      </section>

      {/* Подключение пайщиков */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Подключение пайщиков</Text>
          <Text variant="p3" tone="muted">
            Массовое/персональное · разовое/стабильное — целиком из готовых DS: Tabs +
            TableHeader + Item + Pagination (выбор участников), IncrimentField + ProgressRing
            + Checkbox + Input (платёж). Новых компонентов нет.
          </Text>
        </div>
        <ConnectionDemos />
      </section>

      {/* Modal (попапы) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Modal (попапы)</Text>
          <Text variant="p3" tone="muted">
            Модальное окно: оверлей + карточка (заголовок + крестик + тело + футер кнопок),
            закрытие по крестику/оверлею/Escape. Кликни кнопку — откроется попап. Контент —
            reuse Button / Badge / Checkbox / Item.
          </Text>
        </div>
        <ModalDemos />
      </section>

      {/* ПП (производственная программа) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">ПП</Text>
          <Text variant="p3" tone="muted">
            Пустые состояния (EmptyState — новый), согласие/локализации (Panel + Flag +
            Button), просмотр (MemberCard + Badge). Остальные экраны ПП — таблицы и
            вложенные секции — из готовых DS (TableHeader/Item/QuestionCard).
          </Text>
        </div>
        <PPDemos />
      </section>

      {/* Требование (шаблон) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Требование (шаблон)</Text>
          <Text variant="p3" tone="muted">
            Полная карточка требования валидатора: QuestionCard + Badge (Жёлтый/Зелёный) +
            Описание/Тип верификации + документы (Item) + Выдано/Использование/Стоимость.
            Целиком из готовых DS.
          </Text>
        </div>
        <RequirementTemplateDemos />
      </section>

      {/* Создание роли / Готовая роль */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Создание роли</Text>
          <Text variant="p3" tone="muted">
            Форма роли (RoleForm — новый композит): Input (название) + Textarea
            (должностные обязанности) + Button «Добавить требования». Карточки требований —
            QuestionCard + Badge + Item (паттерн requirement-template). Режим «view» —
            готовая роль read-only (описание карточкой, без кнопки).
          </Text>
        </div>
        <RoleDemos />
      </section>

      {/* Статистика — Отчётность и Партнёры */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Статистика (Отчётность · Партнёры)</Text>
          <Text variant="p3" tone="muted">
            Секции дашбордов: ReportPeriodBar, StatSummary, Tabs, LineChart,
            TransactionsTable (цветные коды), AccountCharacteristics (QuestionCard),
            IncomeSources, ArticlesTable (+ Итого), ReportFooter. Новые композиты на
            базе DS (TableHeader · Badge · Combobox · Button · Link · QuestionCard).
          </Text>
        </div>
        <StatisticsDemos />
      </section>

      {/* ПП система — форма регистрации */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">ПП система (форма регистрации)</Text>
          <Text variant="p3" tone="muted">
            4-колоночная форма ПП (Страны · Характеристики · Основания · Документы):
            RegistrationForm + BasisCard + BasisEditor (новые) на базе Flag · Button ·
            EmptyState · Combobox · Textarea · Checkbox. Режимы edit/view покрывают
            варианты Формы регистрации, оснований, документов и complete.
          </Text>
        </div>
        <PPSystemDemos />
      </section>

      {/* Миссия / Структура кооператива */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Миссия (структура кооператива)</Text>
          <Text variant="p3" tone="muted">
            InfoCard (задание/новость) · ProfileCard (департаменты, цветной хедер) ·
            CKPCard (ЦКП) · OrgColumns (Отдел → Секция → Функция → Технология) — новые
            композиты. Reuse: Tabs (Структура/План/Обучение), QuestionCard (департамент),
            Button, Link.
          </Text>
        </div>
        <MissionDemos />
      </section>

      {/* Distribution (распределение ролей) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Distribution</Text>
          <Text variant="p3" tone="muted">
            Распределение ролей по %: IncrimentField (роль + имя + [+ % −]) + DeleteButton +
            «Добавить роль» + ProgressRing (буферная область). Целиком из готовых DS.
          </Text>
        </div>
        <DistributionDemos />
      </section>

      {/* Лента (Add feed + Posts) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Лента</Text>
          <Text variant="p3" tone="muted">
            Создание поста — FeedComposerBar (свёрнутая строка: аватар + поле + кнопки) и
            FeedComposer (редактор с табами Статья / Публикация / Документ). Посты — FeedPost
            (шапка с датой и kebab + текст + медиа: фото / видео / галерея «+N» / документы).
            Новые композиты на базе DS (Tabs · Input · Textarea · UploadV2 · Button).
          </Text>
        </div>
        <FeedDemos />
      </section>

      {/* Обои (walls) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Обои</Text>
          <Text variant="p3" tone="muted">
            Обои-обложки из Figma «walls» (12 шт.: 11 изображений + градиент). WallpaperPicker —
            выбор из сетки (выделение кольцом + галочка), WallpaperTile — одна плитка (картинка или
            CSS-градиент), WALLPAPERS — реестр. Пропорция 1279:494. Reuse токены DS, новых атомов нет.
          </Text>
        </div>
        <WallpapersDemos />
      </section>

      {/* Профиль пользователя */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Профиль</Text>
          <Text variant="p3" tone="muted">
            ProfileHeader (обложка + аватар + имя/роль + «Поделиться» + табы Информация/Лента),
            раскрывающиеся секции SectionCard: ProfileInfoCard («Общие сведения» — описание +
            label/value), RequirementsCard (строки+бейдж / пусто / настройка), AchievementsCard
            (лого+текст / пусто), RoleHistoryCard (таймлайн). Лента — reuse FeedComposerBar +
            FeedPost. Развитие/Обучение — Tabs + InfoCard. Атомы из DS.
          </Text>
        </div>
        <ProfileDemos />
      </section>

      {/* Профиль кооператива (организации) + Статистика */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Профиль кооператива</Text>
          <Text variant="p3" tone="muted">
            Вариант ProfileHeader для организации: обложка-градиент + текст-аватар. Секции —
            ProfileInfoCard (устав/ОКВЭД), RequirementsCard, AchievementsCard. Статистика —
            новые графики BarChart (Пол/Возраст), DonutChart (Девайсы), GeoBars (Гео,
            Страны/Города). Лента — FeedComposerBar + FeedPost.
          </Text>
        </div>
        <OrgProfileDemos />
      </section>

      {/* Лицевой счёт */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Лицевой счёт</Text>
          <Text variant="p3" tone="muted">
            Экран целиком из готовых DS: AccountCard (баланс + Реквизиты/Перевод), Tabs
            (Взаиморасчеты / Документооборот / Артефакты), TransactionsTable, TableHeader +
            строки + Badge, Combobox + Button. Новых компонентов нет.
          </Text>
        </div>
        <LkDemos />
      </section>

      {/* Коллектив подразделения + Профиль подразделения */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Коллектив подразделения</Text>
          <Text variant="p3" tone="muted">
            CKPCard (подразделение: лого + «20 пайщиков») + TeamMemberCard (новый): фото +
            статус-бейдж (Активный/Принятие токена/Неактивный) + имя/роль + пустое состояние
            «Нет пайщика». Профиль подразделения — ProfileHeader (cover-нода + «Подписаться»)
            + Banner вступления + секции.
          </Text>
        </div>
        <TeamDemos />
      </section>

      {/* RoleLegend + PartnerCard */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">RoleLegend · PartnerCard</Text>
          <Text variant="p3" tone="muted">
            RoleLegend (новый) — карточка-легенда цветовой кодировки ролей: точка-токен
            (red/orange/yellow/green) + подпись; вариант plain для встраивания. PartnerCard
            (новый) — горизонтальная промо-карточка партнёра-пайщика: плитка-аватар + заголовок/
            описание + «Выбрать пайщика» (primary) и «Подробнее» (link).
          </Text>
        </div>
        <PartnerDemos />
      </section>

      {/* Обработанные заявки (верификации) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Обработанные заявки</Text>
          <Text variant="p3" tone="muted">
            StatCounter (новый: крупный нейтральный счётчик «Кол-во» + цветные мини —
            yellow/green/blue, единый компонент через tone/size) + DocumentRow (новый:
            точка-статус + № / наименование · ссылка транзакции · дата). Экран собран из DS:
            Tabs (XL-56 solid-light) · ReportPeriodBar (без истории, по центру) · TableHeader
            (s/muted, сортировка).
          </Text>
        </div>
        <ProcessedVerificationsDemos />
      </section>

      {/* SearchBar (композит) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">SearchBar</Text>
          <Text variant="p3" tone="muted">
            Композит: поисковый Input (иконка-лупа) + слот действий (ghost-кнопки
            фильтров). Поле растягивается, кнопки прижаты вправо.
          </Text>
        </div>
        <SearchBarDemos />
      </section>

      {/* TableHeader (навигация) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">TableHeader</Text>
          <Text variant="p3" tone="muted">
            Шапка таблицы (навигация): колонки (`dark-800` 12/20) + стрелка
            сортировки. Tone — default / muted. Опц. чекбокс «выбрать всё». Size —
            S (30) · M (46). Кликни сортируемую колонку.
          </Text>
        </div>
        <TableHeaderDemos />
      </section>

      {/* Тогглы */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Тогглы</Text>
          <Text variant="p3" tone="muted">
            Переключатель (switch): Size (S-32 · XS-24) × off / on × состояние
            (hover / focus — интерактивно; disabled — ниже).
          </Text>
        </div>

        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Размеры и значения</Text>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-muted">
                  {["Size", "Off", "On", "С текстом"].map((h) => (
                    <th key={h} className="ds-caption-medium px-4 py-2 text-left text-foreground-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([["s","S-32"],["xs","XS-24"]] as const).map(([size, lbl]) => (
                  <tr key={size} className="border-t border-border align-middle">
                    <td className="px-4 py-3"><Text variant="caption" tone="subtle">{lbl}</Text></td>
                    <td className="px-4 py-3"><Toggle size={size} /></td>
                    <td className="px-4 py-3"><Toggle size={size} defaultChecked /></td>
                    <td className="px-4 py-3"><Toggle size={size} defaultChecked label="Уведомления" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Состояния switch (S-32)</Text>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl border border-border p-5">
            <div className="flex flex-col items-center gap-2"><Toggle /><Text variant="caption" tone="subtle">off</Text></div>
            <div className="flex flex-col items-center gap-2"><Toggle defaultChecked /><Text variant="caption" tone="subtle">on</Text></div>
            <div className="flex flex-col items-center gap-2"><Toggle disabled /><Text variant="caption" tone="subtle">off disabled</Text></div>
            <div className="flex flex-col items-center gap-2"><Toggle disabled defaultChecked /><Text variant="caption" tone="subtle">on disabled</Text></div>
          </div>
        </div>

        {/* Toggle-кнопки (Ghost / Solid light / Mode) */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Toggle-кнопки — off / selected (кликни)</Text>
          <div className="flex flex-col gap-5 rounded-xl border border-border p-5">
            {([
              ["ghost", "Ghost", ["l","m","s"]],
              ["solid-light", "Solid light", ["xl","l"]],
              ["mode", "Mode", ["s"]],
            ] as const).map(([variant, label, sizes]) => (
              <div key={variant} className="flex flex-wrap items-center gap-4">
                <span className="ds-caption-medium w-24 shrink-0 text-foreground-subtle">{label}</span>
                {sizes.map((sz) => (
                  <ToggleButton key={`${variant}-${sz}`} variant={variant} size={sz}>Button</ToggleButton>
                ))}
                {sizes.map((sz) => (
                  <ToggleButton key={`${variant}-${sz}-on`} variant={variant} size={sz} defaultPressed>Button</ToggleButton>
                ))}
                <ToggleButton variant={variant} size={sizes[0]} disabled>Button</ToggleButton>
                <ToggleButton variant={variant} size={sizes[0]} disabled defaultPressed>Button</ToggleButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incriment (степпер) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Incriment</Text>
          <Text variant="p3" tone="muted">
            Числовой степпер «+ / значение / −». Size (L-48 · M-40 · S-32). Кликни
            «+» / «−» — значение меняется на шаг. Кнопки гаснут на границах.
          </Text>
        </div>

        <div className="flex flex-wrap items-end gap-x-8 gap-y-6 rounded-xl border border-border p-5">
          {([["l","L-48"],["m","M-40"],["s","S-32"]] as const).map(([sz, lbl]) => (
            <div key={sz} className="flex flex-col items-center gap-2">
              <Text variant="caption-up" tone="subtle">{lbl}</Text>
              <Incriment size={sz} defaultValue={20} step={5} min={0} max={100} />
            </div>
          ))}
          <div className="flex flex-col items-center gap-2">
            <Text variant="caption-up" tone="subtle">disabled</Text>
            <Incriment size="l" defaultValue={0} disabled />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Text variant="caption-up" tone="subtle">без единицы</Text>
            <Incriment size="m" defaultValue={1} suffix="" />
          </div>
        </div>
      </section>

      {/* Combobox */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Combobox</Text>
          <Text variant="p3" tone="muted">
            Выпадающий список (база — Input + шеврон). Size (L-48 · M-40 · S-32) ×
            состояние (hover / active-открыт / disabled / error). Кликни — раскроется список.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-xl border border-border p-5 md:grid-cols-2 lg:grid-cols-3">
          {([["l","L-48"],["m","M-40"],["s","S-32"]] as const).map(([sz, lbl]) => (
            <div key={sz} className="flex flex-col gap-2">
              <Text variant="caption-up" tone="subtle">{lbl}</Text>
              <Combobox
                size={sz}
                label="Город"
                placeholder="Выберите город"
                options={[
                  { value: "msk", label: "Москва" },
                  { value: "spb", label: "Санкт-Петербург" },
                  { value: "nsk", label: "Новосибирск" },
                  { value: "ekb", label: "Екатеринбург", disabled: true },
                  { value: "kzn", label: "Казань" },
                ]}
              />
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <Text variant="caption-up" tone="subtle">С иконкой + значение</Text>
            <Combobox
              leftIcon={<IconSearch />}
              defaultValue="spb"
              caption="Можно искать по названию"
              options={[
                { value: "msk", label: "Москва" },
                { value: "spb", label: "Санкт-Петербург" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="caption-up" tone="subtle">Error</Text>
            <Combobox error caption="Обязательное поле" placeholder="Не выбрано" options={[{ value: "a", label: "Вариант A" }]} />
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="caption-up" tone="subtle">Disabled</Text>
            <Combobox disabled placeholder="Недоступно" options={[{ value: "a", label: "Вариант A" }]} />
          </div>
        </div>
      </section>

      {/* Datepicker / Calendar */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Datepicker · Calendar</Text>
          <Text variant="p3" tone="muted">
            Поле выбора даты (база — Input + иконка-календарь), по клику — попап
            с календарём. Режимы: одна дата / диапазон. Size (L-48 · M-40 · S-32).
            В шапке календаря клик по месяцу/году открывает выбор.
          </Text>
        </div>
        <div className="rounded-xl border border-border p-5">
          <DatepickerDemos />
        </div>
      </section>

      {/* Dropdown */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Dropdown</Text>
          <Text variant="p3" tone="muted">
            Меню с разными триггерами: Basic (поле — см. Combobox), Button (кнопка + шеврон),
            Icon (иконка-кнопка), Accordion (раскрытие панели). Кликни — раскроется.
          </Text>
        </div>

        <div className="flex flex-wrap items-start gap-x-10 gap-y-6 rounded-xl border border-border p-5">
          {/* Button trigger */}
          <div className="flex flex-col items-start gap-2">
            <Text variant="caption-up" tone="subtle">Button</Text>
            <ButtonDropdownDemos />
          </div>

          {/* Icon trigger */}
          <div className="flex flex-col items-start gap-2">
            <Text variant="caption-up" tone="subtle">Icon</Text>
            <IconDropdownDemos />
          </div>

          {/* Accordion */}
          <div className="flex w-full max-w-md flex-col gap-3">
            <Text variant="caption-up" tone="subtle">Accordion</Text>
            <Accordion title="Что входит в тариф?" defaultOpen>
              <Text variant="p3" tone="muted">
                Доступ ко всем урокам, заданиям и проверкам внутри Telegram. Обновления методики — бесплатно.
              </Text>
            </Accordion>
            <Accordion title="Можно ли вернуть деньги?" size="m">
              <Text variant="p3" tone="muted">Да, в течение 14 дней с момента покупки.</Text>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Теги</Text>
          <Text variant="p3" tone="muted">
            Чип (Tag) — фон grey-20, текст dark-900, крестик grey-300; «+» (AddTag) — синий.
            Размеры l/m/s. Поле TagInput — ввод тегов (Enter / запятая добавляют, Backspace удаляет).
          </Text>
        </div>

        {/* Статичные чипы — размеры */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Tag · размеры</Text>
          <div className="rounded-xl border border-border p-5">
            <TagSizesDemo />
          </div>
        </div>

        {/* Интерактивный список чипов */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">Список чипов (удаление / добавление)</Text>
          <div className="rounded-xl border border-border p-5">
            <TagListDemo />
          </div>
        </div>

        {/* TagInput */}
        <div className="flex flex-col gap-3">
          <Text variant="caption-up" tone="subtle">TagInput — поле ввода тегов</Text>
          <div className="rounded-xl border border-border p-5">
            <TagInputDemos />
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Banner</Text>
          <Text variant="p3" tone="muted">
            Информационный баннер: иконка (32) + заголовок (P2-Medium) + описание (P3) + кнопка.
            Тон задаёт фон / рамку / цвет иконки / заливку кнопки: info · neutral · warning ·
            caution · danger · note. Ширина — 100% контейнера (Large/Small = ширина обёртки).
          </Text>
        </div>
        <div className="rounded-xl border border-border p-5">
          <BannerDemos />
        </div>
      </section>

      {/* Upload */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Upload</Text>
          <Text variant="p3" tone="muted">
            Прикрепление документов. v1 — компактная плитка 84×84 (default · error ·
            disabled · loading · превью · «+N»). v2 — широкая drop-зона (default ·
            error · disabled) + строка файла UploadFile (готово / загрузка с прогрессом).
          </Text>
        </div>
        <UploadDemos />
      </section>

      {/* Шрифт */}
      <section className="flex flex-col gap-4">
        <Text variant="h4">Семейство шрифтов</Text>
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
          <div>
            <Text variant="caption-up" tone="subtle">Regular 400</Text>
            <Text variant="p1" className="mt-1">
              1234567890 АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЬьЫыЭэЮюЯя
            </Text>
          </div>
          <div>
            <Text variant="caption-up" tone="subtle">Medium 500</Text>
            <Text variant="p1-medium" className="mt-1">
              1234567890 АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЬьЫыЭэЮюЯя
            </Text>
          </div>
          <Text variant="caption" tone="subtle">
            Articulat CF Medium (вес 500) с полной кириллицей — подключён.
          </Text>
        </div>
      </section>

      {/* Стили */}
      <section className="flex flex-col gap-6">
        <Text variant="h4">Стили текста</Text>
        <TypeTable title="Headings" rows={HEADINGS} />
        <TypeTable title="Body & Caption" rows={BODY} />
      </section>

      {/* Примеры использования */}
      <section className="flex flex-col gap-6">
        <Text variant="h4">Примеры использования</Text>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Заголовок + тело */}
          <div className="flex flex-col gap-3 rounded-xl border border-border p-6">
            <Text variant="caption-up" tone="subtle">Заголовок + тело (H5 / P2)</Text>
            <TextBlock title="Заголовок" titleVariant="h5" gap={8}>
              <Text variant="p2" tone="muted">
                Для наилучшей читабельности длина строки должна быть между 40 и 80
                символами, включая пробелы. Слишком короткая строка усложняет чтение.
              </Text>
            </TextBlock>
          </div>

          {/* Маркированный список */}
          <div className="flex flex-col gap-3 rounded-xl border border-border p-6">
            <Text variant="caption-up" tone="subtle">Обобщающий текст + список (•)</Text>
            <TextBlock title="Обобщающий текст:" titleVariant="h5" gap={8}>
              <TextList
                marker="bullet"
                variant="p2"
                items={[
                  "Набор персональных данных, которые нужно получить от пользователя.",
                  "Основания для запроса данных согласно GDPR.",
                  "Текст соглашения об условиях обработки данных.",
                ]}
              />
            </TextBlock>
          </div>

          {/* Нумерованный список */}
          <div className="flex flex-col gap-3 rounded-xl border border-border p-6">
            <Text variant="caption-up" tone="subtle">Пронумерованный список (1. 2. 3.)</Text>
            <TextBlock title="Пронумерованный список:" titleVariant="p2-medium" gap={8}>
              <TextList
                marker="number"
                variant="p3"
                items={[
                  "Набор персональных данных от пользователя.",
                  "Основания для запроса данных согласно GDPR.",
                  "Текст соглашения об условиях обработки данных.",
                ]}
              />
            </TextBlock>
          </div>

          {/* Заметка */}
          <div className="flex flex-col gap-3 rounded-xl border border-border p-6">
            <Text variant="caption-up" tone="subtle">Заметка (Note)</Text>
            <Note title="Примечание">
              Длинные строки разрушают ритм: читателю трудно найти следующую строку
              взглядом. Оптимум — 40–80 символов в строке.
            </Note>
          </div>

          {/* Цитата */}
          <div className="flex flex-col gap-3 rounded-xl border border-border p-6">
            <Text variant="caption-up" tone="subtle">Цитата (Quote)</Text>
            <Quote>
              Цитата — короткая дословная выдержка из авторского текста, заключающая
              в себе законченную мысль.
            </Quote>
          </div>

          {/* Overline */}
          <div className="flex flex-col gap-3 rounded-xl border border-border p-6">
            <Text variant="caption-up" tone="subtle">Overline (надстрочная подпись)</Text>
            <div className="flex flex-col gap-4">
              <Overline label="Overline (p2)" overlineVariant="p2" bodyVariant="h3" gap={4}>
                Body (H3)
              </Overline>
              <Overline label="Overline (p3)" overlineVariant="p3" bodyVariant="p2" gap={4}>
                Body (P2)
              </Overline>
              <Overline label="Overline (caption)" overlineVariant="caption" bodyVariant="p3" gap={2}>
                Body (P3)
              </Overline>
            </div>
          </div>
        </div>
      </section>

      {/* Цвет текста */}
      <section className="flex flex-col gap-4">
        <Text variant="h4">Цвет текста</Text>
        <div className="flex flex-wrap gap-6">
          {TEXT_COLORS.map(([name, hex, cls]) => (
            <div key={name} className="flex flex-col gap-1">
              <span className={`ds-h5 ${cls}`}>Ag</span>
              <Text variant="caption-medium">{name}</Text>
              <Text variant="caption" tone="subtle">{hex}</Text>
            </div>
          ))}
        </div>
      </section>

      {/* Градиенты */}
      <section className="flex flex-col gap-4">
        <Text variant="h4">Градиенты</Text>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {GRADIENTS.map(([name, cls]) => (
            <div key={name} className="flex flex-col gap-2">
              <div className={`h-24 w-full rounded-lg border border-border ${cls}`} />
              <Text variant="caption-medium">{name}</Text>
            </div>
          ))}
        </div>
        <Text variant="caption" tone="subtle">
          Grey — мягкое затухание (overlay/fade) с альфа-каналом; на белом фоне почти незаметен.
        </Text>
      </section>

      {/* Палитра */}
      {/* Toast (уведомление) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Toast</Text>
          <Text variant="p3" tone="muted">
            Уведомление. Variant (positive · notice · error · info · default) ×
            раскладка: с заголовком «2+ строки» (312px) / без — «одна строка» (280px).
            Крестик — проп <code>onClose</code>.
          </Text>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-4 rounded-xl border border-border p-5">
          <div className="flex flex-col gap-4">
            <Text variant="caption-up" tone="subtle">2+ строки</Text>
            {(["positive", "notice", "error", "info", "default"] as const).map((v) => (
              <Toast key={v} variant={v} title="Заголовок" onClose={() => {}}>
                Документ «Протокол заседания правления №47» сохранён. Уведомление
                отправлено участникам голосования в чат кооператива.
              </Toast>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <Text variant="caption-up" tone="subtle">одна строка</Text>
            {(["positive", "notice", "error", "info", "default"] as const).map((v) => (
              <Toast key={v} variant={v} onClose={() => {}}>
                Изменения сохранены
              </Toast>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination (постраничная навигация) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text variant="h4">Pagination</Text>
          <Text variant="p3" tone="muted">
            Постраничная навигация. View (full · medium · basic · compact) × Size
            (L-48 · M-40 · S-32 · XS-24). Жми стрелки / «Первая» / «Последняя» —
            поле «N из 200» обновляется; кнопки гаснут на границах.
          </Text>
        </div>
        <PaginationDemos />
      </section>

      <section className="flex flex-col gap-6">
        <Text variant="h4">Палитра</Text>
        <div className="flex flex-col gap-6">
          {PALETTE.map((fam) => (
            <div key={fam.key} className="flex flex-col gap-2">
              <Text variant="p3-medium">{fam.name}</Text>
              <div className="flex flex-wrap gap-2">
                {fam.steps.map((step) => (
                  <div key={step} className="flex w-16 flex-col gap-1">
                    <div
                      className="h-12 w-full rounded-md border border-border/60"
                      style={{ background: `var(--color-${fam.key}-${step})` }}
                    />
                    <Text variant="caption" tone="subtle" as="span">{step}</Text>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
