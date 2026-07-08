import type { ReactNode } from "react";
import { AppBottomNav } from "./app-bottom-nav";

/**
 * AppShell — глобальный chrome мобильной апки: контент + нижняя навигация.
 * Живёт внутри MobileFrame. Верхнюю шапку задаёт сам экран (у каждого
 * экрана она своя — заголовок/действия/табы), поэтому здесь только
 * нижняя навигация как общий элемент.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <AppBottomNav />
    </div>
  );
}
