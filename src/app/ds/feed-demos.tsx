"use client";

/**
 * Демки «Лента» (Add feed + Posts) для витрины /ds.
 * Источник: Figma «UI фичи» / Add feed (1853:390905 · 1745:256836 · 1748:341703 ·
 * 1748:342107) и Posts (1751:257501 · 257546 · 257599 · 257632 · 257665 · 257975).
 * Reuse: FeedComposerBar / FeedComposer / FeedPost — собраны из готовых DS
 * (Tabs · Input · Textarea · UploadV2 · Button). Новых атомов нет.
 */
import { FeedComposerBar, FeedComposer, FeedPost } from "@/components/ds";

const IMG = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80";
const IMG2 = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80";
const AVATAR = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80";

const TEXT =
  "Съездили на площадку во Всеволожске: подрядчик закончил монтаж качелей и горки, осталось уложить покрытие. Приёмку назначили на следующую неделю — акт подпишем сразу после проверки. Фото и смету прикладываем к посту.";

export function FeedDemos() {
  return (
    <div className="flex max-w-[795px] flex-col gap-10">
      {/* Composer — свёрнутая строка (1853:390905) */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Создание поста — свёрнутая строка (аватар + поле + Фото/Видео/Документ/Написать статью)
        </span>
        <FeedComposerBar avatar={AVATAR} />
      </div>

      {/* Composer — раскрытый редактор: переключи табы Статья / Публикация / Документ */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Создание поста — редактор (табы Статья · Публикация · Документ — переключаются)
        </span>
        <FeedComposer />
      </div>

      {/* Posts — все варианты медиа */}
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Пост — без медиа (1751:257665)</span>
        <FeedPost title="Выезд на площадку во Всеволожске" date="12 марта 2025" text={TEXT} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Пост — одно фото (1751:257501)</span>
        <FeedPost
          title="Монтаж игрового комплекса завершён"
          date="22 апреля 2025"
          text={TEXT}
          media={{ type: "image", src: IMG }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Пост — видео (1751:257546)</span>
        <FeedPost
          title="Как проходит приёмка работ: короткое видео"
          date="19 мая 2025"
          text={TEXT}
          media={{ type: "video", poster: IMG2 }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Пост — галерея фото + «+N» (1751:257599)
        </span>
        <FeedPost
          title="Фотоотчёт по благоустройству двора на Дегтярном"
          date="03 июня 2025"
          text={TEXT}
          media={{ type: "gallery", items: [{ src: IMG }, { src: IMG }, { src: IMG }], total: 8 }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Пост — видео + фото + «+N» (1751:257632)
        </span>
        <FeedPost
          title="Итоги совместной закупки пиломатериалов"
          date="23 ноября 2024"
          text={TEXT}
          media={{
            type: "gallery",
            items: [{ src: IMG2, video: true }, { src: IMG }],
            total: 7,
          }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">Пост — документы (1751:257975)</span>
        <FeedPost
          title="Документы к приёмке площадки"
          date="28 января 2025"
          media={{ type: "documents", files: ["Акт приёмки выполненных работ", "Смета на благоустройство территории", "Протокол заседания правления №47"] }}
        />
      </div>
    </div>
  );
}
