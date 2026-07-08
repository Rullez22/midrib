"use client";

import { useState } from "react";
import { Text, UploadV1, UploadV2, UploadFile } from "@/components/ds";

/** Заглушка-миниатюра документа (для состояния preview UploadV1). */
const DOC_PREVIEW =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='84' height='84'>
      <rect width='84' height='84' fill='#ffffff'/>
      <rect x='14' y='10' width='56' height='64' rx='2' fill='#f3f6f9' stroke='#dee5ec'/>
      ${Array.from({ length: 7 })
        .map((_, i) => `<rect x='22' y='${20 + i * 7}' width='${i % 2 ? 30 : 40}' height='2.5' rx='1.25' fill='#c9d3de'/>`)
        .join("")}
    </svg>`,
  );

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <Text variant="caption" tone="subtle">{label}</Text>
    </div>
  );
}

export function UploadDemos() {
  const [v1Deleted, setV1Deleted] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Upload v1 — компактная плитка */}
      <div className="flex flex-col gap-3">
        <Text variant="caption-up" tone="subtle">Upload v1 — плитка 84×84 (наведи / кликни)</Text>
        <div className="flex flex-wrap items-start gap-x-6 gap-y-5 rounded-xl border border-border p-5">
          <Cell label="default"><UploadV1 onSelect={() => {}} /></Cell>
          <Cell label="error"><UploadV1 error onSelect={() => {}} /></Cell>
          <Cell label="disabled"><UploadV1 disabled /></Cell>
          <Cell label="loading"><UploadV1 loading /></Cell>
          <Cell label="value (наведи → корзина)">
            {v1Deleted ? (
              <UploadV1 onSelect={() => setV1Deleted(false)} />
            ) : (
              <UploadV1 preview={DOC_PREVIEW} onDelete={() => setV1Deleted(true)} />
            )}
          </Cell>
          <Cell label="+N (группа)"><UploadV1 preview={DOC_PREVIEW} count={2} onSelect={() => {}} /></Cell>
        </div>
      </div>

      {/* Upload v2 — drop-зона */}
      <div className="flex flex-col gap-3">
        <Text variant="caption-up" tone="subtle">Upload v2 — drop-зона (наведи / фокус)</Text>
        <div className="grid grid-cols-1 gap-5 rounded-xl border border-border p-5 md:grid-cols-2">
          <Cell label="default"><UploadV2 onSelect={() => {}} /></Cell>
          <Cell label="error"><UploadV2 error onSelect={() => {}} /></Cell>
          <Cell label="disabled"><UploadV2 disabled /></Cell>
          <div className="flex flex-col gap-3">
            <UploadFile name="Документ 1" meta="PDF · 1 MB" onEdit={() => {}} onDelete={() => {}} />
            <UploadFile name="Документ 2" progress={35} onPause={() => {}} onDelete={() => {}} />
            <UploadFile name="Документ 3" progress={75} onPause={() => {}} onDelete={() => {}} />
            <Text variant="caption" tone="subtle">UploadFile — готово / загрузка</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
