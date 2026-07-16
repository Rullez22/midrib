"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Link, FeedPost, Button, Modal, type FeedMedia } from "@/components/ds";
import { useRegFlow, CONTRACT_FINALIZE_MS } from "../../../flow/company-create/_components/reg-flow";
import { CompanySidebar } from "../../[company]/_components/company-sidebar";
import { type CabinetConfig } from "../../[company]/_config/cabinets";
import { BlockchainCard, ChatPanel, type TxRow, type ChatPanelMsg } from "../../document/_components/document-shared";
import { DOC_STATUS_COLOR, type Org, type OrgDoc } from "./partners-data";
import { AttachedDoc, Field, PublicationForm, ExtIcon, BackIcon, CloseIcon } from "./org-contract-screen";
import { NestedDocsBlock } from "./nested-docs-block";

/**
 * PartnerDocScreen — детальный экран документа партнёра. Виды по статусу:
 *   «Согласован»      — готовый: единый блок «шапка·договор·транзакции» + процесс.
 *   «На согласовании» — НЕ готовый: договор с чатом и залоченными кнопками
 *                       (Редактировать/Подписать disabled). Через 5с после
 *                       открытия документ согласуется (RegFlow.approveOrgDoc) и
 *                       переходит в готовый вид.
 *
 * Шапка (название/сумма/статус/дата) берётся из плашки → 1:1 совпадает со списком.
 * Блок «Документы» — через один: с кнопкой «Добавить» (дропдаун Счёт/Акт) либо
 * пустой со ссылками. Reuse: OrgContractScreen-хелперы + BlockchainCard/ChatPanel.
 */

const U = "https://images.unsplash.com/";
const PROCESS: { title: string; date: string; text: string; image: string; author?: string }[] = [
  { title: "Выезд на объект", date: "January 09, 2020", text: "Команда наших специалистов выехала на площадку. Приступили к монтажу по графику.", image: `${U}photo-1504307651254-35680f356dfd?w=800&q=80` },
  { title: "Отчёт консультанта", date: "January 10, 2020", text: "Работы приняты, документы закрыты актом. Отчёт опубликован.", author: "ИП Наталья Верная", image: `${U}photo-1454165804606-c3d57bc86b40?w=800&q=80` },
];
const CHAT: ChatPanelMsg[] = [
  { me: true, text: "Привет, фонд. Можете подписать?", time: "11:10" },
  { text: "Привет, исполнитель. Сейчас к цели прикрепим. Рады сотрудничеству,", time: "11:45" },
];


function ContractFields({ org, doc }: { org: Org; doc: OrgDoc }) {
  return (
    <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Заказчик" value={<span className="inline-flex items-center gap-1 text-primary">{org.name}<ExtIcon /></span>} />
      <Field label="Исполнитель" value="ИП Слоненок" />
      <Field label="Название договора" value={doc.name} />
      <Field label="Номер" value="3422244244224" />
      <Field label="Код" value="342" />
      <Field label="Сумма" value={doc.amount} />
      <Field label="Комментарии" value="—" />
    </div>
  );
}

/** Нижняя секция: вложенные документы + Публикация + Процесс. */
function DocLowerSection({ org, cabinet, docId }: { org: Org; cabinet?: CabinetConfig; docId: string }) {
  return (
    <div className="flex flex-col gap-6">
      <NestedDocsBlock org={org} cabinet={cabinet} parentDocId={docId} />
      <PublicationForm />
      <div className="mt-2 flex flex-col gap-5">
        <h2 className="ds-h5 text-foreground">Процесс исполнения договора</h2>
        {PROCESS.map((p, i) => {
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
  );
}

export function PartnerDocScreen({ org, doc, docId, cabinet }: { org: Org; doc: OrgDoc; docId: string; cabinet?: CabinetConfig }) {
  const router = useRouter();
  const { approvedOrgDocs, approveOrgDoc } = useRegFlow();
  const [modal, setModal] = useState(false);
  const approved = approvedOrgDocs.includes(docId);
  // Не готовые документы (нужен просмотр с чатом + согласование):
  //   «На согласовании» — кнопки залочены, авто-согласование через 5с.
  //   «Ожидает участия» — активная «Подписать» → модалка → согласовано.
  const autoApprove = doc.status === "На согласовании" && !approved;
  const canSign = doc.status === "Ожидает участия" && !approved;
  const pending = autoApprove || canSign;

  // «На согласовании»: через 5с после открытия документ согласуется сам.
  useEffect(() => {
    if (!autoApprove) return;
    const t = setTimeout(() => approveOrgDoc(docId), CONTRACT_FINALIZE_MS);
    return () => clearTimeout(t);
  }, [autoApprove, docId, approveOrgDoc]);

  const displayStatus = approved ? "Согласован" : doc.status;
  const back = () => router.push(cabinet ? `/cabinet/${cabinet.slug}/partners/org/${org.id}` : `/cabinet/partners/org/${org.id}`);

  const txReady: TxRow[] = [
    { action: "Подпись исполнителя", party: "Elephant", date: `${doc.date} - 13:00` },
    { action: "Подпись менеджера", party: org.name.split(" ").pop() ?? "Партнёр", date: `${doc.date} - 12:30` },
    { action: "Добавление договора", party: "Elephant", date: `${doc.date} - 11:30` },
  ];
  const txPending: TxRow[] = txReady.slice(1);

  return (
    <div className="flex min-h-screen bg-background">
      {cabinet ? <CompanySidebar cabinet={cabinet} current="partners" /> : null}

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-6 md:px-[50px]">
          {/* Шапка: назад + закрыть. */}
          <div className="relative flex min-h-[40px] items-center">
            <button type="button" aria-label="Назад" onClick={back} className="flex size-10 items-center justify-center rounded-[6px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground">
              <BackIcon />
            </button>
            <button type="button" aria-label="Закрыть" onClick={back} className="ml-auto flex size-10 items-center justify-center rounded-[6px] border border-[color:var(--color-red-200)] bg-[color:var(--color-red-50,#fdeceb)] text-[color:var(--color-red-500)] transition-colors hover:bg-[color:var(--color-red-100,#f9d5d2)]">
              <CloseIcon />
            </button>
          </div>

          {pending ? (
            /* «На согласовании»: договор + чат, кнопки залочены. */
            <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
              <div className="flex min-w-0 flex-1 flex-col gap-6">
                <div className="ds-row overflow-hidden rounded-[4px] border border-border">
                  <div className="flex flex-col gap-6 p-6 md:flex-row">
                    <ContractFields org={org} doc={doc} />
                    <AttachedDoc name="Договор с фондом" meta="PDF · 1 MB" />
                  </div>
                  <div className="flex justify-end gap-3 border-t border-border bg-surface-sunken px-6 py-4">
                    <Button variant="secondary" size="l" className="min-w-[200px]" disabled>Редактировать</Button>
                    <Button size="l" className="min-w-[200px]" disabled={!canSign} onClick={() => setModal(true)}>Подписать</Button>
                  </div>
                </div>
                <BlockchainCard rows={txPending} />
              </div>
              <ChatPanel title="2 Участника" messages={CHAT} />
            </div>
          ) : (
            /* Готовый: единый блок «шапка·договор·транзакции». */
            <div className="ds-row overflow-hidden rounded-[4px] border border-border">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
                <span className="ds-p1-medium text-foreground">{doc.name}</span>
                <span className="ds-p2-medium text-foreground">{doc.amount}</span>
                <Badge variant="soft" color={DOC_STATUS_COLOR[displayStatus]}>{displayStatus}</Badge>
                <span className="ds-p3 text-foreground-subtle">{doc.date}</span>
              </div>
              <div className="flex flex-col gap-6 border-b border-border p-6 md:flex-row">
                <ContractFields org={org} doc={doc} />
                <AttachedDoc name="Договор с фондом" meta="PDF · 1 MB" />
              </div>
              <BlockchainCard rows={txReady} className="rounded-none border-0" />
            </div>
          )}

          <div className={pending ? "lg:pr-[324px]" : undefined}>
            <DocLowerSection org={org} cabinet={cabinet} docId={docId} />
          </div>
        </div>
      </main>

      {/* Подпись документа «Ожидает участия» → согласование. */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        size="m"
        title="Подтвердить ваши действия в блокчейн?"
        footer={<Button size="l" onClick={() => { approveOrgDoc(docId); setModal(false); }}>Подтвердить действие</Button>}
      >
        <div className="flex flex-col items-center gap-6">
          <p className="ds-p3 text-center text-foreground-subtle">При подписании документа ваши действия сохранятся в блокчейн</p>
          <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-[4px] bg-surface-sunken px-4 py-3">
            <span className="ds-caption text-foreground-subtle">Подпись исполнителя</span>
            <span className="ds-p3-medium flex items-center gap-1.5 text-primary">🐘 Elephant</span>
            <Link href="#" size="p3">xxxxxxx… xxxxx</Link>
            <span className="ds-p3 text-foreground-subtle">{doc.date} - 13:00</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
