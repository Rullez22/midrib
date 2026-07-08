"use client";

import { type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tabs,
  Tab,
  Item,
  Input,
  Button,
  Checkbox,
  Combobox,
  SectionCard,
  Link as DsLink,
  EmptyState,
  Text,
} from "@/components/ds";

/**
 * ReferralScreen — экран «Приглашение партнёров» (Реферальная).
 * Источник: Figma «партнёрская программа» (2262:202327, 2275:207362,
 * 2275:207682, 2275:208332, 2279:253128, 2292:307252, 2294:256471, 2294:256223).
 * Собран из DS: Tabs, Item, Input, Button, Checkbox, Combobox, EmptyState, Link.
 */

export interface ReferralRow {
  name: string;
  address: string;
}

export interface ReferralState {
  /** Форма раскрыта (иначе — ссылка «Пригласить нового партнёра»). */
  expanded?: boolean;
  /** Значение поля кошелька. */
  walletValue?: string;
  /** Кошелёк показан как свёрнутый дропдаун (этап отправки). */
  walletAsDropdown?: boolean;
  /** Выбранный партнёр (аккордеон «Партнёр»). */
  partnerAddress?: string;
  orgValue?: string;
  agreed?: boolean;
  submit?: "disabled" | "enabled" | "loading";
  /** Живая форма: контролируемые поля + чекбокс, кнопка активна по заполнению. */
  interactive?: boolean;
  activeTab?: "invited" | "waiting";
  rows?: ReferralRow[];
  /** CTA «Пригласить нового партнёра». */
  expandHref?: string;
  /** CTA «Свернуть». */
  collapseHref?: string;
  /** CTA основной кнопки «Отправить приглашение» (enabled). */
  submitHref?: string;
  /** CTA «Подробнее» в строке списка. */
  rowHref?: string;
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className="size-24 opacity-70">
      <circle cx="48" cy="48" r="22" fill="var(--color-blue-midhub-100)" />
      <ellipse cx="48" cy="48" rx="22" ry="22" stroke="var(--color-blue-midhub-300)" strokeWidth="1.5" />
      <path d="M26 48h44M48 26c7 6 7 38 0 44M48 26c-7 6-7 38 0 44" stroke="var(--color-blue-midhub-300)" strokeWidth="1.5" fill="none" />
      {[
        [20, 26], [74, 24], [80, 56], [24, 70], [60, 76], [40, 18],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="6" fill="var(--color-white)" stroke="var(--color-blue-midhub-200)" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function IdIcon() {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="12" rx="2" {...s} />
      <circle cx="8.5" cy="11" r="1.8" {...s} />
      <path d="M5.8 15.2c.4-1.3 4-1.3 4.4 0M14 10h4M14 13.5h4" {...s} />
    </svg>
  );
}

export function ReferralScreen({ state }: { state: ReferralState }) {
  const {
    expanded = false,
    walletValue,
    walletAsDropdown = false,
    partnerAddress,
    orgValue,
    agreed = false,
    submit = "disabled",
    interactive = false,
    activeTab = "waiting",
    rows = [],
    expandHref,
    collapseHref,
    submitHref,
    rowHref,
  } = state;

  const [walletInput, setWalletInput] = useState(walletValue ?? "");
  const [orgInput, setOrgInput] = useState(orgValue ?? "");
  const [checked, setChecked] = useState(agreed);
  const [submitted, setSubmitted] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const ready = walletInput.trim() !== "" && orgInput.trim() !== "" && checked;
  const cancelPartner = () => {
    setSubmitted(false);
    setPartnerOpen(false);
  };

  // После «Отправить» кнопка крутит лоадер 3с → переход на экран профиля.
  // Если за это время нажать «Отменить выбор» — таймер сбрасывается.
  const router = useRouter();
  useEffect(() => {
    if (!submitted || !submitHref) return;
    const t = setTimeout(() => router.push(submitHref), 3000);
    return () => clearTimeout(t);
  }, [submitted, submitHref, router]);

  return (
    <div className="flex w-full flex-col gap-8 px-5 py-10 md:px-[50px]">
      {/* Заголовок + описание */}
      <div className="flex flex-col gap-2 text-center">
        <Text variant="h5" className="text-[20px] leading-[28px]">
          Приглашение партнеров
        </Text>
        <Text variant="p2" tone="muted">
          Приглашая партнеров, вы будете зарабатывать на пользователях, которые
          зарегистрировались в Мидхабе через наших партнеров.
          <br />
          <span className="text-primary">
            Подробнее об ответственности и правилах вознаграждения.
          </span>
        </Text>
      </div>

      {/* Тело: ссылка-раскрытие ИЛИ форма */}
      {!expanded ? (
        <div className="flex justify-center">
          <Link href={expandHref ?? "#"} className="ds-p2-medium text-primary hover:underline">
            Пригласить нового партнера
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <Item size="s" tone="muted" leading={<IdIcon />}>
            <span className="ds-p3-medium text-foreground-muted">
              Форма регистрации для граждан России, Болгарии
            </span>
          </Item>

          {interactive ? (
            <>
              {/* Кошелёк → после «Отправить» становится карточкой «Партнёр» */}
              {submitted ? (
                <SectionCard
                  title={
                    partnerOpen ? (
                      "Партнер"
                    ) : (
                      <span className="break-all text-primary">{walletInput}</span>
                    )
                  }
                  open={partnerOpen}
                  onOpenChange={setPartnerOpen}
                >
                  <div className="flex flex-wrap gap-x-6 gap-y-1 px-6 py-3.5">
                    <span className="ds-caption w-[260px] shrink-0 text-foreground-subtle">Адрес</span>
                    <span className="ds-caption flex-1 break-all text-foreground">{walletInput}</span>
                  </div>
                  <div className="flex justify-end border-t border-border bg-surface-muted px-6 py-3">
                    <Button variant="negative-sec" size="m" onClick={cancelPartner}>
                      Отменить выбор
                    </Button>
                  </div>
                </SectionCard>
              ) : (
                <div className="flex items-start gap-4">
                  <Input
                    size="l"
                    className="flex-1"
                    label={walletInput ? "Адрес кошелька представителя(основателя)" : undefined}
                    placeholder="Адрес кошелька представителя(основателя)"
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                  />
                  <Button variant="ghost" size="l">QR-код</Button>
                </div>
              )}

              <Input
                size="l"
                label={orgInput ? "Наименование организации" : undefined}
                placeholder="Наименование организации"
                value={orgInput}
                readOnly={submitted}
                onChange={submitted ? undefined : (e) => setOrgInput(e.target.value)}
              />

              <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
                <Checkbox
                  size="xxs"
                  checked={checked}
                  disabled={submitted}
                  onChange={(e) => setChecked(e.target.checked)}
                  label={<span className="text-primary">Правила авторизации пользователя</span>}
                />
                <Button
                  fullWidth
                  className="md:w-auto"
                  loading={submitted}
                  disabled={!submitted && !ready}
                  onClick={() => {
                    if (!submitted && ready) setSubmitted(true);
                  }}
                >
                  Отправить приглашение
                </Button>
              </div>
            </>
          ) : (
            <>
              {partnerAddress != null && (
                <SectionCard title="Партнер" defaultOpen>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 px-6 py-3.5">
                    <span className="ds-caption w-[260px] shrink-0 text-foreground-subtle">Адрес</span>
                    <span className="ds-caption flex-1 break-all text-foreground">{partnerAddress}</span>
                  </div>
                  <div className="flex justify-end border-t border-border bg-surface-muted px-6 py-3">
                    <Button variant="negative-sec" size="m">Отменить выбор</Button>
                  </div>
                </SectionCard>
              )}

              {walletAsDropdown ? (
                <Combobox
                  options={[{ value: walletValue ?? "", label: walletValue ?? "" }]}
                  value={walletValue}
                  onValueChange={() => {}}
                  aria-label="Адрес кошелька"
                />
              ) : (
                <div className="flex items-start gap-4">
                  <Input
                    size="l"
                    className="flex-1"
                    label={walletValue ? "Адрес кошелька представителя(основателя)" : undefined}
                    placeholder="Адрес кошелька представителя(основателя)"
                    defaultValue={walletValue}
                    readOnly
                  />
                  <Button variant="ghost" size="l">QR-код</Button>
                </div>
              )}

              <Input
                size="l"
                label={orgValue ? "Наименование организации" : undefined}
                placeholder="Наименование организации"
                defaultValue={orgValue}
                readOnly
              />

              <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
                <Checkbox
                  size="xxs"
                  defaultChecked={agreed}
                  label={<span className="text-primary">Правила авторизации пользователя</span>}
                />
                {submit === "enabled" && submitHref ? (
                  <Link href={submitHref} className="ds-btn ds-btn--l ds-btn--primary ds-btn--full md:w-auto">
                    <span className="ds-btn__label">Отправить приглашение</span>
                  </Link>
                ) : (
                  <Button
                    fullWidth
                    className="md:w-auto"
                    disabled={submit === "disabled"}
                    loading={submit === "loading"}
                  >
                    Отправить приглашение
                  </Button>
                )}
              </div>
            </>
          )}

          <div className="flex justify-center">
            <Link href={collapseHref ?? "#"} className="ds-p3-medium text-primary hover:underline">
              Свернуть
            </Link>
          </div>
        </div>
      )}

      {/* Табы */}
      <div className="flex justify-center">
        <Tabs variant="solid" size="m" equal defaultValue={activeTab} aria-label="Партнёры">
          <Tab value="invited">Приглашенные партнеры</Tab>
          <Tab value="waiting">Ожидают ответа</Tab>
        </Tabs>
      </div>

      {/* Список / пусто */}
      {rows.length === 0 ? (
        <EmptyState icon={<GlobeIcon />} title="Список ваших партнеров пуст" />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r, i) => (
            <Item key={i} size="m">
              <div className="flex w-full flex-wrap items-center gap-4">
                <span className="ds-p3 w-40 shrink-0 text-foreground">{r.name}</span>
                <span className="ds-p3 flex-1 text-center text-primary">{r.address}</span>
                <Link
                  href={rowHref ?? "#"}
                  className="ds-btn ds-btn--xs ds-btn--secondary shrink-0"
                >
                  <span className="ds-btn__label">Подробнее</span>
                </Link>
              </div>
            </Item>
          ))}
        </div>
      )}
    </div>
  );
}
