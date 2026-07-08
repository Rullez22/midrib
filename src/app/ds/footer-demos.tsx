"use client";

/**
 * Демки Footer (панель действий) для витрины /ds.
 * Источник: Figma «UI фичи» / footer component (1987:197573).
 */
import { Footer, Button } from "@/components/ds";

export function FooterDemos() {
  return (
    <div className="flex max-w-[1019px] flex-col gap-4">
      {/* L-48 — две кнопки */}
      <Footer>
        <Button variant="secondary">Редактировать</Button>
        <Button>Подписать</Button>
      </Footer>

      {/* M-40 — одна кнопка */}
      <Footer>
        <Button size="m">Опубликовать</Button>
      </Footer>

      {/* S-32 — одна кнопка */}
      <Footer>
        <Button size="s">Опубликовать</Button>
      </Footer>

      {/* attached — футер карточки, ссылка слева */}
      <div className="max-w-[400px] overflow-hidden rounded-[4px] border border-border">
        <div className="px-4 py-6 text-foreground-muted ds-p3">…контент карточки…</div>
        <Footer align="start" attached>
          <Button variant="tertiary" size="s">Редактировать</Button>
        </Footer>
      </div>
    </div>
  );
}
