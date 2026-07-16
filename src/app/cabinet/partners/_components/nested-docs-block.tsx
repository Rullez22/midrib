"use client";

import { type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Dropdown, Link, TableHeader, type TableColumn } from "@/components/ds";
import { cn } from "@/lib/cn";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { type CabinetConfig } from "../../[company]/_config/cabinets";
import { DOC_STATUS_COLOR, type Org } from "./partners-data";
import { KINDS, NESTED_DOC_ITEMS } from "./doc-kinds";

function DocsEmptyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className="size-10 text-primary">
      <rect x="9" y="6" width="18" height="24" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="11" width="18" height="24" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18 18h10M18 23h10M18 28h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * NestedDocsBlock — блок «Документы» внутри документа (Figma 6760-503641).
 * Показывает вложенные документы (созданные из этого документа через «Добавить
 * документ» → Счёт/Акт) таблицей «Тип · Сумма · Статус · Дата» + кнопка-дропдаун.
 * Пусто — иконка-заглушка. Вложенные требующие действий — оранжевые.
 *
 * Reuse: DS TableHeader/Dropdown/Button/Badge.
 */

const colStyle = (c: TableColumn): CSSProperties =>
  c.width ? { flex: `0 0 ${c.width}`, width: c.width } : { flex: c.flex ?? 1 };

const COLUMNS: TableColumn[] = [
  { key: "type", label: "Тип документа", flex: 2.4 },
  { key: "amount", label: "Сумма", flex: 1.2, align: "center" },
  { key: "status", label: "Статус", flex: 1.4, align: "center" },
  { key: "date", label: "Дата", flex: 1, align: "right" },
];

function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

export function NestedDocsBlock({ org, cabinet, parentDocId }: { org: Org; cabinet?: CabinetConfig; parentDocId: string }) {
  const router = useRouter();
  const { createdContracts } = useRegFlow();
  const nested = createdContracts.filter((c) => c.orgId === org.id && c.parentId === parentDocId);
  // base уже разводит оба кабинета, поэтому guard `if (cabinet)` здесь не нужен:
  // без company-slug (/cabinet/partners/org/…) он молча глушил переход, и
  // вложенный документ не создавался. Роуты contract-new и doc/[docId] для
  // этого случая существуют.
  const base = cabinet ? `/cabinet/${cabinet.slug}/partners/org/${org.id}` : `/cabinet/partners/org/${org.id}`;
  const create = (kind: string) => router.push(`${base}/contract-new?kind=${kind}&parent=${parentDocId}`);

  return (
    <div className="ds-row overflow-hidden rounded-[4px] border border-border">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <span className="ds-p2-medium text-foreground">Документы</span>
        <Dropdown
          align="end"
          aria-label="Добавить документ"
          items={NESTED_DOC_ITEMS}
          onSelect={(v) => create(v)}
          trigger={<Button size="s" iconLeft={<PlusIcon />}>Добавить документ</Button>}
        />
      </div>

      {nested.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 px-6 py-8 text-center">
          <DocsEmptyIcon />
          <p className="ds-p3 text-foreground-subtle">
            Вы можете создать <Link href="#" size="p3" onClick={(e) => { e.preventDefault(); create("invoice"); }}>счёт на оплату</Link>, или закрыть договор{" "}
            <Link href="#" size="p3" onClick={(e) => { e.preventDefault(); create("act"); }}>актом выполненных работ</Link> либо создайте{" "}
            <Link href="#" size="p3">товарную накладную</Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-4">
          <TableHeader columns={COLUMNS} size="s" tone="muted" />
          {nested.map((c) => {
            const status = c.finalized ? "Согласован" : "Ожидает участия";
            const open = () => router.push(`${base}/doc/${c.id}`);
            return (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={open}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
                className={cn(
                  "ds-row flex items-center gap-2 rounded-[4px] border bg-surface px-6 py-3 cursor-pointer",
                  status === "Ожидает участия" ? "border-[color:var(--color-orange-400)]" : "border-border",
                )}
              >
                <div className="flex flex-col gap-0.5" style={colStyle(COLUMNS[0])}>
                  <span className="ds-caption text-foreground-subtle">{KINDS[c.kind].doc}</span>
                  <span className="ds-p3 text-foreground">{c.name}</span>
                </div>
                <div className="ds-p3 text-center text-foreground" style={colStyle(COLUMNS[1])}>{c.amount}</div>
                <div className="flex justify-center" style={colStyle(COLUMNS[2])}>
                  <Badge variant="soft" color={DOC_STATUS_COLOR[status]}>{status}</Badge>
                </div>
                <div className="ds-p3 text-right text-foreground" style={colStyle(COLUMNS[3])}>11.04.2025</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
