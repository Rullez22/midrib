"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ProfileHeader,
  SectionCard,
  Combobox,
  Input,
  Button,
} from "@/components/ds";

/**
 * ProfileScreen — профиль приглашаемой компании на валидацию (S7–S12).
 * Источник: Figma «партнёрская программа» (2284:205468, 2290:319874,
 * 2290:320135, 2292:306495, 2292:306718, 2292:307003). Собран из DS:
 * ProfileHeader, SectionCard, Combobox, Input, Tag, Button.
 *
 * stage 1..6 = статичные состояния. interactive = живое заполнение «Информации
 * из устава»: тип организации (активен только «Потребительский кооператив»,
 * остальные disabled) → появляются Местонахождение + ОКВЭД → Направление.
 */

const REPRESENTATIVE: { label: string; value: string }[] = [
  { label: "Адрес", value: "0xca30e63200a0fe3182dc61fc5605efc41456f32" },
  { label: "Фамилия", value: "Антонов" },
  { label: "Имя", value: "Илья" },
  { label: "Отчество", value: "Андреевич" },
  { label: "Номер паспорта", value: "40 15 892047" },
  { label: "Кем выдан", value: "ОУФМС России по Санкт-Петербургу в Выборгском районе" },
  { label: "Дата выдачи", value: "17.04.2016" },
];

const OKVED = [
  "81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая",
  "81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования",
  "64.19 - Денежное посредничество прочее",
];

// Типы организаций РФ — активен только «Потребительский кооператив».
const ORG_TYPES = [
  { value: "ooo", label: "ООО", disabled: true },
  { value: "oao", label: "ОАО", disabled: true },
  { value: "zao", label: "ЗАО", disabled: true },
  { value: "pao", label: "ПАО", disabled: true },
  { value: "ip", label: "ИП", disabled: true },
  { value: "coop", label: "Кооператив", disabled: true },
  { value: "consumer-coop", label: "Потребительский кооператив" },
];

// ~10 реальных кодов ОКВЭД — выбор из списка, выбранные появляются снизу.
const OKVED_LIST = [
  "01.11 — Выращивание зерновых культур",
  "41.20 — Строительство жилых и нежилых зданий",
  "43.31 — Производство штукатурных работ",
  "47.11 — Торговля розничная преимущественно пищевыми продуктами",
  "49.41 — Деятельность автомобильного грузового транспорта",
  "56.10 — Деятельность ресторанов и услуги по доставке продуктов питания",
  "62.01 — Разработка компьютерного программного обеспечения",
  "64.19 — Денежное посредничество прочее",
  "68.20 — Аренда и управление недвижимым имуществом",
  "81.22 — Деятельность по чистке и уборке зданий и помещений",
  "85.41 — Образование дополнительное детей и взрослых",
];
const OKVED_OPTIONS = OKVED_LIST.map((o) => ({ value: o, label: o }));

const DIRECTIONS = [
  { value: "ideo", label: "Идеологическое направление" },
  { value: "edu", label: "Образовательное направление" },
  { value: "social", label: "Социальное направление" },
  { value: "econ", label: "Экономическое направление" },
  { value: "eco", label: "Экологическое направление" },
];

function GroupHeading({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-t border-border bg-surface-muted px-6 py-2">
      <span className="ds-caption-medium text-foreground-muted">{children}</span>
    </div>
  );
}

function Row({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border px-6 py-3.5">
      <span className="ds-caption w-[260px] shrink-0 text-foreground-subtle">{label}</span>
      <span className="ds-caption flex-1 text-foreground">{value}</span>
    </div>
  );
}

function DocThumb() {
  return (
    <span className="flex h-16 w-[52px] flex-col gap-1 rounded-[3px] border border-border bg-surface p-1.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="h-[2px] rounded bg-[var(--color-grey-90)]" style={{ width: `${90 - i * 6}%` }} />
      ))}
    </span>
  );
}

// Иконка-урна — 1:1 из Figma (2292:306498).
function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden xmlns="http://www.w3.org/2000/svg">
      <path d="M3.71429 13.5556C3.71429 14.35 4.35714 15 5.14286 15H10.8571C11.6429 15 12.2857 14.35 12.2857 13.5556V4.88889H3.71429V13.5556ZM13 2.72222H10.5L9.78571 2H6.21429L5.5 2.72222H3V4.16667H13V2.72222Z" fill="#E6424D" />
    </svg>
  );
}

/** Строка выбранного ОКВЭД: текст + красная корзина (1:1 из Figma). */
function OkvedRow({ children, onRemove }: { children: ReactNode; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="ds-p3 text-foreground">{children}</span>
      {onRemove && (
        <button type="button" aria-label="Удалить" onClick={onRemove} className="shrink-0">
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export interface ProfileScreenProps {
  stage: 1 | 2 | 3 | 4 | 5 | 6;
  /** Живое заполнение устава (шаг 7). */
  interactive?: boolean;
  /** CTA основной кнопки (Отправить приглашение / Продолжить работу). */
  actionHref?: string;
}

export function ProfileScreen({ stage, interactive = false, actionHref }: ProfileScreenProps) {
  const summary = stage >= 5;
  const collapsed = stage === 6;
  const staticEnabled = stage === 4 || stage >= 5;
  const router = useRouter();

  // Состояние живого заполнения устава (шаг 7).
  const [country, setCountry] = useState("ru");
  const [orgType, setOrgType] = useState("");
  const [location, setLocation] = useState("");
  const [okvedTags, setOkvedTags] = useState<string[]>([]);
  const [direction, setDirection] = useState("");
  const isCoop = orgType === "consumer-coop";
  const showDirection = isCoop && location.trim() !== "" && okvedTags.length > 0;
  const interactiveReady =
    country !== "" && isCoop && location.trim() !== "" && okvedTags.length > 0 && direction !== "";

  return (
    <div className="flex w-full flex-col px-5 pt-8 pb-10 md:px-[50px]">
      <ProfileHeader name="Immatra" role="Потребительский кооператив" editable={false} shareDisabled feedDisabled />

      <SectionCard title="Общие сведения" defaultOpen={!collapsed} className="mt-6">
        {/* Представитель */}
        <GroupHeading>Представитель</GroupHeading>
        {REPRESENTATIVE.map((r) => (
          <Row key={r.label} label={r.label} value={r.value} />
        ))}

        {summary ? (
          /* Сводка устава (read-only) */
          <>
            <GroupHeading>Устав</GroupHeading>
            <Row label="Тип организации" value="Потребительский кооператив" />
            <Row label="Местонахождение" value="Санкт-Петербург, Дегтярный переулок, 11 лит А" />
            <Row
              label="ОКВЭД"
              value={
                <span className="flex flex-col gap-2">
                  {OKVED.map((o) => (
                    <span key={o}>{o};</span>
                  ))}
                </span>
              }
            />
            <Row label="Уставные документы" value={<DocThumb />} />
            <GroupHeading>Направление</GroupHeading>
            <Row label="Название" value="Идеологическое направление" />
          </>
        ) : (
          /* Заполнение устава */
          <>
            <GroupHeading>Устав</GroupHeading>
            <Row label="Уставные документы" value={<DocThumb />} />
            <GroupHeading>Информация из устава</GroupHeading>
            {interactive ? (
              <>
                <div className="flex flex-col gap-6 px-6 py-4">
                  <div className="max-w-[406px]">
                    <Combobox
                      placeholder="Выберите страну"
                      value={country}
                      onValueChange={setCountry}
                      options={[{ value: "ru", label: "🇷🇺 Россия" }]}
                      aria-label="Страна"
                    />
                  </div>
                  <div className="max-w-[406px]">
                    <Combobox
                      placeholder="Выберите тип организации"
                      value={orgType || undefined}
                      onValueChange={setOrgType}
                      options={ORG_TYPES}
                      aria-label="Тип организации"
                    />
                  </div>

                  {isCoop && (
                    <div className="max-w-[406px]">
                      <Input
                        size="l"
                        placeholder="Местонахождение кооператива"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  )}

                  {isCoop && (
                    <div className="max-w-[747px]">
                      <Combobox
                        placeholder="Напишите ОКВЭД или выберите из списка"
                        value=""
                        onValueChange={(v) =>
                          setOkvedTags((prev) => (prev.includes(v) ? prev : [...prev, v]))
                        }
                        options={OKVED_OPTIONS}
                        aria-label="ОКВЭД"
                      />
                    </div>
                  )}

                  {okvedTags.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {okvedTags.map((o) => (
                        <OkvedRow
                          key={o}
                          onRemove={() => setOkvedTags((prev) => prev.filter((t) => t !== o))}
                        >
                          {o}
                        </OkvedRow>
                      ))}
                    </div>
                  )}
                </div>

                {/* Направление — отдельная секция, появляется после всех дропдаунов */}
                {showDirection && (
                  <>
                    <GroupHeading>Направление</GroupHeading>
                    <div className="px-6 py-4">
                      <div className="max-w-[406px]">
                        <Combobox
                          placeholder="Выберите направление"
                          value={direction || undefined}
                          onValueChange={setDirection}
                          options={DIRECTIONS}
                          aria-label="Направление"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col gap-6 px-6 py-4">
                  <div className="max-w-[406px]">
                    <Combobox
                      placeholder="Выберите страну"
                      value={stage >= 2 ? "ru" : undefined}
                      onValueChange={() => {}}
                      options={[{ value: "ru", label: "🇷🇺 Россия" }]}
                      aria-label="Страна"
                    />
                  </div>
                  <div className="max-w-[406px]">
                    <Combobox
                      placeholder="Выберите тип организации"
                      value={stage >= 2 ? "consumer-coop" : undefined}
                      onValueChange={() => {}}
                      options={ORG_TYPES}
                      aria-label="Тип организации"
                    />
                  </div>

                  {stage >= 2 && (
                    <div className="max-w-[406px]">
                      <Input
                        size="l"
                        placeholder="Местонахождение кооператива"
                        defaultValue={stage >= 3 ? "Санкт-Петербург, Дегтярный переулок, 11 лит А" : undefined}
                        readOnly
                      />
                    </div>
                  )}

                  {stage >= 2 && (
                    <div className="max-w-[747px]">
                      <Combobox
                        placeholder="Напишите ОКВЭД или выберите из списка"
                        onValueChange={() => {}}
                        options={OKVED_OPTIONS}
                        aria-label="ОКВЭД"
                      />
                    </div>
                  )}

                  {stage >= 3 && (
                    <div className="flex flex-col gap-2">
                      {OKVED.map((o) => (
                        <OkvedRow key={o}>{o}</OkvedRow>
                      ))}
                    </div>
                  )}
                </div>

                {stage >= 3 && (
                  <>
                    <GroupHeading>Направление</GroupHeading>
                    <div className="px-6 py-4">
                      <div className="max-w-[406px]">
                        <Combobox
                          placeholder="Выберите направление"
                          value={stage >= 4 ? "ideo" : undefined}
                          onValueChange={() => {}}
                          options={DIRECTIONS}
                          aria-label="Направление"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </SectionCard>

      {/* Действия — отступ сверху/снизу 40px */}
      <div className="mt-10 flex flex-wrap gap-4">
        {summary ? (
          actionHref ? (
            <Link href={actionHref} className="ds-btn ds-btn--l ds-btn--secondary">
              <span className="ds-btn__label">Продолжить работу</span>
            </Link>
          ) : (
            <Button variant="secondary">Продолжить работу</Button>
          )
        ) : interactive ? (
          <Button
            disabled={!interactiveReady}
            onClick={() => actionHref && router.push(actionHref)}
          >
            Отправить приглашение
          </Button>
        ) : staticEnabled && actionHref ? (
          <Link href={actionHref} className="ds-btn ds-btn--l ds-btn--primary">
            <span className="ds-btn__label">Отправить приглашение</span>
          </Link>
        ) : (
          <Button disabled>Отправить приглашение</Button>
        )}
        <Button variant="negative-sec">Отклонить компанию</Button>
      </div>
    </div>
  );
}
