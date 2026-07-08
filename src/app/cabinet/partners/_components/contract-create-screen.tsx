"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Button, Modal, Link, Tooltip, UploadV2 } from "@/components/ds";
import { useRegFlow, type DocKind } from "../../../flow/company-create/_components/reg-flow";
import { CompanySidebar } from "../../[company]/_components/company-sidebar";
import { type CabinetConfig } from "../../[company]/_config/cabinets";
import { type Org } from "./partners-data";
import { KINDS } from "./doc-kinds";

/**
 * ContractCreateScreen — форма создания документа (договор / счёт / акт, Figma
 * 6760-466719 · 481947 · 496773). Метки берутся из KINDS[kind]. По «Добавить …»
 * → попап подтверждения в блокчейн → создаётся документ (или обновляется в
 * режиме editId) и открывается его деталь.
 *
 * parentId — если задан, документ вложенный (создан внутри другого документа).
 * Reuse: CompanySidebar · DS Input/Textarea/Button/Modal/UploadV2/Tooltip.
 */

function BackIcon() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function HelpIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-[18px]">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.2 7.8a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.9.6-.9 1.2v.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9.7" cy="13.6" r=".7" fill="currentColor" />
    </svg>
  );
}

export function ContractCreateScreen({
  org,
  cabinet,
  kind,
  parentId = null,
  editId,
  basePath,
  sidebarCurrent = "partners",
}: {
  org: Org;
  cabinet?: CabinetConfig;
  kind: DocKind;
  parentId?: string | null;
  editId?: string;
  /** Переопределение базового пути (для встраивания флоу в другой раздел, напр. Цели). */
  basePath?: string;
  /** Активный пункт в CompanySidebar. */
  sidebarCurrent?: string;
}) {
  const router = useRouter();
  const { addCreatedContract, updateCreatedContract, getCreatedContract } = useRegFlow();
  const cfg = KINDS[kind];
  const editing = editId ? getCreatedContract(editId) : undefined;

  const [name, setName] = useState(editing?.name ?? "");
  const [number, setNumber] = useState(editing?.number ?? "");
  const [code, setCode] = useState(editing?.code ?? "");
  const [amount, setAmount] = useState(editing && editing.amount !== "—" ? editing.amount : "");
  const [comment, setComment] = useState(editing && editing.comment !== "—" ? editing.comment : "");
  const [attached, setAttached] = useState<{ name: string; meta: string } | null>(
    editing ? { name: editing.attachedName, meta: editing.attachedMeta } : null,
  );
  const [modal, setModal] = useState(false);

  const base = basePath ?? (cabinet ? `/cabinet/${cabinet.slug}/partners/org/${org.id}` : `/cabinet/partners/org/${org.id}`);
  const parentBase = editing?.parentId ?? parentId;
  const back = () => router.push(parentBase ? `${base}/doc/${parentBase}` : base);

  const pickFile = () => setAttached({ name: cfg.attachedName, meta: "PDF · 1 MB" });
  const valid = name.trim() !== "" && number.trim() !== "" && code.trim() !== "" && attached != null && (!cfg.amountRequired || amount.trim() !== "");

  const confirm = () => {
    const data = {
      orgId: org.id,
      kind,
      parentId: parentBase,
      customer: org.name,
      name: name.trim(),
      number: number.trim(),
      code: code.trim(),
      amount: amount.trim() || "—",
      comment: comment.trim() || "—",
      attachedName: attached!.name,
      attachedMeta: attached!.meta,
    };
    setModal(false);
    if (editId) {
      updateCreatedContract(editId, data);
      router.push(`${base}/doc/${editId}`);
    } else {
      const id = addCreatedContract(data);
      router.push(`${base}/doc/${id}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {cabinet ? <CompanySidebar cabinet={cabinet} current={sidebarCurrent} /> : null}

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-6 md:px-[50px]">
          <button type="button" aria-label="Назад" onClick={back} className="flex size-10 items-center justify-center rounded-[6px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground">
            <BackIcon />
          </button>

          <div className="flex flex-col items-center gap-1">
            <h1 className="ds-h4 text-foreground">{cfg.formTitle}</h1>
            <span className="ds-caption uppercase tracking-wide text-foreground-subtle">Форма для заполнения</span>
          </div>

          <div className="w-full">
            <div className="flex flex-col gap-6 rounded-[4px] border border-border p-6 md:flex-row">
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Input className="flex-1" placeholder={cfg.nameLabel} value={name} onChange={(e) => setName(e.target.value)} />
                  <Input className="sm:w-[160px]" placeholder="Номер*" value={number} onChange={(e) => setNumber(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <Input className="w-[160px]" placeholder="Код*" value={code} onChange={(e) => setCode(e.target.value)} />
                  <Tooltip content="Код-основание документа" side="top">
                    <span className="inline-flex cursor-help text-foreground-subtle"><HelpIcon /></span>
                  </Tooltip>
                </div>
                <Input className="w-[200px]" placeholder={cfg.amountRequired ? "Сумма*" : "Сумма"} value={amount} onChange={(e) => setAmount(e.target.value)} />
                <Textarea placeholder="Комментарии" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>

              <div className="md:w-[280px] md:self-stretch">
                {attached ? (
                  <div className="flex h-full flex-col gap-3 rounded-[6px] border border-border bg-[#fff] p-4">
                    <span className="ds-caption text-center text-foreground-subtle">Прикрепленный документ</span>
                    <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-[6px] bg-surface-sunken py-5">
                      <span className="ds-p3 text-foreground">{attached.name}</span>
                      <span className="ds-caption text-foreground-subtle">{attached.meta}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={pickFile} className="ds-p3 inline-flex items-center gap-1.5 text-primary">Изменить</button>
                      <button type="button" onClick={() => setAttached(null)} className="ds-p3 inline-flex items-center gap-1.5 text-foreground-subtle transition-colors hover:text-foreground">Удалить</button>
                    </div>
                  </div>
                ) : (
                  <UploadV2 onSelect={pickFile} className="h-full min-h-[220px] justify-center" />
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <Button size="l" disabled={!valid} onClick={() => setModal(true)}>{cfg.addBtn}</Button>
              {attached && (
                <Button variant="tertiary" size="l" onClick={back}>Отменить</Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        size="m"
        title="Подтвердить ваши действия в блокчейн ?"
        footer={<Button size="l" onClick={confirm}>Подтвердить действие</Button>}
      >
        <div className="flex flex-col items-center gap-6">
          <p className="ds-p3 text-center text-foreground-subtle">При подписании документа ваши действия сохраняться в блокчейн</p>
          <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-[4px] bg-surface-sunken px-4 py-3">
            <span className="ds-caption text-foreground-subtle">{cfg.txAdd}</span>
            <span className="ds-p3-medium flex items-center gap-1.5 text-primary">🐘 Elephant</span>
            <Link href="#" size="p3">xxxxxxx… xxxxx</Link>
            <span className="ds-p3 text-foreground-subtle">{cfg.baseTxDate}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
