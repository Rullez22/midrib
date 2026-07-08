import {
  NavHubPage,
  NavHubCard,
  NavHubLinkList,
  type NavHubLinkItem,
} from "@/components/ds";

/**
 * Компания создана — карта переходов сценария «компания уже работает».
 * Источник: Figma «Midhub ERP» / Компания создана (node 1857:650053).
 *
 * Колонки-роли (Кооператив / Председатель / Пайщик / Админ). Пункты ведут
 * в соответствующие экраны кабинета созданной компании (/cabinet/*):
 * департаменты — конфиг-кабинеты /cabinet/<slug> (validator/web/domains/…),
 * ЛК ролей — /cabinet/lk/<role> (chair/payer), партнёры — /cabinet/partners/<id>.
 */

const cooperative: NavHubLinkItem[] = [
  { label: "Личный кабинет", href: "/cabinet" },
  { label: "Разовый / Стабильный платеж", href: "/cabinet/payment" },
  { label: "Массовый/Персональный платеж", href: "/cabinet/account/marketing/connect" },
  { label: "Отчетность", href: "/cabinet/report" },
  { label: "Создание документа", href: "/cabinet/document/new" },
  { label: "Пайщики/Приглашение", href: "/cabinet/paishiki" },
  { label: "Пользовательское соглашение", href: "/cabinet/paishiki/6" },
  { label: "Вопросы голосования", href: "/cabinet/voting" },
  { label: "Партнеры", href: "/cabinet/partners" },
];

const chairman: NavHubLinkItem[] = [
  { label: "Главная страница компании и чат", href: "/cabinet" },
  { label: "Личный кабинет", href: "/cabinet/lk/chair" },
  { label: "Создание голосования", href: "/cabinet/voting" },
  { label: "Парнтер - Пайщик", href: "/cabinet/partners/slonenok" },
  { label: "Парнтер", href: "/cabinet/partners/gvozdi" },
  { label: "Пайщик", href: "/cabinet/lk/assistant" },
  { label: "Департамент (Администрация)", href: "/cabinet/subdivision/administration" },
  { label: "Департамент (Валидатор)", href: "/cabinet/validator" },
  { label: "Департамент (Веб-ресурс)", href: "/cabinet/web" },
  { label: "Департамент (Домены)", href: "/cabinet/domains" },
  { label: "Департамент (Исполнитель)", href: "/cabinet/executor" },
  { label: "Департамент (Регулятор)", href: "/cabinet/regulator" },
  { label: "Департамент (ВУЗы)", href: "/cabinet/vuz" },
  { label: "Департамент (Фонд)", href: "/cabinet/fond" },
];

const shareholder: NavHubLinkItem[] = [
  { label: "Личный кабинет", href: "/cabinet/lk/payer" },
];

const admin: NavHubLinkItem[] = [
  { label: "Реферальная", href: "/cabinet/admin" },
  { label: "Модули/создание подразделения", href: "/cabinet/admin/modules" },
];

export default function CompanyCreatedPage() {
  return (
    <NavHubPage title="Компания создана" backHref="/">
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <NavHubCard title="Кооператив">
          <NavHubLinkList items={cooperative} />
        </NavHubCard>
        <NavHubCard title="Председатель">
          <NavHubLinkList items={chairman} />
        </NavHubCard>
        <div className="flex flex-col gap-6">
          <NavHubCard title="Пайщик">
            <NavHubLinkList items={shareholder} />
          </NavHubCard>
          <NavHubCard title="Админ">
            <NavHubLinkList items={admin} />
          </NavHubCard>
        </div>
      </div>
    </NavHubPage>
  );
}
