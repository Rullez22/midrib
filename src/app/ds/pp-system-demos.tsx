"use client";

/**
 * Демки «ПП система» — форма регистрации ПП и её состояния для витрины /ds.
 * Источник: Figma «UI фичи» / ПП (48 нод: Форма регистрации + основания +
 * документы + complete + настройки + Запрос ПД — всё это состояния одного
 * набора экранов).
 * Reuse: RegistrationForm + BasisCard + BasisEditor (новые) + Flag, Button,
 * EmptyState, Combobox, Textarea, Checkbox, Badge. Дубли не плодим.
 */
import {
  RegistrationForm,
  BasisCard,
  BasisEditor,
  Flag,
  Button,
  EditPencilIcon,
} from "@/components/ds";

const COUNTRIES = [
  { code: "ru", label: "Россия" },
  { code: "bg", label: "Болгария" },
];

const CHARACTERISTICS = [
  {
    heading: "Запрос данных по очередности:",
    items: ["Жёлтая международная", "Зелёная международная", "Жёлтая локальная", "Зелёная локальная"],
  },
  { heading: "Возрастное ограничение:", items: ["Без ограничений"] },
];

const BASIS_TITLES = [
  "Согласие",
  "Договор",
  "Правовое обязательство",
  "Жизненно важные интересы",
  "Общественный интерес",
  "Законные интересы",
];

const LANGUAGES = [
  { value: "ru", label: "Русский" },
  { value: "bg", label: "Болгарский" },
];

function PencilBtn() {
  return (
    <button type="button" aria-label="Редактировать" className="shrink-0 text-[var(--color-blue-midhub-500)]">
      <EditPencilIcon className="size-4" />
    </button>
  );
}

/** Колонка «Основания»: первая (Согласие) активна с локализацией, остальные — «Создать». */
function BasesActive() {
  return (
    <>
      <BasisCard title="Согласие" state="filled" active>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 rounded-[6px] border border-border bg-white px-3 py-2">
            <span className="ds-p3 inline-flex items-center gap-2 text-foreground">
              <Flag code="ru" width={18} /> Русский (по умолчанию)
            </span>
            <PencilBtn />
          </div>
          <Button variant="secondary" size="m" fullWidth>Добавить локализацию</Button>
        </div>
      </BasisCard>
      {BASIS_TITLES.slice(1).map((t) => (
        <BasisCard key={t} title={t} />
      ))}
    </>
  );
}

function BasesEmpty() {
  return (
    <>
      {BASIS_TITLES.map((t) => (
        <BasisCard key={t} title={t} />
      ))}
    </>
  );
}

export function PPSystemDemos() {
  return (
    <div className="flex flex-col gap-12">
      {/* 1 — Форма регистрации: страна выбрана, документы отсутствуют (247:42756) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Форма регистрации — основания, документов нет</span>
        <RegistrationForm
          countries={COUNTRIES}
          selectedCountry="ru"
          characteristics={CHARACTERISTICS}
          bases={<BasesEmpty />}
          activeColumn={2}
        />
      </div>

      {/* 2 — Согласие заполнено + документы (253:42897) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Согласие (локализация) + документы</span>
        <RegistrationForm
          countries={COUNTRIES}
          selectedCountry="ru"
          characteristics={CHARACTERISTICS}
          bases={<BasesActive />}
          documents={[
            { title: "Паспорт:", sub: "Фамилия, Имя" },
            { title: "Заграничный паспорт:", sub: "Фамилия, Имя" },
          ]}
          activeColumn={2}
        />
      </div>

      {/* 3 — complete (read-only) (260:10) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Готовая ПП — read-only (complete)</span>
        <RegistrationForm
          mode="view"
          countries={COUNTRIES}
          selectedCountry="ru"
          characteristics={CHARACTERISTICS}
          activeColumn={2}
          bases={
            <BasisCard title="Согласие" state="filled" active info={false}>
              <div className="flex items-center gap-2 rounded-[6px] border border-border bg-white px-3 py-2">
                <span className="ds-p3 inline-flex items-center gap-2 text-foreground">
                  <Flag code="ru" width={18} /> Русский (по умолчанию)
                </span>
              </div>
            </BasisCard>
          }
          documents={[
            { title: "Паспорт:", sub: "Фамилия, Имя" },
            { title: "Заграничный паспорт:", sub: "Фамилия, Имя" },
          ]}
        />
      </div>

      {/* 4 — Редактор основания (248:42696) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Редактор основания (Основание value)</span>
        <div className="max-w-[760px] rounded-[8px] border border-border bg-white p-5">
          <BasisEditor
            languages={LANGUAGES}
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas amet ultrices faucibus non."
            isDefault
          />
        </div>
      </div>
    </div>
  );
}
