import { PaymentPersonalScreen } from "./_components/payment-personal-screen";

/**
 * Персональное подключение — флоу подключения нескольких долей одному пайщику.
 * Открывается по «Подключить» у карточки «Персональное подключение» в
 * /cabinet/account/marketing/connect. Figma node 2653:448155.
 */
export default function PoolConnectPersonalPage() {
  return <PaymentPersonalScreen />;
}
