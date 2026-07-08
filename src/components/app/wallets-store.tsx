"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Стор кошельков мобильной апки MIDHUB (демо-флоу «Баланс → Вывод →
 * Кошельки»). Клиентский контекст + localStorage — чтобы список кошельков
 * переживал переходы между экранами (add / edit / list).
 */
export interface Wallet {
  id: string;
  name: string;
  address: string;
}

/** Демо-адрес из макетов (вставляется по «Вставить»). */
export const SAMPLE_ADDRESS = "0x0964d04bd9d2640759b3f6f2695c426be79dd71f";

interface WalletsCtx {
  wallets: Wallet[];
  addWallet: (data: Omit<Wallet, "id">) => string;
  updateWallet: (id: string, patch: Partial<Omit<Wallet, "id">>) => void;
  removeWallet: (id: string) => void;
  getWallet: (id: string) => Wallet | undefined;
}

const Ctx = createContext<WalletsCtx | null>(null);
const STORAGE_KEY = "midhub-app-wallets";

export function WalletsProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWallets(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
    } catch {
      /* ignore */
    }
  }, [wallets]);

  const addWallet: WalletsCtx["addWallet"] = (data) => {
    const id = `w-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setWallets((prev) => [...prev, { id, ...data }]);
    return id;
  };

  const updateWallet: WalletsCtx["updateWallet"] = (id, patch) => {
    setWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    );
  };

  const removeWallet: WalletsCtx["removeWallet"] = (id) => {
    setWallets((prev) => prev.filter((w) => w.id !== id));
  };

  const getWallet: WalletsCtx["getWallet"] = (id) =>
    wallets.find((w) => w.id === id);

  return (
    <Ctx.Provider
      value={{ wallets, addWallet, updateWallet, removeWallet, getWallet }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useWallets() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallets must be used within WalletsProvider");
  return ctx;
}
