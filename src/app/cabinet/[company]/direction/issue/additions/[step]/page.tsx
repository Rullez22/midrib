import { renderIssueStep, ISSUE_TOTAL } from "../../_components/issue-flow";

/**
 * Под-флоу «Внести дополнения» (ВУЗы) — kind="additions". Практически тот же флоу,
 * что «Выдача диплома», но на экране формы регистрации доступно только одно
 * основание (singleBasis). Запускается с «Направление» по «Внести дополнения».
 * Лежит под issue/layout.tsx → разделяет RegFlowProvider.
 */

export function generateStaticParams() {
  return Array.from({ length: ISSUE_TOTAL }, (_, i) => ({ step: String(i + 1) }));
}

export default async function AdditionsIssueStep({
  params,
}: {
  params: Promise<{ company: string; step: string }>;
}) {
  const { company, step } = await params;
  return renderIssueStep({ company, kind: "additions", raw: step });
}
