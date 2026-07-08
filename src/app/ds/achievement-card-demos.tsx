"use client";

/**
 * Демка AchievementCard (карточка достижения) для витрины /ds.
 * Источник: Figma «UI фичи» / достижение (759:69583).
 */
import { AchievementCard } from "@/components/ds";

export function AchievementCardDemos() {
  return (
    <div className="flex flex-wrap gap-4">
      <AchievementCard
        className="w-[268px]"
        image="/demo/achievement-rhino.jpg"
        alt="Носорог"
        title="Носорог"
        description="Вы достигли этого уровня, потому что вы крутой"
      />
    </div>
  );
}
