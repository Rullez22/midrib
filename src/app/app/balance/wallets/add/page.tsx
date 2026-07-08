"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import {
  useWallets,
  SAMPLE_ADDRESS,
} from "@/components/app/wallets-store";

/**
 * Экран «Добавление кошелька» — /app/balance/wallets/add.
 * Источник: Figma 7009:570255. Адрес (Вставить) + Наименование +
 * «Добавить кошелек» → сохраняем в стор и возвращаемся к списку.
 * DS: Input, Textarea, Button. Без нижней навигации.
 */
export default function AddWalletPage() {
  const router = useRouter();
  const { addWallet } = useWallets();
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  const canSave = address.trim() !== "" && name.trim() !== "";

  const save = () => {
    if (!canSave) return;
    addWallet({ address: address.trim(), name: name.trim() });
    router.push("/app/balance/wallets");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Добавление кошелька" showBack />

      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-5">
        <Textarea
          label="Адрес кошелька"
          placeholder="Адрес кошелька"
          size="s"
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          noResize
        />

        <div>
          <Button
            variant="secondary"
            size="m"
            className="uppercase tracking-[0.5px]"
            onClick={() => setAddress(SAMPLE_ADDRESS)}
          >
            Вставить
          </Button>
        </div>

        <Input
          label="Наименование"
          placeholder="Наименование"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </main>

      <div className="px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          disabled={!canSave}
          className="uppercase tracking-[0.5px]"
          onClick={save}
        >
          Добавить кошелек
        </Button>
      </div>
    </div>
  );
}
