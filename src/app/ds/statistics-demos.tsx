"use client";

/**
 * Демки «Статистика — Отчётность и Партнёры» для витрины /ds.
 * Источник: Figma «UI фичи» — секции дашбордов (header date & history, Header
 * information, Tabs midhub, Graph partner, транзакции-*, table, Статьи,
 * Источники поступлений, footer …).
 * Reuse: Tabs, TableHeader, Badge, Combobox, Button, QuestionCard, Link + новые
 * композиты StatSummary / ReportPeriodBar / TransactionsTable / LineChart /
 * AccountCharacteristics / ArticlesTable / IncomeSources / ReportFooter.
 */
import {
  StatSummary,
  ReportPeriodBar,
  TransactionsTable,
  LineChart,
  AccountCharacteristics,
  ArticlesTable,
  IncomeSources,
  ReportFooter,
  Tabs,
  Tab,
  type Transaction,
} from "@/components/ds";

const PERIOD = "15 декабря 2019 - 22 декабря 2019";

const GRAPH_POINTS = [
  { label: "Авг 2018", value: 150 },
  { label: "Сен 2018", value: 205 },
  { label: "Окт 2018", value: 175 },
  { label: "Ноя 2018", value: 150 },
  { label: "Дек 2018", value: 200 },
  { label: "Янв 2019", value: 223 },
  { label: "Фев 2019", value: 180 },
  { label: "Мар 2019", value: 210 },
  { label: "Апр 2019", value: 295 },
  { label: "Май 2019", value: 180 },
];

const TX: Transaction[] = [
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счёт на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счёт на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "216", color: "purple", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Взносы и целевые поступления", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "215", color: "green", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Поступления с маршрутных счетов", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
];

const ARTICLE_COLS = [
  { key: "name", label: "Статья", flex: 2 },
  { key: "code", label: "Код", align: "center" as const },
  { key: "count", label: "Кол-во", align: "center" as const },
  { key: "sum", label: "Сумма", align: "center" as const },
  { key: "total", label: "Итого", align: "center" as const },
];

export function StatisticsDemos() {
  return (
    <div className="flex flex-col gap-12">
      {/* ── Партнёры ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <span className="ds-caption-up text-foreground-subtle">Дашборд «Партнёры»</span>

        <ReportPeriodBar period={PERIOD} />

        <StatSummary
          items={[
            { label: "Ваш оборот с компанией", value: "1000 ETH" },
            { label: "Поступило за период", value: "97 ETH" },
            { label: "Расходы за период", value: "518 ETH" },
          ]}
        />

        <Tabs defaultValue="all" variant="basic" size="m" aria-label="Транзакции">
          <Tab value="all">Все транзакции</Tab>
          <Tab value="in">Входящие</Tab>
          <Tab value="out">Исходящие</Tab>
        </Tabs>

        <div className="rounded-[8px] border border-border bg-white p-5">
          <LineChart unit="ETH" yTicks={[100, 150, 200, 300]} points={GRAPH_POINTS} highlightIndex={5} />
        </div>

        <TransactionsTable transactions={TX} />
      </div>

      {/* ── Отчётность ───────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <span className="ds-caption-up text-foreground-subtle">Дашборд «Отчётность»</span>

        <StatSummary
          items={[
            { label: "Поступило за период", value: "1 000 ETH" },
            { label: "Израсходовано", value: "230 ETH" },
            { label: "Остаток", value: "770 ETH" },
          ]}
        />

        <AccountCharacteristics
          title="Характеристики целевого счёта"
          rows={[
            { cells: [
              { label: "Наименование счёта", value: "Целевой" },
              { label: "Тип счёта", value: "Матрёшка" },
            ] },
            { label: "Коды ОКВЭД", value: [
              "81.22 — Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая",
              "81.29.1 — Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования",
              "81.30 — Предоставление услуг по благоустройству ландшафта",
            ] },
            { label: "Назначение счёта", value: "Данный счёт является основным расчётным счётом кооператива. Неделимый фонд. На него поступают все членские и целевые взносы." },
            { label: "Источник поступлений", value: "Целевые и членские взносы от пайщиков. Никакие другие платежи не принимаются." },
            { label: "Распределение целевого счёта и подсчётов", value: [
              "30% — Целевой счёт",
              "20% — Счёт инвестиционных токенов",
              "20% — Счёт управляющих токенов",
              "20% — Маршрутный счёт",
              "10% — Маркетинговый счёт",
            ] },
          ]}
        />

        <IncomeSources
          rows={[
            { account: "Целевой счёт", color: "green", description: "Взносы и иные целевые поступления", code: "214", value: "10" },
            { account: "Маршрутный счёт", color: "cyan", description: "Прибыль с направлений", code: "216", value: "22" },
            { account: "Бронжс", color: "purple", description: "Прибыль от предпринимательской и иной деятельности", code: "215", value: "4" },
          ]}
        />

        <ArticlesTable
          columns={ARTICLE_COLS}
          rows={[
            { cells: ["Счёт инвестиционных токенов", "214", "20", "400", "400"], onDetail: () => {} },
            { cells: ["Счёт управляющих токенов", "214", "20", "400", "400"], onDetail: () => {} },
            { cells: ["Маршрутный счёт", "214", "20", "400", "400"], onDetail: () => {} },
            { cells: ["Маркетинговый счёт", "214", "20", "400", "400"], onDetail: () => {} },
          ]}
          total={{ label: "Итого", cells: ["", "70", "1 000", "230"] }}
        />

        <ReportFooter period={PERIOD} total="1 120" />
      </div>
    </div>
  );
}
