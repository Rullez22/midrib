/**
 * QrMock — декоративный QR-код для превью мобильной апки MIDHUB.
 * Настоящий генератор QR не подключаем (в проекте нет зависимости);
 * рисуем детерминированный паттерн с тремя «глазами» — визуально
 * неотличим от QR для мокапа. Реальные данные — в адресе рядом.
 */
const N = 25; // модулей в ряду

/** Три «глаза» (finder pattern) 7×7 по углам. */
function isFinder(x: number, y: number): boolean {
  const inBox = (ox: number, oy: number) =>
    x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
  return inBox(0, 0) || inBox(N - 7, 0) || inBox(0, N - 7);
}

/** Заливка модуля «глаза»: рамка (кольцо) + центр 3×3. */
function finderFilled(x: number, y: number): boolean {
  const lx = x < 7 ? x : x - (N - 7);
  const ly = y < 7 ? y : y - (N - 7);
  const ring = lx === 0 || lx === 6 || ly === 0 || ly === 6;
  const center = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
  return ring || center;
}

/** Детерминированный «шум» данных (~45% плотность). */
function dataFilled(x: number, y: number): boolean {
  return (x * 13 + y * 7 + x * y * 3) % 5 < 2;
}

export function QrMock({ size = 168 }: { size?: number }) {
  const cell = size / N;
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const filled = isFinder(x, y)
        ? finderFilled(x, y)
        : dataFilled(x, y);
      if (!filled) continue;
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x * cell}
          y={y * cell}
          width={cell}
          height={cell}
        />,
      );
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="QR-код"
      fill="#000000"
    >
      {rects}
    </svg>
  );
}
