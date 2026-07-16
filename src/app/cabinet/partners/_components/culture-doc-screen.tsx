"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Textarea, Modal, Link, TableHeader, Banner } from "@/components/ds";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { CompanySidebar } from "../../[company]/_components/company-sidebar";
import { type CabinetConfig } from "../../[company]/_config/cabinets";
import { BlockchainCard, type TxRow } from "../../document/_components/document-shared";
import { type Org, type OrgDoc } from "./partners-data";
import { AttachedDoc, Field, PublicationForm, ExtIcon, BackIcon, CloseIcon } from "./org-contract-screen";

/**
 * CultureDocScreen — исключение для партнёра «Живу с Культурой», «Договор на
 * организацию выставки»:
 * флоу «Оценка и закрытие договора» (Figma 6760-501003 … 501941).
 *   Ожидает участия → (открыт) Оценка: 2 карточки участников со звёздами и
 *   отзывом; «Оставить отзыв» → попап (DS Modal). Как только оставлены 2
 *   отзыва → через 3с статус «Закрыт» (серый) + инфо-баннер, поля/кнопки
 *   добавления убраны, остаётся Публикация с лентой.
 * Звёзды кликабельные. Reuse: OrgContractScreen-хелперы + DS.
 */

const PARTICIPANTS = [
  { key: "dari", name: "Фонд «Дари добро»", logo: "ДАРИ ДОБРО", color: "#f2b705", orgId: "dari" },
  { key: "executor", name: "ИП Слоненок", logo: "ИП Слоненок", color: "#242b32", orgId: undefined as string | undefined },
];
const SERVICES =
  "Участник договора: согласование условий, подписание документов, приёмка работ по этапам и сверка взаиморасчётов по проекту.";

/** Готовые (заранее закрытые) документы под договором — таблица в «Закрыт». */
const CLOSED_DOCS = [
  { type: "Акт выполненных работ", name: "Акт приёмки монтажа выставочных конструкций", amount: "118 600 ₽", status: "Согласован" },
  { type: "Акт выполненных работ", name: "Акт приёмки оформления экспозиции", amount: "95 400 ₽", status: "Согласован" },
  { type: "Счет на оплату", name: "Счёт за аренду выставочного зала", amount: "73 200 ₽", status: "Оплачено" },
  { type: "Счет на оплату", name: "Счёт за печать афиш и каталогов", amount: "84 300 ₽", status: "Оплачено" },
  { type: "Счет на оплату", name: "Счёт за монтаж освещения экспозиции", amount: "56 500 ₽", status: "Оплачено" },
];

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="inline-flex items-center gap-1.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= (hover || value);
        return (
          <button key={n} type="button" onClick={() => onChange(n)} onMouseEnter={() => setHover(n)} aria-label={`Оценка ${n} из 5`} className="transition-transform hover:scale-110">
            <svg viewBox="0 0 20 20" className="size-6" fill={active ? "#f5b301" : "var(--color-grey-100)"}>
              <path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
            </svg>
          </button>
        );
      })}
    </span>
  );
}

function ParticipantLogo({ logo, color }: { logo: string; color: string }) {
  return (
    <span className="flex size-[130px] shrink-0 items-center justify-center rounded-[6px] border border-border bg-[#fff] p-2 text-center" style={{ color }}>
      <span className="ds-p1-medium leading-tight">{logo}</span>
    </span>
  );
}

/** Карточка участника с оценкой и отзывом. */
function ReviewCard({ p, onSubmit, onDetails }: { p: (typeof PARTICIPANTS)[number]; onSubmit: () => void; onDetails?: () => void }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const valid = rating > 0 && text.trim() !== "";
  return (
    <div className="flex flex-col gap-6 rounded-[4px] border border-border p-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <ParticipantLogo logo={p.logo} color={p.color} />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <span className="ds-p1-medium text-foreground">{p.name}</span>
          <p className="ds-p3 text-foreground-subtle">{SERVICES}</p>
          <Button variant="secondary" size="s" className="w-fit" disabled={!onDetails} onClick={onDetails}>Подробнее об участнике</Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="ds-p2 text-foreground">Пожалуйста, поставьте оценку от 1 до 5</span>
          <StarInput value={rating} onChange={setRating} />
        </div>
        <Textarea placeholder="Расскажите о работе с данным участником*" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        <Button size="l" className="w-fit" disabled={!valid} onClick={onSubmit}>Оставить отзыв</Button>
      </div>
    </div>
  );
}

function ClosedDocsTable() {
  return (
    <div className="overflow-hidden rounded-[4px] border border-border">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <span className="ds-p2-medium text-foreground">Документы</span>
        <Button size="s">Добавить документ</Button>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <TableHeader size="s" tone="muted" columns={[
          { key: "type", label: "Тип документа", flex: 2.4 },
          { key: "amount", label: "Сумма", flex: 1.2, align: "center" },
          { key: "status", label: "Статус", flex: 1.4, align: "center" },
          { key: "date", label: "Дата", flex: 1, align: "right" },
        ]} />
        {CLOSED_DOCS.map((d, i) => (
          <div key={i} className="ds-row flex items-center gap-2 rounded-[4px] border border-border bg-surface px-6 py-3">
            <div className="flex flex-[2.4] flex-col gap-0.5">
              <span className="ds-caption text-foreground-subtle">{d.type}</span>
              <span className="ds-p3 text-foreground">{d.name}</span>
            </div>
            <div className="ds-p3 flex-[1.2] text-center text-foreground">{d.amount}</div>
            <div className="flex flex-[1.4] justify-center"><Badge variant="soft" color="green">{d.status}</Badge></div>
            <div className="ds-p3 flex-1 text-right text-foreground">08.03.2025</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CultureDocScreen({ org, doc, cabinet }: { org: Org; doc: OrgDoc; docId: string; cabinet?: CabinetConfig }) {
  const router = useRouter();
  const { cultureReviews, cultureClosed, startCultureReview, addCultureReview } = useRegFlow();
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [modalFor, setModalFor] = useState<string | null>(null);

  // Открытие документа = начало оценки (статус «Оценка»).
  useEffect(() => { startCultureReview(); }, [startCultureReview]);

  const back = () => router.push(cabinet ? `/cabinet/${cabinet.slug}/partners/org/${org.id}` : `/cabinet/partners/org/${org.id}`);
  const status = cultureClosed ? "Закрыт" : "Оценка";

  const tx: TxRow[] = [
    { action: "Подпись менеджера", party: "Культурой", date: "08.03.2025 - 13:00" },
    { action: "Подпись валидатора", party: "MIDHUB", date: "08.03.2025 - 12:00" },
    { action: "Подпись исполнителя", party: "Elephant", date: "08.03.2025 - 11:20" },
    { action: "Добавление договора", party: "Elephant", date: "08.03.2025 - 11:00" },
  ];

  const confirmReview = () => {
    if (modalFor) { setReviewed((r) => ({ ...r, [modalFor]: true })); addCultureReview(); }
    setModalFor(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {cabinet ? <CompanySidebar cabinet={cabinet} current="partners" /> : null}

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-6 md:px-[50px]">
          <div className="relative flex min-h-[40px] items-center">
            <button type="button" aria-label="Назад" onClick={back} className="flex size-10 items-center justify-center rounded-[6px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground">
              <BackIcon />
            </button>
            <button type="button" aria-label="Закрыть" onClick={back} className="ml-auto flex size-10 items-center justify-center rounded-[6px] border border-[color:var(--color-red-200)] bg-[color:var(--color-red-50,#fdeceb)] text-[color:var(--color-red-500)] transition-colors hover:bg-[color:var(--color-red-100,#f9d5d2)]">
              <CloseIcon />
            </button>
          </div>

          {/* Карточка договора: статус Оценка/Закрыт. */}
          <div className="overflow-hidden rounded-[4px] border border-border">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
              <span className="ds-p1-medium text-foreground">{doc.name}</span>
              <span className="ds-p2-medium text-foreground">{doc.amount}</span>
              <Badge variant="soft" color={cultureClosed ? "grey" : "orange"}>{status}</Badge>
              <span className="ds-p3 text-foreground-subtle">{doc.date}</span>
            </div>
            <div className="flex flex-col gap-6 border-b border-border p-6 md:flex-row">
              <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Заказчик" value={<span className="inline-flex items-center gap-1 text-primary">{org.name}<ExtIcon /></span>} />
                <Field label="Исполнитель" value="ИП Слоненок" />
                <Field label="Номер" value="31132" />
                <Field label="Код" value="342" />
                <Field label="Комментарии" value="—" />
              </div>
              <AttachedDoc name="Договор с фондом" meta="PDF · 1 MB" />
            </div>
            <BlockchainCard rows={tx} className="rounded-none border-0" />
          </div>

          {cultureClosed ? (
            /* Закрыт: инфо-баннер + документы + публикация. */
            <>
              <Banner tone="info" title="Обратите внимание !">
                Уважаемый пользователь, данный договор был закрыт. Но вы также можете вести свою деятельность, добавлять неизбежные документы, опубликовывать текстовые и медиа посты посвященные вашей деятельности в рамках данного документа.
              </Banner>
              <ClosedDocsTable />
              <PublicationForm />
            </>
          ) : (
            /* Оценка: баннер + заголовок + карточки участников. */
            <>
              {cultureReviews >= 2 ? (
                <Banner tone="caution" title="Обратите внимание !">
                  Уважаемый пользователь, Спасибо за вашу оценку. Данный договор находится в статусе «Оценка», это означает что участники договора оценивают друг друга и менеджер фонда в скором времени должен закрыть договор. Но, вы также можете вести свою деятельность в рамках данного документа.
                </Banner>
              ) : (
                <Banner tone="warning" title="Обратите внимание !">
                  Уважаемый пользователь, менеджер фонда запустил процесс оценки и закрытия договора. Вам необходимо оценить работу участников участвовавших в данном договоре, для того чтобы менеджер фонда благополучно закрыл договор.
                </Banner>
              )}
              <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="ds-h5 text-foreground">Оценка и закрытие договора</h2>
                <p className="ds-p3 text-foreground-subtle">
                  Для того чтобы менеджер фонда полностью закрыл договор, вам необходимо оценить работу участников.
                </p>
                <span className="ds-caption mt-2 uppercase tracking-wide text-foreground-subtle">Оцените работу участников</span>
              </div>
              {PARTICIPANTS.filter((p) => !reviewed[p.key]).map((p) => (
                <ReviewCard
                  key={p.key}
                  p={p}
                  onSubmit={() => setModalFor(p.key)}
                  onDetails={p.orgId && cabinet ? () => router.push(`/cabinet/${cabinet.slug}/partners/org/${p.orgId}`) : undefined}
                />
              ))}
            </>
          )}

          <div className="mt-2 flex flex-col gap-5">
            <h2 className="ds-h5 text-foreground">Процесс исполнения договора</h2>
          </div>
        </div>
      </main>

      {/* Попап подтверждения отзыва в блокчейн (DS Modal). */}
      <Modal
        open={modalFor != null}
        onClose={() => setModalFor(null)}
        size="m"
        title="Подтвердить ваши действия в блокчейн ?"
        footer={<Button size="l" onClick={confirmReview}>Подтвердить действие</Button>}
      >
        <div className="flex flex-col items-center gap-6">
          <p className="ds-p3 text-center text-foreground-subtle">При оставлении отзыва ваши действия сохраняться в блокчейн</p>
          <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-[4px] bg-surface-sunken px-4 py-3">
            <span className="ds-caption text-foreground-subtle">Оставление отзыва</span>
            <span className="ds-p3-medium flex items-center gap-1.5 text-primary">🐘 Elephant</span>
            <Link href="#" size="p3">xxxxxxx… xxxxx</Link>
            <span className="ds-p3 text-foreground-subtle">08.03.2025 - 15:00</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
