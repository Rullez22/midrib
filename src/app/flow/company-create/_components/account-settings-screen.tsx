"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  IncrimentField,
  DistributionRow,
  ProgressRing,
} from "@/components/ds";
import { CoopRail } from "./coop-sidebar";
import { useEnsureAccountsReady, useRegFlow } from "./reg-flow";

/**
 * AccountSettingsScreen — «Настройка счета» (редактирование распределения %).
 * Отдельная страница, открывается из карточки счёта («Редактировать % по
 * распределению»). Источник: Figma 2489:279890 (пустое) / 2489:285220 (заполнено).
 *
 * Reuse DS: CoopRail (рейка) · IncrimentField (Целевой счёт) · DistributionRow×3
 * (подсчёта: степпер % + 2 чекбокс-опции) · ProgressRing (Буферная область) ·
 * Checkbox (правила) · Button (× закрыть / Запустить голосование). Новых компонентов нет.
 *
 * @param backHref Закрытие (×) — назад к настройке счетов.
 * @param voteHref «Запустить голосование» — на вопросы голосования (вопрос
 *   «Распределение % …» становится активным + оранжевая иконка в меню).
 */

/** Крестик закрытия (Figma ic-close-24, в красной рамке negative-sec). */
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Опции-чекбоксы под каждым подсчётом (Figma 1504:178165/178662). */
const DIST_OPTIONS = [
  { label: "Установить процент опустится ниже которого при будущих корректировках будет невозможно." },
  { label: "Зафиксировать % поступлений без возможности изменений в будущем" },
];

const SUBACCOUNTS = ["Счет инвестиционных токенов", "Счет управляющих токенов", "Маршрутный счет"];

export function AccountSettingsScreen({
  backHref,
  voteHref,
}: {
  backHref?: string;
  voteHref?: string;
}) {
  const router = useRouter();
  const flow = useRegFlow();
  useEnsureAccountsReady();
  const close = () => (backHref != null ? router.push(backHref) : router.back());

  // Распределение фиксированных 100%: целевой счёт + три подсчёта в сумме = 100.
  // «Целевой счёт» — остаток (100 − Σ подсчётов): меняешь одно — пересчитываются
  // остальные. Буфер («переведено со счетов») — 0%, отдельная величина.
  const [subs, setSubs] = useState<number[]>([0, 0, 0]);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
  const target = 100 - sum(subs);

  // Подсчёт нельзя поднять так, чтобы Σ перевалила за 100 (целевой ушёл бы в минус).
  const setSub = (i: number, v: number) =>
    setSubs((prev) => {
      const others = sum(prev) - prev[i];
      return prev.map((x, idx) => (idx === i ? clamp(v, 0, 100 - others) : x));
    });

  // Редактирование целевого счёта перераспределяет разницу по подсчётам:
  // уменьшаешь целевой → добавляется подсчётам (по порядку), увеличиваешь → снимается.
  // «Запустить голосование»: сохранить раскладку, поставить вопрос на голосование,
  // перейти к вопросам голосования.
  const submit = () => {
    flow.startAccountsVote({ target, subs });
    router.push(voteHref ?? backHref ?? "/");
  };

  const setTarget = (t: number) =>
    setSubs((prev) => {
      let diff = (100 - clamp(t, 0, 100)) - sum(prev); // желаемая Σ подсчётов − текущая
      const next = [...prev];
      for (let i = 0; diff !== 0 && i < next.length; i++) {
        const idx = diff > 0 ? i : next.length - 1 - i; // добавляем с начала, снимаем с конца
        const room = diff > 0 ? 100 - next[idx] : next[idx];
        const change = Math.min(room, Math.abs(diff)) * Math.sign(diff);
        next[idx] += change;
        diff -= change;
      }
      return next;
    });

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: заголовок по центру + закрытие справа */}
          <div className="relative flex min-h-[40px] items-center justify-center">
            <h1 className="ds-h5 text-foreground">Настройка счета</h1>
            <span className="absolute right-0">
              <Button variant="negative-sec" size="m" icon={<CloseIcon />} aria-label="Закрыть" onClick={close} />
            </span>
          </div>

          {/* Карточка-редактор */}
          <div className="flex flex-col gap-8 rounded-[4px] border border-border bg-surface p-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Левая колонка — распределение */}
            <div className="flex w-full max-w-[600px] flex-col gap-4">
              <span className="ds-p3 text-foreground-subtle">Распределение целевого счета</span>
              <IncrimentField
                label="Целевой счет"
                size="m"
                value={target}
                onValueChange={setTarget}
                suffix="%"
                min={0}
                max={100}
              />

              <span className="ds-p3 mt-2 text-foreground-subtle">Распределение подсчетов целевого счета</span>
              {SUBACCOUNTS.map((name, i) => (
                <DistributionRow
                  key={name}
                  title={name}
                  value={subs[i]}
                  onValueChange={(v) => setSub(i, v)}
                  min={0}
                  max={subs[i] + target}
                  suffix="%"
                  options={DIST_OPTIONS}
                />
              ))}
            </div>

            {/* Правая колонка — буферная область */}
            <div className="flex w-full flex-none flex-col items-center gap-6 rounded-[4px] border border-border p-6 lg:w-[444px]">
              <div className="flex flex-col gap-2 text-center">
                <span className="ds-p2-medium text-foreground">Буфферная область</span>
                <span className="ds-p3 text-foreground-subtle">Процент переведенный со счетов</span>
              </div>
              <ProgressRing value={0} size={160} label={<span className="ds-h3 text-foreground">0%</span>} />
            </div>
          </div>

          {/* Футер: правила (слева) + запуск голосования (справа) */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Checkbox
              size="xs"
              checked={rulesAccepted}
              onChange={(e) => setRulesAccepted(e.target.checked)}
              label={<span style={{ color: "var(--color-blue-midhub-500)" }}>Правила редактирования счета</span>}
            />
            <Button disabled={!rulesAccepted} onClick={submit}>
              Запустить голосование
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
