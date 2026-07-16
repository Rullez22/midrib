"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  SectionHeader,
  Button,
  HeaderArrowLeftIcon,
  MemberCard,
  QuestionCard,
  ProgressRing,
  Badge,
  TableHeader,
  Tooltip,
  type MemberRow,
  type TableColumn,
} from "@/components/ds";
import { CoopRail } from "./coop-sidebar";
import { useEnsureInvited, useRegFlow } from "./reg-flow";

/**
 * CouncilVotingScreen — «Создание совета кооператива». Открывается из списка
 * вопросов голосования (клик по вопросу «Создание совета кооператива»).
 * Источник: Figma 2384:249325.
 *
 * Reuse DS: CoopRail (урезанное меню) · MemberCard (члены совета — паспортные
 * данные) · QuestionCard + ProgressRing + Badge + Button (голосование) ·
 * TableHeader + Item (история транзакций).
 *
 * @param backHref Назад — к списку вопросов голосования.
 */

const ADDR = "0xca30e63200a0fe3182dc61fc5605efc41456f32";
/** Полный хеш транзакции (тултип на ⓘ). */
const TX_FULL = "0x5c243af9b2e1c0d4a6f8e3b1c5d7a9e2f4b6c8d0a1b2c3d4e5f6a7b807db8";
const blue = "var(--color-blue-midhub-500)";
const dark = "var(--color-dark-900)";

/**
 * Ростер пайщиков — те же индексы, что в reg-flow (councilSlots/chairs) и
 * activity-screen MEMBERS. Слоты этапов ссылаются на него по индексу, поэтому
 * на голосовании показываются ФИО реально избранных пайщиков.
 */
const ROSTER = [
  { last: "Дмитров", first: "Александр", patr: "Романович", passport: "40 12 673215", issuedBy: "ТП № 19 отдела УФМС России по Санкт-Петербургу в Калининском районе", issuedAt: "14.06.2011" }, // 0
  { last: "Александров", first: "Дмитрий", patr: "Александрович", passport: "41 05 328940", issuedBy: "ОУФМС России по Санкт-Петербургу в Невском районе", issuedAt: "22.09.2015" }, // 1
  { last: "Курт", first: "Розалина", patr: "Артуровна", passport: "40 18 114562", issuedBy: "ГУ МВД России по Санкт-Петербургу и Ленинградской области", issuedAt: "03.02.2019" }, // 2
  { last: "Валенов", first: "Джо", patr: "Валенович", passport: "41 09 507318", issuedBy: "ТП № 47 отдела УФМС России по Санкт-Петербургу в Приморском районе", issuedAt: "28.11.2013" }, // 3
  { last: "Антонов", first: "Илья", patr: "Андреевич", passport: "40 15 892047", issuedBy: "ОУФМС России по Санкт-Петербургу в Выборгском районе", issuedAt: "17.04.2016" }, // 4
];

const memberRows = (m: (typeof ROSTER)[number]): MemberRow[] => [
  { label: "Адрес", value: ADDR },
  { label: "Фамилия", value: m.last },
  { label: "Имя", value: m.first },
  { label: "Отчество", value: m.patr },
  { label: "Номер паспорта", value: m.passport },
  { label: "Кем выдан", value: m.issuedBy },
  { label: "Дата выдачи", value: m.issuedAt },
];

function VoteRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="ds-caption text-foreground-subtle">{label}</span>
      <span className="ds-p3 text-foreground">{value}</span>
    </div>
  );
}

const TX_COLS: TableColumn[] = [
  { key: "user", label: "Участники" },
  { key: "res", label: "Результат", align: "center" },
  { key: "tx", label: "Номер транзакции", align: "center" },
  { key: "date", label: "Дата", align: "right", sortable: true },
];

/**
 * Даты голосов по этапам (сортировка колонки — по убыванию, поэтому первым идёт
 * самый свежий голос). Этапы идут по порядку: совет → пред. совета → пред.
 * правления, поэтому и даты этапов возрастают.
 */
const TX_TIMES: string[][] = [
  ["28.01.2025 - 17:20", "28.01.2025 - 15:44", "28.01.2025 - 12:05", "27.01.2025 - 19:31", "27.01.2025 - 11:08"],
  ["14.02.2025 - 16:52", "14.02.2025 - 14:17", "14.02.2025 - 10:39", "13.02.2025 - 18:04", "13.02.2025 - 09:26"],
  ["08.03.2025 - 18:35", "08.03.2025 - 16:03", "08.03.2025 - 13:48", "07.03.2025 - 20:12", "07.03.2025 - 10:55"],
];

/** Кружок результата: галочка («За») или минус («Против») — синий. */
function CircleMark({ minus = false }: { minus?: boolean }) {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full" style={{ background: blue }}>
      <svg width="14" height="14" viewBox="0 0 24 24" style={{ color: "#fff" }}>
        {minus ? (
          <path d="M6 12h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        ) : (
          <path d="m6 12 4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </span>
  );
}

/** Инфо-иконка ⓘ (grey) рядом с номером транзакции. */
function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7v3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** Строка истории транзакций — зебра (чётные серые), 4 колонки 1:1 с TableHeader. */
function TxLine({ time, minus = false, striped = false }: { time: string; minus?: boolean; striped?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 px-6 py-4", striped && "bg-[var(--color-grey-10)]")}>
      <span className="flex-1 truncate" style={{ color: dark }}>{ADDR}</span>
      <span className="flex flex-1 justify-center"><CircleMark minus={minus} /></span>
      <span className="flex flex-1 items-center justify-center gap-1.5" style={{ color: blue }}>
        5c243af... 07db8
        {/* Тултип с полным хешем транзакции при наведении на ⓘ */}
        <Tooltip content={<span className="break-all">{TX_FULL}</span>} side="top">
          <span className="inline-flex cursor-help">
            <InfoIcon />
          </span>
        </Tooltip>
      </span>
      <span className="flex-1 text-right" style={{ color: dark }}>{time}</span>
    </div>
  );
}

export function CouncilVotingScreen({ backHref, doneHref }: { backHref?: string; doneHref?: string }) {
  const router = useRouter();
  const flow = useRegFlow();
  useEnsureInvited();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());
  // «Завершить голосование» → следующий этап совета + назад в «Деятельность».
  const finish = () => {
    flow.advanceCouncilStage();
    if (doneHref != null) router.push(doneHref);
  };
  // Открытый этап: клик по вопросу (councilViewStage) либо текущий. Завершённый
  // этап (< councilStage) открывается в режиме «только результаты» — без кнопок
  // голосования и «Завершить голосование», но всегда доступен для просмотра.
  const stage = Math.min(flow.councilViewStage ?? flow.councilStage, 2);
  const readOnly = (flow.councilViewStage ?? flow.councilStage) < flow.councilStage;

  // Голосование: null — не голосовал; иначе выбор «За»/«Против». В режиме
  // результатов считаем голос отданным («За»), чтобы показать итог.
  const [rawChoice, setChoice] = useState<"За" | "Против" | null>(null);
  const choice = readOnly ? "За" : rawChoice;
  const voted = choice != null;

  // Карточки голосования зависят от открытого этапа: 0 — все члены совета;
  // 1 — один председатель совета; 2 — один председатель правления. Слоты берём из
  // reg-flow (избранные пайщики), с защитным дефолтом на случай прямого захода.
  const stageSlots: number[] =
    stage === 0
      ? flow.councilSlots.some((x) => x != null)
        ? flow.councilSlots.filter((x): x is number => x != null)
        : [0, 1, 2]
      : stage === 1
        ? [flow.chairs[0] ?? 3]
        : [flow.chairs[1] ?? 4];
  const cardTitle = (i: number) =>
    stage === 0 ? `Член совета №${i + 1}` : stage === 1 ? "Председатель совета" : "Председатель правления";

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-10 px-5 py-8 md:px-[50px]">
          {/* Шапка: назад + заголовок по центру */}
          <div className="relative flex min-h-[40px] items-center">
            <Button variant="ghost" size="m" icon={<HeaderArrowLeftIcon />} aria-label="Назад" onClick={goBack} />
            <SectionHeader
              className="absolute left-1/2 -translate-x-1/2"
              title={stage === 0 ? "Создание совета кооператива" : stage === 1 ? "Выбор председателя совета" : "Выбор председателя правления"}
            />
          </div>

          {/* Карточки голосуемых: все члены совета / один председатель — по этапу */}
          {stageSlots.map((idx, i) => (
            <MemberCard key={idx} title={cardTitle(i)} defaultOpen rows={memberRows(ROSTER[idx])} />
          ))}

          {/* Голосование */}
          <QuestionCard title="Голосование" defaultOpen>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex flex-1 flex-col gap-4">
                  <VoteRow label="Ваш ID" value="0x608ed3676ab20f3055c7ff4d99428afead95f58a" />
                  <VoteRow label="Кол-во голосов для принятия решения" value="5" />
                  <VoteRow label="Проголосовало" value={voted ? "5" : "3"} />
                  <VoteRow
                    label="Ваш статус ответа"
                    value={
                      voted ? (
                        <span style={{ color: choice === "За" ? blue : "var(--color-red-300)" }}>{choice}</span>
                      ) : (
                        <span className="text-[#f18000]">Ожидает участия</span>
                      )
                    }
                  />
                  {voted && (
                    <VoteRow label="Статус голосования" value={<span className="text-[var(--color-green-500)]">Выполнено</span>} />
                  )}
                </div>
                <div
                  className="flex w-full flex-none flex-col items-center overflow-hidden rounded-[4px] border lg:w-[425px]"
                  style={{ borderColor: "var(--color-blue-midhub-500)" }}
                >
                  <div className="flex flex-col items-center gap-6 px-6 py-6">
                    <div className="flex flex-col gap-2 text-center">
                      <div className="ds-p2-medium text-foreground">Завершенность голосования</div>
                      <div className="ds-p3 text-foreground-subtle">Общее процентное отношение</div>
                    </div>
                    <ProgressRing
                      value={voted ? 100 : 75}
                      size={160}
                      thickness={12}
                      label={<span className="ds-h3 text-foreground">{voted ? 100 : 75}%</span>}
                    />
                  </div>
                  {/* Футер — серая плашка (Figma footer #f3f6f9). До голосования —
                      кнопки Против/За; после — отметка «Вы успешно проголосовали». */}
                  <div className="w-full bg-[var(--color-grey-20)] p-6">
                    {voted ? (
                      <span className="ds-p3 flex items-center justify-center gap-2 text-foreground-muted">
                        <CircleMark minus={choice === "Против"} />
                        {choice === "За" ? "Вы успешно проголосовали" : "Вы проголосовали против"}
                      </span>
                    ) : (
                      <div className="flex gap-3">
                        <Button variant="negative-sec" className="flex-1" onClick={() => setChoice("Против")}>Против</Button>
                        <Button className="flex-1" onClick={() => setChoice("За")}>За</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </QuestionCard>

          {/* «Завершить голосование» — отдельная кнопка вне карточки, справа,
              отступ 40px от карточки (Figma 2628:357505, top-520 vs card 480).
              В режиме результатов (завершённый этап) кнопки нет. */}
          {voted && !readOnly && (
            <div className="flex justify-end">
              <Button variant="negative-sec" onClick={finish}>Завершить голосование</Button>
            </div>
          )}

          {/* История транзакций */}
          <QuestionCard title="История транзакций" defaultOpen>
            {/* -mx-[23px] компенсирует горизонтальный паддинг тела карточки —
                заливка строк (зебра) идёт от края до края. */}
            <div className="-mx-[23px] flex flex-col">
              <TableHeader columns={TX_COLS} sortKey="date" sortDir="desc" />
              {Array.from({ length: voted ? 5 : 3 }).map((_, i) => (
                <TxLine
                  key={i}
                  time={TX_TIMES[stage][i]}
                  minus={choice === "Против"}
                  striped={i % 2 === 0}
                />
              ))}
            </div>
          </QuestionCard>
        </div>
      </main>
    </div>
  );
}
