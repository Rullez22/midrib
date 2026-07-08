"use client";

/**
 * Демка Header (шапка приложения) для витрины /ds.
 * Источник: Figma «UI фичи» / header (1586:189918 · 1580:189185 · 1118:97037).
 */
import {
  Header,
  HeaderIconButton,
  HeaderHomeIcon,
  HeaderGridIcon,
} from "@/components/ds";

const nav = [{ label: "О компании" }, { label: "Парадная" }];

export function HeaderDemos() {
  return (
    <div className="flex flex-col gap-6 max-w-[1080px]">
      {/* Вариант 1 — «пространства»: назад + лого + инструменты + навигация + выход */}
      <div className="overflow-hidden rounded-[8px] border border-border">
        <Header
          onBack={() => {}}
          leftActions={
            <>
              <HeaderIconButton icon={<HeaderHomeIcon />} aria-label="Главная" />
              <HeaderIconButton icon={<HeaderGridIcon />} aria-label="Пространства" />
            </>
          }
          nav={nav}
          onExit={() => {}}
        />
      </div>

      {/* Вариант 2 — «бренд»: лого + вордмарк + навигация + выход */}
      <div className="overflow-hidden rounded-[8px] border border-border">
        <Header brand="MIDHUB" nav={nav} onExit={() => {}} />
      </div>

      {/* Вариант 3 — «минимальный»: лого + чат + выход */}
      <div className="overflow-hidden rounded-[8px] border border-border">
        <Header onChat={() => {}} onExit={() => {}} />
      </div>
    </div>
  );
}
