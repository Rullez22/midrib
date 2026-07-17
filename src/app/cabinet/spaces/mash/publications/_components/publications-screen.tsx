"use client";

import { useRouter } from "next/navigation";
import { MidhubLogo, HeaderExitIcon } from "@/components/ds";
import { cn } from "@/lib/cn";

/**
 * PublicationsScreen — «Ваши публикации» автора направления (Figma 7021-572724).
 * Открывается кликом по имени автора (John Doe) в ленте «Машиностроение».
 * Левое меню: Библиотека / Публикации / Добавить блок; «Назад» → лента направления.
 */

const P = "https://images.unsplash.com/";
const PUBLICATIONS = [
  {
    title: "Автозавод Tesla",
    date: "22 апреля 2025",
    cover: `${P}photo-1518709268805-4e9042af9f23?w=800&q=80`,
    inner: `${P}photo-1565043666747-69f6646db940?w=800&q=80`,
    lead: "Разбор того, как на автозаводе устроена сборочная линия: почему кузовной участок задает темп всему производству и где чаще всего копится очередь.",
    tail: "Материал собран по открытым отчетам и разбору видео с производства. Продолжение — про сварочный участок.",
  },
  {
    title: "Новый лазерный станок на участке",
    date: "19 марта 2025",
    cover: `${P}photo-1534996858221-380b92700493?w=800&q=80`,
    inner: `${P}photo-1517420704952-d9f39e95b43e?w=800&q=80`,
    lead: "Запустили лазерную резку по металлу: раскрой листа стал точнее, а подготовка заготовок для площадок занимает вдвое меньше времени.",
    tail: "Расчет загрузки станка и себестоимости реза — во вложении к публикации. Вопросы по режимам пишите в комментарии.",
  },
  {
    title: "Цифровые двойники в производстве",
    date: "6 декабря 2024",
    cover: `${P}photo-1526374965328-7f61d4dc18c5?w=800&q=80`,
    inner: `${P}photo-1451187580459-43490279c0fa?w=800&q=80`,
    lead: "Модель участка позволяет проверить перестановку оборудования до того, как его двигать. Собрали первый двойник по данным с датчиков за квартал.",
    tail: "Пока модель считает только загрузку и простои. Следующий шаг — учесть брак и переналадку.",
  },
];

// ── Иконки меню ───────────────────────────────────────────────────────────────
function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5V5.5ZM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5V5.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function ImageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m5 17 4.5-4 3 2.5L16 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PublicationsScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Полоса приложения. */}
      <header className="sticky top-0 z-20 flex h-[60px] w-full items-center justify-between border-b border-border bg-surface px-5 md:px-[50px]">
        <button type="button" aria-label="На главную" onClick={() => router.push("/cabinet/about")} className="flex items-center">
          <MidhubLogo className="size-8" />
        </button>
        <button
          type="button"
          aria-label="Выход"
          onClick={() => router.push("/cabinet/about")}
          className="flex size-9 items-center justify-center rounded-[6px] bg-[var(--color-grey-20)] text-foreground-subtle transition-colors hover:bg-surface-sunken"
        >
          <HeaderExitIcon className="size-4" />
        </button>
      </header>

      <div className="flex flex-1">
        {/* Левое меню автора. */}
        <aside className="sticky top-[60px] flex h-[calc(100vh-60px)] w-[220px] shrink-0 flex-col border-r border-border bg-surface">
          <button
            type="button"
            onClick={() => router.push("/cabinet/spaces/mash")}
            className="flex h-[64px] items-center gap-2 border-b border-border px-6 text-foreground-subtle transition-colors hover:text-foreground"
          >
            <BackIcon className="size-4" />
            <span className="ds-p3">Назад</span>
          </button>
          <nav className="flex flex-1 flex-col gap-1 p-4">
            <span className="flex h-9 items-center gap-2 rounded-[6px] px-3 ds-p3 text-foreground hover:bg-surface-sunken">
              <BookIcon className="size-4 text-foreground-subtle" />
              Библиотека
            </span>
            <span className="flex h-9 items-center gap-2 rounded-[6px] bg-[color:var(--color-blue-midhub-50)] px-3 ds-p3-medium text-[color:var(--color-blue-midhub-500)]">
              <ImageIcon className="size-4" />
              Публикации
            </span>
            <span className="flex h-9 items-center gap-2 rounded-[6px] px-3 ds-p3 text-foreground-subtle hover:bg-surface-sunken">
              <PlusIcon className="size-4" />
              Добавить блок
            </span>
          </nav>
          <div className="flex items-center gap-3 border-t border-border px-4 py-3">
            <span className="ds-caption text-foreground-subtle">Admin</span>
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80"
              alt=""
              className="ml-auto size-9 rounded-full object-cover"
            />
          </div>
        </aside>

        {/* Контент: заголовок + список публикаций. */}
        <main className="min-w-0 flex-1">
          <div className="flex h-[64px] items-center justify-center border-b border-border px-8">
            <span className="ds-p1-medium text-foreground">Ваши публикации</span>
          </div>

          <div className="flex flex-col gap-8 px-8 py-8">
            {PUBLICATIONS.map((p) => (
              // ds-row — тот же отклик, что у постов ленты (FeedPost) и строк документов.
              <div key={p.title} className="ds-row flex h-[280px] overflow-hidden rounded-[4px]">
                <img src={p.cover} alt="" className="h-full w-[38%] shrink-0 rounded-l-[4px] object-cover" />
                <div className="relative min-w-0 flex-1 overflow-hidden rounded-r-[4px] border border-border bg-[#fff]">
                  <div className="flex h-full flex-col gap-3 p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="ds-p1-medium text-foreground">{p.title}</span>
                      <span className="ds-p3 shrink-0 text-foreground-subtle">{p.date}</span>
                    </div>
                    <p className="ds-p2 text-[#5a646f]">{p.lead}</p>
                    <img src={p.inner} alt="" className="h-[120px] w-full rounded-[6px] object-cover" />
                    <p className="ds-p2 text-[#5a646f]">{p.tail}</p>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#fff] to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
