import { create } from 'zustand';
import { type Champion } from '../data/champions';
import {CHAMPIONS} from "../data/championsData.ts";

type Clue = { field: keyof Champion; value: string | number; status: 'correct'|'close'|'wrong'; direction?: 'older' | 'newer' | null };
type Guess = { raw: string; clues: Clue[] };

type GameState = {
    answer: Champion;
    guesses: Guess[];
    maxGuesses: number;
    reset: () => void;
    tryGuess: (name: string) => 'win' | 'continue' | 'invalid' | 'lose';
};

function arraysEqualIgnoreOrder<T>(a: T[], b: T[]) {
    if (a.length !== b.length) return false;
    const as = [...a].sort();
    const bs = [...b].sort();
    return as.every((v, i) => v === bs[i]);
}

function intersectionCount<T>(a: T[], b: T[]) {
    const setB = new Set(b as T[]);
    return (a as T[]).filter(x => setB.has(x)).length;
}

function computeClues(ans: Champion, cand: Champion): Clue[] {
    const fields = ['name','gender','roles','species','resource','rangeType','regions','releaseYear'] as (keyof Champion)[];
    return fields.map((k) => {
        const av = ans[k] as any;
        const cv = cand[k] as any;

        if (k === 'name') {
            return { field: k, value: cand.name, status: cand.name === ans.name ? 'correct' : 'wrong' };
        }

        if (k === 'releaseYear') {
            if (cv === av) return { field: k, value: cv, status: 'correct', direction: null };
            const diff = Number(av) - Number(cv);
            const direction = diff > 0 ? 'newer' : 'older'; // relative to the candidate year
            // « close » si à ±1 an
            const close = Math.abs(diff) <= 1;
            return { field: k, value: cv, status: close ? 'close' : 'wrong', direction };
        }

        if (k === 'roles' || k === 'species' || k === 'regions') {
            const aArr = av as string[];
            const cArr = cv as string[];
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

        // Champs scalaires simples
        return { field: k, value: String(cv), status: cv === av ? 'correct' : 'wrong' };
    });
}

export const useGameStore = create<GameState>((set, get) => ({
    answer: CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)],
    guesses: [],
    maxGuesses: 6,
    reset: () => set({
        answer: CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)],
        guesses: []
    }),
    tryGuess: (name: string) => {
        const cand = CHAMPIONS.find(c => c.name.toLowerCase() === name.trim().toLowerCase());
        if (!cand) return 'invalid';
        const clues = computeClues(get().answer, cand);
        const guesses = [...get().guesses, { raw: cand.name, clues }];
        const win = cand.name === get().answer.name;
        set({ guesses });
        if (win) return 'win';
        if (guesses.length >= get().maxGuesses) return 'lose';
        return 'continue';
    },
}));
