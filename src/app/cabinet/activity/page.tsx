import { ActivityScreen } from "../../flow/company-create/_components/activity-screen";
import { CABINET_ROUTES } from "../_components/cabinet-seed";

/**
 * Деятельность кооператива (операционный кабинет). Переиспользует ActivityScreen,
 * но внутри засиженного провайдера /cabinet (CabinetSeed) — поэтому структура
 * показана заполненной (совет, председатели), а не «как в первый раз».
 * Маршруты сайдбара — внутри /cabinet (не прыгаем в онбординг).
 */
export default function CabinetActivityPage() {
  return <ActivityScreen routes={CABINET_ROUTES} cabinetView />;
}
