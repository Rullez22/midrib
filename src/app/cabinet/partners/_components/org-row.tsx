"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * OrgRow / StarRating — строка-карточка организации для списков «Партнёры» и
 * «Найти нового партнёра» (Figma 6760-461828 / 6760-462037): слева квадратный
 * логотип/обложка, справа — название, адрес с пином, описание и рейтинг звёздами.
 * Локальный композит поверх DS-токенов; переиспользуется обоими табами и деталью.
 */

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M8 14s5-4.2 5-8A5 5 0 0 0 3 6c0 3.8 5 8 5 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="8" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} aria-hidden className={className}>
      <path
        d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.85 4.95L10 14.9l-4.45 2.35.85-4.95L2.8 8.8l5-.7z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarRating({ value, max = 5, className }: { value: number; max?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[#f5b301]", className)} aria-label={`Рейтинг ${value} из ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon key={i} filled={i < value} className={i < value ? "size-[18px]" : "size-[18px] text-[color:var(--color-grey-100)]"} />
      ))}
    </span>
  );
}

export interface OrgRowProps {
  media: ReactNode;
  name: ReactNode;
  address?: ReactNode;
  description?: ReactNode;
  rating?: number;
  onOpen?: () => void;
  /** Без собственной рамки/скругления/фона — для вложения в общий блок со статусом. */
  bare?: boolean;
  className?: string;
}

export function OrgRow({ media, name, address, description, rating, onOpen, bare = false, className }: OrgRowProps) {
  return (
    <div
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={onOpen ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } } : undefined}
      className={cn(
        "flex gap-5 p-4",
        bare ? "bg-transparent" : "rounded-[10px] border border-border bg-[#fff]",
        onOpen && (bare ? "cursor-pointer" : "cursor-pointer transition-shadow hover:shadow-sm"),
        className,
      )}
    >
      <div className="size-[120px] shrink-0 overflow-hidden rounded-[8px] border border-border bg-surface-sunken">
        {media}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-4">
          <span className="ds-p1-medium text-foreground">{name}</span>
          {rating != null && <StarRating value={rating} className="shrink-0 pt-1" />}
        </div>
        {address && (
          <span className="ds-caption flex items-center gap-1 text-primary">
            <PinIcon className="size-4 shrink-0" />
            {address}
          </span>
        )}
        {description && <p className="ds-p3 text-foreground-muted">{description}</p>}
      </div>
    </div>
  );
}
