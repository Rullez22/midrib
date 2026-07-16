"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Button, Badge, Modal, Input, Textarea, Link, FeedPost, FeedComposerBar, TableHeader, type FeedMedia } from "@/components/ds";
import { cn } from "@/lib/cn";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { CompanySidebar } from "../../[company]/_components/company-sidebar";
import { type CabinetConfig } from "../../[company]/_config/cabinets";
import { BlockchainCard, ChatPanel } from "../../document/_components/document-shared";
import { NestedDocsBlock } from "./nested-docs-block";
import { type Org, type OrgContract } from "./partners-data";

/**
 * OrgContractScreen — детальный экран договора партнёра (Figma 6760-460186 —
 * неподписанный · 6760-461111 — подписанный). Открывается по оранжевому документу
 * «Ожидает участия» в Документообороте организации.
 *
 * Reuse: CompanySidebar · BlockchainCard/ChatPanel/DocThumb (document-shared) ·
 * DS Modal (подтверждение подписи) · FeedPost (процесс исполнения) · Badge/Button/
 * Input/Textarea/Tabs/Link. Состояние «подписан» хранится в RegFlow.signedContracts.
 */

export function BackIcon() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function CloseIcon() {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-4"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
export function ExtIcon() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4"><path d="M6 4h6v6M12 4 5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PdfIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-8 text-primary">
      <path d="M8 3h11l6 6v20H8V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M19 3v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
export function DocsEmptyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className="size-10 text-primary">
      <rect x="9" y="6" width="18" height="24" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="11" width="18" height="24" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18 18h10M18 23h10M18 28h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Field({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="ds-caption text-foreground-subtle">{label}</span>
      <span className="ds-p3 text-foreground">{value}</span>
    </div>
  );
}

/** Блок «Прикрепленный документ» (серая плитка с иконкой PDF). */
export function AttachedDoc({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[6px] border border-border bg-surface-sunken p-4 md:w-[280px]">
      <span className="ds-caption text-center text-foreground-subtle">Прикрепленный документ</span>
      <div className="flex flex-col items-center gap-1.5 rounded-[6px] bg-[#fff] py-5">
        <PdfIcon />
        <span className="ds-p3 text-foreground">{name}</span>
        <span className="ds-caption text-foreground-subtle">{meta}</span>
      </div>
    </div>
  );
}

/** Информационные поля договора (Заказчик/Исполнитель/…). */
function ContractInfo({ c }: { c: OrgContract }) {
  return (
    <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Заказчик" value={<span className="inline-flex items-center gap-1 text-primary">{c.customer}<ExtIcon /></span>} />
      <Field label="Исполнитель" value={c.executor} />
      <Field label="Название договора" value={c.name} />
      <Field label="Номер" value={c.number} />
      <Field label="Кор" value={c.kor} />
      <Field label="Сумма" value={c.amount} />
      <Field label="Комментарии" value={c.comment} />
    </div>
  );
}

/** Таблица документов договора — таб «Документы» (Figma 6760-460370):
 *  muted-шапка (Название документа · Добавил · Дата создания) + строка документа.
 *  Reuse: DS TableHeader. */
export function DocsTable() {
  return (
    <div className="flex flex-col gap-3">
      <TableHeader
        size="s"
        tone="muted"
        columns={[
          { key: "name", label: "Название документа", flex: 2 },
          { key: "added", label: "Добавил", align: "center", flex: 1 },
          { key: "date", label: "Дата создания", align: "right", flex: 1 },
        ]}
      />
      <div className="ds-row flex items-center gap-2 rounded-[4px] border border-border bg-surface px-6 py-3">
        <div className="flex flex-[2] flex-col gap-0.5">
          <span className="ds-p3 text-foreground-subtle">Другой документ</span>
          <span className="ds-p3 text-foreground">Гост 111/12 ФНС от 01.06.2017</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="block size-6 shrink-0 overflow-hidden rounded-full bg-[var(--color-grey-10)]">
            <img src="/members/rozalina.png" alt="" className="size-full object-cover" />
          </span>
        </div>
        <span className="ds-p3 flex-1 text-right text-foreground">22.04.2025</span>
      </div>
    </div>
  );
}

/** Форма публикации поста (подписанный документ). */
export function PublicationForm() {
  return (
    <div className="flex flex-col gap-4 rounded-[4px] border border-border p-6">
      <span className="ds-p2-medium text-foreground">Публикация</span>
      <Input placeholder="Заголовок*" />
      <Textarea placeholder="Описание*" rows={3} />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="s">Фото</Button>
        <Button variant="ghost" size="s">Ссылка</Button>
      </div>
      <div className="-mx-6 -mb-6 mt-2 flex justify-end border-t border-border bg-surface-sunken px-6 py-4">
        <Button size="m">Опубликовать пост</Button>
      </div>
    </div>
  );
}

export function OrgContractScreen({ org, contract, cabinet }: { org: Org; contract: OrgContract; cabinet?: CabinetConfig }) {
  const router = useRouter();
  const { signedContracts, signContract } = useRegFlow();
  const signed = signedContracts.includes(contract.id);
  const [tab, setTab] = useState("dogovor");
  const [docTab, setDocTab] = useState("docs");
  const [modal, setModal] = useState(false);

  const back = () => router.push(cabinet ? `/cabinet/${cabinet.slug}/partners/org/${org.id}` : `/cabinet/partners/org/${org.id}`);
  const txRows = signed ? [contract.signTx, ...contract.tx] : contract.tx;

  const doSign = () => {
    signContract(contract.id);
    setModal(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {cabinet ? <CompanySidebar cabinet={cabinet} current="partners" /> : null}

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-6 md:px-[50px]">
          {/* Шапка: назад + переключатель Договор/Консультант (или закрыть). */}
          <div className="relative flex min-h-[40px] items-center">
            <button type="button" aria-label="Назад" onClick={back} className="flex size-10 items-center justify-center rounded-[6px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground">
              <BackIcon />
            </button>
            {!signed && (
              <div className="absolute left-1/2 -translate-x-1/2">
                <Tabs value={tab} onValueChange={setTab} variant="solid" size="m" equal aria-label="Роль">
                  <Tab value="dogovor">Договор</Tab>
                  <Tab value="consultant">Консультант</Tab>
                </Tabs>
              </div>
            )}
            {signed && (
              <button type="button" aria-label="Закрыть" onClick={back} className="ml-auto flex size-10 items-center justify-center rounded-[6px] border border-[color:var(--color-red-200)] bg-[color:var(--color-red-50,#fdeceb)] text-[color:var(--color-red-500)] transition-colors hover:bg-[color:var(--color-red-100,#f9d5d2)]">
                <CloseIcon />
              </button>
            )}
          </div>

          {signed ? (
            /* Подписанный: единый бордер — шапка · договор · транзакции.
               Внутренние границы — дивайдеры; у BlockchainCard своя рамка
               снята (border-0 rounded-none), аккордеон работает как прежде. */
            <div className="overflow-hidden rounded-[4px] border border-border">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
                <span className="ds-p1-medium text-foreground">{contract.name}</span>
                <span className="ds-p2-medium text-foreground">{contract.amount}</span>
                <Badge variant="soft" color="green">Согласован</Badge>
                <span className="ds-p3 text-foreground-subtle">19.05.2025</span>
              </div>
              <div className="flex flex-col gap-6 border-b border-border p-6 md:flex-row">
                <ContractInfo c={contract} />
                <AttachedDoc name={contract.attachedName} meta={contract.attachedMeta} />
              </div>
              <BlockchainCard rows={txRows} className="rounded-none border-0" />
            </div>
          ) : (
            /* Неподписанный: договор + транзакции слева, чат справа. */
            <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
              <div className="flex min-w-0 flex-1 flex-col gap-6">
                <div className="overflow-hidden rounded-[4px] border border-border">
                  <div className="flex flex-col gap-6 p-6 md:flex-row">
                    <ContractInfo c={contract} />
                    <AttachedDoc name={contract.attachedName} meta={contract.attachedMeta} />
                  </div>
                  <div className="flex justify-end border-t border-border bg-surface-sunken px-6 py-4">
                    <Button size="l" onClick={() => setModal(true)}>Подписать</Button>
                  </div>
                </div>
                <BlockchainCard rows={txRows} />
              </div>
              <ChatPanel title="3 Участника" messages={contract.chat} />
            </div>
          )}

          {/* Ниже чата — блоки по ширине документа (не на всю ширину). */}
          <div className={cn("flex flex-col gap-6", !signed && "lg:pr-[324px]")}>
            {/* Документы / Публикация. */}
            {signed ? (
              <>
                <NestedDocsBlock org={org} cabinet={cabinet} parentDocId={contract.id} />
                <PublicationForm />
              </>
            ) : (
              <div className="flex flex-col gap-4 rounded-[4px] border border-border p-6">
                <Tabs value={docTab} onValueChange={setDocTab} variant="basic" size="m" aria-label="Документы">
                  <Tab value="docs">Документы</Tab>
                  <Tab value="pub">Публикация</Tab>
                </Tabs>
                {docTab === "docs" ? (
                  <DocsTable />
                ) : (
                  <FeedComposerBar avatar={org.media} />
                )}
              </div>
            )}

            {/* Процесс исполнения договора. */}
            <div className="mt-2 flex flex-col gap-5">
              <h2 className="ds-h5 text-foreground">Процесс исполнения договора</h2>
              {contract.process.map((p, i) => {
                const media: FeedMedia = { type: "image", src: p.image };
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <FeedPost title={p.title} date={p.date} text={p.text} media={media} />
                    {p.author && <span className="ds-caption text-foreground-subtle">Консультант: <Link href="#" size="p3">{p.author}</Link></span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Модалка подтверждения подписи в блокчейн (DS Modal). */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        size="m"
        title="Подтвердить ваши действия в блокчейн?"
        footer={<Button size="l" onClick={doSign}>Подтвердить действие</Button>}
      >
        <div className="flex flex-col items-center gap-6">
          <p className="ds-p3 text-center text-foreground-subtle">При подписании документа ваши действия сохранятся в блокчейн</p>
          <div className={cn("flex w-full flex-wrap items-center justify-between gap-3 rounded-[4px] bg-surface-sunken px-4 py-3")}>
            <span className="ds-caption text-foreground-subtle">Подпись исполнителя</span>
            <span className="ds-p3-medium flex items-center gap-1.5 text-primary">🐘 Elephant</span>
            <Link href="#" size="p3">xxxxxxx… xxxxx</Link>
            <span className="ds-p3 text-foreground-subtle">19.05.2025 - 13:00</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
