"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  SectionHeader,
  Button,
  HeaderArrowLeftIcon,
  Tabs,
  Tab,
  Link,
  PartnerCard,
  IncrimentField,
} from "@/components/ds";
import { CoopRail } from "../../../flow/company-create/_components/coop-sidebar";
import { type PaymentVote } from "../../../flow/company-create/_components/reg-flow";
import {
  StablePercentConfig,
  BalancePill,
  SectionTitle,
  PoolSummaryTable,
  BASE_SHARES,
  BASE_PAISHIKI,
  BASE_PERSONAL_PAISHIKI,
} from "../../payment/_components/payment-shared";
import { VotingBlock, VoteRow, InfoIcon } from "./voting-block";

/**
 * PaymentVoteDetail — детальная страница вопроса голосования по платежу/подключению.
 * Заголовок по центру → контент вопроса (Основание + получатели/пайщик/доли) →
 * универсальный VotingBlock («Голосование» + «История транзакций»).
 * Функционально через RegFlow.
 */

/** Заголовок колонки read-only таблицы (Сумма/Пайщик/Адрес/Страна и т.п.). */
function Col({ children, flex, align }: { children: React.ReactNode; flex: number; align?: "center" | "right" }) {
  return (
    <span className={cn("ds-caption-medium text-foreground-subtle", align === "center" && "text-center", align === "right" && "text-right")} style={{ flex }}>
      {children}
    </span>
  );
}

export function PaymentVoteDetail({ vote, onBack }: { vote: PaymentVote; onBack: () => void }) {
  const [tab, setTab] = useState<"private" | "legal">("private");

  const stable = vote.kind === "stable";
  const mass = vote.kind === "mass";
  const personal = vote.kind === "personal";
  const poolBasePaishiki = personal ? BASE_PERSONAL_PAISHIKI : BASE_PAISHIKI;
  const rows = vote.recipients.filter((r) => (tab === "legal" ? r.legal : !r.legal));
  const count = vote.recipients.length;

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-10 px-5 py-8 md:px-[50px]">
      {/* Шапка: назад + заголовок по центру (как у совета) */}
      <div className="relative flex min-h-[40px] items-center">
        <Button variant="ghost" size="m" icon={<HeaderArrowLeftIcon />} aria-label="Назад" onClick={onBack} />
        <SectionHeader className="absolute left-1/2 -translate-x-1/2" title={vote.title} />
      </div>

      {/* Стабильный платёж: плашка баланса → gap 8px → карточка пайщика-плательщика */}
      {stable && vote.payer && (
        <div className="flex flex-col gap-2">
          <div className="self-end"><BalancePill /></div>
          <PartnerCard
            title={vote.payer.name}
            description={vote.payer.description}
            avatar={<img src={vote.payer.avatarSrc} alt="" className="size-full object-cover" />}
            onDetails={() => {}}
            selectLabel=""
            hideActions
          />
        </div>
      )}

      {/* Массовое подключение: плашка баланса → сводная таблица пул-счёта */}
      {mass && (
        <div className="flex flex-col gap-2">
          <div className="self-end"><BalancePill label="Маркетинговый счет" /></div>
          <PoolSummaryTable paishiki={BASE_PAISHIKI + count} shares={BASE_SHARES + (vote.shares ?? 0) * count} />
        </div>
      )}

      {/* Персональное подключение: баланс → сводная таблица → «Выбранный пайщик» */}
      {personal && (
        <>
          <div className="flex flex-col gap-2">
            <div className="self-end"><BalancePill label="Маркетинговый счет" /></div>
            <PoolSummaryTable paishiki={BASE_PERSONAL_PAISHIKI} shares={BASE_SHARES + (vote.shares ?? 0)} />
          </div>
          {vote.payer && (
            <div className="flex flex-col gap-3">
              <span className="ds-p2-medium text-foreground">Выбранный пайщик</span>
              <PartnerCard
                title={vote.payer.name}
                description={vote.payer.description}
                avatar={<img src={vote.payer.avatarSrc} alt="" className="size-full object-cover" />}
                onDetails={() => {}}
                hideSelect
              />
            </div>
          )}
        </>
      )}

      {/* Основание */}
      <div className="flex flex-col gap-3">
        <span className="ds-p2-medium text-foreground">{stable ? "Основание для платежа" : "Основание для добавления в пул-счет"}</span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 rounded-[4px] bg-[#f9fafc] px-4 py-2">
            <Col flex={2}>Тип документа</Col>
            <Col flex={1} align="center">Статус</Col>
            <Col flex={1} align="right">Дата</Col>
          </div>
          <div className="flex items-center gap-3 rounded-[4px] border border-border bg-surface px-4 py-3">
            <div className="flex flex-col gap-0.5" style={{ flex: 2 }}>
              <span className="ds-caption text-foreground-subtle">Договор</span>
              <span className="ds-p3 text-foreground">{vote.docName}</span>
            </div>
            <div className="flex justify-center" style={{ flex: 1 }}>
              <span className="inline-flex items-center rounded-[4px] bg-[#e6f6e7] px-3 py-1.5 ds-caption-medium text-[#54be5a]">Согласован</span>
            </div>
            <div className="ds-p3 text-right text-foreground" style={{ flex: 1 }}>19.05.2025</div>
          </div>
        </div>
      </div>

      {/* Массовое/персональное подключение: «Настройка долей» (read-only) */}
      {(mass || personal) && (
        <div className="flex flex-col gap-3">
          <SectionTitle>Настройка долей</SectionTitle>
          <div className="w-full max-w-[470px]">
            <IncrimentField label="Количество долей на пайщика" value={vote.shares ?? 0} readOnly />
          </div>
          <VoteRow label="Всего долей в счет-пуле" value={BASE_SHARES} />
          <VoteRow label="Всего пайщиков в счет-пуле" value={poolBasePaishiki} />
        </div>
      )}

      {/* Стабильный: «Настройка %» (read-only). Иначе — таблица получателей. */}
      {stable && vote.distribution ? (
        <div className="flex flex-col gap-3">
          <span className="ds-p2-medium text-foreground">Настройка %</span>
          <StablePercentConfig
            target={vote.distribution.target}
            subs={vote.distribution.subs}
            payerShare={vote.distribution.payerShare}
            days={vote.distribution.days}
            sum={vote.distribution.sum}
            recurring
            readOnly
          />
        </div>
      ) : personal ? null : (
        /* Выбранные пайщики (Figma 449248) */
        <div className="flex flex-col gap-3">
          <span className="ds-p2-medium text-foreground">Выбранные пайщики</span>
          <div className="flex items-center justify-between rounded-[4px] border border-border bg-[#f3f6f9] px-4 py-2">
            <span className="ds-caption-medium flex-1 text-center text-[#5a646e]">Отмечено: {count}</span>
            <button type="button" aria-label="Меню" className="text-[#5a646e]">⋮</button>
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "private" | "legal")} variant="basic" size="m" aria-label="Тип получателя" className="w-full">
            <Tab value="private">Частные пайщики</Tab>
            <Tab value="legal">Юридическое лицо</Tab>
          </Tabs>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 rounded-[4px] bg-[#f9fafc] px-[23px] py-2">
              <Col flex={1}>{mass ? "Доля в счете" : "Сумма"}</Col>
              <Col flex={1.2} align="center">Пайщик</Col>
              <Col flex={1.2} align="center">{tab === "private" ? "Адрес" : "ID"}</Col>
              <Col flex={0.8} align="right">Страна</Col>
            </div>
            {rows.map((r, i) => (
              <div key={i} className="ds-row flex items-center gap-3 rounded-[4px] border border-border bg-surface px-[23px] py-4">
                {mass ? (
                  <span className="ds-p2-medium text-[var(--color-blue-midhub-500)]" style={{ flex: 1 }}>{vote.shares}</span>
                ) : (
                  <span className="ds-p3 text-foreground" style={{ flex: 1 }}>{vote.amount} ETH</span>
                )}
                <span className="ds-p3 text-center text-foreground" style={{ flex: 1.2 }}>{r.name}</span>
                <span className="inline-flex items-center justify-center gap-1.5" style={{ flex: 1.2 }}>
                  <Link href="#" size="p3">{r.mid}</Link>
                  <InfoIcon />
                </span>
                <span className="ds-p3 text-right text-foreground" style={{ flex: 0.8 }}>ENG</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Универсальный блок голосования (Голосование + История транзакций) */}
      <VotingBlock vote={vote} onFinish={onBack} />
        </div>
      </main>
    </div>
  );
}
