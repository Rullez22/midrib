"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Textarea } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { TrashIcon } from "@/components/app/app-icons";
import {
  useWallets,
  SAMPLE_ADDRESS,
} from "@/components/app/wallets-store";

/**
 * Экран «Изменение кошелька» — /app/balance/wallets/edit?id=…
 * Источник: Figma 7009:570451. Адрес (Вставить) + Наименование +
 * «Сохранить»; корзина в шапке — удалить. Данные — из стора кошельков.
 * DS: Input, Textarea, Button. Без нижней навигации.
 */
function EditWalletInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { getWallet, updateWallet, removeWallet } = useWallets();

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  // Кошельки грузятся из localStorage асинхронно — синхронизируем поля,
  // когда нужный кошелёк появился в сторе.
  const wallet = getWallet(id);
  useEffect(() => {
    if (wallet) {
      setAddress(wallet.address);
      setName(wallet.name);
    }
  }, [wallet?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const back = () => router.push("/app/balance/wallets");

  const save = () => {
    if (id) updateWallet(id, { address: address.trim(), name: name.trim() });
    back();
  };

  const remove = () => {
    if (id) removeWallet(id);
    back();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader
        title="Изменение кошелька"
        showBack
        actions={
          <button
            type="button"
            aria-label="Удалить кошелёк"
            onClick={remove}
            className="p-0.5 text-foreground-muted"
          >
            <TrashIcon />
          </button>
        }
      />

      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-5">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Textarea
              label="Адрес кошелька"
              placeholder="Адрес кошелька"
              size="s"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              noResize
            />
          </div>
          <Button
            variant="secondary"
            size="m"
            className="mt-6 shrink-0 uppercase tracking-[0.5px]"
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
          className="uppercase tracking-[0.5px]"
          onClick={save}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
}

export default function EditWalletPage() {
  return (
    <Suspense>
      <EditWalletInner />
    </Suspense>
  );
}
