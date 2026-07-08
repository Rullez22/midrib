"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { VerifColor, VerifRegion } from "@/components/app/add-doc-data";

/**
 * Стор «документов на проверке» — то, что добавлено через флоу «Добавить
 * документ» и попало в таб «Проверяются». Клиентский контекст + localStorage,
 * чтобы пережить переходы между экранами (подтверждение → список → «Проверка»).
 */
export interface PendingDoc {
  id: string;
  title: string;
  color: VerifColor;
  region: VerifRegion;
}

interface Ctx {
  pending: PendingDoc[];
  addPending: (data: Omit<PendingDoc, "id">) => string;
  getPending: (id: string) => PendingDoc | undefined;
}

const PendingCtx = createContext<Ctx | null>(null);
const KEY = "midhub-app-pending-docs";

export function PendingDocsProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingDoc[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPending(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(pending));
    } catch {
      /* ignore */
    }
  }, [pending]);

  const addPending: Ctx["addPending"] = (data) => {
    const id = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setPending((prev) => [{ id, ...data }, ...prev]);
    return id;
  };

  const getPending: Ctx["getPending"] = (id) =>
    pending.find((p) => p.id === id);

  return (
    <PendingCtx.Provider value={{ pending, addPending, getPending }}>
      {children}
    </PendingCtx.Provider>
  );
}

export function usePendingDocs() {
  const ctx = useContext(PendingCtx);
  if (!ctx)
    throw new Error("usePendingDocs must be used within PendingDocsProvider");
  return ctx;
}
