import { create } from 'zustand';
import { type Champion } from '../data/champions';
import {CHAMPIONS} from "../data/championsData.ts";

type Clue = { field: keyof Champion; value: string | number; status: 'correct'|'close'|'wrong'; direction?: 'older' | 'newer' | null };
type Guess = { raw: string; clues: Clue[] };

type GameState = {
    answer: Champion;
    guesses: Guess[];
    reset: () => void;
    tryGuess: (name: string) => 'win' | 'continue' | 'invalid';
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
    const fields = ['name','gender','roles','species','resource','rangeType','regions','releaseYear'] as (keyof Champion)[];
    return fields.map((k) => {
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

export const useGameStore = create<GameState>((set, get) => ({
    answer: CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)],
    guesses: [],
    reset: () => set({
        answer: CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)],
        guesses: []
    }),
    tryGuess: (name: string) => {
        const cand = CHAMPIONS.find(c => c.name.toLowerCase() === name.trim().toLowerCase());
        if (!cand) return 'invalid';
        const clues = computeClues(get().answer, cand);
        const guesses = [{ raw: cand.name, clues }, ...get().guesses];
        const win = cand.name === get().answer.name;
        set({ guesses });
        if (win) return 'win';
        return 'continue';
    },
}));
