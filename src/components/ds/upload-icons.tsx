/**
 * MIDHUB — Upload icons (для <UploadV1> / <UploadV2>).
 * Монохром 24×24, заливка/обводка = currentColor (тонируется состоянием контрола).
 * Источник: Figma «UI Контролы» / Upload var 1 (1508:62335), Upload var 2 (1520:62781).
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Стрелка вверх в лоток — «загрузить / перетащить файл» (Icons / Download-24). */
export function UploadArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        d="M12 15.5V4M12 4 8 8M12 4l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 14v3.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Плюс — пустая плитка загрузки. */
export function UploadPlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Карандаш — редактировать прикреплённый файл. */
export function UploadEditIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        d="M14.06 6.94l3 3M4 20l.86-3.46a2 2 0 0 1 .53-.92l9.6-9.6a1.5 1.5 0 0 1 2.12 0l.87.87a1.5 1.5 0 0 1 0 2.12l-9.6 9.6a2 2 0 0 1-.92.53L4 20z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Корзина — удалить файл. */
export function UploadDeleteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        d="M4 7h16M9.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V7M6.5 7l.8 11.2A2 2 0 0 0 9.3 20h5.4a2 2 0 0 0 2-1.8L17.5 7M10 11v5M14 11v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Пауза — приостановить загрузку. */
export function UploadPauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <rect x="8" y="6" width="2.6" height="12" rx="1.3" fill="currentColor" />
      <rect x="13.4" y="6" width="2.6" height="12" rx="1.3" fill="currentColor" />
    </svg>
  );
}

/** Спиннер — состояние загрузки плитки (Icons / Loader-40). Крутится через CSS. */
export function UploadLoaderIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
