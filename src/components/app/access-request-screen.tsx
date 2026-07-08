"use client";

import { useMemo, useState } from "react";
import { Button, Checkbox, Text } from "@/components/ds";
import { ChevronRightIcon } from "@/components/app/app-icons";
import { SERVICE_ACCESS, defaultSelection } from "@/components/app/service-access";

/**
 * Экран запроса доступа сервиса к персональным данным (Figma 7009:573389).
 * Два режима нижних кнопок:
 *   grant — «Отклонить» / «Предоставить» (обе активны);
 *   edit  — одна кнопка «Предоставить» на всю ширину, заблокирована, пока
 *           пользователь не снимет хотя бы одну галочку.
 * DS: Text, Checkbox, Button. Список полей — из SERVICE_ACCESS.
 */
export function AccessRequestScreen({
  serviceName,
  mode,
  onDecline,
  onSubmit,
}: {
  serviceName: string;
  mode: "grant" | "edit";
  onDecline?: () => void;
  onSubmit: (selected: Record<string, boolean>) => void;
}) {
  const initial = useMemo(() => defaultSelection(), []);
  const [selected, setSelected] = useState<Record<string, boolean>>(initial);

  const toggle = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  // В режиме edit кнопка доступна только если состояние отличается от исходного.
  const changed = useMemo(
    () => Object.keys(initial).some((k) => initial[k] !== selected[k]),
    [initial, selected],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="shrink-0 bg-surface px-4 pt-11 pb-3">
        <Text variant="h4" as="h1">
          {serviceName} запрашивает доступ к вашим данным
        </Text>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        {SERVICE_ACCESS.map((basis) => (
          <div key={basis.id}>
            <div className="flex items-center justify-between px-4 py-3">
              <Text variant="caption" tone="subtle">
                {basis.caption}
              </Text>
              <ChevronRightIcon className="text-foreground-subtle" />
            </div>
            {basis.groups.map((group) => (
              <div key={group.id}>
                <div className="bg-[#c4c4c4] px-4 py-2">
                  <Text
                    variant="caption-medium"
                    className="text-[#fff]"
                    as="div"
                  >
                    {group.doc}
                  </Text>
                </div>
                {group.fields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => toggle(field.id)}
                    className="flex w-full items-center justify-between border-b border-border px-4 py-4 text-left"
                  >
                    <Text variant="p2">{field.label}</Text>
                    <span className="pointer-events-none flex items-center">
                      <Checkbox
                        size="xs"
                        checked={!!selected[field.id]}
                        readOnly
                        tabIndex={-1}
                      />
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </main>

      <div className="shrink-0 px-4 pt-6 pb-6">
        {mode === "grant" ? (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="m"
              fullWidth
              className="uppercase"
              onClick={onDecline}
            >
              Отклонить
            </Button>
            <Button
              variant="primary"
              size="m"
              fullWidth
              className="uppercase"
              onClick={() => onSubmit(selected)}
            >
              Предоставить
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            size="m"
            fullWidth
            className="uppercase"
            disabled={!changed}
            onClick={() => onSubmit(selected)}
          >
            Предоставить
          </Button>
        )}
      </div>
    </div>
  );
}
