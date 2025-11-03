export function avg(nums: number[]) {
  if (!nums.length) return 0;
  const s = nums.reduce((a, b) => a + b, 0);
  return Math.round((s / nums.length) * 100) / 100; // 2 decimals
}
