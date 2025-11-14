import type { Champion } from '../data/champions';

export type Mode = 'training' | 'daily';

export type Clue = {
  field: keyof Champion;
  value: string | number;
  status: 'correct' | 'close' | 'wrong';
  direction?: 'older' | 'newer' | null;
};

export type Guess = { raw: string; clues: Clue[] };

export type GameState = {
  mode: Mode;
  answer: Champion;
  guesses: Guess[];
  stats: { training: number[]; daily: number[] };
  average: { training: number; daily: number };
  dailyCompletedDateUTC: string | null;
  dailyGuessesByDate: Record<string, Guess[]>;
  setMode: (m: Mode) => void;
  reset: () => void;
  tryGuess: (name: string) => 'win' | 'continue' | 'invalid' | 'duplicate';
  recordWin: (attempts: number) => void;
  buildDailyShareText: () => string;
  suggestNextGuess: () => Champion | null;
};
