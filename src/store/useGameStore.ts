import { create } from 'zustand';
import { CHAMPIONS, type Champion } from '../data/champions';

type Clue = { field: keyof Champion; value: string | number; status: 'correct'|'close'|'wrong' };
type Guess = { raw: string; clues: Clue[] };

type GameState = {
    answer: Champion;
    guesses: Guess[];
    maxGuesses: number;
    reset: () => void;
    tryGuess: (name: string) => 'win' | 'continue' | 'invalid' | 'lose';
};

function computeClues(ans: Champion, cand: Champion): Clue[] {
    return (['name','role','region','releaseYear'] as (keyof Champion)[]).map((k) => {
        const av = ans[k], cv = cand[k];
        if (k === 'name') {
            return { field: k, value: cand.name, status: cand.name === ans.name ? 'correct' : 'wrong' };
        }
        if (k === 'releaseYear') {
            if (cv === av) return { field: k, value: cv, status: 'correct' };
            // “close” si à ±1 an pour l’exemple
            return { field: k, value: cv, status: Math.abs(Number(cv) - Number(av)) <= 1 ? 'close' : 'wrong' };
        }
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
