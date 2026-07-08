"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppSplash } from "./app-splash";

/**
 * SplashGate — показывает splash-экран при входе в апку, затем плавно
 * отдаёт контент. Держит splash фиксированное время (SPLASH_MS).
 *
 * Каркас по аналогии с Вектором (там splash перед app-shell). Здесь —
 * лёгкая client-обёртка без внешних зависимостей.
 */
const SPLASH_MS = 1800;

export function SplashGate({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {children}
      {showSplash && <AppSplash />}
    </>
  );
}
