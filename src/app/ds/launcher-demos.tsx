"use client";

/**
 * Демки «Launcher» (авторизация / выбор организации) для витрины /ds.
 * Источник: Figma «UI фичи» / launcher (2086:272686, 2086:272858).
 * Переиспользованы DS: LauncherCard, LabeledDivider, Input, Button, Item.
 */
import {
  LauncherCard,
  LabeledDivider,
  Input,
  Button,
  Item,
} from "@/components/ds";

/** QR-заглушка (декоративная). */
function Qr() {
  const cells = "111111101010111111100000101110100000101110111010111010111010100010111010001110101111111101010111111";
  const n = 10;
  return (
    <svg width="180" height="180" viewBox="0 0 10 10" className="mx-auto" aria-label="QR-код" role="img">
      <rect width="10" height="10" fill="#fff" />
      {Array.from({ length: n * n }).map((_, i) => {
        const c = cells[i % cells.length];
        return c === "1" ? <rect key={i} x={i % n} y={Math.floor(i / n)} width="1" height="1" fill="#242b32" /> : null;
      })}
    </svg>
  );
}

function LogoBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="flex size-14 flex-none items-center justify-center rounded-[8px] text-sm font-bold text-white" style={{ background: color }}>
      {children}
    </span>
  );
}

function OrgRow({ logo, name, role }: { logo: React.ReactNode; name: string; role: string }) {
  return (
    <Item leading={logo}>
      <span className="flex flex-col">
        <span className="ds-p2-medium text-foreground">{name}</span>
        <span className="ds-p3 text-foreground-subtle">{role}</span>
      </span>
    </Item>
  );
}

export function LauncherDemos() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {/* Авторизация */}
      <LauncherCard
        className="w-[440px]"
        title="Авторизация"
        subtitle="Считайте QR-код мобильным приложением и ожидайте запроса на доступ к вашим данным в мобильном приложении"
        footer={<Button fullWidth disabled>Авторизоваться</Button>}
      >
        <Qr />
        <LabeledDivider>Или</LabeledDivider>
        <p className="ds-p3 text-center text-foreground-muted">
          Введите биометрию в поле ниже и нажмите кнопку &laquo;Авторизоваться&raquo;
        </p>
        <Input size="l" placeholder="Например, 0000" />
      </LauncherCard>

      {/* Выбор организации */}
      <LauncherCard
        className="w-[440px]"
        title="Выбор организации"
        subtitle="У вас есть доступ к нескольким организациям. В рабочей области какой организации вы хотите продолжить работу?"
        footer={<Button variant="negative-sec" fullWidth>Выйти</Button>}
      >
        <LabeledDivider>Кооперативы</LabeledDivider>
        <OrgRow logo={<LogoBox color="#242b32">IM</LogoBox>} name="IMMATRA" role="Необходимо заполнить и активировать" />
        <LabeledDivider>ООО</LabeledDivider>
        <OrgRow logo={<LogoBox color="var(--color-blue-midhub-500)">C</LogoBox>} name="Clever" role="Сотрудник компании" />
        <OrgRow logo={<LogoBox color="var(--color-green-400)">Р</LogoBox>} name="Ромашка" role="Директор компании" />
      </LauncherCard>
    </div>
  );
}
