import localFont from "next/font/local";

/**
 * Articulat CF — основной шрифт MIDHUB.
 *
 * Дизайн-система использует ДВА начертания: Regular 400 и Medium 500.
 * Оба файла содержат кириллицу:
 *   - ArticulatCF-Regular.otf — "Articulat CF Normal", usWeightClass 400
 *   - ArticulatCF-Medium.ttf  — "Articulat CF Medium" (webfont), usWeightClass 500
 *
 * Подключается через CSS-переменную --font-articulat (см. globals.css / @theme).
 */
export const articulat = localFont({
  src: [
    { path: "../fonts/ArticulatCF-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/ArticulatCF-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-articulat",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});
