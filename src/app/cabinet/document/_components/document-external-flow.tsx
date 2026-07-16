"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button, Input, Datepicker, Modal, Tabs, Tab, Link, Dropdown, Tooltip, SettingsIcon } from "@/components/ds";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import {
  type TemplateDocStage,
  EXTERNAL_DOC_NAME,
  EXTERNAL_PREFILL,
  EXTERNAL_COUNTRIES,
  extCountryCount,
  type ExtDoc,
} from "./documents-data";
import {
  DefTable,
  DocThumb,
  BackHeader,
  BlockchainCard,
  VerificationView,
  VerificationBadge,
  Shell,
  Spinner,
  VerifyCard,
  ChatPanel,
  SortCaret,
  InfoIcon,
  TX_FULL,
  VERIFY_ORANGE,
  VERIFY_GREEN,
  type DefRow,
  type TxRow,
} from "./document-shared";

/**
 * DocumentExternalFlow — флоу создания документа по СТОРОННИМ шаблонам. Открывается
 * из «Добавление нового документа» → «Сторонние шаблоны» (/cabinet/document/external).
 * Источник Figma: 6419:315570 → 313823/313922 → 314016/314186 → 314558 → 314713 →
 * 314858 → 314986 → 315067 → 315314 (+ плашки 6434:320847 … 6435:322257).
 *
 * Отличие от флоу «Шаблоны компании»: верификация выбирается ПЕРВОЙ, затем
 * вложенный выбор Страна→Категория→Документ. Дальше (форма → создан → валидатор →
 * чат → подпись) — 1:1 как в прошлом флоу. Максимальный переиспользование
 * document-shared (Shell/VerifyCard/ChatPanel/Spinner/DefTable/BlockchainCard).
 */

type Step = "verify-pick" | "doc-pick" | "form" | "created" | "validating" | "ready" | "signed";

const ORANGE = VERIFY_ORANGE;
const GREEN = VERIFY_GREEN;

/** Транзакции в блокчейне по стадиям. */
const TX_SEND: TxRow = { action: "Отправка валидатору", party: 'ООО "Сапфир"', date: "19.05.2025 - 12:40" };
const TX_VALIDATOR_SIGN: TxRow = { action: "Подпись валидатора", party: 'ООО "Слон"', date: "20.05.2025 - 16:10" };
const TX_CREATOR_SIGN: TxRow = { action: "Подпись создателя документа", party: 'ООО "Сапфир"', date: "21.05.2025 - 09:30" };

/** Этап плашки → шаг флоу при возобновлении по клику в кабинете. */
const STAGE_TO_STEP: Record<TemplateDocStage, Step> = {
  created: "created",
  verify: "created",
  validating: "validating",
  ready: "ready",
  signed: "signed",
};

export function DocumentExternalFlow() {
  const router = useRouter();
  const flow = useRegFlow();
  const search = useSearchParams();
  const resume = search.get("resume") === "1" && flow.externalDocStage != null;
  const [step, setStep] = useState<Step>(resume ? STAGE_TO_STEP[flow.externalDocStage!] : "verify-pick");
  const [showOther, setShowOther] = useState(false);
  const [vColor, setVColor] = useState(ORANGE);
  const [form, setForm] = useState({ ...EXTERNAL_PREFILL });
  const [date, setDate] = useState<Date | null>(new Date(2018, 7, 3));
  const [attached, setAttached] = useState(true);
  const [sendPhase, setSendPhase] = useState<"idle" | "spinner" | "popup">("idle");
  const [signOpen, setSignOpen] = useState(false);
  const [docTab, setDocTab] = useState("doc");

  const exit = () => router.push("/cabinet");
  /** «Назад» из флоу: на счёт с открытым табом «Документооборот» (плашка документа). */
  const toAccount = () => router.push("/cabinet?tab=doc");
  /** Перейти на шаг флоу, синхронно обновив этап плашки в кабинете. */
  const go = (next: Step, stage?: TemplateDocStage) => {
    if (stage) flow.setExternalDocStage(stage);
    setStep(next);
  };

  /* Отправка на валидатора: спиннер → попап «блокчейн» → окно валидации. */
  useEffect(() => {
    if (sendPhase === "spinner") {
      const t = setTimeout(() => setSendPhase("popup"), 1200);
      return () => clearTimeout(t);
    }
    if (sendPhase === "popup") {
      const t = setTimeout(() => {
        setSendPhase("idle");
        flow.setExternalDocStage("validating");
        setStep("validating");
      }, 1800);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendPhase]);

  /* ── Строки документа (DefTable) — верификация уже выбрана ── */
  const baseRows: DefRow[] = [
    { label: "Документ", value: EXTERNAL_DOC_NAME },
    { label: "Полное наименование компании", value: form.company },
    { label: "ОГРН", value: form.ogrn },
    { label: "Дата постановки на учет", value: form.date },
    { label: "Налоговый орган", value: form.taxOrg },
    { label: "Код налогового органа", value: form.taxCode },
    { label: "ИНН компании", value: form.inn },
    { label: "КПП компании", value: form.kpp },
    { label: "Кем подписан документ", value: form.signedBy },
  ];
  const verifyRows: DefRow[] = [
    { label: "Тип верификации", value: <VerificationBadge label="Международный" color={vColor} /> },
    ...baseRows,
    { label: "Прикрепленные документы", value: <DocThumb /> },
  ];

  /* ── 1. Выбор верификации (6419:315570 / 315604) ── */
  if (step === "verify-pick") {
    const pick = (color: string) => () => { setVColor(color); setStep("doc-pick"); };
    return (
      <Shell onExit={exit}>
        <BackHeader title="Добавление верификации" onBack={() => router.back()} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <VerifyCard title="Международная верификация" onYellow={pick(ORANGE)} onGreen={pick(GREEN)} />
          <VerifyCard title="Локальная верификация" onYellow={pick(ORANGE)} onGreen={pick(GREEN)} />
        </div>
        {!showOther ? (
          <Button variant="secondary" size="l" className="self-center" onClick={() => setShowOther(true)}>Посмотреть другие верификации</Button>
        ) : (
          <div className="flex flex-col gap-4 rounded-[4px] border border-border p-6">
            <span className="ds-p2-medium text-foreground">Банковская проверка</span>
            <p className="ds-p3 text-foreground-subtle">Описание: банк-партнёр сверяет реквизиты компании с данными расчётного счёта — ИНН, ОГРН и подписанта документа. После сверки документ получает отметку о финансовой благонадёжности, её видят все участники кооператива. Проверка занимает до 3 рабочих дней и продлевается раз в год.</p>
            <Button size="m" className="self-start" onClick={pick(ORANGE)}>Выбрать</Button>
          </div>
        )}
      </Shell>
    );
  }

  /* ── 2. Вложенный выбор документа (6419:313823 / 313922) ── */
  if (step === "doc-pick") {
    return (
      <Shell onExit={exit}>
        <BackHeader title="Добавление документа по сторонним шаблонам" onBack={() => setStep("verify-pick")} />
        <CountryPicker onPick={() => setStep("form")} />
      </Shell>
    );
  }

  /* ── 3. Форма заполнения (6419:314016 / 314186) ── */
  if (step === "form") {
    const filled = Boolean(form.company && form.ogrn && form.date && form.taxOrg && form.taxCode && form.inn && form.kpp && form.signedBy);
    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
    return (
      <Shell onExit={exit}>
        <BackHeader title="Форма для заполнения документа" onBack={() => setStep("doc-pick")} />
        <div className="w-full rounded-[4px] border border-border p-6">
          <div className="flex max-w-[420px] flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="ds-caption text-foreground-subtle">Тип верификации</span>
              <VerificationBadge label="Международный" color={vColor} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="ds-caption text-foreground-subtle">Документ</span>
              <span className="ds-p3 text-foreground">{EXTERNAL_DOC_NAME}</span>
            </div>
            <Input placeholder="Полное наименование компании" value={form.company} onChange={set("company")} />
            <Input placeholder="ОГРН" value={form.ogrn} onChange={set("ogrn")} />
            <Datepicker
              placeholder="Дата постановки на учет"
              value={date}
              onChange={(d) => { setDate(d); setForm((f) => ({ ...f, date: d ? d.toLocaleDateString("ru-RU") : "" })); }}
            />
            <Input placeholder="Налоговый орган" value={form.taxOrg} onChange={set("taxOrg")} />
            <Input placeholder="Код налогового органа" value={form.taxCode} onChange={set("taxCode")} />
            <Input placeholder="ИНН компании" value={form.inn} onChange={set("inn")} />
            <Input placeholder="КПП компании" value={form.kpp} onChange={set("kpp")} />
            <Input placeholder="Кем подписан документ" value={form.signedBy} onChange={set("signedBy")} />
            <div className="flex flex-col gap-2">
              <span className="ds-caption text-foreground-subtle">Документы, подтверждающие владение документом</span>
              <div className="flex flex-wrap items-center gap-3 rounded-[4px] border border-border p-4">
                <button type="button" aria-label="Добавить документ" onClick={() => setAttached(true)} className="flex h-[68px] w-[68px] items-center justify-center rounded-[4px] bg-[var(--color-blue-midhub-50)] text-2xl text-primary transition-colors hover:bg-[color:var(--color-blue-midhub-100)]">+</button>
                {attached && <DocThumb />}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button size="l" disabled={!filled} onClick={() => go("created", "created")}>Создать</Button>
          <Button variant="ghost" size="l" onClick={() => setStep("doc-pick")}>Отменить</Button>
        </div>
      </Shell>
    );
  }

  /* ── 4. Созданный документ (6419:314558) ── */
  if (step === "created") {
    return (
      <Shell onExit={exit}>
        <BackHeader title={EXTERNAL_DOC_NAME} onBack={toAccount} />
        <DefTable rows={verifyRows} />
        <div className="mt-4 flex items-center gap-3">
          <Button size="l" loading={sendPhase !== "idle"} onClick={() => setSendPhase("spinner")}>Отправить на валидатора</Button>
          <Button variant="secondary" size="l" disabled={sendPhase !== "idle"} onClick={() => setStep("form")}>Редактировать</Button>
        </div>

        {/* Попап «Подтвердить действия в блокчейн» (6419:314713) */}
        <Modal open={sendPhase === "popup"} onClose={() => setSendPhase("idle")} size="m">
          <div className="flex flex-col items-center gap-4 px-2 py-2 text-center">
            <h2 className="ds-h5 text-foreground">Подтвердить ваши действия в блокчейн ?</h2>
            <p className="ds-p3 text-foreground-subtle">При создании документа ваши действия<br />сохраняться в блокчейн</p>
            <div className="flex w-full items-center justify-between gap-3 rounded-[4px] bg-[var(--color-grey-10)] px-4 py-3">
              <span className="ds-p3 text-foreground-subtle">Отправка валидатору</span>
              <Link href="#" size="p3">ООО "Сапфир"</Link>
              <Spinner />
              <span className="ds-p3 text-foreground-subtle">19.05.2025 - …</span>
            </div>
            <Button size="l" className="w-[250px]" onClick={() => setSendPhase("idle")}>Вернуться назад</Button>
          </div>
        </Modal>
      </Shell>
    );
  }

  /* ── 5-6. Окно валидатора + чат (6419:314858 / 314986) ── */
  if (step === "validating" || step === "ready") {
    const ready = step === "ready";
    const txRows: TxRow[] = ready ? [TX_VALIDATOR_SIGN, TX_SEND] : [TX_SEND];
    return (
      <Shell onExit={exit}>
        <BackHeader
          onBack={toAccount}
          title={
            <Tabs value={docTab} onValueChange={setDocTab} variant="solid-light" size="m" aria-label="Документ / Консультант">
              <Tab value="doc">Документ</Tab>
              <Tab value="consult">Консультант</Tab>
            </Tabs>
          }
        />
        <div className="flex flex-col gap-6">
          {/* Документ + чат в один уровень (чат = высота блока документа, без транзакций) */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
            <div className="min-w-0 flex-1">
              {docTab === "doc" && (
                <div className="ds-row overflow-hidden rounded-[4px] border border-border">
                  <DefTable rows={verifyRows} flush />
                  <div className="flex flex-wrap items-center justify-end gap-4 border-t border-border bg-[var(--color-grey-10)] px-6 py-4">
                    {ready ? (
                      <>
                        <Link href="#" size="p3" className="text-[var(--color-red-300)]">Отказаться от валидации</Link>
                        <Button variant="secondary" size="m" onClick={() => setStep("validating")}>Вернуть валидатору</Button>
                        <Button size="m" onClick={() => setSignOpen(true)}>Подписать</Button>
                      </>
                    ) : (
                      <button type="button" className="ds-p3 text-[var(--color-red-300)]" onClick={() => setStep("created")}>Отказаться от валидации</button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <ChatPanel onAdvance={ready ? undefined : () => go("ready", "ready")} />
          </div>

          {/* Транзакции в блокчейне — ниже, по ширине блока документа (без чата) */}
          {docTab === "doc" && (
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="min-w-0 flex-1"><BlockchainCard rows={txRows} /></div>
              <div className="hidden lg:block lg:w-[300px] lg:shrink-0" aria-hidden />
            </div>
          )}
        </div>

        {/* Попап подписи (6419:315067) → подписанный документ */}
        <Modal open={signOpen} onClose={() => setSignOpen(false)} size="m">
          <div className="flex flex-col items-center gap-4 px-2 py-2 text-center">
            <h2 className="ds-h5 text-foreground">Подтвердить ваши действия в блокчейн ?</h2>
            <p className="ds-p3 text-foreground-subtle">При создании документа ваши действия<br />сохраняться в блокчейн</p>
            <div className="flex w-full items-center justify-between gap-3 rounded-[4px] bg-[var(--color-grey-10)] px-4 py-3">
              <span className="ds-p3 text-foreground-subtle">Подпись создателя</span>
              <Link href="#" size="p3">ООО "Сапфир"</Link>
              <span className="flex items-center gap-1.5">
                <Link href="#" size="p3">5c243af… 07db8</Link>
                <Tooltip content={<span className="break-all">{TX_FULL}</span>} side="top"><span className="inline-flex cursor-help"><InfoIcon /></span></Tooltip>
              </span>
              <span className="ds-p3 text-foreground-subtle">21.05.2025 - …</span>
            </div>
            <Button size="l" className="w-[250px]" onClick={() => { setSignOpen(false); go("signed", "signed"); }}>Подтвердить действие</Button>
          </div>
        </Modal>
      </Shell>
    );
  }

  /* ── 7. Финальный подписанный документ (6419:315314) — гайка вместо заголовка ── */
  return (
    <Shell onExit={exit}>
      <BackHeader
        onBack={toAccount}
        actions={
          <Dropdown
            items={[
              { value: "edit", label: "Редактировать" },
              { value: "verify", label: "Добавить верификацию" },
            ]}
            onSelect={(v) => setStep(v === "edit" ? "form" : "verify-pick")}
            align="end"
            trigger={({ open }) => (
              <button
                type="button"
                aria-label="Действия"
                className={cn("flex size-10 items-center justify-center rounded-[4px] border bg-surface-sunken text-foreground-subtle", open ? "border-[var(--color-blue-midhub-500)]" : "border-border")}
              >
                <SettingsIcon className="size-5" />
              </button>
            )}
          />
        }
      />
      <VerificationView rows={verifyRows} txRows={[TX_CREATOR_SIGN, TX_VALIDATOR_SIGN, TX_SEND]} />
    </Shell>
  );
}

/* ── Вложенный выбор: поиск + аккордеоны Страна → Категория → таблица докум. ── */
function CountryPicker({ onPick }: { onPick: () => void }) {
  const [query, setQuery] = useState("");
  const [openCountry, setOpenCountry] = useState<string | null>("ru");
  const [openCat, setOpenCat] = useState<string | null>("ru/Делопроизводство");
  const [showAll, setShowAll] = useState(false);

  const countries = showAll ? EXTERNAL_COUNTRIES : EXTERNAL_COUNTRIES.slice(0, 1);
  const q = query.trim().toLowerCase();
  const docMatch = (d: ExtDoc) => !q || d.name.toLowerCase().includes(q);

  return (
    <div className="flex flex-col gap-4">
      <Input placeholder="Поиск документа" value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="flex flex-col gap-2">
        {countries.map((c) => {
          const countryOpen = openCountry === c.code;
          return (
            <div key={c.code} className="flex flex-col gap-2">
              {/* Заголовок страны: флаг + название + количество + шеврон справа */}
              <button
                type="button"
                onClick={() => setOpenCountry(countryOpen ? null : c.code)}
                className="flex h-[52px] items-center gap-3 rounded-[4px] border border-[var(--color-grey-20)] bg-[var(--color-grey-10)] px-6 text-left"
              >
                <span className="text-lg leading-none">{c.flag}</span>
                <span className="ds-p3-medium flex-1 text-foreground">{c.name} ({extCountryCount(c)})</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-5 text-foreground-subtle transition-transform", countryOpen && "rotate-180")}>
                  <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Категории страны */}
              {countryOpen && (
                <div className="flex flex-col">
                  {c.categories.map((cat) => {
                    const key = `${c.code}/${cat.name}`;
                    const catOpen = openCat === key;
                    const docs = cat.docs.filter(docMatch);
                    if (q && docs.length === 0) return null;
                    return (
                      <div key={key} className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => setOpenCat(catOpen ? null : key)}
                          className="flex items-center gap-2 px-2 py-2 text-left"
                        >
                          <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-4 text-foreground-subtle transition-transform", catOpen && "rotate-90")}>
                            <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="ds-p3 text-foreground-subtle">{cat.name}</span>
                        </button>

                        {catOpen && (
                          <div className="flex flex-col gap-2 pb-2">
                            {/* Шапка таблицы документов */}
                            <div className="flex h-[30px] items-center rounded-[4px] border border-[var(--color-grey-20)] bg-[var(--color-grey-10)] px-6">
                              <span className="ds-caption inline-flex flex-1 items-center gap-1 text-foreground-subtle">Документ <SortCaret /></span>
                              <span className="ds-caption inline-flex shrink-0 items-center gap-1 text-foreground-subtle">Стоимость <SortCaret /></span>
                            </div>
                            {docs.map((d) => {
                              const isTarget = d.name === EXTERNAL_DOC_NAME;
                              return (
                                <button
                                  key={d.name}
                                  type="button"
                                  onClick={isTarget ? onPick : undefined}
                                  className={cn(
                                    "flex items-center rounded-[4px] border border-border bg-surface px-6 py-4 text-left transition-colors",
                                    isTarget ? "ds-row cursor-pointer" : "cursor-default",
                                  )}
                                >
                                  <span className="ds-p3 flex-1 text-foreground">{d.name}</span>
                                  <span className="ds-p3 shrink-0 text-foreground">{d.price}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showAll && (
        <Button variant="secondary" size="l" className="self-center" onClick={() => setShowAll(true)}>Еще страны</Button>
      )}
    </div>
  );
}
