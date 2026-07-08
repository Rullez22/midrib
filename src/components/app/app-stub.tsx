import { Text } from "@/components/ds";

/**
 * AppStub — заглушка раздела мобильной апки (для нижней навигации,
 * пока экраны не присланы). Убираем по мере наполнения флоу.
 */
export function AppStub({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
      <Text variant="h5">{title}</Text>
      <Text variant="p2" tone="muted" className="max-w-[240px]">
        Раздел в разработке — ждём экраны.
      </Text>
    </div>
  );
}
