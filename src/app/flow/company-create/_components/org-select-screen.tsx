"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { LauncherCard, LabeledDivider, Button } from "@/components/ds";
import { AuthLayout } from "./auth-layout";

/**
 * OrgSelectScreen — «Выбор организации». Источник: Figma 2477:274452.
 * Собран из DS: LauncherCard, LabeledDivider, Button + локальная OrgCard.
 */

function OrgCard({
  logo,
  name,
  meta,
  href,
}: {
  logo: ReactNode;
  name: string;
  meta: string;
  href?: string;
}) {
  const inner = (
    <div className="ds-row flex items-center gap-4 rounded-[4px] border border-border p-[15px] text-left">
      <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-surface-muted">
        {logo}
      </span>
      <span className="flex flex-col gap-1">
        <span className="ds-p2-medium text-foreground">{name}</span>
        <span className="ds-p3 text-foreground-subtle">{meta}</span>
      </span>
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export function OrgSelectScreen({ selectHref }: { selectHref: string }) {
  return (
    <AuthLayout>
      <LauncherCard
        title="Выбор организации"
        subtitle="У вас есть доступ к нескольким организациям. В рабочей области какой организации вы хотите продолжить работу?"
        className="text-center"
        footer={
          <Button variant="negative-sec" fullWidth>
            Выйти
          </Button>
        }
      >
        <LabeledDivider>Кооперативы</LabeledDivider>
        <OrgCard
          href={selectHref}
          logo={<span className="ds-p3-medium uppercase text-foreground-muted">Immatra</span>}
          name="IMMATRA"
          meta="Необходимо заполнить и активировать"
        />

        <LabeledDivider>ООО</LabeledDivider>
        <OrgCard
          // eslint-disable-next-line @next/next/no-img-element
          logo={<img src="/orgs/clever.jpg" alt="" className="size-full object-cover" />}
          name="Clever"
          meta="Сотрудник компании"
        />
        <OrgCard
          // eslint-disable-next-line @next/next/no-img-element
          logo={<img src="/orgs/romashka.png" alt="" className="size-full object-cover" />}
          name="Ромашка"
          meta="Директор компании"
        />
      </LauncherCard>
    </AuthLayout>
  );
}
