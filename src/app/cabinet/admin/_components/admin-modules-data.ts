/**
 * Данные раздела «Модули» админки — направления Магазина. Не-client модуль,
 * чтобы `directionTitle` можно было вызывать из серверных страниц.
 */

/** Карточки «Магазина» — направления, цвета совпадают с воркспейсами рейки. */
export const SHOP_DIRECTIONS: { slug: string; title: string; color: string }[] = [
  { slug: "ideo", title: "Идеологическое направление", color: "var(--color-red-200)" },
  { slug: "infra", title: "Инфраструктурное направление", color: "var(--color-orange-200)" },
  { slug: "marketing", title: "Маркетинговое направление", color: "var(--color-yellow-300)" },
  { slug: "housing", title: "Жилищное направление", color: "var(--color-green-200)" },
  { slug: "economy", title: "Хозяйственное направление", color: "var(--color-blue-midhub-200)" },
  { slug: "strategy", title: "Стратегическое направление", color: "var(--color-blue-midhub-300)" },
  { slug: "space", title: "Космическое направление", color: "var(--color-purple-200)" },
];

/** Название направления по slug (для детальной страницы). */
export const directionTitle = (slug: string) =>
  SHOP_DIRECTIONS.find((d) => d.slug === slug)?.title ?? "Направление";
