"use client";

import { AccountsScreen } from "./accounts-screen";
import { useEnsureFinal } from "./reg-flow";

/**
 * FinalAccountsScreen — ФИНАЛЬНЫЙ экран флоу создания кооператива. Всё пройдено и
 * готово: совет, председатели, пайщики, счета, распределение, подсчёт, валидация
 * документа (статус «Отвалидирован», баннер «Отправка на юрисдикцию»).
 * Источник: Figma 2542:437931.
 *
 * Засидивает полное состояние (`useEnsureFinal`), поэтому доступен по прямой
 * ссылке — «всё готово» — и служит финишем живого флоу (крестик в чате валидатора).
 */
export function FinalAccountsScreen(props: {
  settingsHref?: string;
  createPodschetHref?: string;
  validationVoteHref?: string;
  validatorChatHref?: string;
}) {
  useEnsureFinal();
  return <AccountsScreen {...props} />;
}
