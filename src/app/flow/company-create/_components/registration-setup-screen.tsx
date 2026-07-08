"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  Text,
  Input,
  Radio,
  Button,
  VerificationTable,
  HeaderArrowLeftIcon,
} from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { useRegFlow, COUNTRIES, GROUPS, AGE_OPTIONS } from "./reg-flow";

/**
 * RegistrationSetupScreen — «Настройка формы регистрации».
 * Открывается из AgreementIntroScreen по «Начать создание».
 * Источник: Figma 2671:398098 (инстанс «ПП» 2671:398104).
 *
 * Каркас — общий CoopSidebar. Контент из DS: Input + VerificationTable
 * (страна × уровень верификации) + Radio (приоритет / возраст) + Button.
 * Выбор пишется в RegFlow-контекст → подхватывается на шаге 8.
 *
 * @param backHref Назад / Отменить — к интро соглашения.
 * @param saveHref «Сохранить» (активна при заполнении) — к форме регистрации.
 */

/** Иконка-хэндл перетаскивания (≡), 16px. */
function DragHandle() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-foreground-subtle">
      <path d="M2 5h12M2 8h12M2 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text variant="p2-medium">{children}</Text>;
}

/**
 * PriorityList — список приоритета с перестановкой строк мышью (drag-and-drop).
 * Нативный HTML5 DnD (без зависимостей): тянем за строку, бросаем на другую.
 */
function PriorityList({
  items: initial,
  onChange,
}: {
  items: string[];
  onChange?: (order: string[]) => void;
}) {
  const [items, setItems] = useState(initial);
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const drop = (to: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    setOverIndex(null);
    if (from == null || from === to) return;
    setItems((prev) => {
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onChange?.(next);
      return next;
    });
  };

  return (
    <ul className="flex max-w-[320px] flex-col gap-1">
      {items.map((item, i) => (
        <li
          key={item}
          draggable
          onDragStart={() => {
            dragIndex.current = i;
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(i);
          }}
          onDragLeave={() => setOverIndex((v) => (v === i ? null : v))}
          onDrop={() => drop(i)}
          onDragEnd={() => {
            dragIndex.current = null;
            setOverIndex(null);
          }}
          className={cn(
            "flex cursor-grab items-center justify-between gap-4 rounded-[4px] px-2 py-1.5 transition-colors active:cursor-grabbing",
            overIndex === i ? "bg-surface-sunken" : "hover:bg-surface-sunken/60",
          )}
        >
          <Text variant="caption" tone="muted" as="span">{item}</Text>
          <DragHandle />
        </li>
      ))}
    </ul>
  );
}

export function RegistrationSetupScreen({
  backHref,
  saveHref,
  routes,
  sidebar,
}: {
  backHref?: string;
  saveHref?: string;
  routes?: Partial<CoopRoutes>;
  /** Своя обвязка (напр. CompanySidebar ВУЗа). По умолчанию — CoopSidebar. */
  sidebar?: ReactNode;
}) {
  const router = useRouter();
  const flow = useRegFlow();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());

  // Активация «Сохранить»: имя заполнено + отмечена хотя бы одна ячейка таблицы
  // (приоритет и возраст всегда выбраны по умолчанию).
  const canSave =
    flow.name.trim().length > 0 && flow.checks.some((row) => row.some(Boolean));

  const save = () => {
    if (canSave && saveHref != null) router.push(saveHref);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar ?? <CoopSidebar routes={routes} />}

      {/* Контент */}
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: кнопка «назад» слева, заголовок по центру */}
          <div className="relative flex min-h-[40px] items-center">
            <Button
              variant="ghost"
              size="m"
              icon={<HeaderArrowLeftIcon />}
              aria-label="Назад"
              onClick={goBack}
            />
            <Text variant="h5" className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
              Настройка формы регистрации
            </Text>
          </div>

          {/* Название формы */}
          <div className="flex flex-col gap-2">
            <FieldLabel>Назовите создаваемую форму регистрации</FieldLabel>
            <Input
              size="l"
              className="max-w-[814px]"
              placeholder="Название"
              value={flow.name}
              onChange={(e) => flow.setName(e.target.value)}
            />
          </div>

          {/* Страны и уровень верификации */}
          <div className="flex flex-col gap-3">
            <FieldLabel>Выберите страну и уровень верификации запрашиваемых документов</FieldLabel>
            <VerificationTable
              countries={COUNTRIES}
              groups={GROUPS}
              defaultChecked={flow.checks}
              onToggle={(r, c, isChecked) => flow.setCheck(r, c, isChecked)}
            />
          </div>

          {/* Приоритет запроса документов */}
          <div className="flex flex-col gap-4">
            <FieldLabel>Выберите приоритет по которому будут запрашиваться документы</FieldLabel>
            <div className="flex flex-wrap gap-x-12 gap-y-3">
              <Radio name="priority" value="order" size="xs" defaultChecked label="По очередности" />
              <Radio name="priority" value="cost" size="xs" label="С наименьшей стоимостью" />
            </div>
            <PriorityList items={flow.priority} onChange={flow.setPriority} />
          </div>

          {/* Возрастные ограничения */}
          <div className="flex flex-col gap-4">
            <FieldLabel>Возрастные ограничения</FieldLabel>
            <div className="flex flex-wrap gap-x-12 gap-y-3">
              {AGE_OPTIONS.map((opt) => (
                <Radio
                  key={opt}
                  name="age"
                  value={opt}
                  size="xs"
                  checked={flow.age === opt}
                  onChange={() => flow.setAge(opt)}
                  label={opt}
                />
              ))}
            </div>
          </div>

          {/* Футер: Отменить / Сохранить */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="negative-sec" onClick={goBack}>
              Отменить
            </Button>
            <Button disabled={!canSave} onClick={save}>
              Сохранить
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
