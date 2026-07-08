"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ds";
import { cn } from "@/lib/cn";

/**
 * AdminModuleAppScreen — детальная страница модуля-приложения (Figma 6442:342448 —
 * «Приложение Банк»; состояния 342579/342526/342680). Слева: баннер + аккордеон
 * «Требования» (стрелка сворачивает список документов) + «Подключить приложение».
 * Справа: описание приложения. Документ без галочки → «Получить» ставит галочку.
 */

const HERO = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80";

const SECTIONS: { title: string; text: string }[] = [
  { title: "ВСЕ ПОД КОНТРОЛЕМ", text: "Следите за своими финансами в режиме реального времени — вам всегда доступна выписка по каждой карте и подробная информация по всем счетам. А если вы где-то забудете свою карту, сможете сразу ее заблокировать (и разблокировать, когда найдете)." },
  { title: "БЫСТРАЯ ОПЛАТА УСЛУГ БЕЗ КОМИССИИ", text: "Оплачивайте более 3000 услуг, включая сотовую связь, ЖКХ, интернет и телевидение, без комиссии в пару нажатий. Создавайте шаблоны и регулярные платежи, чтобы платить было еще проще, быстрее и удобнее." },
  { title: "ПРОСТЫЕ ПЕРЕВОДЫ", text: "Переводите деньги между своими картами и счетами, клиентам «Открытия» и других банков по номеру телефона. Запрашивайте деньги у друзей и меняйте валюту через приложение по льготному курсу." },
  { title: "ВЫГОДНЫЕ ВКЛАДЫ", text: "Выберите подходящий вклад, рассчитав доход прямо в приложении, и откройте его в пару нажатий. Управляйте уже открытыми вкладами из приложения: пополняйте или снимайте средства в зависимости от условий вклада." },
  { title: "ПОИСК БЛИЖАЙШЕГО ОТДЕЛЕНИЯ ИЛИ БАНКОМАТА", text: "Пополняйте карту или снимайте наличные в банкоматах группы «Открытие» — их легко найти на карте в приложении. Если заблудитесь, приложение построит удобный маршрут до нужного адреса." },
];

const DOCS = ["Паспорт", "Удостоверение нотариуса РФ"];

function CheckBadge() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[#fff]">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}
function MinusBadge() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-red-400)] text-[#fff]">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3"><path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    </span>
  );
}
function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cn("size-4 shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdminModuleAppScreen({ title = "Приложение Банк", connectHref }: { title?: string; connectHref?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  // Индексы полученных документов (Паспорт получен изначально).
  const [obtained, setObtained] = useState<Set<number>>(() => new Set([0]));

  return (
    <div className="flex min-h-screen flex-col bg-[#fff]">
      {/* Шапка: назад + заголовок */}
      <div className="relative flex items-center border-b border-border px-5 py-4 md:px-12">
        <button
          type="button"
          aria-label="Назад"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-[4px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4"><path d="m10 3-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1 className="ds-h4 mx-auto text-foreground">{title}</h1>
      </div>

      {/* Единый блок до низа экрана: слева картинка + «Требования» поверх снизу,
          справа описание. Картинка и текст делят блок пополам (50/50). */}
      <div className="flex flex-1 p-5 md:p-12">
        <div className="flex flex-1 overflow-hidden rounded-[8px] border border-border">
          {/* Левая половина: картинка на всю высоту + панель «Требования» снизу поверх */}
          <div className="relative flex w-1/2 shrink-0 flex-col bg-cover bg-center" style={{ backgroundImage: `url("${HERO}")` }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/45 to-transparent" />
            <div className="relative flex flex-col gap-1 p-6">
              <span className="ds-caption uppercase tracking-wide text-[#fff]/80">Новый уровень финансов</span>
              <p className="ds-h4 text-[#fff]">Приложение для ваших банковских операций</p>
            </div>

            {/* спейсер — показывает картинку между баннером и «Требованиями» */}
            <div className="min-h-[40px] flex-1" />

            {/* Требования — белая карточка поверх картинки, отступ 16px слева/справа/снизу */}
            <div className="relative mx-4 mb-4 overflow-hidden rounded-[8px] bg-[#fff] shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <span className="ds-p2-medium text-foreground">Требования</span>
              </div>

              <div className="flex flex-col gap-4 p-4">
              {/* Строка Название/Тип + ghost-кнопка со стрелкой (сворачивает список).
                  Не плашка — просто сепаратор снизу. */}
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="ds-caption text-[var(--color-grey-300)]">Название</span>
                  <span className="ds-p3 truncate text-primary">Для подключения модуля</span>
                </span>
                <span className="flex flex-col items-center justify-center gap-1">
                  <span className="ds-caption text-[var(--color-grey-300)]">Тип</span>
                  <span className="h-6 w-8 rounded-[4px] bg-[var(--color-orange-200)]" />
                </span>
                <div className="flex flex-1 justify-end">
                  <Button
                    variant="ghost"
                    size="s"
                    aria-label={open ? "Свернуть" : "Развернуть"}
                    onClick={() => setOpen((v) => !v)}
                    icon={<Chevron open={open} />}
                  />
                </div>
              </div>

              {open && (
                <>
                  <div className="flex flex-col gap-2">
                    <span className="ds-caption text-[var(--color-grey-300)]">Тип требований для документов, подтверждающих соответствие требованиям</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="ds-p3 text-foreground">Международный:</span>
                      <span className="h-4 w-6 rounded-[3px] bg-[var(--color-orange-200)]" />
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="ds-caption text-[var(--color-grey-300)]">Документы, подтверждающие соответствие требованиям</span>
                    {DOCS.map((d, i) => {
                      const has = obtained.has(i);
                      return (
                        <div key={d} className="flex items-center gap-3">
                          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[4px] border border-border px-3 py-2">
                            <span className="ds-p3 min-w-0 flex-1 truncate text-foreground">{d}</span>
                            {has ? <CheckBadge /> : <MinusBadge />}
                          </div>
                          {!has && (
                            <Button
                              variant="tertiary"
                              size="s"
                              className="shrink-0"
                              onClick={() => setObtained((prev) => new Set(prev).add(i))}
                            >
                              Получить
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="p-4 pt-0">
              {/* Залочена, пока не получены все документы требований. */}
              <Button
                fullWidth
                disabled={obtained.size < DOCS.length}
                onClick={() => connectHref && router.push(connectHref)}
              >
                Подключить приложение
              </Button>
            </div>
          </div>
        </div>

        {/* Правая половина: описание приложения */}
        <div className="flex w-1/2 min-w-0 flex-col gap-5 overflow-y-auto border-l border-border bg-[#fff] p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-[8px] bg-[var(--color-blue-midhub-100,#eaf3fe)]">
              <svg viewBox="0 0 48 48" fill="none" aria-hidden className="size-7">
                <path d="M24 8 8 17h32L24 8Z" fill="#90C4F6" />
                <rect x="11" y="19" width="4" height="15" fill="#6CB3F8" />
                <rect x="22" y="19" width="4" height="15" fill="#6CB3F8" />
                <rect x="33" y="19" width="4" height="15" fill="#6CB3F8" />
                <rect x="8" y="36" width="32" height="4" rx="1" fill="#90C4F6" />
              </svg>
            </span>
            <span className="flex flex-col">
              <span className="ds-p2-medium text-foreground">Банк</span>
              <span className="ds-caption text-[var(--color-grey-300)]">01.06.2020</span>
            </span>
          </div>

          {SECTIONS.map((s) => (
            <div key={s.title} className="flex flex-col gap-1">
              <span className="ds-p3-medium text-foreground">{s.title}</span>
              <p className="ds-p3 text-foreground-muted">{s.text}</p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
