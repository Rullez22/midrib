/**
 * IosStatusBar — статус-бар iOS для превью мобильной апки MIDHUB.
 * Время (слева) · Dynamic Island (по центру) · сеть/Wi-Fi/батарея (справа).
 * Это chrome устройства (не часть контента) — живёт в MobileFrame поверх
 * splash, чтобы веб-превью выглядело как полноценное приложение.
 */
export function IosStatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex h-11 items-center justify-between px-[22px] pt-1 text-foreground select-none">
      {/* Время */}
      <span className="w-14 font-[500] text-[15px] leading-none tracking-[-0.01em] tabular-nums">
        9:41
      </span>

      {/* Dynamic Island */}
      <span
        aria-hidden
        className="absolute left-1/2 top-[7px] h-[26px] w-[95px] -translate-x-1/2 rounded-full bg-black"
      />

      {/* Индикаторы справа */}
      <div className="flex w-14 items-center justify-end gap-[6px]">
        <CellularIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

function CellularIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0.5" width="3" height="11.5" rx="1" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
      <path d="M8.5 2.2c2.6 0 5 1 6.8 2.7.3.3.3.7 0 1l-.8.8c-.3.3-.7.3-1 0A7.9 7.9 0 0 0 8.5 4.4 7.9 7.9 0 0 0 3 6.7c-.3.3-.7.3-1 0l-.8-.8c-.3-.3-.3-.7 0-1A9.7 9.7 0 0 1 8.5 2.2Z" />
      <path d="M8.5 6.1c1.5 0 3 .6 4.1 1.7.3.3.3.7 0 1l-.9.9c-.3.3-.6.3-.9 0a3.4 3.4 0 0 0-4.6 0c-.3.3-.6.3-.9 0l-.9-.9c-.3-.3-.3-.7 0-1A5.9 5.9 0 0 1 8.5 6.1Z" />
      <circle cx="8.5" cy="10.3" r="1.4" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden>
      <rect
        x="0.5"
        y="0.8"
        width="21"
        height="10.4"
        rx="3"
        stroke="currentColor"
        strokeOpacity="0.35"
      />
      <rect x="2" y="2.3" width="16" height="7.4" rx="1.6" fill="currentColor" />
      <path
        d="M23.5 4v4c1 -.3 1.5 -1 1.5 -2s-.5 -1.7 -1.5 -2Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}
