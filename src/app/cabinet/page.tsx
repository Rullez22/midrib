import { CabinetScreen } from "./_components/cabinet-screen";

/**
 * Личный кабинет кооператива — сценарий 1 раздела «Кооператив».
 * Источник: Figma node 1857:649628 («клиентская программа (main)»).
 * Подключён из карты «Компания создана» (/company-created).
 *
 * ?tab=doc открывает под-таб «Документооборот» (возврат «Назад» из флоу
 * создания документа — плашка документа в текущем статусе).
 */
export default async function CabinetPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <CabinetScreen initialTab={tab} />;
}
