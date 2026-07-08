"use client";

/**
 * Демки QuestionCard (композит) для витрины /ds.
 * Источник: Figma «UI фичи» / Questions (903:85344, 903:85253, 1991:201794).
 */
import { Button, QuestionCard } from "@/components/ds";

const BODY =
  "Тут описание вопроса, выносимый на голосование, варианты ответов, возможные значения для кастомизации вопроса, срок вступления решения в силу.";

export function QuestionCardDemos() {
  return (
    <div className="flex max-w-[966px] flex-col gap-6">
      {/* L — закрыта (заблокирована) + раскрыта (можно отправить) */}
      <div className="flex flex-col gap-4">
        <QuestionCard title="Изменить управляющего" icon="lock" />
        <QuestionCard
          title="Изменить управляющего"
          icon="share"
          defaultOpen
          footer={
            <Button variant="secondary" size="s">
              Подробнее
            </Button>
          }
        >
          {BODY}
          <br />
          Пример: Назначить нового управляющего в кооперативе. Вопрос вступает в
          силу не ранее 7 дней после окончания голосования.
        </QuestionCard>
      </div>

      {/* S — компактная */}
      <div className="max-w-[400px]">
        <QuestionCard size="s" title="Заголовок" defaultOpen>
          Тут описание вопроса, выносимый на голосование, варианты ответов,
          возможные значения для кастомизации вопроса, срок вступления решения в
          силу
        </QuestionCard>
      </div>
    </div>
  );
}
