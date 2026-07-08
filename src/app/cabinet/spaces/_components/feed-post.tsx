"use client";

/**
 * FeedPost — карточка поста ленты направления (Figma 7021-572629 / 572686 / 572695).
 * Слева обложка во всю высоту (скруглены левые углы), справа карточка с текстом,
 * разделителем под заголовком и белым градиентом-затуханием внизу. Используется
 * в «Ленте» пространств и в ленте направления «Машиностроение».
 */

export const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat proin posuere sit interdum quam nulla nisl. Blandit vel amet dapibus sit bibendum aliquam nibh.";
export const LOREM_LONG =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam tellus neque, vulputate a. At leo egestas et pharetra velit non id nec enim. Fermentum pharetra, mauris, lectus ut. Quam vitae a pharetra porttitor porta semper egestas elementum eget. Est iaculis in velit, risus. Dui velit nunc, ut habitant quam convallis proin. Arcu ut consectetur vivamus enim, cursus aliquam convallis.";

/** Иконка «подписчики» справа в шапке направления. */
export function FollowersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-2.2-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export interface FeedPostProps {
  avatar: string;
  name: string;
  /** Счётчик-бейдж рядом с именем (в «Ленте» пространств). */
  count?: number;
  /** Клик по имени автора (в ленте направления → публикации). */
  onNameClick?: () => void;
  title: string;
  date?: string;
  cover: string;
  /** Внутреннее изображение между абзацами. */
  inner?: string;
}

export function FeedPost({ avatar, name, count, onNameClick, title, date = "September 08, 2019", cover, inner }: FeedPostProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Шапка направления: аватар + имя + счётчик · подписчики. */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={avatar} alt="" className="size-10 rounded-full object-cover" />
          {onNameClick ? (
            <button type="button" onClick={onNameClick} className="ds-h5 text-foreground transition-colors hover:text-[color:var(--color-blue-midhub-500)]">
              {name}
            </button>
          ) : (
            <span className="ds-h5 text-foreground">{name}</span>
          )}
          {count != null && (
            <span className="ds-p3-medium flex h-6 min-w-6 items-center justify-center rounded-[4px] border border-border bg-[#fff] px-1.5 text-foreground">{count}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="ds-p3-medium text-foreground-subtle">
            <span className="text-foreground">100</span> подписчиков
          </span>
          <FollowersIcon className="size-4 text-foreground-subtle" />
        </div>
      </div>

      {/* Пост — обложка встык с карточкой текста. */}
      <div className="flex h-[430px] overflow-hidden rounded-[4px]">
        <img src={cover} alt="" className="h-full w-[47%] shrink-0 rounded-l-[4px] object-cover" />
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-r-[4px] border border-border bg-[#fff]">
          <div className="flex h-full flex-col gap-4 p-6">
            <div className="flex items-baseline justify-between gap-3">
              <span className="ds-p1-medium text-foreground">{title}</span>
              <span className="ds-p3 shrink-0 text-foreground-subtle">{date}</span>
            </div>
            <div className="h-px w-full shrink-0 bg-border" />
            <div className="flex min-h-0 flex-col gap-4">
              <p className="ds-p2 text-[#5a646f]">{LOREM}</p>
              {inner && <img src={inner} alt="" className="h-[190px] w-full rounded-[6px] object-cover" />}
              <p className="ds-p2 whitespace-pre-line text-[#5a646f]">{LOREM_LONG}</p>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fff] to-transparent" />
        </div>
      </div>
    </div>
  );
}
