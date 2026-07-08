"use client";

import { useState } from "react";
import { Tag, AddTag, TagInput, type TagSize } from "@/components/ds";

/** Чипы по размерам (статичные примеры). */
export function TagSizesDemo() {
  const sizes: [TagSize, string][] = [
    ["l", "L · 16/24"],
    ["m", "M · 14/22"],
    ["s", "S · 12/20"],
  ];
  return (
    <div className="flex flex-col gap-3">
      {sizes.map(([sz, lbl]) => (
        <div key={sz} className="flex flex-wrap items-center gap-3">
          <span className="ds-caption-medium w-20 shrink-0 text-foreground-subtle">{lbl}</span>
          <Tag size={sz}>Текст</Tag>
          <Tag size={sz} onRemove={() => {}}>Удаляемый</Tag>
          <AddTag size={sz} />
          <Tag size={sz} disabled onRemove={() => {}}>Disabled</Tag>
        </div>
      ))}
    </div>
  );
}

/** Удаляемые чипы (Tag) — управляемый список. */
export function TagListDemo() {
  const [tags, setTags] = useState(["Дизайн", "React", "Telegram"]);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((t) => (
        <Tag key={t} onRemove={() => setTags((p) => p.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
      <AddTag onClick={() => setTags((p) => [...p, `Тег ${p.length + 1}`])} aria-label="Добавить тег" />
    </div>
  );
}

/** Поле ввода тегов (TagInput). */
export function TagInputDemos() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
      <TagInput size="l" label="Навыки" defaultValue={["React", "TypeScript"]} placeholder="Добавьте тег" caption="Enter — добавить" />
      <TagInput size="m" placeholder="Город" defaultValue={["Москва"]} />
      <TagInput size="s" placeholder="Метки" />
      <TagInput error label="Навыки" caption="Добавьте хотя бы один" placeholder="Пусто" />
      <TagInput disabled defaultValue={["readonly"]} />
    </div>
  );
}
