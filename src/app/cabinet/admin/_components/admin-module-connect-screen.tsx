"use client";

import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Button, Dropdown, Checkbox, Combobox, SectionCard, ProfileInfoCard } from "@/components/ds";
import { cn } from "@/lib/cn";
import { AdminSidebar } from "./admin-sidebar";

/**
 * AdminModuleConnectScreen — экран после «Подключить приложение» (Figma
 * 6442:342177 → 342306 дропдаун → 341559/341910 «Создать подразделение» →
 * 340967/340975 сохранено/скрыто). Шапка модуля + аккордеон «Подробная информация»
 * с «Выберите действие»: «Создать подразделение» разворачивает форму → «Сохранить
 * информацию» → read-only профиль + «Создать соглашение».
 *
 * Reuse DS: SectionCard · Dropdown · Input · Textarea · Button. Паттерн Устав/
 * Направление — как в profile-screen/company-profile-screen.
 */

const OKVED = [
  "81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая;",
  "81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования;",
  "64.19 - Денежное посредничество прочее",
];

const COMPANY_DESC =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea nunc diam augue viverra facilisis nullam amet, tristique. Augue laoreet diam et, proin. Viverra nec gravida fames scelerisque. Faucibus arcu et eu sodales dolor sed pellentesque. Nisi, cursus faucibus pellentesque purus mattis cras. Nec at eu sed pellentesque cursus consectetur. Commodo pretium ultrices nullam consectetur venenatis id accumsan duis. Ut arcu nec turpis aliquam semper massa. Consequat amet, luctus erat lobortis libero, adipiscing quis dui. Urna, aliquet cursus aliquam dictum rhoncus blandit malesuada velit. Eget aliquet tortor purus vel egestas non at nibh. Ut et, quis semper donec. Pellentesque nam elit orci sed est est tempus. Elementum amet massa amet at sed.tortor purus vel egestas non at nibh. Ut et, quis semper donec. Pellentesque nam elit orci sed est est tempus. Elementum amet massa amet at sed.";

const ACTIONS = [
  { value: "subdivision", label: "Создать подразделение" },
  { value: "autonomous", label: "Создать автономный кооператив" },
];

/** Данные основателя (те же, что «Представитель» в manager-invite/ProfileScreen). */
const FOUNDER: { label: string; value: string }[] = [
  { label: "Адрес", value: "0xca30e63200a0fe3182dc61fc5605efc41456f32" },
  { label: "Фамилия", value: "Антонов" },
  { label: "Имя", value: "Илья" },
  { label: "Отчество", value: "Васильевич" },
  { label: "Номер паспорта", value: "45 67 345678" },
  { label: "Кем выдан", value: "ТП № 19 Калининского района, г. Санкт-Петербург" },
  { label: "Дата выдачи", value: "25.12.2005" },
];

// Типы организаций — активен только «Потребительский кооператив» (как в ProfileScreen).
const ORG_TYPES = [
  { value: "ooo", label: "ООО", disabled: true },
  { value: "oao", label: "ОАО", disabled: true },
  { value: "ip", label: "ИП", disabled: true },
  { value: "consumer-coop", label: "Потребительский кооператив" },
];

// Список ОКВЭД для комбобокса (как в ProfileScreen).
const OKVED_OPTIONS = [
  "01.11 — Выращивание зерновых культур",
  "41.20 — Строительство жилых и нежилых зданий",
  "47.11 — Торговля розничная преимущественно пищевыми продуктами",
  "62.01 — Разработка компьютерного программного обеспечения",
  "64.19 — Денежное посредничество прочее",
  "68.20 — Аренда и управление недвижимым имуществом",
  "81.22 — Деятельность по чистке и уборке зданий и помещений",
  "85.41 — Образование дополнительное детей и взрослых",
].map((o) => ({ value: o, label: o }));

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden>
      <path d="M3.71429 13.5556C3.71429 14.35 4.35714 15 5.14286 15H10.8571C11.6429 15 12.2857 14.35 12.2857 13.5556V4.88889H3.71429V13.5556ZM13 2.72222H10.5L9.78571 2H6.21429L5.5 2.72222H3V4.16667H13V2.72222Z" fill="#E6424D" />
    </svg>
  );
}
function OkvedRow({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="ds-p3 text-foreground">{children}</span>
      <button type="button" aria-label="Удалить" onClick={onRemove} className="shrink-0"><TrashIcon /></button>
    </div>
  );
}

function GroupHeading({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-border bg-surface-muted px-6 py-2">
      <span className="ds-caption-medium text-foreground-muted">{children}</span>
    </div>
  );
}
function Row({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border px-6 py-3.5">
      <span className="ds-caption w-[260px] shrink-0 text-foreground-subtle">{label}</span>
      <span className="ds-caption flex-1 text-foreground">{value}</span>
    </div>
  );
}
function DocThumb() {
  return (
    <span className="flex h-16 w-[52px] flex-col gap-1 rounded-[3px] border border-border bg-surface p-1.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="h-[2px] rounded bg-[var(--color-grey-90)]" style={{ width: `${90 - i * 6}%` }} />
      ))}
    </span>
  );
}
function OkvedList() {
  return (
    <span className="flex flex-col gap-2">
      {OKVED.map((o) => <span key={o}>{o}</span>)}
    </span>
  );
}
function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 8h12M8 2c2 2.2 2 9.8 0 12M8 2c-2 2.2-2 9.8 0 12" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
/** Шестерёнка «отчётность и настройка» — 1:1 из карточки счёта (AccountCard), 16px. */
function GearIcon() {
  return (
    <svg viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="size-4 text-foreground-subtle">
      <path fillRule="evenodd" clipRule="evenodd" d="M22.8791 14.64C22.9324 14.2133 22.9724 13.7867 22.9724 13.3333C22.9724 12.88 22.9324 12.4533 22.8791 12.0267L25.6924 9.82667C25.9458 9.62667 26.0124 9.26667 25.8524 8.97333L23.1858 4.36C23.0258 4.06667 22.6658 3.96 22.3724 4.06667L19.0524 5.4C18.3591 4.86667 17.6124 4.42667 16.7991 4.09333L16.2924 0.56C16.2524 0.24 15.9724 0 15.6391 0H10.3058C9.97244 0 9.69244 0.24 9.65244 0.56L9.14578 4.09333C8.33244 4.42667 7.58578 4.88 6.89244 5.4L3.57244 4.06667C3.26578 3.94667 2.91911 4.06667 2.75911 4.36L0.0924421 8.97333C-0.0808912 9.26667 -0.000891189 9.62667 0.252442 9.82667L3.06578 12.0267C3.01244 12.4533 2.97244 12.8933 2.97244 13.3333C2.97244 13.7733 3.01244 14.2133 3.06578 14.64L0.252442 16.84C-0.000891189 17.04 -0.0675579 17.4 0.0924421 17.6933L2.75911 22.3067C2.91911 22.6 3.27911 22.7067 3.57244 22.6L6.89244 21.2667C7.58578 21.8 8.33244 22.24 9.14578 22.5733L9.65244 26.1067C9.69244 26.4267 9.97244 26.6667 10.3058 26.6667H15.6391C15.9724 26.6667 16.2524 26.4267 16.2924 26.1067L16.7991 22.5733C17.6124 22.24 18.3591 21.7867 19.0524 21.2667L22.3724 22.6C22.6791 22.72 23.0258 22.6 23.1858 22.3067L25.8524 17.6933C26.0124 17.4 25.9458 17.04 25.6924 16.84L22.8791 14.64ZM12.9714 18C10.398 18 8.30469 15.9066 8.30469 13.3333C8.30469 10.76 10.398 8.66663 12.9714 8.66663C15.5447 8.66663 17.638 10.76 17.638 13.3333C17.638 15.9066 15.5447 18 12.9714 18Z" fill="currentColor" />
    </svg>
  );
}

/** Блок «Требования для подключения» — заголовок (белый, шестерёнка) + бордерная
 *  карточка требования. Figma 6442:341682. */
/** Строка-требование (бордерная карточка 64px). */
function ReqRow({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex h-16 items-center justify-between rounded-[4px] border border-border px-4">
      <span className="ds-p3 text-foreground">{label}</span>
      <span className="ds-p3 text-foreground-subtle">{date}</span>
    </div>
  );
}

function RequirementsBlock({ withForm = false }: { withForm?: boolean }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="ds-p3 text-foreground">Требования для подключения к данному подразделению</span>
        <GearIcon />
      </div>
      <ReqRow label="Для подключения модуля" date="01.06.2020" />
      {withForm && <ReqRow label="Форма регистрации для граждан России, Болгарии" date="01.06.2020" />}
    </div>
  );
}

/** Серый бар-сепаратор во всю ширину. */
function GreyBar() {
  return <div className="h-8 border-b border-border bg-surface-muted" />;
}

/** Дропдаун «Выберите действие» — поле-триггер + меню (как TemplateDropdown). */
function ActionDropdown({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  const current = ACTIONS.find((a) => a.value === value);
  return (
    <Dropdown
      value={value}
      items={ACTIONS}
      onSelect={onSelect}
      aria-label="Выберите действие"
      className="w-full max-w-[406px]"
      trigger={({ open }) => (
        <div className={cn("flex h-12 w-full max-w-[406px] cursor-pointer items-center justify-between gap-2 rounded-[4px] border bg-[#fff] px-4 transition-colors", open ? "border-[var(--color-blue-midhub-500)]" : "border-border hover:border-[var(--color-grey-200)]")}>
          <span className={cn("ds-p3", current ? "text-foreground" : "text-foreground-subtle")}>{current?.label ?? "Выберите действие"}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-5 shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
            <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    />
  );
}

export function AdminModuleConnectScreen() {
  const router = useRouter();
  const [action, setAction] = useState("");
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("Идеологическое подразделение");
  const [domains, setDomains] = useState<string[]>([""]);
  const [emails, setEmails] = useState<string[]>([""]);
  const [phones, setPhones] = useState<string[]>([""]);
  const [description, setDescription] = useState("");
  // «Создать автономный кооператив» — информация из устава.
  const [coopName, setCoopName] = useState("Имматра");
  const [coopCountry, setCoopCountry] = useState("");
  const [coopType, setCoopType] = useState("");
  const [coopLocation, setCoopLocation] = useState("");
  const [coopOkved, setCoopOkved] = useState<string[]>([]);
  const coopIsCoop = coopType === "consumer-coop";
  const autoReady =
    coopName.trim() !== "" && coopCountry !== "" && coopIsCoop && coopLocation.trim() !== "" && coopOkved.length > 0;
  const sendForApproval = () => router.push("/cabinet/admin?pending=coop");

  // После «Создать соглашение» → блок «Приглашение первых пайщиков» + председатель.
  const [agreement, setAgreement] = useState(false);
  const [chairWallet, setChairWallet] = useState("");
  const [chairAgreed, setChairAgreed] = useState(false);
  const [chairInvited, setChairInvited] = useState(false);

  const includeInSubdivision = () => {
    // Запоминаем установленный модуль → отображается в «Ваши приложения».
    try {
      const key = "admin.installedModules";
      const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
      if (!prev.includes("bank")) localStorage.setItem(key, JSON.stringify([...prev, "bank"]));
    } catch { /* noop */ }
    router.push("/cabinet/admin/modules?tab=apps");
  };

  const allFilled = (a: string[]) => a.every((v) => v.trim() !== "");
  const ready = name.trim() !== "" && allFilled(domains) && allFilled(emails) && allFilled(phones);

  const setAt = (set: React.Dispatch<React.SetStateAction<string[]>>, i: number, v: string) =>
    set((prev) => prev.map((x, j) => (j === i ? v : x)));
  const addOne = (set: React.Dispatch<React.SetStateAction<string[]>>) => set((prev) => [...prev, ""]);
  const fields = (values: string[], set: React.Dispatch<React.SetStateAction<string[]>>, placeholder: string) =>
    values.map((v, i) => (
      <div key={`${placeholder}-${i}`} className="max-w-[406px]">
        <Input size="l" label={v ? placeholder : undefined} placeholder={placeholder} value={v} onChange={(e) => setAt(set, i, e.target.value)} />
      </div>
    ));

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar current="modules" />
      <main className="min-w-0 flex-1">
        {/* Цельный блок во всю ширину, от края до края (без внешних отступов/рамок). */}
        <div className="flex w-full flex-col">
          {/* Шапка модуля: логотип + домен + название + описание. Нижняя линия. */}
          <div className="flex flex-wrap items-start gap-6 border-b border-border px-6 py-6">
            <div className="flex w-[146px] shrink-0 flex-col overflow-hidden rounded-[4px] border border-border">
              <div className="flex h-[110px] items-center justify-center bg-surface-muted px-3 text-center">
                <span className="ds-caption text-foreground-subtle">{saved ? "TATRA" : "Логотип загружает приглашенная компания"}</span>
              </div>
              <button type="button" className="flex items-center justify-center gap-1.5 border-t border-border py-2 text-primary">
                <GlobeIcon />
                <span className="ds-caption-medium">{saved ? "bank.tatra.ru" : "Домен"}</span>
              </button>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="ds-p2-medium text-foreground">{name}</span>
              <p className="ds-p3 text-foreground-muted">
                {description || (saved ? COMPANY_DESC : <>Описание <span className="text-foreground-subtle">[Заполняет приглашенная компания]</span></>)}
              </p>
            </div>
          </div>

          {/* Подробная информация — аккордеон во всю ширину (серый бар + контент) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between border-b border-border bg-surface-muted px-6 py-3"
          >
            <span className="ds-p2-medium text-foreground">Подробная информация</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-5 text-foreground-subtle transition-transform", open && "rotate-180")}>
              <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {open && (
            <div className="flex flex-col">
            {!saved ? (
              <div className="flex flex-col">
                <div className="border-b border-border px-6 py-4">
                  <ActionDropdown value={action} onSelect={setAction} />
                </div>

                {/* Большой серый сепаратор после дропдауна (пустое состояние) */}
                {action !== "subdivision" && (
                  <div className="h-8 border-b border-t border-border bg-surface-muted" />
                )}

                {action === "subdivision" && (
                  <>
                    <GroupHeading>Информация для заполнения</GroupHeading>
                    <div className="grid gap-6 border-b border-border px-6 py-4 lg:grid-cols-2 lg:items-stretch">
                      <div className="flex flex-col gap-6">
                        <div className="max-w-[406px]">
                          <Input size="l" label="Наименование подразделения" placeholder="Наименование подразделения" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        {/* Логотип компании */}
                        <div className="flex items-center gap-4">
                          <button type="button" className="flex size-[72px] shrink-0 items-center justify-center rounded-[4px] bg-[var(--color-blue-midhub-100,#eaf3fe)] text-primary">
                            <PlusIcon />
                          </button>
                          <span className="flex flex-col">
                            <span className="ds-p3 text-foreground">Логотип компании</span>
                            <span className="ds-caption text-foreground-subtle">Требуемый формат: PNG, JPG, JPEG</span>
                            <span className="ds-caption text-foreground-subtle">Максимальный размер файла до 50 Mb</span>
                          </span>
                        </div>
                        {fields(domains, setDomains, "Домен")}
                        <Button variant="tertiary" size="s" icon={<PlusIcon />} className="self-start" onClick={() => addOne(setDomains)}>Добавить домен</Button>
                        {fields(emails, setEmails, "E-mail")}
                        <Button variant="tertiary" size="s" icon={<PlusIcon />} className="self-start" onClick={() => addOne(setEmails)}>Добавить Email</Button>
                        {fields(phones, setPhones, "Телефон")}
                        <Button variant="tertiary" size="s" icon={<PlusIcon />} className="self-start" onClick={() => addOne(setPhones)}>Добавить телефон</Button>
                      </div>
                      <Textarea label={description ? "Текст описания" : undefined} placeholder="Текст описания" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="lg:h-full lg:[&>label]:h-full lg:[&_.ds-field__main]:h-full lg:[&_textarea]:h-full" />
                    </div>

                    {/* Направление + Устав (read-only) */}
                    <GroupHeading>Направление</GroupHeading>
                    <Row label="Название" value="Идеологическое направление" />
                    <GroupHeading>Устав</GroupHeading>
                    <Row label="Тип организации" value="Подразделение кооператива" />
                    <Row label="Местонахождение" value="Санкт-Петербург, Дегтярный переулок, 11 лит А" />
                    <Row label="ОКВЭД" value={<OkvedList />} />
                    <Row label="Уставные документы" value={<DocThumb />} />

                    {/* Требования для подключения (серые бары сверху/снизу) */}
                    <GreyBar />
                    <RequirementsBlock />
                    <GreyBar />

                    <div className="flex flex-wrap gap-4 px-6 py-10">
                      <Button disabled={!ready} onClick={() => { setName((n) => n || "Bank Tatra"); setSaved(true); }}>Сохранить информацию</Button>
                      <Button variant="negative-sec">Удалить подразделение</Button>
                    </div>
                  </>
                )}

                {/* Создать автономный кооператив — основатель + информация из устава */}
                {action === "autonomous" && (
                  <>
                    <GroupHeading>Направление</GroupHeading>
                    <Row label="Название" value="Идеологическое направление" />
                    <GroupHeading>Основатель</GroupHeading>
                    {FOUNDER.map((r) => <Row key={r.label} label={r.label} value={r.value} />)}
                    <GroupHeading>Устав</GroupHeading>
                    <Row label="Уставные документы" value={<DocThumb />} />

                    <GroupHeading>Информация из устава</GroupHeading>
                    <div className="flex flex-col gap-6 border-b border-border px-6 py-4">
                      <div className="max-w-[406px]">
                        <Input size="l" label="Наименование компании" placeholder="Наименование компании" value={coopName} onChange={(e) => setCoopName(e.target.value)} />
                      </div>
                      <div className="max-w-[406px]">
                        <Combobox placeholder="Выберите страну" value={coopCountry || undefined} onValueChange={setCoopCountry} options={[{ value: "ru", label: "🇷🇺 Россия" }]} aria-label="Страна" />
                      </div>
                      <div className="max-w-[406px]">
                        <Combobox placeholder="Выберите тип организации" value={coopType || undefined} onValueChange={setCoopType} options={ORG_TYPES} aria-label="Тип организации" />
                      </div>

                      {coopIsCoop && (
                        <div className="max-w-[406px]">
                          <Input size="l" placeholder="Местонахождение кооператива" value={coopLocation} onChange={(e) => setCoopLocation(e.target.value)} />
                        </div>
                      )}

                      {coopIsCoop && (
                        <div className="max-w-[747px]">
                          <Combobox placeholder="Напишите ОКВЭД или выберите из списка" value="" onValueChange={(v) => setCoopOkved((prev) => (prev.includes(v) ? prev : [...prev, v]))} options={OKVED_OPTIONS} aria-label="ОКВЭД" />
                        </div>
                      )}

                      {coopOkved.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {coopOkved.map((o) => (
                            <OkvedRow key={o} onRemove={() => setCoopOkved((prev) => prev.filter((x) => x !== o))}>{o}</OkvedRow>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 px-6 py-10">
                      <Button disabled={!autoReady} onClick={sendForApproval}>Отправить на согласование</Button>
                      <Button variant="negative-sec">Отклонить компанию</Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Сохранённый профиль (read-only) */
              <div className="flex flex-col">
                <RequirementsBlock withForm={agreement} />
                <GroupHeading>Контакты</GroupHeading>
                <Row label="E-mail" value={emails[0] || "tatra@immatra.ru"} />
                <Row label="Телефон" value={phones[0] || "+7 (992) 223-22-22"} />
                <GroupHeading>Направление</GroupHeading>
                <Row label="Название" value="Идеологическое направление" />
                <GroupHeading>Устав</GroupHeading>
                <Row label="Тип организации" value="Подразделение кооператива" />
                <Row label="Местонахождение" value="Санкт-Петербург, Дегтярный переулок, 11 лит А" />
                <Row label="ОКВЭД" value={<OkvedList />} />
                <Row label="Уставные документы" value={<DocThumb />} />
                {/* Сепаратор снизу — «Скрыть» сворачивает «Подробную информацию». */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full border-b border-border bg-surface-muted py-3 text-center"
                >
                  <span className="ds-p3 text-foreground-muted">Скрыть</span>
                </button>
              </div>
            )}
            </div>
          )}

          {/* После сохранения, до соглашения — CTA «Создать соглашение» */}
          {saved && !agreement && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <span className="ds-p2-medium text-foreground">Создайте пользовательское соглашение и добавьте председателя подразделения</span>
              <span className="ds-p2 text-foreground-muted">Новые пайщики отразятся у вас в разделе пайщики с нужным для вступления в подразделение набором документов</span>
              <Button className="mt-2" onClick={() => setAgreement(true)}>Создать соглашение</Button>
            </div>
          )}

          {/* После «Создать соглашение» — приглашение первых пайщиков + председатель */}
          {saved && agreement && (
            <div className="flex flex-col gap-6 px-5 py-10 md:px-[50px]">
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="ds-p2-medium text-foreground">Приглашение первых пайщиков в кооператив</span>
                <span className="ds-p2 text-foreground-muted">Новые пайщики отразятся у вас в разделе Пайщики.</span>
              </div>

              <div className="flex flex-col gap-2">
                <ReqRow label="Форма регистрации для граждан России, Болгарии" date="12.01.2020" />
                <button type="button" className="inline-flex items-center gap-1 self-start text-primary">
                  <PlusIcon />
                  <span className="ds-p3-medium">Добавить пользовательское соглашение</span>
                </button>
              </div>

              {/* Председатель подразделения (DS: SectionCard/ProfileInfoCard): ввод → данные */}
              {!chairInvited ? (
                <SectionCard title="Председатель подразделения" defaultOpen>
                  <div className="px-6 py-4">
                    <Input size="l" label={chairWallet ? "Кошелек" : undefined} placeholder="Кошелек" value={chairWallet} onChange={(e) => setChairWallet(e.target.value)} />
                  </div>
                </SectionCard>
              ) : (
                <ProfileInfoCard
                  title="Председатель подразделения"
                  groups={[{
                    rows: [
                      { label: "Адрес", value: "0xca30e63200a0fe3182dc61fc5605efc41456f32" },
                      { label: "Фамилия", value: "Гаврилов" },
                      { label: "Имя", value: "Илья" },
                      { label: "Отчество", value: "Васильевич" },
                      { label: "Номер паспорта", value: "45 67 345678" },
                      { label: "Кем выдан", value: "ТП № 19 Калининского района, г. Санкт-Петербург" },
                      { label: "Дата выдачи", value: "25.12.2005" },
                    ],
                  }]}
                />
              )}

              {/* Чекбокс + кнопка (Пригласить председателя → Включить в подразделение) */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Checkbox
                  size="xxs"
                  checked={chairAgreed}
                  onChange={(e) => setChairAgreed(e.target.checked)}
                  label={<>Ознакомился с <span className="text-primary">правилами авторизации пользователя</span> и тем, как они влияют на блокировку моей лицензии.</>}
                />
                {!chairInvited ? (
                  <Button disabled={!(chairWallet.trim() !== "" && chairAgreed)} onClick={() => setChairInvited(true)}>
                    Пригласить председателя
                  </Button>
                ) : (
                  <Button onClick={includeInSubdivision}>Включить в подразделение</Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
