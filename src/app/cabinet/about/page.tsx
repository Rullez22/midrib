import { Suspense } from "react";
import { CompanyAboutScreen } from "../[company]/_components/company-about-screen";

/**
 * «О компании» — единый экран кооператива (рейка + шапка). Открывается по клику
 * на логотип рейки с любой страницы кабинета. Кооператив-уровень, без slug.
 *
 * Suspense — потому что CompanyAboutScreen читает URL-параметры (useSearchParams:
 * ?view=structure&focus=slug при переходе с ЦКП подразделения).
 */
export default function AboutCompanyPage() {
  return (
    <Suspense>
      <CompanyAboutScreen />
    </Suspense>
  );
}
