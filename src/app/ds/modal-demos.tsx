"use client";

/**
 * Демки Modal (попапы) для витрины /ds.
 * Источник: Figma «UI фичи» / попапы (134:26158/26159, 135:26149, 206:0, 584:0, 748:0).
 * Modal — новый компонент; контент — reuse Button, Badge, Checkbox, Item.
 */
import { useState } from "react";
import { Modal, Button, Badge, Checkbox, Item } from "@/components/ds";

type Which = null | "confirm" | "attention" | "delete" | "blockchain" | "members" | "roles";

export function ModalDemos() {
  const [open, setOpen] = useState<Which>(null);
  const close = () => setOpen(null);
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => setOpen("confirm")}>Подтвердить действие</Button>
      <Button variant="secondary" onClick={() => setOpen("attention")}>Обратите внимание</Button>
      <Button variant="secondary" onClick={() => setOpen("delete")}>Удаление</Button>
      <Button variant="secondary" onClick={() => setOpen("blockchain")}>Блокчейн</Button>
      <Button variant="secondary" onClick={() => setOpen("members")}>Участники</Button>
      <Button variant="secondary" onClick={() => setOpen("roles")}>Роли</Button>

      <Modal open={open === "confirm"} onClose={close} size="m" title="Подтвердить действие?"
        footer={<Button fullWidth onClick={close}>Подтвердить действие</Button>}>
        <p className="text-center">Это действие изменит важную информацию в системе.</p>
      </Modal>

      <Modal open={open === "attention"} onClose={close} size="m" title="Обратите внимание"
        footer={<><Button variant="negative-sec" onClick={close}>Отмена</Button><Button onClick={close}>Продолжить</Button></>}>
        <p className="text-center">
          Для предотвращения утечки персональных данных доступ к ним отслеживается. Номер вашей
          лицензии, дата и набор данных, которые вы просмотрите, будут зафиксированы.
        </p>
        <label className="mt-4 flex items-center justify-center gap-2">
          <Checkbox size="xs" /> <span className="ds-p3 text-foreground">Больше не показывать это сообщение</span>
        </label>
      </Modal>

      <Modal open={open === "delete"} onClose={close} size="s" title="Удаление полей"
        footer={<><Button variant="secondary" onClick={close}>Нет</Button><Button variant="negative" onClick={close}>Да</Button></>}>
        <p className="text-center">Вы уверены, что хотите удалить выбранные поля? Это действие необратимо.</p>
      </Modal>

      <Modal open={open === "blockchain"} onClose={close} size="m" title="Подтвердить ваши действия в блокчейне?"
        footer={<Button fullWidth onClick={close}>Подтвердить действие</Button>}>
        <div className="flex flex-col gap-3 text-left">
          <p className="text-center">Валидация сформированного документа происходит на платформе MIDHUB. Ваши действия и дата записи валидации в блокчейн.</p>
          <div className="flex items-center justify-between rounded-[4px] border border-border px-4 py-3">
            <span className="ds-p3 text-foreground-subtle">Отправка контракта</span>
            <span className="ds-p3 text-foreground">0.0001 ETH</span>
          </div>
          <div className="flex items-center justify-between rounded-[4px] border border-border px-4 py-3">
            <span className="ds-p3 text-foreground-subtle">Статус</span>
            <Badge color="green">Готов к отправке</Badge>
          </div>
        </div>
      </Modal>

      <Modal open={open === "members"} onClose={close} size="m" title="Участники"
        footer={<Button fullWidth onClick={close}>Готово</Button>}>
        <div className="flex flex-col gap-2 text-left">
          {[["Максим Цекало", "20%"], ["Марат Зурин", "30%"], ["Антон Анопов", "50%"]].map(([n, v]) => (
            <Item key={n} trailing={<span className="ds-p3 text-foreground">{v}</span>}>
              <span className="flex flex-col">
                <span className="ds-p3 text-foreground">{n}</span>
                <span className="ds-caption text-foreground-subtle">Передаёт свою долю участникам</span>
              </span>
            </Item>
          ))}
        </div>
      </Modal>

      <Modal open={open === "roles"} onClose={close} size="m" title="Роли"
        footer={<Button fullWidth onClick={close}>Готово</Button>}>
        <div className="flex flex-col gap-2 text-left">
          {[["Председатель правления", "Антонов Илья"], ["Председатель совета", "Самик Михаил"], ["Член совета", "Андреев Андрей"]].map(([r, n]) => (
            <Item key={r} trailing={<Badge color="green">Активна</Badge>}>
              <div className="grid grid-cols-2 items-center">
                <span className="ds-p3 text-foreground-subtle">{r}</span>
                <span className="ds-p3 text-foreground">{n}</span>
              </div>
            </Item>
          ))}
        </div>
      </Modal>
    </div>
  );
}
