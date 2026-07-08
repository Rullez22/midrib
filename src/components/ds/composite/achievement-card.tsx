import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * AchievementCard — карточка достижения (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / достижение (node 759:69583). Стили 1:1.
 *
 * Бордерная карточка: квадратный аватар (82) слева + заголовок (Medium 14/22)
 * и описание (Regular 12/20).
 *
 * @example
 *   <AchievementCard
 *     image="/demo/achievement-rhino.jpg"
 *     title="Носорог"
 *     description="Вы достигли этого уровня, потому что вы крутой"
 *   />
 */

export interface AchievementCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** URL аватара достижения. */
  image: string;
  /** Альт-текст аватара. */
  alt?: string;
  /** Заголовок. */
  title: ReactNode;
  /** Описание. */
  description?: ReactNode;
}

export function AchievementCard({
  image,
  alt = "",
  title,
  description,
  className,
  ...rest
}: AchievementCardProps) {
  return (
    <div className={cn("ds-achievement", className)} {...rest}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ds-achievement__img" src={image} alt={alt} />
      <div className="ds-achievement__text">
        <span className="ds-achievement__title">{title}</span>
        {description != null && (
          <span className="ds-achievement__desc">{description}</span>
        )}
      </div>
    </div>
  );
}
