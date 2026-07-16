"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown, Textarea, SettingsIcon } from "@/components/ds";
import { cn } from "@/lib/cn";
import { CooperativeInfo } from "../../../flow/company-create/_components/cooperative-info";
import {
  DocHeader,
  DefTable,
  DocThumb,
  BackHeader,
  VerificationView,
  VerificationBadge,
} from "./document-shared";
import {
  getDoc,
  VERIFICATION_ROWS,
  BLOCKCHAIN_TX,
  BZHD_RULES,
  BZHD_RULES_TEXT,
} from "./documents-data";

/**
 * DocumentDetailScreen — детальный экран документа целевого счёта. Без рейки,
 * с верхней шапкой (`DocHeader`) и боковыми отступами `px-5 md:px-[50px]`.
 * Источник Figma: 6419:315630 (верификация + блокчейн) · 6419:314679 (документ +
 * кнопки) · 6419:314517 (режим «Редактирование») · 2542:437478 (устав).
 *
 * Reuse: DocHeader · DefTable · VerificationView · DocThumb · BackHeader
 * (document-shared) · CooperativeInfo (устав) · DS Button/Dropdown/Textarea.
 */

export function DocumentDetailScreen({ id }: { id: string }) {
  const router = useRouter();
  const doc = getDoc(id);
  const [edit, setEdit] = useState(false);
  const [rules, setRules] = useState(BZHD_RULES_TEXT);

  const back = () => {
    if (edit) setEdit(false);
    else router.back();
  };

  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <DocHeader />
        <div className="px-5 py-10 ds-p2 text-foreground-subtle md:px-[50px]">Документ не найден.</div>
      </div>
    );
  }

  /* ── Полный устав кооператива (Figma 2542:437478). Экран «Уставные документы»
        из сценария валидации — без рейки, с шапкой и кнопкой «Назад». ── */
  if (doc.kind === "charter") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <DocHeader />
        <main className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          <BackHeader onBack={() => router.back()} />
          <div className="flex min-h-[66px] items-center rounded-[4px] border border-border bg-[var(--color-grey-20)] px-6 py-3">
            <span className="ds-p3-medium text-foreground">Уставные документы</span>
          </div>
          <CooperativeInfo />
        </main>
      </div>
    );
  }

  const isVerification = doc.kind === "verification";

  /* ── Режим редактирования (Figma 6419:314517) ── */
  if (edit) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <DocHeader />
        <main className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          <BackHeader title="Редактирование" onBack={back} />
          <div className="flex flex-col gap-6 rounded-[4px] border border-border p-6">
            <Field label="Документ" value={doc.name} />
            <Textarea label="Правила" rows={6} value={rules} onChange={(e) => setRules(e.target.value)} />
            <div className="flex flex-col gap-3">
              <span className="ds-caption text-foreground-subtle">Документы, подтверждающие владение документом</span>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" aria-label="Добавить документ" className="flex h-[68px] w-[68px] items-center justify-center rounded-[4px] bg-[var(--color-blue-midhub-50)] text-2xl text-primary transition-colors hover:bg-[color:var(--color-blue-midhub-100)]">+</button>
                <DocThumb />
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Button size="l" onClick={() => setEdit(false)}>Сохранить</Button>
            <Button variant="ghost" size="l" onClick={() => setEdit(false)}>Отменить</Button>
          </div>
        </main>
      </div>
    );
  }

  /* ── Детальный экран ── */
  const verificationRows = [
    ...VERIFICATION_ROWS(<VerificationBadge label="Международный" color="var(--color-green-300)" />),
    { label: "Прикрепленные документы", value: <DocThumb /> },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DocHeader />
      <main className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
        <BackHeader
          title={isVerification ? undefined : doc.name}
          onBack={back}
          actions={
            isVerification ? (
              <Dropdown
                items={[
                  { value: "edit", label: "Редактировать" },
                  { value: "verify", label: "Добавить верификацию" },
                ]}
                onSelect={(v) => v === "edit" && setEdit(true)}
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
            ) : undefined
          }
        />

        {isVerification ? (
          <VerificationView rows={verificationRows} txRows={BLOCKCHAIN_TX} />
        ) : (
          <DocumentView />
        )}

        {/* Документ: действия снизу (Figma 6419:314679) */}
        {!isVerification && (
          <div className="mt-4 flex items-center gap-3">
            <Button size="l">Добавить верификацию</Button>
            <Button variant="secondary" size="l" onClick={() => setEdit(true)}>Редактировать</Button>
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Документ: характеристики (Правила — многострочно) ────────────────────── */
function DocumentView() {
  return (
    <DefTable
      rows={[
        { label: "Документ", value: "Правила БЖД" },
        {
          label: "Правила",
          value: (
            <div className="flex flex-col gap-3">
              {BZHD_RULES.map((r, i) => (
                <span key={i}>{r}</span>
              ))}
            </div>
          ),
        },
        { label: "Прикрепленные документы", value: <DocThumb /> },
      ]}
    />
  );
}

function Field({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="ds-caption text-foreground-subtle">{label}</span>
      <span className="ds-p2 text-foreground">{value}</span>
    </div>
  );
}
