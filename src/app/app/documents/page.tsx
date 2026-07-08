"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { AppTabsBar } from "@/components/app/app-tabs-bar";
import {
  SearchIcon,
  QrIcon,
  GlobeIcon,
  PinIcon,
  BankIcon,
} from "@/components/app/app-icons";
import {
  usePendingDocs,
  type PendingDoc,
} from "@/components/app/pending-docs-store";
import { useDiploma } from "@/components/app/diploma-store";

/**
 * Экран «Мои документы» — таб нижней навигации «Документы».
 * Источник: Figma «Mobile | 6 columns» (Выданные 7009:568400,
 * Проверяются 7009:568535).
 *
 * У каждого документа справа — сетка цветных плиток-«проверок»
 * (2 колонки × 2 ряда): глобус (веб) / пин (место), цвет — статус
 * (зелёный/оранжевый). Плитка может занимать всю высоту строки (span 2).
 * DS: Tabs (через AppTabsBar), Text, Button. Стиль — MIDHUB (токены).
 */

type DocTab = "issued" | "checking";
type TileColor = "green" | "orange";
type TileIcon = "globe" | "pin";
/** Плитка проверки: цвет + иконка; span 2 — на всю высоту строки. */
type Tile = { color: TileColor; icon: TileIcon; span?: 1 | 2 } | null;
/** Документ: заголовок + две колонки плиток (ячейки сверху вниз). */
interface DocItem {
  id: string;
  title: string;
  cols: [Tile[], Tile[]];
}

const ISSUED: DocItem[] = [
  {
    id: "med",
    title: "Мидицинское освидетельствование",
    cols: [
      [{ color: "orange", icon: "globe" }, { color: "green", icon: "pin" }],
      [{ color: "orange", icon: "pin" }, { color: "green", icon: "globe" }],
    ],
  },
  {
    id: "spravka",
    title: "Справка",
    cols: [
      [null, { color: "green", icon: "pin" }],
      [{ color: "orange", icon: "pin" }, { color: "green", icon: "globe" }],
    ],
  },
  {
    id: "birth",
    title: "Свидетельство о рождении",
    cols: [
      [null, null],
      [{ color: "green", icon: "pin" }, { color: "green", icon: "globe" }],
    ],
  },
];

const CHECKING: DocItem[] = [
  {
    id: "driver",
    title: "Водительское удостоверение",
    cols: [[], [{ color: "orange", icon: "globe", span: 2 }]],
  },
  {
    id: "marriage",
    title: "Брачное свидетельство",
    cols: [
      [{ color: "orange", icon: "pin" }, { color: "green", icon: "globe" }],
      [{ color: "green", icon: "pin", span: 2 }],
    ],
  },
];

const TILE_BG: Record<TileColor, string> = {
  green: "var(--color-green-500)",
  orange: "var(--color-orange-300)",
};

function TileIconEl({ icon, size }: { icon: TileIcon; size: number }) {
  const Cmp = icon === "globe" ? GlobeIcon : PinIcon;
  return <Cmp width={size} height={size} />;
}

/** Одна колонка плиток документа (ячейки сверху вниз, gap 1px). */
function TileColumn({ cells }: { cells: Tile[] }) {
  return (
    <div className="flex w-[68px] flex-col gap-px">
      {cells.map((cell, i) => {
        const span = cell?.span ?? 1;
        const heightCls = span === 2 ? "h-[73px]" : "h-9";
        if (!cell) {
          return <div key={i} className={heightCls} />;
        }
        return (
          <div
            key={i}
            className={`flex ${heightCls} items-center justify-center text-[#fff]`}
            style={{ backgroundColor: TILE_BG[cell.color] }}
          >
            <TileIconEl icon={cell.icon} size={span === 2 ? 30 : 16} />
          </div>
        );
      })}
    </div>
  );
}

function DocRow({ item }: { item: DocItem }) {
  return (
    <div className="flex items-stretch gap-px border-b border-border">
      <Link
        href={`/app/document?id=${item.id}`}
        className="flex min-h-[73px] flex-1 items-center px-4 py-3"
      >
        <Text variant="p2">{item.title}</Text>
      </Link>
      <TileColumn cells={item.cols[0]} />
      <TileColumn cells={item.cols[1]} />
    </div>
  );
}

/** Строка добавленного через флоу документа (таб «Проверяются»). */
function PendingRow({ doc }: { doc: PendingDoc }) {
  return (
    <Link
      href={`/app/documents/check?id=${doc.id}`}
      className="flex items-stretch gap-px border-b border-border"
    >
      <div className="flex min-h-[73px] flex-1 items-center px-4 py-3">
        <Text variant="p2">{doc.title}</Text>
      </div>
      <div
        className="flex w-[68px] shrink-0 items-center justify-center text-[#fff]"
        style={{
          backgroundColor: doc.color === "green" ? "var(--color-green-500)" : "#f0b429",
        }}
      >
        {doc.region === "international" ? (
          <GlobeIcon width={30} height={30} />
        ) : (
          <PinIcon width={30} height={30} />
        )}
      </div>
    </Link>
  );
}

/** Строка «Диплом» (флоу кейс 2). При status=pending — оранжевые
 *  сепараторы и переход на подтверждение; при confirmed — полная карточка. */
function DiplomaRow({ pending }: { pending: boolean }) {
  return (
    <Link
      href={
        pending
          ? "/app/documents/diploma/confirm"
          : "/app/documents/diploma"
      }
      className={
        pending
          ? "flex items-stretch gap-px border-y border-[var(--color-orange-300)]"
          : "flex items-stretch gap-px border-b border-border"
      }
    >
      <div className="flex min-h-[73px] flex-1 items-center px-4 py-3">
        <Text variant="p2">Диплом</Text>
      </div>
      <div
        className="flex w-[68px] shrink-0 items-center justify-center text-[#fff]"
        style={{ backgroundColor: "var(--color-green-500)" }}
      >
        <BankIcon width={26} height={26} />
      </div>
    </Link>
  );
}

function DocumentsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { pending } = usePendingDocs();
  const { status: diplomaStatus } = useDiploma();
  // Активный таб — в URL (?tab=), чтобы возврат с детальных экранов
  // восстанавливал таб (Выданные/Проверяются), а не сбрасывал на первый.
  const tab: DocTab = params.get("tab") === "checking" ? "checking" : "issued";
  const setTab = (v: DocTab) =>
    router.replace(v === "checking" ? "/app/documents?tab=checking" : "/app/documents", {
      scroll: false,
    });
  const items = tab === "issued" ? ISSUED : CHECKING;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader
        title="Мои документы"
        flush
        actions={
          <>
            <button type="button" aria-label="Поиск" className="p-0.5">
              <SearchIcon />
            </button>
            <Link href="/app/qr" aria-label="QR-код" className="p-0.5">
              <QrIcon />
            </Link>
          </>
        }
      />

      <AppTabsBar
        value={tab}
        onChange={(v) => setTab(v as DocTab)}
        items={[
          { value: "issued", label: "Выданные" },
          { value: "checking", label: "Проверяются" },
        ]}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {tab === "checking" &&
          pending.map((doc) => <PendingRow key={doc.id} doc={doc} />)}
        {tab === "issued" && diplomaStatus !== "none" && (
          <DiplomaRow pending={diplomaStatus === "pending"} />
        )}
        {items.map((item) => (
          <DocRow key={item.title} item={item} />
        ))}
      </main>

      <div className="bg-surface px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
          onClick={() => router.push("/app/documents/add")}
        >
          Добавить документ
        </Button>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense>
      <DocumentsInner />
    </Suspense>
  );
}
