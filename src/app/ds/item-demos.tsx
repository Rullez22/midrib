"use client";

/**
 * Демки Item (строка списка) для витрины /ds.
 * Источник: Figma «UI фичи» / items (303:0) — все 7 вариантов value=*.
 * Переиспользованы DS: Item, ItemDivider, Checkbox, Link, DeleteButton.
 */
import {
  Item,
  ItemDivider,
  Checkbox,
  Link,
  DeleteButton,
} from "@/components/ds";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const BLUE = { color: "var(--color-blue-midhub-500)" } as const;

function IdIcon() {
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="12" rx="2" {...s} />
      <circle cx="8.5" cy="11" r="1.8" {...s} />
      <path d="M5.8 15.2c.4-1.3 4.0-1.3 4.4 0" {...s} />
      <path d="M14 10h4M14 13.5h4" {...s} />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24">
      <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.3L12 17.8 7.2 18.8l.9-5.3L4.2 9.7l5.4-.8L12 4Z" {...s} />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24" style={BLUE}>
      <circle cx="12" cy="8" r="3.2" {...s} />
      <path d="M5 19c0-3.4 3.1-5.5 7-5.5s7 2.1 7 5.5" {...s} />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="12" rx="2" {...s} />
      <path d="m4 8 8 5 8-5" {...s} />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" style={BLUE}>
      <circle cx="12" cy="12" r="9" {...s} />
      <path d="M12 11.5v4.5" {...s} />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function Chevron() {
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" {...s} />
    </svg>
  );
}

const hash = (
  <Link href="#" size="p3" onClick={(e) => e.preventDefault()}>
    5c243af... 07db8
  </Link>
);

export function ItemDemos() {
  return (
    <div className="flex max-w-[1120px] flex-col gap-3">
      {/* item PP — заголовок секции (muted, акцентный label) */}
      <Item size="s" tone="muted" leading={<IdIcon />}>
        <span style={{ fontWeight: "var(--weight-medium)", color: "var(--color-dark-800)" }}>
          ПП
        </span>
      </Item>

      {/* item PP delete — строка пользователя + внешняя кнопка удаления */}
      <div className="flex items-center gap-4">
        <Item leading={<IdIcon />} trailing={<Chevron />}>
          Илья Антонов
        </Item>
        <DeleteButton aria-label="Удалить" />
      </div>

      {/* пп в требованиях — компактная строка с датой */}
      <Item size="xs" trailing={<span>15.08.2019</span>}>
        ПП
      </Item>

      {/* Item2 — 4 колонки */}
      <Item>
        <div className="grid grid-cols-4 items-center">
          <span>0.02 ETH</span>
          <span className="text-center">Илья Антонов</span>
          <span className="text-center">{hash}</span>
          <span className="text-right" style={BLUE}>ENG</span>
        </div>
      </Item>

      {/* value7 — чекбокс + звезда + имя | ссылка | дата */}
      <Item
        leading={
          <>
            <Checkbox size="xs" aria-label="Выбрать" />
            <StarIcon />
            <span>Илья Антонов</span>
          </>
        }
        trailing={<span>12.07.2020</span>}
      >
        <div className="text-center">{hash}</div>
      </Item>

      {/* Item — имя | ссылка | шеврон */}
      <Item trailing={<Chevron />}>
        <div className="grid grid-cols-3 items-center">
          <span>Илья Антонов</span>
          <span className="truncate text-center">
            <Link href="#" size="p3" onClick={(e) => e.preventDefault()}>
              0xca30e63200a0fe3182dc61fc5605efc41456f32
            </Link>
          </span>
          <span />
        </div>
      </Item>

      {/* Item3 — имя | роль | секция ⓘ | person · mail */}
      <Item
        trailing={
          <>
            <PersonIcon />
            <ItemDivider />
            <MailIcon />
          </>
        }
      >
        <div className="grid grid-cols-3 items-center">
          <span>Илья Антонов</span>
          <span className="text-center">Роль</span>
          <span className="inline-flex items-center justify-center gap-1">
            Секция <InfoIcon />
          </span>
        </div>
      </Item>
    </div>
  );
}
