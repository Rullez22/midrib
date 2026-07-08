import {
  NavHubPage,
  NavHubCard,
  NavHubLinkList,
  type NavHubLinkItem,
} from "@/components/ds";

/**
 * Компания не создана — карта переходов сценария «компания ещё не создана».
 * Источник: Figma «Midhub ERP» / menu 1 (node 2570:334921).
 *
 * Две колонки-панели со списками шагов. Ссылки ведут на соответствующие экраны
 * флоу «Создание компании» (`/flow/company-create/N`). Совет/председатели —
 * единый экран «Деятельность» (шаг 18), он прогрессирует по этапам.
 */

const managerInvite: NavHubLinkItem[] = [
  { label: "Ввод данных", href: "/flow/manager-invite/1" },
  { label: "выбор типа организации", href: "/flow/manager-invite/7" },
  { label: "Отправка приглашения", href: "/flow/manager-invite/10" },
  { label: "Приглашение отправлено", href: "/flow/manager-invite/13" },
];

const companyRepresentative: NavHubLinkItem[] = [
  { label: "Создание компании", href: "/flow/company-create/1" },
  { label: "Создание условий соглашения", href: "/flow/company-create/6" },
  { label: "Приглашение пайщиков", href: "/flow/company-create/5" },
  { label: "Выбор Совета", href: "/flow/company-create/18?stage=0" },
  { label: "Назначение председателя совета", href: "/flow/company-create/18?stage=1" },
  { label: "Назначение председателя правления", href: "/flow/company-create/18?stage=2" },
  { label: "Настройте вопросы для голосования", href: "/flow/company-create/19" },
  { label: "Настройка счетов", href: "/flow/company-create/21" },
  { label: "Создание нового счета", href: "/flow/company-create/24" },
  { label: "Отправка на валидацию", href: "/flow/company-create/27" },
];

export default function CompanyNotCreatedPage() {
  return (
    <NavHubPage title="Компания не создана" backHref="/">
      <div className="grid gap-6 md:grid-cols-2">
        <NavHubCard title="Приглашение менеджера компании">
          <NavHubLinkList items={managerInvite} />
        </NavHubCard>
        <NavHubCard title="Представитель компании">
          <NavHubLinkList items={companyRepresentative} />
        </NavHubCard>
      </div>
    </NavHubPage>
  );
}
