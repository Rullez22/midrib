"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button, Tabs, Tab } from "@/components/ds";
import { AdminSidebar } from "./admin-sidebar";

/**
 * AdminReferralScreen — «Партнёрская программа» админки (Figma 6442:341406/341517/
 * 341500 + флоу приглашения 6479:333373…342870). Форма приглашения + табы партнёров.
 *
 * Флоу 1:1 с приглашением кооператива (manager-invite): «Пригласить» → профиль
 * устава (ProfileScreen) → партнёр в «Ожидают ответа» → «Подробнее» снова открывает
 * профиль. State-driven: шаги задаёт роут /cabinet/admin/invite/[step].
 * Reuse DS: Input · Button · Tabs · Tab.
 */

export interface AdminReferralRow {
  name: string;
  address: string;
  status?: string;
}

export interface AdminReferralState {
  /** Форма раскрыта (иначе — ссылка «Пригласить компанию»). */
  expanded?: boolean;
  /** Живая форма (контролируемые поля, кнопка активна по заполнению). */
  interactive?: boolean;
  walletValue?: string;
  orgValue?: string;
  activeTab?: "list" | "waiting";
  /** Подпись второго таба. По умолчанию «Ожидают ответа» (для кооператива — «Ожидают допуска»). */
  waitingLabel?: string;
  rows?: AdminReferralRow[];
  /** CTA «Пригласить компанию» (раскрыть). */
  expandHref?: string;
  /** CTA «Свернуть». */
  collapseHref?: string;
  /** Куда вести после «Пригласить» (в интерактивной форме). */
  submitHref?: string;
  /** CTA «Подробнее» в строке партнёра. */
  rowHref?: string;
}

function Disclaimer() {
  return (
    <p className="ds-caption max-w-[520px] text-foreground-subtle">
      *Нажимая кнопку «Пригласить», Вы подтверждаете, что приглашаемый Веб-ресурс
      соответствует требованиям, установленным в Правилах приглашения новых Веб-ресурсов
    </p>
  );
}

/** Контент реферальной (без сайдбара) — для страницы и шагов флоу. */
export function AdminReferralContent({ state }: { state: AdminReferralState }) {
  const {
    expanded = false,
    interactive = false,
    walletValue,
    orgValue,
    activeTab = "waiting",
    waitingLabel = "Ожидают ответа",
    rows = [],
    expandHref,
    collapseHref,
    submitHref,
    rowHref,
  } = state;

  const router = useRouter();
  const [wallet, setWallet] = useState(walletValue ?? "");
  const [org, setOrg] = useState(orgValue ?? "");
  const [tab, setTab] = useState<"list" | "waiting">(activeTab);
  const ready = wallet.trim() !== "" && org.trim() !== "";

  return (
    <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
      {/* Заголовок + описание */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="ds-h5 text-foreground">Партнерская программа</h1>
        <p className="ds-p3 max-w-[660px] text-foreground-muted">
          Приглашая партнеров, вы будете зарабатывать на пользователях Мидхаба, которые
          зарегистрировались в Мидхабе через наших партнеров.
        </p>
        <button type="button" className="ds-p2-medium text-primary hover:underline">
          Подробнее об ответственности и правилах вознаграждения
        </button>
      </div>

      {/* Свёрнуто → ссылка; развёрнуто → форма */}
      {!expanded ? (
        <div className="flex justify-center">
          <Link href={expandHref ?? "#"} className="ds-p2-medium text-primary underline">
            Пригласить компанию
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input
            size="l"
            label={wallet ? "Адрес кошелька представителя (основателя)" : undefined}
            placeholder="Адрес кошелька представителя (основателя)"
            value={wallet}
            readOnly={!interactive}
            onChange={interactive ? (e) => setWallet(e.target.value) : undefined}
          />
          <Input
            size="l"
            label={org ? "Наименование компании" : undefined}
            placeholder="Наименование компании"
            value={org}
            readOnly={!interactive}
            onChange={interactive ? (e) => setOrg(e.target.value) : undefined}
          />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Disclaimer />
            <Button
              size="l"
              className="md:w-[154px]"
              disabled={!interactive || !ready}
              onClick={() => { if (ready && submitHref) router.push(submitHref); }}
            >
              Пригласить
            </Button>
          </div>

          <div className="flex justify-center">
            <Link href={collapseHref ?? "#"} className="ds-p2-medium text-primary underline">
              Свернуть
            </Link>
          </div>
        </div>
      )}

      {/* Табы партнёров */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as "list" | "waiting")} variant="solid-light" size="l" equal aria-label="Партнёры" className="w-full">
        <Tab value="list">Список ваших партнеров</Tab>
        <Tab value="waiting">{waitingLabel}</Tab>
      </Tabs>

      {/* Список партнёров / пусто */}
      {rows.length === 0 ? (
        <p className="ds-p1 py-16 text-center text-[var(--color-grey-300)]">Список ваших партнеров пуст</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r, i) => (
            <div key={i} className="flex flex-wrap items-center gap-4 rounded-[4px] border border-border bg-surface px-6 py-4">
              <span className="ds-p3 w-40 shrink-0 text-foreground">{r.name}</span>
              <span className="ds-p3 flex-1 break-all text-center text-primary">{r.address}</span>
              {r.status && <span className="ds-p3 shrink-0 text-foreground-subtle">{r.status}</span>}
              <Link href={rowHref ?? "#"} className="ds-btn ds-btn--xs ds-btn--secondary shrink-0">
                <span className="ds-btn__label">Подробнее</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Страница /cabinet/admin — интерактивная форма приглашения. */
export function AdminReferralScreen({ state }: { state?: AdminReferralState }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar current="referral" />
      <main className="min-w-0 flex-1">
        <AdminReferralContent
          state={state ?? { expanded: true, interactive: true, activeTab: "waiting", submitHref: "/cabinet/admin/invite/1" }}
        />
      </main>
    </div>
  );
}
