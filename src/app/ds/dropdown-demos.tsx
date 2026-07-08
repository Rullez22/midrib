"use client";

import { Button, Dropdown, DropdownChevron } from "@/components/ds";

const ITEMS = [
  { value: "edit", label: "Редактировать" },
  { value: "copy", label: "Дублировать" },
  { value: "share", label: "Поделиться" },
  { value: "del", label: "Удалить", disabled: true },
];

function IconMore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="19" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Кнопка-триггеры (Dropdown=Button). */
export function ButtonDropdownDemos() {
  return (
    <>
      <Dropdown
        aria-label="Действия"
        items={ITEMS}
        trigger={({ open }) => (
          <Button variant="primary" iconRight={<DropdownChevron open={open} />}>Действия</Button>
        )}
      />
      <Dropdown
        aria-label="Меню"
        items={ITEMS}
        trigger={({ open }) => (
          <Button variant="secondary" size="m" iconRight={<DropdownChevron open={open} />}>Меню</Button>
        )}
      />
    </>
  );
}

/** Иконка-триггеры (Dropdown=Icon). */
export function IconDropdownDemos() {
  return (
    <div className="flex items-center gap-3">
      <Dropdown aria-label="Ещё" items={ITEMS} trigger={<Button variant="ghost" icon={<IconMore />} aria-label="Ещё" />} />
      <Dropdown aria-label="Ещё" align="end" items={ITEMS} trigger={<Button variant="ghost" size="m" icon={<IconMore />} aria-label="Ещё" />} />
      <Dropdown aria-label="Ещё" items={ITEMS} trigger={<Button variant="ghost" size="s" icon={<IconMore />} aria-label="Ещё" />} />
    </div>
  );
}
