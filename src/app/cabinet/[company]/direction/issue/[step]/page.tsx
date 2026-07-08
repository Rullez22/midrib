import { renderIssueStep, ISSUE_TOTAL } from "../_components/issue-flow";

/**
 * Под-флоу «Выдача диплома» (ВУЗы) — kind="diploma" (все основания на форме).
 * Запускается с экрана «Направление» по «Выдать диплом».
 * Источник Figma: 6970:552156 (интро) … 6970:556018 (цикл выдачи диплома).
 */

export function generateStaticParams() {
  return Array.from({ length: ISSUE_TOTAL }, (_, i) => ({ step: String(i + 1) }));
}

export default async function DiplomaIssueStep({
  params,
}: {
  params: Promise<{ company: string; step: string }>;
}) {
  const { company, step } = await params;
  return renderIssueStep({ company, kind: "diploma", raw: step });
}
