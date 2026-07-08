"use client";

import { useState } from "react";
import { Button, Text, Toggle } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { QrMock } from "@/components/app/qr-mock";
import { ShareSheet } from "@/components/app/share-sheet";

/**
 * Экран «О разделе «Друзья»» — /app/friends-about (из строки в табе Друзья).
 * Источник: Figma 7009:572372. Пояснения + тоггл «Разрешить запрашивать
 * мои данные» + QR + «Поделиться»/«Скопировать» (Поделиться → share-лист).
 * DS: Text, Toggle, Button. Без нижней навигации (pushed-экран).
 */
export default function FriendsAboutPage() {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="О разделе «Друзья»" showBack />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <Text variant="p2" tone="muted" as="p">
          Здесь вы можете управлять доступом к данным, которые вы предоставили
          своим друзьям и знакомым, либо видеть данные которые вы сами запросили
          у них.
        </Text>

        <Text variant="p2-medium" as="p" className="mt-6">
          Как показать свои документы ?
        </Text>
        <Text variant="p2" tone="muted" as="p" className="mt-2">
          Для того чтобы представить данные другому пользователю MIDHUB,
          отсканируйте его штрих код, используя сканер в верхнем углу экрана и
          выберите данные к которым вы хотите предоставить ему доступ.
        </Text>

        <Text variant="p2-medium" as="p" className="mt-6">
          Как запросить документы ?
        </Text>
        <Text variant="p2" tone="muted" as="p" className="mt-2">
          Для того чтобы запросить данные у другого пользователя, ему необходимо
          с помощью своего Штрих сканера отсчитать ваш штрих код расположенный
          ниже.
        </Text>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Text variant="p2-medium" className="max-w-[190px] text-right">
            Разрешить запрашивать мои данные
          </Text>
          <Toggle defaultChecked />
        </div>

        <div className="mt-5 flex justify-center">
          <QrMock size={168} />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button
            variant="primary"
            size="m"
            fullWidth
            className="uppercase tracking-[0.5px]"
            onClick={() => setShareOpen(true)}
          >
            Поделиться
          </Button>
          <Button
            variant="primary"
            size="m"
            fullWidth
            className="uppercase tracking-[0.5px]"
          >
            Скопировать
          </Button>
        </div>
      </main>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
