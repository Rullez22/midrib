"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Modal, Radio, Input, Button } from "@/components/ds";

/**
 * MoveToFolderModal — попап «Переместить в папку» (Figma 6537:356430/356583/
 * 356760/357144). Собран из DS-атомов: Modal · Radio · Input · Button.
 *
 * Флоу: выбрать существующую папку (radio-карточка) → «Переместить»; либо
 * «Создать новую папку» (radio) → инпут названия → «Создать папку» (папка
 * добавляется в список, выделяется) → «Переместить». Закрытие — крестик/оверлей.
 */

const NEW = "__new__";

/** Папка (filled, blue) — иконка карточки папки. */
function FolderGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden style={{ color: "var(--color-blue-midhub-500)" }}>
      <path
        d="M2 7c0-2 1-3 3.5-3h2c.9 0 1.2.2 1.6.7l1 1.3c.27.36.46.5 1.13.5h3.7C18 6.5 19 7.5 19 10v.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M3.5 9h15c1.7 0 2.8 1 2.5 2.8l-.9 5C19.8 19 18.7 20 17 20H6.4c-1.7 0-2.8-1-2.5-2.8l.6-5C4.8 10 5.8 9 3.5 9z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M3.5 9h15c1.7 0 2.8 1 2.5 2.8l-.9 5C19.8 19 18.7 20 17 20H6.4c-1.7 0-2.8-1-2.5-2.8l.6-5C4.8 10 5.8 9 6.5 9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FolderCard({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect())}
      className={cn(
        "flex h-[52px] w-full cursor-pointer items-center gap-3 rounded-[4px] bg-surface-sunken px-5 transition-colors",
        selected ? "ring-1 ring-primary" : "hover:bg-[var(--color-grey-20)]",
      )}
    >
      <FolderGlyph />
      <span className="ds-p2 flex-1 text-foreground">{label}</span>
      <span className="pointer-events-none flex flex-none items-center">
        <Radio size="xs" checked={selected} readOnly tabIndex={-1} aria-hidden />
      </span>
    </div>
  );
}

export function MoveToFolderModal({
  open,
  onClose,
  folders,
  onCreateFolder,
  onMove,
}: {
  open: boolean;
  onClose: () => void;
  /** Папки-назначения (предустановленные + созданные). */
  folders: { id: string; label: string }[];
  /** Создать папку → вернуть id новой папки. */
  onCreateFolder: (label: string) => string;
  /** Переместить выбранных пайщиков в папку. */
  onMove: (folderId: string) => void;
}) {
  const [sel, setSel] = useState<string>(NEW);
  const [name, setName] = useState("");

  // При открытии — предвыбрать первую папку (или режим создания, если папок нет).
  useEffect(() => {
    if (open) {
      setSel(folders[0]?.id ?? NEW);
      setName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const creating = sel === NEW;
  const canCreate = name.trim().length > 0;

  const create = () => {
    if (!canCreate) return;
    const id = onCreateFolder(name.trim());
    setSel(id);
    setName("");
  };
  const move = () => {
    if (creating) return;
    onMove(sel);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="m"
      title="Переместить в папку"
      footer={
        creating ? (
          <Button size="l" className="min-w-[252px]" disabled={!canCreate} onClick={create}>
            Создать папку
          </Button>
        ) : (
          <Button size="l" className="min-w-[252px]" onClick={move}>
            Переместить
          </Button>
        )
      }
    >
      <p className="ds-p2 text-center text-foreground-muted">
        Выберите одну из предустановленных папок или создайте новую
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {folders.map((f) => (
          <FolderCard key={f.id} label={f.label} selected={sel === f.id} onSelect={() => setSel(f.id)} />
        ))}

        {/* Создать новую папку — radio-опция (правый край в одну линию с карточками) */}
        <div className="flex items-center justify-between gap-3 px-5">
          <button
            type="button"
            onClick={() => setSel(NEW)}
            className="ds-p2 inline-flex items-center gap-2 text-primary"
          >
            <span className="text-[18px] leading-none">+</span>
            <span className="border-b border-dashed border-primary pb-px">Создать новую папку</span>
          </button>
          <span className="pointer-events-none flex flex-none items-center">
            <Radio size="xs" checked={creating} readOnly tabIndex={-1} aria-hidden />
          </span>
        </div>

        {creating && (
          <Input
            size="l"
            label="Название папки"
            placeholder="Название папки"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        )}
      </div>
    </Modal>
  );
}
