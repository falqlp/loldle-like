import type { Guess } from '../types';

// v2 storage with per-mode stats and daily completion tracking
export const STORAGE_KEY_V2 = 'loldle_like_stats_v2';

export type PersistedV2 = {
  stats: { training: number[]; daily: number[] };
  dailyCompletedDateUTC: string | null;
  dailyGuessesByDate: Record<string, Guess[]>; // store all daily guesses per UTC date
};

export function safeLoadV2(): PersistedV2 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (!raw)
      return {
        stats: { training: [], daily: [] },
        dailyCompletedDateUTC: null,
        dailyGuessesByDate: {},
      };
    const parsed = JSON.parse(raw);
    const t = Array.isArray(parsed?.stats?.training) ? parsed.stats.training : [];
    const d = Array.isArray(parsed?.stats?.daily) ? parsed.stats.daily : [];
    const dc =
      typeof parsed?.dailyCompletedDateUTC === 'string' || parsed?.dailyCompletedDateUTC === null
        ? parsed.dailyCompletedDateUTC
        : null;
    const dg =
      parsed && typeof parsed.dailyGuessesByDate === 'object' && parsed.dailyGuessesByDate !== null
        ? parsed.dailyGuessesByDate
        : {};
    return {
      stats: {
        training: t.filter((n: unknown) => typeof n === 'number' && isFinite(n)) as number[],
        daily: d.filter((n: unknown) => typeof n === 'number' && isFinite(n)) as number[],
      },
      dailyCompletedDateUTC: dc,
      dailyGuessesByDate: dg as Record<string, Guess[]>,
    };
  } catch {
    return {
      stats: { training: [], daily: [] },
      dailyCompletedDateUTC: null,
      dailyGuessesByDate: {},
    };
  }
}

export function saveV2(data: PersistedV2) {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(data));
  } catch {
    // ignore quota or privacy errors
  }
}
