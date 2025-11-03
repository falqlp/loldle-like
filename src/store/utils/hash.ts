export function hashStringToInt(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function dailyIndexFor(dateStr: string, total: number): number {
  const h = hashStringToInt(dateStr);
  return total > 0 ? h % total : 0;
}
