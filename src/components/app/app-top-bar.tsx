"use client";

import { useRouter } from "next/navigation";
import { Text } from "@/components/ds";

/**
 * AppTopBar — верхний бар мобильной апки MIDHUB (аналог TelegramTopBar
 * из Вектора, но в стиле MIDHUB DS).
 *
 * Слоты: слева — back-кнопка (опц.), по центру — заголовок,
 * справа — произвольный экшен (опц.). Заголовок и наличие back-кнопки
 * задаёт экран (позже — через контекст/провайдер по мере флоу).
 */
export interface AppTopBarProps {
  title?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function AppTopBar({ title, showBack = false, right }: AppTopBarProps) {
  const router = useRouter();

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-border bg-surface px-2">
      <div className="absolute left-1 flex items-center">
        {showBack && (
          <button
            type="button"
            aria-label="Назад"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {title && (
        <Text variant="p1-medium" className="truncate">
          {title}
        </Text>
      )}

      <div className="absolute right-1 flex items-center">{right}</div>
    </header>
  );
}
