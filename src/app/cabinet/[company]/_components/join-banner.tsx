import { Button } from "@/components/ds";

/**
 * JoinBanner — баннер «Хотите стать пайщиком подразделения?» (Figma cabinet
 * mains/счета). Общий для профиля кабинета (DeptProfile) и экрана Счета.
 */

function JoinIcon() {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 24 24" className="size-7 text-primary" aria-hidden>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" {...s} />
      <circle cx="8.5" cy="11" r="2" {...s} />
      <path d="M5.5 16c.5-1.6 5-1.6 6 0M14 10h4M14 13.5h4" {...s} />
    </svg>
  );
}

export function JoinBanner() {
  return (
    <div className="flex flex-col gap-3 rounded-[4px] border border-primary bg-primary-soft px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <JoinIcon />
        <div className="flex flex-col">
          <span className="ds-p3-medium text-foreground">Хотите стать пайщиком подразделения ?</span>
          <span className="ds-caption text-foreground-muted">
            Чтобы стать пайщиком, необходимо оставить заявку на вступление
          </span>
        </div>
      </div>
      <Button size="m" className="md:self-auto">Оставить заявку</Button>
    </div>
  );
}
