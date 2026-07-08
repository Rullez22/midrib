"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Стор веб-регистраций (таб «Главная → Веб» мобильной апки MIDHUB).
 * Клиентский контекст + localStorage — чтобы список сервисов переживал
 * переходы флоу «Сервис запрашивает доступ» (кейс 1):
 *   grant → добавляет строку сервиса;
 *   «Закрыть доступ» → строка становится revoked (красная урна);
 *   «Скрыть сервис» / клик по урне → строка удаляется.
 * Источник списка: Figma 7009:571013, revoked-состояние: 7009:571769.
 */

export type RegStatus = "active" | "revoked";

export interface Registration {
  id: string;
  title: string;
  /** Показывать иконку чата в строке (у части сервисов из макета). */
  chat?: boolean;
  /** Строка кликабельна и ведёт в карточку /app/service/[id]. */
  detailed?: boolean;
  /** Доп. поля для карточки (напр. выбранные дипломы/аттестаты у ВУЗа). */
  extra?: string[];
  status: RegStatus;
}

/** Стартовый список из макета (Figma 7009:571013). */
const DEFAULTS: Registration[] = [
  { id: "uber", title: "Uber", status: "active" },
  { id: "facebook", title: "Facebbok", chat: true, status: "active" },
  { id: "vk", title: "VK", chat: true, status: "active" },
  { id: "localbitcoin", title: "Localbitcoin", status: "active" },
];

interface RegistrationsCtx {
  registrations: Registration[];
  /** Добавить/обновить сервис (upsert по id) со статусом active. */
  grant: (reg: Omit<Registration, "status">) => void;
  setStatus: (id: string, status: RegStatus) => void;
  remove: (id: string) => void;
  get: (id: string) => Registration | undefined;
}

const Ctx = createContext<RegistrationsCtx | null>(null);
const STORAGE_KEY = "midhub-app-registrations";

export function RegistrationsProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState<Registration[]>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRegistrations(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    } catch {
      /* ignore */
    }
  }, [registrations]);

  const grant: RegistrationsCtx["grant"] = (reg) => {
    setRegistrations((prev) => {
      const next: Registration = { ...reg, status: "active" };
      const idx = prev.findIndex((r) => r.id === reg.id);
      if (idx === -1) return [...prev, next];
      const copy = [...prev];
      copy[idx] = next;
      return copy;
    });
  };

  const setStatus: RegistrationsCtx["setStatus"] = (id, status) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  };

  const remove: RegistrationsCtx["remove"] = (id) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  const get: RegistrationsCtx["get"] = (id) =>
    registrations.find((r) => r.id === id);

  return (
    <Ctx.Provider value={{ registrations, grant, setStatus, remove, get }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRegistrations() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useRegistrations must be used within RegistrationsProvider",
    );
  return ctx;
}
