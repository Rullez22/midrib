"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LauncherCard, LabeledDivider, Input, Button, Text } from "@/components/ds";
import { AuthLayout } from "./auth-layout";

/**
 * AuthScreen — «Авторизация» (QR + биометрия). Источник: Figma 2477:274229,
 * 2478:274683. Собран из DS: LauncherCard, LabeledDivider, Input, Button.
 * Интерактив: ввод биометрии → кнопка активна → переход дальше.
 */
export function AuthScreen({ nextHref }: { nextHref: string }) {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const ready = bio.trim() !== "";

  return (
    <AuthLayout>
      <LauncherCard
        title="Авторизация"
        subtitle="Считайте QR-код мобильным приложением и ожидайте запроса на доступ к вашим данным в мобильном приложении"
        className="text-center"
        footer={
          <Button
            fullWidth
            disabled={!ready}
            onClick={() => ready && router.push(nextHref)}
          >
            Авторизоваться
          </Button>
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/orgs/qr.jpg" alt="QR-код" className="mx-auto size-[200px]" />

        <LabeledDivider>Или</LabeledDivider>

        <Text variant="p2" tone="muted" className="text-center">
          Введите биометрию в поле ниже и нажмите кнопку «Авторизоваться»
        </Text>

        <Input
          size="l"
          label={bio ? "Биометрия" : undefined}
          placeholder="Например, 0000"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </LauncherCard>
    </AuthLayout>
  );
}
