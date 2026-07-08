"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Text } from "@/components/ds";
import { ArrowLeftIcon } from "@/components/app/app-icons";
import { serviceName } from "@/components/app/service-details";

/**
 * Чат с сервисом (Figma 7009:573525 → 7009:573547).
 * Входящее сообщение менеджера уже в чате; тап по нижнему инпуту отправляет
 * заготовленный ответ (появляется синий пузырь). «Назад» → список сервисов.
 */
const MANAGER_MSG =
  "Здравствуйте! В течении 24 часов ваша заявка на удаление будет рассмотрена и данные будут удалены.\n\nВ случае если возникнут дополнительные вопросы мы с вами свяжемся в этом чате";

const REPLY_MSG =
  "Здравствуйте! Хорошо. Спасибо за оперативную работу вашей команды!";

export default function ServiceChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      {/* Шапка чата: назад · аватар · имя/роль */}
      <header className="flex shrink-0 items-center gap-3 bg-surface px-3 pt-11 pb-2 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          aria-label="Назад"
          onClick={() => router.push("/app")}
          className="flex size-8 items-center justify-center text-foreground-muted"
        >
          <ArrowLeftIcon width={24} height={24} />
        </button>
        <span className="size-9 shrink-0 rounded-full bg-[#b4b4b4]" />
        <div className="min-w-0">
          <Text variant="p2-medium" as="div">
            {serviceName(id)}
          </Text>
          <Text variant="caption" tone="subtle" as="div">
            менеджер
          </Text>
        </div>
      </header>

      <main className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <Text
          variant="caption"
          tone="subtle"
          as="div"
          className="text-center uppercase"
        >
          2 нояб. в 12.22
        </Text>

        <div className="max-w-[80%] whitespace-pre-line rounded-[10px] rounded-tl-[2px] bg-surface-muted px-3.5 py-2.5">
          <Text variant="p2">{MANAGER_MSG}</Text>
        </div>

        {sent && (
          <div className="ml-auto max-w-[80%] rounded-[10px] rounded-tr-[2px] bg-primary px-3.5 py-2.5">
            <Text variant="p2" className="text-[#fff]">
              {REPLY_MSG}
            </Text>
          </div>
        )}
      </main>

      {/* Нижний инпут: тап отправляет заготовленный ответ */}
      <button
        type="button"
        onClick={() => setSent(true)}
        className="flex shrink-0 items-center gap-3 border-t border-border bg-surface px-4 py-3 text-left"
      >
        <PaperclipIcon />
        <Text variant="p2" tone="subtle">
          Написать сообщение
        </Text>
      </button>
    </div>
  );
}

function PaperclipIcon() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-foreground-subtle"
    >
      <path
        d="M21 11.5l-8.5 8.5a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10 16a1.5 1.5 0 0 1-2-2l7-7"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
