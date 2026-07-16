"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, TagInput, Button, EditPencilIcon, DeleteButton, Datepicker, type CalendarRange } from "@/components/ds";
import { cn } from "@/lib/cn";
import { CompanySidebar } from "./company-sidebar";
import { type Goal } from "./goals-data";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * GoalCreateScreen — «Добавление новой цели» (Figma 7021:586087 — форма,
 * 7021:586155 — превью, 7021:586194 — общий вид). Слева форма для заполнения,
 * справа живое превью карточки цели: всё, что вводится в форме, тут же
 * отражается в превью. Сайдбар — наш (CompanySidebar). Reuse DS: Input ·
 * Textarea · TagInput · Button · EditPencilIcon.
 */

/* ── Иконки ──────────────────────────────────────────────────────────────── */
function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-foreground-subtle">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-primary">
      <path d="M8 14s5-4.2 5-8A5 5 0 0 0 3 6c0 3.8 5 8 5 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="8" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 text-foreground-subtle">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.6 9.4a2.4 2.4 0 1 1 3.2 2.3c-.7.3-1 .7-1 1.5v.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11.8" cy="16.4" r="0.9" fill="currentColor" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 text-foreground-subtle">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cn("size-4 text-foreground-subtle", className)}>
      <path d="M4 2h5l3 3v9H4V2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d={dir === "left" ? "m10 3-5 5 5 5" : "m6 3 5 5-5 5"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function TagChipIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5 text-foreground-subtle">
      <path d="M2.5 2.5h5l6 6-5 5-6-6v-5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="5.2" cy="5.2" r="1" fill="currentColor" />
    </svg>
  );
}

/* ── Пул обложек для кнопки «Добавить обложку» ───────────────────────────── */
const COVER_POOL = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
];

/* ── Мелкие блоки превью ─────────────────────────────────────────────────── */
function MoneyLabel({ dot, amount, label, align }: { dot: string; amount: string; label: string; align: "left" | "right" }) {
  return (
    <span className={cn("flex flex-col gap-1", align === "right" && "items-end text-right")}>
      <span className="flex items-center gap-2">
        {align === "left" && <span className="size-2 rounded-full" style={{ background: dot }} />}
        <span className="ds-p2-medium text-foreground">{amount}</span>
        {align === "right" && <span className="size-2 rounded-full" style={{ background: dot }} />}
      </span>
      <span className="ds-caption text-foreground-subtle">{label}</span>
    </span>
  );
}

export function GoalCreateScreen({ cabinet, goal }: { cabinet: CabinetConfig; goal?: Goal }) {
  const router = useRouter();
  const editing = goal != null;
  // Режим редактирования — префилл полей контентом самой цели.
  const [gCity, gAddr] = goal
    ? [goal.location.split(",")[0]?.trim() ?? "", goal.location.split(",").slice(1).join(",").trim()]
    : ["Москва", "Академический р-н, ул. Профсоюзная, 21"];

  const [title, setTitle] = useState(goal?.title ?? "Создать парк");
  const [city, setCity] = useState(gCity);
  const [address, setAddress] = useState(gAddr);
  const [description, setDescription] = useState(
    goal?.description ??
      "Разбиваем парк на пустыре между жилыми кварталами: дорожки, освещение, скамейки и площадка для выгула собак. Проект согласован с управой района, работы ведём вместе с жителями и подрядчиком по благоустройству.",
  );
  const [amount, setAmount] = useState(goal?.total ?? "324 500 ₽");
  const [range, setRange] = useState<CalendarRange>({ start: new Date(2025, 4, 12), end: new Date(2025, 6, 31) });
  const [covers, setCovers] = useState<string[]>(
    goal?.covers ?? [
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    ],
  );
  const [foundations, setFoundations] = useState<string[]>(
    goal ? goal.documents.map((d) => d.name) : ["Обращение жителей квартала о благоустройстве", "Смета на благоустройство территории"],
  );
  const [tags, setTags] = useState<string[]>(["Благоустройство", "Экология"]);
  const [tasks, setTasks] = useState<string[]>(goal?.tasks ?? ["Найти архитектора", "Создать планировку", "Найти строителей"]);
  const [slide, setSlide] = useState(0);

  const MON = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  const fmt = (d: Date) => `${d.getDate()} ${MON[d.getMonth()]}, ${d.getFullYear()}`;
  const dates = range.start
    ? range.end
      ? `${fmt(range.start)} - ${fmt(range.end)}`
      : fmt(range.start)
    : "Период сбора средств";

  const location = [city, address].filter(Boolean).join(", ");
  const activeCover = covers.length ? covers[Math.min(slide, covers.length - 1)] : null;

  const addCover = () => setCovers((c) => [...c, COVER_POOL[c.length % COVER_POOL.length]]);
  const removeCover = (i: number) => setCovers((c) => c.filter((_, j) => j !== i));
  const addFoundation = () => setFoundations((f) => [...f, `Основание №${f.length + 1}`]);
  const removeFoundation = (i: number) => setFoundations((f) => f.filter((_, j) => j !== i));
  const addTask = () => setTasks((t) => [...t, "Новая задача"]);
  const setTask = (i: number, v: string) => setTasks((t) => t.map((x, j) => (j === i ? v : x)));
  const removeTask = (i: number) => setTasks((t) => t.filter((_, j) => j !== i));

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current="goals" />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Заголовок */}
          <div className="flex flex-col gap-6">
            <h1 className="ds-h3 text-center text-foreground">{editing ? "Редактирование цели" : "Добавление новой цели"}</h1>
            <div className="h-px w-full bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* ── Левая колонка: форма ─────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <span className="ds-caption-medium uppercase text-foreground-subtle">Форма для заполнения</span>
              <div className="flex flex-col gap-6 rounded-[8px] border border-border bg-[#fff] p-5">
                <Input label="Заголовок*" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input label="Город*" value={city} onChange={(e) => setCity(e.target.value)} />
                <Input label="Адрес*" value={address} onChange={(e) => setAddress(e.target.value)} />
                <Textarea label="Описание*" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />

                <div className="flex items-center gap-3">
                  <div className="w-[200px]">
                    <Input label="Сумма сбора*" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <HelpIcon />
                </div>

                <Datepicker
                  mode="range"
                  label="Сбор средств до*"
                  rangeValue={range}
                  onRangeChange={setRange}
                />

                {/* Обложки */}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={addCover}
                    className="flex h-[92px] w-[130px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[6px] border border-dashed border-border bg-[#fff] text-foreground-subtle transition-colors hover:border-primary hover:text-primary"
                  >
                    <CameraIcon />
                    <span className="ds-caption">Добавить обложку</span>
                  </button>
                  {covers.map((src, i) => (
                    <div key={src + i} className="group relative h-[92px] w-[130px] shrink-0 overflow-hidden rounded-[6px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="size-full object-cover" />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(16,42,67,0.45)] opacity-0 transition-opacity group-hover:opacity-100">
                        <DeleteButton
                          onClick={() => removeCover(i)}
                          aria-label="Удалить обложку"
                          className="pointer-events-auto"
                          style={{ color: "#fff" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Дропзона оснований */}
                <button
                  type="button"
                  onClick={addFoundation}
                  className="rounded-[6px] border border-dashed border-border bg-[#fff] px-4 py-6 text-center shadow-[0px_1px_3px_0px_rgba(16,42,67,0.15)]"
                >
                  <p className="ds-caption text-foreground-subtle">
                    Выберете основания для создания цели
                    <br />
                    <span className="text-primary">на компьютере</span> или перетащите в эту область
                  </p>
                </button>

                {/* Прикрепленные файлы */}
                <div className="flex flex-col gap-2">
                  <span className="ds-p3-medium text-foreground">Прикрепленные файлы</span>
                  {foundations.map((name, i) => (
                    <div key={name + i} className="ds-row flex items-center gap-3 rounded-[6px] border border-border bg-[#fff] px-4 py-3">
                      <DocIcon />
                      <span className="ds-p3 flex-1 truncate text-foreground">{name}</span>
                      <button type="button" className="text-primary" aria-label="Редактировать">
                        <EditPencilIcon className="size-3.5" />
                      </button>
                      <DeleteButton size="sm" onClick={() => removeFoundation(i)} />
                    </div>
                  ))}
                </div>

                {/* Теги */}
                <TagInput label="Теги" value={tags} onValueChange={setTags} placeholder="Добавьте тег" />

                {/* Задачи */}
                <div className="flex flex-col gap-3">
                  <span className="ds-p3-medium text-foreground">Задачи</span>
                  {tasks.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button type="button" onClick={() => removeTask(i)} className="text-primary" aria-label="Удалить задачу">
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                      </button>
                      <input
                        value={t}
                        onChange={(e) => setTask(i, e.target.value)}
                        className="ds-p2 min-w-0 flex-1 bg-transparent text-foreground outline-none"
                      />
                    </div>
                  ))}
                  <button type="button" onClick={addTask} className="flex items-center gap-2 text-primary">
                    <PlusIcon />
                    <span className="ds-p2-medium">Добавить задачу</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Правая колонка: превью ───────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <span className="ds-caption-medium uppercase text-foreground-subtle">Превью экрана</span>

              {/* Карточка цели */}
              <div className="flex flex-col gap-4 rounded-[8px] border border-border bg-[#fff] p-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-[6px] bg-[var(--color-grey-95,#f4f6f9)] px-3 py-1.5">
                  <ClockIcon />
                  <span className="ds-caption text-foreground-subtle">{dates}</span>
                </span>
                <h2 className="ds-h4 text-foreground">{title || "Без названия"}</h2>
                <span className="flex items-center gap-2">
                  <PinIcon />
                  <span className="ds-caption text-foreground-subtle">{location}</span>
                </span>

                {/* Карусель обложек */}
                <div className="relative h-[260px] overflow-hidden rounded-[8px] bg-[var(--color-grey-90)]">
                  {activeCover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeCover} alt="" className="size-full object-cover" />
                  )}
                  {covers.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSlide((s) => (s - 1 + covers.length) % covers.length)}
                        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[6px] bg-[rgba(16,42,67,0.35)] text-[#fff] backdrop-blur-sm transition-colors hover:bg-[rgba(16,42,67,0.5)]"
                        aria-label="Назад"
                      >
                        <ArrowIcon dir="left" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSlide((s) => (s + 1) % covers.length)}
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[6px] bg-[rgba(16,42,67,0.35)] text-[#fff] backdrop-blur-sm transition-colors hover:bg-[rgba(16,42,67,0.5)]"
                        aria-label="Вперёд"
                      >
                        <ArrowIcon dir="right" />
                      </button>
                      <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {covers.map((_, i) => (
                          <span
                            key={i}
                            className={cn("size-1.5 rounded-full", i === Math.min(slide, covers.length - 1) ? "bg-[#fff]" : "bg-[rgba(255,255,255,0.5)]")}
                          />
                        ))}
                      </span>
                    </>
                  )}
                </div>

                <div className="h-px w-full bg-border" />
                {/* Пустой прогресс — как в карточках целей */}
                <div className="flex flex-col gap-3">
                  <div className="h-1.5 w-full rounded-full bg-[var(--color-grey-90)]" />
                  <div className="flex items-start justify-between">
                    <MoneyLabel dot="var(--color-green-400)" amount="0 ₽" label="Собрано" align="left" />
                    <MoneyLabel dot="var(--color-grey-200)" amount={amount || "0 ₽"} label="Общая сумма" align="right" />
                  </div>
                </div>

                <p className="ds-p2 whitespace-pre-wrap text-foreground-muted">{description}</p>

                {tasks.length > 0 && (
                  <>
                    <div className="h-px w-full bg-border" />
                    <div className="flex flex-col gap-2">
                      <span className="ds-p2-medium text-foreground">Список задач</span>
                      {tasks.map((t, i) => (
                        <span key={i} className="ds-p2 text-foreground-muted">{t}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Основания для создания цели */}
              <div className="flex flex-col gap-3 rounded-[8px] border border-border bg-[#fff] p-6">
                <div className="flex items-center justify-between">
                  <span className="ds-p2-medium text-foreground">Основания для создания цели</span>
                  <span className="ds-caption text-foreground-subtle">22 апреля 2025</span>
                </div>
                {foundations.map((name, i) => (
                  <div key={name + i} className="flex items-center gap-3 rounded-[6px] bg-[var(--color-grey-95,#f4f6f9)] px-4 py-3">
                    <DocIcon />
                    <span className="ds-p3 truncate text-foreground">{name}</span>
                  </div>
                ))}
              </div>

              {/* Теги */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 rounded-[4px] border border-border bg-[#fff] px-3 py-1.5">
                      <TagChipIcon />
                      <span className="ds-caption text-foreground-subtle">{t}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex items-center gap-4">
            <Button
              size="l"
              onClick={() => router.push(editing ? `/cabinet/${cabinet.slug}/goals/${goal!.id}` : `/cabinet/${cabinet.slug}/goals/published`)}
            >
              {editing ? "Сохранить цель" : "Опубликовать цель"}
            </Button>
            <Button
              variant="ghost"
              size="l"
              onClick={() => router.push(editing ? `/cabinet/${cabinet.slug}/goals/${goal!.id}` : `/cabinet/${cabinet.slug}/goals`)}
            >
              Отменить
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
