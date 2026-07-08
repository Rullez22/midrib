import { cn } from "@/lib/cn";
import { DOT, type Money, type GoalProgress } from "./goals-data";

/**
 * GoalProgressBar — прогресс цели. Один и тот же компонент рисует прогресс
 * в карточке списка (GoalsScreen) и на странице цели (GoalPublishedScreen),
 * чтобы они были идентичны. Два стиля:
 *  - marker != null → «Использовано/Собрано»: оранжевый градиент до маркера,
 *    зелёный после, оранжевая засечка;
 *  - иначе → «Собрано/Общая сумма»: зелёная заливка + кружок-хэндл.
 */
function MoneyLabel({ m, align }: { m: Money; align: "left" | "right" }) {
  return (
    <span className={cn("flex flex-col gap-0.5", align === "right" && "items-end")}>
      <span className="inline-flex items-center gap-2">
        {align === "left" && <span className="size-2 shrink-0 rounded-full" style={{ background: DOT[m.dot] ?? m.dot }} />}
        <span className="ds-p3 text-foreground">{m.amount}</span>
        {align === "right" && <span className="size-2 shrink-0 rounded-full" style={{ background: DOT[m.dot] ?? m.dot }} />}
      </span>
      <span className="ds-caption text-foreground-subtle">{m.label}</span>
    </span>
  );
}

export function GoalProgressBar({ p }: { p: GoalProgress }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-1.5 w-full rounded-full bg-[var(--color-grey-90)]">
        {p.marker != null ? (
          <>
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${p.marker}%`, background: "linear-gradient(90deg,#fbd38d,#f59e0b)" }} />
            <div className="absolute inset-y-0 rounded-full bg-[var(--color-green-400)]" style={{ left: `${p.marker}%`, right: 0 }} />
            <span className="absolute top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-orange-400)]" style={{ left: `${p.marker}%` }} />
          </>
        ) : (
          <>
            <div className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-green-400)]" style={{ width: `${p.fillPct}%` }} />
            {p.handle && (
              <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-green-400)] bg-[#fff]" style={{ left: `${p.fillPct}%` }} />
            )}
          </>
        )}
      </div>
      <div className="flex items-start justify-between">
        <MoneyLabel m={p.left} align="left" />
        <MoneyLabel m={p.right} align="right" />
      </div>
    </div>
  );
}
