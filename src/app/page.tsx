import { NavHubPage, NavHubChoiceCard } from "@/components/ds";

/**
 * Navigation — корневой навигационный хаб MIDHUB (первый экран).
 * Источник: Figma «Midhub ERP» / Navigation (node 3501:453400).
 *
 * Точка входа во весь флоу: выбор сценария «Компания не создана» /
 * «Компания создана» (→ карты переходов) + Android-версия.
 */
export default function NavigationPage() {
  return (
    <NavHubPage title="MIDHUB" hideBack>
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <NavHubChoiceCard
            title="Компания не создана"
            description="Для того чтобы представитель мог создать свою компанию на платформе, его должен пригласить менеджер другой компании."
            href="/company-not-created"
            illustrationSrc="/illustrations/warning-triangle.svg"
          />
          <NavHubChoiceCard
            title="Компания создана"
            description="Представитель компании уже создал компанию на платформе и компания работает."
            href="/company-created"
            illustrationSrc="/illustrations/check-circle.svg"
          />
        </div>

        <NavHubChoiceCard title="Android версия" href="/app" align="center" />
      </div>
    </NavHubPage>
  );
}
