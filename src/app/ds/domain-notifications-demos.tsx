"use client";

/**
 * Демка DomainNotifications (панель уведомлений домена) для витрины /ds.
 * Источник: Figma «UI фичи» / notification (217:41729).
 */
import { DomainNotifications } from "@/components/ds";

export function DomainNotificationsDemos() {
  return (
    <div className="flex flex-wrap gap-4">
      <DomainNotifications />
    </div>
  );
}
