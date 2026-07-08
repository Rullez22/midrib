"use client";

/**
 * Демки «Требование (шаблон)» — полная карточка требования валидатора для витрины /ds.
 * Источник: Figma «UI фичи» / требования шаблон (449:116800, 452:78666, 455:78802,
 * 455:79134, 452:78671, 452:78712).
 * 100% reuse: QuestionCard + Badge + Item. Новых компонентов нет.
 */
import { QuestionCard, Badge, Item } from "@/components/ds";

function ReqTitle({ text, color, label }: { text: string; color: "orange" | "green"; label: string }) {
  return (
    <span className="flex w-full items-center justify-between gap-2">
      <span style={{ color: "var(--color-blue-midhub-500)" }}>{text}</span>
      <Badge color={color}>{label}</Badge>
    </span>
  );
}

function ReqBody() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="ds-p3 text-foreground-subtle">Описание</span>
        <span className="ds-p3 text-foreground">
          Данные требования распространяются на документы категории «удостоверяющие личность» в РФ.
          Проверка таких документов может проводиться только нотариусами РФ, имеющими гражданство РФ.
        </span>
        <span className="ds-p3 text-foreground">Тип проверки — дистанционно.</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="ds-p3-medium text-foreground">Тип верификации для документов, подтверждающих соответствие требованиям</span>
        <div className="flex items-center gap-3">
          <span className="ds-p3 text-foreground-subtle">Международный:</span>
          <Badge color="orange">Жёлтый</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="ds-p3-medium text-foreground">Документы, подтверждающие соответствие верификациям</span>
        <Item tone="muted" bordered={false} size="s">Паспорт</Item>
        <Item tone="muted" bordered={false} size="s">Удостоверение нотариуса РФ</Item>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-col gap-0.5"><span className="ds-caption text-foreground-subtle">Выдано</span><span className="ds-p3 text-foreground">0$</span></div>
        <div className="flex flex-col gap-0.5"><span className="ds-caption text-foreground-subtle">Использование</span><span className="ds-p3 text-foreground">3$</span></div>
        <div className="flex flex-col gap-0.5"><span className="ds-caption text-foreground-subtle">Стоимость</span><span className="ds-p3 text-foreground">3$</span></div>
      </div>
    </div>
  );
}

export function RequirementTemplateDemos() {
  return (
    <div className="flex max-w-[864px] flex-col gap-3">
      <QuestionCard size="s" defaultOpen title={<ReqTitle text="Для документов об образовании" color="orange" label="Жёлтый" />}>
        <ReqBody />
      </QuestionCard>
      <QuestionCard size="s" title={<ReqTitle text="Для документов об аттестации" color="green" label="Зелёный" />} />
    </div>
  );
}
