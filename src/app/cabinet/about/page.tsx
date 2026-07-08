import { CompanyAboutScreen } from "../[company]/_components/company-about-screen";

/**
 * «О компании» — единый экран кооператива (рейка + шапка). Открывается по клику
 * на логотип рейки с любой страницы кабинета. Кооператив-уровень, без slug.
 */
export default function AboutCompanyPage() {
  return <CompanyAboutScreen />;
}
