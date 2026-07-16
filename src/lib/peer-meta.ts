/**
 * peerMeta — реквизиты пайщика (адрес / страна / дата) по его имени.
 *
 * В таблицах пайщиков адрес, страна и дата были захардкожены в разметке —
 * `5c243af... 07db8`, `ENG`, `12.07.2020` в каждой строке. Менялось только ФИО,
 * и список читался как копипаста одной строки.
 *
 * Значения выводятся из имени хэшем — детерминированно, без Math.random и
 * new Date(): они рендерятся и на сервере, и на клиенте, а расхождение дало бы
 * hydration mismatch. Одно имя всегда даёт одни и те же реквизиты, поэтому
 * пайщик выглядит одинаково на всех экранах.
 */

/** ISO-3 коды под страны регистрации из reg-flow (COUNTRIES). */
const COUNTRY_CODES = ["RUS", "BGR", "DEU", "GRC", "AUT", "BEL", "ENG", "FRA", "ESP", "ITA", "NLD", "POL"];

/** FNV-1a — короткий стабильный хэш строки. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const hex = (n: number, len: number) => n.toString(16).padStart(len, "0").slice(-len);

export interface PeerMeta {
  /** Адрес кошелька в том же виде, что был в вёрстке: «5c243af... 07db8». */
  address: string;
  /** Код страны: «RUS». */
  country: string;
  /** Дата заявки: «12.07.2020». */
  date: string;
}

export function peerMeta(name: string): PeerMeta {
  const h = hash(name);
  const h2 = hash(`${name}·addr`);
  const h3 = hash(`${name}·date`);

  // 1–28 число: 28 — чтобы не выдумывать 30/31 февраля.
  const day = (h3 % 28) + 1;
  const month = ((h3 >>> 5) % 12) + 1;
  const year = 2020 + ((h3 >>> 9) % 5);

  return {
    address: `${hex(h, 7)}... ${hex(h2, 5)}`,
    country: COUNTRY_CODES[h % COUNTRY_CODES.length],
    date: `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`,
  };
}
