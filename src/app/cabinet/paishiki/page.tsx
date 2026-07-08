import { PaishikiScreen } from "../../flow/company-create/_components/paishiki-screen";
import { CABINET_ROUTES } from "../_components/cabinet-seed";

/**
 * Управление пайщиками кооператива (операционный кабинет). Переиспользует
 * существующий PaishikiScreen внутри засиженного провайдера /cabinet (пайщики
 * уже приглашены → таблица заполнена). Маршруты сайдбара — внутри /cabinet.
 *
 * Подфлоу «Пользовательское соглашение / форма регистрации» (шаги 6–16) живёт в
 * /cabinet/paishiki/[step]: agreementHref → создание соглашения, ppListHref →
 * список используемых форм. Так в кабинете ПП работает так же, как в инвайт-флоу.
 */
export default function CabinetPaishikiPage() {
  return (
    <PaishikiScreen
      routes={CABINET_ROUTES}
      agreementHref="/cabinet/paishiki/6"
      ppListHref="/cabinet/paishiki/15"
      inviteToCouncil
    />
  );
}
