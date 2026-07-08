"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Стор диплома (флоу «ВУЗ выдаёт диплом» — кейс 2, и «внесение дополнений» —
 * кейс 3).
 *   status: none — диплома нет; pending — ждёт подтверждения (оранжевая точка
 *           на «Документы», оранжевые сепараторы); confirmed — в «Мои документы».
 *   variant: issue — выдача диплома (кейс 2); appendix — внесение дополнений
 *            (кейс 3) → на экране подтверждения появляется новое приложение.
 * Источник: Figma 7009:575194 (кейс 2) / 7009:575272 (кейс 3).
 */
export type DiplomaStatus = "none" | "pending" | "confirmed";
export type DiplomaVariant = "issue" | "appendix";

interface DiplomaState {
  status: DiplomaStatus;
  variant: DiplomaVariant;
}

interface DiplomaCtx {
  status: DiplomaStatus;
  variant: DiplomaVariant;
  /** Диплом выдан/дополнен ВУЗом → pending. */
  issue: (variant?: DiplomaVariant) => void;
  /** Пользователь подтвердил корректность → confirmed. */
  confirm: () => void;
  /** Пользователь отклонил → диплом исчезает (none). */
  reject: () => void;
}

const Ctx = createContext<DiplomaCtx | null>(null);
const STORAGE_KEY = "midhub-app-diploma";
const INITIAL: DiplomaState = { status: "none", variant: "issue" };

export function DiplomaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DiplomaState>(INITIAL);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Обратная совместимость: раньше хранили просто строку статуса.
        if (typeof parsed === "string")
          setState({ status: parsed as DiplomaStatus, variant: "issue" });
        else setState(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  return (
    <Ctx.Provider
      value={{
        status: state.status,
        variant: state.variant,
        issue: (variant = "issue") => setState({ status: "pending", variant }),
        confirm: () => setState((s) => ({ ...s, status: "confirmed" })),
        reject: () => setState((s) => ({ ...s, status: "none" })),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useDiploma() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDiploma must be used within DiplomaProvider");
  return ctx;
}
