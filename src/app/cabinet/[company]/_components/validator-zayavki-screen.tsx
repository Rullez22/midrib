"use client";

import { type ReactNode, useRef, useState } from "react";
import {
  Button,
  Dropdown,
  Tabs,
  Tab,
  TagInput,
  Item,
  Checkbox,
  Link,
  QuestionCard,
  EmptyState,
} from "@/components/ds";
import {
  DefTable,
  DocThumb,
  BackHeader,
  BlockchainCard,
  VerificationBadge,
  ChatPanel,
  VERIFY_ORANGE,
  type DefRow,
  type TxRow,
} from "../../document/_components/document-shared";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * ValidatorZayavkiScreen — «Заявки» кабинета №2 (Валидатор), раздел /zayavki.
 * Пустое состояние выбора заявок с двумя интерактивами:
 *   • первый таб — селектор типа лицензии (Dropdown с цветными кружками,
 *     у выбранной — галочка; подпись таба меняется);
 *   • кнопка «Реестры» раскрывает пикер реестров снизу — DS TagInput в режиме
 *     выбора из пула (options): чипы + «+»/Dropdown оставшихся стран.
 *
 * Источник Figma: 6722-376372 (база) · 376454 (дропдаун лицензии) ·
 * 376569 (инпут реестров) · 376620/376581/376593 (пикер стран).
 *
 * Reuse DS — ничего не верстаем заново: CompanySidebar (левое меню валидатора) ·
 * Tabs-стили (ds-tabs--solid-light) · Dropdown · TagInput (select) · Button · EmptyState ·
 * иллюстрация public/illustrations/request.svg.
 */

type TabKey = "license" | "employees" | "processing";

const LICENSES: { value: string; label: string; dot: string }[] = [
  { value: "yellow", label: "Заявки на желтую лицензию", dot: "#edd65d" },
  { value: "green", label: "Заявки на зеленую лицензию", dot: "#9ed89f" },
  { value: "ruswan", label: "Заявки от платформы Ruswan", dot: "#5a646e" },
];

/** Пул реестров для пикера (мок). */
const REGISTRIES = ["Канада", "Россия", "Казахстан", "Франция"];

// ── Иконки ───────────────────────────────────────────────────────────────────
/** Цветной кружок-статус лицензии; у выбранной — белая галочка внутри. */
function LicenseDot({ color, checked }: { color: string; checked: boolean }) {
  return (
    <span
      className="inline-flex size-4 items-center justify-center rounded-full"
      style={{ backgroundColor: color }}
    >
      {checked && (
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" aria-hidden>
          <path d="M5 12.5 10 17.5 19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/** Шеврон «вниз → вверх при раскрытии». size — px. */
function Chevron({ open, size = 16 }: { open: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      className={open ? "rotate-180 transition-transform" : "transition-transform"}
    >
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Инфо-иконка в ссылке «Правила обработки заявок». */
function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

// ── Пикер реестров (DS TagInput, режим выбора из пула) ───────────────────────
function RegistryPicker() {
  return <TagInput size="m" options={REGISTRIES} addLabel="Выберите реестр" />;
}

// ── Модель заявки ────────────────────────────────────────────────────────────
type ZayavkaStatus = "new" | "signed" | "paused";
/** Данные документа заявки. Структура одинаковая, контент — из пула моков. */
type ZayavkaData = {
  docType: string;
  document: string;
  surname: string;
  firstName: string;
  patronymic: string;
  birth: string;
  gender: string;
  docNumber: string;
  authority: string;
  subdivision: string;
  issueDate: string;
};
type Zayavka = { id: number; number: string; name: string; status: ZayavkaStatus; data: ZayavkaData };

/** Пул мок-документов — на каждый «Запросить заявку» берётся следующий по кругу. */
const MOCK_DOCS: ZayavkaData[] = [
  { docType: "Паспорт РФ", document: "kwebrw", surname: "Иванов", firstName: "Иван", patronymic: "Петрович", birth: "12.01.1991", gender: "Мужской", docNumber: "1234 567890", authority: "78 ОМ Невского района Санкт-Петербурга", subdivision: "0120033", issueDate: "12.04.2002" },
  { docType: "Водительское удостоверение", document: "drv0091", surname: "Смирнова", firstName: "Анна", patronymic: "Сергеевна", birth: "03.07.1988", gender: "Женский", docNumber: "99 12 345678", authority: "ГИБДД 7704 г. Москва", subdivision: "7704", issueDate: "21.09.2019" },
  { docType: "СНИЛС", document: "snl4471", surname: "Кузнецов", firstName: "Дмитрий", patronymic: "Александрович", birth: "28.11.1995", gender: "Мужской", docNumber: "112-233-445 95", authority: "ПФР по г. Казань", subdivision: "1600", issueDate: "05.02.2012" },
  { docType: "Заграничный паспорт", document: "zgp7782", surname: "Соколова", firstName: "Мария", patronymic: "Игоревна", birth: "16.05.1990", gender: "Женский", docNumber: "75 1234567", authority: "УВМ МВД России по г. Москве", subdivision: "5000", issueDate: "30.06.2021" },
  { docType: "Военный билет", document: "mil5530", surname: "Орлов", firstName: "Сергей", patronymic: "Викторович", birth: "09.03.1993", gender: "Мужской", docNumber: "АН 7766554", authority: "Военный комиссариат г. Новосибирска", subdivision: "5400", issueDate: "14.11.2011" },
];

/**
 * Действия «Запросить заявку» + «Правила обработки заявок» (общие для двух стадий).
 * `requestVariant` — primary в пустом состоянии, secondary когда заявки уже есть.
 */
function RequestActions({
  onRequest,
  requestVariant = "primary",
}: {
  onRequest: () => void;
  requestVariant?: "primary" | "secondary";
}) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <Button variant={requestVariant} size="l" onClick={onRequest}>Запросить заявку</Button>
      <Button variant="tertiary" size="s" iconLeft={<AlertIcon />}>Правила обработки заявок</Button>
    </div>
  );
}

/** Строка-заявка (DS Item) с кнопкой «Открыть заявку». */
function ZayavkaRow({ z, onOpen }: { z: Zayavka; onOpen: (z: Zayavka) => void }) {
  return (
    <Item
      size="l"
      trailing={<Button variant="primary" size="s" onClick={() => onOpen(z)}>Открыть заявку</Button>}
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span className="ds-caption text-foreground-subtle">{z.number}</span>
        <span className="ds-p3 truncate text-foreground">{z.name}</span>
      </span>
    </Item>
  );
}

// ── Контент таба лицензии: пусто (иллюстрация) → список заявок ────────────────
function LicensePanel({
  items,
  onRequest,
  onOpen,
}: {
  items: Zayavka[];
  onRequest: () => void;
  onOpen: (z: Zayavka) => void;
}) {
  const [registriesOpen, setRegistriesOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-8 px-5 py-10 md:px-[50px]">
      {/* Шапка: заголовок по центру + «Реестры» справа */}
      <div className="relative flex min-h-[40px] flex-wrap items-center justify-center gap-3">
        <h1 className="ds-h5 text-center text-foreground">Выберите заявки для обработки</h1>
        <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
          <Button
            variant="ghost"
            size="s"
            iconRight={<Chevron open={registriesOpen} />}
            aria-pressed={registriesOpen}
            aria-expanded={registriesOpen}
            onClick={() => setRegistriesOpen((v) => !v)}
          >
            Реестры
          </Button>
        </div>
      </div>

      {registriesOpen && <RegistryPicker />}

      {items.length === 0 ? (
        /* Пустое состояние: иллюстрация + действия */
        <div className="flex flex-col items-center gap-6 pt-6 text-center">
          <img src="/illustrations/request.svg" alt="" width={132} height={132} className="select-none" draggable={false} />
          <RequestActions onRequest={onRequest} />
        </div>
      ) : (
        /* Список запрошенных заявок (DS Item) + действия снизу */
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {items.map((z) => <ZayavkaRow key={z.id} z={z} onOpen={onOpen} />)}
          </div>
          <RequestActions onRequest={onRequest} requestVariant="secondary" />
        </div>
      )}
    </div>
  );
}

// ── Таб «В обработке»: подтабы Приостановленные / Ожидают подписания ──────────
type ProcTab = "paused" | "awaiting";
function ProcessingPanel({
  paused,
  awaiting,
  procTab,
  onProcTab,
  onOpen,
}: {
  paused: Zayavka[];
  awaiting: Zayavka[];
  procTab: ProcTab;
  onProcTab: (t: ProcTab) => void;
  onOpen: (z: Zayavka) => void;
}) {
  const list = procTab === "paused" ? paused : awaiting;
  return (
    <div className="flex w-full flex-col gap-8 px-5 py-10 md:px-[50px]">
      <div className="flex justify-center">
        <Tabs value={procTab} onValueChange={(v) => onProcTab(v as ProcTab)} variant="solid" size="m" aria-label="Статус обработки">
          <Tab value="paused">Приостановленные ({paused.length})</Tab>
          <Tab value="awaiting">Ожидают подписания ({awaiting.length})</Tab>
        </Tabs>
      </div>
      {list.length === 0 ? (
        <EmptyState title="Здесь пока пусто" className="py-16" />
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((z) => <ZayavkaRow key={z.id} z={z} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  );
}

// ── Зелёная отметка «Паспорт отвалидирован» (стадия signed) ───────────────────
function ValidatedNote() {
  return (
    <div className="flex items-center justify-center gap-2 border-t border-border bg-[var(--color-grey-10)] px-6 py-4">
      <span className="flex size-5 items-center justify-center rounded-full bg-[var(--color-green-300)] text-[#fff]" aria-hidden>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span className="ds-p3 text-foreground">Паспорт отвалидирован</span>
    </div>
  );
}

// ── Детальное окно заявки (валидатор) ────────────────────────────────────────
function ZayavkaDetail({
  tabBar,
  zayavka,
  onBack,
  onSign,
  onPause,
  onReject,
}: {
  tabBar: ReactNode;
  zayavka: Zayavka;
  onBack: () => void;
  onSign: () => void;
  onPause: () => void;
  onReject: () => void;
}) {
  // Для «new» чекбокс гейтит «Подписать» и добавляет 2-е сообщение в чат.
  // Для signed/paused заявка уже обработана — считаем согласие данным.
  const editable = zayavka.status === "new";
  const [agreed, setAgreed] = useState(!editable);

  const d = zayavka.data;
  const fields: DefRow[] = [
    { label: "Тип верификации", value: <VerificationBadge label="Международный" color={VERIFY_ORANGE} /> },
    { label: "Документ", value: d.document },
    { label: "Фамилия", value: d.surname },
    { label: "Имя", value: d.firstName },
    { label: "Отчество", value: d.patronymic },
    { label: "Дата рождения", value: d.birth },
    { label: "Пол", value: d.gender },
    { label: "Номер документа", value: d.docNumber },
    { label: "Орган выдавший документ", value: d.authority },
    { label: "Код подразделения", value: d.subdivision },
    { label: "Дата выдачи", value: d.issueDate },
    { label: "Прикрепленные документы", value: <DocThumb /> },
  ];

  const TX_SEND: TxRow = { action: "Отправка валидатору", party: 'ООО "Сапфир"', date: "11.01.2020 - 11:00" };
  const TX_SIGN: TxRow = { action: "Подпись валидатора", party: 'ООО "Слон"', date: "11.01.2020 - 11:00" };
  const txRows: TxRow[] = zayavka.status === "signed" ? [TX_SIGN, TX_SEND] : [TX_SEND];

  const messages = agreed
    ? [
        { text: "Приветствую. Проверьте пожалуйста!", time: "12:05" },
        { me: true, text: "Привет, хорошо. Все сделаю.", time: "12:50" },
      ]
    : [{ text: "Приветствую. Проверьте пожалуйста!", time: "12:05" }];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {tabBar}
      <main className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
        <BackHeader onBack={onBack} />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="min-w-0 flex-1">
            <QuestionCard title={zayavka.name} defaultOpen>
              <div className="-mx-[23px] -mb-5 -mt-4">
                <DefTable rows={fields} flush />
                {zayavka.status === "signed" ? (
                  <ValidatedNote />
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-4">
                    <Checkbox
                      size="xs"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      label={
                        <span className="ds-p3">
                          Согласен с <Link href="#" size="p3">правилами обработки документов</Link>
                        </span>
                      }
                    />
                    <div className="flex items-center gap-3">
                      <Button variant="negative-sec" size="m" onClick={onReject}>Отклонить</Button>
                      <Button variant="secondary" size="m" disabled={zayavka.status === "paused"} onClick={onPause}>Приостановить</Button>
                      <Button variant="primary" size="m" disabled={!agreed} onClick={onSign}>Подписать</Button>
                    </div>
                  </div>
                )}
              </div>
            </QuestionCard>
          </div>
          <ChatPanel messages={messages} />
        </div>
        <BlockchainCard rows={txRows} />
      </main>
    </div>
  );
}

// ── Таб-бар заявок (используется и в списке, и в детальном окне на всю ширину) ─
function ZayavkiTabBar({
  tab,
  onTab,
  license,
  setLicense,
}: {
  tab: TabKey;
  onTab: (t: TabKey) => void;
  license: string;
  setLicense: (v: string) => void;
}) {
  const licenseLabel = LICENSES.find((l) => l.value === license)?.label ?? LICENSES[1].label;
  return (
    <Tabs
      value={tab}
      onValueChange={(v) => onTab(v as TabKey)}
      variant="solid-light"
      size="l"
      equal
      aria-label="Тип заявок"
      className="w-full overflow-visible rounded-none border-x-0 border-t-0 [grid-auto-columns:minmax(0,1fr)]"
    >
      {/* Первый таб = ячейка-таб (.ds-tab) с дропдауном на ВСЮ ячейку (меню встык). */}
      <div role="tab" aria-selected={tab === "license"} className="ds-tab min-w-0 !p-0">
        <Dropdown
          align="start"
          aria-label="Выберите тип лицензии"
          className="ds-dropdown--tab flex h-full w-full min-w-0 items-center justify-center"
          trigger={({ open }) => (
            <button
              type="button"
              className="flex min-w-0 items-center gap-2 px-5"
              onClick={() => onTab("license")}
            >
              <span className="truncate">{licenseLabel}</span>
              <Chevron open={open} size={24} />
            </button>
          )}
          items={LICENSES.map((l) => ({
            value: l.value,
            label: l.label,
            icon: <LicenseDot color={l.dot} checked={l.value === license} />,
          }))}
          onSelect={(v) => {
            setLicense(v);
            onTab("license");
          }}
        />
      </div>
      <Tab value="employees">Заявки ваших сотрудников</Tab>
      <Tab value="processing">В обработке</Tab>
    </Tabs>
  );
}

export function ValidatorZayavkiScreen({ cabinet, current }: { cabinet: CabinetConfig; current: string }) {
  const [tab, setTab] = useState<TabKey>("license");
  const [license, setLicense] = useState("green");
  const [zayavki, setZayavki] = useState<Zayavka[]>([]);
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [procTab, setProcTab] = useState<ProcTab>("awaiting");
  const nextId = useRef(123);
  const pickRef = useRef(0);

  const opened = zayavki.find((z) => z.id === openedId) ?? null;
  const licenseList = zayavki.filter((z) => z.status === "new");
  const pausedList = zayavki.filter((z) => z.status === "paused");
  const awaitingList = zayavki.filter((z) => z.status === "signed");

  const requestZayavka = () => {
    const id = nextId.current++;
    // Каждый запрос — следующий документ из пула (структура одна, контент разный).
    const data = MOCK_DOCS[pickRef.current++ % MOCK_DOCS.length];
    setZayavki((zs) => [...zs, { id, number: `№ ${id}`, name: data.docType, status: "new", data }]);
  };
  const setStatus = (id: number, status: ZayavkaStatus, goProc: ProcTab) => {
    setZayavki((zs) => zs.map((z) => (z.id === id ? { ...z, status } : z)));
    setOpenedId(null);
    setTab("processing");
    setProcTab(goProc);
  };
  // Отклонить — заявка исчезает, возвращаемся к списку заявок (текущий таб).
  const rejectZayavka = (id: number) => {
    setZayavki((zs) => zs.filter((z) => z.id !== id));
    setOpenedId(null);
  };

  // Смена таба закрывает детальное окно.
  const changeTab = (t: TabKey) => { setOpenedId(null); setTab(t); };
  const tabBar = <ZayavkiTabBar tab={tab} onTab={changeTab} license={license} setLicense={setLicense} />;

  // Детальное окно: сайдбар скрыт, табы во всю ширину.
  if (opened) {
    return (
      <ZayavkaDetail
        tabBar={tabBar}
        zayavka={opened}
        onBack={() => setOpenedId(null)}
        onSign={() => setStatus(opened.id, "signed", "awaiting")}
        onPause={() => setStatus(opened.id, "paused", "paused")}
        onReject={() => rejectZayavka(opened.id)}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        {tabBar}
        {tab === "license" ? (
          <LicensePanel items={licenseList} onRequest={requestZayavka} onOpen={(z) => setOpenedId(z.id)} />
        ) : tab === "processing" ? (
          <ProcessingPanel
            paused={pausedList}
            awaiting={awaitingList}
            procTab={procTab}
            onProcTab={setProcTab}
            onOpen={(z) => setOpenedId(z.id)}
          />
        ) : (
          <div className="flex w-full flex-col gap-8 px-5 py-10 md:px-[50px]">
            <EmptyState title="Раздел в подготовке" className="py-16" />
          </div>
        )}
      </main>
    </div>
  );
}
