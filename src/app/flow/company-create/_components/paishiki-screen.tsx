"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SectionHeader,
  Tabs,
  Tab,
  Input,
  Button,
  Checkbox,
  MemberCard,
  type MemberRow,
} from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { PaishikiMembersPanel } from "./paishiki-members-panel";
import { useRegFlow, PAISHIKI_NAMES } from "./reg-flow";
import { useRegFormTitle } from "./reg-form-view";

/**
 * PaishikiScreen — «Управление пайщиками кооператива». Источник: Figma
 * 2422:348051 / 2423:364038 / 2452:374733 / 2454:280291/357065 / 2459:357128 /
 * 2460:375528/474861.
 *
 * Каркас — общий CoopSidebar; контент — SectionHeader + Tabs + ПС (серая строка,
 * если flow.published; иначе синий баннер «Создать ПС») + кошельки + «Запросить
 * данные». Интерактив: после запроса кошельки → карточки «Пайщик №N» (спиннер
 * «Ожидание…») → поочерёдно приходят перс. данные (зелёная галка) → «Отправить
 * токены» → статус «Токен принят» → «Пригласить».
 */

type MemberStatus = "loading" | "data" | "accepted";

/** Имена приглашённых пайщиков — общий источник из RegFlow (Figma 475309). */
const NAMES = PAISHIKI_NAMES;
/** Имена новых кандидатов согласования (мок, отличны от засева совета), чтобы
 *  приглашённый через форму был виден отдельной строкой в табе «Совет». */
const NEW_CANDIDATE_NAMES = ["Кузнецова Ольга", "Никитин Павел", "Егорова Мария", "Лебедев Сергей", "Фомина Лидия"];

/** Кошельки пайщиков — свой у каждого (Figma 375528). */
const WALLETS = [
  "0xca30e63200a0fe3182dc61fc5605efc41456f32",
  "0x7b41d905c8e2f06a3d194bc7180ae52937fd0c1",
  "0x3e8f27ba604d15c9e0af8362d75be14098ca7d3",
  "0xf19c04e73a2850d6b1fc9e3407da6528b3710e9",
  "0x2d6a8c1f95b30e478ac52d90613fe8b7204cd56",
];
/** Паспортные данные — свои у каждого пайщика, в порядке PAISHIKI_NAMES. */
const PASSPORTS: MemberRow[][] = [
  [
    { label: "Фамилия", value: "Антонов" },
    { label: "Имя", value: "Илья" },
    { label: "Отчество", value: "Андреевич" },
    { label: "Номер паспорта", value: "40 12 574903" },
    { label: "Кем выдан", value: "ТП № 19 Калининского района, г. Санкт-Петербург" },
    { label: "Дата выдачи", value: "14.03.2012" },
  ],
  [
    { label: "Фамилия", value: "Курт" },
    { label: "Имя", value: "Розалина" },
    { label: "Отчество", value: "Игоревна" },
    { label: "Номер паспорта", value: "40 08 316742" },
    { label: "Кем выдан", value: "ТП № 44 Выборгского района, г. Санкт-Петербург" },
    { label: "Дата выдачи", value: "26.09.2008" },
  ],
  [
    { label: "Фамилия", value: "Дмитров" },
    { label: "Имя", value: "Александр" },
    { label: "Отчество", value: "Романович" },
    { label: "Номер паспорта", value: "41 15 208561" },
    { label: "Кем выдан", value: "ГУ МВД России по г. Санкт-Петербургу и Ленинградской обл." },
    { label: "Дата выдачи", value: "07.06.2015" },
  ],
  [
    { label: "Фамилия", value: "Александров" },
    { label: "Имя", value: "Дмитрий" },
    { label: "Отчество", value: "Андреевич" },
    { label: "Номер паспорта", value: "40 19 447130" },
    { label: "Кем выдан", value: "ТП № 21 Приморского района, г. Санкт-Петербург" },
    { label: "Дата выдачи", value: "12.11.2019" },
  ],
  [
    { label: "Фамилия", value: "Морозов" },
    { label: "Имя", value: "Виктор" },
    { label: "Отчество", value: "Николаевич" },
    { label: "Номер паспорта", value: "41 07 692418" },
    { label: "Кем выдан", value: "ТП № 33 Невского района, г. Санкт-Петербург" },
    { label: "Дата выдачи", value: "19.02.2007" },
  ],
];
const walletFor = (i: number) => WALLETS[i % WALLETS.length];
const passportFor = (i: number) => PASSPORTS[i % PASSPORTS.length];

function IdIcon() {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" {...s} />
      <circle cx="8.5" cy="11" r="1.8" {...s} />
      <path d="M5.8 15.2c.4-1.3 4-1.3 4.4 0M14 10h4M14 13.5h4" {...s} />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PaishikiScreen({
  agreementHref,
  ppListHref,
  routes,
  inviteToCouncil = false,
}: {
  agreementHref?: string;
  ppListHref?: string;
  routes?: Partial<CoopRoutes>;
  /** Приглашённые через форму попадают в таб «Согласование совета» (кандидаты),
   *  а не сразу в «Действующие». Операционный кабинет — true. */
  inviteToCouncil?: boolean;
}) {
  const router = useRouter();
  const flow = useRegFlow();
  const formTitle = useRegFormTitle();
  const [councilSignal, setCouncilSignal] = useState(0);

  const [wallets, setWallets] = useState<string[]>([""]);
  const [agreed, setAgreed] = useState(false);

  const [requested, setRequested] = useState(false);
  const [members, setMembers] = useState<{ addr: string; status: MemberStatus }[]>([]);
  const [sending, setSending] = useState(false);

  // «Пайщики completed»: приглашённые живут в RegFlow (переживают навигацию).
  const invitedMembers = flow.invitedMembers;
  const invited = invitedMembers.length > 0;
  const [formOpen, setFormOpen] = useState(false);

  const canRequest = agreed && wallets.some((w) => w.trim().length > 0);
  const anyLoading = members.some((m) => m.status === "loading");
  const allAccepted = members.length > 0 && members.every((m) => m.status === "accepted");

  // Поочерёдное появление перс. данных: первый «loading» через 1.2с → «data».
  useEffect(() => {
    const idx = members.findIndex((m) => m.status === "loading");
    if (idx === -1) return;
    const t = setTimeout(() => {
      setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, status: "data" } : m)));
    }, 1200);
    return () => clearTimeout(t);
  }, [members]);

  // Отправка токенов: предоставленные данные → «Токен принят».
  useEffect(() => {
    if (!sending) return;
    const t = setTimeout(() => {
      setMembers((prev) => prev.map((m) => (m.status === "data" ? { ...m, status: "accepted" } : m)));
      setSending(false);
    }, 1500);
    return () => clearTimeout(t);
  }, [sending]);

  // Засев «пайщики completed» по ?completed=1 (стабильная точка входа).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("completed") && flow.invitedMembers.length === 0) {
      flow.addInvitedMembers(NAMES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const request = () => {
    setMembers(
      wallets.map((w) => w.trim()).filter(Boolean).map((addr) => ({ addr, status: "loading" as MemberStatus })),
    );
    setRequested(true);
  };
  const addMember = () => setMembers((prev) => [...prev, { addr: walletFor(prev.length), status: "loading" }]);
  const cancelMember = (i: number) => setMembers((prev) => prev.filter((_, j) => j !== i));

  const resetForm = () => {
    setRequested(false);
    setMembers([]);
    setWallets([""]);
    setAgreed(false);
    setSending(false);
    setFormOpen(false);
  };
  // «Пригласить»: в кабинете приглашённые уходят в «Согласование совета»
  // (кандидаты для голосования совета), иначе — сразу в «Действующие».
  const invite = () => {
    if (inviteToCouncil) {
      const taken = new Set(flow.councilCandidates);
      const names: string[] = [];
      let k = 0;
      members.forEach((_, i) => {
        while (k < NEW_CANDIDATE_NAMES.length && taken.has(NEW_CANDIDATE_NAMES[k])) k++;
        const name = k < NEW_CANDIDATE_NAMES.length ? NEW_CANDIDATE_NAMES[k++] : `Новый пайщик ${flow.councilCandidates.length + i + 1}`;
        taken.add(name);
        names.push(name);
      });
      flow.addCouncilCandidates(names);
      setCouncilSignal((n) => n + 1); // переключить панель на таб «Совет»
    } else {
      const base = invitedMembers.length;
      flow.addInvitedMembers(members.map((_, i) => NAMES[(base + i) % NAMES.length]));
    }
    resetForm();
  };

  const isInput = !requested;
  const showForm = !invited || formOpen;

  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar current="paishiki" routes={routes} />

      {/* Контент */}
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col items-center gap-8 px-5 py-10 md:px-[50px]">
          <SectionHeader
            title="Управление пайщиками кооператива"
            subtitle="Новый пайщик отразится у вас в разделе согласования совета с нужным для вступления в кооператив набором документов."
            action={
              invited && !formOpen ? (
                <button type="button" className="ds-p3-medium text-primary" onClick={() => setFormOpen(true)}>
                  Пригласить нового пайщика
                </button>
              ) : undefined
            }
          />

          {showForm && (
            <>
              <Tabs variant="solid-light" size="s" defaultValue="phys" aria-label="Тип лица">
                <Tab value="phys">Физические лица</Tab>
                <Tab value="jur">Юридические лица</Tab>
              </Tabs>

              <div className="flex w-full flex-col gap-5">
            {/* ПС: серые строки (создано) → список ПС; иначе синий баннер «Создать» */}
            {flow.published ? (
              <Link
                href={ppListHref ?? "#"}
                className="flex h-12 w-full items-center gap-3 rounded-[4px] border border-border bg-surface-sunken px-6 text-left transition-colors hover:bg-[var(--color-grey-20)]"
              >
                <span className="text-foreground-subtle">
                  <IdIcon />
                </span>
                <span className="ds-p3 text-foreground">{formTitle}</span>
              </Link>
            ) : (
              <Link
                href={agreementHref ?? "#"}
                className="flex h-12 w-full items-center gap-3 rounded-[4px] border border-primary bg-primary-soft px-6 text-left text-primary transition-colors hover:bg-primary-soft/70"
              >
                <IdIcon />
                <span className="ds-p3-medium">Создать Пользовательское соглашение</span>
              </Link>
            )}
            <Button
              variant="secondary"
              size="s"
              icon={<PlusIcon />}
              aria-label="Создать соглашение"
              className="self-start"
              onClick={() => agreementHref != null && router.push(agreementHref)}
            />

            {/* Кошельки (ввод) → карточки пайщиков (после запроса) */}
            {isInput ? (
              <>
                {wallets.map((w, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Input
                      size="l"
                      className="flex-1"
                      label={w.trim().length > 0 ? "Кошелек пользователя" : undefined}
                      placeholder="Кошелек пользователя"
                      value={w}
                      onChange={(e) =>
                        setWallets((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))
                      }
                    />
                    <Button variant="ghost" size="l" disabled>QR-код</Button>
                    {invited && <Button variant="ghost" size="l" disabled>Скрипт</Button>}
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="s"
                  icon={<PlusIcon />}
                  aria-label="Добавить кошелёк"
                  className="self-start"
                  onClick={() => setWallets((prev) => [...prev, ""])}
                />
              </>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {members.map((m, i) => (
                    <MemberCard
                      key={i}
                      title={`Пайщик №${i + 1}`}
                      defaultOpen
                      rows={[{ label: "Адрес", value: m.addr || walletFor(i) }, ...(m.status !== "loading" ? passportFor(i) : [])]}
                      status={m.status === "loading" ? "loading" : "success"}
                      statusText={
                        m.status === "accepted"
                          ? "Токен принят"
                          : m.status === "data"
                            ? "Персональные данные предоставлены"
                            : "Ожидание предоставления перс. данных"
                      }
                      onCancel={() => cancelMember(i)}
                    />
                  ))}
                </div>
                {/* Добавить пайщика — новый проходит тот же флоу */}
                <Button
                  variant="secondary"
                  size="s"
                  icon={<PlusIcon />}
                  aria-label="Добавить пайщика"
                  className="self-start"
                  onClick={addMember}
                />
              </>
            )}

            {/* Правила + CTA: зависит от статусов карточек.
                Ввод → «Запросить данные»; идёт загрузка/отправка → спиннер;
                есть предоставленные данные → «Отправить токены»; все приняли
                токены → «Пригласить». */}
            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
              <Checkbox
                size="xxs"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={!isInput}
                label={<span className="text-primary">Правила авторизации пользователя</span>}
              />
              {isInput ? (
                <Button className="md:w-auto" fullWidth disabled={!canRequest} onClick={request}>
                  Запросить данные
                </Button>
              ) : sending || anyLoading ? (
                <Button className="md:w-auto" fullWidth loading>
                  Отправить токены
                </Button>
              ) : allAccepted ? (
                <Button className="md:w-auto" fullWidth onClick={invite}>
                  Пригласить
                </Button>
              ) : (
                <Button className="md:w-auto" fullWidth onClick={() => setSending(true)}>
                  Отправить токены
                </Button>
              )}
              </div>
            </div>

              {/* Свернуть форму приглашения (в режиме приглашённых) */}
              {invited && (
                <button type="button" className="ds-p3-medium text-primary" onClick={resetForm}>
                  Свернуть
                </button>
              )}
            </>
          )}

          {/* Панель управления пайщиками: табы + таблица приглашённых.
              mt-2 + gap-8 контейнера = 40px от «Свернуть»/ссылки до табов. */}
          {invited && <PaishikiMembersPanel members={invitedMembers} className="mt-2" focusCouncilSignal={councilSignal} />}
        </div>
      </main>
    </div>
  );
}
