"use client";

/**
 * Демка WebResourceFilter (фильтр веб-ресурса) для витрины /ds.
 * Источник: Figma «UI фичи» / фильтр веб-ресурс
 * (1939:312194 · 1939:312378 · 1939:312555 · 1940:344107).
 */
import { useState } from "react";
import {
  WebResourceFilter,
  type WebResourceFilterValue,
} from "@/components/ds";

export function WebResourceFilterDemos() {
  // Вариант «пусто» — без критериев, футер неактивен.
  const [empty, setEmpty] = useState<WebResourceFilterValue>({});

  // Вариант «заполнено» — сохранённый фильтр + поля, футер активен.
  const [filled, setFilled] = useState<WebResourceFilterValue>({
    savedFilter: "a",
    identifier: "N26",
    word: "Паспорт",
    age: "21-30",
    gender: "male",
  });

  // Вариант «ручной фильтр» — выбор сохранённого фильтра отключён.
  const [manual, setManual] = useState<WebResourceFilterValue>({
    identifier: "N26",
    word: "Паспорт",
    age: "21-30",
    gender: "male",
  });

  return (
    <div className="flex flex-col gap-8 max-w-[1000px]">
      <WebResourceFilter value={empty} onChange={setEmpty} />
      <WebResourceFilter value={filled} onChange={setFilled} />
      <WebResourceFilter value={manual} onChange={setManual} savedFilterDisabled />
    </div>
  );
}
