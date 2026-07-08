import { Text } from "@/components/ds";

/**
 * AppSplash — приветственный экран мобильной апки MIDHUB.
 * Лого по центру на светлом фоне + мягкое появление (CSS-анимация,
 * без внешних зависимостей — в midhub-app нет framer-motion).
 */
export function AppSplash() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="app-splash-logo flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/midhub-logo.svg"
          alt="MIDHUB"
          width={72}
          height={72}
          className="h-[72px] w-[72px]"
        />
        <Text variant="h3" className="tracking-tight">
          MIDHUB
        </Text>
      </div>

      <style>{`
        @keyframes appSplashIn {
          0%   { opacity: 0; transform: translateY(8px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .app-splash-logo {
          animation: appSplashIn 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}
