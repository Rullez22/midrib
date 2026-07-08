"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { AppProgress } from "@/components/app/app-progress";
import { GlobeIcon, PinIcon } from "@/components/app/app-icons";
import {
  VERIFS,
  VERIF_BG,
  REGION_TITLE,
  type VerifItem,
  type VerifRegion,
} from "@/components/app/add-doc-data";

/**
 * Экран «Добавить документ» — /app/documents/add (Шаг 1 из 5).
 * Источник: Figma «Паспорт / Шаг 1 из 5» 7009:572133.
 * Прогресс + карточки верификации (Международная/Локальная × Жёлтый/Зелёный):
 * цена в WEI, «Выбрать» / «Подробнее» (→ /app/documents/add/detail?id=…).
 * DS: Text. Без нижней навигации (pushed-экран).
 */
function VerifCard({
  item,
  onSelect,
}: {
  item: VerifItem;
  onSelect: () => void;
}) {
  const Watermark = item.region === "international" ? GlobeIcon : PinIcon;
  return (
    <div
      className="relative overflow-hidden px-4 py-4 text-[#fff]"
      style={{ backgroundColor: VERIF_BG[item.color] }}
    >
      <Watermark className="pointer-events-none absolute -right-5 top-1/2 h-32 w-32 -translate-y-1/2 opacity-20" />

      <div className="relative flex items-start justify-between gap-3">
        <Text variant="p1-medium" className="text-[#fff]">
          {item.typeLabel}
        </Text>
        <Text variant="p1-medium" className="shrink-0 text-[#fff]">
          {item.price}
        </Text>
      </div>

      <Text variant="p2" as="p" className="relative mt-1 text-[#ffffff]/90">
        {item.cardDesc}
      </Text>

      <div className="relative mt-4 flex items-center gap-5">
        <button
          type="button"
          onClick={onSelect}
          className="rounded-md bg-[#fff] px-6 py-2 text-[13px] font-[500] uppercase tracking-[0.5px]"
          style={{ color: VERIF_BG[item.color] }}
        >
          Выбрать
        </button>
        <Link
          href={`/app/documents/add/detail?id=${item.id}`}
          className="text-[13px] font-[500] uppercase tracking-[0.5px] text-[#ffffff]/85"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}

export default function AddDocumentPage() {
  const router = useRouter();
  const regions: VerifRegion[] = ["international", "local"];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Паспорт" showBack flush />
      <AppProgress current={1} total={5} />

      <main className="min-h-0 flex-1 overflow-y-auto pb-4">
        {regions.map((region) => (
          <section key={region}>
            <Text
              variant="p1-medium"
              as="div"
              className="px-4 pb-1 pt-5 uppercase"
            >
              {REGION_TITLE[region]}
            </Text>
            {VERIFS.filter((v) => v.region === region).map((item) => (
              <VerifCard
                key={item.id}
                item={item}
                onSelect={() =>
                  router.push(`/app/documents/add/country?v=${item.id}`)
                }
              />
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
