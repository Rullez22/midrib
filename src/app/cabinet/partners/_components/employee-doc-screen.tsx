"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Modal, Link } from "@/components/ds";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { BlockchainCard, ChatPanel, type TxRow, type ChatPanelMsg } from "../../document/_components/document-shared";
import { AttachedDoc, Field, BackIcon, CloseIcon } from "./org-contract-screen";
import { DOC_STATUS_COLOR, type EmployeeDoc } from "./partners-data";

/**
 * EmployeeDocScreen — документ сотрудника (таб «Ваши сотрудники»). Виды по статусу
 * (та же логика, что PartnerDocScreen, но без привязки к организации):
 *   «Ожидает участия» — договор + чат, активная «Подписать» → модалка → «Согласован».
 *   «На согласовании» — договор + чат, кнопки залочены; через 3с документ
 *                       согласуется сам (RegFlow.approveOrgDoc) → «Согласован».
 * После действий оба документа переходят в готовый (согласованный) вид.
 *
 * Reuse: ChatPanel · BlockchainCard (document-shared) · Field · AttachedDoc ·
 * BackIcon · CloseIcon (org-contract-screen) · Badge · Button · Modal.
 */

/** Авто-согласование документа «На согласовании» — задержка после открытия. */
const EMPLOYEE_DOC_APPROVE_MS = 3000;

const CHAT: ChatPanelMsg[] = [
  { me: true, text: "Здравствуйте! Прикрепляю документ на подпись.", time: "11:10" },
  { text: "Принято, проверяем и подписываем со стороны фонда.", time: "11:45" },
];

function Fields({ doc }: { doc: EmployeeDoc }) {
  return (
    <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Тип документа" value={doc.type} />
      <Field label="Название документа" value={doc.name} />
      <Field label="Сотрудник" value={doc.staff} />
      <Field label="Дата обработки" value={doc.date} />
    </div>
  );
}

export function EmployeeDocScreen({ doc, docKey, onBack }: { doc: EmployeeDoc; docKey: string; onBack: () => void }) {
  const { approvedOrgDocs, approveOrgDoc } = useRegFlow();
  const [modal, setModal] = useState(false);
  const approved = approvedOrgDocs.includes(docKey);
  // Не готовые документы (просмотр с чатом + согласование):
  //   «На согласовании» — кнопки залочены, авто-согласование через 3с.
  //   «Ожидает участия» — активная «Подписать» → модалка → согласовано.
  const autoApprove = doc.status === "На согласовании" && !approved;
  const canSign = doc.status === "Ожидает участия" && !approved;
  const pending = autoApprove || canSign;

  // «На согласовании»: через 3с после открытия документ согласуется сам.
  useEffect(() => {
    if (!autoApprove) return;
    const t = setTimeout(() => approveOrgDoc(docKey), EMPLOYEE_DOC_APPROVE_MS);
    return () => clearTimeout(t);
  }, [autoApprove, docKey, approveOrgDoc]);

  const displayStatus = approved ? "Согласован" : doc.status;

  const txReady: TxRow[] = [
    { action: "Подпись сотрудника", party: doc.staff, date: `${doc.date} - 13:00` },
    { action: "Подпись менеджера", party: "Elephant", date: `${doc.date} - 12:30` },
    { action: "Добавление договора", party: doc.staff, date: `${doc.date} - 11:30` },
  ];
  const txPending = txReady.slice(1);

  return (
    <div className="flex w-full flex-col gap-6 px-5 py-6 md:px-[50px]">
      {/* Шапка: назад + закрыть. */}
      <div className="relative flex min-h-[40px] items-center">
        <button type="button" aria-label="Назад" onClick={onBack} className="flex size-10 items-center justify-center rounded-[6px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground">
          <BackIcon />
        </button>
        <button type="button" aria-label="Закрыть" onClick={onBack} className="ml-auto flex size-10 items-center justify-center rounded-[6px] border border-[color:var(--color-red-200)] bg-[color:var(--color-red-50,#fdeceb)] text-[color:var(--color-red-500)] transition-colors hover:bg-[color:var(--color-red-100,#f9d5d2)]">
          <CloseIcon />
        </button>
      </div>

      {pending ? (
        /* Договор + чат, кнопки по статусу. */
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="overflow-hidden rounded-[4px] border border-border">
              <div className="flex flex-col gap-6 p-6 md:flex-row">
                <Fields doc={doc} />
                <AttachedDoc name="Договор с сотрудником" meta="PDF · 1 MB" />
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
        /* Готовый (согласованный) вид: единый блок «шапка·договор·транзакции». */
        <div className="overflow-hidden rounded-[4px] border border-border">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
            <span className="ds-p1-medium text-foreground">{doc.name}</span>
            <Badge variant="soft" color={DOC_STATUS_COLOR[displayStatus]}>{displayStatus}</Badge>
            <span className="ds-p3 text-foreground-subtle">{doc.date}</span>
          </div>
          <div className="flex flex-col gap-6 border-b border-border p-6 md:flex-row">
            <Fields doc={doc} />
            <AttachedDoc name="Договор с сотрудником" meta="PDF · 1 MB" />
          </div>
          <BlockchainCard rows={txReady} className="rounded-none border-0" />
        </div>
      )}

      {/* Подпись документа «Ожидает участия» → согласование. */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        size="m"
        title="Подтвердить ваши действия в блокчейн?"
        footer={<Button size="l" onClick={() => { approveOrgDoc(docKey); setModal(false); }}>Подтвердить действие</Button>}
      >
        <div className="flex flex-col items-center gap-6">
          <p className="ds-p3 text-center text-foreground-subtle">При подписании документа ваши действия сохранятся в блокчейн</p>
          <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-[4px] bg-surface-sunken px-4 py-3">
            <span className="ds-caption text-foreground-subtle">Подпись менеджера</span>
            <span className="ds-p3-medium flex items-center gap-1.5 text-primary">🐘 Elephant</span>
            <Link href="#" size="p3">xxxxxxx… xxxxx</Link>
            <span className="ds-p3 text-foreground-subtle">{doc.date} - 13:00</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
