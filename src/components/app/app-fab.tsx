import Link from "next/link";

/**
 * AppFab — плавающая круглая кнопка «+» (FAB) мобильной апки MIDHUB.
 * Макет: экран «Кошельки» (node 7009:570655). Синий круг, белый плюс,
 * тень, правый нижний угол. `absolute` внутри контейнера экрана.
 */
export function AppFab({
  href,
  ariaLabel = "Добавить",
}: {
  href: string;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="absolute bottom-5 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-[#fff] shadow-lg transition-colors hover:bg-primary-hover"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
