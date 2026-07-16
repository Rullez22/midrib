"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { SectionHeader, Button, HeaderArrowLeftIcon, Tabs, Tab, Link } from "@/components/ds";
import { CoopRail } from "../../../flow/company-create/_components/coop-sidebar";
import { type PaymentVote } from "../../../flow/company-create/_components/reg-flow";
import { VotingBlock, InfoIcon } from "./voting-block";

/**
 * MemberVoteDetail — детальная страница вопроса «Добавление пайщиков»
 * (согласование совета). Источник: Figma 6537:356023 / 356212. Заголовок по
 * центру → «Основание для добавления в кооператив» (read-only) → «Выбранные
 * пайщики» (Частные/Юридическое) → универсальный VotingBlock.
 *
 * Reuse DS: CoopRail · SectionHeader · Button · Tabs · Link · VotingBlock (общий
 * блок голосования платформы). Структура — по образцу TokenVoteDetail.
 */

/** Заголовок колонки read-only таблицы. */
function Col({ children, flex, align }: { children: React.ReactNode; flex: number; align?: "center" | "right" }) {
  return (
    <span className={cn("ds-caption-medium text-foreground-subtle", align === "center" && "text-center", align === "right" && "text-right")} style={{ flex }}>
      {children}
    </span>
  );
}

export function MemberVoteDetail({ vote, onBack }: { vote: PaymentVote; onBack: () => void }) {
  const [tab, setTab] = useState<"private" | "legal">("private");
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

          {/* Основание для добавления в кооператив (read-only) */}
          <div className="flex flex-col gap-3">
            <span className="ds-p2-medium text-foreground">Основание для добавления в кооператив</span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 rounded-[4px] bg-[#f9fafc] px-4 py-2">
                <Col flex={2}>Тип документа</Col>
                <Col flex={1} align="center">Статус</Col>
                <Col flex={1} align="right">Дата</Col>
              </div>
              <div className="flex items-center gap-3 rounded-[4px] border border-border bg-surface px-4 py-3">
                <div className="flex flex-col gap-0.5" style={{ flex: 2 }}>
                  <span className="ds-caption text-foreground-subtle">Пользовательское соглашение</span>
                  <span className="ds-p3 text-foreground">Форма регистрации для граждан России, Болгарии</span>
                </div>
                <div className="flex justify-center" style={{ flex: 1 }}>
                  <span className="inline-flex items-center rounded-[4px] bg-[#e6f6e7] px-3 py-1.5 ds-caption-medium text-[#54be5a]">Согласован</span>
                </div>
                <div className="ds-p3 text-right text-foreground" style={{ flex: 1 }}>08.03.2025</div>
              </div>
            </div>
          </div>

          {/* Выбранные пайщики */}
          <div className="flex flex-col gap-3">
            <span className="ds-p2-medium text-foreground">Выбранные пайщики</span>
            <div className="flex items-center justify-center rounded-[4px] border border-border bg-[#f3f6f9] px-4 py-2">
              <span className="ds-caption-medium text-center text-[#5a646e]">Отмечено для добавления в кооператив: {count}</span>
            </div>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "private" | "legal")} variant="basic" size="m" aria-label="Тип пайщика" className="w-full">
              <Tab value="private">Частные пайщики</Tab>
              <Tab value="legal">Юридическое лицо</Tab>
            </Tabs>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 rounded-[4px] bg-[#f9fafc] px-[23px] py-2">
                <Col flex={1}>Пайщик</Col>
                <Col flex={1.4} align="center">{tab === "private" ? "Адрес" : "ID"}</Col>
                <Col flex={0.8} align="center">Страна</Col>
                <Col flex={0.8} align="right">Дата заявки</Col>
              </div>
              {rows.map((r, i) => (
                <div key={i} className="ds-row flex items-center gap-3 rounded-[4px] border border-border bg-surface px-[23px] py-4">
                  <span className="ds-p3 text-foreground" style={{ flex: 1 }}>{r.name}</span>
                  <span className="inline-flex items-center justify-center gap-1.5" style={{ flex: 1.4 }}>
                    <Link href="#" size="p3">{r.mid}</Link>
                    <InfoIcon />
                  </span>
                  <span className="ds-p3 text-center text-foreground" style={{ flex: 0.8 }}>ENG</span>
                  <span className="ds-p3 text-right text-foreground" style={{ flex: 0.8 }}>11.04.2025</span>
                </div>
              ))}
            </div>
          </div>

          {/* Универсальный блок голосования (Голосование + История транзакций) */}
          <VotingBlock vote={vote} onFinish={onBack} />
        </div>
      </main>
    </div>
  );
}
