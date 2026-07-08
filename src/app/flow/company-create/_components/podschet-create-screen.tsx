"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Radio,
  Textarea,
  Checkbox,
  Combobox,
  IncrimentField,
  ProgressRing,
  DeleteButton,
} from "@/components/ds";
import { CoopRail } from "./coop-sidebar";
import { useEnsureAccountsReady, useRegFlow } from "./reg-flow";

/**
 * PodschetCreateScreen — «Создание нового подсчета»: форма (название, тип, ОКВЭД,
 * назначение, источник) + редактор распределения целевого счёта. Остаток (буфер)
 * распределения — доля нового подсчёта (кольцо «Процент переведенный со счетов»).
 * Источник: Figma 2493:286557 (пусто) / 2494:290721 (заполнено).
 *
 * Reuse DS: CoopRail · Input · Radio · Textarea · DeleteButton · IncrimentField ·
 * ProgressRing · Checkbox · Button. Композиция повторяет demo PodschetDemos.
 *
 * @param backHref Назад (←).
 * @param voteHref «Запустить голосование» — на вопросы голосования.
 */

const SUBACCOUNTS = ["Счет инвестиционных токенов", "Счет управляющих токенов", "Маршрутный счет"];
/** Каталог ОКВЭД для выбора из дропдауна (value = код, label = полная строка). */
const OKVED_CATALOG: { code: string; label: string }[] = [
  { code: "81.22", label: "81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая" },
  { code: "81.29.1", label: "81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования" },
  { code: "81.30", label: "81.30 - Предоставление услуг по благоустройству ландшафта;" },
  { code: "82.99", label: "82.99 - Деятельность по предоставлению прочих вспомогательных услуг для бизнеса" },
  { code: "70.22", label: "70.22 - Консультирование по вопросам коммерческой деятельности и управления" },
  { code: "63.11", label: "63.11 - Деятельность по обработке данных, предоставление услуг по размещению информации" },
];
const PANEL_OPTS = [
  "Установить процент опустится ниже которого при будущих корректировках будет невозможно.",
  "Зафиксировать % поступлений без возможности изменений в будущем",
];

export function PodschetCreateScreen({
  backHref,
  voteHref,
}: {
  backHref?: string;
  voteHref?: string;
}) {
  const router = useRouter();
  const flow = useRegFlow();
  useEnsureAccountsReady();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());

  const [name, setName] = useState("");
  const [type, setType] = useState<"pool" | "matryoshka">("pool");
  // Выбранные коды ОКВЭД (из дропдауна). Храним коды; строки берём из каталога.
  const [okved, setOkved] = useState<string[]>([]);
  const [purpose, setPurpose] = useState("");
  const okvedOptions = OKVED_CATALOG.filter((o) => !okved.includes(o.code)).map((o) => ({ value: o.code, label: o.label }));
  const okvedLabel = (code: string) => OKVED_CATALOG.find((o) => o.code === code)?.label ?? code;
  const addOkved = (code: string) => setOkved((prev) => (prev.includes(code) ? prev : [...prev, code]));
  // Распределение: целевой счёт + 3 базовых подсчёта; остаток (буфер) — новый подсчёт.
  const [target, setTarget] = useState(40);
  const [subs, setSubs] = useState<number[]>([20, 20, 20]);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
  const sum = target + subs.reduce((a, b) => a + b, 0);
  const buffer = Math.max(0, 100 - sum); // доля нового подсчёта
  // Каждое поле ограничено так, чтобы суммарно не превысить 100.
  const setTargetClamped = (v: number) => setTarget(clamp(v, 0, target + buffer));
  const setSub = (i: number, v: number) =>
    setSubs((prev) => prev.map((x, idx) => (idx === i ? clamp(v, 0, x + buffer) : x)));

  const submit = () => {
    flow.startPodschetVote({ name: name || "Новый подсчет", type, okved: okved.map(okvedLabel), purpose, target, subs });
    router.push(voteHref ?? backHref ?? "/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: назад + заголовок по центру */}
          <div className="relative flex min-h-[40px] items-center justify-center">
            <span className="absolute left-0">
              <Button variant="ghost" size="m" icon={<BackIcon />} aria-label="Назад" onClick={goBack} />
            </span>
            <h1 className="ds-p2-medium text-center text-foreground">Создание нового подсчета</h1>
          </div>

          {/* Карточка-редактор */}
          <div className="flex flex-col gap-8 rounded-[4px] border border-border bg-surface p-6">
            {/* Форма */}
            <div className="flex w-full max-w-[600px] flex-col gap-5">
              <Input size="l" placeholder="Название подсчета" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="flex flex-col gap-3">
                <span className="ds-p3 text-foreground-subtle">Выберите тип подсчета</span>
                <div className="flex items-center gap-8">
                  <Radio name="ptype" value="pool" size="xs" checked={type === "pool"} onChange={() => setType("pool")} label="Счет-пул" />
                  <Radio name="ptype" value="matryoshka" size="xs" checked={type === "matryoshka"} onChange={() => setType("matryoshka")} label="Счет-матрешка" />
                </div>
              </div>
              {/* ОКВЭД — выбор из дропдауна (тот же Combobox, что в профиле
                  кооператива). Поле остаётся пустым (value=""), выбранные коды —
                  списком ниже с удалением. */}
              <Combobox
                size="l"
                value=""
                placeholder="Напишите ОКВЭД или выберите из списка"
                options={okvedOptions}
                onValueChange={addOkved}
                aria-label="ОКВЭД"
              />
              {okved.length > 0 && (
                <div className="flex flex-col gap-2">
                  {okved.map((code) => (
                    <div key={code} className="flex items-center justify-between gap-3">
                      <span className="ds-p3 text-foreground">{okvedLabel(code)}</span>
                      <DeleteButton size="sm" aria-label="Удалить ОКВЭД" onClick={() => setOkved((p) => p.filter((c) => c !== code))} />
                    </div>
                  ))}
                </div>
              )}
              <Textarea size="l" placeholder="Назначение счета" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              <div className="flex flex-col gap-1">
                <span className="ds-caption text-foreground-subtle">Источник поступлений</span>
                <span className="ds-p3 text-foreground">Целевой счет</span>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            {/* Распределение + правая панель */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex w-full max-w-[600px] flex-col gap-4">
                <span className="ds-p3 text-foreground-subtle">Распределение целевого счета</span>
                <IncrimentField label="Целевой счет" size="m" value={target} onValueChange={setTargetClamped} suffix="%" min={0} max={100} />
                <span className="ds-p3 mt-2 text-foreground-subtle">Распределение подсчетов целевого счета</span>
                {SUBACCOUNTS.map((label, i) => (
                  <IncrimentField key={label} label={label} size="m" value={subs[i]} onValueChange={(v) => setSub(i, v)} suffix="%" min={0} max={100} />
                ))}
              </div>

              {/* Правая панель: имя нового подсчёта + кольцо буфера + опции */}
              <div className="flex w-full flex-none flex-col rounded-[4px] border border-primary lg:w-[444px]">
                <div className="flex flex-col items-center gap-6 px-6 py-6">
                  <div className="flex flex-col gap-2 text-center">
                    <span className="ds-p2-medium text-foreground">{name || "Название подсчета"}</span>
                    <span className="ds-p3 text-foreground-subtle">Процент переведенный со счетов</span>
                  </div>
                  <ProgressRing value={buffer} size={160} label={<span className="ds-h3 text-foreground">{buffer}%</span>} />
                </div>
                {PANEL_OPTS.map((o) => (
                  <div key={o} className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
                    <span className="ds-caption text-foreground-subtle">{o}</span>
                    <Checkbox size="xs" aria-label="Отметить" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Футер: правила + запуск голосования */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Checkbox
              size="xs"
              checked={rulesAccepted}
              onChange={(e) => setRulesAccepted(e.target.checked)}
              label={<span style={{ color: "var(--color-blue-midhub-500)" }}>Правила редактирования счета</span>}
            />
            <Button disabled={!rulesAccepted} onClick={submit}>Запустить голосование</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path d="m14 7-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
