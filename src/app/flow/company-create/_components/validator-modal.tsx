"use client";

import { Modal, Badge, Button } from "@/components/ds";

/**
 * ValidatorModal — попап «Подтвердить валидатора?». Открывается из баннера
 * «Отправка уставных документов на валидацию» на счетах. Источник: Figma
 * 2537:308718 (скелетон — идёт поиск) / 2537:311986 (валидатор найден).
 *
 * Reuse DS: Modal · Badge · Button. Секции (Транзакция/Документ/Валидатор) —
 * локальный layout.
 *
 * @param ready Валидатор найден (показывает данные + активная кнопка). Иначе скелетон.
 */

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-border" />
      <span className="ds-caption text-foreground-subtle">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7v3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <path d="M6 4h6v6M12 4 5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" style={{ color: "var(--color-yellow-300)" }} fill="currentColor" aria-hidden>
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95L12 2.5Z" />
    </svg>
  );
}

const blue = "var(--color-blue-midhub-500)";

export function ValidatorModal({
  open,
  ready,
  onClose,
  onConfirm,
}: {
  open: boolean;
  ready: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="m"
      title="Подтвердить валидатора?"
      footer={
        <Button fullWidth disabled={!ready} onClick={onConfirm}>
          Подтвердить валидатора
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="ds-p3 text-center text-foreground-subtle">
          После подтверждения валидатора, ваш документ будет обрабатывать данный валидатор
        </p>

        {/* Транзакция */}
        <SectionDivider label="Транзакция" />
        <div className="flex items-center gap-3 rounded-[4px] border border-border px-4 py-3 text-foreground">
          <span className="ds-p3 flex-1 truncate">Голосование за отправк...</span>
          <span className="ds-p3 flex-1 truncate" style={{ color: blue }}>Кооператив Immatra</span>
          <span className="ds-p3 flex flex-1 items-center justify-center gap-1.5" style={{ color: blue }}>
            xxxx… xxxxx <InfoIcon />
          </span>
          <span className="ds-p3 flex-1 text-right text-foreground">19.05.2025 - …</span>
        </div>

        {/* Документ */}
        <SectionDivider label="Документ" />
        <div className="flex items-center gap-3 rounded-[4px] border border-border px-4 py-3">
          <span className="ds-p3 flex-1 truncate text-foreground">Полный устав …</span>
          <span className="ds-p3 flex-1 text-foreground">Не отвалидирован</span>
          <span className="flex-1"><Badge variant="solid" color="orange">Локальный</Badge></span>
          <span className="ds-p3 flex-1 text-right text-foreground">28.01.2025</span>
        </div>

        {/* Валидатор */}
        <SectionDivider label="Валидатор" />
        <div className="rounded-[4px] border border-border p-4">
          {ready ? (
            <div className="flex items-center gap-4">
              <div className="flex size-[100px] shrink-0 items-center justify-center rounded-[4px] border border-border">
                <span className="ds-p2-medium text-foreground">Буренок</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <a className="ds-p2-medium inline-flex items-center gap-1.5" style={{ color: blue }} href="#">
                  Кооператив «Буренок» <ExternalIcon />
                </a>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}
                </div>
                <span className="ds-p3 text-foreground-subtle">184 отзыва</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex size-[100px] shrink-0 items-center justify-center rounded-[4px] border border-border bg-[var(--color-grey-10)]">
                <span className="ds-h3 text-foreground-subtle">?</span>
              </div>
              <div className="flex flex-1 flex-col gap-2.5">
                <span className="h-3.5 w-2/3 animate-pulse rounded bg-[var(--color-grey-20)]" />
                <span className="h-3.5 w-2/3 animate-pulse rounded bg-[var(--color-grey-20)]" />
                <span className="h-3.5 w-1/3 animate-pulse rounded bg-[var(--color-grey-20)]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
