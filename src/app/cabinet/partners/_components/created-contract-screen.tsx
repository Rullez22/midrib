"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Button, Badge, Modal, Input, Textarea, Link, FeedComposerBar, FeedPost, type FeedMedia } from "@/components/ds";
import { cn } from "@/lib/cn";
import { useRegFlow, type CreatedContract } from "../../../flow/company-create/_components/reg-flow";
import { CompanySidebar } from "../../[company]/_components/company-sidebar";
import { type CabinetConfig } from "../../[company]/_config/cabinets";
import { BlockchainCard, ChatPanel, type TxRow, type ChatPanelMsg } from "../../document/_components/document-shared";
import { type Org } from "./partners-data";
import { AttachedDoc, DocsTable, PublicationForm, DocsEmptyIcon, Field, ExtIcon, BackIcon, CloseIcon } from "./org-contract-screen";
import { NestedDocsBlock } from "./nested-docs-block";
import { KINDS, type PartyRole } from "./doc-kinds";

/**
 * CreatedContractScreen — окно созданного документа (договор / счёт / акт).
 * Машина состояний: created (!signed) → waiting (signed, авто-транзакции и чат
 * каждые ~2с) → final (Согласован). Таб «Консультант»: поиск→выбор→форма→окно
 * консультации→завершение. Метки/последовательности — из KINDS[kind].
 * Акт — терминальный (у готового только «Публикация», без блока «Документы»).
 */

const ME_PHOTO = "/members/ilya.png";
const CONSULTANT = {
  name: "ИП Наталья Верная",
  photo: "/members/rozalina.png",
  services:
    "Услуги: lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna sed do eiusmod tempor",
};
const CONSULT_CHAT: ChatPanelMsg[] = [
  { me: true, text: "Привет, консультант. Можешь помочь?", time: "15:01" },
  { me: true, text: "Найди пожалуйста ГОСТ", time: "15:02" },
  { text: "Привет менеджер фонда. Уже прикрепил Гост 111/12 ФНС от 01.06.2017", time: "15:20" },
];

function partyName(role: PartyRole, org: Org): string {
  if (role === "executor") return "Elephant";
  if (role === "validator") return "MIDHUB";
  return (org.name.split(" ").pop() ?? "Партнёр").replace(/[«»"„“]/g, "");
}

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-[var(--color-yellow-400,#f5b731)]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4" fill="currentColor"><path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" /></svg>
      ))}
    </span>
  );
}

function ContractFields({ c }: { c: CreatedContract }) {
  const nameLabel = KINDS[c.kind].nameLabel.replace("*", "");
  return (
    <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Заказчик" value={<span className="inline-flex items-center gap-1 text-primary">{c.customer}<ExtIcon /></span>} />
      <Field label="Исполнитель" value={c.executor} />
      <Field label={nameLabel} value={c.name} />
      <Field label="Номер" value={c.number} />
      <Field label="Код" value={c.code} />
      <Field label="Сумма" value={c.amount} />
      <Field label="Комментарии" value={c.comment} />
    </div>
  );
}

/* ── Лента процесса исполнения (посты) ───────────────────────────────────── */
const PROCESS_POSTS = [
  {
    title: "Старт работ по договору",
    date: "12 Января, 2020",
    text: "Приступили к исполнению договора: закупили материалы и согласовали план работ с исполнителем.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80",
  },
  {
    title: "Промежуточный отчёт",
    date: "18 Января, 2020",
    text: "Выполнено около 60% работ. Прикладываем фотоотчёт и обновлённую смету по договору.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80",
  },
];

function ContractFeed() {
  return (
    <>
      {PROCESS_POSTS.map((p, i) => {
        const media: FeedMedia = { type: "image", src: p.image };
        return (
          <div key={i} className="flex flex-col gap-2">
            <FeedPost title={p.title} date={p.date} text={p.text} media={media} />
          </div>
        );
      })}
    </>
  );
}

function DocsEmptyForContract() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 py-8 text-center">
      <DocsEmptyIcon />
      <p className="ds-p3 text-foreground-subtle">Тут будут документы относящиеся к договору</p>
    </div>
  );
}

/* ── Ветка «Консультант»: поиск → выбор → форма ──────────────────────────── */
function ConsultantSelect({ onAdd }: { onAdd: (amount: string, task: string) => void }) {
  const [query, setQuery] = useState("ИП Наталья Верная");
  const [picked, setPicked] = useState(false);
  const [amount, setAmount] = useState("");
  const [task, setTask] = useState("");
  const showCard = query.trim() !== "";
  const valid = amount.trim() !== "" && task.trim() !== "";

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="ds-h4 text-foreground">Добавление консультанта</h1>
        <p className="ds-p3 max-w-[560px] text-foreground-subtle">
          Консультант поможет юридически правильно заполнить ваш документ, подскажет лучшее решение для ваших вопросов и выполнит оплаченную услугу.
        </p>
      </div>

      <span className="ds-caption text-center uppercase tracking-wide text-foreground-subtle">Выбор консультанта (шаг 1 из 2)</span>

      {!picked && (
        <Input
          leftIcon={<svg viewBox="0 0 20 20" fill="none" className="size-4"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" /><path d="m14 14 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
          rightIcon={query ? <button type="button" aria-label="Очистить" onClick={() => setQuery("")}><svg viewBox="0 0 20 20" fill="none" className="size-4"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button> : undefined}
          placeholder="Название консультанта"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {(picked || showCard) && (
        <div className="flex flex-col gap-4 rounded-[4px] border border-border p-4 md:flex-row">
          <span className="block size-[130px] shrink-0 overflow-hidden rounded-[6px] bg-[var(--color-grey-10)]">
            <img src={CONSULTANT.photo} alt="" className="size-full object-cover" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <span className="ds-p1-medium text-foreground">{CONSULTANT.name}</span>
              <Stars />
            </div>
            <p className="ds-p3 text-foreground-subtle">{CONSULTANT.services}</p>
            <div className="mt-2 flex items-center gap-6">
              {picked ? (
                <Button variant="secondary" size="s" onClick={() => setPicked(false)}>Отменить выбор</Button>
              ) : (
                <Button size="s" onClick={() => setPicked(true)}>Выбрать консультанта</Button>
              )}
              <Link href="#" size="p3">Подробнее о консультанте</Link>
            </div>
          </div>
        </div>
      )}

      {picked && (
        <>
          <span className="ds-caption text-center uppercase tracking-wide text-foreground-subtle">Форма для заполнения запроса (шаг 2 из 2)</span>
          <div className="flex flex-col gap-4 rounded-[4px] border border-border p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Input className="w-[220px]" placeholder="Сумма*" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <span className="rounded-[4px] bg-[var(--color-green-50,#e9f7ee)] px-3 py-2 ds-p3 text-[var(--color-green-600,#2e9e5b)]">Доступная сумма : 250 000 ₽</span>
            </div>
            <Textarea placeholder="Описание задачи*" rows={3} value={task} onChange={(e) => setTask(e.target.value)} />
          </div>
          <div className="flex items-center gap-6">
            <Button size="l" disabled={!valid} onClick={() => onAdd(amount.trim(), task.trim())}>Добавить консультанта</Button>
            {valid && <Button variant="tertiary" size="l" onClick={() => setPicked(false)}>Отменить</Button>}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Окно консультации (консультант добавлен) ────────────────────────────── */
function ConsultationWindow({ c, onFinish }: { c: CreatedContract; onFinish: () => void }) {
  const [open, setOpen] = useState(true);
  const [docTab, setDocTab] = useState("docs");
  const cons = c.consultant!;
  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-[4px] border border-border">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-center gap-2 border-b border-border px-6 py-4">
          <span className="ds-p3 text-foreground-subtle">Ваш консультант:</span>
          <span className="ds-p2-medium text-foreground">{cons.name}</span>
          <span className={cn("text-foreground-subtle transition-transform", open && "rotate-180")}><svg viewBox="0 0 24 24" className="size-4" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </button>
        {open && (
          <>
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:gap-10">
              <div className="flex flex-1 items-center gap-4">
                <span className="block size-[90px] shrink-0 overflow-hidden rounded-full bg-[var(--color-grey-10)]">
                  <img src={CONSULTANT.photo} alt="" className="size-full object-cover" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <span className="ds-p1-medium inline-flex items-center gap-1 text-foreground">{cons.name}<ExtIcon /></span>
                  <Stars />
                  <span className="ds-caption text-foreground-subtle">300 отзывов</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-5">
                <Field label="Документ" value={`${c.name} - № ${c.number}`} />
                <Field label="Описание задачи" value={cons.task} />
              </div>
              <div className="flex-1">
                <Field label="Плата за консультацию" value={cons.amount} />
              </div>
            </div>
            <div className="flex justify-end border-t border-border bg-surface-sunken px-6 py-4">
              {!c.consultationDone && <Button size="m" onClick={onFinish}>Завершить консультацию</Button>}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-[4px] border border-border p-6">
          <Tabs value={docTab} onValueChange={setDocTab} variant="basic" size="m" aria-label="Документы">
            <Tab value="docs">Документы</Tab>
            <Tab value="pub">Публикация</Tab>
          </Tabs>
          {docTab === "docs" ? <DocsTable /> : <FeedComposerBar avatar={ME_PHOTO} />}
        </div>
        <ChatPanel title="Чат с консультантом" messages={CONSULT_CHAT} />
      </div>

      <div className="mt-2 flex flex-col gap-5">
        <h2 className="ds-h5 text-foreground">Процесс исполнения консультации</h2>
      </div>
    </div>
  );
}

export function CreatedContractScreen({
  org,
  contractId,
  cabinet,
  basePath,
  sidebarCurrent = "partners",
  showNested = true,
}: {
  org: Org;
  contractId: string;
  cabinet?: CabinetConfig;
  /** Переопределение базового пути (встраивание флоу, напр. в раздел Цели). */
  basePath?: string;
  /** Активный пункт в CompanySidebar. */
  sidebarCurrent?: string;
  /** Показывать блок вложенных документов (в цели — false). */
  showNested?: boolean;
}) {
  const router = useRouter();
  const { getCreatedContract, signCreatedContract, addConsultant, finishConsultation } = useRegFlow();
  const c = getCreatedContract(contractId);
  const [tab, setTab] = useState<"main" | "consultant">("main");
  const [modal, setModal] = useState(false);

  const base = basePath ?? (cabinet ? `/cabinet/${cabinet.slug}/partners/org/${org.id}` : `/cabinet/partners/org/${org.id}`);
  const back = () => router.push(c?.parentId ? `${base}/doc/${c.parentId}` : base);

  if (!c) {
    return (
      <div className="flex min-h-screen bg-background">
        {cabinet ? <CompanySidebar cabinet={cabinet} current={sidebarCurrent} /> : null}
        <main className="flex min-w-0 flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
          <p className="ds-p2 text-foreground-subtle">Документ не найден. Возможно, страница была перезагружена.</p>
          <Button size="m" onClick={back}>Назад к документам</Button>
        </main>
      </div>
    );
  }

  const cfg = KINDS[c.kind];
  const final = c.finalized;
  const waiting = c.signed && !c.finalized;

  // Блокчейн: консультант · авто-шаги (сверху) · Подпись исполнителя · Добавление.
  const tx: TxRow[] = [];
  if (c.consultationDone) tx.push({ action: "Добавление консультанта", party: "Elephant", date: "11.01.2020 - 15:00" });
  for (let i = c.step; i >= 1; i--) {
    const s = cfg.steps[i - 1];
    tx.push({ action: s.tx.action, party: partyName(s.tx.role, org), date: s.tx.date });
  }
  if (c.signed) tx.push({ action: cfg.signTxAction ?? "Подпись исполнителя", party: cfg.signTxParty ?? "Elephant", date: cfg.baseTxDate });
  tx.push({ action: cfg.txAdd, party: cfg.addParty ?? "Elephant", date: cfg.baseTxDate });

  // Чат: created — пусто; после подписи — базовый + сообщения авто-шагов.
  const chat: ChatPanelMsg[] = c.signed
    ? [...cfg.baseChat, ...cfg.steps.slice(0, c.step).map((s) => ({ text: s.chat.text, time: s.chat.time }))]
    : [];

  const doSign = () => { signCreatedContract(c.id); setModal(false); };
  const onEdit = () => router.push(`${base}/contract-new?kind=${c.kind}&edit=${c.id}`);
  const onAddConsultant = (amount: string, task: string) => { addConsultant(c.id, { name: CONSULTANT.name, amount, task }); };
  const onFinishConsult = () => { finishConsultation(c.id); setTab("main"); };

  const showConsultant = tab === "consultant" && !final;

  const lowerSection = final ? (
    <div className="flex flex-col gap-6">
      {showNested && !cfg.terminal && <NestedDocsBlock org={org} cabinet={cabinet} parentDocId={c.id} />}
      <PublicationForm />
      <div className="mt-2 flex flex-col gap-5">
        <h2 className="ds-h5 text-foreground">{cfg.processTitle}</h2>
        <ContractFeed />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-6 lg:pr-[324px]">
      <div className="flex flex-col gap-4 rounded-[4px] border border-border p-6">
        <ContractDocsPub />
      </div>
      <div className="mt-2 flex flex-col gap-5">
        <h2 className="ds-h5 text-foreground">{cfg.processTitle}</h2>
        <ContractFeed />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {cabinet ? <CompanySidebar cabinet={cabinet} current={sidebarCurrent} /> : null}

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-6 md:px-[50px]">
          <div className="relative flex min-h-[40px] items-center">
            <button type="button" aria-label="Назад" onClick={back} className="flex size-10 items-center justify-center rounded-[6px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground">
              <BackIcon />
            </button>
            {!final ? (
              <div className="absolute left-1/2 -translate-x-1/2">
                <Tabs value={tab} onValueChange={(v) => setTab(v as "main" | "consultant")} variant="solid" size="m" equal aria-label="Роль">
                  <Tab value="main">{cfg.doc}</Tab>
                  <Tab value="consultant">Консультант</Tab>
                </Tabs>
              </div>
            ) : (
              <button type="button" aria-label="Закрыть" onClick={back} className="ml-auto flex size-10 items-center justify-center rounded-[6px] border border-[color:var(--color-red-200)] bg-[color:var(--color-red-50,#fdeceb)] text-[color:var(--color-red-500)] transition-colors hover:bg-[color:var(--color-red-100,#f9d5d2)]">
                <CloseIcon />
              </button>
            )}
          </div>

          {showConsultant ? (
            !c.consultant ? (
              <ConsultantSelect onAdd={onAddConsultant} />
            ) : (
              <ConsultationWindow c={c} onFinish={onFinishConsult} />
            )
          ) : final ? (
            <>
              <div className="overflow-hidden rounded-[4px] border border-border">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
                  <span className="ds-p1-medium text-foreground">{c.name}</span>
                  <span className="ds-p2-medium text-foreground">{c.amount}</span>
                  <Badge variant="soft" color="green">Согласован</Badge>
                  <span className="ds-p3 text-foreground-subtle">11.01.2020</span>
                </div>
                <div className="flex flex-col gap-6 border-b border-border p-6 md:flex-row">
                  <ContractFields c={c} />
                  <AttachedDoc name={c.attachedName} meta={c.attachedMeta} />
                </div>
                <BlockchainCard rows={tx} className="rounded-none border-0" />
              </div>
              {lowerSection}
            </>
          ) : (
            <>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
                <div className="flex min-w-0 flex-1 flex-col gap-6">
                  <div className="overflow-hidden rounded-[4px] border border-border">
                    <div className="flex flex-col gap-6 p-6 md:flex-row">
                      <ContractFields c={c} />
                      <AttachedDoc name={c.attachedName} meta={c.attachedMeta} />
                    </div>
                    <div className="flex justify-end gap-3 border-t border-border bg-surface-sunken px-6 py-4">
                      <Button variant="secondary" size="l" className="min-w-[200px]" disabled={c.signed} onClick={onEdit}>Редактировать</Button>
                      <Button size="l" className="min-w-[200px]" disabled={waiting} onClick={() => setModal(true)}>Подписать</Button>
                    </div>
                  </div>
                  <BlockchainCard rows={tx} />
                </div>
                <ChatPanel title={c.signed ? cfg.participants : "1 Участник"} messages={chat} />
              </div>
              {lowerSection}
            </>
          )}
        </div>
      </main>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        size="m"
        title="Подтвердить ваши действия в блокчейн?"
        footer={<Button size="l" onClick={doSign}>Подтвердить действие</Button>}
      >
        <div className="flex flex-col items-center gap-6">
          <p className="ds-p3 text-center text-foreground-subtle">При подписании документа ваши действия сохранятся в блокчейн</p>
          <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-[4px] bg-surface-sunken px-4 py-3">
            <span className="ds-caption text-foreground-subtle">Подпись исполнителя</span>
            <span className="ds-p3-medium flex items-center gap-1.5 text-primary">🐘 Elephant</span>
            <Link href="#" size="p3">xxxxxxx… xxxxx</Link>
            <span className="ds-p3 text-foreground-subtle">{cfg.baseTxDate}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/** Документы/Публикация для created/waiting: пустой стейт + композер. */
function ContractDocsPub() {
  const [t, setT] = useState("docs");
  return (
    <>
      <Tabs value={t} onValueChange={setT} variant="basic" size="m" aria-label="Документы договора">
        <Tab value="docs">Документы</Tab>
        <Tab value="pub">Публикация</Tab>
      </Tabs>
      {t === "docs" ? <DocsEmptyForContract /> : <FeedComposerBar avatar={ME_PHOTO} />}
    </>
  );
}
