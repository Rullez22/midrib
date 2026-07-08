"use client";

import { useState, type ReactNode } from "react";
import {
  SectionHeader,
  RegistrationForm,
  BasisCard,
  Button,
  Textarea,
  UploadV1,
  Accordion,
  Checkbox,
  Modal,
  HeaderArrowLeftIcon,
  EditPencilIcon,
} from "@/components/ds";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * Флоу «Запрос ПД пользователя» (кабинет №4 — Домены, раздел «Реестры»).
 * Сервис обратился к регулятору с запросом на выдачу персональных данных
 * пользователя; здесь оформляется запрос (основание + перечень данных) и
 * обрабатывается ответ. Источник Figma: 6820-554881…555136.
 *
 * Компоненты НЕ создаются заново — переиспользуются из флоу «создание ПП»/DS:
 * RegistrationForm (4-колоночная форма), BasisCard (основания), BasisEditor-логика
 * упрощена до Textarea + UploadV1 (плитки файлов), DocumentSettings заменён на
 * Accordion + Checkbox (выбор данных/документов), Modal (подтверждение в блокчейн),
 * SectionHeader, Button, общий каркас CompanySidebar.
 */

// ── Справочные данные (1:1 с Figma) ────────────────────────────────────────
const BASES_LIST = [
  "Согласие",
  "Договор",
  "Правовое обязательство",
  "Жизненно важные интересы",
  "Общественный интерес",
  "Законные интересы",
];

const IDENTITY_FIELDS = [
  "Имя",
  "Фамилия",
  "Отчество",
  "Пол",
  "E-mail",
  "Телефон",
  "Дата рождения",
  "Место рождения",
  "Что-то еще",
];

const DOC_CATEGORIES: { name: string; docs: string[] }[] = [
  { name: "Все документы", docs: ["Паспорт", "Заграничный паспорт", "СНИЛС", "ИНН"] },
  { name: "Удостоверяющие личность", docs: ["Паспорт", "Водительское удостоверение"] },
  { name: "Образование", docs: ["Диплом", "Аттестат"] },
];

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas amet ultrices faucibus non.",
  "Sit aliquet vestibulum, cras massa quam consequat, augue. Cursus orci donec bibendum nisl a, cursus. Imperdiet rhoncus lacus amet, non viverra nam velit velit. Volutpat non volutpat integer nulla egestas. Non egestas adipiscing quis fringilla tincidunt. Porttitor varius interdum ac id sollicitudin sed eleifend in arcu. Semper enim donec mi nunc a nunc id pulvinar. Elementum malesuada etiam pretium aliquet mi ac. Elit, massa blandit est maecenas nunc blandit tincidunt. Aenean porta bibendum ultrices consequat. Nisl cursus blandit lectus vel consequat odio tempor faucibus massa.",
  "Nibh volutpat, suscipit ac ut orci, magna magna viverra eros. Aliquam vitae vel nulla id adipiscing nibh. Augue varius id viverra tempus viverra. At odio et sit accumsan adipiscing nunc eu. Massa sed tempus, sit cras nullam tincidunt aenean tortor, phasellus. Mi urna, nibh blandit tortor commodo nunc, morbi.",
];

/** Документ-миниатюра (серая плитка с «строками» текста) — превью файла основания. */
const DOC_THUMB =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='84' height='110' viewBox='0 0 84 110'><rect width='84' height='110' fill='#fff'/><g fill='#dbe2ea'>${Array.from({ length: 9 }, (_, i) => `<rect x='12' y='${14 + i * 10}' width='${i % 3 === 0 ? 40 : 60}' height='4' rx='2'/>`).join("")}</g></svg>`,
  );

const ACCENT = "var(--color-blue-midhub-500)";

// ── Общий каркас экрана флоу ────────────────────────────────────────────────
function FlowShell({
  cabinet,
  current,
  title,
  subtitle,
  onBack,
  children,
}: {
  cabinet: CabinetConfig;
  current: string;
  title: ReactNode;
  subtitle?: ReactNode;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          <div className="relative flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              size="m"
              icon={<HeaderArrowLeftIcon />}
              aria-label="Назад"
              className="absolute left-0 top-0"
              onClick={onBack}
            />
            <SectionHeader title={title} subtitle={subtitle} />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

function EditIcon() {
  return <EditPencilIcon className="size-4 text-[var(--color-blue-midhub-500)]" />;
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Значение колонки (Сервис / RID) — read-only плашка. */
function ValueBox({ children }: { children: ReactNode }) {
  return (
    <div className="ds-p3 flex h-14 items-center rounded-[4px] border border-border bg-white px-4 text-foreground">
      <span className="truncate">{children}</span>
    </div>
  );
}

/** Тело экрана «Основание для запроса данных пользователей» (текст + файл). */
function BasisTextBody({ paragraphs, footer }: { paragraphs: string[]; footer?: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="ds-p3 text-foreground-muted">
            {p}
          </p>
        ))}
      </div>
      <div className="flex w-full max-w-[485px] items-center gap-3 rounded-[4px] border border-border p-3">
        <img src={DOC_THUMB} alt="" className="h-[64px] w-[50px] rounded-[3px] border border-border object-cover" />
      </div>
      {footer}
    </div>
  );
}

/** Тело экрана «Паспорт» — строки поле/значение. */
function PassportBody({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="w-full overflow-hidden rounded-[4px] border border-border bg-white">
      {rows.map((r, i) => (
        <div key={i} className={`flex items-center gap-4 px-6 py-4 ${i > 0 ? "border-t border-border" : ""}`}>
          <span className="ds-p3 w-[200px] shrink-0 text-foreground-subtle">{r.label}</span>
          <span className="ds-p3 text-foreground">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

const PASSPORT_ROWS = [
  { label: "Фамилия", value: "Антонов" },
  { label: "Имя", value: "Илья" },
];

// ════════════════════════════════════════════════════════════════════════════
// Создание запроса (визард)
// ════════════════════════════════════════════════════════════════════════════
type Step = "form" | "composer" | "basisEdit" | "basisSaved" | "docs" | "basisView" | "passport";

export function PdRequestFlow({
  cabinet,
  current,
  onClose,
  onSubmit,
}: {
  cabinet: CabinetConfig;
  current: string;
  onClose: () => void;
  onSubmit: (req: { service: string; rid: string }) => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [service, setService] = useState("");
  const [rid, setRid] = useState("");

  // Основание
  const [activeBasis, setActiveBasis] = useState<string | null>(null);
  const [basisDesc, setBasisDesc] = useState("");
  const [basisFiles, setBasisFiles] = useState<number>(0);
  const [basisFilled, setBasisFilled] = useState(false);

  // Документы
  const [identity, setIdentity] = useState<string[]>([]);
  const [docs, setDocs] = useState<string[]>([]);
  const [docsFilled, setDocsFilled] = useState(false);

  const goComposer = () => setStep("composer");

  // ── Шаг 1: форма запроса ──────────────────────────────────────────────────
  if (step === "form") {
    return (
      <FlowShell
        cabinet={cabinet}
        current={current}
        title="Запрос на доступ к данным пользователей сервисов"
        onBack={onClose}
      >
        <div className="flex w-full max-w-[814px] flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="ds-p3 text-foreground">Сервис</span>
            <input
              className="ds-p3 h-12 rounded-[4px] border border-border bg-white px-4 text-foreground outline-none placeholder:text-foreground-subtle focus:border-[color:var(--color-blue-midhub-500)]"
              placeholder="Например, Facebook"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="ds-p3 text-foreground">RID пользователя</span>
            <input
              className="ds-p3 h-12 rounded-[4px] border border-border bg-white px-4 text-foreground outline-none placeholder:text-foreground-subtle focus:border-[color:var(--color-blue-midhub-500)]"
              placeholder="Например, a30e63200a0fe3182dc61fc5605efc41456f32"
              value={rid}
              onChange={(e) => setRid(e.target.value)}
            />
          </div>
          <Button size="l" className="self-start" disabled={!service.trim() || !rid.trim()} onClick={goComposer}>
            Создать запрос
          </Button>
        </div>
      </FlowShell>
    );
  }

  // ── Колонки 1/2 (Сервис / RID) ────────────────────────────────────────────
  const col1 = <ValueBox>{service || "Facebook.com"}</ValueBox>;
  const col2 = <ValueBox>{rid || "0fe312234sfsf82...0fe312234sfsf82"}</ValueBox>;

  // ── Колонка «Основания» ───────────────────────────────────────────────────
  const basesColumn = BASES_LIST.map((title) => {
    if (basisFilled && title === activeBasis) {
      return (
        <BasisCard key={title} title={title} state="filled" active>
          <button
            type="button"
            onClick={() => setStep("basisView")}
            className="flex items-center justify-between gap-2 rounded-[4px] border border-border bg-white px-3 py-2 text-left transition-colors hover:bg-[var(--color-grey-10)]"
          >
            <span className="ds-p3 text-foreground">Текст и файл основания</span>
            <span className="shrink-0">
              <EditIcon />
            </span>
          </button>
        </BasisCard>
      );
    }
    return (
      <BasisCard
        key={title}
        title={title}
        createDisabled={basisFilled}
        onCreate={() => {
          setActiveBasis(title);
          setStep("basisEdit");
        }}
      />
    );
  });

  // ── Колонка «Документы» ───────────────────────────────────────────────────
  const documents = docsFilled ? [{ title: "Паспорт:", sub: "Фамилия, Имя" }] : undefined;

  // ── Шаг 2: 4-колоночная форма (составление запроса) ───────────────────────
  if (step === "composer") {
    return (
      <FlowShell
        cabinet={cabinet}
        current={current}
        title="Запрос на доступ к данным пользователей сервисов"
        subtitle={
          basisFilled && !docsFilled
            ? "Необходимо выбрать запрашиваемые данные и документы пользователя"
            : "Выберите основание для сбора данных пользователей"
        }
        onBack={() => setStep("form")}
      >
        <RegistrationForm
          mode="edit"
          headers={["Сервис", "RID пользователя", "Основания", "Документы"]}
          column1={col1}
          column2={col2}
          bases={basesColumn}
          documents={documents}
          activeColumn={2}
          onAddDocument={() => setStep("docs")}
          onEditDocument={() => setStep("docs")}
          onDocumentClick={() => setStep("passport")}
          documentsPrompt={
            basisFilled ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="ds-p3 text-foreground-subtle">
                  Для выбора данных пользователя и его документов, вам необходимо нажать кнопку:
                </span>
                <Button size="s" iconLeft={<PlusIcon />} onClick={() => setStep("docs")}>
                  Добавить документы
                </Button>
              </div>
            ) : undefined
          }
        />

        <div className="flex justify-end pt-2">
          <Button size="l" disabled={!basisFilled || !docsFilled} onClick={() => onSubmit({ service, rid })}>
            Отправить запрос
          </Button>
        </div>
      </FlowShell>
    );
  }

  // ── Шаг: редактор основания (Описание + файлы) ────────────────────────────
  if (step === "basisEdit") {
    return (
      <FlowShell
        cabinet={cabinet}
        current={current}
        title="Опишите основание для запроса данных пользователей"
        onBack={() => setStep("composer")}
      >
        <div className="flex w-full flex-col gap-6">
          <Textarea
            placeholder="Описание"
            rows={9}
            value={basisDesc}
            onChange={(e) => setBasisDesc(e.target.value)}
          />
          <div className="flex w-full max-w-[485px] flex-wrap items-center gap-4 rounded-[4px] border border-border p-3">
            <UploadV1 onSelect={() => setBasisFiles((n) => n + 1)} label="Прикрепить файл основания" />
            {basisFiles === 0 ? (
              <div className="flex flex-col">
                <span className="ds-p3 text-foreground">Требуемый формат: PDF, JPG, JPEG</span>
                <span className="ds-caption text-foreground-subtle">(Максимальный размер файла до 50 МБ)</span>
              </div>
            ) : (
              Array.from({ length: basisFiles }, (_, i) => (
                <UploadV1
                  key={i}
                  preview={DOC_THUMB}
                  onDelete={() => setBasisFiles((n) => Math.max(0, n - 1))}
                  label="Файл основания"
                />
              ))
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button size="l" disabled={!basisDesc.trim()} onClick={() => setStep("basisSaved")}>
              Сохранить
            </Button>
          </div>
        </div>
      </FlowShell>
    );
  }

  // ── Шаг: сохранённое основание (просмотр + Удалить/Редактировать/Продолжить) ─
  if (step === "basisSaved") {
    const paragraphs = basisDesc.trim() ? basisDesc.split("\n").filter(Boolean) : LOREM;
    return (
      <FlowShell
        cabinet={cabinet}
        current={current}
        title="Основание для запроса данных пользователей"
        onBack={() => setStep("composer")}
      >
        <BasisTextBody
          paragraphs={paragraphs}
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="negative-sec"
                size="l"
                onClick={() => {
                  setActiveBasis(null);
                  setBasisDesc("");
                  setBasisFiles(0);
                  setStep("composer");
                }}
              >
                Удалить
              </Button>
              <Button variant="secondary" size="l" onClick={() => setStep("basisEdit")}>
                Редактировать
              </Button>
              <Button
                size="l"
                onClick={() => {
                  setBasisFilled(true);
                  setStep("composer");
                }}
              >
                Продолжить
              </Button>
            </div>
          }
        />
      </FlowShell>
    );
  }

  // ── Шаг: просмотр основания (read-only, из заполненной карточки) ──────────
  if (step === "basisView") {
    const paragraphs = basisDesc.trim() ? basisDesc.split("\n").filter(Boolean) : LOREM;
    return (
      <FlowShell
        cabinet={cabinet}
        current={current}
        title="Основание для запроса данных пользователей"
        onBack={() => setStep("composer")}
      >
        <BasisTextBody paragraphs={paragraphs} />
      </FlowShell>
    );
  }

  // ── Шаг: паспорт ──────────────────────────────────────────────────────────
  if (step === "passport") {
    return (
      <FlowShell cabinet={cabinet} current={current} title="Паспорт" onBack={() => setStep("composer")}>
        <PassportBody rows={PASSPORT_ROWS} />
      </FlowShell>
    );
  }

  // ── Шаг: выбор данных и документов ────────────────────────────────────────
  // (step === "docs")
  const toggle = (list: string[], set: (v: string[]) => void, key: string) =>
    set(list.includes(key) ? list.filter((x) => x !== key) : [...list, key]);
  const docsComplete = identity.length > 0 && docs.length > 0;

  return (
    <FlowShell
      cabinet={cabinet}
      current={current}
      title="Выберите запрашиваемые данные и документы"
      onBack={() => setStep("composer")}
    >
      <div className="flex w-full flex-col gap-3">
        {/* Данные идентифицирующие пользователя (1:1 с DocumentSettings/ПП) */}
        <div className="overflow-hidden rounded-[4px] border border-border bg-surface">
          <div className="border-b border-border px-6 py-4">
            <span className="ds-p3-medium text-foreground">Данные идентифицирующие пользователя</span>
          </div>
          <div className="flex flex-col gap-4 p-6">
            {IDENTITY_FIELDS.map((f) => (
              <Checkbox
                key={f}
                size="xs"
                checked={identity.includes(f)}
                onChange={() => toggle(identity, setIdentity, f)}
                label={<span className="text-foreground-muted">{f}</span>}
              />
            ))}
          </div>
        </div>

        {/* Документы (шапка как у страны в ПП + аккордеоны size=s, чекбоксы xs) */}
        <div className="overflow-hidden rounded-[4px] border border-border bg-surface">
          <div className="flex items-center px-6 py-4">
            <span className="ds-p3-medium text-foreground">Документы</span>
            <span className="ds-caption ml-auto text-foreground-subtle">200 шт.</span>
          </div>
          <div className="border-t border-border bg-surface-sunken/40 px-6 py-2">
            {DOC_CATEGORIES.map((cat, ci) => (
              <Accordion key={cat.name} title={cat.name} size="s" defaultOpen={ci === 0}>
                <div className="flex flex-col">
                  {cat.docs.map((d) => {
                    const key = `${cat.name}/${d}`;
                    return (
                      <div key={key} className="flex items-center justify-between gap-4 border-t border-border py-3 first:border-t-0">
                        <Checkbox
                          size="xs"
                          checked={docs.includes(key)}
                          onChange={() => toggle(docs, setDocs, key)}
                          label={<span className="text-foreground">{d}</span>}
                        />
                      </div>
                    );
                  })}
                </div>
              </Accordion>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            size="l"
            disabled={!docsComplete}
            onClick={() => {
              setDocsFilled(true);
              setStep("composer");
            }}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </FlowShell>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Детали запроса (таб «Отправленные запросы» / «ПД получены» / «ПД обработаны»)
// ════════════════════════════════════════════════════════════════════════════
export type PdDetailVariant = "sent" | "received" | "processed";

/** RID-хэш с многоточием в середине (как в макете). */
function shortRid(rid: string) {
  return rid.length > 34 ? `${rid.slice(0, 15)}...${rid.slice(-15)}` : rid;
}

export function PdRequestDetail({
  cabinet,
  current,
  variant,
  service,
  rid,
  onClose,
  onComplete,
}: {
  cabinet: CabinetConfig;
  current: string;
  variant: PdDetailVariant;
  /** Адрес сервиса кликнутой строки (колонка «Сервис»). */
  service: string;
  /** Идентификатор запроса кликнутой строки (колонка «RID пользователя»). */
  rid: string;
  onClose: () => void;
  onComplete?: () => void;
}) {
  const [sub, setSub] = useState<"main" | "basisView" | "passport">("main");
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (sub === "basisView") {
    return (
      <FlowShell
        cabinet={cabinet}
        current={current}
        title="Основание для запроса данных пользователей"
        onBack={() => setSub("main")}
      >
        <BasisTextBody paragraphs={LOREM} />
      </FlowShell>
    );
  }
  if (sub === "passport") {
    return (
      <FlowShell cabinet={cabinet} current={current} title="Паспорт" onBack={() => setSub("main")}>
        <PassportBody rows={PASSPORT_ROWS} />
      </FlowShell>
    );
  }

  const title = variant === "received" ? "ПД пользователя сервиса" : "Запрос на доступ к данным пользователей сервисов";

  const basesColumn = [
    <BasisCard key="basis" title="Законные интересы" state="filled">
      <button
        type="button"
        onClick={() => setSub("basisView")}
        className="flex items-center justify-between gap-2 rounded-[4px] border border-border bg-white px-3 py-2 text-left transition-colors hover:bg-[var(--color-grey-10)]"
      >
        <span className="ds-p3 text-foreground">Текст и файл основания</span>
      </button>
    </BasisCard>,
  ];

  return (
    <FlowShell cabinet={cabinet} current={current} title={title} onBack={onClose}>
      <RegistrationForm
        mode="view"
        compact
        headers={["Сервис", "RID пользователя", "Основания", "Документы"]}
        column1={<ValueBox>{service}</ValueBox>}
        column2={<ValueBox>{shortRid(rid)}</ValueBox>}
        bases={basesColumn}
        documents={[{ title: "Паспорт:", sub: "Фамилия, Имя" }]}
        onDocumentClick={() => setSub("passport")}
        activeColumn={-1}
      />

      {variant === "sent" && (
        <div className="flex justify-end pt-2">
          <Button variant="negative" size="l" onClick={onClose}>
            Отменить запрос
          </Button>
        </div>
      )}
      {variant === "received" && (
        <div className="flex justify-end pt-2">
          <Button size="l" onClick={() => setConfirmOpen(true)}>
            Завершить проверку
          </Button>
        </div>
      )}

      {/* Подтверждение в блокчейн (Figma 6820-554966) */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        size="s"
        title="Подтвердить ваши действия в блокчейн?"
        footer={
          <Button
            fullWidth
            onClick={() => {
              setConfirmOpen(false);
              onComplete?.();
            }}
          >
            Подтвердить действие
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="ds-p3 text-center text-foreground-muted">
            После завершения проверки данные этого пользователя вам будут недоступны.
          </p>
          <div className="ds-caption flex items-center justify-between gap-3 rounded-[4px] border border-border bg-white px-4 py-3">
            <span className="text-foreground">Завершение проверки</span>
            <span style={{ color: ACCENT }}>ООО «Сапфир»</span>
            <span style={{ color: ACCENT }}>xxxx... xxxxx</span>
            <span className="text-foreground-subtle">12.01.2020 - ...</span>
          </div>
        </div>
      </Modal>
    </FlowShell>
  );
}
