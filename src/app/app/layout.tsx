import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MobileFrame } from "@/components/app/mobile-frame";
import { SplashGate } from "@/components/app/splash-gate";
import { AppShell } from "@/components/app/app-shell";
import { WalletsProvider } from "@/components/app/wallets-store";
import { PendingDocsProvider } from "@/components/app/pending-docs-store";
import { RegistrationsProvider } from "@/components/app/registrations-store";
import { DiplomaProvider } from "@/components/app/diploma-store";

/**
 * Layout мобильной апки MIDHUB (`/app/*`).
 *
 * Каркас (по аналогии с Вектором): телефонная рамка → splash при входе →
 * app-shell (верхний бар + скролл-контент + нижняя навигация).
 * Стиль — дизайн-система MIDHUB. html/body/шрифт заданы в корневом
 * layout (src/app/layout.tsx), здесь только chrome самой апки.
 */
export const metadata: Metadata = {
  title: "MIDHUB — мобильное приложение",
  description: "Мобильная версия MIDHUB (веб-превью).",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <MobileFrame>
      <SplashGate>
        <WalletsProvider>
          <PendingDocsProvider>
            <RegistrationsProvider>
              <DiplomaProvider>
                <AppShell>{children}</AppShell>
              </DiplomaProvider>
            </RegistrationsProvider>
          </PendingDocsProvider>
        </WalletsProvider>
      </SplashGate>
    </MobileFrame>
  );
}
