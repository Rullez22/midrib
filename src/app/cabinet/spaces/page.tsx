import { Suspense } from "react";
import { SpacesScreen } from "./_components/spaces-screen";

/**
 * «Пространства» глобального кооператива — матрица уровней × направлений + лента.
 * Открывается по правой кнопке шапки экрана «О компании». Figma 7021-572134/572628.
 * Suspense — граница для useSearchParams (вкладка ?tab=feed) при пререндере.
 */
export default function SpacesPage() {
  return (
    <Suspense>
      <SpacesScreen />
    </Suspense>
  );
}
