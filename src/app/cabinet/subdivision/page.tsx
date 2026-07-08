import { CompanyProfileScreen } from "../../flow/company-create/_components/company-profile-screen";

/**
 * Профиль подразделения (операционный кабинет). Переиспользует существующий
 * CompanyProfileScreen (та же компонента профиля «…-главная») в режиме просмотра,
 * внутри засиженного провайдера /cabinet. Логотип/«1» ведёт в кабинет.
 *
 * NB: рич-секции профиля подразделения (Требования/Достижения/Статистика/Лента)
 * собираются из DS-композитов (stat-charts, feed-post, achievement-card) —
 * добавляются отдельно поверх этой базы.
 */
export default function CabinetSubdivisionPage() {
  return <CompanyProfileScreen view paishikiHref="/cabinet/paishiki" />;
}
