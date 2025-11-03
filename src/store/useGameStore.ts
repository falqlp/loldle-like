import { create } from 'zustand';
import { type Champion } from '../data/champions';
import { CHAMPIONS } from '../data/championsData.ts';

const STORAGE_KEY = 'loldle_like_stats_v1';

function safeLoadStats(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(n => typeof n === 'number' && isFinite(n))) {
      return parsed as number[];
    }
    return [];
  } catch {
    return [];
  }
}

function saveStats(stats: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore quota or privacy errors
  }
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  const s = nums.reduce((a, b) => a + b, 0);
  return Math.round((s / nums.length) * 100) / 100; // 2 decimals
}

type Clue = {
  field: keyof Champion;
  value: string | number;
  status: 'correct' | 'close' | 'wrong';
  direction?: 'older' | 'newer' | null;
};
type Guess = { raw: string; clues: Clue[] };

type GameState = {
  answer: Champion;
  guesses: Guess[];
  // Historique du nombre d'essais par partie gagnée
  stats: number[];
  // Moyenne arrondie à 2 décimales du nombre d'essais
  average: number;
  reset: () => void;
  tryGuess: (name: string) => 'win' | 'continue' | 'invalid' | 'duplicate';
  // Enregistre une victoire avec le nombre d'essais effectués
  recordWin: (attempts: number) => void;
};

function arraysEqualIgnoreOrder<T extends string>(a: T[], b: T[]) {
  if (a.length !== b.length) return false;
  const as = [...a].sort();
  const bs = [...b].sort();
  return as.every((v, i) => v === bs[i]);
}

function intersectionCount<T extends string>(a: T[], b: T[]) {
  const setB = new Set(b);
  return a.filter(x => setB.has(x)).length;
}

type ArrayFields = 'roles' | 'species' | 'regions';
type NameField = 'name';
type YearField = 'releaseYear';
type ScalarFields = Exclude<keyof Champion, ArrayFields | NameField | YearField>;

const arrayFields: ArrayFields[] = ['roles', 'species', 'regions'];
function isArrayField(k: keyof Champion): k is ArrayFields {
  return (arrayFields as readonly string[]).includes(k as string);
}
function isNameField(k: keyof Champion): k is NameField {
  return k === 'name';
}
function isYearField(k: keyof Champion): k is YearField {
  return k === 'releaseYear';
}

function computeClues(ans: Champion, cand: Champion): Clue[] {
  const fields = [
    'name',
    'gender',
    'roles',
    'species',
    'resource',
    'rangeType',
    'regions',
    'releaseYear',
  ] as (keyof Champion)[];
  return fields.map(k => {
    if (isNameField(k)) {
      return { field: k, value: cand.name, status: cand.name === ans.name ? 'correct' : 'wrong' };
    }

    if (isYearField(k)) {
      const av = ans.releaseYear;
      const cv = cand.releaseYear;
      if (cv === av) return { field: k, value: cv, status: 'correct', direction: null };
      const diff = av - cv;
      const direction: 'older' | 'newer' = diff > 0 ? 'newer' : 'older';
      return { field: k, value: cv, status: 'wrong', direction };
    }

    if (isArrayField(k)) {
      const aArr = ans[k];
      const cArr = cand[k];
      const value = (cArr ?? []).join(', ');
      if (!Array.isArray(aArr) || !Array.isArray(cArr)) {
        return { field: k, value, status: 'wrong' };
      }
      if (arraysEqualIgnoreOrder(aArr, cArr)) {
        return { field: k, value, status: 'correct' };
      }
      const inter = intersectionCount(aArr, cArr);
      return { field: k, value, status: inter > 0 ? 'close' : 'wrong' };
    }

    // Champs scalaires simples (strings)
    const kk = k as ScalarFields;
    const av = ans[kk];
    const cv = cand[kk];
    return { field: k, value: cv, status: cv === av ? 'correct' : 'wrong' };
  });
}

const initialStats = safeLoadStats();

export const useGameStore = create<GameState>((set, get) => ({
  answer: CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)],
  guesses: [],
  stats: initialStats,
  average: avg(initialStats),
  reset: () =>
    set({
      answer: CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)],
      guesses: [],
    }),
  recordWin: (attempts: number) => {
    const next = [...get().stats, attempts];
    saveStats(next);
    set({ stats: next, average: avg(next) });
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
    if (win) {
      // attempts = number of guesses for this round
      get().recordWin(guesses.length);
      return 'win';
    }
    return 'continue';
  },
}));
