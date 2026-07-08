import { PaymentMassScreen } from "./_components/payment-mass-screen";

/**
 * Массовое подключение — флоу подключения адресов к пул-счёту с одной долей
 * (и более) на пайщика. Открывается по «Подключить» у карточки «Массовое
 * подключение» в /cabinet/account/marketing/connect. Figma node 2649:360975.
 */
export default function PoolConnectMassPage() {
  return <PaymentMassScreen />;
}
