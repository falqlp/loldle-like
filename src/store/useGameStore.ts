import { create } from 'zustand';
import { CHAMPIONS } from '../data/championsData.ts';
import type { Mode, GameState } from './types';
import { getUTCDateString } from './utils/date';
import { dailyIndexFor } from './utils/hash';
import { avg } from './utils/stats';
import { buildShareGridRows } from './utils/share';
import i18n from '../i18n';
import { computeClues } from './utils/clues';
import { safeLoadV2, saveV2, type PersistedV2 } from './utils/storage';
import { suggestFromHistory } from './utils/solver.ts';

const persisted = safeLoadV2();

function makeDailyAnswer(dateStr: string) {
  return CHAMPIONS[dailyIndexFor(dateStr, CHAMPIONS.length)];
}

export const useGameStore = create<GameState>((set, get) => {
  const todayUTC = getUTCDateString();
  const initialMode: Mode = 'daily';
  const initialAnswer = makeDailyAnswer(todayUTC);
  const initialStats = persisted.stats;
  const initialAverage = {
    training: avg(initialStats.training),
    daily: avg(initialStats.daily),
  };
  // Hydrate initial guesses for Daily from storage so F5/refresh keeps history
  const initialGuesses =
    initialMode === 'daily' && persisted.dailyGuessesByDate?.[todayUTC]
      ? [...persisted.dailyGuessesByDate[todayUTC]].reverse()
      : [];

  return {
    mode: initialMode,
    answer: initialAnswer,
    guesses: initialGuesses,
    stats: initialStats,
    average: initialAverage,
    dailyCompletedDateUTC: persisted.dailyCompletedDateUTC,
    dailyGuessesByDate: persisted.dailyGuessesByDate || {},

    setMode: (m: Mode) => {
      const dateStr = getUTCDateString();
      const answer =
        m === 'daily'
          ? makeDailyAnswer(dateStr)
          : CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
      if (m === 'daily') {
        const st = get();
        const today = st.dailyGuessesByDate[dateStr];
        const guesses = today ? [...today].reverse() : [];
        set({ mode: m, answer, guesses });
      } else {
        set({ mode: m, answer, guesses: [] });
      }
    },

    buildDailyShareText: () => {
      const st = get();
      const dateStr = getUTCDateString();
      const todayGuesses = st.dailyGuessesByDate[dateStr] ?? [...st.guesses].reverse();
      const tries =
        todayGuesses.findIndex(g =>
          g.clues.some(c => c.field === 'name' && c.status === 'correct'),
        ) + 1;
      const attempts = tries > 0 ? tries : todayGuesses.length;
      const gridRows = buildShareGridRows(todayGuesses.slice(0, attempts));
      const url = typeof window !== 'undefined' ? window.location.href : 'https://example.com';
      const attemptsLabel = i18n.t(attempts === 1 ? 'attempt_one' : 'attempt_other');
      const header = i18n.t('share_header', { attempts, attemptsLabel });
      return [header, ...gridRows, '', url].join('\n');
    },

    reset: () => {
      const st = get();
      if (st.mode === 'daily') {
        // In Daily, keep the same day's answer; clear in-memory and persisted guesses for today
        const dateStr = getUTCDateString();
        const nextDaily = { ...st.dailyGuessesByDate };
        delete nextDaily[dateStr];
        const nextPersist: PersistedV2 = {
          stats: st.stats,
          dailyCompletedDateUTC: st.dailyCompletedDateUTC,
          dailyGuessesByDate: nextDaily,
        };
        saveV2(nextPersist);
        set({ guesses: [], dailyGuessesByDate: nextDaily });
      } else {
        set({ answer: CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)], guesses: [] });
      }
    },

    recordWin: (attempts: number) => {
      const st = get();
      const dateStr = getUTCDateString();
      // Prepare next stats copy
      const nextStats = { training: [...st.stats.training], daily: [...st.stats.daily] };
      if (st.mode === 'daily') {
        // Only the first win per UTC day counts
        if (st.dailyCompletedDateUTC === dateStr) {
          // already completed today: do not add another record
          return;
        }
        nextStats.daily.push(attempts);
        const nextPersist: PersistedV2 = {
          stats: nextStats,
          dailyCompletedDateUTC: dateStr,
          dailyGuessesByDate: st.dailyGuessesByDate,
        };
        saveV2(nextPersist);
        set({
          stats: nextStats,
          average: { training: avg(nextStats.training), daily: avg(nextStats.daily) },
          dailyCompletedDateUTC: dateStr,
        });
      } else {
        nextStats.training.push(attempts);
        const nextPersist: PersistedV2 = {
          stats: nextStats,
          dailyCompletedDateUTC: st.dailyCompletedDateUTC,
          dailyGuessesByDate: st.dailyGuessesByDate,
        };
        saveV2(nextPersist);
        set({
          stats: nextStats,
          average: { training: avg(nextStats.training), daily: avg(nextStats.daily) },
        });
      }
    },

    tryGuess: (name: string) => {
      const cand = CHAMPIONS.find(c => c.name.toLowerCase() === name.trim().toLowerCase());
      if (!cand) return 'invalid';

      // Prevent duplicate guesses (case-insensitive)
      const already = get().guesses.some(g => g.raw.toLowerCase() === cand.name.toLowerCase());
      if (already) return 'duplicate';

      const clues = computeClues(get().answer, cand);
      const guesses = [{ raw: cand.name, clues }, ...get().guesses];
      const win = cand.name === get().answer.name;
      set({ guesses });

      // If daily, persist today's guesses
      const st = get();
      if (st.mode === 'daily') {
        const dateStr = getUTCDateString();
        const ordered = [...guesses].reverse(); // oldest -> newest
        const nextDaily = { ...st.dailyGuessesByDate, [dateStr]: ordered };
        const nextPersist: PersistedV2 = {
          stats: st.stats,
          dailyCompletedDateUTC: st.dailyCompletedDateUTC,
          dailyGuessesByDate: nextDaily,
        };
        saveV2(nextPersist);
        set({ dailyGuessesByDate: nextDaily });
      }

      if (win) {
        get().recordWin(guesses.length);
        return 'win';
      }
      return 'continue';
    },
    suggestNextGuess: () => {
      const st = get();
      const { suggestion } = suggestFromHistory(st.guesses);
      return suggestion; // Champion | null
    },
  };
});
