"use client";

/**
 * Демки LeftMenu (композит «левое меню / сайдбар») для витрины /ds.
 * Воспроизводят все 11 фреймов Figma «UI фичи» / menu:
 *   2115:233056 · 1118:96985 · 1118:96768 · 1272:133860 · 1368:162112 ·
 *   1684:238673 · 1116:98990 · 1586:245446 · 1676:234159 ·
 *   1116:98961 · 1116:98967.
 */
import { useState } from "react";
import {
  LeftMenu,
  MenuRail,
  MenuBadge,
  MenuPanel,
  MenuProfileCard,
  MenuButton,
  MenuButtonRow,
  MenuNavItem,
  MenuDivider,
  MenuFooter,
  MenuIcon,
  Text,
  type MenuBadgeColor,
} from "@/components/ds";

/* Аватар-плейсхолдер (без внешних зависимостей) — градиентный кружок. */
const AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3996fc"/><stop offset="1" stop-color="#512da8"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="25" r="11" fill="#ffffff" opacity="0.9"/><path d="M12 60c0-12 9-19 20-19s20 7 20 19z" fill="#ffffff" opacity="0.9"/></svg>`,
  );

/* Рабочие пространства для рейки (цвета 1:1 из Figma). */
const WORKSPACES: { label: string; color: MenuBadgeColor }[] = [
  { label: "1", color: "red" },
  { label: "2", color: "orange" },
  { label: "3", color: "yellow" },
  { label: "4", color: "green" },
  { label: "5", color: "blue" },
  { label: "6", color: "blue-strong" },
  { label: "7", color: "purple" },
];

/* ── Рейка с цветными бейджами (переиспользуется в демках) ──────── */
function Rail({
  brand,
  active,
  height = "848px",
}: {
  brand?: "kp" | "logo";
  active?: string;
  height?: string;
}) {
  const [sel, setSel] = useState(active ?? "");
  return (
    <MenuRail
      height={height}
      footer={<MenuFooter>Admin</MenuFooter>}
      brand={
        brand === "kp" ? (
          <MenuBadge active={sel === "kp"} onClick={() => setSel("kp")}>
            КП
          </MenuBadge>
        ) : brand === "logo" ? (
          <MenuBadge brand aria-label="Главная" onClick={() => setSel("logo")}>
            <MenuIcon.Brand />
          </MenuBadge>
        ) : undefined
      }
    >
      {WORKSPACES.map((w) => (
        <MenuBadge
          key={w.label}
          color={w.color}
          active={sel === w.label}
          onClick={() => setSel(w.label)}
        >
          {w.label}
        </MenuBadge>
      ))}
    </MenuRail>
  );
}

/* ── Шапка панели: профиль + роль + Деятельность + иконные ──────── */
function PanelHeader() {
  return (
    <>
      <MenuProfileCard name="Immatra" meta="150 пайщиков" />
      <MenuButton variant="role" trailingIcon={<MenuIcon.ChevronDown />}>
        Пред. правления
      </MenuButton>
      <MenuButton icon={<MenuIcon.Hierarchy />}>Деятельность</MenuButton>
      <MenuButtonRow>
        <MenuButton variant="icon" icon={<MenuIcon.Wallet />} aria-label="Финансы" />
        <MenuButton
          variant="icon"
          icon={<MenuIcon.ClipboardCheck />}
          aria-label="Проверка"
        />
      </MenuButtonRow>
    </>
  );
}

/* ── Список навигации панели ────────────────────────────────────── */
function PanelNav({ active = "Реферальные" }: { active?: string }) {
  const [sel, setSel] = useState(active);
  const item = (label: string, icon: React.ReactNode) => (
    <MenuNavItem
      icon={icon}
      active={sel === label}
      onClick={() => setSel(label)}
    >
      {label}
    </MenuNavItem>
  );
  return (
    <>
      {item("Пайщики", <MenuIcon.Users />)}
      {item("Партнеры", <MenuIcon.Partners />)}
      <MenuDivider />
      {item("Заявки", <MenuIcon.DocText />)}
      {item("Обработанные", <MenuIcon.DocStack />)}
      {item("Реферальные", <MenuIcon.Megaphone />)}
      {item("Шаблоны", <MenuIcon.DocGrid />)}
    </>
  );
}

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Text variant="caption-up" tone="subtle">{title}</Text>
      {children}
    </div>
  );
}

export function LeftMenuDemos() {
  return (
    <div className="flex flex-wrap items-start gap-8 rounded-xl border border-border p-5">
      {/* 11 + 10 — полный двухколоночный сайдбар */}
      <Frame title="LeftMenu — полный (лого)">
        <LeftMenu>
          <Rail brand="logo" height="817px" />
          <MenuPanel
            height="817px"
            footer={<MenuFooter avatar={AVATAR}>Пред. правления</MenuFooter>}
          >
            <PanelHeader />
            <MenuDivider />
            <PanelNav />
          </MenuPanel>
        </LeftMenu>
      </Frame>

      <Frame title="LeftMenu — раздел (КП)">
        <LeftMenu>
          <Rail brand="kp" active="kp" height="769px" />
          <MenuPanel
            height="769px"
            footer={<MenuFooter avatar={AVATAR}>Пред. правления</MenuFooter>}
          >
            <MenuNavItem icon={<MenuIcon.Megaphone />} active>
              Реферальная
            </MenuNavItem>
          </MenuPanel>
        </LeftMenu>
      </Frame>

      {/* 1 — menu 2: панель-шапка */}
      <Frame title="MenuPanel — шапка профиля">
        <MenuPanel
          height="776px"
          footer={<MenuFooter avatar={AVATAR}>Пред. правления</MenuFooter>}
        >
          <PanelHeader />
        </MenuPanel>
      </Frame>

      {/* 9 — menu 1: панель с активным пунктом */}
      <Frame title="MenuPanel — активный пункт">
        <MenuPanel
          height="776px"
          footer={<MenuFooter avatar={AVATAR}>Пред. правления</MenuFooter>}
        >
          <MenuNavItem icon={<MenuIcon.Megaphone />} active>
            Реферальная
          </MenuNavItem>
        </MenuPanel>
      </Frame>

      {/* 6 / 8 / 7 — рейки */}
      <Frame title="MenuRail — КП">
        <Rail brand="kp" active="kp" />
      </Frame>
      <Frame title="MenuRail — лого">
        <Rail brand="logo" />
      </Frame>
      <Frame title="MenuRail — без шапки">
        <Rail />
      </Frame>

      {/* 3 — шапка без рамки */}
      <Frame title="Шапка панели">
        <div className="w-[145px]">
          <PanelHeader />
        </div>
      </Frame>

      {/* 2 — профиль-карточка отдельно */}
      <Frame title="MenuProfileCard">
        <div className="w-[145px]">
          <MenuProfileCard name="Immatra" meta="150 пайщиков" />
        </div>
      </Frame>

      {/* 5 / 4 — футер-ячейки */}
      <Frame title="MenuFooter — пользователь">
        <div className="w-[161px] border border-border">
          <MenuFooter avatar={AVATAR}>Пред. правления</MenuFooter>
        </div>
      </Frame>
      <Frame title="MenuFooter — Admin">
        <div className="w-[60px] border border-border">
          <MenuFooter>Admin</MenuFooter>
        </div>
      </Frame>
    </div>
  );
}
