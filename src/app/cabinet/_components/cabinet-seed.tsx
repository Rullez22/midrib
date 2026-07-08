"use client";

import { useEnsureFinal } from "../../flow/company-create/_components/reg-flow";

/**
 * CabinetSeed — засеивает «всё готово» (useEnsureFinal) один раз на весь раздел
 * /cabinet. Монтируется в layout, поэтому состояние (совет, пайщики, счета,
 * распределение) сохраняется при навигации МЕЖДУ страницами кабинета — в отличие
 * от онбординга (/flow/company-create), у которого свой пустой провайдер.
 */
export function CabinetSeed() {
  useEnsureFinal();
  return null;
}

/** Общие маршруты сайдбара для операционного кабинета (внутри /cabinet). */
export const CABINET_ROUTES = {
  profile: "/cabinet",
  accounts: "/cabinet",
  activity: "/cabinet/activity",
  voting: "/cabinet/voting",
  paishiki: "/cabinet/paishiki",
  partners: "/cabinet/partners",
  subdivision: "/cabinet/subdivision/administration",
  lk: "/cabinet/lk/chair",
};
