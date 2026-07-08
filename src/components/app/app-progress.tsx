import { Text } from "@/components/ds";

/**
 * AppProgress — линия прогресса «Шаг X из Y» под шапкой (пошаговые флоу).
 * Макет: «Добавить документ / Шаг 1 из 5» (7009:572133). Текст + тонкая
 * полоса с синим заполнением на X/Y ширины.
 */
export function AppProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    // Фон — серый (как шапка): «Шаг X из Y» продолжает хедер, а полоса
    // прогресса снизу служит разделителем между серым и белым контентом.
    <div className="shrink-0 bg-surface-muted">
      <Text
        variant="caption-up"
        tone="primary"
        as="div"
        className="pb-2 pt-0.5 text-center"
      >
        Шаг {current} из {total}
      </Text>
      <div className="h-[3px] w-full bg-border">
        <div
          className="h-full bg-primary"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
