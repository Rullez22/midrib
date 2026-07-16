"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button, Input, Datepicker, Modal, Tabs, Tab, Link, Dropdown, SettingsIcon } from "@/components/ds";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { type TemplateDocStage } from "./documents-data";
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
  VERIFY_ORANGE,
  VERIFY_GREEN,
  type DefRow,
  type TxRow,
} from "./document-shared";

/**
 * DocumentTemplateFlow — флоу создания документа по шаблону компании. Открывается
 * из «Добавление нового документа» → «Шаблоны компании» (/cabinet/document/create).
 * Источник Figma: 6419-313880 → 314100/314413 → 314623 → 315770/315782 → 315499 →
 * 314762 → 314777 → 314922 → 315233 → 315432.
 *
 * Самодостаточная стейт-машина (без рейки, с `DocHeader`). Переиспользует
 * document-shared (DefTable/VerificationView/BlockchainCard/DocThumb) и DS
 * (Input/Datepicker/Modal/Tabs/Button/Link). Чат-панель — как в ValidatorChatScreen.
 */

type Step = "list" | "form" | "created" | "verify-pick" | "verify-detail" | "validating" | "ready" | "signed";

/* ── Данные ─────────────────────────────────────────────────────────────── */
const TEMPLATES = [
  { id: "license", name: "Лицензия на оказание тематических услуг связи", price: "0$" },
  { id: "rules", name: "Правила внутреннего распорядка", price: "0$" },
  { id: "cashier", name: "Журнал кассира операциониста", price: "0$" },
  { id: "staffing", name: "Штатное расписание", price: "1$" },
];

const ORANGE = VERIFY_ORANGE;
const GREEN = VERIFY_GREEN;

/** Поля формы (Figma 6419:314100/314413) с префиллом из макета. */
const PREFILL = {
  num: "166785",
  date: "11.10.2018",
  company: 'Общество с ограниченной ответственностью "Сапфир"',
  ogrn: "1167700074915",
  inn: "9715286548",
  issuer: "Роскомнадзор",
};

/** Транзакции в блокчейне по стадиям (подмножества). */
const TX_SEND: TxRow = { action: "Отправка валидатору", party: 'ООО "Сапфир"', date: "22.04.2025 - 11:20" };
const TX_VALIDATOR_SIGN: TxRow = { action: "Подпись валидатора", party: 'ООО "Слон"', date: "23.04.2025 - 15:45" };
const TX_CREATOR_SIGN: TxRow = { action: "Подпись создателя документа", party: 'ООО "Сапфир"', date: "24.04.2025 - 10:15" };

/** Этап плашки документа (для кабинета) → шаг флоу при возобновлении по клику. */
const STAGE_TO_STEP: Record<TemplateDocStage, Step> = {
  created: "created",
  verify: "verify-detail",
  validating: "validating",
  ready: "ready",
  signed: "signed",
};

export function DocumentTemplateFlow() {
  const router = useRouter();
  const flow = useRegFlow();
  const search = useSearchParams();
  // Возобновление по клику на плашку в кабинете: открываем флоу на сохранённом
  // этапе. Без resume — обычный старт со списка шаблонов.
  const resume = search.get("resume") === "1" && flow.templateDocStage != null;
  const [step, setStep] = useState<Step>(resume ? STAGE_TO_STEP[flow.templateDocStage!] : "list");
  const [tplId, setTplId] = useState<string>("license");
  const [form, setForm] = useState({ ...PREFILL });
  const [date, setDate] = useState<Date | null>(new Date(2018, 9, 11));
  const [attached, setAttached] = useState(true);
  const [showOther, setShowOther] = useState(false);
  const [vColor, setVColor] = useState(ORANGE);
  const [sendPhase, setSendPhase] = useState<"idle" | "spinner" | "popup">("idle");
  const [docTab, setDocTab] = useState("doc");

  const tpl = TEMPLATES.find((t) => t.id === tplId) ?? TEMPLATES[0];
  const exit = () => router.push("/cabinet");
  /** «Назад» из флоу: на счёт с открытым табом «Документооборот», где видна
   *  плашка документа в текущем статусе. */
  const toAccount = () => router.push("/cabinet?tab=doc");
  /** Перейти на шаг флоу, синхронно обновив этап плашки в кабинете. */
  const go = (next: Step, stage?: TemplateDocStage) => {
    if (stage) flow.setTemplateDocStage(stage);
    setStep(next);
  };

  /* Отправка на валидатора: спиннер → попап «блокчейн» → экран валидации. */
  useEffect(() => {
    if (sendPhase === "spinner") {
      const t = setTimeout(() => setSendPhase("popup"), 1200);
      return () => clearTimeout(t);
    }
    if (sendPhase === "popup") {
      const t = setTimeout(() => {
        setSendPhase("idle");
        flow.setTemplateDocStage("validating");
        setStep("validating");
      }, 1800);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendPhase]);

  /* ── Строки документа (DefTable) ── */
  const baseRows: DefRow[] = [
    { label: "Документ", value: tpl.name },
    { label: "№ лицензии", value: form.num },
    { label: "Дата принятия решения", value: form.date },
    { label: "Полное наименование компании", value: form.company },
    { label: "ОГРН", value: form.ogrn },
    { label: "ИНН компании", value: form.inn },
    { label: "Кем выдана", value: form.issuer },
  ];
  const docRows: DefRow[] = [...baseRows, { label: "Прикрепленные документы", value: <DocThumb /> }];
  const verifyRows: DefRow[] = [
    { label: "Тип верификации", value: <VerificationBadge label="Международный" color={vColor} /> },
    ...baseRows,
    { label: "Прикрепленные документы", value: <DocThumb /> },
  ];

  /* ── 1. Список шаблонов компании (6419:313880) ── */
  if (step === "list") {
    return (
      <Shell onExit={exit}>
        <BackHeader title="Добавление документа по шаблонам компании" onBack={() => router.back()} />
        <div className="flex flex-col gap-2">
          {/* Навигационная шапка списка (Figma «navigation documents» 6407:320163):
              заливка grey-10 + обводка grey-20, скруглённая, h-30, сорт-каретки. */}
          <div className="flex h-[30px] items-center rounded-[4px] border border-[var(--color-grey-20)] bg-[var(--color-grey-10)] px-6">
            <span className="ds-caption inline-flex flex-1 items-center gap-1 text-foreground-subtle">Документ <SortCaret /></span>
            <span className="ds-caption inline-flex shrink-0 items-center gap-1 text-foreground-subtle">Стоимость <SortCaret /></span>
          </div>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTplId(t.id); setStep("form"); }}
              className="ds-row flex items-center rounded-[4px] border border-border bg-surface px-6 py-4 text-left"
            >
              <span className="ds-p3 flex-1 text-foreground">{t.name}</span>
              <span className="ds-p3 shrink-0 text-foreground">{t.price}</span>
            </button>
          ))}
        </div>
      </Shell>
    );
  }

  /* ── 2. Форма заполнения (6419:314100/314413) ── */
  if (step === "form") {
    const filled = Boolean(form.num && form.date && form.company && form.ogrn && form.inn && form.issuer);
    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
    return (
      <Shell onExit={exit}>
        <BackHeader title="Форма для заполнения документа" onBack={() => setStep("list")} />
        <div className="w-full rounded-[4px] border border-border p-6">
          <div className="flex max-w-[420px] flex-col gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="ds-caption text-foreground-subtle">Документ</span>
            <span className="ds-p3 text-foreground">{tpl.name}</span>
          </div>
          <Input placeholder="№ лицензии" value={form.num} onChange={set("num")} />
          <Datepicker
            placeholder="Дата принятия решения"
            value={date}
            onChange={(d) => { setDate(d); setForm((f) => ({ ...f, date: d ? d.toLocaleDateString("ru-RU") : "" })); }}
          />
          <Input placeholder="Полное наименование компании" value={form.company} onChange={set("company")} />
          <Input placeholder="ОГРН" value={form.ogrn} onChange={set("ogrn")} />
          <Input placeholder="ИНН компании" value={form.inn} onChange={set("inn")} />
          <Input placeholder="Кем выдана" value={form.issuer} onChange={set("issuer")} />
          <div className="flex flex-col gap-2">
            <span className="ds-caption text-foreground-subtle">Документы, подтверждающие владение документом</span>
            <div className="flex flex-wrap items-center gap-3 rounded-[4px] border border-border p-4">
              <button type="button" aria-label="Добавить документ" onClick={() => setAttached(true)} className="flex h-[68px] w-[68px] items-center justify-center rounded-[4px] bg-[var(--color-blue-midhub-50)] text-2xl text-primary">+</button>
              {attached && <DocThumb />}
            </div>
          </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button size="l" disabled={!filled} onClick={() => go("created", "created")}>Создать</Button>
          <Button variant="ghost" size="l" onClick={() => setStep("list")}>Отменить</Button>
        </div>
      </Shell>
    );
  }

  /* ── 3. Созданный документ (6419:314623) ── */
  if (step === "created") {
    return (
      <Shell onExit={exit}>
        <BackHeader title={tpl.name} onBack={toAccount} />
        <DefTable rows={docRows} />
        <div className="mt-4 flex items-center gap-3">
          <Button size="l" onClick={() => { setShowOther(false); setStep("verify-pick"); }}>Добавить верификацию</Button>
          <Button variant="secondary" size="l" onClick={() => setStep("form")}>Редактировать</Button>
        </div>
      </Shell>
    );
  }

  /* ── 4-5. Выбор верификации (6419:315770 / 315782) ── */
  if (step === "verify-pick") {
    const pick = (color: string) => () => { setVColor(color); go("verify-detail", "verify"); };
    return (
      <Shell onExit={exit}>
        <BackHeader title="Добавление верификации" onBack={toAccount} />
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

  /* ── 6-7. Деталь верификации + спиннер (6419:315499 / 314762) ── */
  if (step === "verify-detail") {
    return (
      <Shell onExit={exit}>
        <BackHeader title={tpl.name} onBack={toAccount} />
        <DefTable rows={verifyRows} />
        <div className="mt-4 flex items-center gap-3">
          <Button size="l" loading={sendPhase !== "idle"} onClick={() => setSendPhase("spinner")}>Отправить на валидатора</Button>
          <Button variant="secondary" size="l" disabled={sendPhase !== "idle"} onClick={() => setStep("form")}>Редактировать</Button>
        </div>

        {/* Попап «Подтвердить действия в блокчейн» (6419:314777) */}
        <Modal open={sendPhase === "popup"} onClose={() => setSendPhase("idle")} size="m">
          <div className="flex flex-col items-center gap-4 px-2 py-2 text-center">
            <h2 className="ds-h5 text-foreground">Подтвердить ваши действия в блокчейн ?</h2>
            <p className="ds-p3 text-foreground-subtle">При создании документа ваши действия<br />сохраняться в блокчейн</p>
            <div className="flex w-full items-center justify-between gap-3 rounded-[4px] bg-[var(--color-grey-10)] px-4 py-3">
              <span className="ds-p3 text-foreground-subtle">Отправка валидатору</span>
              <Link href="#" size="p3">ООО "Сапфир"</Link>
              <Spinner />
              <span className="ds-p3 text-foreground-subtle">22.04.2025 - …</span>
            </div>
            <Button size="l" className="w-[250px]" onClick={() => setSendPhase("idle")}>Вернуться назад</Button>
          </div>
        </Modal>
      </Shell>
    );
  }

  /* ── 8-9. Валидация + чат (6419:314922 / 315233) ── */
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
                        <Button size="m" onClick={() => go("signed", "signed")}>Подписать</Button>
                      </>
                    ) : (
                      <button type="button" className="ds-p3 text-[var(--color-red-300)]" onClick={() => setStep("verify-detail")}>Отказаться от валидации</button>
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
      </Shell>
    );
  }

  /* ── 10. Финальный подписанный документ (6419:315432) — гайка вместо заголовка ── */
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
