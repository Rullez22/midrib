"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * CabinetUnlock — лёгкое платформенное состояние «разблокированных» пунктов меню
 * кабинета. Живёт в layout кабинета (/cabinet/[company]) — ВЫШЕ под-флоу раздела
 * «Направление», поэтому виден и флоу (где пункт разблокируется), и страницам
 * кабинета (где сайдбар читает флаг). In-memory, как и RegFlow: переживает
 * клиентскую навигацию, сбрасывается на рефреше.
 *
 * Пункты «Выдача диплома» / «Дополнения» в кабинете ВУЗы по умолчанию скрыты и
 * появляются только после прохождения соответствующего флоу (кнопка «Начать»).
 */

export type UnlockKey = "diploma" | "additions";

interface CabinetUnlockValue {
  unlocked: Record<UnlockKey, boolean>;
  unlock: (key: UnlockKey) => void;
}

const DEFAULT: Record<UnlockKey, boolean> = { diploma: false, additions: false };

const CabinetUnlockContext = createContext<CabinetUnlockValue | null>(null);

export function CabinetUnlockProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<Record<UnlockKey, boolean>>(DEFAULT);
  const unlock = (key: UnlockKey) =>
    setUnlocked((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  return (
    <CabinetUnlockContext.Provider value={{ unlocked, unlock }}>
      {children}
    </CabinetUnlockContext.Provider>
  );
}

/** Без провайдера — всё заблокировано (безопасный дефолт). */
export function useCabinetUnlock(): CabinetUnlockValue {
  return useContext(CabinetUnlockContext) ?? { unlocked: DEFAULT, unlock: () => {} };
}
