/**
 * Иконки мобильной апки MIDHUB (24×24, currentColor).
 * Инлайн-SVG в стиле MIDHUB (stroke 1.8, round). Живут на уровне апки —
 * DS иконки встроены в свои компоненты, отдельного icon-пакета в DS нет.
 */
type IconProps = React.SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function QrIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M20 14v.01M14 20h.01M17 20h.01M20 17v3" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 3.5V16H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />
    </svg>
  );
}

export function DocIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-6Z" />
      <path d="M13 3v6h6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function AvatarPersonIcon(props: IconProps) {
  // Заполненный силуэт (аватар-заглушка), красится через currentColor.
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5v.5H4V20Z" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s6-5.4 6-10.2A6 6 0 1 0 6 10.8C6 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.8" r="2.2" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function NewsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5" width="16" height="14" rx="1.5" />
      <path d="M7.5 9h6M7.5 12.5h6M7.5 16h4M16.5 9h.5v7" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="17" cy="6" r="2.5" />
      <circle cx="17" cy="18" r="2.5" />
      <path d="m8.2 10.8 6.6-3.6M8.2 13.2l6.6 3.6" />
    </svg>
  );
}

export function QuestionIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.8.3-1.2.8-1.2 1.6v.3" />
      <circle cx="11.5" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BankIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 9.5 12 4l8 5.5M5 10v8M9 10v8M15 10v8M19 10v8M3.5 20.5h17" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </svg>
  );
}

export function WalletGlyphIcon(props: IconProps) {
  // Крупный кошелёк для empty-state (заливка).
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H16a2 2 0 0 1 2 2v1H7a1 1 0 0 0 0 2h12a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <circle cx="16.5" cy="13.5" r="1.3" fill="#fff" />
    </svg>
  );
}

export function SwapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 9h13l-3.5-3.5M20 15H7l3.5 3.5" />
    </svg>
  );
}

/* ── Нижняя навигация ─────────────────────────────────────────── */

export function NavHomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M9 9h.01M8.5 13.5h7M8.5 16h4.5" />
    </svg>
  );
}

export function NavDocumentsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 3h6l5 5v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M15 3v5h5" />
      <path d="M5 7v13a2 2 0 0 0 2 2h9" opacity="0.5" />
    </svg>
  );
}

export function NavWalletIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 9h18" />
      <circle cx="16.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
