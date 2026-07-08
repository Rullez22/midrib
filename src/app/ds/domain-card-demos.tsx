"use client";

/**
 * Демка DomainCard (карточка домена) для витрины /ds.
 * Источник: Figma «UI фичи» / Карточка домена (215:41782).
 */
import { DomainCard } from "@/components/ds";

export function DomainCardDemos() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-[1080px]">
      <DomainCard title="Формы компаний" documentsCount={1} subdomainsCount={0} />
      <DomainCard
        title="Удостоверяющие личность"
        documentsCount={1}
        subdomainsCount={0}
      />
      <DomainCard
        mine
        title="Формы компаний"
        documentsCount={1}
        subdomainsCount={0}
        onSettings={() => {}}
      />
      <DomainCard
        mine
        title="Удостоверяющие личность"
        documentsCount={1}
        subdomainsCount={0}
        onSettings={() => {}}
      />
    </div>
  );
}
